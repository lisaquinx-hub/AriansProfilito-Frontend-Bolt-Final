'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Check, Clock3 } from 'lucide-react';
import { Service } from '@/types/api';
import { ServiceIcon } from './ServiceIcon';

interface ProductCardProps {
  product: Service;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.07, 0.28) }}
      className="group relative h-full"
    >
      <Link
        href={`/products/${encodeURIComponent(product.slug)}`}
        aria-label={`مشاهده جزئیات ${product.title}`}
        className="block h-full"
      >
        <article className="glass relative flex h-full min-h-[330px] flex-col overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
          <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl dark:bg-cyan-400/10" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-sky-500/[0.045] to-transparent dark:from-cyan-400/[0.045]" />

          <div className="relative flex items-start justify-between gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/80 bg-background/80 text-sky-600 shadow-sm dark:border-white/10 dark:bg-white/[0.06] dark:text-cyan-300">
              <ServiceIcon icon={product.icon} title={product.title} className="h-6 w-6" />
            </span>
            <span className="rounded-full border border-sky-500/15 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-cyan-400/15 dark:bg-cyan-400/10 dark:text-cyan-300">
              {product.isFeatured ? 'خدمت ویژه' : 'خدمت تخصصی'}
            </span>
          </div>

          <div className="relative mt-6 flex-1">
            <h3 className="text-xl font-bold transition-colors group-hover:text-sky-700 dark:group-hover:text-cyan-300">
              {product.title}
            </h3>
            <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted-foreground">
              {product.shortDescription || product.description || 'برای دریافت جزئیات این خدمت با ما تماس بگیرید.'}
            </p>

            {product.features && product.features.length > 0 && (
              <ul className="mt-5 space-y-2">
                {product.features.slice(0, 3).map((feature, featureIndex) => (
                  <li
                    key={feature.id || `${product.id}-${featureIndex}`}
                    className="flex items-center gap-2 text-xs text-foreground/75"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="line-clamp-1">{feature.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <footer className="relative mt-6 flex items-center justify-between border-t border-border/80 pt-4 dark:border-white/10">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock3 className="h-4 w-4" />
              {product.estimatedDeliveryDays
                ? `حدود ${product.estimatedDeliveryDays} روز`
                : 'زمان‌بندی توافقی'}
            </span>
            <span className="inline-flex items-center text-sm font-bold text-sky-700 dark:text-cyan-300">
              مشاهده جزئیات
              <ArrowLeft className="mr-1.5 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </span>
          </footer>
        </article>
      </Link>
    </motion.div>
  );
}
