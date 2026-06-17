// Genera un snapshot de los datos del Mundial desde worldcup26.ir y lo guarda
// en src/data/wc-snapshot.json. Se ejecuta desde un entorno que SÍ alcanza el
// host (no Vercel). Para refrescar marcadores: `node scripts/snapshot.mjs`.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const BASE = process.env.WORLDCUP26_BASE ?? "https://worldcup26.ir";
const OUT = new URL("../src/data/wc-snapshot.json", import.meta.url).pathname;

async function get(path) {
  for (let i = 0; i < 5; i++) {
    try {
      const ac = AbortSignal.timeout(20000);
      const res = await fetch(`${BASE}/${path}`, { signal: ac });
      if (res.ok) {
        const json = await res.json();
        return json;
      }
    } catch {
      // reintentar
    }
    await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
  }
  throw new Error(`No se pudo obtener ${path}`);
}

const [teams, games, stadiums, groups] = await Promise.all([
  get("get/teams"),
  get("get/games"),
  get("get/stadiums"),
  get("get/groups"),
]);

const snapshot = {
  fetchedAt: new Date().toISOString(),
  teams: teams.teams ?? [],
  games: games.games ?? [],
  stadiums: stadiums.stadiums ?? [],
  groups: groups.groups ?? [],
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(snapshot));
console.log(
  `Snapshot guardado: ${snapshot.teams.length} equipos, ${snapshot.games.length} partidos, ${snapshot.stadiums.length} sedes, ${snapshot.groups.length} grupos`,
);
