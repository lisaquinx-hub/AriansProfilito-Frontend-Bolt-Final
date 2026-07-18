'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ThemeToggle';
import { authService } from '@/services/AuthService';
import { emitAuthChanged } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface RegisterFormData {
  fullName: string;
  email: string;
  userName: string;
  password: string;
  confirmPassword: string;
}

type RegisterField = keyof RegisterFormData;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedInput, setFocusedInput] = useState<RegisterField | null>(null);
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    userName: '',
    password: '',
    confirmPassword: '',
  });

  const updateField = (field: RegisterField, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('رمز عبور و تکرار آن مطابقت ندارند');
      return;
    }
    if (!/^[a-zA-Z0-9._-]{3,100}$/.test(formData.userName.trim())) {
      setError('نام کاربری باید ۳ تا ۱۰۰ کاراکتر و فقط شامل حروف انگلیسی، عدد، نقطه، خط تیره یا زیرخط باشد');
      return;
    }
    if (formData.password.length < 12) {
      setError('رمز عبور باید حداقل ۱۲ کاراکتر باشد');
      return;
    }
    if (
      !/[A-Z]/.test(formData.password) ||
      !/[a-z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password)
    ) {
      setError('رمز عبور باید شامل حرف بزرگ، حرف کوچک و عدد باشد');
      return;
    }

    setIsLoading(true);
    try {
      await authService.register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        userName: formData.userName.trim(),
        password: formData.password,
      });
      emitAuthChanged();
      router.push('/dashboard');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'ثبت‌نام با خطا روبه‌رو شد');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClassName = (field: RegisterField) =>
    cn(
      'h-11 border-border/70 bg-background/45 pr-10 text-foreground shadow-sm backdrop-blur-sm transition-all duration-300 placeholder:text-muted-foreground/70',
      'focus-visible:border-sky-500 focus-visible:ring-sky-500/20 dark:bg-white/[0.045] dark:focus-visible:border-cyan-400 dark:focus-visible:ring-cyan-400/20',
      focusedInput === field && 'bg-background/80 dark:bg-white/[0.08]'
    );

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-20 md:px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100/70 via-blue-50/55 to-white/60 dark:from-sky-950/45 dark:via-blue-950/30 dark:to-black/20" />

      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-multiply dark:mix-blend-soft-light"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          backgroundSize: '200px 200px',
        }}
      />

      <div className="absolute left-1/2 top-0 h-[60vh] w-[120vh] -translate-x-1/2 rounded-b-[50%] bg-sky-400/20 blur-[80px] dark:bg-cyan-400/15" />
      <div className="absolute left-1/2 top-0 h-[60vh] w-[100vh] -translate-x-1/2 rounded-b-full bg-blue-400/20 blur-[60px] dark:bg-blue-500/20" />
      <div className="absolute bottom-0 left-1/2 h-[90vh] w-[90vh] -translate-x-1/2 rounded-t-full bg-cyan-400/20 blur-[70px] dark:bg-sky-500/20" />
      <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-white/20 opacity-50 blur-[100px] dark:bg-white/5" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-sky-200/30 opacity-50 blur-[100px] dark:bg-cyan-300/5" />

      <div className="absolute right-4 top-5 z-30 flex items-center gap-2 md:right-6">
        <ThemeToggle />
        <Link
          href="/"
          className="rounded-full border border-border/70 bg-background/60 px-4 py-2 text-sm text-muted-foreground backdrop-blur-xl transition-colors hover:text-foreground"
        >
          بازگشت به سایت
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="relative">
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-white/45 bg-background/75 p-6 shadow-2xl backdrop-blur-2xl dark:border-white/[0.08] dark:bg-card/65 md:p-8">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.025]"
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, currentColor 0.5px, transparent 0.5px), linear-gradient(45deg, currentColor 0.5px, transparent 0.5px)',
                  backgroundSize: '30px 30px',
                }}
              />

              <div className="relative mb-7 text-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', duration: 0.8 }}
                  className="relative mx-auto flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-sky-500/30 bg-gradient-to-br from-sky-500 to-blue-600 text-xl font-bold text-white shadow-glow dark:from-blue-600 dark:to-cyan-500"
                >
                  آ
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-3 text-2xl font-bold"
                >
                  ایجاد حساب آریان پژوهش
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-2 text-sm text-muted-foreground"
                >
                  برای شروع همکاری و دسترسی به داشبورد ثبت‌نام کنید
                </motion.p>
              </div>

              <form onSubmit={handleSubmit} className="relative space-y-5" noValidate>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">نام و نام خانوادگی</Label>
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(event) => updateField('fullName', event.target.value)}
                        onFocus={() => setFocusedInput('fullName')}
                        onBlur={() => setFocusedInput(null)}
                        placeholder="نام کامل شما"
                        autoComplete="name"
                        maxLength={150}
                        className={inputClassName('fullName')}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userName">نام کاربری</Label>
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="userName"
                        type="text"
                        value={formData.userName}
                        onChange={(event) => updateField('userName', event.target.value)}
                        onFocus={() => setFocusedInput('userName')}
                        onBlur={() => setFocusedInput(null)}
                        placeholder="مثلاً arian.dev"
                        autoComplete="username"
                        minLength={3}
                        maxLength={100}
                        pattern={'[A-Za-z0-9._\\-]+'}
                        className={inputClassName('userName')}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">ایمیل</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(event) => updateField('email', event.target.value)}
                      onFocus={() => setFocusedInput('email')}
                      onBlur={() => setFocusedInput(null)}
                      placeholder="email@example.com"
                      autoComplete="email"
                      maxLength={256}
                      className={inputClassName('email')}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">رمز عبور</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(event) => updateField('password', event.target.value)}
                        onFocus={() => setFocusedInput('password')}
                        onBlur={() => setFocusedInput(null)}
                        placeholder="حداقل ۱۲ کاراکتر"
                        autoComplete="new-password"
                        minLength={12}
                        maxLength={128}
                        className={cn(inputClassName('password'), 'pl-10')}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={showPassword ? 'پنهان کردن رمز عبور' : 'نمایش رمز عبور'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">تکرار رمز عبور</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(event) => updateField('confirmPassword', event.target.value)}
                        onFocus={() => setFocusedInput('confirmPassword')}
                        onBlur={() => setFocusedInput(null)}
                        placeholder="تکرار رمز عبور"
                        autoComplete="new-password"
                        minLength={12}
                        maxLength={128}
                        className={cn(inputClassName('confirmPassword'), 'pl-10')}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((current) => !current)}
                        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={showConfirmPassword ? 'پنهان کردن تکرار رمز عبور' : 'نمایش تکرار رمز عبور'}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-xs leading-6 text-muted-foreground">
                  رمز عبور باید حداقل ۱۲ کاراکتر و شامل حرف بزرگ، حرف کوچک و عدد باشد.
                </p>

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      role="alert"
                      className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group/button relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-l from-sky-500 to-blue-600 font-medium text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-70 dark:from-blue-600 dark:to-cyan-600"
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-120%', '120%'] }}
                    transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }}
                    style={{ opacity: isLoading ? 1 : 0 }}
                  />
                  <AnimatePresence mode="wait" initial={false}>
                    {isLoading ? (
                      <motion.span
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative flex items-center justify-center"
                      >
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/75 border-t-transparent" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="submit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative flex items-center justify-center gap-2"
                      >
                        ثبت‌نام
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover/button:-translate-x-1" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                <p className="text-center text-xs leading-6 text-muted-foreground">
                  با ایجاد حساب،{' '}
                  <Link href="/terms" className="font-medium text-sky-600 hover:text-sky-700 dark:text-cyan-400">
                    شرایط استفاده
                  </Link>{' '}
                  و{' '}
                  <Link href="/privacy" className="font-medium text-sky-600 hover:text-sky-700 dark:text-cyan-400">
                    حریم خصوصی
                  </Link>{' '}
                  را می‌پذیرید.
                </p>
              </form>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="relative mt-6 text-center text-sm text-muted-foreground"
              >
                حساب دارید؟{' '}
                <Link href="/login" className="group/login relative inline-block font-medium text-sky-600 dark:text-cyan-400">
                  وارد شوید
                  <span className="absolute bottom-0 right-0 h-px w-0 bg-sky-500 transition-all duration-300 group-hover/login:w-full dark:bg-cyan-400" />
                </Link>
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
