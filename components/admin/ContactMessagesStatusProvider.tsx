'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { adminContactMessagesService } from '@/services/admin/ContactMessagesService';

interface ContactMessagesStatusContextValue {
  unreadCount: number;
  isLoading: boolean;
  hasError: boolean;
  refresh: () => Promise<void>;
}

const ContactMessagesStatusContext = createContext<ContactMessagesStatusContextValue | null>(null);
const REFRESH_INTERVAL_MS = 30_000;

export function ContactMessagesStatusProvider({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const requestInFlight = useRef<Promise<void> | null>(null);

  const refresh = useCallback(() => {
    if (requestInFlight.current) {
      return requestInFlight.current;
    }

    const request = (async () => {
      try {
        const unreadMessages = await adminContactMessagesService.getUnread();
        setUnreadCount(unreadMessages.length);
        setHasError(false);
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    })();

    requestInFlight.current = request;
    void request.finally(() => {
      if (requestInFlight.current === request) {
        requestInFlight.current = null;
      }
    });

    return request;
  }, []);

  useEffect(() => {
    void refresh();

    const intervalId = window.setInterval(() => {
      if (!document.hidden) {
        void refresh();
      }
    }, REFRESH_INTERVAL_MS);

    const refreshWhenVisible = () => {
      if (!document.hidden) {
        void refresh();
      }
    };

    window.addEventListener('focus', refreshWhenVisible);
    document.addEventListener('visibilitychange', refreshWhenVisible);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', refreshWhenVisible);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, [refresh]);

  return (
    <ContactMessagesStatusContext.Provider
      value={{ unreadCount, isLoading, hasError, refresh }}
    >
      {children}
    </ContactMessagesStatusContext.Provider>
  );
}

export function useContactMessagesStatus(): ContactMessagesStatusContextValue {
  const context = useContext(ContactMessagesStatusContext);
  if (!context) {
    throw new Error('useContactMessagesStatus must be used inside ContactMessagesStatusProvider');
  }
  return context;
}
