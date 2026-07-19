'use client';

import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

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

const Silk = dynamic(
  async () => {
    try {
      return (await import('@/components/Silk')).default;
    } catch {
      return function SilkFallback() {
        return <div className="absolute inset-0 bg-[#EAF2FF]" />;
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
  const isDashboard = pathname === '/dashboard' || pathname.startsWith('/dashboard/');

  return (
    <div
      className={`public-site-surface relative isolate min-h-screen ${isDashboard ? 'dashboard-theme-surface' : ''}`}
      data-public-site
      data-dashboard-surface={isDashboard ? 'true' : undefined}
    >
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#EAF2FF] dark:bg-[#030008]"
        aria-hidden="true"
        data-public-backdrop
      >
        <div className="absolute inset-0 block dark:hidden" data-light-backdrop="silk">
          <Silk
            speed={5}
            scale={1}
            color="#EAF2FF"
            noiseIntensity={1.5}
            rotation={0}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(255,255,255,0.16)_0%,transparent_55%,rgba(148,163,184,0.05)_100%)]" />
        </div>

        <div className="absolute inset-0 hidden dark:block" data-dark-backdrop="darkveil">
          <DarkVeil />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,transparent_0%,rgba(0,0,0,0.12)_58%,rgba(0,0,0,0.55)_100%)]" />
        </div>
      </div>
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}
