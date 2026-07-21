import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPersianNumber(num: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (d) => persianDigits[parseInt(d)]);
}

export function scrollToSection(id: string): void {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function formatDatePersian(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('fa-IR');
}

/**
 * Accept only same-origin application paths for post-auth navigation.
 * Protocol-relative URLs, backslashes and executable URL schemes are rejected.
 */
export function getSafeInternalPath(
  value: string | null | undefined,
  fallback: string
): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return fallback;
  }

  try {
    const parsed = new URL(value, 'https://local.invalid');
    return parsed.origin === 'https://local.invalid'
      ? `${parsed.pathname}${parsed.search}${parsed.hash}`
      : fallback;
  } catch {
    return fallback;
  }
}

const SECTION_ROUTE_ALIASES: Record<string, string> = {
  '/contact': '/#contact',
  '/faq': '/#faq',
};

/** Accept safe app-relative paths and secure URLs for CMS-controlled links. */
export function getSafeNavigationHref(
  value: string | null | undefined,
  fallback: string
): string {
  const trimmed = value?.trim();
  if (!trimmed) return fallback;

  const aliased = SECTION_ROUTE_ALIASES[trimmed] || trimmed;
  if (aliased.startsWith('/')) {
    return getSafeInternalPath(aliased, fallback);
  }

  if (/^#[A-Za-z][A-Za-z0-9_:.-]*$/.test(aliased)) {
    return aliased;
  }

  return getSafeExternalUrl(aliased) || fallback;
}

/** Return only HTTPS URLs (plus local HTTP in development) without embedded credentials. */
export function getSafeExternalUrl(value: string | null | undefined): string | null {
  if (!value) return null;

  try {
    const parsed = new URL(value.trim());
    const isLocalDevelopmentUrl =
      process.env.NODE_ENV === 'development' &&
      parsed.protocol === 'http:' &&
      ['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname);
    if (
      (parsed.protocol !== 'https:' && !isLocalDevelopmentUrl) ||
      parsed.username ||
      parsed.password
    ) {
      return null;
    }
    return parsed.href;
  } catch {
    return null;
  }
}
