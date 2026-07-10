export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-500">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-bold text-ink sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-2 text-ink-soft">{subtitle}</p>}
    </div>
  );
}
