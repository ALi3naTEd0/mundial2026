/**
 * Nombres de selección en español por código FIFA (3 letras).
 * Se usa para traducir los nombres que las APIs entregan en inglés.
 * Incluye los 48 clasificados del Mundial 2026 más alias de códigos
 * alternativos que algunas APIs usan (DEU/GER, DZA/ALG, etc.).
 */
export const TEAM_NAMES_ES: Record<string, string> = {
  MEX: "México",
  RSA: "Sudáfrica",
  KOR: "Corea del Sur",
  CZE: "Chequia",
  CAN: "Canadá",
  BIH: "Bosnia y Herzegovina",
  QAT: "Catar",
  SUI: "Suiza",
  BRA: "Brasil",
  MAR: "Marruecos",
  HAI: "Haití",
  SCO: "Escocia",
  USA: "Estados Unidos",
  PAR: "Paraguay",
  AUS: "Australia",
  TUR: "Turquía",
  GER: "Alemania",
  CUW: "Curazao",
  CIV: "Costa de Marfil",
  ECU: "Ecuador",
  NED: "Países Bajos",
  JPN: "Japón",
  SWE: "Suecia",
  TUN: "Túnez",
  BEL: "Bélgica",
  EGY: "Egipto",
  IRN: "Irán",
  NZL: "Nueva Zelanda",
  ESP: "España",
  CPV: "Cabo Verde",
  KSA: "Arabia Saudita",
  URU: "Uruguay",
  FRA: "Francia",
  SEN: "Senegal",
  IRQ: "Irak",
  NOR: "Noruega",
  ARG: "Argentina",
  ALG: "Argelia",
  AUT: "Austria",
  JOR: "Jordania",
  POR: "Portugal",
  COD: "RD Congo",
  UZB: "Uzbekistán",
  COL: "Colombia",
  ENG: "Inglaterra",
  CRO: "Croacia",
  GHA: "Ghana",
  PAN: "Panamá",

  // Alias de códigos que difieren entre proveedores
  DEU: "Alemania",
  DZA: "Argelia",
  NLD: "Países Bajos",
  KSA_: "Arabia Saudita",
  SRB: "Serbia",
  POL: "Polonia",
};

/** Devuelve el nombre en español si se conoce el código; si no, el original. */
export function nameES(fifaCode: string | undefined, fallback: string): string {
  if (!fifaCode) return fallback;
  return TEAM_NAMES_ES[fifaCode.toUpperCase()] ?? fallback;
}
