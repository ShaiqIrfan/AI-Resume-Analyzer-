interface ProfessionalSummaryProps {
  summary: string;
}

export default function ProfessionalSummary({ summary }: ProfessionalSummaryProps) {
  const safeSummary = summary && summary.trim().length > 0 ? summary : "Professional summary is not available.";

  return (
    <section
      aria-labelledby="professional-summary-heading"
      className="glass-panel w-full min-w-0 rounded-3xl border border-slate-700/90 bg-slate-900/75 p-6 shadow-[0_18px_45px_-24px_rgba(15,23,42,0.45)] transition-all duration-200 ease-out hover:-translate-y-1 hover:border-indigo-400/30 hover:shadow-[0_20px_50px_-24px_rgba(91,124,255,0.3)] sm:p-8 lg:p-9"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-lg text-indigo-200 ring-1 ring-indigo-400/20">
          ✦
        </div>
        <h2 id="professional-summary-heading" className="text-[1.7rem] font-semibold tracking-[-0.04em] text-slate-50 sm:text-[2rem]">
          Professional Summary
        </h2>
      </div>

      <p className="mt-5 max-w-4xl whitespace-pre-line text-base leading-8 text-slate-300 sm:text-lg">
        {safeSummary}
      </p>
    </section>
  );
}
