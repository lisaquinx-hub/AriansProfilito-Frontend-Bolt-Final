'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { heroService } from '@/services/HeroService';
import { HeroSection } from '@/types/api';
import { getSafeNavigationHref } from '@/lib/utils';

export default function Hero() {
  const [heroData, setHeroData] = useState<HeroSection | null>(null);

  useEffect(() => {
    const fetchHero = async () => {
      const data = await heroService.getActive();
      setHeroData(data);
    };
    fetchHero();
  }, []);

  const title = heroData?.title || 'نسل جدید';
  const subtitle = heroData?.subtitle || 'توسعه نرم‌افزار';
  const description = heroData?.description || 'طراحی مدرن، سرعت بالا و تجربه‌ای متفاوت';
  const primaryButtonText = heroData?.primaryButtonText || 'شروع همکاری';
  const configuredPrimaryButtonUrl = getSafeNavigationHref(
    heroData?.primaryButtonUrl,
    '/#contact-form'
  );
  const primaryButtonUrl =
    configuredPrimaryButtonUrl === '/register' ||
    configuredPrimaryButtonUrl === '/login' ||
    configuredPrimaryButtonUrl === '/dashboard/projects/new'
      ? '/#contact-form'
      : configuredPrimaryButtonUrl;
  const secondaryButtonText = heroData?.secondaryButtonText || 'نمونه‌کارها';
  const secondaryButtonUrl = getSafeNavigationHref(heroData?.secondaryButtonUrl, '/portfolio');

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent pt-20">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          >
            <Sparkles className="w-4 h-4 text-sky-500 dark:text-cyan-400" />
            <span className="text-sm text-foreground/80">استودیوی محصول دیجیتال ممتاز</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            <span className="text-gradient">{title}</span>
            <br />
            <span className="text-foreground">{subtitle}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            {description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                asChild
                size="lg"
                className="btn-primary px-8 py-6 shadow-glow text-lg group"
              >
                <Link href={primaryButtonUrl}>
                  {primaryButtonText}
                  <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-6 text-lg"
              >
                <Link href={secondaryButtonUrl}>
                  {secondaryButtonText}
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center gap-8 md:gap-16 mt-16"
          >
            {[
              { value: 'UX', label: 'تجربه روان' },
              { value: '۹۸٪', label: 'بهینه‌سازی عملکرد' },
              { value: 'SaaS', label: 'آماده رشد' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gradient">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
