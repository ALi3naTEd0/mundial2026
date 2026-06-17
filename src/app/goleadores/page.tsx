import type { Metadata } from "next";
import { getTopScorers } from "@/lib/data";
import { TeamFlag } from "@/components/team-flag";

export const metadata: Metadata = {
  title: "Goleadores",
  description: "Tabla de goleadores del Mundial 2026.",
};

export const revalidate = 60;

export default async function GoleadoresPage() {
  const scorers = await getTopScorers(30);
  const max = scorers[0]?.goals ?? 1;

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">Goleadores</h1>
        <p className="text-muted mt-1">
          Máximos artilleros del torneo · la Bota de Oro en disputa.
        </p>
      </header>

      {scorers.length === 0 ? (
        <p className="text-muted text-center py-16">
          Aún no hay goles registrados.
        </p>
      ) : (
        <ol className="card divide-y divide-border overflow-hidden">
          {scorers.map((s, i) => (
            <li
              key={`${s.player}-${s.team.code}`}
              className="flex items-center gap-4 px-4 py-3"
            >
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-sm font-bold ${
                  i === 0
                    ? "bg-gold/20 text-gold"
                    : i < 3
                      ? "bg-pitch/15 text-pitch"
                      : "text-muted"
                }`}
              >
                {i + 1}
              </span>
              <TeamFlag team={s.team} size={22} />
              <div className="min-w-0 flex-1">
                <div className="font-semibold truncate">{s.player}</div>
                <div className="text-xs text-muted truncate">
                  {s.team.name}
                </div>
              </div>
              {/* Barra proporcional al goleador líder */}
              <div className="hidden sm:block w-32 h-2 rounded-full bg-surface-2 overflow-hidden">
                <div
                  className="h-full bg-pitch"
                  style={{ width: `${(s.goals / max) * 100}%` }}
                />
              </div>
              <span className="tabular-nums font-bold text-lg w-8 text-right">
                {s.goals}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
