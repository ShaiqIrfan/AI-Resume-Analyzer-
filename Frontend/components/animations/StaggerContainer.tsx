"use client";

import { motion, useReducedMotion, type Easing, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

import { animationDurations, animationEasings, animationStagger, getTransition } from "./animationConfig";

interface StaggerContainerProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  stagger?: number;
  duration?: number;
  easing?: Easing;
}

export default function StaggerContainer({
  children,
  delay = 0,
  stagger = animationStagger.default,
  duration = animationDurations.normal,
  easing = animationEasings.standard,
  className,
  ...props
}: StaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = shouldReduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: delay,
            staggerChildren: stagger,
          },
        },
      };

  const itemVariants = shouldReduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 18 },
        visible: {
          opacity: 1,
          y: 0,
          transition: getTransition({ duration, easing }),
        },
      };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
      {...props}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : (
            <motion.div variants={itemVariants}>{children}</motion.div>
          )}
    </motion.div>
  );
}
