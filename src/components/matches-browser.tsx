"use client";

import { useMemo, useState } from "react";
import type { GroupId, Match } from "@/lib/types";
import { MatchCard } from "./match-card";
import { formatLongDate, dayKey } from "@/lib/format";

type StatusFilter = "all" | "live" | "scheduled" | "finished";

const GROUPS: GroupId[] = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-pitch text-background"
          : "bg-surface border border-border text-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

export function MatchesBrowser({ matches }: { matches: Match[] }) {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [group, setGroup] = useState<GroupId | "all">("all");
  const [date, setDate] = useState<string>("all");

  // Fechas disponibles (clave de día + etiqueta legible), en orden.
  const dates = useMemo(() => {
    const map = new Map<string, string>();
    for (const m of matches) {
      const k = dayKey(m.kickoff);
      if (!map.has(k)) map.set(k, formatLongDate(m.kickoff));
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [matches]);

  const filtered = useMemo(() => {
    return matches.filter((m) => {
      if (group !== "all" && m.group !== group) return false;
      if (date !== "all" && dayKey(m.kickoff) !== date) return false;
      if (status === "all") return true;
      if (status === "live")
        return m.status === "live" || m.status === "halftime";
      return m.status === status;
    });
  }, [matches, status, group, date]);

  // Agrupa por día del torneo
  const byDay = useMemo(() => {
    const map = new Map<string, Match[]>();
    for (const m of filtered) {
      const k = dayKey(m.kickoff);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(m);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  return (
    <div>
      <div className="space-y-3 mb-8">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", "Todos"],
              ["live", "En vivo"],
              ["scheduled", "Por jugar"],
              ["finished", "Finalizados"],
            ] as [StatusFilter, string][]
          ).map(([value, label]) => (
            <Chip
              key={value}
              active={status === value}
              onClick={() => setStatus(value)}
            >
              {label}
            </Chip>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Chip active={group === "all"} onClick={() => setGroup("all")}>
            Todos los grupos
          </Chip>
          {GROUPS.map((g) => (
            <Chip key={g} active={group === g} onClick={() => setGroup(g)}>
              {g}
            </Chip>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="date-filter" className="text-sm text-muted">
            Fecha:
          </label>
          <select
            id="date-filter"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground capitalize focus:border-pitch focus:outline-none"
          >
            <option value="all">Todas las fechas</option>
            {dates.map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {byDay.length === 0 ? (
        <p className="text-muted text-center py-16">
          No hay partidos con estos filtros.
        </p>
      ) : (
        <div className="space-y-10">
          {byDay.map(([day, dayMatches]) => (
            <section key={day}>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted mb-4 sticky top-16 bg-background/80 backdrop-blur-sm py-1 z-10">
                {formatLongDate(dayMatches[0].kickoff)}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dayMatches.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
