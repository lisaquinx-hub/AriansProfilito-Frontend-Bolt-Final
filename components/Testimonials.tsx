'use client';

import { motion } from 'framer-motion';
import { testimonials } from '@/lib/mock-data';
import { Quote } from 'lucide-react';

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
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export default function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/5 dark:via-cyan-500/5 to-transparent" />

      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
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

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              className="relative p-6 rounded-2xl glass glass-hover group transition-all"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-sky-500/30 dark:text-cyan-500/30 mb-4" />

              {/* Quote */}
              <p className="text-foreground/80 mb-6 leading-relaxed">
                «{testimonial.quote}»
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 dark:from-blue-500 dark:to-cyan-500 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {testimonial.author[0]}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-sm">{testimonial.author}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
