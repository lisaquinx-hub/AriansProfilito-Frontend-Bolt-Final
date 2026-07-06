'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioCard, PageHeader, CategoryFilter, SearchBox, Pagination, EmptyState } from '@/components/shared';
import { PortfolioCardSkeleton } from '@/components/shared/SkeletonLoaders';
import { projects, portfolioCategories } from '@/lib/mock-data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Sparkles, Clock } from 'lucide-react';

type SortOption = 'newest' | 'oldest' | 'featured';

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects];

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.technologies?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort
    switch (sortOption) {
      case 'newest':
        result.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        break;
      case 'oldest':
        result.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
        break;
      case 'featured':
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [selectedCategory, searchQuery, sortOption]);

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProjects.slice(start, start + itemsPerPage);
  }, [filteredAndSortedProjects, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedProjects.length / itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortOption]);

  const sortOptions = [
    { value: 'newest', label: 'جدیدترین', icon: Clock },
    { value: 'oldest', label: 'قدیمی‌ترین', icon: Clock },
    { value: 'featured', label: 'ویژه', icon: Sparkles },
  ] as const;

  return (
    <main className="min-h-screen pt-24 pb-16 relative overflow-x-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-sky-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 relative">
        <PageHeader
          title="نمونه‌کارها"
          subtitle="پروژه‌های موفق ما را بررسی کنید"
          breadcrumbs={[
            { label: 'خانه', href: '/' },
            { label: 'نمونه‌کارها' },
          ]}
        />

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <CategoryFilter
              categories={portfolioCategories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
            <SearchBox
              placeholder="جستجوی پروژه..."
              onSearch={setSearchQuery}
              className="w-full md:w-80"
            />
          </div>

          {/* Sort Options */}
          <div className="flex items-center justify-end gap-2">
            <span className="text-sm text-muted-foreground ml-2">مرتب‌سازی:</span>
            {sortOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setSortOption(option.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                    sortOption === option.value
                      ? 'bg-gradient-to-l from-sky-500 to-blue-600 text-white'
                      : 'glass hover:bg-muted/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Results count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground mb-6"
        >
          {filteredAndSortedProjects.length} پروژه یافت شد
        </motion.p>

        {/* Projects Grid */}
        {!isLoaded ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <PortfolioCardSkeleton key={i} />
            ))}
          </div>
        ) : paginatedProjects.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {paginatedProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <PortfolioCard project={project} index={index} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="mt-12"
            />
          </>
        ) : (
          <EmptyState
            type="projects"
            actionLabel="پاک کردن فیلترها"
            onAction={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
          />
        )}
      </div>
    </main>
  );
}
