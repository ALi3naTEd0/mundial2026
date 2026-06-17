import type { Match, Stage } from "./types";

const STAGE_LABELS: Record<Stage, string> = {
  group: "Fase de grupos",
  round32: "Dieciseisavos",
  round16: "Octavos de final",
  quarter: "Cuartos de final",
  semi: "Semifinal",
  third: "Tercer puesto",
  final: "Final",
};

export function stageLabel(stage: Stage): string {
  return STAGE_LABELS[stage];
}

export function matchLabel(m: Match): string {
  if (m.stage === "group" && m.group) return `Grupo ${m.group}`;
  return stageLabel(m.stage);
}

const TZ = "America/Mexico_City";

export function formatKickoffTime(iso: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TZ,
  }).format(new Date(iso));
}

export function formatKickoffDate(iso: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: TZ,
  }).format(new Date(iso));
}

/** Clave de día (yyyy-mm-dd en zona del torneo) para agrupar el calendario. */
export function dayKey(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: TZ,
  }).format(new Date(iso));
}

export function formatLongDate(iso: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: TZ,
  }).format(new Date(iso));
}
