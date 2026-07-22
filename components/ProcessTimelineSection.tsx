'use client';

import { motion } from 'framer-motion';
import { Code2, Lightbulb, PencilRuler, Rocket, ShieldCheck } from 'lucide-react';
import RadialOrbitalTimeline, { TimelineItem } from '@/components/RadialOrbitalTimeline';

const processSteps: TimelineItem[] = [
  {
    id: 1,
    title: 'کشف نیاز',
    date: 'مرحله ۱',
    content: 'هدف کسب‌وکار، کاربران، محدودیت‌ها و خروجی مورد انتظار را شفاف می‌کنیم.',
    category: 'تحلیل',
    icon: Lightbulb,
    relatedIds: [2, 5],
    status: 'completed',
    energy: 100,
  },
  {
    id: 2,
    title: 'طراحی تجربه',
    date: 'مرحله ۲',
    content: 'ساختار صفحات، مسیر کاربر و رابطی هماهنگ با هویت برند طراحی می‌شود.',
    category: 'طراحی',
    icon: PencilRuler,
    relatedIds: [1, 3],
    status: 'completed',
    energy: 90,
  },
  {
    id: 3,
    title: 'توسعه',
    date: 'مرحله ۳',
    content: 'فرانت‌اند و بک‌اند با معماری قابل توسعه و اتصال کامل به API پیاده‌سازی می‌شوند.',
    category: 'توسعه',
    icon: Code2,
    relatedIds: [2, 4],
    status: 'in-progress',
    energy: 75,
  },
  {
    id: 4,
    title: 'آزمون و امنیت',
    date: 'مرحله ۴',
    content: 'عملکرد، امنیت، تجربه موبایل و سناریوهای اصلی پیش از انتشار بررسی می‌شوند.',
    category: 'کیفیت',
    icon: ShieldCheck,
    relatedIds: [3, 5],
    status: 'pending',
    energy: 55,
  },
  {
    id: 5,
    title: 'تحویل و رشد',
    date: 'مرحله ۵',
    content: 'محصول منتشر می‌شود و مسیر پشتیبانی، آموزش و توسعه قابلیت‌های بعدی ادامه پیدا می‌کند.',
    category: 'انتشار',
    icon: Rocket,
    relatedIds: [1, 4],
    status: 'pending',
    energy: 35,
  },
];

export default function ProcessTimelineSection() {
  return (
    <section id="process" className="relative scroll-mt-28 overflow-hidden border-y bg-background/30 py-20 backdrop-blur-[2px] dark:bg-black/10">
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero opacity-70" />
      <div className="container relative mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-medium text-sky-600 dark:text-cyan-400">فرآیند همکاری</span>
          <h2 className="mt-3 text-3xl font-bold md:text-5xl">از ایده تا انتشار، شفاف و مرحله‌به‌مرحله</h2>
          <p className="mt-4 leading-8 text-muted-foreground">
            روی هر مرحله بزنید تا جزئیات و ارتباط آن با مسیر اجرای پروژه را ببینید.
          </p>
        </motion.div>

        <RadialOrbitalTimeline timelineData={processSteps} />
      </div>
    </section>
  );
}
