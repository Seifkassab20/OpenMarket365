'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useScrollTrigger } from '@/lib/hooks/useScrollTrigger';

interface AnimatedCounterProps {
  value?: number;
  end?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  className?: string;
  scrollTrigger?: boolean;
}

export default function AnimatedCounter({
  value,
  end,
  duration = 1400,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = ',',
  className = '',
  scrollTrigger = true,
}: AnimatedCounterProps) {
  const target = end !== undefined ? end : value !== undefined ? value : 0;
  const [displayValue, setDisplayValue] = useState<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef<number>(0);
  const frameRef = useRef<number | null>(null);
  const hasTriggeredRef = useRef(false);

  const { ref, isVisible } = useScrollTrigger<HTMLSpanElement>({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    // If scroll-trigger is active, wait until element scrolls into view
    if (scrollTrigger && !isVisible && !hasTriggeredRef.current) {
      return;
    }
    hasTriggeredRef.current = true;

    startValueRef.current = displayValue;
    startTimeRef.current = null;

    const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);

      const current = startValueRef.current + (target - startValueRef.current) * easedProgress;
      setDisplayValue(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(target);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, isVisible, scrollTrigger]);

  const formatNumber = (num: number): string => {
    const fixed = num.toFixed(decimals);
    const [intPart, decPart] = fixed.split('.');
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
  };

  return (
    <span ref={ref} className={`inline-block font-mono tracking-tight ${className}`}>
      {prefix}
      {formatNumber(displayValue)}
      {suffix}
    </span>
  );
}
