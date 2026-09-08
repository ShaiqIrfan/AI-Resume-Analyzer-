"use client";

import { motion, useReducedMotion } from "framer-motion";

import AnimatedNumber from "@/components/animations/AnimatedNumber";
import { animationDurations, animationEasings } from "@/components/animations/animationConfig";
import type { ATSAnalysis } from "@/types/analysis";

interface ATSScoreProps {
  ats: ATSAnalysis;
}

const scoreBreakdown = [
  { label: "Keyword Optimization", value: "keyword_score", max: 30 },
  { label: "Structure", value: "structure_score", max: 20 },
  { label: "Completeness", value: "completeness_score", max: 20 },
  { label: "Skills Relevance", value: "skills_score", max: 20 },
  { label: "Readability", value: "readability_score", max: 10 },
] as const;

export default function ATSScore({ ats }: ATSScoreProps) {
  const safeScore = Number.isFinite(ats.score) ? ats.score : 0;
  const numericScore = Math.min(Math.max(safeScore, 0), 100);
  const decimalPlaces = Number.isInteger(numericScore) ? 0 : 1;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="ats-score-heading"
      className="glass-panel-strong w-full min-w-0 rounded-3xl border border-indigo-400/20 bg-slate-900/80 p-6 shadow-[0_18px_45px_-24px_rgba(15,23,42,0.45)] transition-all duration-200 ease-out hover:-translate-y-1 hover:border-indigo-400/35 hover:shadow-[0_20px_50px_-24px_rgba(91,124,255,0.3)] sm:p-8 lg:p-9"
    >
      <div className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-200">
          Your Resume
        </p>
        <h2 id="ats-score-heading" className="text-2xl font-semibold text-slate-50 sm:text-[2rem]">
          ATS Score
        </h2>
      </div>

      <div className="mt-7 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/15 to-violet-500/15 p-6 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-200">
          Total Score
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-2" aria-live="polite">
          <AnimatedNumber
            value={numericScore}
            className="text-4xl font-bold tracking-[-0.05em] text-slate-50 sm:text-5xl lg:text-6xl"
            decimalPlaces={decimalPlaces}
          />
          <span className="pb-1 text-lg font-medium text-slate-300 sm:pb-2 sm:text-xl">/ 100</span>
        </div>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        {scoreBreakdown.map((metric) => {
          const metricValue = ats[metric.value];
          const progressWidth = Math.min(Math.max((metricValue / metric.max) * 100, 0), 100);
          const safeMetricValue = Number.isFinite(metricValue) ? metricValue : 0;
          const clampedMetricValue = Math.min(Math.max(safeMetricValue, 0), metric.max);
          const percentageValue = (clampedMetricValue / metric.max) * 100;

          return (
            <motion.div
              key={metric.label}
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: animationDurations.normal, ease: animationEasings.soft }}
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-200">{metric.label}</p>
                <p className="text-sm font-semibold text-slate-50">
                  {metricValue} / {metric.max}
                </p>
              </div>

              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-800" aria-label={`${metric.label} progress`}>
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                  initial={shouldReduceMotion ? { width: `${progressWidth}%` } : { width: 0 }}
                  animate={{ width: `${progressWidth}%` }}
                  transition={{ duration: 0.9, ease: animationEasings.standard }}
                  aria-hidden="true"
                />
              </div>

              {shouldReduceMotion ? null : (
                <div className="sr-only" aria-live="polite">
                  {metric.label} {percentageValue.toFixed(0)} percent
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {ats.issues && ats.issues.length > 0 ? (
        <div className="mt-7 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 sm:p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-200">
            ATS Issues
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-200">
            {ats.issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
