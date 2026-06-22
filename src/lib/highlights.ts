/**
 * Resúmenes en video por partido.
 *
 * Se mapean por PAREJA de equipos con sus códigos FIFA "LOCAL-VISITANTE"
 * (no por id numérico, que puede variar entre fuentes). Cada cruce de la fase
 * de grupos es único, así que la clave identifica el partido sin ambigüedad.
 *
 * El valor es el ID del video de YouTube (lo que va tras `youtu.be/`).
 * Para añadir más: "LOCAL-VISITANTE": "<idYouTube>",
 */
export const HIGHLIGHTS: Record<string, string> = {
  // ── Jornada 1 ──
  "MEX-RSA": "HwrArVbNHIk", // México vs Sudáfrica (Grupo A)
  "KOR-CZE": "VNqzGi7hJa8", // Corea del Sur vs Chequia (Grupo A)
  "CAN-BIH": "g6n7QBnX-44", // Canadá vs Bosnia y Herzegovina (Grupo B)
  "QAT-SUI": "xBaBlSFJlME", // Catar vs Suiza (Grupo B)
  "BRA-MAR": "JzA4IULX0-8", // Brasil vs Marruecos (Grupo C)
  "HAI-SCO": "aSgXhs4rQuw", // Haití vs Escocia (Grupo C)
  "USA-PAR": "xIpm0SPVE5Q", // Estados Unidos vs Paraguay (Grupo D)
  "AUS-TUR": "zs8NDu9Qrlo", // Australia vs Turquía (Grupo D)
  "GER-CUW": "JgzscZtu844", // Alemania vs Curazao (Grupo E)
  "CIV-ECU": "EFpDCoh4gLE", // Costa de Marfil vs Ecuador (Grupo E)
  "NED-JPN": "Fsf9KZUBUVw", // Países Bajos vs Japón (Grupo F)
  "SWE-TUN": "SwHQ94_E4hI", // Suecia vs Túnez (Grupo F)
  "BEL-EGY": "yNX-TVxzkX4", // Bélgica vs Egipto (Grupo G)
  "IRN-NZL": "ji5vbCWBL-E", // Irán vs Nueva Zelanda (Grupo G)
  "ESP-CPV": "LHi8EkHShmQ", // España vs Cabo Verde (Grupo H)
  "KSA-URU": "sMPVEzaa8ZI", // Arabia Saudita vs Uruguay (Grupo H)
  "FRA-SEN": "gvGSSat-N-I", // Francia vs Senegal (Grupo I)
  "IRQ-NOR": "PyGXQM3E4D8", // Irak vs Noruega (Grupo I)
  "ARG-ALG": "94AO9wbDSpM", // Argentina vs Argelia (Grupo J)
  "AUT-JOR": "8f4ZZyRTzvs", // Austria vs Jordania (Grupo J)
  "POR-COD": "8RKlFdSbnMU", // Portugal vs RD Congo (Grupo K)
  "UZB-COL": "4RnE5-Do1QY", // Uzbekistán vs Colombia (Grupo K)
  "ENG-CRO": "XvhHEEEEA78", // Inglaterra vs Croacia (Grupo L)
  "GHA-PAN": "e1rFFv9tOgo", // Ghana vs PAN (Grupo L)
  // ── Jornada 2 ──
  "CZE-RSA": "qnCKpAElRFU", // Chequia vs Sudáfrica (Grupo A)
  "MEX-KOR": "tppq94xvleY", // México vs Corea del Sur (Grupo A)
  "SUI-BIH": "ViKvPYn2weM", // Suiza vs Bosnia y Herzegovina (Grupo B)
  "CAN-QAT": "DXESoohf24w", // Canadá vs Catar (Grupo B)
  "SCO-MAR": "VXA3d-7SCcw", // Escocia vs Marruecos (Grupo C)
  "BRA-HAI": "FgESxWljObo", // Brasil vs Haití (Grupo C)
  "USA-AUS": "nqQ1iLzKLHk", // Estados Unidos vs Australia (Grupo D)
  "TUR-PAR": "vJLz1Y03M_k", // Turquía vs Paraguay (Grupo D)
  "NED-SWE": "xvERpOD_Tg4", // Países Bajos vs Suecia (Grupo F)
  "GER-CIV": "J8-mUQhW6xI", // Alemania vs Costa de Marfil (Grupo E)
  "ECU-CUW": "Y1SVWdbd7Fw", // Ecuador vs Curazao (Grupo E)
  "TUN-JPN": "-N9xFCOdscY", // Túnez vs Japón (Grupo F)
  "ESP-KSA": "xoPjpiaFUvY", // España vs Arabia Saudita (Grupo H)
  "BEL-IRN": "UG0hAMDwnnk", // Bélgica vs Irán (Grupo G)
  "URU-CPV": "b2g89AguAYI", // Uruguay vs Cabo Verde (Grupo H)
  "NZL-EGY": "dszT6Ug8wv8", // Nueva Zelanda vs Egipto (Grupo G)
  "ARG-AUT": "xwPOolZ4UqU", // Argentina vs Austria (Grupo J)
  "FRA-IRQ": "", // Francia vs Irak (Grupo I)
  "NOR-SEN": "", // Noruega vs Senegal (Grupo I)
  "JOR-ALG": "", // Jordania vs Argelia (Grupo J)
  "POR-UZB": "", // Portugal vs Uzbekistán (Grupo K)
  "COL-COD": "", // Colombia vs RD Congo (Grupo K)
  "ENG-GHA": "", // Inglaterra vs Ghana (Grupo L)
  "PAN-CRO": "", // PAN vs Croacia (Grupo L)
  // ── Jornada 3 ──
  "CZE-MEX": "", // Chequia vs México (Grupo A)
  "RSA-KOR": "", // Sudáfrica vs Corea del Sur (Grupo A)
  "SUI-CAN": "", // Suiza vs Canadá (Grupo B)
  "BIH-QAT": "", // Bosnia y Herzegovina vs Catar (Grupo B)
  "MAR-HAI": "", // Marruecos vs Haití (Grupo C)
  "SCO-BRA": "", // Escocia vs Brasil (Grupo C)
  "TUR-USA": "", // Turquía vs Estados Unidos (Grupo D)
  "PAR-AUS": "", // Paraguay vs Australia (Grupo D)
  "ECU-GER": "", // Ecuador vs Alemania (Grupo E)
  "CUW-CIV": "", // Curazao vs Costa de Marfil (Grupo E)
  "TUN-NED": "", // Túnez vs Países Bajos (Grupo F)
  "JPN-SWE": "", // Japón vs Suecia (Grupo F)
  "NZL-BEL": "", // Nueva Zelanda vs Bélgica (Grupo G)
  "EGY-IRN": "", // Egipto vs Irán (Grupo G)
  "URU-ESP": "", // Uruguay vs España (Grupo H)
  "CPV-KSA": "", // Cabo Verde vs Arabia Saudita (Grupo H)
  "NOR-FRA": "", // Noruega vs Francia (Grupo I)
  "SEN-IRQ": "", // Senegal vs Irak (Grupo I)
  "JOR-ARG": "", // Jordania vs Argentina (Grupo J)
  "ALG-AUT": "", // Argelia vs Austria (Grupo J)
  "COL-POR": "", // Colombia vs Portugal (Grupo K)
  "COD-UZB": "", // RD Congo vs Uzbekistán (Grupo K)
  "PAN-ENG": "", // PAN vs Inglaterra (Grupo L)
  "CRO-GHA": "", // Croacia vs Ghana (Grupo L)
};

/** Clave de un partido: códigos FIFA "LOCAL-VISITANTE". */
export function matchKey(homeCode: string, awayCode: string): string {
  return `${homeCode}-${awayCode}`;
}

/**
 * Busca el resumen sin depender del orden local/visitante: prueba ambos
 * sentidos, porque distintas fuentes pueden invertir quién es local.
 */
export function getHighlight(
  homeCode: string,
  awayCode: string,
): string | undefined {
  return (
    HIGHLIGHTS[`${homeCode}-${awayCode}`] ?? HIGHLIGHTS[`${awayCode}-${homeCode}`]
  );
}

/** Clave normalizada (orden alfabético) para emparejar sin importar el orden. */
export function pairKey(codeA: string, codeB: string): string {
  return [codeA, codeB].sort().join("-");
}
