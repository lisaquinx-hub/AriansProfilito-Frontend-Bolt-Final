'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, hasAdminRole } from '@/lib/auth';
import { authService } from '@/services/AuthService';
import { motion } from 'framer-motion';
import { ShieldAlert, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [authState, setAuthState] = useState<'authenticated' | 'denied' | 'unauthenticated'>('unauthenticated');

  useEffect(() => {
    let cancelled = false;

    const redirectToLogin = () => {
      const currentPath = `${window.location.pathname}${window.location.search}`;
      router.replace(`/login?redirect=${encodeURIComponent(currentPath)}`);
    };

    const checkAuth = async () => {
      if (!isAuthenticated()) {
        if (cancelled) return;
        setAuthState('unauthenticated');
        setIsChecking(false);
        redirectToLogin();
        return;
      }

      if (requireAdmin) {
        try {
          const user = await authService.getMe();
          if (!hasAdminRole(user)) {
            if (cancelled) return;
            setAuthState('denied');
            setIsChecking(false);
            return;
          }
        } catch {
          // Never grant the admin UI from locally cached role data when the
          // server cannot verify the current user.
          if (!isAuthenticated()) {
            if (cancelled) return;
            setAuthState('unauthenticated');
            setIsChecking(false);
            redirectToLogin();
            return;
          }
          if (cancelled) return;
          setAuthState('denied');
          setIsChecking(false);
          return;
        }
      }

      if (cancelled) return;
      setAuthState('authenticated');
      setIsChecking(false);
    };

    void checkAuth();
    return () => { cancelled = true; };
  }, [router, requireAdmin]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">در حال بررسی احراز هویت...</p>
        </div>
      </div>
    );
  }

  if (authState === 'denied') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-3">دسترسی غیرمجاز</h1>
          <p className="text-muted-foreground mb-2">
            شما به این بخش دسترسی ندارید.
          </p>
          <p className="text-muted-foreground text-sm mb-8">
            برای ورود به پنل مدیریت نیاز به نقش مدیر دارید.
          </p>
          <div className="flex flex-col gap-3">
            <Button asChild className="btn-primary w-full shadow-glow">
              <Link href="/dashboard">
                <ArrowRight className="w-4 h-4 ml-2" />
                بازگشت به داشبورد
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full rounded-full">
              <Link href="/">
                <Lock className="w-4 h-4 ml-2" />
                بازگشت به صفحه اصلی
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (authState === 'unauthenticated') {
    return null;
  }

  return <>{children}</>;
}
