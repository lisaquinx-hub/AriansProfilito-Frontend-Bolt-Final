'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Clock, User } from 'lucide-react';
import { blogPosts } from '@/lib/mock-data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">وبلاگ</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            مقالات آموزشی، آخرین اخبار و روندهای دنیای تکنولوژی
          </p>
        </motion.div>

        {/* Featured Post */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl overflow-hidden mb-12"
        >
          <div className="grid md:grid-cols-2">
            <div className="aspect-video bg-gradient-to-br from-sky-500/20 to-blue-500/20 dark:from-blue-500/20 dark:to-cyan-500/20 flex items-center justify-center">
              <span className="text-6xl font-bold text-foreground/10">۱</span>
            </div>
            <div className="p-8 flex flex-col justify-center">
              <span className="text-sm text-sky-500 dark:text-cyan-400 mb-3">مقاله ویژه</span>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                آینده طراحی محصول: از ایده تا واقعیت
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                در این مقاله به بررسی روندهای جدید طراحی محصول در بازار ایران و جهان می‌پردازیم
                و نحوه پیاده‌سازی آنها را بررسی خواهیم کرد.
              </p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>علی محمدی</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>۱۵ دقیقه</span>
                </div>
              </div>
              <Link href="/blog/1" className="inline-flex items-center text-sky-500 dark:text-cyan-400 hover:text-sky-600 dark:hover:text-cyan-300">
                ادامه مطلب
                <ArrowLeft className="mr-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.article>

        {/* Posts Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-8"
        >
          {blogPosts.map((post) => (
            <motion.article
              key={post.id}
              variants={itemVariants}
              className="group glass rounded-xl overflow-hidden glass-hover transition-colors"
            >
              <div className="aspect-video bg-gradient-to-br from-sky-500/10 to-blue-500/10 dark:from-blue-500/10 dark:to-cyan-500/10 flex items-center justify-center">
                <span className="text-4xl font-bold text-foreground/10">{post.id}</span>
              </div>
              <div className="p-6">
                <span className="text-xs text-sky-500 dark:text-cyan-400">{post.category}</span>
                <h3 className="text-lg font-semibold mt-2 mb-3 group-hover:text-gradient transition-all">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{post.author}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
