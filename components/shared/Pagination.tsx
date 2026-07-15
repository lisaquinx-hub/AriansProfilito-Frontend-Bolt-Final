'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('flex items-center justify-center gap-2', className)}
    >
      {/* Previous */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="rounded-full"
        aria-label="صفحه قبل"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      {/* Page Numbers */}
      {pages.map((page, index) => (
        <span key={index}>
          {page === '...' ? (
            <span className="px-3 text-muted-foreground">...</span>
          ) : (
            <Button
              variant={currentPage === page ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onPageChange(page as number)}
              aria-label={`صفحه ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
              className={cn(
                'rounded-full min-w-[40px]',
                currentPage === page && 'bg-gradient-to-l from-sky-500 to-blue-600 dark:from-blue-500 dark:to-cyan-500'
              )}
            >
              {page}
            </Button>
          )}
        </span>
      ))}

      {/* Next */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="rounded-full"
        aria-label="صفحه بعد"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}

function getPageNumbers(current: number, total: number): (number | string)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];

  if (current <= 3) {
    pages.push(1, 2, 3, 4, '...', total);
  } else if (current >= total - 2) {
    pages.push(1, '...', total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, '...', current - 1, current, current + 1, '...', total);
  }

  return pages;
}
