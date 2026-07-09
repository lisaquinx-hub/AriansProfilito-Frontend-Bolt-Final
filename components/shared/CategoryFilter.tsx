'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
interface Category {
  id: string;
  name: string;
  count: number;
}

interface CategoryFilterProps {
  categories: Category[];
  selected: string;
  onSelect: (categoryId: string) => void;
  className?: string;
}

export function CategoryFilter({ categories, selected, onSelect, className }: CategoryFilterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex flex-wrap gap-2', className)}
    >
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={cn(
            'px-4 py-2 rounded-full text-sm transition-all duration-300',
            selected === category.id
              ? 'bg-gradient-to-l from-sky-500 to-blue-600 dark:from-blue-500 dark:to-cyan-500 text-white shadow-glow'
              : 'glass hover:bg-muted'
          )}
        >
          {category.name}
          <span className="mr-1 text-xs opacity-60">({category.count})</span>
        </button>
      ))}
    </motion.div>
  );
}
