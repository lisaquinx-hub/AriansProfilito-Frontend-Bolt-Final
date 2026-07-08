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
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page?: number;
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

export function createPaginationParams(params?: PaginationParams): Record<string, string | number> {
  const result: Record<string, string | number> = {};
  if (params?.skip !== undefined) result.skip = params.skip;
  if (params?.take !== undefined) result.take = params.take;
  if (params?.page !== undefined) result.page = params.page;
  if (params?.limit !== undefined) result.limit = params.limit;
  return result;
}
