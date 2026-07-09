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

  // Direct numeric check (UserRole.Admin = 3)
  if (typeof u.role === 'number' && u.role === ADMIN_ROLE_VALUE) return true;

  const allRoles = [
    ...normalizeRoleValues(u.role),
    ...normalizeRoleValues(u.roles),
  ];

  return allRoles.some(r => ADMIN_ROLE_NAMES.has(r));
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
