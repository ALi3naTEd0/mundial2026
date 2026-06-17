import type { GroupId, Match, MatchStatus, Stage, Team } from "./types";

/**
 * Dataset mock del Mundial 2026 (48 equipos, 12 grupos A–L).
 * Genera todos los partidos de fase de grupos de forma determinista, así que
 * el dashboard se ve completo y "vivo" sin depender de ninguna API.
 *
 * Para datos reales: define las variables de entorno de API-Football
 * (ver src/lib/api.ts) y la capa de datos usará la API en su lugar.
 *
 * "Ahora mismo" simulado: 17 jun 2026, 18:30 (CDMX). En esta marca hay
 * partidos terminados, en vivo y por jugar.
 */
export const MOCK_NOW = new Date("2026-06-17T18:30:00-05:00");

interface Seed {
  name: string;
  code: string;
  flag: string;
}

// 12 grupos × 4 selecciones — SORTEO OFICIAL del Mundial 2026
// (Final Draw, 5 dic 2025, Washington D.C.). Anfitriones: MEX (A1),
// CAN (B1), USA (D1). Orden de slot = orden del bombo en el sorteo.
const GROUP_SEEDS: Record<GroupId, Seed[]> = {
  A: [
    { name: "México", code: "MEX", flag: "🇲🇽" },
    { name: "Sudáfrica", code: "RSA", flag: "🇿🇦" },
    { name: "Corea del Sur", code: "KOR", flag: "🇰🇷" },
    { name: "Chequia", code: "CZE", flag: "🇨🇿" },
  ],
  B: [
    { name: "Canadá", code: "CAN", flag: "🇨🇦" },
    { name: "Bosnia y Herzegovina", code: "BIH", flag: "🇧🇦" },
    { name: "Catar", code: "QAT", flag: "🇶🇦" },
    { name: "Suiza", code: "SUI", flag: "🇨🇭" },
  ],
  C: [
    { name: "Brasil", code: "BRA", flag: "🇧🇷" },
    { name: "Marruecos", code: "MAR", flag: "🇲🇦" },
    { name: "Haití", code: "HAI", flag: "🇭🇹" },
    { name: "Escocia", code: "SCO", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  ],
  D: [
    { name: "Estados Unidos", code: "USA", flag: "🇺🇸" },
    { name: "Paraguay", code: "PAR", flag: "🇵🇾" },
    { name: "Australia", code: "AUS", flag: "🇦🇺" },
    { name: "Turquía", code: "TUR", flag: "🇹🇷" },
  ],
  E: [
    { name: "Alemania", code: "GER", flag: "🇩🇪" },
    { name: "Curazao", code: "CUW", flag: "🇨🇼" },
    { name: "Costa de Marfil", code: "CIV", flag: "🇨🇮" },
    { name: "Ecuador", code: "ECU", flag: "🇪🇨" },
  ],
  F: [
    { name: "Países Bajos", code: "NED", flag: "🇳🇱" },
    { name: "Japón", code: "JPN", flag: "🇯🇵" },
    { name: "Suecia", code: "SWE", flag: "🇸🇪" },
    { name: "Túnez", code: "TUN", flag: "🇹🇳" },
  ],
  G: [
    { name: "Bélgica", code: "BEL", flag: "🇧🇪" },
    { name: "Egipto", code: "EGY", flag: "🇪🇬" },
    { name: "Irán", code: "IRN", flag: "🇮🇷" },
    { name: "Nueva Zelanda", code: "NZL", flag: "🇳🇿" },
  ],
  H: [
    { name: "España", code: "ESP", flag: "🇪🇸" },
    { name: "Cabo Verde", code: "CPV", flag: "🇨🇻" },
    { name: "Arabia Saudita", code: "KSA", flag: "🇸🇦" },
    { name: "Uruguay", code: "URU", flag: "🇺🇾" },
  ],
  I: [
    { name: "Francia", code: "FRA", flag: "🇫🇷" },
    { name: "Senegal", code: "SEN", flag: "🇸🇳" },
    { name: "Irak", code: "IRQ", flag: "🇮🇶" },
    { name: "Noruega", code: "NOR", flag: "🇳🇴" },
  ],
  J: [
    { name: "Argentina", code: "ARG", flag: "🇦🇷" },
    { name: "Argelia", code: "ALG", flag: "🇩🇿" },
    { name: "Austria", code: "AUT", flag: "🇦🇹" },
    { name: "Jordania", code: "JOR", flag: "🇯🇴" },
  ],
  K: [
    { name: "Portugal", code: "POR", flag: "🇵🇹" },
    { name: "RD Congo", code: "COD", flag: "🇨🇩" },
    { name: "Uzbekistán", code: "UZB", flag: "🇺🇿" },
    { name: "Colombia", code: "COL", flag: "🇨🇴" },
  ],
  L: [
    { name: "Inglaterra", code: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
    { name: "Croacia", code: "CRO", flag: "🇭🇷" },
    { name: "Ghana", code: "GHA", flag: "🇬🇭" },
    { name: "Panamá", code: "PAN", flag: "🇵🇦" },
  ],
};

// Una sede por grupo (estadios reales del Mundial 2026 en MEX/USA/CAN).
const VENUES: Record<GroupId, { venue: string; city: string }> = {
  A: { venue: "Estadio Azteca", city: "Ciudad de México" },
  B: { venue: "BMO Field", city: "Toronto" },
  C: { venue: "Estadio BBVA", city: "Monterrey" },
  D: { venue: "MetLife Stadium", city: "Nueva Jersey" },
  E: { venue: "SoFi Stadium", city: "Los Ángeles" },
  F: { venue: "AT&T Stadium", city: "Dallas" },
  G: { venue: "Mercedes-Benz Stadium", city: "Atlanta" },
  H: { venue: "Hard Rock Stadium", city: "Miami" },
  I: { venue: "Lincoln Financial Field", city: "Filadelfia" },
  J: { venue: "Levi's Stadium", city: "San Francisco" },
  K: { venue: "Estadio Akron", city: "Guadalajara" },
  L: { venue: "BC Place", city: "Vancouver" },
};

const GROUP_IDS: GroupId[] = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
];

// Construye la lista de equipos con ids estables (grupo*10 + índice).
export const TEAMS: Team[] = GROUP_IDS.flatMap((group, gi) =>
  GROUP_SEEDS[group].map((seed, ti) => ({
    id: gi * 10 + ti,
    name: seed.name,
    code: seed.code,
    flag: seed.flag,
    group,
  })),
);

const teamById = new Map(TEAMS.map((t) => [t.id, t]));

// PRNG determinista (mulberry32) para resultados estables entre recargas.
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function scoreFor(matchSeed: number): [number, number] {
  const r = rng(matchSeed);
  const buckets = [0, 0, 1, 1, 1, 2, 2, 3, 4];
  const h = buckets[Math.floor(r() * buckets.length)];
  const a = buckets[Math.floor(r() * buckets.length)];
  return [h, a];
}

// Emparejamientos round-robin para 4 equipos (índices 0–3) por jornada.
const ROUNDS: [number, number][][] = [
  [[0, 1], [2, 3]], // J1
  [[0, 2], [3, 1]], // J2
  [[0, 3], [1, 2]], // J3
];

// Día base (de junio) de cada jornada. Hoy (17 jun) cae en J2.
const MATCHDAY_BASE_DAY = [11, 17, 23];

// Pool de IDs de YouTube (PLACEHOLDER — reemplázalos por los resúmenes reales).
const HIGHLIGHT_POOL = [
  "1La4QzGeaaQ",
  "3pXVtuc9j1Q",
  "0J2QdDbelmY",
  "9bZkp7q19f0",
  "kXYiU_JCYtU",
  "L_jWHffIx5E",
];

function statusFor(kickoff: Date): { status: MatchStatus; minute?: number } {
  const FULL_MIN = 95;
  const diffMin = (MOCK_NOW.getTime() - kickoff.getTime()) / 60000;
  if (diffMin < 0) return { status: "scheduled" };
  if (diffMin >= FULL_MIN) return { status: "finished" };
  if (diffMin >= 45 && diffMin <= 60) return { status: "halftime", minute: 45 };
  return { status: "live", minute: Math.max(1, Math.floor(diffMin)) };
}

function buildGroupStage(): Match[] {
  const matches: Match[] = [];
  let id = 1000;

  GROUP_IDS.forEach((group, gi) => {
    const seeds = GROUP_SEEDS[group];
    const dayOffset = Math.floor(gi / 2); // 2 grupos por día
    const venue = VENUES[group];

    ROUNDS.forEach((round, mdIdx) => {
      round.forEach(([hIdx, aIdx], slot) => {
        // ISO con offset explícito del torneo (CDMX, -05:00) para que las
        // horas no dependan de la zona del servidor. Dos partidos por
        // grupo/jornada: 16:00 y 18:00.
        const day = MATCHDAY_BASE_DAY[mdIdx] + dayOffset;
        const hour = slot === 0 ? 16 : 18;
        const dd = String(day).padStart(2, "0");
        const hh = String(hour).padStart(2, "0");
        const kickoff = new Date(`2026-06-${dd}T${hh}:00:00-05:00`);

        const home = teamById.get(gi * 10 + hIdx)!;
        const away = teamById.get(gi * 10 + aIdx)!;
        const matchSeed = gi * 100 + mdIdx * 10 + slot + 7;
        const { status, minute } = statusFor(kickoff);

        let homeScore: number | null = null;
        let awayScore: number | null = null;
        let highlightYoutubeId: string | undefined;

        if (status !== "scheduled") {
          [homeScore, awayScore] = scoreFor(matchSeed);
        }
        if (status === "finished") {
          highlightYoutubeId = HIGHLIGHT_POOL[matchSeed % HIGHLIGHT_POOL.length];
        }

        matches.push({
          id: id++,
          stage: "group" as Stage,
          group,
          kickoff: kickoff.toISOString(),
          status,
          minute,
          venue: venue.venue,
          city: venue.city,
          home: { ...seeds[hIdx], ...home },
          away: { ...seeds[aIdx], ...away },
          homeScore,
          awayScore,
          highlightYoutubeId,
        });
      });
    });
  });

  return matches.sort((a, b) => a.kickoff.localeCompare(b.kickoff));
}

export const MOCK_MATCHES: Match[] = buildGroupStage();
