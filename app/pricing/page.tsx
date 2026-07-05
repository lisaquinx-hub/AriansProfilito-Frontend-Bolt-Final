'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { pricingPlans } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function PricingPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />

      <div className="container mx-auto px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">تعرفه‌ها</span>
          </h1>
          <p className="text-foreground/60 max-w-xl mx-auto">
            بسته‌های متناسب با نیازهای کسب‌وکار شما
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'rounded-2xl p-8 relative',
                plan.isPopular
                  ? 'glass border-2 border-cyan-500/50 scale-105 shadow-glow'
                  : 'glass'
              )}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1 rounded-full bg-gradient-to-l from-blue-600 to-cyan-600 text-sm font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    محبوب‌ترین
                  </div>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-foreground/50 text-sm mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-8">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-foreground/50 text-sm mr-2">تومان</span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-cyan-400" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href="/register">
                <Button
                  className={cn(
                    'w-full rounded-full',
                    plan.isPopular
                      ? 'bg-gradient-to-l from-blue-600 to-cyan-600 shadow-glow'
                      : ''
                  )}
                  variant={plan.isPopular ? 'default' : 'outline'}
                >
                  شروع همکاری
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Custom Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="glass rounded-2xl p-8 max-w-xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">نیاز به پروژه سفارشی دارید؟</h3>
            <p className="text-foreground/60 mb-6">
              برای پروژه‌های خاص، درخواست خود را ثبت کنید تا کارشناسان ما با شما تماس بگیرند.
            </p>
            <Link href="/contact">
              <Button variant="outline" className="rounded-full">
                درخواست مشاوره رایگان
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
