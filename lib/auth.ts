const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

const isBrowser = () => typeof window !== 'undefined';

function clearStorage(storage: Storage): void {
  storage.removeItem(ACCESS_TOKEN_KEY);
  storage.removeItem(REFRESH_TOKEN_KEY);
  storage.removeItem(USER_KEY);
}

function getAuthStorage(): Storage | null {
  if (!isBrowser()) return null;
  if (sessionStorage.getItem(ACCESS_TOKEN_KEY)) return sessionStorage;
  if (localStorage.getItem(ACCESS_TOKEN_KEY)) return localStorage;
  return null;
}

function isExpiredJwt(token: string): boolean {
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  try {
    const normalized = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const payload = JSON.parse(atob(padded)) as { exp?: unknown };
    return typeof payload.exp === 'number' && Date.now() >= payload.exp * 1000;
  } catch {
    // Some backends may return opaque access tokens. Their validity is verified by the API.
    return false;
  }
}

export function getAccessToken(): string | null {
  const storage = getAuthStorage();
  if (!storage) return null;

  const token = storage.getItem(ACCESS_TOKEN_KEY);
  if (token && isExpiredJwt(token)) {
    removeAccessToken();
    return null;
  }
  return token;
}

export function setAccessToken(token: string, persistent = false): void {
  if (!isBrowser()) return;
  clearStorage(sessionStorage);
  clearStorage(localStorage);
  const storage = persistent ? localStorage : sessionStorage;
  storage.setItem(ACCESS_TOKEN_KEY, token);
}

export function removeAccessToken(): void {
  if (!isBrowser()) return;
  clearStorage(sessionStorage);
  clearStorage(localStorage);
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken());
}

export function getStoredUser<T>(): T | null {
  const storage = getAuthStorage();
  if (!storage) return null;

  const userJson = storage.getItem(USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson) as T;
  } catch {
    storage.removeItem(USER_KEY);
    return null;
  }
}

export function setStoredUser<T>(user: T): void {
  if (!isBrowser()) return;
  const storage = getAuthStorage() || sessionStorage;
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

// UserRole enum values from backend: Customer=1, Employee=2, Admin=3
const ADMIN_ROLE_VALUE = 3;
const ADMIN_ROLE_NAMES = new Set(['admin', 'administrator', '3']);

function normalizeRoleValues(value: unknown): string[] {
  if (value == null) return [];

  if (typeof value === 'number') {
    return [String(value)];
  }

  if (typeof value === 'string') {
    const trimmed = value.trim().toLowerCase();
    return trimmed ? [trimmed] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(normalizeRoleValues);
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    for (const key of ['name', 'roleName', 'normalizedName', 'title', 'value', 'key']) {
      if (key in obj) {
        const result = normalizeRoleValues(obj[key]);
        if (result.length > 0) return result;
      }
    }
    if ('role' in obj) return normalizeRoleValues(obj.role);
    if ('roles' in obj) return normalizeRoleValues(obj.roles);
  }

  return [];
}

export function hasAdminRole(user: unknown): boolean {
  if (!user || typeof user !== 'object') return false;
  const u = user as Record<string, unknown>;

  if (typeof u.role === 'number' && u.role === ADMIN_ROLE_VALUE) return true;

  const allRoles = [
    ...normalizeRoleValues(u.role),
    ...normalizeRoleValues(u.roles),
  ];

  return allRoles.some((role) => ADMIN_ROLE_NAMES.has(role));
}

export function isAdmin(): boolean {
  try {
    const user = getStoredUser<StoredUser>();
    return Boolean(user && hasAdminRole(user));
  } catch {
    return false;
  }
}

export function logout(): void {
  removeAccessToken();
}
