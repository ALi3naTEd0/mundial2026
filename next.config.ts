import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Fija la raíz del workspace a esta carpeta (evita que Next infiera otra
  // por lockfiles existentes en directorios superiores).
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // Logos de equipos de API-Football y miniaturas de YouTube.
    remotePatterns: [
      { protocol: "https", hostname: "media.api-sports.io" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "flagcdn.com" },
      { protocol: "https", hostname: "crests.football-data.org" },
    ],
  },
};

export default nextConfig;
