"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

import { animationDurations, animationEasings, animationOffsets, getTransition } from "./animationConfig";

interface PageTransitionProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  duration?: number;
  delay?: number;
  offset?: number;
}

export default function PageTransition({
  children,
  duration = animationDurations.slow,
  delay = 0,
  offset = animationOffsets.subtle,
  className,
  ...props
}: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: offset }}
      animate={{ opacity: 1, y: 0 }}
      transition={getTransition({ duration, delay, easing: animationEasings.emphasized })}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
