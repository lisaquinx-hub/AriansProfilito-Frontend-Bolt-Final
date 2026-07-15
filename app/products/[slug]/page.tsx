'use client';

// Local catalog products and backend service slugs share this detail route.

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Check, Loader2, AlertCircle, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionTitle } from '@/components/shared';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { productService } from '@/services/ProductService';
import { Service } from '@/types/api';

export default function ProductDetailsPage() {
  const params = useParams<{ slug: string }>();
  const slug = (Array.isArray(params?.slug) ? params.slug[0] : params?.slug) as string;

  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    productService.getProduct(slug).then((data) => {
      if (data) setService(data);
      else setNotFound(true);
      setIsLoading(false);
    });
  }, [slug]);

  if (isLoading) {
    return (
      <main className="min-h-screen pt-24 pb-16 relative overflow-x-hidden">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        </div>
        <Footer />
      </main>
    );
  }

  if (notFound || !service) {
    return (
      <main className="min-h-screen pt-24 pb-16 relative overflow-x-hidden">
        <Navbar />
        <div className="container mx-auto px-6 py-20 text-center">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold mb-2">سرویس یافت نشد</h2>
          <p className="text-muted-foreground mb-6">سرویس موردنظر وجود ندارد یا غیرفعال شده است.</p>
          <Button asChild variant="outline" className="rounded-full gap-2">
            <Link href="/products">
              <ArrowRight className="w-4 h-4" />
              بازگشت به خدمات
            </Link>
          </Button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16 relative overflow-x-hidden">
      <Navbar />
      <div className="container mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">خانه</Link>
          <ChevronLeft className="w-4 h-4" />
          <Link href="/products" className="hover:text-foreground">خدمات</Link>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-foreground">{service.title}</span>
        </nav>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl overflow-hidden mb-16"
        >
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="relative aspect-video lg:aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 to-blue-500/20 dark:from-blue-500/20 dark:to-cyan-500/20 flex items-center justify-center">
                <span className="text-[150px] font-bold text-foreground/10">
                  {service.title[0]}
                </span>
              </div>
              {service.isFeatured && (
                <span className="absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-medium bg-sky-500/20 dark:bg-cyan-500/20 text-sky-500 dark:text-cyan-400">
                  ویژه
                </span>
              )}
            </div>

            <div className="p-8 flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
                {service.title}
              </h1>
              <p className="text-muted-foreground text-lg mb-6">
                {service.shortDescription || service.description}
              </p>

              {service.estimatedDeliveryDays != null && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl glass">
                    <span className="text-sm text-muted-foreground">زمان تحویل</span>
                    <div className="text-lg font-semibold mt-1">
                      {service.estimatedDeliveryDays} روز
                    </div>
                  </div>
                </div>
              )}

              <Button asChild className="btn-primary shadow-glow w-full md:w-auto">
                <Link href="/#contact-form">
                  شروع پروژه
                  <ArrowRight className="mr-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Description */}
        {service.description && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <SectionTitle badge="توضیحات" title="درباره این سرویس" />
            <div className="glass rounded-2xl p-8">
              <div className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {service.description}
              </div>
            </div>
          </motion.section>
        )}

        {/* Features */}
        {service.features && service.features.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <SectionTitle badge="ویژگی‌ها" title="چرا این سرویس؟" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {service.features.map((feature, index) => (
                <motion.div
                  key={feature.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-xl glass hover:glass-hover transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                  <h4 className="font-semibold">{feature.title}</h4>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="glass rounded-2xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-blue-500/10 dark:from-blue-500/10 dark:to-cyan-500/10" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">آماده شروع پروژه هستید؟</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                همین حالا با ما تماس بگیرید و پروژه خود را شروع کنید
              </p>
              <Button asChild size="lg" className="btn-primary shadow-glow text-lg px-10">
                <Link href="/#contact-form">
                  تماس با ما
                  <ArrowRight className="mr-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.section>
      </div>
      <Footer />
    </main>
  );
}
