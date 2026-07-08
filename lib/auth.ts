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
  role?: string;
  roles?: string[];
}

export function isAdmin(): boolean {
  const user = getStoredUser<StoredUser>();
  if (!user) return false;
  const role = (user.role || '').toLowerCase();
  if (role === 'admin' || role === 'administrator') return true;
  if (user.roles && Array.isArray(user.roles)) {
    return user.roles.some(r => {
      const rl = (r || '').toLowerCase();
      return rl === 'admin' || rl === 'administrator';
    });
  }
  return false;
}

export function logout(): void {
  removeAccessToken();
}
