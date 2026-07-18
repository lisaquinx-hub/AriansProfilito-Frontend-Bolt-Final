import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
}

export default function GradientText({
  children,
  className,
  colors = ['#0284c7', '#2563eb', '#22d3ee', '#1d4ed8', '#0284c7'],
  animationSpeed = 7,
  showBorder = false,
}: GradientTextProps) {
  const style = {
    '--gradient-text-colors': colors.join(', '),
    '--gradient-text-speed': `${animationSpeed}s`,
  } as CSSProperties;

  return (
    <span
      className={cn('animated-gradient-text', showBorder && 'animated-gradient-text--bordered', className)}
      style={style}
    >
      <span className="animated-gradient-text__content">{children}</span>
    </span>
  );
}
