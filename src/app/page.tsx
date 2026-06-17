import {
  getLiveMatches,
  getRecentResults,
  getStandings,
  getUpcomingMatches,
  getMatches,
} from "@/lib/data";
import { MatchCard } from "@/components/match-card";
import { SectionHeader } from "@/components/section-header";
import { StandingsTable } from "@/components/standings-table";
import { Hero } from "@/components/hero";

// Refresca para dar sensación "en vivo" (la API real revalida más fino).
export const revalidate = 30;

export default async function HomePage() {
  const [live, upcoming, recent, standings, all] = await Promise.all([
    getLiveMatches(),
    getUpcomingMatches(4),
    getRecentResults(4),
    getStandings(),
    getMatches(),
  ]);

  const totalGoals = all.reduce(
    (sum, m) => sum + (m.homeScore ?? 0) + (m.awayScore ?? 0),
    0,
  );
  const played = all.filter((m) => m.status === "finished").length;

  return (
    <div className="space-y-12">
      <Hero
        liveCount={live.length}
        played={played}
        total={all.length}
        goals={totalGoals}
      />

      {live.length > 0 && (
        <section>
          <SectionHeader
            title="En vivo ahora"
            subtitle="Partidos en juego en este momento"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {live.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}

      <section>
        <SectionHeader
          title="Próximos partidos"
          subtitle="Lo que viene en el calendario"
          href="/partidos"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {upcoming.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          title="Últimos resultados"
          subtitle="Resúmenes disponibles en cada partido"
          href="/resumenes"
          hrefLabel="Ver resúmenes"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recent.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          title="Tablas de grupos"
          subtitle="Posiciones actualizadas de los 12 grupos"
          href="/grupos"
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {standings.slice(0, 6).map((s) => (
            <StandingsTable key={s.group} standing={s} compact />
          ))}
        </div>
      </section>
    </div>
  );
}
