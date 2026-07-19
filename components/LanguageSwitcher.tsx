'use client';

import { useCallback, useEffect, useState } from 'react';
import { Check, Languages, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const TRANSLATE_SCRIPT_ID = 'arian-pazhoohesh-google-translate';
const TRANSLATE_ELEMENT_ID = 'arian-pazhoohesh-google-translate-element';
const LANGUAGE_STORAGE_KEY = 'arian-pazhoohesh:language';

type SupportedLanguage = 'fa' | 'en';

type TranslateElementConstructor = {
  new (
    options: {
      pageLanguage: string;
      includedLanguages: string;
      autoDisplay: boolean;
      layout?: number;
    },
    elementId: string
  ): unknown;
  InlineLayout?: { SIMPLE?: number };
};

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement?: TranslateElementConstructor;
      };
    };
    arianPazhooheshGoogleTranslateInit?: () => void;
  }
}

let translateLoader: Promise<void> | null = null;

function ensureTranslateHost() {
  if (document.getElementById(TRANSLATE_ELEMENT_ID)) return;
  const host = document.createElement('div');
  host.id = TRANSLATE_ELEMENT_ID;
  host.setAttribute('aria-hidden', 'true');
  host.className = 'google-translate-host';
  document.body.appendChild(host);
}

function loadGoogleTranslate(): Promise<void> {
  const TranslateElement = window.google?.translate?.TranslateElement;
  if (TranslateElement) return Promise.resolve();
  if (translateLoader) return translateLoader;

  translateLoader = new Promise<void>((resolve, reject) => {
    ensureTranslateHost();

    const timeoutId = window.setTimeout(() => {
      translateLoader = null;
      reject(new Error('Google Translate timed out.'));
    }, 12000);

    window.arianPazhooheshGoogleTranslateInit = () => {
      const Constructor = window.google?.translate?.TranslateElement;
      if (!Constructor) {
        window.clearTimeout(timeoutId);
        translateLoader = null;
        reject(new Error('Google Translate is unavailable.'));
        return;
      }

      const host = document.getElementById(TRANSLATE_ELEMENT_ID);
      if (host && !host.hasChildNodes()) {
        new Constructor(
          {
            pageLanguage: 'fa',
            includedLanguages: 'fa,en',
            autoDisplay: false,
            layout: Constructor.InlineLayout?.SIMPLE,
          },
          TRANSLATE_ELEMENT_ID
        );
      }

      window.clearTimeout(timeoutId);
      resolve();
    };

    const existingScript = document.getElementById(
      TRANSLATE_SCRIPT_ID
    ) as HTMLScriptElement | null;

    if (existingScript) {
      if (window.google?.translate?.TranslateElement) {
        window.clearTimeout(timeoutId);
        resolve();
      }
      return;
    }

    const script = document.createElement('script');
    script.id = TRANSLATE_SCRIPT_ID;
    script.src =
      'https://translate.google.com/translate_a/element.js?cb=arianPazhooheshGoogleTranslateInit';
    script.async = true;
    script.referrerPolicy = 'no-referrer';
    script.onerror = () => {
      window.clearTimeout(timeoutId);
      translateLoader = null;
      script.remove();
      reject(new Error('Google Translate failed to load.'));
    };
    document.head.appendChild(script);
  });

  return translateLoader;
}

function getTranslateSelect(): HTMLSelectElement | null {
  return document.querySelector<HTMLSelectElement>('.goog-te-combo');
}

async function waitForTranslateSelect(): Promise<HTMLSelectElement> {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const select = getTranslateSelect();
    if (select) return select;
    await new Promise<void>((resolve) => window.setTimeout(resolve, 100));
  }
  throw new Error('Google Translate language selector was not created.');
}

function setTranslateCookie(language: SupportedLanguage) {
  const value = `/fa/${language}`;
  document.cookie = `googtrans=${value}; path=/; SameSite=Lax`;

  const hostname = window.location.hostname;
  if (hostname.includes('.') && hostname !== 'localhost') {
    document.cookie = `googtrans=${value}; path=/; domain=.${hostname}; SameSite=Lax`;
  }
}

function clearTranslateCookie() {
  const expired = 'Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = `googtrans=; expires=${expired}; path=/`;

  const hostname = window.location.hostname;
  if (hostname.includes('.') && hostname !== 'localhost') {
    document.cookie = `googtrans=; expires=${expired}; path=/; domain=.${hostname}`;
  }
}

async function translateToEnglish() {
  setTranslateCookie('en');
  await loadGoogleTranslate();
  const select = await waitForTranslateSelect();
  select.value = 'en';
  select.dispatchEvent(new Event('change', { bubbles: true }));
  document.documentElement.lang = 'en';
  document.documentElement.dir = 'ltr';
}

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const [activeLanguage, setActiveLanguage] = useState<SupportedLanguage>('fa');
  const [isLoading, setIsLoading] = useState(false);

  const activateEnglish = useCallback(async (showError = true) => {
    setIsLoading(true);
    try {
      await translateToEnglish();
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en');
      setActiveLanguage('en');
    } catch {
      if (showError) {
        toast.error(
          'سرویس ترجمه در دسترس نیست؛ اتصال اینترنت یا مسدودکننده مرورگر را بررسی کنید.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage === 'en') {
      setActiveLanguage('en');
      void activateEnglish(false);
    }
  }, [activateEnglish]);

  const selectLanguage = (language: SupportedLanguage) => {
    if (language === activeLanguage && language === 'fa') return;

    if (language === 'fa') {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'fa');
      clearTranslateCookie();
      document.documentElement.lang = 'fa';
      document.documentElement.dir = 'rtl';
      window.location.reload();
      return;
    }

    void activateEnglish();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'notranslate rounded-full p-2 transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-sky-500',
            className
          )}
          aria-label="تغییر زبان"
          title="ترجمه فارسی و انگلیسی"
          translate="no"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Languages className="h-5 w-5" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="notranslate w-56 rounded-2xl border-border/70 bg-background/95 p-2 backdrop-blur-xl"
        dir="rtl"
        translate="no"
      >
        <p className="px-3 pb-2 pt-1 text-xs text-muted-foreground">
          زبان نمایش سایت
        </p>
        <button
          type="button"
          onClick={() => selectLanguage('fa')}
          className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-right text-sm transition-colors hover:bg-muted"
        >
          <span>فارسی</span>
          {activeLanguage === 'fa' && <Check className="h-4 w-4 text-sky-500" />}
        </button>
        <button
          type="button"
          onClick={() => selectLanguage('en')}
          disabled={isLoading}
          className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-right text-sm transition-colors hover:bg-muted disabled:cursor-wait disabled:opacity-60"
        >
          <span>English</span>
          {activeLanguage === 'en' && <Check className="h-4 w-4 text-sky-500" />}
        </button>
        <p className="px-3 pt-2 text-[11px] leading-5 text-muted-foreground">
          ترجمهٔ انگلیسی به‌صورت خودکار توسط Google انجام می‌شود.
        </p>
      </PopoverContent>
    </Popover>
  );
}
