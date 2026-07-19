'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { portfolioService } from '@/services/PortfolioService';
import { PortfolioListItem } from '@/types/api';
import { useFeatureSettings } from '@/components/FeatureSettingsProvider';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function Projects() {
  const [items, setItems] = useState<PortfolioListItem[]>([]);
  const { isReady, portfolioEnabled } = useFeatureSettings();

  useEffect(() => {
    if (!isReady || !portfolioEnabled) return;

    let cancelled = false;
    portfolioService.getItems({ pageSize: 3, isFeatured: true }).then((result) => {
      if (cancelled) return;
      const data = result.items || [];
      if (data.length === 0) {
        portfolioService.getItems({ pageSize: 3 }).then((r) => {
          if (!cancelled) setItems(r.items || []);
        });
      } else {
        setItems(data);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [isReady, portfolioEnabled]);

  if (!isReady || !portfolioEnabled || items.length === 0) return null;

  return (
    <section id="projects" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button asChild variant="outline" className="rounded-full gap-2 group">
              <Link href="/portfolio">
                مشاهده همه نمونه‌کارها
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-medium text-sky-500 dark:text-cyan-400 mb-4">نمونه پروژه‌ها</h2>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            ساخته‌شده برای برندهایی که کیفیت را حس می‌کنند
          </h3>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {items.map((item) => (
            <motion.div key={item.id} variants={itemVariants} className="group relative">
              <Link href={`/portfolio/${encodeURIComponent(item.slug)}`}>
                <div className="relative overflow-hidden rounded-2xl glass transition-all duration-300 hover:shadow-glow">
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-500/30 to-blue-500/30 dark:from-blue-600/30 dark:to-cyan-600/30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl font-bold text-white/20">{item.title[0]}</div>
                    </div>
                    {item.categoryName && (
                      <div className="absolute top-3 left-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-black/30 text-white backdrop-blur-sm">
                          {item.categoryName}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-semibold mb-3 group-hover:text-gradient transition-all">
                      {item.title}
                    </h4>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2">
                      {item.shortDescription || ''}
                    </p>
                    <div className="mb-4">
                      <span className="inline-flex items-center text-sm text-sky-500 dark:text-cyan-400 group-hover:text-gradient transition-all">
                        مشاهده پروژه
                        <ArrowLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-sm text-muted-foreground">{item.clientName}</span>
                      <span className="text-sm text-muted-foreground">{new Date(item.projectDate).getFullYear()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mt-12"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button asChild className="btn-primary gap-2 group">
              <Link href="/portfolio">
                مشاهده همه نمونه‌کارها
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
