import axios, { AxiosError, AxiosResponse } from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7297/api';

type ErrorValue =
  | string
  | string[]
  | Record<string, unknown>
  | null
  | undefined;

interface BackendErrorBody {
  success?: boolean;
  message?: string;
  errors?: ErrorValue;
  data?: unknown;
}

const isBrowser = () => typeof window !== 'undefined';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    if (!isBrowser()) return config;

    const token = window.localStorage.getItem('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<BackendErrorBody>) => {
    if (isBrowser() && error.response?.status === 401) {
      window.localStorage.removeItem('accessToken');
      window.localStorage.removeItem('refreshToken');
      window.localStorage.removeItem('user');

      const currentPath = window.location.pathname;
      if (!currentPath.startsWith('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

function flattenErrors(errors: ErrorValue): string | null {
  if (!errors) return null;

  if (typeof errors === 'string') {
    return errors;
  }

  if (Array.isArray(errors)) {
    return errors.filter(Boolean).join('، ');
  }

  if (typeof errors === 'object') {
    const record = errors as Record<string, unknown>;

    const hiddenKeys = new Set([
      'stackTrace',
      'StackTrace',
      'exceptionType',
      'ExceptionType',
      'baseExceptionType',
      'BaseExceptionType',
    ]);

    if (typeof record.message === 'string' && record.message.trim()) {
      return record.message;
    }

    if (typeof record.innerMessage === 'string' && record.innerMessage.trim()) {
      return record.innerMessage;
    }

    if (typeof record.baseMessage === 'string' && record.baseMessage.trim()) {
      return record.baseMessage;
    }

    const messages: string[] = [];

    Object.entries(record).forEach(([key, value]) => {
      if (hiddenKeys.has(key)) return;

      if (typeof value === 'string' && value.trim()) {
        messages.push(value);
        return;
      }

      if (Array.isArray(value)) {
        const joined = value
          .filter((item): item is string => typeof item === 'string')
          .join('، ');

        if (joined) messages.push(joined);
      }
    });

    return messages.length ? messages.join('، ') : null;
  }

  return null;
}

export function getApiStatus(error: unknown): number | undefined {
  if (axios.isAxiosError(error)) {
    return error.response?.status;
  }

  return undefined;
}

export function getApiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError<BackendErrorBody>(error)) {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return 'خطای نامشخص رخ داد.';
  }

  const status = error.response?.status;
  const body = error.response?.data;

  const errorsMessage = flattenErrors(body?.errors);
  if (errorsMessage) return errorsMessage;

  if (body?.message && typeof body.message === 'string') {
    return body.message;
  }

  if (typeof body === 'string') {
    return body;
  }

  switch (status) {
    case 400:
      return 'اطلاعات ارسال‌شده معتبر نیست.';
    case 401:
      return 'برای انجام این عملیات باید دوباره وارد شوید.';
    case 403:
      return 'شما دسترسی لازم برای انجام این عملیات را ندارید.';
    case 404:
      return 'موردی با این مشخصات پیدا نشد.';
    case 409:
      return 'این اطلاعات قبلاً ثبت شده یا با داده‌های موجود تداخل دارد.';
    case 422:
      return 'اطلاعات واردشده قابل پردازش نیست.';
    case 500:
      return 'خطای داخلی سرور رخ داد. لطفاً لاگ بک‌اند را بررسی کنید.';
    default:
      return error.message || 'خطا در ارتباط با سرور.';
  }
}

export default api;