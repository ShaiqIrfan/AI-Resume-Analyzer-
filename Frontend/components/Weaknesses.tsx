interface WeaknessesProps {
  items: string[];
  title?: string;
}

export default function Weaknesses({ items, title = "Weaknesses" }: WeaknessesProps) {
  return (
    <section className="w-full min-w-0 rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_18px_42px_-28px_rgba(251,191,36,0.28)] sm:p-7 lg:p-8">
      <h2 className="flex items-center gap-2 text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-50">
        <span className="text-amber-300">⚠</span>
        <span>{title}</span>
      </h2>
      {items.length > 0 ? (
        <ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-7 text-slate-200 sm:text-base">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-sm text-slate-400">No weaknesses available yet.</p>
      )}
    </section>
  );
}
