import "server-only";
import type {
  GroupId,
  GroupStanding,
  Match,
  MatchStatus,
  Scorer,
  StandingRow,
  Stage,
  Team,
} from "./types";
import { nameES } from "./team-names-es";

/**
 * Integración con la API abierta worldcup26.ir
 * (repo: github.com/rezarahiminia/worldcup2026 — licencia ISC, sin API key).
 *
 * Es específica del Mundial 2026: trae equipos, partidos (con goleadores),
 * sedes y standings (PJ/G/E/P/Pts/GF/GC/DG), y se actualiza EN VIVO durante
 * el torneo (11 jun – 19 jul 2026).
 *
 * Fuente principal por defecto. Si el servidor no responde, la capa de datos
 * cae al mock automáticamente — el sitio nunca se rompe.
 *
 * Config opcional (.env.local):
 *   WORLDCUP26_BASE=https://worldcup26.ir   (por defecto)
 *   DATA_SOURCE=mock                          (fuerza el mock, ignora esta API)
 */

const BASE = process.env.WORLDCUP26_BASE ?? "https://worldcup26.ir";
const REVALIDATE = 60; // cache 60s; refresca marcadores en vivo con frecuencia
const TIMEOUT_MS = 6000; // por intento
const ATTEMPTS = 3; // reintentos ante fallos intermitentes del host

export function isWorldcup26Enabled(): boolean {
  return process.env.DATA_SOURCE !== "mock";
}

async function apiGet<T>(path: string): Promise<T | null> {
  // El host falla de forma intermitente (ECONNRESET, página de error HTML).
  // Reintenta un par de veces antes de rendirse, así evitamos caer al mock
  // por un fallo transitorio.
  for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
    try {
      const res = await fetch(`${BASE}/${path}`, {
        next: { revalidate: REVALIDATE },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (res.ok) return (await res.json()) as T;
    } catch {
      // reintentar
    }
    if (attempt < ATTEMPTS - 1) {
      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
    }
  }
  return null;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

function toInt(v: unknown): number {
  const n = parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) ? n : 0;
}

function toScore(v: unknown): number | null {
  const s = String(v ?? "").trim();
  if (s === "" || s.toLowerCase() === "null") return null;
  const n = parseInt(s, 10);
  return Number.isFinite(n) ? n : null;
}

function mapStage(type: string): Stage {
  switch ((type ?? "").toLowerCase()) {
    case "r32":
      return "round32";
    case "r16":
      return "round16";
    case "qf":
      return "quarter";
    case "sf":
      return "semi";
    case "third":
      return "third";
    case "final":
      return "final";
    default:
      return "group";
  }
}

function mapStatus(game: any): { status: MatchStatus; minute?: number } {
  if (String(game.finished).toUpperCase() === "TRUE") {
    return { status: "finished" };
  }
  const elapsed = String(game.time_elapsed ?? "").trim().toLowerCase();
  if (elapsed === "" || elapsed === "notstarted" || elapsed === "ns") {
    return { status: "scheduled" };
  }
  if (elapsed === "ht" || elapsed === "halftime") {
    return { status: "halftime", minute: 45 };
  }
  // Algo como "67", "45+2" -> en vivo con el minuto
  const minute = toInt(elapsed.replace("+", ""));
  return { status: "live", minute: minute || undefined };
}

/**
 * Parsea el campo de goleadores. La API lo entrega como literal tipo
 * array de Postgres: {"J. Quiñones 9'","R. Jiménez 67'"} (o "null").
 * De cada entrada saca el nombre y el minuto (admite "90+2'").
 */
function parseScorers(raw: unknown, side: "home" | "away"): Scorer[] {
  const s = String(raw ?? "").trim();
  if (s === "" || s.toLowerCase() === "null" || s === "{}") return [];
  const inner = s.replace(/^\{/, "").replace(/\}$/, "");
  const entries = inner.match(/"[^"]*"|[^,]+/g) ?? [];
  const scorers: Scorer[] = [];
  for (const rawEntry of entries) {
    const entry = rawEntry.replace(/^"|"$/g, "").trim();
    if (!entry) continue;
    const m = entry.match(/^(.*?)[\s]*(\d+(?:\+\d+)?)\s*'?\s*$/);
    if (m) {
      const minute = parseInt(m[2], 10);
      scorers.push({
        side,
        player: m[1].trim() || entry,
        minute: Number.isFinite(minute) ? minute : undefined,
      });
    } else {
      scorers.push({ side, player: entry });
    }
  }
  return scorers;
}

/** "MM/DD/YYYY HH:mm" -> ISO en hora de Ciudad de México (-06:00). */
function parseKickoff(local: string): string {
  const m = String(local ?? "").match(
    /(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})/,
  );
  if (!m) return new Date().toISOString();
  const [, mm, dd, yyyy, hh, min] = m;
  return `${yyyy}-${mm}-${dd}T${hh}:${min}:00-06:00`;
}

export interface Bundle {
  teams: Map<number, Team>;
  stadiums: Map<number, { venue: string; city: string }>;
  games: any[];
  groups: any[];
}

// Construye el Bundle (mapas) a partir de los arreglos crudos de la API.
// Reutilizable tanto por el fetch en vivo como por el snapshot local.
export function buildBundle(
  teamsArr: any[],
  gamesArr: any[],
  stadiumsArr: any[],
  groupsArr: any[],
): Bundle {
  const teams = new Map<number, Team>();
  for (const t of teamsArr) {
    teams.set(toInt(t.id), {
      id: toInt(t.id),
      name: nameES(t.fifa_code, t.name_en ?? ""),
      code: t.fifa_code ?? "",
      flag: t.flag ?? "", // URL (TeamFlag detecta http)
      group: (t.groups ?? "A") as GroupId,
    });
  }

  const stadiums = new Map<number, { venue: string; city: string }>();
  for (const s of stadiumsArr) {
    stadiums.set(toInt(s.id), {
      venue: s.name_en ?? s.fifa_name ?? "",
      city: s.city_en ?? "",
    });
  }

  return { teams, stadiums, games: gamesArr, groups: groupsArr };
}

// Último bundle bueno (en memoria del proceso). Si una recarga falla, se
// sirve este en lugar de caer al mock — el sitio mantiene datos reales.
let lastGoodBundle: Bundle | null = null;

async function loadBundle(): Promise<Bundle | null> {
  const [teamsRes, gamesRes, stadiumsRes, groupsRes] = await Promise.all([
    apiGet<{ teams?: any[] }>("get/teams"),
    apiGet<{ games?: any[] }>("get/games"),
    apiGet<{ stadiums?: any[] }>("get/stadiums"),
    apiGet<{ groups?: any[] }>("get/groups"),
  ]);

  // Si esta vez no llegaron equipos o partidos, devuelve el último bueno.
  if (!teamsRes?.teams?.length || !gamesRes?.games?.length) {
    return lastGoodBundle;
  }

  lastGoodBundle = buildBundle(
    teamsRes.teams,
    gamesRes.games,
    stadiumsRes?.stadiums ?? [],
    groupsRes?.groups ?? [],
  );
  return lastGoodBundle;
}

export function bundleToMatches(b: Bundle): Match[] {
  return b.games
    .map((g): Match | null => {
      const home = b.teams.get(toInt(g.home_team_id));
      const away = b.teams.get(toInt(g.away_team_id));
      if (!home || !away) return null;
      const stadium = b.stadiums.get(toInt(g.stadium_id));
      const { status, minute } = mapStatus(g);
      const group = g.group ? (String(g.group).toUpperCase() as GroupId) : undefined;
      return {
        id: toInt(g.id),
        stage: mapStage(g.type),
        group,
        kickoff: parseKickoff(g.local_date),
        status,
        minute,
        venue: stadium?.venue ?? "",
        city: stadium?.city ?? "",
        home: { ...home, group: group ?? home.group },
        away: { ...away, group: group ?? away.group },
        homeScore: toScore(g.home_score),
        awayScore: toScore(g.away_score),
        scorers: [
          ...parseScorers(g.home_scorers, "home"),
          ...parseScorers(g.away_scorers, "away"),
        ],
      };
    })
    .filter((m): m is Match => m !== null)
    .sort((a, b) => a.kickoff.localeCompare(b.kickoff));
}

/** Usa los standings oficiales que entrega la API (con sus desempates). */
export function bundleToStandings(b: Bundle): GroupStanding[] {
  const result: GroupStanding[] = [];
  for (const g of b.groups) {
    const group = String(g.name ?? "").toUpperCase() as GroupId;
    const rows: StandingRow[] = (g.teams ?? [])
      .map((row: any): StandingRow | null => {
        const team = b.teams.get(toInt(row.team_id));
        if (!team) return null;
        return {
          team,
          played: toInt(row.mp),
          won: toInt(row.w),
          drawn: toInt(row.d),
          lost: toInt(row.l),
          goalsFor: toInt(row.gf),
          goalsAgainst: toInt(row.ga),
          goalDiff: toInt(row.gd),
          points: toInt(row.pts),
          rank: 0,
        };
      })
      .filter((r: StandingRow | null): r is StandingRow => r !== null);

    rows.sort(
      (a, b) =>
        b.points - a.points ||
        b.goalDiff - a.goalDiff ||
        b.goalsFor - a.goalsFor ||
        a.team.name.localeCompare(b.team.name),
    );
    rows.forEach((r, i) => (r.rank = i + 1));
    result.push({ group, rows });
  }
  result.sort((a, b) => a.group.localeCompare(b.group));
  return result.length ? result : [];
}

export async function fetchWcMatches(): Promise<Match[] | null> {
  const b = await loadBundle();
  return b ? bundleToMatches(b) : null;
}

export async function fetchWcTeams(): Promise<Team[] | null> {
  const b = await loadBundle();
  return b ? [...b.teams.values()] : null;
}

export async function fetchWcStandings(): Promise<GroupStanding[] | null> {
  const b = await loadBundle();
  if (!b) return null;
  const standings = bundleToStandings(b);
  return standings.length ? standings : null;
}
