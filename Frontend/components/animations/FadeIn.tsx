"use client";

import { motion, useReducedMotion, type Easing, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

import { animationDurations, animationEasings, getTransition } from "./animationConfig";

interface FadeInProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  initialOpacity?: number;
  finalOpacity?: number;
  duration?: number;
  delay?: number;
  easing?: Easing;
}

export default function FadeIn({
  children,
  initialOpacity = 0,
  finalOpacity = 1,
  duration = animationDurations.normal,
  delay = 0,
  easing = animationEasings.standard,
  className,
  ...props
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: initialOpacity }}
      animate={{ opacity: shouldReduceMotion ? 1 : finalOpacity }}
      transition={getTransition({ duration, delay, easing })}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
