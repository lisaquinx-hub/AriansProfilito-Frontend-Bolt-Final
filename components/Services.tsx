'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { services as mockServices, products as mockProducts } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { servicesService } from '@/services/ServicesService';
import { Service } from '@/types/api';
import { resolveAssetUrl } from '@/lib/api-utils';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      const data = await servicesService.getAll();
      if (data && data.length > 0) {
        setServices(data.map(s => ({
          id: s.id,
          title: s.title,
          description: s.description,
          slug: s.id,
        })));
      } else {
        // Fallback to mock products if no services from API
        setServices(mockProducts.slice(0, 3).map(p => ({
          id: p.id,
          title: p.title,
          description: p.shortDescription,
          slug: p.slug,
        })));
      }
      setIsLoading(false);
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

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 mb-12"
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
                href={service.slug ? `/products/${service.slug}` : '/products'}
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

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center"
        >
          <Link href="/products">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="btn-primary gap-2 group">
                مشاهده همه خدمات
                <ArrowLeft className="w-4 w-4 transition-transform group-hover:-translate-x-1" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
