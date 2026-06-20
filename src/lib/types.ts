// Modelo de dominio del dashboard. Independiente de la API que lo alimente
// (API-Football o el dataset mock), para poder cambiar de fuente sin tocar la UI.

export type GroupId =
  | "A" | "B" | "C" | "D" | "E" | "F"
  | "G" | "H" | "I" | "J" | "K" | "L";

export interface Team {
  id: number;
  name: string;
  code: string; // ISO-ish de 3 letras, ej. "ARG"
  flag: string; // emoji bandera o URL
  group: GroupId;
}

export type MatchStatus =
  | "scheduled" // aún no empieza
  | "live" // en juego
  | "halftime" // descanso
  | "finished"; // terminado

export type Stage =
  | "group"
  | "round32"
  | "round16"
  | "quarter"
  | "semi"
  | "third"
  | "final";

export interface Scorer {
  /** equipo al que pertenece el gol */
  side: "home" | "away";
  player: string;
  minute?: number;
}

export interface Match {
  id: number;
  stage: Stage;
  group?: GroupId;
  /** jornada dentro de la fase de grupos (1, 2 o 3) */
  matchday?: number;
  /** ISO 8601 con zona, ej. "2026-06-17T19:00:00-05:00" */
  kickoff: string;
  status: MatchStatus;
  /** minuto actual si está en vivo */
  minute?: number;
  venue: string;
  city: string;
  home: Team;
  away: Team;
  homeScore: number | null;
  awayScore: number | null;
  /** goleadores del partido (con minuto si se conoce) */
  scorers?: Scorer[];
  /** ID de video de YouTube del resumen, si existe */
  highlightYoutubeId?: string;
}

export interface TopScorer {
  player: string;
  team: Team;
  goals: number;
}

export interface StandingRow {
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  /** posición dentro del grupo (1-4) */
  rank: number;
}

export interface GroupStanding {
  group: GroupId;
  rows: StandingRow[];
}
