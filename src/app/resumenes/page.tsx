import type { Metadata } from "next";
import Link from "next/link";
import { getHighlightFeed } from "@/lib/data";
import { VideoLightbox } from "@/components/video-lightbox";
import { TeamFlag } from "@/components/team-flag";
import { StatusBadge } from "@/components/status-badge";
import { formatKickoffDate, matchLabel } from "@/lib/format";
import type { Match } from "@/lib/types";

export const metadata: Metadata = {
  title: "Resúmenes",
  description: "Resúmenes en video de los partidos del Mundial 2026.",
};

export const revalidate = 60;

/** Recuadro superior de cada tarjeta: video o placeholder según estado. */
function CardMedia({ m }: { m: Match }) {
  if (m.highlightYoutubeId) {
    return (
      <VideoLightbox
        id={m.highlightYoutubeId}
        title={`${m.home.name} vs ${m.away.name}`}
      />
    );
  }

  const live = m.status === "live" || m.status === "halftime";
  const label = live
    ? "En juego · resumen al terminar"
    : m.status === "scheduled"
      ? "Resumen tras el partido"
      : "Resumen próximamente";

  return (
    <Link
      href={`/partidos/${m.id}`}
      className="flex aspect-video items-center justify-center bg-surface-2 text-center text-sm text-muted hover:text-foreground transition-colors"
    >
      <span className="flex flex-col items-center gap-1.5">
        <span className="text-2xl">{live ? "🔴" : "🎬"}</span>
        {label}
      </span>
    </Link>
  );
}

/** Línea inferior: marcador si ya hay, o "vs" si está por jugar. */
function CardScore({ m }: { m: Match }) {
  const showScore = m.status !== "scheduled";
  return (
    <Link
      href={`/partidos/${m.id}`}
      className="flex items-center justify-between gap-2 font-semibold hover:text-pitch transition-colors"
    >
      <span className="inline-flex items-center gap-2 min-w-0">
        <TeamFlag team={m.home} size={20} />
        <span className="truncate">{m.home.name}</span>
      </span>
      <span className="tabular-nums shrink-0 text-muted">
        {showScore ? `${m.homeScore ?? 0} - ${m.awayScore ?? 0}` : "vs"}
      </span>
      <span className="inline-flex items-center gap-2 min-w-0 justify-end">
        <span className="truncate">{m.away.name}</span>
        <TeamFlag team={m.away} size={20} />
      </span>
    </Link>
  );
}

export default async function ResumenesPage() {
  const matches = await getHighlightFeed();
  const withVideo = matches.filter((m) => m.highlightYoutubeId).length;

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">Resúmenes</h1>
        <p className="text-muted mt-1">
          Revive lo mejor de cada partido. Toca para reproducir.
        </p>
        {matches.length > 0 && (
          <p className="mt-3 text-sm rounded-lg border border-border bg-surface px-3 py-2 text-muted">
            {withVideo} con video · los partidos de hoy y los finalizados sin
            resumen aún muestran un marcador de posición.
          </p>
        )}
      </header>

      {matches.length === 0 ? (
        <p className="text-muted text-center py-16">
          Aún no hay partidos para mostrar.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((m) => (
            <article key={m.id} className="card overflow-hidden">
              <CardMedia m={m} />
              <div className="p-4">
                <div className="flex items-center justify-between text-xs text-muted mb-2">
                  <span>{matchLabel(m)}</span>
                  <span className="inline-flex items-center gap-2">
                    {formatKickoffDate(m.kickoff)}
                    <StatusBadge match={m} />
                  </span>
                </div>
                <CardScore m={m} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
