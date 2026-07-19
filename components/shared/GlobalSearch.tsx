'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Search, X } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { blogPostService } from '@/services/BlogPostService';
import { portfolioService } from '@/services/PortfolioService';
import { productService } from '@/services/ProductService';
import { BlogPost, PortfolioListItem, Service } from '@/types/api';
import { BlogCoverImage } from './BlogCoverImage';
import { useFeatureSettings } from '@/components/FeatureSettingsProvider';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Service[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<PortfolioListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isReady, portfolioEnabled } = useFeatureSettings();

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      return;
    }

    let cancelled = false;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    setIsLoading(true);
    void Promise.all([
      productService.getProducts(),
      blogPostService.getAll({ pageNumber: 1, pageSize: 50 }),
      isReady && portfolioEnabled
        ? portfolioService.getItems({ pageNumber: 1, pageSize: 50 })
        : Promise.resolve({
            items: [],
            totalCount: 0,
            pageNumber: 1,
            pageSize: 50,
            totalPages: 0,
          }),
    ]).then(([services, posts, portfolio]) => {
      if (cancelled) return;
      setProducts(services);
      setBlogPosts(posts);
      setProjects(portfolio.items || []);
    }).catch(() => {
      if (cancelled) return;
      setProducts([]);
      setBlogPosts([]);
      setProjects([]);
    }).finally(() => {
      if (!cancelled) setIsLoading(false);
    });

    return () => {
      cancelled = true;
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isReady, onClose, portfolioEnabled]);

  const results = useMemo(() => {
    if (!query.trim()) return { products: [], blogPosts: [], projects: [] };

    const normalizedQuery = query.trim().toLocaleLowerCase('fa-IR');
    return {
      products: products.filter(
        (product) =>
          product.title.toLocaleLowerCase('fa-IR').includes(normalizedQuery) ||
          (product.shortDescription || product.description || '')
            .toLocaleLowerCase('fa-IR')
            .includes(normalizedQuery)
      ).slice(0, 3),
      blogPosts: blogPosts.filter(
        (post) =>
          post.title.toLocaleLowerCase('fa-IR').includes(normalizedQuery) ||
          (post.excerpt || '').toLocaleLowerCase('fa-IR').includes(normalizedQuery)
      ).slice(0, 3),
      projects: portfolioEnabled ? projects.filter(
        (project) =>
          project.title.toLocaleLowerCase('fa-IR').includes(normalizedQuery) ||
          (project.shortDescription || '').toLocaleLowerCase('fa-IR').includes(normalizedQuery) ||
          project.clientName.toLocaleLowerCase('fa-IR').includes(normalizedQuery)
      ).slice(0, 3) : [],
    };
  }, [blogPosts, portfolioEnabled, products, projects, query]);

  const totalResults = results.products.length + results.blogPosts.length + results.projects.length;

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="جست‌وجوی سراسری"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 pt-20 max-w-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="fancy-search-shell fancy-search-shell--global">
          <Search className="fancy-search-icon right-4" />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              portfolioEnabled
                ? 'جست‌وجو در محصولات، مقالات و پروژه‌ها...'
                : 'جست‌وجو در محصولات و مقالات...'
            }
            className="fancy-search-input fancy-search-input--global"
            aria-label="عبارت جست‌وجو"
            autoFocus
          />
          <button
            type="button"
            onClick={onClose}
            className="fancy-search-action left-4"
            aria-label="بستن جست‌وجو"
            data-no-specular
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {query && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 glass rounded-2xl overflow-hidden"
          >
            {isLoading ? (
              <div className="p-8 flex items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                در حال دریافت نتایج...
              </div>
            ) : totalResults === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                نتیجه‌ای یافت نشد
              </div>
            ) : (
              <div className="max-h-[60vh] overflow-y-auto">
                {results.products.length > 0 && (
                  <div className="p-4 border-b border-border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      محصولات ({results.products.length})
                    </h3>
                    {results.products.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${encodeURIComponent(product.slug)}`}
                        onClick={onClose}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <BlogCoverImage
                          src={product.thumbnail || product.coverImage}
                          alt={product.title}
                          className="w-10 h-10 rounded-lg shrink-0"
                          fallbackClassName="text-lg"
                        />
                        <div>
                          <div className="font-medium">{product.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.estimatedDeliveryDays
                              ? `${product.estimatedDeliveryDays} روز`
                              : 'زمان توافقی'}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {results.blogPosts.length > 0 && (
                  <div className="p-4 border-b border-border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      مقالات ({results.blogPosts.length})
                    </h3>
                    {results.blogPosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${encodeURIComponent(post.slug)}`}
                        onClick={onClose}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500/20 to-blue-500/20 flex items-center justify-center text-lg font-bold text-foreground/20">
                          {post.title[0]}
                        </div>
                        <div>
                          <div className="font-medium">{post.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {post.readTime ? `${post.readTime} دقیقه` : 'زمان مطالعه نامشخص'}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {results.projects.length > 0 && (
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      پروژه‌ها ({results.projects.length})
                    </h3>
                    {results.projects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/portfolio/${encodeURIComponent(project.slug)}`}
                        onClick={onClose}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500/20 to-blue-500/20 flex items-center justify-center text-lg font-bold text-foreground/20">
                          {project.title[0]}
                        </div>
                        <div>
                          <div className="font-medium">{project.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {project.categoryName || project.clientName}
                          </div>
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
