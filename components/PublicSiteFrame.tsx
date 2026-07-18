'use client';

import { useEffect, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

const DarkVeil = dynamic(
  async () => {
    try {
      return (await import('@/components/DarkVeil')).default;
    } catch {
      return function DarkVeilFallback() {
        return null;
      };
    }
  },
  { ssr: false }
);

const Grainient = dynamic(
  async () => {
    try {
      return (await import('@/components/Grainient')).default;
    } catch {
      return function GrainientFallback() {
        return null;
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
  const isDashboard = pathname === '/dashboard' || pathname.startsWith('/dashboard/');

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && resolvedTheme === 'light';

  return (
    <div
      className={`public-site-surface relative isolate min-h-screen ${isDashboard ? 'dashboard-theme-surface' : ''}`}
      data-public-site
      data-dashboard-surface={isDashboard ? 'true' : undefined}
    >
      <div
        className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${isLight ? 'bg-[#f8fafc]' : 'bg-[#030008]'}`}
        aria-hidden="true"
        data-public-backdrop={isLight ? 'grainient' : 'darkveil'}
      >
        {isLight ? (
          <>
            <Grainient
              color1="#ffffff"
              color2="#eef4fb"
              color3="#dfeaf7"
              timeSpeed={3.05}
              colorBalance={0}
              warpStrength={1}
              warpFrequency={5}
              warpSpeed={2}
              warpAmplitude={50}
              blendAngle={0}
              blendSoftness={0.05}
              rotationAmount={500}
              noiseScale={2}
              grainAmount={0.06}
              grainScale={2}
              grainAnimated={false}
              contrast={1.08}
              gamma={1}
              saturation={0.35}
              centerX={0}
              centerY={0}
              zoom={0.9}
            />
            <div className="absolute inset-0 bg-white/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,transparent_0%,rgba(255,255,255,0.16)_50%,rgba(148,163,184,0.1)_100%)]" />
          </>
        ) : (
          <>
            <DarkVeil />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,transparent_0%,rgba(0,0,0,0.12)_58%,rgba(0,0,0,0.55)_100%)]" />
          </>
        )}
      </div>
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}
