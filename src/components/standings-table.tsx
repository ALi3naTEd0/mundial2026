import type { GroupStanding } from "@/lib/types";
import { TeamLabel } from "./team-flag";

/**
 * Tabla de posiciones de un grupo. Las dos primeras posiciones clasifican
 * directo (verde); la 3.ª puede clasificar como mejor tercero (dorado).
 */
export function StandingsTable({
  standing,
  compact = false,
}: {
  standing: GroupStanding;
  compact?: boolean;
}) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <span className="grid place-items-center h-7 w-7 rounded-lg bg-pitch/15 text-pitch font-bold text-sm">
          {standing.group}
        </span>
        <h3 className="font-semibold">Grupo {standing.group}</h3>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted text-xs">
            <th className="text-left font-medium pl-4 py-2 w-8">#</th>
            <th className="text-left font-medium py-2">Equipo</th>
            <th className="text-center font-medium py-2 w-8">PJ</th>
            {!compact && (
              <>
                <th className="text-center font-medium py-2 w-8">G</th>
                <th className="text-center font-medium py-2 w-8">E</th>
                <th className="text-center font-medium py-2 w-8">P</th>
                <th className="text-center font-medium py-2 w-10">DG</th>
              </>
            )}
            <th className="text-center font-medium py-2 w-10 pr-4">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standing.rows.map((row) => {
            const qualifies = row.rank <= 2;
            const playoff = row.rank === 3;
            return (
              <tr
                key={row.team.id}
                className="border-t border-border/60 hover:bg-surface-2/50"
              >
                <td className="pl-4 py-2.5">
                  <span
                    className={`inline-block h-1.5 w-1.5 rounded-full mr-2 align-middle ${
                      qualifies
                        ? "bg-pitch"
                        : playoff
                          ? "bg-gold"
                          : "bg-transparent"
                    }`}
                  />
                  <span className="tabular-nums text-muted">{row.rank}</span>
                </td>
                <td className="py-2.5">
                  <TeamLabel team={row.team} size={20} />
                </td>
                <td className="text-center py-2.5 tabular-nums text-muted">
                  {row.played}
                </td>
                {!compact && (
                  <>
                    <td className="text-center py-2.5 tabular-nums text-muted">
                      {row.won}
                    </td>
                    <td className="text-center py-2.5 tabular-nums text-muted">
                      {row.drawn}
                    </td>
                    <td className="text-center py-2.5 tabular-nums text-muted">
                      {row.lost}
                    </td>
                    <td className="text-center py-2.5 tabular-nums text-muted">
                      {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                    </td>
                  </>
                )}
                <td className="text-center py-2.5 pr-4 tabular-nums font-bold">
                  {row.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
