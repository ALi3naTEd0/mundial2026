"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/grupos", label: "Grupos" },
  { href: "/eliminatorias", label: "Eliminatorias" },
  { href: "/partidos", label: "Partidos" },
  { href: "/goleadores", label: "Goleadores" },
  { href: "/resumenes", label: "Resúmenes" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);

  // Cierra el menú móvil al cambiar de ruta (patrón de ajuste en render).
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setOpen(false);
  }

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

        {/* Enlaces en escritorio */}
        <ul className="hidden md:flex items-center gap-1 text-sm">
          {LINKS.map((link) => {
            const active = isActive(pathname, link.href);
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

        {/* Botón hamburguesa en móvil */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          className="md:hidden grid h-10 w-10 place-items-center rounded-lg text-foreground hover:bg-surface transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Panel desplegable en móvil */}
      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <ul className="px-4 py-2 flex flex-col">
            {LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block px-3 py-3 rounded-lg transition-colors ${
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
        </div>
      )}
    </header>
  );
}
