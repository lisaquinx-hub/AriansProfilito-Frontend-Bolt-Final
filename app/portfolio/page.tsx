'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader, CategoryFilter, SearchBox, Pagination, EmptyState } from '@/components/shared';
import { PortfolioCardSkeleton } from '@/components/shared/SkeletonLoaders';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { portfolioService } from '@/services/PortfolioService';
import { PortfolioListItem, PortfolioCategory } from '@/types/api';

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<PortfolioListItem[]>([]);
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 9;

  useEffect(() => {
    portfolioService.getCategories().then((cats) => setCategories(cats));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    portfolioService.getItems({
      pageNumber: currentPage,
      pageSize: itemsPerPage,
      categorySlug: selectedCategory !== 'all' ? selectedCategory : undefined,
      search: searchQuery || undefined,
    }).then((result) => {
      setItems(result.items || []);
      setTotalCount(result.totalCount || 0);
      setIsLoading(false);
    });
  }, [currentPage, selectedCategory, searchQuery]);

  useEffect(() => { setCurrentPage(1); }, [selectedCategory, searchQuery]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const displayCategories = [
    { id: 'all', name: 'همه', count: totalCount },
    ...categories.map(c => ({ id: c.slug || c.id, name: c.name, count: c.portfolioCount || 0 })),
  ];

  return (
    <main className="min-h-screen pt-24 pb-16 relative overflow-x-hidden">
      <Navbar />
      <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-sky-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 relative">
        <PageHeader
          title="نمونه‌کارها"
          subtitle="پروژه‌های موفقی که با مشتریان عزیز اجرا کرده‌ایم"
          breadcrumbs={[{ label: 'خانه', href: '/' }, { label: 'نمونه‌کارها' }]}
        />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <CategoryFilter categories={displayCategories} selected={selectedCategory} onSelect={setSelectedCategory} />
          <SearchBox placeholder="جست‌وجو در پروژه‌ها..." onSearch={setSearchQuery} className="w-full md:w-80" />
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <PortfolioCardSkeleton key={i} />)}
          </div>
        ) : items.length > 0 ? (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
                    <Link href={`/portfolio/${encodeURIComponent(item.slug)}`}>
                      <div className="group glass rounded-2xl overflow-hidden hover:glass-hover transition-all">
                        <div className="relative aspect-video bg-gradient-to-br from-sky-500/20 to-blue-500/20 dark:from-blue-500/20 dark:to-cyan-500/20 flex items-center justify-center">
                          <span className="text-5xl font-bold text-foreground/10">{item.title[0]}</span>
                          {item.isFeatured && (
                            <div className="absolute top-3 right-3"><span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/20">ویژه</span></div>
                          )}
                          {item.categoryName && (
                            <div className="absolute top-3 left-3"><span className="text-xs px-2 py-1 rounded-full glass text-muted-foreground">{item.categoryName}</span></div>
                          )}
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-semibold mb-2 group-hover:text-gradient transition-all">{item.title}</h3>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{item.shortDescription || ''}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                            <span>{item.clientName}</span>
                            <span>{new Date(item.projectDate).toLocaleDateString('fa-IR')}</span>
                          </div>
                          {item.technologies && item.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {item.technologies.slice(0, 3).map(t => (
                                <span key={t.id} className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">{t.name}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} className="mt-12" />
          </>
        ) : (
          <EmptyState
            type="projects"
            title="نمونه‌کاری یافت نشد"
            description="موردی با مشخصات موردنظر وجود ندارد."
            actionLabel="پاک کردن فیلترها"
            onAction={() => { setSelectedCategory('all'); setSearchQuery(''); }}
          />
        )}
      </div>
      <Footer />
    </main>
  );
}
