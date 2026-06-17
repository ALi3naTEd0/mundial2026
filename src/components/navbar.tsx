"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/grupos", label: "Grupos" },
  { href: "/eliminatorias", label: "Eliminatorias" },
  { href: "/partidos", label: "Partidos" },
  { href: "/goleadores", label: "Goleadores" },
  { href: "/resumenes", label: "Resúmenes" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="text-2xl" aria-hidden>
            🏆
          </span>
          <span className="font-bold tracking-tight text-lg leading-none">
            Mundial
            <span className="text-pitch">26</span>
          </span>
        </Link>

        <ul className="flex items-center gap-1 text-sm">
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    active
                      ? "bg-surface-2 text-foreground font-medium"
                      : "text-muted hover:text-foreground hover:bg-surface"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
