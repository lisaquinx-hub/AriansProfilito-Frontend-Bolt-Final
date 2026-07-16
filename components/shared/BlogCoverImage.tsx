'use client';

import { useEffect, useMemo, useState } from 'react';
import { resolveAssetUrl } from '@/lib/api-utils';
import { cn } from '@/lib/utils';

interface BlogCoverImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
  eager?: boolean;
}

function resolveSafeImageUrl(value?: string | null): string | null {
  const resolved = resolveAssetUrl(value);
  if (!resolved) return null;

  try {
    const url = new URL(resolved);
    if (url.protocol === 'https:') return url.toString();
    if (process.env.NODE_ENV === 'development' && url.protocol === 'http:') {
      return url.toString();
    }
  } catch {
    return null;
  }

  return null;
}

export function BlogCoverImage({
  src,
  alt,
  className,
  imageClassName,
  fallbackClassName,
  eager = false,
}: BlogCoverImageProps) {
  const imageUrl = useMemo(() => resolveSafeImageUrl(src), [src]);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [imageUrl]);

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gradient-to-br from-sky-500/20 to-blue-500/20 dark:from-blue-500/20 dark:to-cyan-500/20 flex items-center justify-center',
        className
      )}
    >
      {imageUrl && !hasError ? (
        // A native image supports admin-provided HTTPS hosts without weakening Next.js host rules.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          className={cn('absolute inset-0 h-full w-full object-cover', imageClassName)}
          onError={() => setHasError(true)}
        />
      ) : (
        <span className={cn('font-bold text-foreground/10', fallbackClassName)}>
          {alt.trim()[0] || 'ن'}
        </span>
      )}
    </div>
  );
}
