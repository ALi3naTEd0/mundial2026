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

/** ¿El partido pertenece a la categoría seleccionada? (jornada, grupo o fase) */
function matchInCategory(m: Match, cat: string): boolean {
  if (cat === "all") return true;
  const [type, val] = cat.split(":");
  if (type === "j") return m.stage === "group" && String(m.matchday) === val;
  if (type === "g") return m.group === val;
  if (type === "s") return m.stage === val;
  return true;
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

  // Opciones presentes en el feed, agrupadas por jornada, grupo y fase.
  const { jornadas, grupos, fases } = useMemo(() => {
    const j = new Set<number>();
    const g = new Set<string>();
    const s = new Set<Stage>();
    for (const m of matches) {
      if (m.stage === "group") {
        if (m.matchday) j.add(m.matchday);
        if (m.group) g.add(m.group);
      } else {
        s.add(m.stage);
      }
    }
    return {
      jornadas: [...j].sort((a, b) => a - b),
      grupos: [...g].sort(),
      fases: KNOCKOUT_ORDER.filter((st) => s.has(st)),
    };
  }, [matches]);

  const filtered = useMemo(
    () => matches.filter((m) => matchInCategory(m, cat)),
    [matches, cat],
  );

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
          {jornadas.length > 0 && (
            <optgroup label="Por jornada">
              {jornadas.map((j) => (
                <option key={`j:${j}`} value={`j:${j}`}>
                  Jornada {j}
                </option>
              ))}
            </optgroup>
          )}
          {grupos.length > 0 && (
            <optgroup label="Por grupo">
              {grupos.map((g) => (
                <option key={`g:${g}`} value={`g:${g}`}>
                  Grupo {g}
                </option>
              ))}
            </optgroup>
          )}
          {fases.length > 0 && (
            <optgroup label="Por fase">
              {fases.map((st) => (
                <option key={`s:${st}`} value={`s:${st}`}>
                  {stageLabel(st)}
                </option>
              ))}
            </optgroup>
          )}
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
