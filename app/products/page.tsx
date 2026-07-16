'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ProductCard, PageHeader, CategoryFilter, SearchBox, Pagination, EmptyState } from '@/components/shared';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { productService } from '@/services/ProductService';
import { Service } from '@/types/api';

export default function ProductsPage() {
  const [products, setProducts] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 6;

  useEffect(() => {
    let cancelled = false;

    void productService.getProducts()
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLocaleLowerCase('fa-IR');
    const categoryFiltered = products.filter((product) => {
      if (selectedCategory === 'featured') return Boolean(product.isFeatured);
      if (selectedCategory === 'standard') return !product.isFeatured;
      return true;
    });

    if (!q) return categoryFiltered;

    return categoryFiltered.filter(
      (product) =>
        product.title.toLocaleLowerCase('fa-IR').includes(q) ||
        (product.shortDescription || '').toLocaleLowerCase('fa-IR').includes(q) ||
        (product.description || '').toLocaleLowerCase('fa-IR').includes(q) ||
        (product.features || []).some((feature) =>
          feature.title.toLocaleLowerCase('fa-IR').includes(q)
        )
    );
  }, [products, searchQuery, selectedCategory]);

  const productCategories = useMemo(() => {
    const featuredCount = products.filter((product) => product.isFeatured).length;
    const standardCount = products.length - featuredCount;

    return [
      { id: 'all', name: 'همه', count: products.length },
      ...(featuredCount > 0 ? [{ id: 'featured', name: 'ویژه', count: featuredCount }] : []),
      ...(standardCount > 0 ? [{ id: 'standard', name: 'سایر خدمات', count: standardCount }] : []),
    ];
  }, [products]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  if (isLoading) {
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
