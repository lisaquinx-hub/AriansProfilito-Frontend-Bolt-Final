'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { products, blogPosts, projects } from '@/lib/mock-data';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => {
    if (!query.trim()) return { products: [], blogPosts: [], projects: [] };

    const q = query.toLowerCase();
    return {
      products: products.filter(
        (p) => p.title.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q)
      ).slice(0, 3),
      blogPosts: blogPosts.filter(
        (p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
      ).slice(0, 3),
      projects: projects.filter(
        (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      ).slice(0, 3),
    };
  }, [query]);

  const totalResults = results.products.length + results.blogPosts.length + results.projects.length;

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 pt-20 max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو در محصولات، مقالات و پروژه‌ها..."
            className="pr-12 pl-12 h-14 text-lg bg-card border-border"
            autoFocus
          />
          <button
            onClick={onClose}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        {query && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 glass rounded-2xl overflow-hidden"
          >
            {totalResults === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                نتیجه‌ای یافت نشد
              </div>
            ) : (
              <div className="max-h-[60vh] overflow-y-auto">
                {/* Products */}
                {results.products.length > 0 && (
                  <div className="p-4 border-b border-border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      محصولات ({results.products.length})
                    </h3>
                    {results.products.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500/20 to-blue-500/20 flex items-center justify-center text-lg font-bold text-foreground/20">
                          {product.title[0]}
                        </div>
                        <div>
                          <div className="font-medium">{product.title}</div>
                          <div className="text-sm text-muted-foreground">{product.startingPrice} تومان</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Blog Posts */}
                {results.blogPosts.length > 0 && (
                  <div className="p-4 border-b border-border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      مقالات ({results.blogPosts.length})
                    </h3>
                    {results.blogPosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500/20 to-blue-500/20 flex items-center justify-center text-lg font-bold text-foreground/20">
                          {post.title[0]}
                        </div>
                        <div>
                          <div className="font-medium">{post.title}</div>
                          <div className="text-sm text-muted-foreground">{post.readTime}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Projects */}
                {results.projects.length > 0 && (
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      پروژه‌ها ({results.projects.length})
                    </h3>
                    {results.projects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/portfolio/${project.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500/20 to-blue-500/20 flex items-center justify-center text-lg font-bold text-foreground/20">
                          {project.title[0]}
                        </div>
                        <div>
                          <div className="font-medium">{project.title}</div>
                          <div className="text-sm text-muted-foreground">{project.metricValue}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
