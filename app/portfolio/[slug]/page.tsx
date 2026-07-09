'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PageHeader } from '@/components/shared';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Calendar, Globe, Github, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { portfolioService } from '@/services/PortfolioService';
import { PortfolioDetail } from '@/types/api';

export default function PortfolioDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = (Array.isArray(params?.slug) ? params.slug[0] : params?.slug) as string;

  const [item, setItem] = useState<PortfolioDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    portfolioService.getBySlug(slug).then((data) => {
      if (data) setItem(data);
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

  if (notFound || !item) {
    return (
      <main className="min-h-screen pt-24 pb-16 relative overflow-x-hidden">
        <Navbar />
        <div className="container mx-auto px-6 py-20 text-center">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold mb-2">نمونه کار یافت نشد</h2>
          <p className="text-muted-foreground mb-6">پروژه مورد نظر وجود ندارد یا حذف شده است.</p>
          <Link href="/portfolio">
            <Button variant="outline" className="rounded-full gap-2">
              <ArrowLeft className="w-4 h-4 rotate-180" />
              بازگشت به نمونه‌کارها
            </Button>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16 relative overflow-x-hidden">
      <Navbar />
      <div className="absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-sky-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 relative">
        <PageHeader
          title={item.title}
          subtitle={item.shortDescription || item.description}
          breadcrumbs={[
            { label: 'خانه', href: '/' },
            { label: 'نمونه‌کارها', href: '/portfolio' },
            { label: item.title },
          ]}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden glass p-2 mb-12"
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-sky-500/20 to-blue-500/20 dark:from-blue-500/20 dark:to-cyan-500/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[120px] md:text-[200px] font-bold text-foreground/5">
                {item.title[0]}
              </span>
            </div>
            <div className="absolute top-6 right-6 flex items-center gap-2">
              {item.isFeatured && (
                <span className="px-4 py-2 rounded-full text-sm font-medium glass">ویژه</span>
              )}
              {item.categoryName && (
                <span className="px-4 py-2 rounded-full text-sm font-medium glass">{item.categoryName}</span>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-8 mb-8"
            >
              <h2 className="text-xl font-bold mb-4">درباره پروژه</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {item.description}
              </p>
            </motion.div>

            {item.technologies && item.technologies.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-2xl p-8"
              >
                <h2 className="text-xl font-bold mb-4">تکنولوژی‌های استفاده شده</h2>
                <div className="flex flex-wrap gap-2">
                  {item.technologies.map((t) => (
                    <span
                      key={t.id}
                      className="px-3 py-1.5 rounded-lg text-sm glass"
                      style={t.color ? { borderColor: t.color + '40', color: t.color } : {}}
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="glass rounded-2xl p-6 space-y-4 sticky top-28">
              <h3 className="font-semibold text-lg mb-2">اطلاعات پروژه</h3>

              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-sky-500 flex-shrink-0" />
                <span className="text-muted-foreground">
                  {item.projectDate ? new Date(item.projectDate).toLocaleDateString('fa-IR') : '-'}
                </span>
              </div>

              <div className="pt-2">
                <span className="text-sm text-muted-foreground">مشتری:</span>
                <div className="font-medium mt-1">{item.clientName}</div>
              </div>

              {item.websiteUrl && (
                <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full rounded-full gap-2 mt-2">
                    <Globe className="w-4 h-4" />
                    مشاهده وب‌سایت
                  </Button>
                </a>
              )}
              {item.githubUrl && (
                <a href={item.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full rounded-full gap-2">
                    <Github className="w-4 h-4" />
                    GitHub
                  </Button>
                </a>
              )}
            </div>
          </motion.div>
        </div>

        <div className="mt-12">
          <Link href="/portfolio">
            <Button variant="outline" className="rounded-full gap-2">
              <ArrowLeft className="w-4 h-4 rotate-180" />
              بازگشت به نمونه‌کارها
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
