'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { blogPosts as mockBlogPosts, blogCategories as mockBlogCategories, getPopularBlogPosts } from '@/lib/mock-data';
import { PageHeader, CategoryFilter, SearchBox, Pagination, EmptyState } from '@/components/shared';
import { BlogCardSkeleton } from '@/components/shared/SkeletonLoaders';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, TrendingUp, Eye, Heart } from 'lucide-react';
import { blogPostService } from '@/services/BlogPostService';
import { blogCategoryService } from '@/services/BlogCategoryService';
import { BlogPost, BlogCategory } from '@/types/api';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [postsData, categoriesData] = await Promise.all([
        blogPostService.getAll(),
        blogCategoryService.getAll(),
      ]);

      if (postsData && postsData.length > 0) {
        setPosts(postsData);
      } else {
        setPosts(mockBlogPosts.map(p => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt,
          content: p.content,
          coverImage: p.image,
          readTime: parseInt(p.readTime) || 5,
          isPublished: true,
          publishedAt: p.date,
          author: p.author,
          authorAvatar: p.authorAvatar,
          views: p.views,
          likes: p.likes,
          tags: p.tags,
          categoryId: p.category,
          categoryName: p.category,
          createdAt: p.date,
          updatedAt: p.date,
        })));
      }

      if (categoriesData && categoriesData.length > 0) {
        setCategories(categoriesData);
      } else {
        setCategories(mockBlogCategories.map(c => ({
          id: c.id,
          name: c.name,
          slug: c.id,
          publishedPostCount: c.count,
          createdAt: '',
          updatedAt: '',
        })));
      }

      setIsLoading(false);
    };
    fetchData();
  }, []);

  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.categoryId === selectedCategory || p.categoryName === selectedCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.excerpt || '').toLowerCase().includes(q) ||
          (p.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [posts, selectedCategory, searchQuery]);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPosts.slice(start, start + itemsPerPage);
  }, [filteredPosts, currentPage]);

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const popularPosts = useMemo(() => {
    return [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4);
  }, [posts]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const displayCategories = categories.length > 0
    ? [{ id: 'all', name: 'همه', slug: 'all', publishedPostCount: posts.length, createdAt: '', updatedAt: '' }, ...categories]
    : mockBlogCategories.map(c => ({ id: c.id, name: c.name, slug: c.id, publishedPostCount: c.count, createdAt: '', updatedAt: '' }));

  return (
    <main className="min-h-screen pt-24 pb-16 relative overflow-x-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-sky-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 relative">
        <PageHeader
          title="وبلاگ"
          subtitle="مقالات آموزشی، روندهای تکنولوژی و نکات توسعه"
          breadcrumbs={[
            { label: 'خانه', href: '/' },
            { label: 'وبلاگ' },
          ]}
        />

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8"
            >
              <CategoryFilter
                categories={displayCategories.map(c => ({ id: c.id, name: c.name, count: c.publishedPostCount || 0 }))}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />
              <SearchBox
                placeholder="جستجوی مقاله..."
                onSearch={setSearchQuery}
                className="w-full md:w-80"
              />
            </motion.div>

            {/* Results count */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground mb-6"
            >
              {filteredPosts.length} مقاله یافت شد
            </motion.p>

            {/* Posts Grid */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <BlogCardSkeleton key={i} />
                ))}
              </div>
            ) : paginatedPosts.length > 0 ? (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {paginatedPosts.map((post, index) => (
                      <motion.article
                        key={post.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="group glass rounded-2xl overflow-hidden"
                      >
                        <Link href={`/blog/${post.slug}`}>
                          <div className="relative aspect-video bg-gradient-to-br from-sky-500/20 to-blue-500/20 dark:from-blue-500/20 dark:to-cyan-500/20 flex items-center justify-center">
                            <span className="text-5xl font-bold text-foreground/10">
                              {post.title[0]}
                            </span>
                            {/* Category Badge */}
                            {post.categoryName && (
                              <div className="absolute top-4 right-4">
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-sky-500/20 dark:bg-cyan-500/20 text-sky-500 dark:text-cyan-400">
                                  {post.categoryName}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="p-6">
                            <h2 className="text-lg font-semibold mb-3 group-hover:text-gradient transition-all line-clamp-2">
                              {post.title}
                            </h2>
                            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                              {post.excerpt || ''}
                            </p>
                            <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border">
                              <div className="flex items-center gap-4">
                                <span>{post.author || 'نویسنده'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                <span>{post.views || 0}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                              <span>{post.publishedAt || post.createdAt}</span>
                              <span>{post.readTime || 5} دقیقه</span>
                            </div>
                          </div>
                        </Link>
                      </motion.article>
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
                type="blog"
                actionLabel="پاک کردن فیلترها"
                onAction={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
              />
            )}
          </div>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            {/* Popular Posts */}
            <div className="glass rounded-2xl p-6 sticky top-28">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-sky-500" />
                <h3 className="text-lg font-semibold">محبوب‌ترین‌ها</h3>
              </div>
              <div className="space-y-4">
                {popularPosts.map((post, index) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="flex gap-4 group"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500/20 to-blue-500/20 dark:from-blue-500/20 dark:to-cyan-500/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-muted-foreground">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 group-hover:text-gradient transition-all">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.views || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {post.likes || 0}
                        </span>
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
