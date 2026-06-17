import Link from "next/link";
import type { Match } from "@/lib/types";
import { TeamFlag } from "./team-flag";
import { StatusBadge } from "./status-badge";
import { formatKickoffDate, matchLabel } from "@/lib/format";

function ScoreOrDash({ value }: { value: number | null }) {
  return <span>{value ?? "–"}</span>;
}

/** Una fila de equipo dentro de la tarjeta. */
function Row({
  flag,
  name,
  score,
  live,
  winner,
}: {
  flag: React.ReactNode;
  name: string;
  score: number | null;
  live: boolean;
  winner: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="inline-flex items-center gap-2.5 min-w-0">
        {flag}
        <span className={`truncate ${winner ? "font-semibold" : ""}`}>
          {name}
        </span>
      </span>
      <span
        className={`tabular-nums text-lg font-bold ${
          live ? "text-live" : winner ? "text-foreground" : "text-muted"
        }`}
      >
        <ScoreOrDash value={score} />
      </span>
    </div>
  );
}

export function MatchCard({ match }: { match: Match }) {
  const live = match.status === "live" || match.status === "halftime";
  const finished = match.status === "finished";
  const homeWin =
    finished &&
    match.homeScore != null &&
    match.awayScore != null &&
    match.homeScore > match.awayScore;
  const awayWin =
    finished &&
    match.homeScore != null &&
    match.awayScore != null &&
    match.awayScore > match.homeScore;

  return (
    <Link
      href={`/partidos/${match.id}`}
      className="card block p-4 transition-all hover:border-pitch/40 hover:bg-surface-2/60 group"
    >
      <div className="flex items-center justify-between mb-3 text-xs text-muted">
        <span>{matchLabel(match)}</span>
        <StatusBadge match={match} />
      </div>

      <div className="space-y-2.5">
        <Row
          flag={<TeamFlag team={match.home} size={24} />}
          name={match.home.name}
          score={match.homeScore}
          live={live}
          winner={homeWin}
        />
        <Row
          flag={<TeamFlag team={match.away} size={24} />}
          name={match.away.name}
          score={match.awayScore}
          live={live}
          winner={awayWin}
        />
      </div>

      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted">
        <span className="truncate">{match.venue}</span>
        <span className="shrink-0 ml-2">
          {match.status === "scheduled"
            ? formatKickoffDate(match.kickoff)
            : match.city}
        </span>
      </div>
    </Link>
  );
}
