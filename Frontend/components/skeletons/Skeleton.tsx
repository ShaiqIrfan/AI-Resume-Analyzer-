"use client";

import { motion, useReducedMotion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  rounded?: string;
}

export default function Skeleton({ className = "", rounded = "rounded-xl" }: SkeletonProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0.7 }}
      animate={
        shouldReduceMotion
          ? { opacity: 0.7 }
          : { opacity: [0.5, 0.9, 0.5] }
      }
      transition={{ duration: 1.5, ease: "easeInOut", repeat: shouldReduceMotion ? 0 : Infinity }}
      className={[
        "relative overflow-hidden bg-slate-800/80",
        rounded,
        className,
      ].join(" ")}
    />
  );
}
