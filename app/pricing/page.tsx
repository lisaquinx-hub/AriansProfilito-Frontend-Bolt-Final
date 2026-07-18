'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowLeft, Check, Clock3, Loader2, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { pricingService } from '@/services/PricingService';
import { PricingPlan } from '@/types/api';

type PricingView = 'price' | 'timeline';

const sparklePoints = Array.from({ length: 32 }, (_, index) => ({
  left: `${(index * 37) % 100}%`,
  top: `${(index * 53) % 82}%`,
  delay: `${(index % 8) * 0.28}s`,
  duration: `${2.4 + (index % 5) * 0.35}s`,
  size: index % 3 === 0 ? 3 : 2,
}));

function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(0);
  const formatted = useTransform(count, (latest) =>
    Math.round(latest).toLocaleString('fa-IR')
  );

  useEffect(() => {
    count.set(0);
    const controls = animate(count, value, {
      duration: 0.8,
      ease: 'easeOut',
    });
    return () => controls.stop();
  }, [count, value]);

  return <motion.span>{formatted}</motion.span>;
}

function PricingSwitch({
  value,
  onChange,
}: {
  value: PricingView;
  onChange: (value: PricingView) => void;
}) {
  const options: Array<{ value: PricingView; label: string }> = [
    { value: 'price', label: 'هزینه پلن' },
    { value: 'timeline', label: 'زمان‌بندی' },
  ];

  return (
    <div className="mx-auto flex w-fit rounded-full border border-border bg-background/80 p-1 shadow-lg backdrop-blur-xl dark:bg-card/80">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'relative z-10 h-11 min-w-28 rounded-full px-5 text-sm font-medium transition-colors',
            value === option.value ? 'text-white' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {value === option.value && (
            <motion.span
              layoutId="pricing-switch"
              className="absolute inset-0 -z-10 rounded-full border border-sky-400 bg-gradient-to-l from-sky-500 to-blue-600 shadow-lg shadow-sky-500/25 dark:from-blue-600 dark:to-cyan-600"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          {option.label}
        </button>
      ))}
    </div>
  );
}

function PricingCard({
  plan,
  index,
  view,
}: {
  plan: PricingPlan;
  index: number;
  view: PricingView;
}) {
  const timelineValue = plan.deliveryDays || plan.duration || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 42, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.14, duration: 0.55 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card
        className={cn(
          'relative flex h-full flex-col overflow-hidden border-border bg-card/90 text-card-foreground shadow-xl backdrop-blur-xl',
          plan.isPopular &&
            'border-sky-500/60 shadow-[0_-12px_100px_-28px_rgba(14,165,233,0.7)] dark:border-cyan-400/50'
        )}
      >
        {plan.isPopular && (
          <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 rounded-b-xl bg-gradient-to-l from-sky-500 to-blue-600 px-4 py-1.5 text-xs font-medium text-white dark:from-blue-600 dark:to-cyan-600">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Sparkles className="h-3.5 w-3.5" />
              انتخاب پیشنهادی
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-500/[0.06] via-transparent to-blue-500/[0.08] dark:from-cyan-400/[0.06]" />

        <CardHeader className={cn('relative space-y-4 text-right', plan.isPopular && 'pt-12')}>
          <div>
            <h2 className="text-2xl font-bold">{plan.title}</h2>
            <p className="mt-3 min-h-12 text-sm leading-7 text-muted-foreground">
              {plan.description}
            </p>
          </div>

          <motion.div
            key={view}
            initial={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.35 }}
            className="flex min-h-16 items-baseline gap-2"
          >
            {view === 'price' ? (
              <>
                <span className="text-4xl font-bold tracking-tight md:text-5xl">
                  <AnimatedNumber value={plan.price} />
                </span>
                <span className="text-sm text-muted-foreground">تومان</span>
              </>
            ) : timelineValue > 0 ? (
              <>
                <span className="text-4xl font-bold tracking-tight md:text-5xl">
                  <AnimatedNumber value={timelineValue} />
                </span>
                <span className="text-sm text-muted-foreground">روز تا تحویل</span>
              </>
            ) : (
              <span className="text-2xl font-bold">پس از بررسی پروژه</span>
            )}
          </motion.div>

          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {plan.duration > 0 && (
              <span className="flex items-center gap-1 rounded-full border bg-muted/50 px-3 py-1.5">
                <Clock3 className="h-3.5 w-3.5 text-sky-500 dark:text-cyan-400" />
                مدت پلن: {plan.duration.toLocaleString('fa-IR')} روز
              </span>
            )}
            {plan.deliveryDays > 0 && (
              <span className="flex items-center gap-1 rounded-full border bg-muted/50 px-3 py-1.5">
                <Clock3 className="h-3.5 w-3.5 text-sky-500 dark:text-cyan-400" />
                تحویل: {plan.deliveryDays.toLocaleString('fa-IR')} روز
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="relative flex min-h-72 flex-1 flex-col pt-0">
          <div className="mb-6 border-t pt-5">
            <h3 className="mb-4 text-sm font-semibold">امکانات این پلن</h3>
            <ul className="space-y-3">
              {(plan.features || []).map((feature, featureIndex) => (
                <motion.li
                  key={`${plan.id}-${featureIndex}`}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + featureIndex * 0.06 }}
                  className="flex items-start gap-3 text-sm leading-6"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500/15 dark:bg-cyan-500/15">
                    <Check className="h-3 w-3 text-sky-600 dark:text-cyan-400" />
                  </span>
                  <span>{feature.feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-auto">
            <Button
              asChild
              variant={plan.isPopular ? 'default' : 'outline'}
              className={cn(
                'h-12 w-full rounded-xl text-base',
                plan.isPopular && 'btn-primary shadow-glow'
              )}
            >
              <Link href="/#contact-form">
                تماس برای ثبت پروژه
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function PricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<PricingView>('price');

  useEffect(() => {
    let isMounted = true;

    pricingService.getAll().then((data) => {
      if (!isMounted) return;
      setPlans(data);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-transparent">
      <Navbar />

      <section className="relative min-h-screen overflow-hidden px-6 pb-24 pt-32">
        <div className="pointer-events-none absolute inset-0 bg-gradient-hero" />
        <div className="pointer-events-none absolute inset-x-[8%] top-0 h-[42rem] rounded-[50%] border-[120px] border-sky-500/15 blur-[90px] dark:border-blue-600/25" />
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,rgba(14,165,233,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,165,233,0.12)_1px,transparent_1px)] [background-size:70px_80px] dark:opacity-20" />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {sparklePoints.map((sparkle, index) => (
            <span
              key={index}
              className="absolute animate-pulse rounded-full bg-sky-500 dark:bg-cyan-300"
              style={{
                left: sparkle.left,
                top: sparkle.top,
                width: sparkle.size,
                height: sparkle.size,
                animationDelay: sparkle.delay,
                animationDuration: sparkle.duration,
              }}
            />
          ))}
        </div>

        <div className="container relative mx-auto">
          <motion.header
            initial={{ opacity: 0, y: -22, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.65 }}
            className="mx-auto mb-10 max-w-3xl text-center"
          >
            <span className="text-sm font-medium text-sky-600 dark:text-cyan-400">تعرفه‌های آریان‌لب</span>
            <h1 className="mt-3 text-4xl font-bold leading-tight md:text-6xl">
              پلنی که با نیاز کسب‌وکار شما هماهنگ است
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              قیمت‌ها، زمان تحویل و امکانات هر پلن مستقیماً از سامانه آریان‌لب دریافت می‌شوند.
            </p>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.18, duration: 0.45 }}
            className="mb-14"
          >
            <PricingSwitch value={view} onChange={setView} />
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center py-28">
              <Loader2 className="h-9 w-9 animate-spin text-sky-500 dark:text-cyan-400" />
            </div>
          ) : plans.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-2xl border bg-card/80 px-6 py-16 text-center text-muted-foreground backdrop-blur-xl">
              پلن قیمت‌گذاری فعالی برای نمایش وجود ندارد.
            </div>
          ) : (
            <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan, index) => (
                <PricingCard key={plan.id} plan={plan} index={index} view={view} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
