'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PortfolioListItem } from '@/types/api';

interface PortfolioCardProps {
  project: PortfolioListItem;
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
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-sky-500/20 to-blue-500/20 dark:from-blue-500/20 dark:to-cyan-500/20">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-bold text-foreground/10">{project.title[0]}</span>
          </div>
          {project.categoryName && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-sky-500/20 dark:bg-cyan-500/20 text-sky-500 dark:text-cyan-400">
                {project.categoryName}
              </span>
            </div>
          )}
          {project.isFeatured && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-500">
                ویژه
              </span>
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2 group-hover:text-gradient transition-all line-clamp-2">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {project.shortDescription || ''}
          </p>

          <Link href={`/portfolio/${encodeURIComponent(project.slug)}`}>
            <motion.span
              whileHover={{ x: -4 }}
              className="inline-flex items-center text-sm text-sky-500 dark:text-cyan-400 mb-4"
            >
              مشاهده پروژه
              <ArrowLeft className="mr-1 h-4 w-4" />
            </motion.span>
          </Link>

          <div className="flex items-center justify-between pt-4 border-t border-border text-sm text-muted-foreground">
            <span>{project.clientName}</span>
            <span>{new Date(project.projectDate).toLocaleDateString('fa-IR')}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
