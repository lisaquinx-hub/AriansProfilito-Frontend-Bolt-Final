'use client';

import { motion } from 'framer-motion';
import { projects } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function Projects() {
  return (
    <section id="projects" className="py-24 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
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

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-2xl glass">
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500/30 to-blue-500/30 dark:from-blue-600/30 dark:to-cyan-600/30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-4xl font-bold text-white/20 dark:text-white/20">{project.title[0]}</div>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <h4 className="text-xl font-semibold mb-3 group-hover:text-gradient transition-all">
                    {project.title}
                  </h4>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Metric */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-sm text-muted-foreground">{project.metric}</span>
                    <span className="text-lg font-bold text-gradient">{project.metricValue}</span>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
