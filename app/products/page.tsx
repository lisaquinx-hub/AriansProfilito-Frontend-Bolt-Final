'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ProductCard, PageHeader, CategoryFilter, SearchBox, Pagination, EmptyState } from '@/components/shared';
import { products, productCategories } from '@/lib/mock-data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;

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
          p.shortDescription.toLowerCase().includes(q) ||
          p.technologies.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [selectedCategory, searchQuery]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  if (!isLoaded) {
    return (
      <main className="pt-24 pb-16">
        <Navbar />
        <div className="container mx-auto px-6">
          <PageHeader title="محصولات" subtitle="خدمات دیجیتال ما برای رشد کسب‌وکار شما" />
          <div className="animate-pulse">
            <div className="h-12 bg-muted rounded mb-8" />
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-muted rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16 relative overflow-x-hidden">
      <Navbar />
      <div className="container mx-auto px-6">
        <PageHeader
          title="محصولات"
          subtitle="خدمات دیجیتال ما برای رشد کسب‌وکار شما"
          breadcrumbs={[
            { label: 'خانه', href: '/' },
            { label: 'محصولات' },
          ]}
        />

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8"
        >
          <CategoryFilter
            categories={productCategories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
          <SearchBox
            placeholder="جست‌وجوی محصول..."
            onSearch={setSearchQuery}
            className="w-full md:w-80"
          />
        </motion.div>

        {/* Products Grid */}
        {paginatedProducts.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {paginatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
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
            type="products"
            actionLabel="پاک کردن فیلترها"
            onAction={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
          />
        )}
      </div>
      <Footer />
    </main>
  );
}
