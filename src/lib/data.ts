import "server-only";
import { HIGHLIGHTS, matchKey } from "./highlights";
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
import { fetchWcMatches, fetchWcStandings, fetchWcTeams } from "./worldcup26";
import { snapMatches, snapStandings, snapTeams } from "./snapshot";

/**
 * Única superficie de datos que consume la UI. Decide la fuente; la UI nunca
 * sabe cuál es. Prioridad:
 *   1. football-data.org   (si hay FOOTBALL_DATA_TOKEN)
 *   2. API-Football        (si hay FOOTBALL_API_KEY)
 *   3. worldcup26.ir EN VIVO (solo si DATA_SOURCE=live; NO funciona en Vercel)
 *   4. Snapshot local      (POR DEFECTO — confiable, sin red en runtime)
 *
 * Si el proveedor activo falla, se cae al snapshot (datos reales), nunca a
 * datos inventados. El snapshot se refresca con `node scripts/snapshot.mjs`.
 */

interface Provider {
  matches: () => Promise<Match[] | null>;
  teams: () => Promise<Team[] | null>;
  standings: () => Promise<GroupStanding[] | null>;
}

const snapshotProvider: Provider = {
  matches: snapMatches,
  teams: snapTeams,
  standings: snapStandings,
};

function activeProvider(): Provider {
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
  if (process.env.DATA_SOURCE === "live") {
    return {
      matches: fetchWcMatches,
      teams: fetchWcTeams,
      standings: fetchWcStandings,
    };
  }
  return snapshotProvider;
}

/** Inyecta el ID de YouTube del resumen (por pareja de equipos) en cada partido. */
function withHighlights(matches: Match[]): Match[] {
  return matches.map((m) => {
    const yt = HIGHLIGHTS[matchKey(m.home.code, m.away.code)];
    return yt ? { ...m, highlightYoutubeId: yt } : m;
  });
}

export async function getTeams(): Promise<Team[]> {
  const live = await activeProvider().teams();
  return live ?? (await snapTeams());
}

export async function getMatches(): Promise<Match[]> {
  const live = await activeProvider().matches();
  return withHighlights(live ?? (await snapMatches()));
}

export async function getStandings(): Promise<GroupStanding[]> {
  const live = await activeProvider().standings();
  return live ?? (await snapStandings());
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
