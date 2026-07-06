'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogPosts, getBlogPostBySlug, getRelatedBlogPosts, getPopularBlogPosts } from '@/lib/mock-data';
import { PageHeader, TechBadge } from '@/components/shared';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, ArrowLeft, Clock, User, Eye, Heart, Tag, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: Props) {
  const { slug } = use(params);
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedBlogPosts(post.id);
  const popularPosts = getPopularBlogPosts().filter((p) => p.id !== post.id).slice(0, 4);

  return (
    <main className="min-h-screen pt-24 pb-16 relative overflow-x-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-sky-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 relative">
        <PageHeader
          title={post.title}
          subtitle={post.excerpt}
          breadcrumbs={[
            { label: 'خانه', href: '/' },
            { label: 'وبلاگ', href: '/blog' },
            { label: post.title },
          ]}
        />

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-3">
            {/* Meta */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8"
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500/20 to-blue-500/20 dark:from-blue-500/20 dark:to-cyan-500/20 flex items-center justify-center font-bold">
                  {post.authorAvatar || post.author[0]}
                </div>
                <span className="font-medium text-foreground">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{post.views || 0} بازدید</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>{post.likes || 0} لایک</span>
              </div>
            </motion.div>

            {/* Featured Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-video rounded-2xl overflow-hidden glass p-2 mb-12"
            >
              <div className="relative aspect-video rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-500/20 dark:from-blue-500/20 dark:to-cyan-500/20 flex items-center justify-center">
                <span className="text-8xl md:text-[120px] font-bold text-foreground/5">
                  {post.title[0]}
                </span>
              </div>
              <div className="absolute top-6 right-6">
                <span className="px-4 py-2 rounded-full text-sm font-medium glass">
                  {post.category}
                </span>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-8 md:p-12 mb-8"
            >
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {post.content || post.excerpt}
                </p>

                <h2 className="text-2xl font-bold mt-10 mb-4">نکات کلیدی</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  این مقاله شامل نکات و تکنیک‌های مهمی است که می‌تواند در توسعه و طراحی کمک‌کننده باشد.
                  مطالعه عمیق این محتوا و پیاده‌سازی آن در پروژه‌های واقعی توصیه می‌شود.
                </p>

                <div className="my-12 p-6 rounded-xl bg-gradient-to-r from-sky-500/10 to-blue-500/10 dark:from-blue-500/10 dark:to-cyan-500/10 border-r-4 border-r-sky-500 dark:border-r-cyan-500">
                  <p className="text-lg italic">
                    "موفقیت در تکنولوژی به یادگیری مستمر و تمرین مداوم بستگی دارد."
                  </p>
                </div>

                <h2 className="text-2xl font-bold mt-10 mb-4">جمع‌بندی</h2>
                <p className="text-muted-foreground leading-relaxed">
                  با رعایت اصولی که در این مقاله بیان شد، می‌توانید کیفیت کار خود را
                  به سطح جدیدی ببرید. اگر سوالی دارید، در بخش نظرات بنویسید.
                </p>
              </div>
            </motion.div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 mb-8"
              >
                <Tag className="w-5 h-5 text-muted-foreground" />
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm glass text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Share Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between flex-wrap gap-4 py-6 border-t border-b border-border mb-8"
            >
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
            </motion.div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-xl font-bold mb-6">مقالات مرتبط</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}`}
                      className="group glass rounded-xl overflow-hidden"
                    >
                      <div className="relative h-32 bg-gradient-to-br from-sky-500/20 to-blue-500/20 dark:from-blue-500/20 dark:to-cyan-500/20 flex items-center justify-center">
                        <span className="text-4xl font-bold text-foreground/10">
                          {relatedPost.title[0]}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-sm group-hover:text-gradient transition-all line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-2">{relatedPost.readTime}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </article>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="glass rounded-2xl p-6 sticky top-28">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-sky-500" />
                <h3 className="text-lg font-semibold">محبوب‌ترین‌ها</h3>
              </div>
              <div className="space-y-4">
                {popularPosts.map((popularPost, index) => (
                  <Link
                    key={popularPost.id}
                    href={`/blog/${popularPost.slug}`}
                    className="flex gap-4 group"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500/20 to-blue-500/20 dark:from-blue-500/20 dark:to-cyan-500/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-muted-foreground">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 group-hover:text-gradient transition-all">
                        {popularPost.title}
                      </h4>
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Eye className="w-3 h-3" />
                        <span>{popularPost.views || 0}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </main>
  );
}
