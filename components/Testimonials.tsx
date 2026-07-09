'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

// There is no backend testimonials/reviews endpoint.
// This section shows an empty state until a real endpoint is available.
export default function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/5 dark:via-cyan-500/5 to-transparent" />
      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-medium text-sky-500 dark:text-cyan-400 mb-4">نظرات مشتریان</h2>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            اعتماد از تجربه‌ای دقیق شروع می‌شود
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center py-12 glass rounded-2xl"
        >
          <Quote className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">هنوز نظری ثبت نشده است.</p>
        </motion.div>
      </div>
    </section>
  );
}
