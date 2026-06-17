import type { Metadata } from "next";
import { getStandings } from "@/lib/data";
import { StandingsTable } from "@/components/standings-table";

export const metadata: Metadata = {
  title: "Grupos",
  description: "Tablas de posiciones de los 12 grupos del Mundial 2026.",
};

export const revalidate = 30;

export default async function GruposPage() {
  const standings = await getStandings();

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">Fase de grupos</h1>
        <p className="text-muted mt-1">
          12 grupos · clasifican los 2 primeros de cada grupo y los 8 mejores
          terceros a la fase de eliminación.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-pitch" /> Clasifica directo
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gold" /> Posible mejor tercero
          </span>
        </div>
      </header>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {standings.map((s) => (
          <StandingsTable key={s.group} standing={s} />
        ))}
      </div>
    </div>
  );
}
