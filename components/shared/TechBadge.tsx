'use client';

import { cn } from '@/lib/utils';

interface TechBadgeProps {
  name: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function TechBadge({ name, size = 'md', className }: TechBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 rounded font-medium bg-muted text-muted-foreground',
        size === 'sm' ? 'text-xs' : 'text-sm',
        className
      )}
    >
      {name}
    </span>
  );
}
