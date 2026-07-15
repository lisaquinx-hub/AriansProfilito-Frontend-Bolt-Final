'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-hero overflow-hidden" />
      <div className="absolute top-1/4 right-1/4 w-48 md:w-96 h-48 md:h-96 bg-sky-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-48 md:w-96 h-48 md:h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* 404 Number */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-8xl md:text-[200px] font-bold text-gradient leading-none mb-6"
          >
            ۴۰۴
          </motion.div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            صفحه موردنظر یافت نشد
          </h1>

          {/* Description */}
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است.
            لطفاً آدرس را بررسی کنید یا به صفحه اصلی برگردید.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild className="btn-primary shadow-glow">
              <Link href="/">
                <Home className="ml-2 w-4 h-4" />
                صفحه اصلی
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/blog">
                <Search className="ml-2 w-4 h-4" />
                جست‌وجو در وبلاگ
              </Link>
            </Button>
          </div>

          {/* Additional Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 pt-8 border-t border-border"
          >
            <p className="text-muted-foreground mb-4">شاید به دنبال این موارد باشید:</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {[
                { href: '/#services', label: 'خدمات' },
                { href: '/#projects', label: 'پروژه‌ها' },
                { href: '/#contact', label: 'تماس' },
                { href: '/pricing', label: 'تعرفه‌ها' },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sky-500 dark:text-cyan-400 hover:text-sky-600 dark:hover:text-cyan-300 transition-colors flex items-center gap-1"
                >
                  {link.label}
                  <ArrowRight className="w-3 h-3" />
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
