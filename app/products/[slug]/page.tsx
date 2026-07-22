'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Code2,
  Headphones,
  Layers3,
  Loader2,
  MessageCircleMore,
  PenTool,
  Rocket,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ServiceIcon } from '@/components/shared/ServiceIcon';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { productService } from '@/services/ProductService';
import { Service, ServiceFeature } from '@/types/api';

const featureIcons: LucideIcon[] = [
  Layers3,
  ShieldCheck,
  Rocket,
  SearchCheck,
  Code2,
  Headphones,
];

const processSteps = [
  {
    number: '۰۱',
    icon: MessageCircleMore,
    title: 'شناخت نیاز',
    description: 'هدف، کاربران، امکانات ضروری و محدودیت‌های پروژه را شفاف می‌کنیم.',
  },
  {
    number: '۰۲',
    icon: PenTool,
    title: 'طراحی مسیر',
    description: 'ساختار صفحات، تجربه کاربری و نقشه فنی اجرا را مشخص می‌کنیم.',
  },
  {
    number: '۰۳',
    icon: Code2,
    title: 'توسعه و بازبینی',
    description: 'پروژه مرحله‌ای ساخته، تست و برای بازخورد در اختیار شما قرار می‌گیرد.',
  },
  {
    number: '۰۴',
    icon: Rocket,
    title: 'تحویل و انتشار',
    description: 'نسخه نهایی، راهنمای استفاده و مسیر پشتیبانی پس از انتشار تحویل می‌شود.',
  },
];

const defaultFeatures: ServiceFeature[] = [
  { title: 'طراحی واکنش‌گرا برای موبایل و دسکتاپ' },
  { title: 'ساختار امن و قابل توسعه' },
  { title: 'بهینه‌سازی سرعت و تجربه کاربری' },
  { title: 'آماده‌سازی فنی برای انتشار' },
];

function getFeatureDescription(title: string, index: number): string {
  if (/امن|security|auth|jwt/i.test(title)) {
    return 'کنترل‌های امنیتی و دسترسی متناسب با سناریوی واقعی محصول پیاده می‌شود.';
  }
  if (/سرعت|عملکرد|performance|responsive/i.test(title)) {
    return 'خروجی برای نمایش روان، بارگذاری سریع و استفاده در اندازه‌های مختلف بهینه می‌شود.';
  }
  if (/سئو|seo|metadata|content/i.test(title)) {
    return 'ساختار محتوا و جزئیات فنی برای درک بهتر موتورهای جست‌وجو آماده می‌شود.';
  }
  if (/دیتابیس|database|sql|api|backend|بک.?اند/i.test(title)) {
    return 'معماری داده و ارتباط سرویس‌ها با تمرکز بر نگهداری و توسعه آینده طراحی می‌شود.';
  }
  if (/طراح|design|ui|ux|interface/i.test(title)) {
    return 'جزئیات بصری و مسیرهای کاربر با زبان یکپارچه و متناسب با هویت برند شکل می‌گیرد.';
  }

  const descriptions = [
    'این بخش بر اساس نیاز پروژه تنظیم و با خروجی قابل بررسی تحویل داده می‌شود.',
    'جزئیات اجرا از ابتدا مشخص است تا کیفیت نهایی قابل سنجش و توسعه باشد.',
    'پیاده‌سازی مرحله‌ای انجام می‌شود تا بازخورد شما پیش از تحویل نهایی وارد محصول شود.',
  ];
  return descriptions[index % descriptions.length];
}

export default function ProductDetailsPage() {
  const params = useParams<{ slug: string }>();
  const slug = (Array.isArray(params?.slug) ? params.slug[0] : params?.slug) as string;
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;
    setIsLoading(true);
    setNotFound(false);

    void productService.getProduct(slug).then((data) => {
      if (cancelled) return;
      if (data) setService(data);
      else setNotFound(true);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const features = useMemo(
    () => (service?.features && service.features.length > 0 ? service.features : defaultFeatures),
    [service]
  );

  if (isLoading) {
    return (
      <main className="relative min-h-screen overflow-hidden pb-16 pt-28">
        <Navbar />
        <div className="container mx-auto px-6 py-20">
          <div className="glass mx-auto max-w-5xl animate-pulse rounded-3xl p-8 md:p-12">
            <div className="h-5 w-32 rounded bg-muted" />
            <div className="mt-7 h-12 w-3/4 rounded bg-muted" />
            <div className="mt-5 h-5 w-full rounded bg-muted" />
            <div className="mt-2 h-5 w-4/5 rounded bg-muted" />
            <Loader2 className="mx-auto mt-16 h-8 w-8 animate-spin text-sky-500" />
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (notFound || !service) {
    return (
      <main className="relative min-h-screen overflow-hidden pb-16 pt-28">
        <Navbar />
        <div className="container mx-auto px-6 py-20 text-center">
          <AlertCircle className="mx-auto mb-4 h-16 w-16 text-muted-foreground opacity-50" />
          <h1 className="mb-2 text-2xl font-bold">سرویس یافت نشد</h1>
          <p className="mb-6 text-muted-foreground">سرویس موردنظر وجود ندارد یا غیرفعال شده است.</p>
          <Button asChild variant="outline" className="gap-2 rounded-full">
            <Link href="/products">
              <ArrowRight className="h-4 w-4" />
              بازگشت به خدمات
            </Link>
          </Button>
        </div>
        <Footer />
      </main>
    );
  }

  const description =
    service.description ||
    service.shortDescription ||
    'این خدمت متناسب با هدف، مخاطب و مسیر رشد کسب‌وکار شما طراحی و اجرا می‌شود.';
  const deliveryText = service.estimatedDeliveryDays
    ? `حدود ${service.estimatedDeliveryDays} روز کاری`
    : 'پس از بررسی نیاز پروژه';

  return (
    <main className="relative min-h-screen overflow-x-hidden pb-16 pt-28">
      <Navbar />
      <div className="pointer-events-none absolute right-0 top-16 h-[28rem] w-[28rem] translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl dark:bg-cyan-400/10" />
      <div className="pointer-events-none absolute left-0 top-[52rem] h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="container relative mx-auto px-6">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="مسیر صفحه">
          <Link href="/" className="transition-colors hover:text-foreground">خانه</Link>
          <ChevronLeft className="h-4 w-4" />
          <Link href="/products" className="transition-colors hover:text-foreground">خدمات</Link>
          <ChevronLeft className="h-4 w-4" />
          <span className="text-foreground">{service.title}</span>
        </nav>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid items-center gap-8 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14"
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-sm font-bold text-sky-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300">
              <Sparkles className="h-4 w-4" />
              راهکار تخصصی آرین پژوهش
            </span>
            <h1 className="mt-6 text-4xl font-black leading-tight md:text-5xl lg:text-6xl">
              {service.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              {service.shortDescription || description}
            </p>

            <div className="mt-7 flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background/60 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
                <Clock3 className="h-4 w-4 text-sky-600 dark:text-cyan-300" />
                زمان تحویل: {deliveryText}
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background/60 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                اجرای مرحله‌ای و قابل بازبینی
              </span>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="btn-primary shadow-glow">
                <Link href="/#contact-form">
                  درخواست مشاوره پروژه
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link href="#deliverables">مشاهده جزئیات تحویل</Link>
              </Button>
            </div>
          </div>

          <div className="glass relative overflow-hidden rounded-3xl p-5 md:p-7">
            <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-sky-500/15 blur-3xl dark:bg-cyan-400/15" />
            <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-background/70 shadow-xl dark:border-white/10 dark:bg-black/25">
              <div className="flex items-center justify-between border-b border-border/80 px-4 py-3 dark:border-white/10">
                <div className="flex gap-1.5" dir="ltr">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs text-muted-foreground">arianpazhoohesh.ir</span>
              </div>
              <div className="p-6 md:p-8">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20 dark:from-cyan-500 dark:to-blue-600">
                  <ServiceIcon icon={service.icon} title={service.title} className="h-8 w-8" />
                </span>
                <p className="mt-6 text-xs font-bold text-sky-700 dark:text-cyan-300">خروجی متناسب با کسب‌وکار شما</p>
                <h2 className="mt-2 text-2xl font-black">یک محصول آماده استفاده، رشد و توسعه</h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {features.slice(0, 4).map((feature, index) => (
                    <div
                      key={feature.id || `${feature.title}-${index}`}
                      className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-3 text-sm"
                    >
                      <Check className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span className="line-clamp-1">{feature.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <section id="deliverables" className="scroll-mt-32 py-16" aria-labelledby="deliverables-heading">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="text-sm font-bold text-sky-700 dark:text-cyan-300">جزئیات خدمت</span>
            <h2 id="deliverables-heading" className="mt-3 text-3xl font-black md:text-4xl">
              در پایان پروژه چه چیزی تحویل می‌گیرید؟
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              خروجی فقط یک ظاهر زیبا نیست؛ هر بخش با هدف مشخص و قابلیت استفاده واقعی ساخته می‌شود.
            </p>
          </div>

          <div className="grid items-stretch gap-6 lg:grid-cols-12">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass relative overflow-hidden rounded-3xl p-7 lg:col-span-5"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-blue-500/10 dark:from-cyan-400/10" />
              <div className="relative flex h-full min-h-[390px] flex-col justify-between">
                <div>
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-sky-700 shadow-lg dark:bg-white/10 dark:text-cyan-300">
                    <ServiceIcon icon={service.icon} title={service.title} className="h-7 w-7" />
                  </span>
                  <h3 className="mt-6 text-2xl font-black">طراحی‌شده برای نیاز واقعی شما</h3>
                  <p className="mt-4 whitespace-pre-line text-sm leading-8 text-muted-foreground">
                    {description}
                  </p>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-border/70 bg-background/60 p-4 dark:border-white/10 dark:bg-black/20">
                    <span className="text-xs text-muted-foreground">زمان تقریبی</span>
                    <strong className="mt-1 block text-sm">{deliveryText}</strong>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/60 p-4 dark:border-white/10 dark:bg-black/20">
                    <span className="text-xs text-muted-foreground">مدل اجرا</span>
                    <strong className="mt-1 block text-sm">مرحله‌ای و شفاف</strong>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {features.slice(0, 6).map((feature, index) => {
                const Icon = featureIcons[index % featureIcons.length];
                return (
                  <motion.article
                    key={feature.id || `${feature.title}-${index}`}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="glass rounded-2xl p-6"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 text-sky-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 font-bold leading-7">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {getFeatureDescription(feature.title, index)}
                    </p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16" aria-labelledby="process-heading">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="text-sm font-bold text-sky-700 dark:text-cyan-300">فرایند همکاری</span>
            <h2 id="process-heading" className="mt-3 text-3xl font-black md:text-4xl">
              از گفت‌وگوی اول تا انتشار نهایی
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              پروژه در چهار مرحله روشن جلو می‌رود و در هر مرحله امکان بررسی و تصمیم‌گیری دارید.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.article
                  key={step.number}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.07 }}
                  className="glass relative overflow-hidden rounded-2xl p-6"
                >
                  <span className="absolute left-4 top-2 text-5xl font-black text-foreground/[0.045] dark:text-white/[0.045]">
                    {step.number}
                  </span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 text-sky-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{step.description}</p>
                </motion.article>
              );
            })}
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="pb-8 pt-16"
        >
          <div className="glass relative overflow-hidden rounded-3xl px-6 py-12 text-center md:px-12 md:py-16">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-sky-500/12 via-transparent to-blue-500/12 dark:from-cyan-400/12" />
            <div className="relative mx-auto max-w-2xl">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                <ServiceIcon icon={service.icon} title={service.title} className="h-7 w-7" />
              </span>
              <h2 className="mt-6 text-3xl font-black md:text-4xl">برای شروع {service.title} آماده‌اید؟</h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                نیازتان را بگویید تا محدوده پروژه، زمان تقریبی و بهترین مسیر اجرا را باهم مشخص کنیم.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button asChild size="lg" className="btn-primary shadow-glow">
                  <Link href="/#contact-form">شروع گفت‌وگو</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <Link href="/pricing">بررسی تعرفه‌ها</Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      <Footer />
    </main>
  );
}
