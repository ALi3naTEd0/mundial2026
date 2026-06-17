import "server-only";
import snapshot from "@/data/wc-snapshot.json";
import {
  buildBundle,
  bundleToMatches,
  bundleToStandings,
} from "./worldcup26";
import type { GroupStanding, Match, Team } from "./types";

/**
 * Proveedor basado en el snapshot local (src/data/wc-snapshot.json), generado
 * con `node scripts/snapshot.mjs` desde un entorno que sí alcanza worldcup26.ir
 * (Vercel NO puede llegar a ese host .ir, de ahí el snapshot).
 *
 * Es la fuente por defecto: 100% confiable, sin dependencia de red en runtime.
 * Para refrescar marcadores: regenerar el snapshot y volver a desplegar.
 */
const bundle = buildBundle(
  snapshot.teams,
  snapshot.games,
  snapshot.stadiums,
  snapshot.groups,
);

export function snapshotFetchedAt(): string {
  return snapshot.fetchedAt;
}

export async function snapMatches(): Promise<Match[]> {
  return bundleToMatches(bundle);
}

export async function snapTeams(): Promise<Team[]> {
  return [...bundle.teams.values()];
}

export async function snapStandings(): Promise<GroupStanding[]> {
  return bundleToStandings(bundle);
}
