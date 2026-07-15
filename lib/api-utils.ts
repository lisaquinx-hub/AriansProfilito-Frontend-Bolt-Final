export interface ApiResponse<T = unknown> {
  success?: boolean;
  message?: string | null;
  errors?: unknown;
  data?: T;
}

export interface PaginationParams {
  skip?: number;
  take?: number;
  page?: number;
  limit?: number;
  pageNumber?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total?: number;
  totalCount?: number;
  page?: number;
  pageNumber?: number;
  pageSize?: number;
  hasMore?: boolean;
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7297/api';

export function getAssetBaseUrl(): string {
  return API_BASE_URL.replace(/\/api\/?$/, '');
}

export function resolveAssetUrl(path?: string | null): string | null {
  if (!path) return null;

  const value = String(path).trim();
  if (!value) return null;

  if (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('data:')
  ) {
    return value;
  }

  const base = getAssetBaseUrl().replace(/\/$/, '');
  const cleanPath = value.startsWith('/') ? value : `/${value}`;

  return `${base}${cleanPath}`;
}

export function isApiResponse<T = unknown>(
  value: unknown
): value is ApiResponse<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    ('success' in value || 'data' in value || 'errors' in value || 'message' in value)
  );
}

export function unwrapApiResponse<T = unknown>(value: unknown): T {
  if (value === null || value === undefined) {
    return null as T;
  }

  if (isApiResponse<T>(value)) {
    return (value.data ?? null) as T;
  }

  return value as T;
}

export function normalizeArray<T = unknown>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  const unwrapped = unwrapApiResponse<unknown>(value);

  if (Array.isArray(unwrapped)) {
    return unwrapped as T[];
  }

  if (unwrapped && typeof unwrapped === 'object') {
    const objectValue = unwrapped as Record<string, unknown>;

    if (Array.isArray(objectValue.items)) {
      return objectValue.items as T[];
    }

    if (Array.isArray(objectValue.result)) {
      return objectValue.result as T[];
    }

    if (Array.isArray(objectValue.results)) {
      return objectValue.results as T[];
    }

    if (Array.isArray(objectValue.data)) {
      return objectValue.data as T[];
    }

    if (objectValue.data !== undefined) {
      return normalizeArray<T>(objectValue.data);
    }
  }

  return [];
}

export function normalizeObject<T = unknown>(value: unknown): T | null {
  if (value === null || value === undefined) {
    return null;
  }

  const unwrapped = unwrapApiResponse<unknown>(value);

  if (
    unwrapped &&
    typeof unwrapped === 'object' &&
    !Array.isArray(unwrapped)
  ) {
    return unwrapped as T;
  }

  return null;
}

export function createPaginationParams(
  page = 1,
  pageSize = 10
): PaginationParams {
  const safePage = Math.max(1, Number(page) || 1);
  const safePageSize = Math.max(1, Number(pageSize) || 10);

  return {
    page: safePage,
    pageNumber: safePage,
    limit: safePageSize,
    pageSize: safePageSize,
    skip: (safePage - 1) * safePageSize,
    take: safePageSize,
  };
}

export function isValidGuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value.trim()
  );
}

export function toIsoOrNull(value?: string | null): string | null {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString();
}

export function toIsoOrDefault(
  value: string | null | undefined,
  fallback: Date
): string {
  return toIsoOrNull(value) || fallback.toISOString();
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function generateProjectCode(): string {
  const now = new Date();

  const yyyy = now.getFullYear();
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const hh = pad(now.getHours());
  const mi = pad(now.getMinutes());
  const ss = pad(now.getSeconds());

  return `PRJ-${yyyy}${mm}${dd}-${hh}${mi}${ss}`;
}

export function safeString(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

export function nullIfEmpty(value?: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function emptyIfNull(value?: string | null): string {
  return value?.trim() || '';
}

export function safeNumber(value: unknown, fallback = 0): number {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

export function safeNonNegativeNumber(value: unknown, fallback = 0): number {
  const numberValue = safeNumber(value, fallback);
  return numberValue >= 0 ? numberValue : fallback;
}

export function clampNumber(
  value: unknown,
  min: number,
  max: number,
  fallback = min
): number {
  const numberValue = safeNumber(value, fallback);
  return Math.max(min, Math.min(max, numberValue));
}