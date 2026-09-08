"use client";

import { motion, useReducedMotion } from "framer-motion";

import {
  animationDurations,
  animationEasings,
  animationStagger,
  getTransition,
} from "@/components/animations/animationConfig";

export type LoadingStateStatus = "loading" | "success";

interface LoadingStateProps {
  status?: LoadingStateStatus;
}

const loadingSteps = [
  { label: "Extracting resume", complete: true },
  { label: "Understanding experience", complete: true },
  { label: "Evaluating skills", complete: false },
  { label: "Calculating ATS score", complete: false },
  { label: "Generating recommendations", complete: false },
];

export default function LoadingState({ status = "loading" }: LoadingStateProps) {
  const shouldReduceMotion = useReducedMotion();

  if (status === "success") {
    return (
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={getTransition({ duration: animationDurations.normal, easing: animationEasings.standard })}
        className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center shadow-[0_18px_38px_-24px_rgba(52,211,153,0.42)]"
        aria-live="polite"
        role="status"
      >
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={getTransition({ duration: animationDurations.normal, easing: animationEasings.emphasized })}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-3xl text-emerald-300 shadow-sm ring-1 ring-emerald-400/25"
        >
          ✓
        </motion.div>
        <p className="text-2xl font-semibold text-slate-50">Analysis Complete</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={getTransition({ duration: animationDurations.normal, easing: animationEasings.standard })}
      className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 text-left shadow-[0_20px_40px_-30px_rgba(79,70,229,0.45)] sm:p-8"
      aria-live="polite"
      aria-busy="true"
      role="status"
    >
      <div className="flex items-center justify-center">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={getTransition({ duration: animationDurations.normal, easing: animationEasings.standard })}
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-2xl text-indigo-200 shadow-sm ring-1 ring-indigo-500/30"
        >
          ✨
        </motion.div>
      </div>

      <p className="text-center text-[1.8rem] font-semibold tracking-[-0.04em] text-slate-50 sm:text-2xl">
        Analyzing Resume
      </p>

      <ul className="mt-6 space-y-3 sm:space-y-4">
        {loadingSteps.map((step, index) => {
          const isCurrent = index === 2;
          const isComplete = step.complete;

          return (
            <motion.li
              key={step.label}
              initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={getTransition({
                duration: animationDurations.fast,
                delay: index * animationStagger.compact,
                easing: animationEasings.soft,
              })}
              className="flex items-center gap-3 text-sm text-slate-300 sm:text-base"
            >
              <span
                className={[
                  "inline-flex h-5 w-5 items-center justify-center text-xs font-bold",
                  isComplete ? "text-emerald-300" : isCurrent ? "text-indigo-300" : "text-slate-500",
                ].join(" ")}
              >
                {isComplete ? "✓" : isCurrent ? <CurrentStepIndicator /> : "○"}
              </span>

              <span
                className={[
                  "transition-colors duration-200",
                  isCurrent ? "font-medium text-indigo-200" : isComplete ? "text-slate-200" : "text-slate-500",
                ].join(" ")}
              >
                {step.label}
              </span>
            </motion.li>
          );
        })}
      </ul>

      <p className="mt-6 text-center text-sm leading-6 text-slate-400">This may take a moment while we review your experience and fit.</p>
    </motion.div>
  );
}

function CurrentStepIndicator() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.span
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: [0.7, 1, 0.7], scale: [1, 1.08, 1] }}
      transition={{
        duration: 1.6,
        ease: "easeInOut",
        repeat: shouldReduceMotion ? 0 : Infinity,
      }}
      className="inline-flex h-2.5 w-2.5 rounded-full border border-indigo-400 bg-indigo-400"
      aria-hidden="true"
    />
  );
}
