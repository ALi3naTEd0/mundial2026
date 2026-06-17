import type { GroupStanding, GroupId, Match, StandingRow, Team } from "./types";

/**
 * Calcula las tablas de posiciones de la fase de grupos a partir de los
 * partidos. Sirve tanto para datos mock como para los de la API real.
 *
 * Criterios de desempate (orden FIFA simplificado):
 *   1. Puntos
 *   2. Diferencia de goles
 *   3. Goles a favor
 *   (el desempate por enfrentamiento directo no se implementa aquí)
 */
export function computeStandings(teams: Team[], matches: Match[]): GroupStanding[] {
  const byGroup = new Map<GroupId, Map<number, StandingRow>>();

  // Inicializa una fila por equipo
  for (const team of teams) {
    if (!byGroup.has(team.group)) byGroup.set(team.group, new Map());
    byGroup.get(team.group)!.set(team.id, {
      team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      points: 0,
      rank: 0,
    });
  }

  // Acumula resultados de los partidos de grupo ya jugados (o en curso)
  for (const m of matches) {
    if (m.stage !== "group" || m.group == null) continue;
    if (m.homeScore == null || m.awayScore == null) continue;
    if (m.status === "scheduled") continue;

    const group = byGroup.get(m.group);
    if (!group) continue;
    const home = group.get(m.home.id);
    const away = group.get(m.away.id);
    if (!home || !away) continue;

    // Solo cuenta como "jugado" si terminó; los en vivo afectan goles pero no PJ
    const counts = m.status === "finished";
    if (counts) {
      home.played++;
      away.played++;
    }
    home.goalsFor += m.homeScore;
    home.goalsAgainst += m.awayScore;
    away.goalsFor += m.awayScore;
    away.goalsAgainst += m.homeScore;

    if (counts) {
      if (m.homeScore > m.awayScore) {
        home.won++;
        away.lost++;
        home.points += 3;
      } else if (m.homeScore < m.awayScore) {
        away.won++;
        home.lost++;
        away.points += 3;
      } else {
        home.drawn++;
        away.drawn++;
        home.points++;
        away.points++;
      }
    }
  }

  const result: GroupStanding[] = [];
  for (const [group, rowsMap] of byGroup) {
    const rows = [...rowsMap.values()];
    for (const r of rows) r.goalDiff = r.goalsFor - r.goalsAgainst;
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
  return result;
}
