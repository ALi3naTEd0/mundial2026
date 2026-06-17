"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Miniatura que, al hacer clic, abre el video en grande en un pop-up centrado
 * sobre un fondo oscuro semitransparente. Se cierra con Esc, con clic fuera o
 * con el botón. Usa portal al <body> para no quedar recortado por la tarjeta
 * (que tiene backdrop-filter) y bloquea el scroll de fondo mientras está abierto.
 */
export function VideoLightbox({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Reproducir resumen: ${title}`}
        className="group relative block aspect-video w-full overflow-hidden bg-black"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-live/90 shadow-lg transition-transform group-hover:scale-110">
          <svg viewBox="0 0 24 24" className="h-6 w-6 translate-x-0.5 fill-white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            onClick={() => setOpen(false)}
            className="lightbox-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="lightbox-panel relative w-full max-w-5xl"
            >
              <div className="mb-2 flex items-center justify-between gap-4">
                <span className="truncate text-sm font-medium text-white/90">
                  {title}
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20 transition-colors"
                  aria-label="Cerrar"
                >
                  ✕ Cerrar
                </button>
              </div>
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl ring-1 ring-white/10">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
