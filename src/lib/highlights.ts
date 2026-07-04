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
  "FRA-IRQ": "g9jy0ztUETY", // Francia vs Irak (Grupo I)
  "NOR-SEN": "sZQaWnM3y14", // Noruega vs Senegal (Grupo I)
  "JOR-ALG": "wqYjV5kw91Q", // Jordania vs Argelia (Grupo J)
  "POR-UZB": "Ry5Nt4Nkzo0", // Portugal vs Uzbekistán (Grupo K)
  "ENG-GHA": "VLhZrONNe6A", // Inglaterra vs Ghana (Grupo L)
  "PAN-CRO": "xAGxyUihrqs", // PAN vs Croacia (Grupo L)
  "COL-COD": "wn4663aRr40", // Colombia vs RD Congo (Grupo K)
  // ── Jornada 3 ──
  "CZE-MEX": "EF0yu6xHcwk", // Chequia vs México (Grupo A)
  "RSA-KOR": "cQDEAhB6sDw", // Sudáfrica vs Corea del Sur (Grupo A)
  "SUI-CAN": "5lXEtxjhivc", // Suiza vs Canadá (Grupo B)
  "BIH-QAT": "tFYspnrWti0", // Bosnia y Herzegovina vs Catar (Grupo B)
  "MAR-HAI": "QYRsgIdqWtE", // Marruecos vs Haití (Grupo C)
  "SCO-BRA": "bvcLAP3oFJA", // Escocia vs Brasil (Grupo C)
  "TUR-USA": "yX1JDNyOdRs", // Turquía vs Estados Unidos (Grupo D)
  "PAR-AUS": "ikPxnevaEiM", // Paraguay vs Australia (Grupo D)
  "ECU-GER": "z8K-D8mqLAs", // Ecuador vs Alemania (Grupo E)
  "CUW-CIV": "U6X9Vb5ha8o", // Curazao vs Costa de Marfil (Grupo E)
  "TUN-NED": "m8WNqM5tCfM", // Túnez vs Países Bajos (Grupo F)
  "JPN-SWE": "f0cPH0AaALE", // Japón vs Suecia (Grupo F)
  "NZL-BEL": "GF1uG1SoRGo", // Nueva Zelanda vs Bélgica (Grupo G)
  "EGY-IRN": "idAyMEYRwno", // Egipto vs Irán (Grupo G)
  "URU-ESP": "4Y8Y6J3w0T8", // Uruguay vs España (Grupo H)
  "CPV-KSA": "mm1lbHbZ9-Q", // Cabo Verde vs Arabia Saudita (Grupo H)
  "NOR-FRA": "BaFhDXUASWY", // Noruega vs Francia (Grupo I)
  "SEN-IRQ": "kMmSrPphrMs", // Senegal vs Irak (Grupo I)
  "JOR-ARG": "jtUVvojNIsQ", // Jordania vs Argentina (Grupo J)
  "ALG-AUT": "IxcVGvan1mM", // Argelia vs Austria (Grupo J)
  "COL-POR": "kzjmcm4ANRo", // Colombia vs Portugal (Grupo K)
  "COD-UZB": "kcaKXpqmoEM", // RD Congo vs Uzbekistán (Grupo K)
  "PAN-ENG": "pEgvxdujnAc", // PAN vs Inglaterra (Grupo L)
  "CRO-GHA": "M7lCxwLa26g", // Croacia vs Ghana (Grupo L)
  // ── Dieciseisavos ──
  "RSA-CAN": "8jtXCl-Vx14", // Sudáfrica vs Canadá
  "BRA-JPN": "OeC9qZsNmx8", // Brasil vs Japón
  "GER-PAR": "PlNgIDwroD0", // Alemania vs Paraguay
  "NED-MAR": "hfqWxrqxRi0", // Países Bajos vs Marruecos
  "CIV-NOR": "YyYFSLdJ0DE", // Costa de Marfil vs Noruega
  "FRA-SWE": "6kg3Lg8qMh0", // Francia vs Suecia
  "MEX-ECU": "iCFwyDKzihA", // México vs Ecuador
  "ENG-COD": "OKa8WiywIIY", // Inglaterra vs RD Congo
  "BEL-SEN": "Qkq4BEgNnCU", // Bélgica vs Senegal
  "USA-BIH": "ih4uIIh5-YI", // Estados Unidos vs Bosnia y Herzegovina
  "ESP-AUT": "DCxwOjPpoA0", // España vs Austria
  "POR-CRO": "iDAv9hsBsck", // Portugal vs Croacia
  "SUI-ALG": "sVew3589r6s", // Suiza vs Argelia
  "AUS-EGY": "1i0d2cND820", // Australia vs Egipto
  "ARG-CPV": "m4w14Z0tU78", // Argentina vs Cabo Verde
  "COL-GHA": "LJarSr0GkOY", // Colombia vs Ghana
  // ── Octavos de final ──
  "CAN-MAR": "hx8ddpIxgmQ", // Canadá vs Marruecos
  "PAR-FRA": "", // Paraguay vs Francia
  "BRA-NOR": "", // Brasil vs Noruega
  "MEX-ENG": "", // México vs Inglaterra
  "USA-BEL": "", // Estados Unidos vs Bélgica
  "POR-ESP": "", // Portugal vs España
  "ARG-EGY": "", // Argentina vs Egipto
  "SUI-COL": "", // Suiza vs Colombia
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
