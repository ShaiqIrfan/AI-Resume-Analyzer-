"use client";

import { motion, useReducedMotion, type Easing, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

import { animationDurations, animationEasings, animationOffsets, getTransition } from "./animationConfig";

interface SlideUpProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  duration?: number;
  delay?: number;
  offset?: number;
  easing?: Easing;
}

export default function SlideUp({
  children,
  duration = animationDurations.normal,
  delay = 0,
  offset = animationOffsets.default,
  easing = animationEasings.standard,
  className,
  ...props
}: SlideUpProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: offset }}
      animate={{ opacity: 1, y: 0 }}
      transition={getTransition({ duration, delay, easing })}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
