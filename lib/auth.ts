const ACCESS_TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

const isBrowser = () => typeof window !== 'undefined';

export function getAccessToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  if (!isBrowser()) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function removeAccessToken(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  if (!isBrowser()) return false;
  return !!localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredUser<T>(): T | null {
  if (!isBrowser()) return null;
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson) as T;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function setStoredUser<T>(user: T): void {
  if (!isBrowser()) return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export interface StoredUser {
  id?: string;
  name?: string;
  email?: string;
  userName?: string;
  avatar?: string;
  role?: unknown;
  roles?: unknown;
}

const ADMIN_ROLES = new Set(['admin', 'administrator']);

function normalizeRoleValues(value: unknown): string[] {
  if (value == null) return [];

  if (typeof value === 'string') {
    const trimmed = value.trim().toLowerCase();
    return trimmed ? [trimmed] : [];
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return [String(value).toLowerCase()];
  }

  if (Array.isArray(value)) {
    return value.flatMap(normalizeRoleValues);
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const nameKeys = ['name', 'roleName', 'normalizedName', 'title', 'value', 'key'];
    for (const key of nameKeys) {
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

  const allRoles = [
    ...normalizeRoleValues(u.role),
    ...normalizeRoleValues(u.roles),
  ];

  return allRoles.some(r => ADMIN_ROLES.has(r));
}

export function isAdmin(): boolean {
  try {
    const user = getStoredUser<StoredUser>();
    if (!user) return false;
    return hasAdminRole(user);
  } catch {
    return false;
  }
}

export function logout(): void {
  removeAccessToken();
}
