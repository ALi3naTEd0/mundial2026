import type { Match } from "@/lib/types";
import { formatKickoffTime } from "@/lib/format";

/** Pastilla de estado: EN VIVO (pulsante), DESCANSO, FINAL u hora de inicio. */
export function StatusBadge({ match }: { match: Match }) {
  if (match.status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-live/15 px-2.5 py-1 text-xs font-semibold text-live">
        <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-live" />
        {match.minute ? `${match.minute}'` : "EN VIVO"}
      </span>
    );
  }
  if (match.status === "halftime") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-2.5 py-1 text-xs font-semibold text-gold">
        DESCANSO
      </span>
    );
  }
  if (match.status === "finished") {
    return (
      <span className="inline-flex items-center rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold text-muted">
        FINAL
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold text-foreground/80">
      {formatKickoffTime(match.kickoff)}
    </span>
  );
}
