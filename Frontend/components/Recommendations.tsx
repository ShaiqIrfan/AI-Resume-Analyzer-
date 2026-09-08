interface RecommendationsProps {
  items: string[];
  title?: string;
}

export default function Recommendations({ items, title = "Recommendations" }: RecommendationsProps) {
  return (
    <section className="w-full min-w-0 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_18px_42px_-28px_rgba(91,124,255,0.28)] sm:p-7 lg:p-8">
      <h2 className="text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-50">{title}</h2>
      {items.length > 0 ? (
        <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-7 text-slate-200 sm:text-base">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      ) : (
        <p className="mt-5 text-sm text-slate-400">No recommendations available yet.</p>
      )}
    </section>
  );
}
