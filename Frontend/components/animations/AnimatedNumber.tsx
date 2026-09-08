"use client";

import { animate, useMotionValue, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import { animationDurations, animationEasings } from "./animationConfig";

interface AnimatedNumberProps {
  value: number;
  startValue?: number;
  duration?: number;
  decimalPlaces?: number;
  className?: string;
}

export default function AnimatedNumber({
  value,
  startValue = 0,
  duration = animationDurations.normal,
  decimalPlaces = 0,
  className,
}: AnimatedNumberProps) {
  const shouldReduceMotion = useReducedMotion();
  const motionValue = useMotionValue(startValue);
  const [displayValue, setDisplayValue] = useState<number>(startValue);

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    const controls = animate(motionValue, value, {
      duration,
      ease: animationEasings.standard,
      onUpdate: (latest) => {
        setDisplayValue(Number(latest.toFixed(decimalPlaces)));
      },
    });

    return () => {
      controls.stop();
    };
  }, [decimalPlaces, duration, motionValue, shouldReduceMotion, value]);

  const currentValue = shouldReduceMotion ? value : displayValue;
  const formattedValue =
    decimalPlaces > 0 ? currentValue.toFixed(decimalPlaces) : Math.round(currentValue).toString();

  return <span className={className}>{formattedValue}</span>;
}
