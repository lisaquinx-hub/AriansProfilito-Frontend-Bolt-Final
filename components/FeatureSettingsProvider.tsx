'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const PORTFOLIO_VISIBILITY_STORAGE_KEY =
  'arian-pazhoohesh:public-portfolio-visible';

interface FeatureSettingsContextValue {
  isReady: boolean;
  portfolioEnabled: boolean;
  setPortfolioEnabled: (enabled: boolean) => void;
}

const FeatureSettingsContext = createContext<FeatureSettingsContextValue | null>(null);

interface FeatureSettingsProviderProps {
  children: ReactNode;
}

export function FeatureSettingsProvider({ children }: FeatureSettingsProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [portfolioEnabled, setPortfolioEnabledState] = useState(true);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(
      PORTFOLIO_VISIBILITY_STORAGE_KEY
    );
    setPortfolioEnabledState(storedValue !== 'false');
    setIsReady(true);

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== PORTFOLIO_VISIBILITY_STORAGE_KEY) return;
      setPortfolioEnabledState(event.newValue !== 'false');
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setPortfolioEnabled = useCallback((enabled: boolean) => {
    setPortfolioEnabledState(enabled);
    window.localStorage.setItem(
      PORTFOLIO_VISIBILITY_STORAGE_KEY,
      String(enabled)
    );
  }, []);

  const value = useMemo(
    () => ({ isReady, portfolioEnabled, setPortfolioEnabled }),
    [isReady, portfolioEnabled, setPortfolioEnabled]
  );

  return (
    <FeatureSettingsContext.Provider value={value}>
      {children}
    </FeatureSettingsContext.Provider>
  );
}

export function useFeatureSettings(): FeatureSettingsContextValue {
  const context = useContext(FeatureSettingsContext);
  if (!context) {
    throw new Error(
      'useFeatureSettings must be used inside FeatureSettingsProvider.'
    );
  }
  return context;
}
