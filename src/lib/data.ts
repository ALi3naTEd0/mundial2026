import "server-only";
import { MOCK_MATCHES, TEAMS } from "./mock-data";
import { computeStandings } from "./standings";
import { HIGHLIGHTS } from "./highlights";
import { dayKey } from "./format";
import type { GroupStanding, Match, Stage, Team, TopScorer } from "./types";
import {
  fetchLiveMatches,
  fetchLiveStandings,
  fetchLiveTeams,
  isLiveEnabled,
} from "./api-football";
import {
  fetchFdMatches,
  fetchFdStandings,
  fetchFdTeams,
  isFootballDataEnabled,
} from "./football-data";
import {
  fetchWcMatches,
  fetchWcStandings,
  fetchWcTeams,
  isWorldcup26Enabled,
} from "./worldcup26";

/**
 * Única superficie de datos que consume la UI. Decide la fuente y la UI nunca
 * sabe cuál es. Prioridad:
 *   1. football-data.org   (si hay FOOTBALL_DATA_TOKEN)
 *   2. API-Football        (si hay FOOTBALL_API_KEY)
 *   3. worldcup26.ir       (API abierta, sin key — fuente por defecto)
 *   4. Datos mock          (fallback; o si DATA_SOURCE=mock)
 *
 * Si el proveedor activo falla o devuelve vacío, se cae al mock — el sitio
 * nunca se rompe.
 */

interface Provider {
  matches: () => Promise<Match[] | null>;
  teams: () => Promise<Team[] | null>;
  standings: () => Promise<GroupStanding[] | null>;
}

function activeProvider(): Provider | null {
  if (isFootballDataEnabled()) {
    return {
      matches: fetchFdMatches,
      teams: fetchFdTeams,
      standings: fetchFdStandings,
    };
  }
  if (isLiveEnabled()) {
    return {
      matches: fetchLiveMatches,
      teams: fetchLiveTeams,
      standings: fetchLiveStandings,
    };
  }
  if (isWorldcup26Enabled()) {
    return {
      matches: fetchWcMatches,
      teams: fetchWcTeams,
      standings: fetchWcStandings,
    };
  }
  return null;
}

export async function getTeams(): Promise<Team[]> {
  const live = await activeProvider()?.teams();
  return live ?? TEAMS;
}

/** Inyecta el ID de YouTube del resumen (mapa manual) en cada partido. */
function withHighlights(matches: Match[]): Match[] {
  return matches.map((m) =>
    HIGHLIGHTS[m.id] ? { ...m, highlightYoutubeId: HIGHLIGHTS[m.id] } : m,
  );
}

export async function getMatches(): Promise<Match[]> {
  const live = await activeProvider()?.matches();
  return withHighlights(live ?? MOCK_MATCHES);
}

export async function getStandings(): Promise<GroupStanding[]> {
  const live = await activeProvider()?.standings();
  return live ?? computeStandings(TEAMS, MOCK_MATCHES);
}

export async function getMatchById(id: number): Promise<Match | null> {
  const matches = await getMatches();
  return matches.find((m) => m.id === id) ?? null;
}

export async function getLiveMatches(): Promise<Match[]> {
  const matches = await getMatches();
  return matches.filter((m) => m.status === "live" || m.status === "halftime");
}

/** Próximos N partidos por orden de inicio. */
export async function getUpcomingMatches(limit = 6): Promise<Match[]> {
  const matches = await getMatches();
  return matches
    .filter((m) => m.status === "scheduled")
    .sort((a, b) => a.kickoff.localeCompare(b.kickoff))
    .slice(0, limit);
}

/** Últimos N partidos terminados (más recientes primero). */
export async function getRecentResults(limit = 6): Promise<Match[]> {
  const matches = await getMatches();
  return matches
    .filter((m) => m.status === "finished")
    .sort((a, b) => b.kickoff.localeCompare(a.kickoff))
    .slice(0, limit);
}

/** Todos los partidos finalizados, más recientes primero. */
export async function getFinishedMatches(): Promise<Match[]> {
  const matches = await getMatches();
  return matches
    .filter((m) => m.status === "finished")
    .sort((a, b) => b.kickoff.localeCompare(a.kickoff));
}

/** Partidos terminados que tienen video de resumen. */
export async function getHighlights(): Promise<Match[]> {
  const matches = await getFinishedMatches();
  return matches.filter((m) => m.highlightYoutubeId);
}

/**
 * Feed de la sección Resúmenes (orden cronológico, del más viejo al nuevo):
 * todos los partidos finalizados + todos los de HOY (en vivo o por jugar),
 * para que aparezcan con placeholder y se les pueda enlazar el video luego.
 */
export async function getHighlightFeed(): Promise<Match[]> {
  const matches = await getMatches();
  const today = dayKey(new Date().toISOString());
  return matches
    .filter((m) => m.status === "finished" || dayKey(m.kickoff) === today)
    .sort((a, b) => a.kickoff.localeCompare(b.kickoff));
}

const KNOCKOUT_ORDER: Stage[] = [
  "round32",
  "round16",
  "quarter",
  "semi",
  "third",
  "final",
];

/** Partidos de eliminatorias agrupados por ronda (en orden). */
export async function getKnockoutRounds(): Promise<
  { stage: Stage; matches: Match[] }[]
> {
  const matches = await getMatches();
  return KNOCKOUT_ORDER.map((stage) => ({
    stage,
    matches: matches
      .filter((m) => m.stage === stage)
      .sort((a, b) => a.kickoff.localeCompare(b.kickoff)),
  })).filter((round) => round.matches.length > 0);
}

/** Tabla de goleadores del torneo, agregando los goles de cada partido. */
export async function getTopScorers(limit = 20): Promise<TopScorer[]> {
  const matches = await getMatches();
  const tally = new Map<string, TopScorer>();

  for (const m of matches) {
    if (!m.scorers) continue;
    for (const s of m.scorers) {
      const team = s.side === "home" ? m.home : m.away;
      const key = `${s.player}__${team.code}`;
      const existing = tally.get(key);
      if (existing) {
        existing.goals++;
      } else {
        tally.set(key, { player: s.player, team, goals: 1 });
      }
    }
  }

  return [...tally.values()]
    .sort((a, b) => b.goals - a.goals || a.player.localeCompare(b.player))
    .slice(0, limit);
}
