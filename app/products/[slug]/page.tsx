'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Check, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, ProductCard, TechBadge, PriceBadge, SectionTitle, EmptyState } from '@/components/shared';
import { getProductBySlug, getRelatedProducts, products, Product } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailsPage({ params }: Props) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  useEffect(() => {
    const foundProduct = getProductBySlug(slug);
    if (foundProduct) {
      setProduct(foundProduct);
      const related = getRelatedProducts(foundProduct.id);
      setRelatedProducts(related);
      if (foundProduct.pricingPlans.length > 0) {
        setSelectedPlan(foundProduct.pricingPlans[0].id);
      }
    }
  }, [slug]);

  if (!product) {
    return (
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-6">
          <EmptyState type="products" title="محصول یافت نشد" />
        </div>
      </main>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.gallery.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.gallery.length - 1 : prev - 1
    );
  };

  return (
    <main className="min-h-screen pt-24 pb-16 relative overflow-x-hidden">
      <div className="container mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">خانه</Link>
          <ChevronLeft className="w-4 h-4" />
          <Link href="/products" className="hover:text-foreground">محصولات</Link>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-foreground">{product.title}</span>
        </nav>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl overflow-hidden mb-16"
        >
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="relative aspect-video lg:aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 to-blue-500/20 dark:from-blue-500/20 dark:to-cyan-500/20 flex items-center justify-center">
                <span className="text-[150px] font-bold text-foreground/10">
                  {product.title[0]}
                </span>
              </div>
              {product.gallery.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Category Badge */}
              <span className="absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-medium bg-sky-500/20 dark:bg-cyan-500/20 text-sky-500 dark:text-cyan-400">
                {getCategoryLabel(product.category)}
              </span>
            </div>

            {/* Info */}
            <div className="p-8 flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
                {product.title}
              </h1>
              <p className="text-muted-foreground text-lg mb-6">
                {product.shortDescription}
              </p>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl glass">
                  <span className="text-sm text-muted-foreground">زمان اجرا</span>
                  <div className="text-lg font-semibold mt-1">{product.completionTime}</div>
                </div>
                <div className="p-4 rounded-xl glass">
                  <span className="text-sm text-muted-foreground">شروع قیمت</span>
                  <div className="text-lg font-semibold mt-1 text-gradient">{product.startingPrice} تومان</div>
                </div>
              </div>

              {/* Technologies */}
              <div className="mb-6">
                <span className="text-sm text-muted-foreground mb-2 block">تکنولوژی‌ها</span>
                <div className="flex flex-wrap gap-2">
                  {product.technologies.map((tech) => (
                    <TechBadge key={tech} name={tech} />
                  ))}
                </div>
              </div>

              <Link href="/contact">
                <Button className="btn-primary shadow-glow w-full md:w-auto">
                  شروع پروژه
                  <ArrowRight className="mr-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <SectionTitle badge="توضیحات" title="درباره این محصول" />
          <div className="glass rounded-2xl p-8">
            <div className="prose prose-lg prose-invert max-w-none">
              {product.longDescription.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-foreground/80 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Features */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <SectionTitle badge="ویژگی‌ها" title="چرا این محصول؟" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl glass hover:glass-hover transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
                <h4 className="font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Gallery */}
        {product.gallery.length > 1 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <SectionTitle badge="گالری" title="نمونه‌های گالری" />
            <div className="grid md:grid-cols-3 gap-4">
              {product.gallery.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="aspect-video rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-500/20 dark:from-blue-500/20 dark:to-cyan-500/20 overflow-hidden"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl font-bold text-foreground/10">{index + 1}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Technologies */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <SectionTitle badge="تکنولوژی" title="تکنولوژی‌های استفاده شده" />
          <div className="flex flex-wrap justify-center gap-4">
            {product.technologies.map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="px-6 py-3 rounded-xl glass"
              >
                <span className="text-lg font-medium">{tech}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Pricing */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <SectionTitle badge="قیمت‌گذاری" title="پکیج‌های قیمت‌گذاری" />
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {product.pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'p-8 rounded-2xl relative',
                  plan.isPopular
                    ? 'glass border-2 border-sky-500/50 dark:border-cyan-500/50 shadow-glow'
                    : 'glass'
                )}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1 rounded-full bg-gradient-to-l from-sky-500 to-blue-600 dark:from-blue-500 dark:to-cyan-500 text-sm font-medium flex items-center gap-1 text-white">
                      <Sparkles className="w-3 h-3" />
                      محبوب‌ترین
                    </div>
                  </div>
                )}

                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

                <div className="mb-8">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm mr-2">تومان</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-sky-500/20 dark:bg-cyan-500/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-sky-500 dark:text-cyan-400" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/contact">
                  <Button
                    className={cn(
                      'w-full rounded-full',
                      plan.isPopular ? 'btn-primary shadow-glow' : ''
                    )}
                    variant={plan.isPopular ? 'default' : 'outline'}
                  >
                    شروع همکاری
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* FAQ */}
        {product.faqs.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <SectionTitle badge="سوالات" title="سوالات متداول" />
            <div className="max-w-2xl mx-auto space-y-4">
              {product.faqs.map((faq) => (
                <div
                  key={faq.id}
                  className={cn(
                    'rounded-xl overflow-hidden transition-all duration-300',
                    openFaq === faq.id ? 'glass' : 'glass hover:bg-muted/50'
                  )}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    className="w-full p-6 flex items-center justify-between text-right"
                  >
                    <span className="font-semibold">{faq.question}</span>
                    <ChevronLeft
                      className={cn(
                        'w-5 h-5 transition-transform',
                        openFaq === faq.id && 'rotate-[-90deg]'
                      )}
                    />
                  </button>
                  {openFaq === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-muted-foreground">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </div>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                آماده شروع پروژه هستید؟
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                همین حالا با ما تماس بگیرید و پروژه خود را شروع کنید
              </p>
              <Link href="/contact">
                <Button size="lg" className="btn-primary shadow-glow text-lg px-10">
                  شروع پروژه
                  <ArrowRight className="mr-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SectionTitle badge="محصولات مرتبط" title="محصولات مشابه" />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} index={index} />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </main>
  );
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    web: 'طراحی وب',
    mobile: 'موبایل',
    saas: 'SaaS',
    ecommerce: 'فروشگاه',
    dashboard: 'داشبورد',
  };
  return labels[category] || category;
}
