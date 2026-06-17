import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mundial 2026 · Dashboard",
    short_name: "Mundial 26",
    description:
      "Marcadores en vivo, tablas, calendario, goleadores y resúmenes del Mundial 2026.",
    start_url: "/",
    display: "standalone",
    background_color: "#07100d",
    theme_color: "#16c47f",
    lang: "es",
    categories: ["sports"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
