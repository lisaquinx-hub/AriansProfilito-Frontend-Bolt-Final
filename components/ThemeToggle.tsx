'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span className="theme-turnon-shell" aria-hidden="true">
        <span className="theme-turnon-placeholder" />
      </span>
    );
  }

  const isLight = resolvedTheme === 'light';

  return (
    <label
      className="theme-turnon-shell"
      title={isLight ? 'تغییر به حالت تاریک' : 'تغییر به حالت روشن'}
    >
      <input
        className="theme-turnon-input"
        type="checkbox"
        role="switch"
        checked={isLight}
        onChange={() => setTheme(isLight ? 'dark' : 'light')}
        aria-label={isLight ? 'تغییر به حالت تاریک' : 'تغییر به حالت روشن'}
      />
    </label>
  );
}
