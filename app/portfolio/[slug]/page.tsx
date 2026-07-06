'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { projects, getProjectBySlug } from '@/lib/mock-data';
import { PageHeader, TechBadge, EmptyState } from '@/components/shared';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Calendar, Clock, CheckCircle2, ChevronLeft } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function PortfolioDetailPage({ params }: Props) {
  const { slug } = use(params);
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Get related projects (same category, excluding current)
  const relatedProjects = projects
    .filter((p) => p.category === project.category && p.id !== project.id)
    .slice(0, 3);

  return (
    <main className="min-h-screen pt-24 pb-16 relative overflow-x-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-sky-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 relative">
        <PageHeader
          title={project.title}
          subtitle={project.description}
          breadcrumbs={[
            { label: 'خانه', href: '/' },
            { label: 'نمونه‌کارها', href: '/portfolio' },
            { label: project.title },
          ]}
        />

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden glass p-2 mb-12"
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-sky-500/20 to-blue-500/20 dark:from-blue-500/20 dark:to-cyan-500/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[120px] md:text-[200px] font-bold text-foreground/5">
                {project.title[0]}
              </span>
            </div>
            {project.image && (
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover opacity-80"
              />
            )}
          </div>

          {/* Floating badges */}
          <div className="absolute top-6 right-6 flex gap-2">
            <span className="px-4 py-2 rounded-full text-sm font-medium glass">
              {getCategoryLabel(project.category)}
            </span>
            {project.featured && (
              <span className="px-4 py-2 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-500">
                پروژه ویژه
              </span>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <div className="glass rounded-2xl p-6 text-center">
            <p className="text-3xl md:text-4xl font-bold text-gradient mb-2">{project.metricValue}</p>
            <p className="text-sm text-muted-foreground">{project.metric}</p>
          </div>
          {project.completionTime && (
            <div className="glass rounded-2xl p-6 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-sky-500" />
              <p className="text-xl font-bold mb-1">{project.completionTime}</p>
              <p className="text-sm text-muted-foreground">مدت توسعه</p>
            </div>
          )}
          {project.startingPrice && (
            <div className="glass rounded-2xl p-6 text-center">
              <p className="text-xl font-bold mb-1">{project.startingPrice}</p>
              <p className="text-sm text-muted-foreground">تومان</p>
            </div>
          )}
          {project.date && (
            <div className="glass rounded-2xl p-6 text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-sky-500" />
              <p className="text-lg font-bold mb-1">{project.date}</p>
              <p className="text-sm text-muted-foreground">تاریخ تحویل</p>
            </div>
          )}
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h2 className="text-2xl font-bold mb-6">درباره پروژه</h2>
            <div className="glass rounded-2xl p-8">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {project.longDescription || project.description}
              </p>

              {/* Features */}
              {project.features && project.features.length > 0 && (
                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-semibold mb-4">ویژگی‌های کلیدی</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {project.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="glass rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">تکنولوژی‌ها</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <TechBadge key={index} name={tech} />
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">پروژه مشابه می‌خواهید؟</h3>
              <p className="text-muted-foreground text-sm mb-6">
                با ما تماس بگیرید تا پروژه شما را با همین کیفیت اجرا کنیم.
              </p>
              <Link
                href="/contact"
                className="block w-full btn-primary text-center py-3 rounded-xl font-medium"
              >
                تماس با ما
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">گالری پروژه</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.gallery.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-xl overflow-hidden glass"
                >
                  <Image
                    src={image}
                    alt={`${project.title} - تصویر ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">پروژه‌های مرتبط</h2>
              <Link
                href="/portfolio"
                className="flex items-center gap-2 text-sky-500 hover:text-sky-400 transition-colors"
              >
                مشاهده همه
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedProjects.map((relatedProject, index) => (
                <Link
                  key={relatedProject.id}
                  href={`/portfolio/${relatedProject.slug}`}
                  className="group"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass rounded-2xl overflow-hidden"
                  >
                    <div className="relative h-40 bg-gradient-to-br from-sky-500/20 to-blue-500/20 dark:from-blue-500/20 dark:to-cyan-500/20">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-5xl font-bold text-foreground/10">
                          {relatedProject.title[0]}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold group-hover:text-gradient transition-all">
                        {relatedProject.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {relatedProject.metricValue}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
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
