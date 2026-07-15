import axios, { AxiosError, AxiosResponse } from 'axios';
import { ApiResponse } from '@/lib/api-utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7297/api';

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

const isBrowser = () => typeof window !== 'undefined';

const AUTH_ROUTES = ['/login', '/register'];

function isPublicAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
  timeout: 15_000,
});

api.interceptors.request.use(
  (config) => {
    if (isBrowser()) {
      const token = localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      if (isBrowser()) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth-changed'));

        if (!isPublicAuthRoute(window.location.pathname)) {
          const redirect = `${window.location.pathname}${window.location.search}`;
          window.location.replace(`/login?redirect=${encodeURIComponent(redirect)}`);
        }
      }
    }
    return Promise.reject(error);
  }
);

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Record<string, unknown> | undefined;
    if (data) {
      // nested errors object — extract useful message, hide stackTrace
      if (data.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
        const errs = data.errors as Record<string, unknown>;
        if (typeof errs.message === 'string' && errs.message && !errs.message.startsWith('   at ')) {
          return errs.message;
        }
        const msgs = Object.entries(errs)
          .filter(([k]) => k !== 'stackTrace' && k !== 'StackTrace' && k !== 'exceptionType')
          .flatMap(([, v]) => (Array.isArray(v) ? v.map(String) : typeof v === 'string' ? [v] : []))
          .filter(Boolean);
        if (msgs.length > 0) return msgs.join(' | ');
      }
      if (Array.isArray(data.errors)) {
        const msgs = (data.errors as unknown[]).map(String).filter(Boolean);
        if (msgs.length > 0) return msgs.join(' | ');
      }
      if (typeof data.message === 'string' && data.message) {
        if (data.message === 'An unexpected error occurred.' && data.errors) {
          // fall through to status code fallback
        } else {
          return data.message;
        }
      }
    }
    if (error.response?.status === 400) return 'اطلاعات ارسالی نامعتبر است';
    if (error.response?.status === 401) return 'لطفا دوباره وارد شوید';
    if (error.response?.status === 403) return 'دسترسی غیرمجاز';
    if (error.response?.status === 404) return 'مورد یافت نشد';
    if (error.response?.status === 500) return 'خطای سرور - لطفا دوباره تلاش کنید';
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') return 'خطای شبکه - اتصال خود را بررسی کنید';
    return error.message || 'خطای غیرمنتظره';
  }
  if (error instanceof Error) return error.message;
  return 'خطای غیرمنتظره';
}
