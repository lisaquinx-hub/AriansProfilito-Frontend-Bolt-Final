'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const UPSTREAM_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7297/api';
const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : UPSTREAM_API_BASE_URL;
const VISITOR_ID_KEY = 'arian-pazhoohesh:analytics-visitor-id';
const SESSION_ID_KEY = 'arian-pazhoohesh:analytics-session-id';
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function createUuid(): string {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function getOrCreateId(storage: Storage, key: string): string {
  try {
    const current = storage.getItem(key);
    if (current && UUID_PATTERN.test(current)) return current;
    const created = createUuid();
    storage.setItem(key, created);
    return created;
  } catch {
    return createUuid();
  }
}

function getExternalReferrerHost(): string | null {
  if (!document.referrer) return null;

  try {
    const referrer = new URL(document.referrer);
    return referrer.hostname === window.location.hostname
      ? null
      : referrer.hostname.toLowerCase();
  } catch {
    return null;
  }
}

function shouldTrack(pathname: string): boolean {
  return !(
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/not-found' ||
    pathname.startsWith('/dashboard')
  );
}

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || !shouldTrack(pathname) || navigator.doNotTrack === '1') return;

    const visitorId = getOrCreateId(window.localStorage, VISITOR_ID_KEY);
    const sessionId = getOrCreateId(window.sessionStorage, SESSION_ID_KEY);
    const timer = window.setTimeout(() => {
      const endpoint = `${API_BASE_URL.replace(/\/+$/, '')}/analytics/page-view`;
      void fetch(endpoint, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: pathname,
          visitorId,
          sessionId,
          referrerHost: getExternalReferrerHost(),
        }),
      }).catch(() => {
        // Analytics must never interrupt navigation or public-page rendering.
      });
    }, 900);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
