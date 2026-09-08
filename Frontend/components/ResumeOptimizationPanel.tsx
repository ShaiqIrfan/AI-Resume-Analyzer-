import type { ResumeOptimization } from "@/types/analysis";

interface ResumeOptimizationPanelProps {
  optimization: ResumeOptimization;
}

function ComparisonRow({
  label,
  original,
  optimized,
  notes,
}: {
  label: string;
  original: string;
  optimized: string;
  notes: string[];
}) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-5">
      <h3 className="mb-4 text-lg font-semibold tracking-[-0.03em] text-slate-50">{label}</h3>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-slate-400">Original</p>
          <p className="whitespace-pre-line text-sm leading-7 text-slate-300">{original}</p>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-emerald-300">Optimized</p>
          <p className="whitespace-pre-line text-sm leading-7 text-emerald-100">{optimized}</p>
        </div>
      </div>

      {notes.length > 0 ? (
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function BeforeAfterComparison({ optimization }: ResumeOptimizationPanelProps) {
  const items = optimization.before_after_comparison?.filter((item) => item && (item.original_text || item.optimized_text)) ?? [];

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-lg text-indigo-200 ring-1 ring-indigo-400/20">
          ↔
        </div>
        <div>
          <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-50">Before vs After</h3>
          <p className="text-sm text-slate-300">Clear original-to-optimized examples from the resume rewrite.</p>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={`${item.section}-${index}`} className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-indigo-200">{item.section}</p>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">Before</p>
                <p className="whitespace-pre-line text-sm leading-7 text-slate-300">{item.original_text || "—"}</p>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-emerald-300">After</p>
                <p className="whitespace-pre-line text-sm leading-7 text-emerald-100">{item.optimized_text || "—"}</p>
              </div>
            </div>

            {item.reason_for_change ? (
              <p className="mt-3 text-sm leading-6 text-slate-300">
                <span className="font-semibold text-slate-100">Why this changed:</span> {item.reason_for_change}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResumeOptimizationPanel({ optimization }: ResumeOptimizationPanelProps) {
  return (
    <section className="w-full min-w-0 rounded-3xl border border-indigo-500/20 bg-slate-900/80 p-6 shadow-[0_18px_45px_-24px_rgba(99,102,241,0.34)] sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-xl text-indigo-200 ring-1 ring-indigo-400/20">
          ✨
        </div>
        <div>
          <h2 className="text-[1.6rem] font-semibold tracking-[-0.04em] text-slate-50 sm:text-[2rem]">AI Resume Optimization</h2>
          <p className="text-sm text-slate-300">Improves wording and professional clarity while preserving the original facts.</p>
        </div>
      </div>

      <div className="space-y-5">
        <ComparisonRow
          label="Professional Summary"
          original={optimization.professional_summary.original}
          optimized={optimization.professional_summary.optimized}
          notes={optimization.professional_summary.notes}
        />

        <ComparisonRow
          label="Experience"
          original={optimization.experience.original}
          optimized={optimization.experience.optimized}
          notes={optimization.experience.notes}
        />

        <ComparisonRow
          label="Skills"
          original={optimization.skills.original}
          optimized={optimization.skills.optimized}
          notes={optimization.skills.notes}
        />

        <ComparisonRow
          label="Bullet Points"
          original={optimization.bullet_points.original}
          optimized={optimization.bullet_points.optimized}
          notes={optimization.bullet_points.notes}
        />
      </div>

      <BeforeAfterComparison optimization={optimization} />

      {optimization.optimization_notes.length > 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-slate-400">Optimization notes</p>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-200">
            {optimization.optimization_notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-100">
        <span className="font-semibold text-amber-200">Authoritative ATS rule:</span> The deterministic ATS score remains the source of truth. Gemini improves wording only; it does not replace ATS scoring.
      </div>
    </section>
  );
}
