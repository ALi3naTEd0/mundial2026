import type { Metadata } from "next";
import { getMatches } from "@/lib/data";
import { MatchesBrowser } from "@/components/matches-browser";

export const metadata: Metadata = {
  title: "Partidos",
  description: "Calendario completo de partidos del Mundial 2026.",
};

export const revalidate = 30;

export default async function PartidosPage() {
  const matches = await getMatches();
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">Partidos</h1>
        <p className="text-muted mt-1">
          Calendario completo · filtra por grupo o estado.
        </p>
      </header>
      <MatchesBrowser matches={matches} />
    </div>
  );
}
