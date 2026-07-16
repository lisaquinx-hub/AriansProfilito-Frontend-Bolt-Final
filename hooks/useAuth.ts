'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  clearAuthSession,
  getStoredUser,
  isAuthenticated,
  hasAdminRole,
  type StoredUser,
} from '@/lib/auth';

export interface AuthState {
  isAuthenticated: boolean;
  user: StoredUser | null;
  isAdmin: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isAdmin: false,
  isLoading: true,
};

export function useAuth(): AuthState & {
  refreshUser: () => void;
  logout: () => void;
} {
  const [state, setState] = useState<AuthState>(initialState);

  const refresh = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!isAuthenticated()) {
      setState({ isAuthenticated: false, user: null, isAdmin: false, isLoading: false });
      return;
    }

    const storedUser = getStoredUser<StoredUser>();
    const adminFlag = storedUser ? hasAdminRole(storedUser) : false;
    setState({ isAuthenticated: true, user: storedUser, isAdmin: adminFlag, isLoading: false });
  }, []);

  useEffect(() => {
    refresh();

    const handler = () => refresh();
    window.addEventListener('auth-changed', handler);
    window.addEventListener('storage', handler);

    return () => {
      window.removeEventListener('auth-changed', handler);
      window.removeEventListener('storage', handler);
    };
  }, [refresh]);

  const logoutFn = useCallback(() => {
    clearAuthSession();
    setState({ isAuthenticated: false, user: null, isAdmin: false, isLoading: false });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-changed'));
    }
  }, []);

  return {
    ...state,
    refreshUser: refresh,
    logout: logoutFn,
  };
}

export function emitAuthChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth-changed'));
  }
}
