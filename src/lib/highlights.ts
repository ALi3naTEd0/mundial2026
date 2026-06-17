/**
 * Resúmenes en video por partido.
 *
 * La API en vivo no entrega IDs de YouTube, así que se mapean a mano aquí.
 * La clave es el ID del partido (el `id` que ves en la URL /partidos/<id>)
 * y el valor es el ID del video de YouTube (lo que va después de `youtu.be/`
 * o de `watch?v=`).
 *
 * Para añadir más: <idPartido>: "<idYouTube>",
 */
export const HIGHLIGHTS: Record<number, string> = {
  1: "HwrArVbNHIk", // México vs Sudáfrica
  2: "VNqzGi7hJa8", // Corea del Sur vs Chequia
  3: "g6n7QBnX-44", // Canadá vs Bosnia y Herzegovina
  4: "xIpm0SPVE5Q", // Estados Unidos vs Paraguay
  5: "aSgXhs4rQuw", // Haití vs Escocia
  6: "zs8NDu9Qrlo", // Australia vs Turquía
  7: "JzA4IULX0-8", // Brasil vs Marruecos
  8: "xBaBlSFJlME", // Catar vs Suiza
  9: "EFpDCoh4gLE", // Costa de Marfil vs Ecuador
  10: "JgzscZtu844", // Alemania vs Curazao
  11: "Fsf9KZUBUVw", // Países Bajos vs Japón
  12: "SwHQ94_E4hI", // Suecia vs Túnez
  13: "ji5vbCWBL-E", // Irán vs Nueva Zelanda
  14: "LHi8EkHShmQ", // España vs Cabo Verde
  15: "yNX-TVxzkX4", // Bélgica vs Egipto
  16: "sMPVEzaa8ZI", // Arabia Saudita vs Uruguay
  17: "gvGSSat-N-I", // Francia vs Senegal
  18: "PyGXQM3E4D8", // Irak vs Noruega
  19: "94AO9wbDSpM", // Argentina vs Argelia
  20: "8f4ZZyRTzvs", // Austria vs Jordania
};
