import "server-only";
import { computeStandings } from "./standings";
import type {
  GroupId,
  GroupStanding,
  Match,
  MatchStatus,
  Stage,
  Team,
} from "./types";

/**
 * Integración con API-Football (api-sports.io).
 *
 * Se activa solo si existe FOOTBALL_API_KEY. Mientras no la pongas, todo el
 * dashboard funciona con el dataset mock (ver src/lib/mock-data.ts).
 *
 * Variables de entorno (.env.local):
 *   FOOTBALL_API_KEY=tu_api_key
 *   FOOTBALL_API_HOST=v3.football.api-sports.io   (por defecto)
 *   WORLD_CUP_LEAGUE_ID=1                          (id de la Copa del Mundo)
 *   WORLD_CUP_SEASON=2026
 *
 * Si una llamada falla o devuelve vacío, las funciones retornan null y la
 * capa de datos cae al mock automáticamente — el sitio nunca se rompe.
 */

const HOST = process.env.FOOTBALL_API_HOST ?? "v3.football.api-sports.io";
const LEAGUE = process.env.WORLD_CUP_LEAGUE_ID ?? "1";
const SEASON = process.env.WORLD_CUP_SEASON ?? "2026";

// Cache/revalidación: marcadores en vivo refrescan rápido.
const REVALIDATE_LIVE = 30; // segundos

export function isLiveEnabled(): boolean {
  return Boolean(process.env.FOOTBALL_API_KEY);
}

async function apiGet<T>(
  path: string,
  revalidate: number,
): Promise<T | null> {
  const key = process.env.FOOTBALL_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(`https://${HOST}/${path}`, {
      headers: { "x-apisports-key": key },
      next: { revalidate },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { response?: T };
    return (json.response ?? null) as T | null;
  } catch {
    return null;
  }
}

// --- Mapeo de status de API-Football a nuestro modelo --------------------
function mapStatus(short: string): MatchStatus {
  switch (short) {
    case "1H":
    case "2H":
    case "ET":
    case "P":
    case "LIVE":
      return "live";
    case "HT":
      return "halftime";
    case "FT":
    case "AET":
    case "PEN":
      return "finished";
    default:
      return "scheduled";
  }
}

function mapStage(round: string): { stage: Stage; group?: GroupId } {
  const r = round.toLowerCase();
  const groupMatch = r.match(/group ([a-l])/);
  if (groupMatch) {
    return { stage: "group", group: groupMatch[1].toUpperCase() as GroupId };
  }
  if (r.includes("final") && !r.includes("semi") && !r.includes("quarter")) {
    return { stage: r.includes("3rd") || r.includes("third") ? "third" : "final" };
  }
  if (r.includes("semi")) return { stage: "semi" };
  if (r.includes("quarter")) return { stage: "quarter" };
  if (r.includes("16")) return { stage: "round16" };
  if (r.includes("32")) return { stage: "round32" };
  return { stage: "group" };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function teamFromFixture(t: any, group?: GroupId): Team {
  return {
    id: t.id,
    name: t.name,
    code: (t.code as string) ?? t.name?.slice(0, 3).toUpperCase() ?? "",
    flag: t.logo ?? "",
    group: group ?? "A",
  };
}

function mapFixture(item: any): Match {
  const { stage, group } = mapStage(item.league?.round ?? "");
  return {
    id: item.fixture.id,
    stage,
    group,
    kickoff: item.fixture.date,
    status: mapStatus(item.fixture.status?.short ?? "NS"),
    minute: item.fixture.status?.elapsed ?? undefined,
    venue: item.fixture.venue?.name ?? "",
    city: item.fixture.venue?.city ?? "",
    home: teamFromFixture(item.teams.home, group),
    away: teamFromFixture(item.teams.away, group),
    homeScore: item.goals?.home ?? null,
    awayScore: item.goals?.away ?? null,
  };
}

export async function fetchLiveMatches(): Promise<Match[] | null> {
  const data = await apiGet<any[]>(
    `fixtures?league=${LEAGUE}&season=${SEASON}`,
    REVALIDATE_LIVE,
  );
  if (!data || data.length === 0) return null;
  return data.map(mapFixture).sort((a, b) => a.kickoff.localeCompare(b.kickoff));
}

export async function fetchLiveTeams(): Promise<Team[] | null> {
  const matches = await fetchLiveMatches();
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

export async function fetchLiveStandings(): Promise<GroupStanding[] | null> {
  // Reusa los partidos para calcular la tabla con nuestra propia lógica,
  // así el criterio de desempate es consistente con el mock.
  const matches = await fetchLiveMatches();
  const teams = await fetchLiveTeams();
  if (!matches || !teams) return null;
  return computeStandings(teams, matches);
}
