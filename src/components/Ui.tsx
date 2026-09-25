export function Kpi({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-fuchsia-400/20 bg-black/40 p-4 shadow-[0_0_40px_rgba(192,38,211,0.12)]">
      <p className="text-xs uppercase tracking-[0.18em] text-fuchsia-300/80">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
      {hint ? <p className="mt-1 text-sm text-zinc-400">{hint}</p> : null}
    </div>
  );
}

export function Panel({
  title,
  children,
  action,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-black/35 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
