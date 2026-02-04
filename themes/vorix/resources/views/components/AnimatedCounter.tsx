'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  decimals?: number;
}

export default function AnimatedCounter({
  value,
  duration = 2000,
  suffix = '',
  prefix = '',
  className = '',
  decimals = 0
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5, once: true });

  useEffect(() => {
    if (!inView) return;

    let startTime: number | null = null;
    const endValue = typeof value === 'number' ? value : parseFloat(value);

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuad = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      setCount(easeOutQuad * endValue);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    requestAnimationFrame(animateCount);
  }, [inView, value, duration]);

  const displayValue = decimals > 0
    ? count.toFixed(decimals)
    : Math.floor(count).toString();

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="flex items-baseline space-x-1"
      >
        {prefix && (
          <span className="text-2xl md:text-3xl font-medium text-muted-foreground">
            {prefix}
          </span>
        )}
        <motion.span
          key={displayValue}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.1
          }}
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          {displayValue}
        </motion.span>
        {suffix && (
          <span className="text-2xl md:text-3xl font-medium text-muted-foreground">
            {suffix}
          </span>
        )}
      </motion.div>
    </div>
  );
}

// Usage examples:
/*
<AnimatedCounter value={100} suffix="+" />
<AnimatedCounter value={5000} prefix="$" />
<AnimatedCounter value={95.5} suffix="%" decimals={1} />
<AnimatedCounter value={42} suffix=" Projects" />
*/

export { AnimatedCounter };