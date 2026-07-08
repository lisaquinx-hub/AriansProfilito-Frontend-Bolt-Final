'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Mail, User, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ThemeToggle';
import { authService, RegisterRequest } from '@/services/AuthService';
import { emitAuthChanged } from '@/hooks/useAuth';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegisterRequest>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        setError('رمز عبور و تکرار آن مطابقت ندارند');
        return;
      }
      if (formData.password.length < 8) {
        setError('رمز عبور باید حداقل ۸ کاراکتر باشد');
        return;
      }
      setIsLoading(true);
      try {
        await authService.register(formData);
        try {
          await authService.login({ emailOrUserName: formData.email, password: formData.password });
          emitAuthChanged();
          router.push('/dashboard');
          return;
        } catch {
        }
        setStep(2);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Registration failed');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoToLogin = () => {
    router.push('/login');
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
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`w-10 h-1 rounded-full transition-colors ${
                  s <= step ? 'bg-gradient-to-l from-sky-500 to-blue-600 dark:from-blue-500 dark:to-cyan-500' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {step === 1 ? (
            <>
              <h1 className="text-2xl font-bold text-center mb-2">ایجاد حساب</h1>
              <p className="text-muted-foreground text-center mb-8">
                برای شروع همکاری ثبت‌نام کنید
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">نام و نام خانوادگی</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="نام شما"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pr-10 bg-muted/50 border-border focus:border-sky-500"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">ایمیل</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                      placeholder="حداقل ۸ کاراکتر"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pr-10 pl-10 bg-muted/50 border-border focus:border-sky-500"
                      required
                      minLength={8}
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

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">تکرار رمز عبور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="تکرار رمز عبور"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="pr-10 bg-muted/50 border-border focus:border-sky-500"
                      required
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary shadow-glow"
                >
                  {isLoading ? (
                    <span className="animate-pulse">در حال ثبت‌نام...</span>
                  ) : (
                    <>
                      ادامه
                      <ArrowRight className="mr-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Login Link */}
              <p className="text-center text-muted-foreground mt-6">
                حساب دارید؟{' '}
                <Link href="/login" className="text-sky-500 dark:text-cyan-400 hover:text-sky-600 dark:hover:text-cyan-300 font-medium">
                  وارد شوید
                </Link>
              </p>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4">ثبت‌نام موفق!</h2>
              <p className="text-muted-foreground mb-8">
                حساب شما با موفقیت ایجاد شد.
                <br />
                برای ورود به حساب کلیک کنید.
              </p>
              <Button onClick={handleGoToLogin} className="btn-primary shadow-glow">
                ورود به حساب
                <ArrowRight className="mr-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
