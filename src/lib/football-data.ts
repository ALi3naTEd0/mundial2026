import "server-only";
import { computeStandings } from "./standings";
import type {
  GroupId,
  GroupStanding,
  Match,
  MatchStatus,
  Stage,
  Team,
  TopScorer,
} from "./types";
import { canonCode, nameES } from "./team-names-es";

/**
 * Integración con football-data.org (API v4).
 *
 * Se activa solo si existe FOOTBALL_DATA_TOKEN. Mientras no la pongas, el
 * dashboard usa el dataset mock (ver src/lib/mock-data.ts).
 *
 * Plan gratuito: 10 llamadas/minuto e incluye el Mundial (competición "WC").
 * Consigue tu token gratis en https://www.football-data.org/client/register
 *
 * Variables de entorno (.env.local):
 *   FOOTBALL_DATA_TOKEN=tu_token
 *   WORLD_CUP_COMPETITION=WC   (código de la Copa del Mundo; por defecto WC)
 *
 * Si una llamada falla, las funciones devuelven null y la capa de datos cae
 * al mock automáticamente — el sitio nunca se rompe.
 */

const BASE = "https://api.football-data.org/v4";
const COMPETITION = process.env.WORLD_CUP_COMPETITION ?? "WC";

// El plan gratuito limita a 10 req/min; cacheamos 60s para no acercarnos.
const REVALIDATE = 60;

export function isFootballDataEnabled(): boolean {
  return Boolean(process.env.FOOTBALL_DATA_TOKEN);
}

async function apiGet<T>(path: string): Promise<T | null> {
  const token = process.env.FOOTBALL_DATA_TOKEN;
  if (!token) return null;
  try {
    const res = await fetch(`${BASE}/${path}`, {
      headers: { "X-Auth-Token": token },
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// --- Mapeos del modelo de football-data al nuestro -----------------------
function mapStatus(s: string): MatchStatus {
  switch (s) {
    case "IN_PLAY":
      return "live";
    case "PAUSED":
      return "halftime";
    case "FINISHED":
    case "AWARDED":
      return "finished";
    default:
      // SCHEDULED, TIMED, POSTPONED, SUSPENDED, CANCELLED
      return "scheduled";
  }
}

function mapStage(stage: string): Stage {
  switch (stage) {
    case "LAST_32":
      return "round32";
    case "LAST_16":
      return "round16";
    case "QUARTER_FINALS":
      return "quarter";
    case "SEMI_FINALS":
      return "semi";
    case "THIRD_PLACE":
      return "third";
    case "FINAL":
      return "final";
    default:
      return "group";
  }
}

function groupLetter(group: string | null): GroupId | undefined {
  if (!group) return undefined;
  const m = group.match(/([A-L])$/i);
  return m ? (m[1].toUpperCase() as GroupId) : undefined;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapTeam(t: any, group?: GroupId): Team {
  const raw = t.tla ?? (t.shortName ?? t.name ?? "").slice(0, 3).toUpperCase();
  const code = canonCode(raw); // normaliza ISO3 -> FIFA (ej. URY -> URU)
  return {
    id: t.id,
    name: nameES(code, t.name ?? t.shortName ?? ""),
    code,
    flag: t.crest ?? "", // URL del escudo/bandera (TeamFlag detecta http)
    group: group ?? "A",
  };
}

function mapMatch(item: any): Match {
  const group = groupLetter(item.group ?? null);
  return {
    id: item.id,
    stage: mapStage(item.stage ?? "GROUP_STAGE"),
    group,
    matchday: item.matchday ?? undefined,
    kickoff: item.utcDate,
    status: mapStatus(item.status ?? "SCHEDULED"),
    minute: item.minute ?? undefined,
    venue: item.venue ?? "",
    city: "",
    home: mapTeam(item.homeTeam, group),
    away: mapTeam(item.awayTeam, group),
    homeScore: item.score?.fullTime?.home ?? null,
    awayScore: item.score?.fullTime?.away ?? null,
  };
}

export async function fetchFdMatches(): Promise<Match[] | null> {
  const data = await apiGet<{ matches?: any[] }>(
    `competitions/${COMPETITION}/matches`,
  );
  if (!data?.matches || data.matches.length === 0) return null;
  return data.matches
    .map(mapMatch)
    .sort((a, b) => a.kickoff.localeCompare(b.kickoff));
}

export async function fetchFdTeams(): Promise<Team[] | null> {
  const matches = await fetchFdMatches();
  if (!matches) return null;
  const map = new Map<number, Team>();
  for (const m of matches) {
    if (m.group) {
      map.set(m.home.id, m.home);
      map.set(m.away.id, m.away);
    }
  }
  return map.size ? [...map.values()] : null;
}

export async function fetchFdStandings(): Promise<GroupStanding[] | null> {
  // Calculamos la tabla con nuestra propia lógica de desempate a partir de
  // los partidos, para que el criterio sea idéntico al del mock.
  const matches = await fetchFdMatches();
  const teams = await fetchFdTeams();
  if (!matches || !teams) return null;
  return computeStandings(teams, matches);
}

/** Tabla de goleadores del torneo (endpoint /scorers, incluido en el plan gratis). */
export async function fetchFdScorers(limit = 30): Promise<TopScorer[] | null> {
  const data = await apiGet<{ scorers?: any[] }>(
    `competitions/${COMPETITION}/scorers?limit=${limit}`,
  );
  if (!data?.scorers?.length) return null;
  return data.scorers
    .map((s) => ({
      player: s.player?.name ?? "",
      team: mapTeam(s.team),
      goals: s.goals ?? 0,
    }))
    .filter((s) => s.player && s.goals > 0);
}
