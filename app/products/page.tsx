'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  Layers3,
  SearchCheck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { ProductCard, CategoryFilter, SearchBox, Pagination, EmptyState } from '@/components/shared';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { productService } from '@/services/ProductService';
import { Service } from '@/types/api';

const trustPoints = [
  {
    icon: SearchCheck,
    title: 'شروع از مسئله واقعی',
    description: 'قبل از طراحی، هدف کسب‌وکار و مسیر کاربر را روشن می‌کنیم.',
  },
  {
    icon: Layers3,
    title: 'ساختار آماده رشد',
    description: 'محصول طوری ساخته می‌شود که توسعه مرحله بعد پرهزینه نباشد.',
  },
  {
    icon: ShieldCheck,
    title: 'تحویل مطمئن',
    description: 'امنیت، سرعت، واکنش‌گرایی و کیفیت نهایی بخشی از تحویل است.',
  },
];

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
      { id: 'all', name: 'همه خدمات', count: products.length },
      ...(featuredCount > 0 ? [{ id: 'featured', name: 'ویژه', count: featuredCount }] : []),
      ...(standardCount > 0 ? [{ id: 'standard', name: 'تکمیلی', count: standardCount }] : []),
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

  return (
    <main className="relative min-h-screen overflow-x-hidden pb-16 pt-28">
      <Navbar />
      <div className="pointer-events-none absolute right-0 top-24 h-80 w-80 translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl dark:bg-cyan-400/10" />
      <div className="pointer-events-none absolute left-0 top-[42rem] h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

      <section className="container relative mx-auto px-6 pb-16 pt-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-4xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300">
            <Sparkles className="h-4 w-4" />
            خدمات طراحی و توسعه آرین پژوهش
          </span>
          <h1 className="mt-6 text-4xl font-black leading-tight md:text-5xl lg:text-6xl">
            راهکار دیجیتال، متناسب با
            <span className="text-gradient"> مرحله رشد شما</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
            از طراحی یک وب‌سایت حرفه‌ای تا ساخت پنل و سامانه اختصاصی؛ هر خدمت با شناخت نیاز،
            مسیر اجرای روشن و خروجی قابل‌اندازه‌گیری ارائه می‌شود.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="btn-primary shadow-glow">
              <Link href="/#contact-form">
                مشاوره برای شروع پروژه
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link href="/pricing">مشاهده تعرفه‌ها</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mx-auto mt-14 grid max-w-5xl gap-4 text-right md:grid-cols-3"
        >
          {trustPoints.map((point) => {
            const Icon = point.icon;
            return (
              <article key={point.title} className="glass rounded-2xl p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 text-sky-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-4 font-bold">{point.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{point.description}</p>
              </article>
            );
          })}
        </motion.div>
      </section>

      <section className="container relative mx-auto px-6" aria-labelledby="services-heading">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <span className="text-sm font-bold text-sky-700 dark:text-cyan-300">انتخاب خدمت</span>
          <h2 id="services-heading" className="mt-3 text-3xl font-black md:text-4xl">
            برای هر نیاز، یک مسیر اجرایی مشخص
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            جزئیات هر خدمت، امکانات قابل تحویل و زمان تقریبی اجرا را ببینید.
          </p>
        </div>

        <div className="glass mb-8 flex flex-col items-center justify-between gap-4 rounded-2xl p-4 md:flex-row md:p-5">
          <CategoryFilter
            categories={productCategories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
          <SearchBox
            placeholder="جست‌وجو میان خدمات..."
            onSearch={setSearchQuery}
            className="w-full md:w-80"
          />
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="glass h-[330px] animate-pulse rounded-2xl p-6">
                <div className="h-12 w-12 rounded-2xl bg-muted" />
                <div className="mt-7 h-6 w-1/2 rounded bg-muted" />
                <div className="mt-4 h-4 w-full rounded bg-muted" />
                <div className="mt-2 h-4 w-4/5 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : paginatedProducts.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {paginatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </motion.div>
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
            title="خدمتی با این مشخصات پیدا نشد"
            description="عبارت جست‌وجو یا فیلتر انتخاب‌شده را تغییر دهید."
            actionLabel="پاک کردن فیلترها"
            onAction={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
          />
        )}
      </section>

      <section className="container mx-auto px-6 pb-8 pt-20">
        <div className="glass relative overflow-hidden rounded-3xl px-6 py-10 text-center md:px-12 md:py-14">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-sky-500/10 via-transparent to-blue-500/10 dark:from-cyan-400/10" />
          <div className="relative mx-auto max-w-2xl">
            <CheckCircle2 className="mx-auto h-10 w-10 text-sky-600 dark:text-cyan-300" />
            <h2 className="mt-5 text-2xl font-black md:text-3xl">هنوز مطمئن نیستید کدام خدمت مناسب شماست؟</h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              نیازتان را کوتاه توضیح دهید؛ پیشنهاد فنی، زمان‌بندی و قدم بعدی را شفاف می‌کنیم.
            </p>
            <Button asChild className="btn-primary mt-7 shadow-glow">
              <Link href="/#contact-form">دریافت پیشنهاد اولیه</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
