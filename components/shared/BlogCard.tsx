'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, User, Eye, Heart } from 'lucide-react';
import { BlogPost } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface BlogCardProps {
  post: BlogPost;
  index?: number;
  variant?: 'default' | 'compact' | 'horizontal';
}

export function BlogCard({ post, index = 0, variant = 'default' }: BlogCardProps) {
  if (variant === 'horizontal') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group relative flex gap-4 p-4 rounded-xl glass hover:glass-hover transition-all"
      >
        {/* Image */}
        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-sky-500/20 to-blue-500/20 dark:from-blue-500/20 dark:to-cyan-500/20">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-foreground/10">{post.title[0]}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <span className="text-xs text-sky-500 dark:text-cyan-400">{post.category}</span>
          <h4 className="font-semibold mt-1 group-hover:text-gradient transition-all line-clamp-2">
            {post.title}
          </h4>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime}
            </span>
          </div>
        </div>

        <Link href={`/blog/${post.slug}`} className="absolute inset-0" />
      </motion.div>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group relative"
      >
        <div className="p-4 rounded-xl glass hover:glass-hover transition-all">
          <span className="text-xs text-sky-500 dark:text-cyan-400">{post.category}</span>
          <h4 className="font-semibold mt-1 text-sm group-hover:text-gradient transition-all line-clamp-2">
            {post.title}
          </h4>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{post.readTime}</span>
          </div>
          <Link href={`/blog/${post.slug}`} className="absolute inset-0" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-2xl glass transition-all duration-300 hover:shadow-glow">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-sky-500/20 to-blue-500/20 dark:from-blue-500/20 dark:to-cyan-500/20">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-bold text-foreground/10">{post.title[0]}</span>
          </div>
          {/* Category Badge */}
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-sky-500/20 dark:bg-cyan-500/20 text-sky-500 dark:text-cyan-400">
              {post.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2 group-hover:text-gradient transition-all line-clamp-2">
            {post.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between pt-4 border-t border-border text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>

          <Link href={`/blog/${post.slug}`} className="absolute inset-0" />
        </div>
      </div>
    </motion.div>
  );
}
