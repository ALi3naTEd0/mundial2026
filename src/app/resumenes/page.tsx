import type { Metadata } from "next";
import Link from "next/link";
import { getFinishedMatches } from "@/lib/data";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { TeamFlag } from "@/components/team-flag";
import { formatKickoffDate, matchLabel } from "@/lib/format";

export const metadata: Metadata = {
  title: "Resúmenes",
  description: "Resúmenes en video de los partidos del Mundial 2026.",
};

export const revalidate = 60;

export default async function ResumenesPage() {
  // Del más viejo al más nuevo (getFinishedMatches viene en orden inverso).
  const matches = (await getFinishedMatches())
    .slice()
    .sort((a, b) => a.kickoff.localeCompare(b.kickoff));
  const withVideo = matches.filter((m) => m.highlightYoutubeId).length;

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">Resúmenes</h1>
        <p className="text-muted mt-1">
          Revive lo mejor de cada partido. Toca para reproducir.
        </p>
        {matches.length > 0 && withVideo === 0 && (
          <p className="mt-3 text-sm rounded-lg border border-border bg-surface px-3 py-2 text-muted">
            Los videos se irán agregando. Mientras tanto verás los partidos
            finalizados listos para enlazar su resumen.
          </p>
        )}
      </header>

      {matches.length === 0 ? (
        <p className="text-muted text-center py-16">
          Aún no hay partidos finalizados.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((m) => (
            <article key={m.id} className="card overflow-hidden">
              {m.highlightYoutubeId ? (
                <YouTubeEmbed
                  id={m.highlightYoutubeId}
                  title={`${m.home.name} vs ${m.away.name}`}
                />
              ) : (
                <Link
                  href={`/partidos/${m.id}`}
                  className="flex aspect-video items-center justify-center bg-surface-2 text-center text-sm text-muted hover:text-foreground transition-colors"
                >
                  <span className="flex flex-col items-center gap-1">
                    <span className="text-2xl">🎬</span>
                    Resumen próximamente
                  </span>
                </Link>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between text-xs text-muted mb-2">
                  <span>{matchLabel(m)}</span>
                  <span>{formatKickoffDate(m.kickoff)}</span>
                </div>
                <Link
                  href={`/partidos/${m.id}`}
                  className="flex items-center justify-between gap-2 font-semibold hover:text-pitch transition-colors"
                >
                  <span className="inline-flex items-center gap-2 min-w-0">
                    <TeamFlag team={m.home} size={20} />
                    <span className="truncate">{m.home.name}</span>
                  </span>
                  <span className="tabular-nums shrink-0">
                    {m.homeScore} - {m.awayScore}
                  </span>
                  <span className="inline-flex items-center gap-2 min-w-0 justify-end">
                    <span className="truncate">{m.away.name}</span>
                    <TeamFlag team={m.away} size={20} />
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
