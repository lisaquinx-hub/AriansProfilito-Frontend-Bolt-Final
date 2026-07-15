export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string | null;
  errors?: unknown;
  data: T;
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
  total: number;
  totalCount?: number;
  page?: number;
  pageNumber?: number;
  pageSize?: number;
  hasMore?: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7297/api';

export function getAssetBaseUrl(): string {
  return API_BASE_URL.replace(/\/api\/?$/, '');
}

export function resolveAssetUrl(path?: string | null): string | null {
  if (!path || path.trim() === '') {
    return null;
  }
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const assetBase = getAssetBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${assetBase}${normalizedPath}`;
}

export function unwrapResponse<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    throw new Error(response.message || 'Request failed');
  }
  return response.data;
}

export function isApiResponse<T = unknown>(value: unknown): value is ApiResponse<T> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    'data' in record &&
    ('success' in record || 'message' in record || 'errors' in record)
  );
}

export function unwrapApiResponse<T>(value: unknown): T {
  return (isApiResponse<T>(value) ? value.data : value) as T;
}

export function normalizeArray<T>(value: unknown): T[] {
  const unwrapped = unwrapApiResponse<unknown>(value);

  if (Array.isArray(unwrapped)) {
    return unwrapped as T[];
  }

  if (!unwrapped || typeof unwrapped !== 'object') {
    return [];
  }

  const record = unwrapped as Record<string, unknown>;
  for (const key of ['items', 'results', 'result']) {
    if (Array.isArray(record[key])) {
      return record[key] as T[];
    }
  }

  return [];
}

export function normalizeObject<T>(value: unknown): T | null {
  const unwrapped = unwrapApiResponse<unknown>(value);

  if (unwrapped && typeof unwrapped === 'object' && !Array.isArray(unwrapped)) {
    return unwrapped as T;
  }

  return null;
}

export function toIsoOrNull(value?: string | null): string | null {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function createPaginationParams(params?: PaginationParams): Record<string, string | number> {
  const result: Record<string, string | number> = {};
  if (params?.skip !== undefined) result.skip = params.skip;
  if (params?.take !== undefined) result.take = params.take;
  if (params?.page !== undefined) result.page = params.page;
  if (params?.limit !== undefined) result.limit = params.limit;
  if (params?.pageNumber !== undefined) result.pageNumber = params.pageNumber;
  if (params?.pageSize !== undefined) result.pageSize = params.pageSize;
  return result;
}
