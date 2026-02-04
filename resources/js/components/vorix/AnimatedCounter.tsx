/**
 * AnimatedCounter Component - Placeholder
 */
export default function AnimatedCounter({ value = 0, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  return (
    <div className="text-4xl font-bold">
      {prefix}{value}{suffix}
    </div>
  );
}
