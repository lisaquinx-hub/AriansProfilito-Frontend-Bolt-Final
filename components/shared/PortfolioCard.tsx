'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Project } from '@/lib/mock-data';

interface PortfolioCardProps {
  project: Project;
  index?: number;
}

export function PortfolioCard({ project, index = 0 }: PortfolioCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-2xl glass transition-all duration-300 hover:shadow-glow">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 to-blue-500/20 dark:from-blue-500/20 dark:to-cyan-500/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-bold text-foreground/10">{project.title[0]}</span>
          </div>
          {/* Category Badge */}
          <div className="absolute top-4 right-4 flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-sky-500/20 dark:bg-cyan-500/20 text-sky-500 dark:text-cyan-400">
              {getCategoryLabel(project.category)}
            </span>
            {project.featured && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-500">
                ویژه
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2 group-hover:text-gradient transition-all">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* CTA Button */}
          <Link href={`/portfolio/${project.slug}`}>
            <motion.span
              whileHover={{ x: -4 }}
              className="inline-flex items-center text-sm text-sky-500 dark:text-cyan-400 group-hover:text-gradient transition-all mb-4"
            >
              مشاهده
              <ArrowLeft className="mr-1 h-4 w-4" />
            </motion.span>
          </Link>

          {/* Metric */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-sm text-muted-foreground">{project.metric}</span>
            <span className="text-lg font-bold text-gradient">{project.metricValue}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    web: 'طراحی وب',
    mobile: 'موبایل',
    saas: 'SaaS',
    ecommerce: 'فروشگاه',
    dashboard: 'داشبورد',
  };
  return labels[category] || category;
}
