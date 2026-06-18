"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Match, Stage } from "@/lib/types";
import { VideoLightbox } from "./video-lightbox";
import { TeamFlag } from "./team-flag";
import { StatusBadge } from "./status-badge";
import { formatKickoffDate, matchLabel, stageLabel } from "@/lib/format";

const KNOCKOUT_ORDER: Stage[] = [
  "round32",
  "round16",
  "quarter",
  "semi",
  "third",
  "final",
];

/** Categoría de un partido para el filtro: grupo o fase. */
function categoryOf(m: Match): { key: string; label: string } {
  if (m.stage === "group" && m.group) {
    return { key: `g:${m.group}`, label: `Grupo ${m.group}` };
  }
  return { key: `s:${m.stage}`, label: stageLabel(m.stage) };
}

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

export function HighlightsBrowser({ matches }: { matches: Match[] }) {
  const [cat, setCat] = useState<string>("all");

  // Opciones presentes en el feed, ordenadas: grupos A–L y luego fases.
  const options = useMemo(() => {
    const seen = new Map<string, string>();
    for (const m of matches) {
      const c = categoryOf(m);
      if (!seen.has(c.key)) seen.set(c.key, c.label);
    }
    const entries = [...seen.entries()];
    const rank = (key: string) => {
      if (key.startsWith("g:")) return key.charCodeAt(2); // por letra de grupo
      const stage = key.slice(2) as Stage;
      return 1000 + KNOCKOUT_ORDER.indexOf(stage);
    };
    return entries.sort((a, b) => rank(a[0]) - rank(b[0]));
  }, [matches]);

  const filtered = useMemo(() => {
    if (cat === "all") return matches;
    return matches.filter((m) => categoryOf(m).key === cat);
  }, [matches, cat]);

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <label htmlFor="cat-filter" className="text-sm text-muted">
          Filtrar:
        </label>
        <select
          id="cat-filter"
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground focus:border-pitch focus:outline-none"
        >
          <option value="all">Todos los partidos</option>
          {options.map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <span className="text-sm text-muted">{filtered.length}</span>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted text-center py-16">
          No hay partidos en esta categoría.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
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
