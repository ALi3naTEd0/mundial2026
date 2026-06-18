import type { Metadata } from "next";
import { getHighlightFeed } from "@/lib/data";
import { HighlightsBrowser } from "@/components/highlights-browser";

export const metadata: Metadata = {
  title: "Resúmenes",
  description: "Resúmenes en video de los partidos del Mundial 2026.",
};

export const revalidate = 60;

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
        <HighlightsBrowser matches={matches} />
      )}
    </div>
  );
}
