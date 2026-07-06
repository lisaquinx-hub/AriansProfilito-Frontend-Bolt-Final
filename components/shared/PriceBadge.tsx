'use client';

import { cn } from '@/lib/utils';

interface PriceBadgeProps {
  price: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PriceBadge({ price, size = 'md', className }: PriceBadgeProps) {
  const sizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <span className={cn('font-bold text-gradient', sizes[size], className)}>
      {price}
      <span className="text-muted-foreground text-xs mr-1 font-normal">تومان</span>
    </span>
  );
}
