'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Loader2 } from 'lucide-react';
import { pricingService } from '@/services/PricingService';
import { PricingPlan } from '@/types/api';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function PricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    pricingService.getAll().then((data) => {
      setPlans(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <main className="min-h-screen pt-24 pb-16 relative">
      <div className="absolute inset-0 bg-gradient-hero" />
      <Navbar />

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">تعرفه‌ها</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            بسته‌های متناسب با نیازهای کسب‌وکار شما
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            پلن قیمت‌گذاری‌ای یافت نشد
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'rounded-2xl p-8 relative',
                  plan.isPopular
                    ? 'glass border-2 border-sky-500/50 dark:border-cyan-500/50 scale-105 shadow-glow'
                    : 'glass'
                )}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1 rounded-full bg-gradient-to-l from-sky-500 to-blue-600 dark:from-blue-600 dark:to-cyan-600 text-sm font-medium flex items-center gap-1 text-white whitespace-nowrap">
                      <Sparkles className="w-3 h-3" />
                      محبوب‌ترین
                    </div>
                  </div>
                )}

                <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
                <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price.toLocaleString()}</span>
                  <span className="text-muted-foreground text-sm mr-2">تومان</span>
                  {plan.duration > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">مدت: {plan.duration} روز</div>
                  )}
                  {plan.deliveryDays > 0 && (
                    <div className="text-xs text-muted-foreground">تحویل: {plan.deliveryDays} روز</div>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {(plan.features || []).map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-sky-500/20 dark:bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-sky-500 dark:text-cyan-400" />
                      </div>
                      <span>{f.feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/#contact-form">
                  <Button
                    className={cn('w-full rounded-full', plan.isPopular ? 'btn-primary shadow-glow' : '')}
                    variant={plan.isPopular ? 'default' : 'outline'}
                  >
                    تماس برای ثبت پروژه
                  </Button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <Footer />
    </main>
  );
}
