import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { clearAuthSession } from '@/lib/auth';

const UPSTREAM_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7297/api';
const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : UPSTREAM_API_BASE_URL;
const CSRF_HEADER_NAME = 'X-CSRF-TOKEN';

export interface ApiError {
  success?: false;
  message?: string;
  errors?: unknown;
  data?: unknown;
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _authRetry?: boolean;
}

interface CsrfResponse {
  data?: { token?: string };
}

const isBrowser = () => typeof window !== 'undefined';
const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const AUTH_ROUTES = ['/login', '/register'];
const NO_REFRESH_ENDPOINTS = [
  '/Auth/login',
  '/Auth/register',
  '/Auth/refresh-token',
  '/Auth/logout',
  '/Auth/csrf-token',
];

let csrfToken: string | null = null;
let csrfRequest: Promise<string> | null = null;
let refreshRequest: Promise<void> | null = null;

function isApiOrigin(url?: string): boolean {
  try {
    const currentOrigin = window.location.origin;
    const apiUrl = new URL(API_BASE_URL, currentOrigin);
    const requestUrl = new URL(
      (url || '').replace(/^\/+/, ''),
      `${apiUrl.href.replace(/\/+$/, '')}/`
    );
    return requestUrl.origin === apiUrl.origin;
  } catch {
    return false;
  }
}

function isPublicAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function isUnsafeMethod(method?: string): boolean {
  return UNSAFE_METHODS.has((method || 'GET').toUpperCase());
}

function isRefreshExcluded(url?: string): boolean {
  return NO_REFRESH_ENDPOINTS.some((endpoint) => (url || '').includes(endpoint));
}

const sessionApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 15_000,
});

async function fetchCsrfToken(): Promise<string> {
  if (csrfToken) return csrfToken;
  if (!csrfRequest) {
    csrfRequest = sessionApi
      .get<CsrfResponse>('/Auth/csrf-token')
      .then((response) => {
        const token = response.data?.data?.token;
        if (!token) throw new Error('توکن امنیتی درخواست دریافت نشد');
        csrfToken = token;
        return token;
      })
      .finally(() => {
        csrfRequest = null;
      });
  }
  return csrfRequest;
}

async function refreshSession(): Promise<void> {
  if (!refreshRequest) {
    resetCsrfToken();
    refreshRequest = fetchCsrfToken()
      .then((token) => sessionApi.post(
        '/Auth/refresh-token',
        null,
        { headers: { [CSRF_HEADER_NAME]: token } }
      ))
      .then(() => {
        resetCsrfToken();
      })
      .finally(() => {
        refreshRequest = null;
      });
  }
  return refreshRequest;
}

export function resetCsrfToken(): void {
  csrfToken = null;
  csrfRequest = null;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 15_000,
});

api.interceptors.request.use(
  async (config) => {
    if (isBrowser() && isUnsafeMethod(config.method) && isApiOrigin(config.url)) {
      const token = await fetchCsrfToken();
      config.headers = AxiosHeaders.from(config.headers);
      config.headers.set(CSRF_HEADER_NAME, token);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiError>) => {
    const config = error.config as RetryableRequestConfig | undefined;
    if (
      error.response?.status === 401 &&
      config &&
      !config._authRetry &&
      !isRefreshExcluded(config.url)
    ) {
      config._authRetry = true;
      try {
        await refreshSession();
        return await api.request(config);
      } catch {
        // Continue through the shared unauthenticated path.
      }
    }

    if (error.response?.status === 401 && isBrowser()) {
      clearAuthSession();
      window.dispatchEvent(new Event('auth-changed'));
      if (!isPublicAuthRoute(window.location.pathname)) {
        const redirect = `${window.location.pathname}${window.location.search}`;
        window.location.replace(`/login?redirect=${encodeURIComponent(redirect)}`);
      }
    }

    return Promise.reject(error);
  }
);

const HIDDEN_ERROR_KEYS = new Set([
  'stackTrace',
  'StackTrace',
  'exceptionType',
  'ExceptionType',
  'baseExceptionType',
  'BaseExceptionType',
]);

function isSafeErrorText(value: string): boolean {
  const text = value.trim();
  return Boolean(text) && !/^at\s/i.test(text) && !/^\s+at\s/i.test(value);
}

function flattenErrors(value: unknown, depth = 0): string[] {
  if (depth > 3 || value === null || value === undefined) return [];
  if (typeof value === 'string') return isSafeErrorText(value) ? [value.trim()] : [];
  if (Array.isArray(value)) return value.flatMap((item) => flattenErrors(item, depth + 1));
  if (typeof value !== 'object') return [];
  return Object.entries(value as Record<string, unknown>)
    .filter(([key]) => !HIDDEN_ERROR_KEYS.has(key))
    .flatMap(([, item]) => flattenErrors(item, depth + 1));
}

export function getApiStatus(error: unknown): number | undefined {
  return axios.isAxiosError(error) ? error.response?.status : undefined;
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiError>(error)) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return 'زمان پاسخ‌گویی سرور به پایان رسید؛ دوباره تلاش کنید';
    }
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      return 'خطای شبکه - اتصال خود را بررسی کنید';
    }

    const status = error.response?.status;
    if (status === 401) return 'لطفاً دوباره وارد شوید';
    if (status === 403) return 'دسترسی غیرمجاز';
    if (status === 404) return 'مورد یافت نشد';
    if (status === 429) return 'تعداد درخواست‌ها بیش از حد مجاز است؛ کمی بعد دوباره تلاش کنید';
    if (status && status >= 500) return 'خطای سرور؛ لطفاً دوباره تلاش کنید';

    const data = error.response?.data;
    if (data) {
      const messages = flattenErrors(data.errors);
      if (messages.length > 0) return Array.from(new Set(messages)).join(' | ');
      if (
        typeof data.message === 'string' &&
        data.message !== 'An unexpected error occurred.' &&
        isSafeErrorText(data.message)
      ) {
        return data.message.trim();
      }
    }

    if (status === 400) return 'اطلاعات ارسالی نامعتبر است';
    if (status === 409) return 'این اطلاعات با داده‌های موجود تداخل دارد';
    if (status === 422) return 'اطلاعات واردشده قابل پردازش نیست';
    return error.message || 'خطای غیرمنتظره';
  }
  if (error instanceof Error) return error.message;
  return 'خطای غیرمنتظره';
}

export default api;
