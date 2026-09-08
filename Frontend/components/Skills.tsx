"use client";

import { motion, useReducedMotion } from "framer-motion";

import StaggerContainer from "@/components/animations/StaggerContainer";
import { animationDurations, animationEasings } from "@/components/animations/animationConfig";

interface SkillsProps {
  items: string[];
  title?: string;
}

export default function Skills({ items, title = "Skills" }: SkillsProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="w-full min-w-0 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_18px_42px_-28px_rgba(91,124,255,0.28)] sm:p-7 lg:p-8">
      <h2 className="text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-50">{title}</h2>
      {items.length > 0 ? (
        <StaggerContainer className="mt-5 flex w-full min-w-0 flex-wrap gap-2.5" delay={0.04} stagger={0.06} duration={0.32} easing={animationEasings.soft}>
          {items.map((item) => (
            <motion.span
              key={item}
              initial={shouldReduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: animationDurations.normal, ease: animationEasings.soft }}
              whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.02 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 1.01 }}
              className="inline-flex max-w-full rounded-full border border-indigo-400/25 bg-indigo-500/10 px-3.5 py-1.75 text-sm font-medium leading-5 text-indigo-100 shadow-sm"
            >
              <span className="break-words">{item}</span>
            </motion.span>
          ))}
        </StaggerContainer>
      ) : (
        <p className="mt-5 text-sm text-slate-400">No skills available yet.</p>
      )}
    </section>
  );
}
