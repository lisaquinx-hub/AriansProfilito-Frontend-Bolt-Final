'use client';

import { motion } from 'framer-motion';
import { FolderOpen, FileText, Bell, Search, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type EmptyStateType = 'products' | 'projects' | 'blog' | 'notifications' | 'search' | 'default';

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

const defaultContent: Record<EmptyStateType, { icon: React.ElementType; title: string; description: string }> = {
  products: {
    icon: Package,
    title: 'محصولی یافت نشد',
    description: 'محصولی با مشخصات موردنظر وجود ندارد. فیلترها را تغییر دهید.',
  },
  projects: {
    icon: FolderOpen,
    title: 'پروژه‌ای یافت نشد',
    description: 'پروژه‌ای با این مشخصات وجود ندارد.',
  },
  blog: {
    icon: FileText,
    title: 'مقاله‌ای یافت نشد',
    description: 'مقاله‌ای در این دسته‌بندی وجود ندارد.',
  },
  notifications: {
    icon: Bell,
    title: 'اعلانی وجود ندارد',
    description: 'شما هیچ اعلان جدیدی ندارید.',
  },
  search: {
    icon: Search,
    title: 'نتیجه‌ای یافت نشد',
    description: 'عبارت دیگری را جست‌وجو کنید.',
  },
  default: {
    icon: FolderOpen,
    title: 'محتوایی یافت نشد',
    description: 'محتوایی در این بخش وجود ندارد.',
  },
};

export function EmptyState({
  type = 'default',
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  const content = defaultContent[type];
  const Icon = content.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {title || content.title}
      </h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        {description || content.description}
      </p>
      {(actionLabel && actionHref) && (
        <Button asChild className="btn-primary shadow-glow">
          <Link href={actionHref}>
            {actionLabel}
          </Link>
        </Button>
      )}
      {(actionLabel && onAction && !actionHref) && (
        <Button onClick={onAction} className="btn-primary shadow-glow">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
