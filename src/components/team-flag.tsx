import type { Team } from "@/lib/types";

/**
 * Muestra la bandera de un equipo. Soporta tanto emoji (datos mock) como
 * URL de logo (API-Football), así que funciona con cualquiera de las fuentes.
 */
export function TeamFlag({
  team,
  size = 22,
}: {
  team: Team;
  size?: number;
}) {
  const isUrl = team.flag.startsWith("http");
  if (isUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={team.flag}
        alt=""
        width={size}
        height={size}
        className="inline-block rounded-sm object-contain"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden
      style={{ fontSize: size * 0.9, lineHeight: 1 }}
      className="inline-block"
    >
      {team.flag}
    </span>
  );
}

export function TeamLabel({
  team,
  size = 22,
  className = "",
  showCode = false,
}: {
  team: Team;
  size?: number;
  className?: string;
  showCode?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2 min-w-0 ${className}`}>
      <TeamFlag team={team} size={size} />
      <span className="truncate">{showCode ? team.code : team.name}</span>
    </span>
  );
}
