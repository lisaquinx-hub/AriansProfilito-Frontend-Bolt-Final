const AUTH_SESSION_KEY = 'authSession';
const USER_KEY = 'user';
const LEGACY_TOKEN_KEYS = ['accessToken', 'refreshToken'];

const isBrowser = () => typeof window !== 'undefined';

function clearStorage(storage: Storage): void {
  storage.removeItem(AUTH_SESSION_KEY);
  storage.removeItem(USER_KEY);
  LEGACY_TOKEN_KEYS.forEach((key) => storage.removeItem(key));
}

function getAuthStorage(): Storage | null {
  if (!isBrowser()) return null;
  if (sessionStorage.getItem(AUTH_SESSION_KEY) === '1') return sessionStorage;
  if (localStorage.getItem(AUTH_SESSION_KEY) === '1') return localStorage;
  return null;
}

export function setAuthSession<T>(user: T, persistent = false): void {
  if (!isBrowser()) return;
  clearStorage(sessionStorage);
  clearStorage(localStorage);
  const storage = persistent ? localStorage : sessionStorage;
  storage.setItem(AUTH_SESSION_KEY, '1');
  storage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession(): void {
  if (!isBrowser()) return;
  clearStorage(sessionStorage);
  clearStorage(localStorage);
}

export function isAuthenticated(): boolean {
  return Boolean(getAuthStorage());
}

export function getStoredUser<T>(): T | null {
  const storage = getAuthStorage();
  if (!storage) return null;
  const userJson = storage.getItem(USER_KEY);
  if (!userJson) return null;

  try {
    return JSON.parse(userJson) as T;
  } catch {
    clearStorage(storage);
    return null;
  }
}

export function setStoredUser<T>(user: T): void {
  if (!isBrowser()) return;
  const storage = getAuthStorage() || sessionStorage;
  storage.setItem(AUTH_SESSION_KEY, '1');
  storage.setItem(USER_KEY, JSON.stringify(user));
}

export interface StoredUser {
  id?: string;
  fullName?: string;
  email?: string;
  userName?: string;
  avatar?: string;
  role?: unknown;
  isActive?: boolean;
}

const ADMIN_ROLE_VALUE = 3;
const ADMIN_ROLE_NAMES = new Set(['admin', 'administrator', '3']);

function normalizeRoleValues(value: unknown): string[] {
  if (value == null) return [];
  if (typeof value === 'number') return [String(value)];
  if (typeof value === 'string') {
    const trimmed = value.trim().toLowerCase();
    return trimmed ? [trimmed] : [];
  }
  if (Array.isArray(value)) return value.flatMap(normalizeRoleValues);

  if (typeof value === 'object') {
    const objectValue = value as Record<string, unknown>;
    for (const key of ['name', 'roleName', 'normalizedName', 'title', 'value', 'key']) {
      if (key in objectValue) {
        const result = normalizeRoleValues(objectValue[key]);
        if (result.length > 0) return result;
      }
    }
    if ('role' in objectValue) return normalizeRoleValues(objectValue.role);
    if ('roles' in objectValue) return normalizeRoleValues(objectValue.roles);
  }

  return [];
}

export function hasAdminRole(user: unknown): boolean {
  if (!user || typeof user !== 'object') return false;
  const value = user as Record<string, unknown>;
  if (typeof value.role === 'number' && value.role === ADMIN_ROLE_VALUE) return true;
  return [
    ...normalizeRoleValues(value.role),
    ...normalizeRoleValues(value.roles),
  ].some((role) => ADMIN_ROLE_NAMES.has(role));
}

export function isAdmin(): boolean {
  const user = getStoredUser<StoredUser>();
  return Boolean(user && hasAdminRole(user));
}

export function logout(): void {
  clearAuthSession();
}
