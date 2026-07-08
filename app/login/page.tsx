'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Mail, Eye, EyeOff, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ThemeToggle';
import { authService } from '@/services/AuthService';
import { emitAuthChanged } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    emailOrUserName: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await authService.login(formData);
      emitAuthChanged();
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect') || '/dashboard';
      router.push(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 md:px-6 py-12 relative overflow-x-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero overflow-hidden" />
      <div className="absolute top-1/4 right-1/4 w-48 md:w-96 h-48 md:h-96 bg-sky-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-48 md:w-96 h-48 md:h-96 bg-blue-500/10 rounded-full blur-3xl" />

      {/* Theme Toggle */}
      <div className="absolute top-6 right-4 md:right-6 z-20">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <span className="text-3xl font-bold text-gradient">آریان‌لب</span>
          </Link>
        </div>

        {/* Form Card */}
        <div className="glass rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-center mb-2">ورود به حساب</h1>
          <p className="text-muted-foreground text-center mb-8">
            برای دسترسی به داشبورد وارد شوید
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email or Username */}
            <div className="space-y-2">
              <Label htmlFor="emailOrUserName">ایمیل یا نام کاربری</Label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="emailOrUserName"
                  type="text"
                  placeholder="email@example.com یا username"
                  value={formData.emailOrUserName}
                  onChange={(e) => setFormData({ ...formData, emailOrUserName: e.target.value })}
                  className="pr-10 bg-muted/50 border-border focus:border-sky-500"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="رمز عبور"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pr-10 pl-10 bg-muted/50 border-border focus:border-sky-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-border bg-muted text-sky-500 focus:ring-sky-500 dark:text-cyan-500"
                />
                <span className="text-muted-foreground">مرا به خاطر بسپار</span>
              </label>
              <Link href="/forgot-password" className="text-sky-500 dark:text-cyan-400 hover:text-sky-600 dark:hover:text-cyan-300">
                فراموشی رمز
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary shadow-glow"
            >
              {isLoading ? (
                <span className="animate-pulse">در حال ورود...</span>
              ) : (
                <>
                  ورود
                  <ArrowRight className="mr-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground">یا</span>
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center text-muted-foreground">
            حساب ندارید؟{' '}
            <Link href="/register" className="text-sky-500 dark:text-cyan-400 hover:text-sky-600 dark:hover:text-cyan-300 font-medium">
              ثبت‌نام کنید
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
