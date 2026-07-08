'use client';

import { useEffect, useState, useCallback } from 'react';
import { getAccessToken, getStoredUser, removeAccessToken, setStoredUser, isAdmin, type StoredUser } from '@/lib/auth';
import { authService } from '@/services/AuthService';

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

  const refresh = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const token = getAccessToken();
    const storedUser = getStoredUser<StoredUser>();

    if (!token) {
      setState({ isAuthenticated: false, user: null, isAdmin: false, isLoading: false });
      return;
    }

    if (storedUser) {
      setState({ isAuthenticated: true, user: storedUser, isAdmin: isAdmin(), isLoading: false });
    } else {
      setState({ isAuthenticated: true, user: null, isAdmin: false, isLoading: false });
    }

    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        const user: StoredUser = {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          userName: currentUser.userName,
          avatar: currentUser.avatar,
          role: currentUser.role,
          roles: currentUser.roles,
        };
        setStoredUser(user);
        setState({ isAuthenticated: true, user, isAdmin: isAdmin(), isLoading: false });
      }
    } catch {
      const stored = getStoredUser<StoredUser>();
      if (!stored) {
        setState({ isAuthenticated: true, user: null, isAdmin: false, isLoading: false });
      }
    }
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

  const logout = useCallback(() => {
    removeAccessToken();
    setState({ isAuthenticated: false, user: null, isAdmin: false, isLoading: false });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-changed'));
    }
  }, []);

  return {
    ...state,
    refreshUser: refresh,
    logout,
  };
}

export function emitAuthChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth-changed'));
  }
}
