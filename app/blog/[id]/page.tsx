'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Clock, User2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BlogPostPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* Back Link */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowRight className="w-4 h-4" />
          بازگشت به وبلاگ
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-sm text-sky-500 dark:text-cyan-400 mb-4 block">طراحی</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              اصول طراحی تجربه کاربری در سال ۲۰۲۶
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <User2 className="w-4 h-4" />
                <span>علی محمدی</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>۸ دقیقه</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>طراحی</span>
              </div>
            </div>
          </motion.div>

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-video rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-500/20 dark:from-blue-500/20 dark:to-cyan-500/20 flex items-center justify-center mb-12"
          >
            <span className="text-8xl font-bold text-foreground/10">۱</span>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg prose-invert mx-auto"
          >
            <p className="text-foreground/80 leading-relaxed mb-6">
              دنیای طراحی دیجیتال در حال تحولی شگرف است. با ورود هوش مصنوعی و ابزارهای جدید،
              طراحان باید با مهارت‌های جدید آشنا شوند و روندهای جدید را دنبال کنند.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">روندهای کلیدی</h2>

            <p className="text-foreground/80 leading-relaxed mb-6">
              یکی از مهم‌ترین روندها، طراحی مینیمال و تمرکز بر سادگی است. کاربران امروز
              به دنبال تجربه‌ای روان و بدون پیچیدگی هستند و طراحی‌های پیچیده دیگر طرفی ندارند.
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-3">مینیمالیسم</h3>

            <p className="text-foreground/80 leading-relaxed mb-6">
              طراحی مینیمال به معنای حذف همه عناصر نیست، بلکه به معنای ساده‌سازی و تمرکز بر
              عناصر ضروری است. این رویکرد به کاربران کمک می‌کند تا سریع‌تر به هدف خود برسند.
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-3">انیمیشن‌های ظریف</h3>

            <p className="text-foreground/80 leading-relaxed mb-6">
              انیمیشن‌های ظریف و معنادار می‌توانند تجربه کاربر را به سطح جدیدی ببرند. اما
              باید مراقب بود که انیمیشن‌ها بیش از حد نگذاریم و کاربر را خسته نکنیم.
            </p>

            <div className="my-12 p-6 rounded-xl glass border-r-4 border-r-sky-500 dark:border-r-cyan-500">
              <p className="text-foreground/80 italic">
                طراحی خوب زمانی رخ می‌دهد که کاربر اصلاً تلاشی برای درک طراحی نکند.
              </p>
            </div>

            <h2 className="text-2xl font-bold mt-10 mb-4">نتیجه‌گیری</h2>

            <p className="text-foreground/80 leading-relaxed">
              در پایان، موفقیت در طراحی دیجیتال به توانایی شما در تعادل بین زیبایی و
              کارایی بستگی دارد. با رعایت اصولی که در این مقاله به آن‌ها اشاره شد،
              می‌توانید تجربه‌ای ممتاز برای کاربران خود خلق کنید.
            </p>
          </motion.div>

          {/* Share Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 pt-8 border-t border-border"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <span className="text-muted-foreground">اشتراک‌گذاری:</span>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="rounded-full">
                  تلگرام
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  لینکدین
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  کپی لینک
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-between mt-12">
            <Link href="/blog">
              <Button variant="outline" className="rounded-full">
                مقالات بیشتر
                <ArrowLeft className="mr-2" />
              </Button>
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
