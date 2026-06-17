import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getMatchById } from "@/lib/data";
import { TeamFlag } from "@/components/team-flag";
import { StatusBadge } from "@/components/status-badge";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { formatLongDate, formatKickoffTime, matchLabel } from "@/lib/format";

export const revalidate = 30;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const match = await getMatchById(Number(id));
  if (!match) return { title: "Partido no encontrado" };
  return {
    title: `${match.home.name} vs ${match.away.name}`,
    description: `${matchLabel(match)} · ${match.venue}, ${match.city}`,
  };
}

function TeamBlock({
  flag,
  name,
}: {
  flag: React.ReactNode;
  name: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-3 text-center">
      <div className="text-5xl sm:text-7xl leading-none">{flag}</div>
      <div className="font-bold text-lg sm:text-xl">{name}</div>
    </div>
  );
}

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const match = await getMatchById(Number(id));
  if (!match) notFound();

  const scheduled = match.status === "scheduled";
  const live = match.status === "live" || match.status === "halftime";

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/partidos"
        className="text-sm text-muted hover:text-foreground transition-colors"
      >
        ← Volver a partidos
      </Link>

      <div className="card mt-4 p-6 sm:p-8">
        <div className="flex items-center justify-center gap-3 mb-6 text-sm text-muted">
          <span>{matchLabel(match)}</span>
          <span aria-hidden>·</span>
          <StatusBadge match={match} />
        </div>

        <div className="flex items-center gap-2 sm:gap-6">
          <TeamBlock
            flag={<TeamFlag team={match.home} size={72} />}
            name={match.home.name}
          />

          <div className="shrink-0 text-center">
            {scheduled ? (
              <div className="text-3xl font-black text-muted">vs</div>
            ) : (
              <div
                className={`text-4xl sm:text-6xl font-black tabular-nums ${
                  live ? "text-live" : ""
                }`}
              >
                {match.homeScore} <span className="text-muted">·</span>{" "}
                {match.awayScore}
              </div>
            )}
            {scheduled && (
              <div className="mt-2 text-sm text-muted">
                {formatKickoffTime(match.kickoff)}
              </div>
            )}
          </div>

          <TeamBlock
            flag={<TeamFlag team={match.away} size={72} />}
            name={match.away.name}
          />
        </div>

        {match.scorers && match.scorers.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-5 text-sm">
            <ul className="space-y-1.5">
              {match.scorers
                .filter((s) => s.side === "home")
                .map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span aria-hidden>⚽</span>
                    <span>{s.player}</span>
                    {s.minute != null && (
                      <span className="text-muted">{s.minute}&apos;</span>
                    )}
                  </li>
                ))}
            </ul>
            <ul className="space-y-1.5 text-right">
              {match.scorers
                .filter((s) => s.side === "away")
                .map((s, i) => (
                  <li key={i} className="flex items-center justify-end gap-2">
                    {s.minute != null && (
                      <span className="text-muted">{s.minute}&apos;</span>
                    )}
                    <span>{s.player}</span>
                    <span aria-hidden>⚽</span>
                  </li>
                ))}
            </ul>
          </div>
        )}

        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-6 text-sm">
          <div>
            <div className="text-muted text-xs">Fecha</div>
            <div className="font-medium">{formatLongDate(match.kickoff)}</div>
          </div>
          <div className="text-right">
            <div className="text-muted text-xs">Sede</div>
            <div className="font-medium">{match.venue}</div>
            <div className="text-muted text-xs">{match.city}</div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold tracking-tight mb-4">
          Resumen en video
        </h2>
        {match.highlightYoutubeId ? (
          <YouTubeEmbed
            id={match.highlightYoutubeId}
            title={`Resumen: ${match.home.name} vs ${match.away.name}`}
          />
        ) : (
          <div className="card p-8 text-center text-muted">
            {scheduled || live
              ? "El resumen estará disponible cuando termine el partido."
              : "Aún no hay resumen disponible para este partido."}
          </div>
        )}
      </div>
    </div>
  );
}
