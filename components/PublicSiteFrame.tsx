'use client';

import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const DarkVeil = dynamic(() => import('@/components/DarkVeil'), { ssr: false });

interface PublicSiteFrameProps {
  children: ReactNode;
}

export default function PublicSiteFrame({ children }: PublicSiteFrameProps) {
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard' || pathname.startsWith('/dashboard/');

  if (isDashboard) {
    return children;
  }

  return (
    <div className="public-site-surface relative isolate min-h-screen" data-public-site>
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#030008]"
        aria-hidden="true"
        data-public-darkveil
      >
        <DarkVeil />
        <div className="absolute inset-0 bg-white/65 dark:bg-black/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,transparent_0%,rgba(0,0,0,0.08)_55%,rgba(0,0,0,0.35)_100%)] dark:bg-[radial-gradient(circle_at_50%_20%,transparent_0%,rgba(0,0,0,0.12)_58%,rgba(0,0,0,0.55)_100%)]" />
      </div>
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}
