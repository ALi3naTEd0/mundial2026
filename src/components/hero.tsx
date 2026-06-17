function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="card px-4 py-3 text-center">
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      <div className="text-xs text-muted mt-0.5">{label}</div>
    </div>
  );
}

export function Hero({
  liveCount,
  played,
  total,
  goals,
}: {
  liveCount: number;
  played: number;
  total: number;
  goals: number;
}) {
  return (
    <section className="relative overflow-hidden rounded-[var(--radius-card)] border border-border">
      {/* Fondo con degradado de campo */}
      <div className="absolute inset-0 bg-gradient-to-br from-pitch-deep/30 via-surface to-surface" />
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-pitch/20 blur-3xl" />
      <div className="absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative p-6 sm:p-10">
        <div className="flex items-center gap-2 text-sm text-muted mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-pitch/15 px-3 py-1 font-medium text-pitch">
            {liveCount > 0 ? (
              <>
                <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-live" />
                {liveCount} en vivo
              </>
            ) : (
              "En curso"
            )}
          </span>
          <span>11 jun – 19 jul 2026</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none">
          Mundial <span className="text-pitch">2026</span>
        </h1>
        <p className="mt-3 max-w-xl text-muted">
          Marcadores en vivo, tablas, calendario y resúmenes en video. El primer
          Mundial con <strong className="text-foreground">48 selecciones</strong>,
          organizado por México, Estados Unidos y Canadá.
        </p>

        <div className="mt-6 flex gap-2 text-2xl" aria-hidden>
          🇲🇽 🇺🇸 🇨🇦
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
          <Stat value={liveCount} label="En vivo" />
          <Stat value={`${played}/${total}`} label="Partidos jugados" />
          <Stat value={goals} label="Goles totales" />
          <Stat value={48} label="Selecciones" />
        </div>
      </div>
    </section>
  );
}
