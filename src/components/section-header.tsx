import Link from "next/link";

export function SectionHeader({
  title,
  subtitle,
  href,
  hrefLabel = "Ver todo",
}: {
  title: string;
  subtitle?: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-muted mt-0.5">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="text-sm text-pitch hover:text-pitch-deep font-medium shrink-0 transition-colors"
        >
          {hrefLabel} →
        </Link>
      )}
    </div>
  );
}
