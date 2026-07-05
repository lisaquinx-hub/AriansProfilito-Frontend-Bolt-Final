'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

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
          <p className="text-foreground/50 text-center mb-8">
            برای دسترسی به داشبورد وارد شوید
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">ایمیل</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  className="pr-10 bg-white/5 border-white/10 focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="رمز عبور"
                  className="pr-10 pl-10 bg-white/5 border-white/10 focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/50"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-foreground/60">مرا به خاطر بسپار</span>
              </label>
              <Link href="/forgot-password" className="text-cyan-400 hover:text-cyan-300">
                فراموشی رمز
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-gradient-to-l from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-glow"
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
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-foreground/40">یا</span>
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center text-foreground/60">
            حساب ندارید؟{' '}
            <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-medium">
              ثبت‌نام کنید
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
