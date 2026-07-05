'use client';

import { motion } from 'framer-motion';
import { Palette, Rocket, Zap, ArrowLeft } from 'lucide-react';
import { services } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const iconMap: { [key: string]: React.ElementType } = {
  Palette,
  Rocket,
  Zap,
};

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

export default function Services() {
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
          className="grid md:grid-cols-3 gap-6"
        >
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Palette;
            return (
              <motion.div
                key={service.id}
                variants={itemVariants}
                className={cn(
                  'group relative p-8 rounded-2xl transition-all duration-300',
                  'glass hover:glass-hover',
                  'cursor-pointer'
                )}
              >
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-sky-500 dark:text-cyan-400" />
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-xl font-semibold mb-4 group-hover:text-gradient transition-all">
                  {service.title}
                </h4>

                {/* Description */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Learn More */}
                <motion.a
                  href="#"
                  className="inline-flex items-center text-sm text-sky-500 dark:text-cyan-400 hover:text-sky-600 dark:hover:text-cyan-300 transition-colors"
                >
                  بیشتر بدانید
                  <ArrowLeft className="mr-1 h-4 w-4" />
                </motion.a>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500/5 to-blue-500/5 dark:from-sky-500/5 dark:to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
