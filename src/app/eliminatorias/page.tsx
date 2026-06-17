import type { Metadata } from "next";
import Link from "next/link";
import { getKnockoutRounds } from "@/lib/data";
import { TeamFlag } from "@/components/team-flag";
import { stageLabel } from "@/lib/format";
import type { Match } from "@/lib/types";

export const metadata: Metadata = {
  title: "Eliminatorias",
  description: "Bracket de la fase final del Mundial 2026.",
};

export const revalidate = 30;

function BracketSide({
  team,
  score,
  win,
}: {
  team: Match["home"];
  score: number | null;
  win: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-2 px-3 py-2 ${
        win ? "font-semibold" : "text-muted"
      }`}
    >
      <span className="inline-flex items-center gap-2 min-w-0">
        <TeamFlag team={team} size={18} />
        <span className="truncate text-sm">{team.name}</span>
      </span>
      <span className="tabular-nums text-sm shrink-0">{score ?? "–"}</span>
    </div>
  );
}

function BracketMatch({ match }: { match: Match }) {
  const finished = match.status === "finished";
  const homeWin =
    finished && (match.homeScore ?? 0) > (match.awayScore ?? 0);
  const awayWin =
    finished && (match.awayScore ?? 0) > (match.homeScore ?? 0);

  return (
    <Link
      href={`/partidos/${match.id}`}
      className="card block w-56 divide-y divide-border hover:border-pitch/40 transition-colors"
    >
      <BracketSide team={match.home} score={match.homeScore} win={homeWin} />
      <BracketSide team={match.away} score={match.awayScore} win={awayWin} />
    </Link>
  );
}

export default async function EliminatoriasPage() {
  const rounds = await getKnockoutRounds();

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">Eliminatorias</h1>
        <p className="text-muted mt-1">
          Fase final · de dieciseisavos a la gran final.
        </p>
      </header>

      {rounds.length === 0 ? (
        <div className="card p-10 text-center text-muted">
          <div className="text-3xl mb-2">🏟️</div>
          La fase de eliminación aún no comienza. El bracket aparecerá cuando se
          definan los clasificados de la fase de grupos.
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-6 min-w-max">
            {rounds.map((round) => (
              <section key={round.stage} className="flex flex-col gap-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-pitch">
                  {stageLabel(round.stage)}
                </h2>
                <div className="flex flex-col justify-around gap-4 flex-1">
                  {round.matches.map((m) => (
                    <BracketMatch key={m.id} match={m} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
