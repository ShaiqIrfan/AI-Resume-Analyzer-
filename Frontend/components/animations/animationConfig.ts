import type { Easing } from "framer-motion";

export const animationDurations = {
  fast: 0.2,
  normal: 0.35,
  slow: 0.5,
} as const;

export const animationEasings = {
  standard: [0.22, 1, 0.36, 1] as [number, number, number, number],
  emphasized: [0.16, 1, 0.3, 1] as [number, number, number, number],
  soft: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

export const animationStagger = {
  compact: 0.08,
  default: 0.12,
  relaxed: 0.16,
} as const;

export const animationOffsets = {
  subtle: 12,
  default: 20,
  large: 28,
} as const;

export type AnimationDurationKey = keyof typeof animationDurations;
export type AnimationEasingKey = keyof typeof animationEasings;
export type StaggerKey = keyof typeof animationStagger;

export const getTransition = ({
  duration = animationDurations.normal,
  delay = 0,
  easing = animationEasings.standard,
}: {
  duration?: number;
  delay?: number;
  easing?: Easing;
} = {}) => ({
  duration,
  delay,
  ease: easing,
});
