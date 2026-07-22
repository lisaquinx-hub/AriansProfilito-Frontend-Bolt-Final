'use client';

import { useEffect, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import './DarkVeil.css';
import './Silk.css';

const DarkVeil = dynamic(
  async () => {
    try {
      return (await import('@/components/DarkVeil')).default;
    } catch {
      return function DarkVeilFallback({ animate = true }: { animate?: boolean }) {
        return (
          <div
            className="darkveil-root"
            data-darkveil-motion={animate ? 'animated' : 'still'}
          >
            <div className="darkveil-fallback-flow" />
          </div>
        );
      };
    }
  },
  { ssr: false }
);

const Silk = dynamic(
  async () => {
    try {
      return (await import('@/components/Silk')).default;
    } catch {
      return function SilkFallback({ animate = true }: { animate?: boolean }) {
        return (
          <div
            className="silk-root"
            data-silk-motion={animate ? 'animated' : 'still'}
          >
            <div className="silk-fallback-flow" />
          </div>
        );
      };
    }
  },
  { ssr: false }
);

interface PublicSiteFrameProps {
  children: ReactNode;
}

export default function PublicSiteFrame({ children }: PublicSiteFrameProps) {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [animateBackdrop, setAnimateBackdrop] = useState(false);
  const isDashboard = pathname === '/dashboard' || pathname.startsWith('/dashboard/');
  const isLight = resolvedTheme === 'light';

  useEffect(() => {
    setMounted(true);
    if (isDashboard) {
      setAnimateBackdrop(false);
      return;
    }

    const media = window.matchMedia('(prefers-reduced-motion: no-preference)');
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean };
    }).connection;
    const updateAnimation = () => {
      const capableDevice = (navigator.hardwareConcurrency || 4) >= 4;
      setAnimateBackdrop(media.matches && capableDevice && !connection?.saveData);
    };

    updateAnimation();
    media.addEventListener('change', updateAnimation);
    return () => media.removeEventListener('change', updateAnimation);
  }, [isDashboard]);

  return (
    <div
      className={`public-site-surface relative isolate min-h-screen ${isDashboard ? 'dashboard-theme-surface' : ''}`}
      data-public-site
      data-dashboard-surface={isDashboard ? 'true' : undefined}
    >
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#EAF2FF] dark:bg-[#030008]"
        aria-hidden="true"
        data-public-backdrop={!mounted
          ? 'pending'
          : isDashboard
            ? 'static'
            : isLight ? 'silk' : 'darkveil'}
        data-public-backdrop-motion={
          !mounted || isDashboard
            ? undefined
            : animateBackdrop
              ? 'animated'
              : 'still'
        }
      >
        {!mounted ? null : isDashboard ? (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(56,189,248,0.10),transparent_55%)] dark:bg-[radial-gradient(circle_at_50%_15%,rgba(34,211,238,0.08),transparent_55%)]" />
        ) : isLight ? (
          <div className="absolute inset-0" data-light-backdrop="silk">
            <Silk
              animate={animateBackdrop}
              speed={5}
              scale={1}
              color="#EAF2FF"
              noiseIntensity={1.5}
              rotation={0}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(255,255,255,0.1)_0%,transparent_58%,rgba(59,130,246,0.04)_100%)]" />
          </div>
        ) : (
          <div className="absolute inset-0" data-dark-backdrop="darkveil">
            <DarkVeil animate={animateBackdrop} />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,transparent_0%,rgba(0,0,0,0.12)_58%,rgba(0,0,0,0.55)_100%)]" />
          </div>
        )}
      </div>
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}
