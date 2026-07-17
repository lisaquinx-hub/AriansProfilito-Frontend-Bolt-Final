'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogCoverImage } from '@/components/shared/BlogCoverImage';
import { cn } from '@/lib/utils';
import { servicesService } from '@/services/ServicesService';

const servicesBannerImage =
  'https://images.unsplash.com/photo-1619243142206-381c5aeda31c?w=1200&auto=format&fit=crop&q=80';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

interface DisplayService {
  id: string;
  title: string;
  description: string;
  slug?: string;
}

export default function Services() {
  const [services, setServices] = useState<DisplayService[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      const data = await servicesService.getAll();
      if (data && data.length > 0) {
        setServices(data.map(s => ({
          id: s.id,
          title: s.title,
          description: s.shortDescription || s.description || 'برای دریافت جزئیات این خدمت با ما تماس بگیرید.',
          slug: s.slug || s.id,
        })));
      }
    };
    fetchServices();
  }, []);

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-medium text-sky-500 dark:text-cyan-400 mb-4">خدمات</h2>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            از ایده تا محصولی که حس ممتاز دارد
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            هر جزئیات، از معماری فنی تا حرکت‌های ظریف رابط کاربری، برای سرعت، اعتماد و رشد طراحی می‌شود.
          </p>
        </motion.div>

        {/* Clickable services banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10"
        >
          <Link
            href="/products"
            aria-label="مشاهده همه خدمات"
            className="group relative block h-64 overflow-hidden rounded-2xl border border-border shadow-lg md:h-80"
          >
            <BlogCoverImage
              src={servicesBannerImage}
              alt="مشاهده خدمات آریان‌لب"
              className="h-full w-full"
              imageClassName="transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-white md:p-8">
              <div>
                <h4 className="mb-2 text-2xl font-bold md:text-3xl">خدمات آریان‌لب</h4>
                <p className="text-sm text-white/85 md:text-base">
                  طراحی و توسعه راهکارهای حرفه‌ای متناسب با کسب‌وکار شما
                </p>
              </div>
              <span className="hidden items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm sm:inline-flex">
                مشاهده خدمات
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Services Grid */}
        {services.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12 grid gap-6 md:grid-cols-3"
          >
            {services.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              className={cn(
                'group relative p-8 rounded-2xl transition-all duration-300',
                'glass hover:glass-hover'
              )}
            >
              {/* Icon */}
              <div className="mb-6">
                <div className="w-14 h-14 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold text-sky-500 dark:text-cyan-400">
                    {service.title[0]}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h4 className="text-xl font-semibold mb-4 group-hover:text-gradient transition-all">
                {service.title}
              </h4>

              {/* Description */}
              <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-2">
                {service.description}
              </p>

              {/* Learn More */}
              <Link
                href={service.slug ? `/products/${encodeURIComponent(service.slug)}` : '/products'}
                className="inline-flex items-center text-sm text-sky-500 dark:text-cyan-400 hover:text-sky-600 dark:hover:text-cyan-300 transition-colors group/link"
              >
                بیشتر بدانید
                <ArrowLeft className="mr-1 h-4 w-4 transition-transform group-hover/link:-translate-x-1" />
              </Link>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500/5 to-blue-500/5 dark:from-sky-500/5 dark:to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </motion.div>
            ))}
          </motion.div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button asChild className="btn-primary gap-2 group">
              <Link href="/products">
                مشاهده همه خدمات
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
