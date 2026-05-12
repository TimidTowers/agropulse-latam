"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, animate } from "framer-motion";

interface CounterProps {
  value: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function Counter({
  value,
  duration = 1.6,
  format,
  className,
  prefix = "",
  suffix = "",
}: CounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const motionVal = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionVal, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => {
        const n = Math.round(latest);
        setDisplay(format ? format(n) : n.toLocaleString("es-MX"));
      },
    });
    return () => controls.stop();
  }, [inView, value, duration, format, motionVal]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
