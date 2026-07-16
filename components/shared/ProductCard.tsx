'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, ArrowLeft } from 'lucide-react';
import { Service } from '@/types/api';
import { BlogCoverImage } from './BlogCoverImage';

interface ProductCardProps {
  product: Service;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-2xl glass transition-all duration-300 hover:shadow-glow">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <BlogCoverImage
            src={product.thumbnail || product.coverImage}
            alt={product.title}
            className="absolute inset-0 h-full w-full"
            fallbackClassName="text-6xl"
          />
          {/* Category Badge */}
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-sky-500/20 dark:bg-cyan-500/20 text-sky-500 dark:text-cyan-400">
              {product.isFeatured ? 'ویژه' : 'خدمت'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2 group-hover:text-gradient transition-all">
            {product.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {product.shortDescription || product.description || 'برای دریافت جزئیات این خدمت با ما تماس بگیرید.'}
          </p>

          {product.features && product.features.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {product.features.slice(0, 3).map((feature, featureIndex) => (
                <span
                  key={feature.id || `${product.id}-${featureIndex}`}
                  className="px-2 py-1 rounded text-xs bg-muted text-muted-foreground"
                >
                  {feature.title}
                </span>
              ))}
            </div>
          )}

          {/* CTA Button */}
          <Link href={`/products/${encodeURIComponent(product.slug)}`}>
            <motion.span
              whileHover={{ x: -4 }}
              className="inline-flex items-center text-sm text-sky-500 dark:text-cyan-400 group-hover:text-gradient transition-all mb-4"
            >
              مشاهده
              <ArrowLeft className="mr-1 h-4 w-4" />
            </motion.span>
          </Link>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>
                {product.estimatedDeliveryDays
                  ? `${product.estimatedDeliveryDays} روز`
                  : 'زمان توافقی'}
              </span>
            </div>
            <span className="text-sm font-semibold text-gradient">استعلام قیمت</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
