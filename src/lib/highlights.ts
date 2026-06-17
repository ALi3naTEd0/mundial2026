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
  "MEX-RSA": "HwrArVbNHIk", // México vs Sudáfrica
  "KOR-CZE": "VNqzGi7hJa8", // Corea del Sur vs Chequia
  "CAN-BIH": "g6n7QBnX-44", // Canadá vs Bosnia y Herzegovina
  "USA-PAR": "xIpm0SPVE5Q", // Estados Unidos vs Paraguay
  "HAI-SCO": "aSgXhs4rQuw", // Haití vs Escocia
  "AUS-TUR": "zs8NDu9Qrlo", // Australia vs Turquía
  "BRA-MAR": "JzA4IULX0-8", // Brasil vs Marruecos
  "QAT-SUI": "xBaBlSFJlME", // Catar vs Suiza
  "CIV-ECU": "EFpDCoh4gLE", // Costa de Marfil vs Ecuador
  "GER-CUW": "JgzscZtu844", // Alemania vs Curazao
  "NED-JPN": "Fsf9KZUBUVw", // Países Bajos vs Japón
  "SWE-TUN": "SwHQ94_E4hI", // Suecia vs Túnez
  "IRN-NZL": "ji5vbCWBL-E", // Irán vs Nueva Zelanda
  "ESP-CPV": "LHi8EkHShmQ", // España vs Cabo Verde
  "BEL-EGY": "yNX-TVxzkX4", // Bélgica vs Egipto
  "KSA-URU": "sMPVEzaa8ZI", // Arabia Saudita vs Uruguay
  "FRA-SEN": "gvGSSat-N-I", // Francia vs Senegal
  "IRQ-NOR": "PyGXQM3E4D8", // Irak vs Noruega
  "ARG-ALG": "94AO9wbDSpM", // Argentina vs Argelia
  "AUT-JOR": "8f4ZZyRTzvs", // Austria vs Jordania
};

/** Clave de un partido para buscar su resumen: códigos FIFA "LOCAL-VISITANTE". */
export function matchKey(homeCode: string, awayCode: string): string {
  return `${homeCode}-${awayCode}`;
}
