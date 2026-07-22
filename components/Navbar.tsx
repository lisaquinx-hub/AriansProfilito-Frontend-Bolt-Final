'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  BookOpenText,
  ChevronDown,
  CircleHelp,
  FileCheck2,
  FileText,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Menu,
  MessageCircleMore,
  PanelsTopLeft,
  Search,
  Shield,
  Sparkles,
  Target,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { GlobalSearch } from '@/components/shared';
import { ServiceIcon } from '@/components/shared/ServiceIcon';
import { cn } from '@/lib/utils';
import { useAuth, emitAuthChanged } from '@/hooks/useAuth';
import { authService } from '@/services/AuthService';
import { blogPostService } from '@/services/BlogPostService';
import { servicesService } from '@/services/ServicesService';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useFeatureSettings } from '@/components/FeatureSettingsProvider';
import type { BlogPost, Service } from '@/types/api';

type MenuKey = 'services' | 'portfolio' | 'about' | 'blog';

interface NavigationLink {
  href: string;
  label: string;
  menu?: MenuKey;
}

interface MegaMenuEntry {
  href: string;
  keyword: string;
  title: string;
  description: string;
  icon?: LucideIcon;
  serviceIcon?: string | null;
}

const navLinks: NavigationLink[] = [
  { href: '/products', label: 'خدمات', menu: 'services' },
  { href: '/portfolio', label: 'نمونه‌کارها', menu: 'portfolio' },
  { href: '/#about', label: 'درباره ما', menu: 'about' },
  { href: '/pricing', label: 'تعرفه‌ها' },
  { href: '/blog', label: 'وبلاگ', menu: 'blog' },
  { href: '/#contact', label: 'تماس' },
];

const serviceFallbacks: MegaMenuEntry[] = [
  {
    href: '/products/web-development',
    keyword: 'وب‌سایت',
    title: 'طراحی و توسعه وب',
    description: 'وب‌سایت سریع، واکنش‌گرا و آماده رشد',
    serviceIcon: 'globe',
  },
  {
    href: '/products/backend-development',
    keyword: 'بک‌اند',
    title: 'سامانه اختصاصی',
    description: 'API امن و منطق کسب‌وکار قابل توسعه',
    serviceIcon: 'server',
  },
  {
    href: '/products/ui-ux-design',
    keyword: 'UI/UX',
    title: 'طراحی تجربه کاربری',
    description: 'رابط روشن، منسجم و ساده برای استفاده',
    serviceIcon: 'palette',
  },
  {
    href: '/products/seo-optimization',
    keyword: 'SEO',
    title: 'بهینه‌سازی و سئو',
    description: 'ساختار فنی بهتر برای سرعت و دیده‌شدن',
    serviceIcon: 'search',
  },
];

const blogFallbacks: MegaMenuEntry[] = [
  {
    href: '/blog/ssl-certificate-guide',
    keyword: 'SSL',
    title: 'امنیت و گواهی سایت',
    description: 'چرا هر وب‌سایت حرفه‌ای به SSL نیاز دارد؟',
    icon: Shield,
  },
  {
    href: '/blog/react-frontend-ranking',
    keyword: 'React',
    title: 'انتخاب فناوری فرانت‌اند',
    description: 'جایگاه React در توسعه رابط‌های مدرن',
    icon: PanelsTopLeft,
  },
  {
    href: '/blog/aspnet-core-backend-ranking',
    keyword: 'ASP.NET',
    title: 'بک‌اند حرفه‌ای',
    description: 'چرا ASP.NET Core انتخابی جدی برای API است؟',
    icon: FileCheck2,
  },
  {
    href: '/blog/technical-seo-checklist',
    keyword: 'SEO',
    title: 'چک‌لیست سئوی فنی',
    description: 'نکات ضروری پیش از انتشار یک وب‌سایت',
    icon: Target,
  },
  {
    href: '/blog/online-store-launch-guide',
    keyword: 'فروشگاه',
    title: 'راه‌اندازی فروش آنلاین',
    description: 'از انتخاب امکانات تا یک خرید روان و مطمئن',
    icon: Lightbulb,
  },
  {
    href: '/blog/website-speed-user-experience',
    keyword: 'سرعت',
    title: 'تجربه کاربری بهتر',
    description: 'اثر سرعت سایت بر اعتماد و نرخ تبدیل',
    icon: Sparkles,
  },
];

const portfolioEntries: MegaMenuEntry[] = [
  {
    href: '/portfolio',
    keyword: 'همه',
    title: 'تمام نمونه‌کارها',
    description: 'مرور پروژه‌ها، مسئله‌ها و راه‌حل‌های اجراشده',
    icon: PanelsTopLeft,
  },
  {
    href: '/#projects',
    keyword: 'منتخب',
    title: 'پروژه‌های شاخص',
    description: 'چند تجربه منتخب از همکاری با کسب‌وکارها',
    icon: Sparkles,
  },
  {
    href: '/#contact-form',
    keyword: 'شروع',
    title: 'پروژه بعدی شما',
    description: 'نیازتان را بگویید تا مسیر اجرا را طراحی کنیم',
    icon: MessageCircleMore,
  },
];

const aboutEntries: MegaMenuEntry[] = [
  {
    href: '/#about',
    keyword: 'ما',
    title: 'درباره آرین پژوهش',
    description: 'نگاه، تخصص و شیوه‌ای که با آن محصول می‌سازیم',
    icon: BookOpenText,
  },
  {
    href: '/#process',
    keyword: 'مسیر',
    title: 'فرایند همکاری',
    description: 'از شناخت مسئله تا طراحی، توسعه و تحویل',
    icon: Target,
  },
  {
    href: '/#faq',
    keyword: 'پاسخ',
    title: 'پرسش‌های متداول',
    description: 'پاسخ کوتاه به سؤال‌های پرتکرار پیش از شروع',
    icon: CircleHelp,
  },
];

const menuMeta: Record<MenuKey, { title: string; description: string; href: string; cta: string }> = {
  services: {
    title: 'راهکار مناسب پروژه‌تان را پیدا کنید',
    description: 'طراحی و توسعه از یک صفحه معرفی تا سامانه‌های اختصاصی و مقیاس‌پذیر.',
    href: '/products',
    cta: 'مشاهده همه خدمات',
  },
  portfolio: {
    title: 'خروجی واقعی، نه فقط یک ظاهر زیبا',
    description: 'نمونه‌هایی از محصولاتی که با تمرکز بر تجربه، سرعت و نتیجه ساخته شده‌اند.',
    href: '/portfolio',
    cta: 'مشاهده نمونه‌کارها',
  },
  about: {
    title: 'همکاری شفاف از ایده تا انتشار',
    description: 'هر مرحله، خروجی و تصمیم مشخص دارد تا بدانید پروژه دقیقاً کجا ایستاده است.',
    href: '/#about',
    cta: 'بیشتر درباره ما',
  },
  blog: {
    title: 'دانش‌نامه آرین پژوهش',
    description: 'راهنماهای کوتاه و کاربردی برای انتخاب فناوری، امنیت و رشد آنلاین.',
    href: '/blog',
    cta: 'مشاهده همه مقاله‌ها',
  },
};

function getFirstKeyword(post: BlogPost): string {
  const explicitKeyword = post.keywords
    ?.split(/[,،]/)
    .map((keyword) => keyword.trim())
    .find(Boolean);

  if (explicitKeyword) return explicitKeyword;

  const technicalKeyword = post.title.match(/SSL|React|Next\.js|ASP\.NET(?: Core)?|SEO|API/i)?.[0];
  if (technicalKeyword) return technicalKeyword;

  return post.categoryName?.trim() || 'مقاله';
}

function mapServiceToEntry(service: Service): MegaMenuEntry {
  return {
    href: `/products/${encodeURIComponent(service.slug)}`,
    keyword: service.isFeatured ? 'ویژه' : 'خدمت',
    title: service.title,
    description:
      service.shortDescription ||
      service.description ||
      'جزئیات، امکانات و مسیر اجرای این خدمت',
    serviceIcon: service.icon ?? null,
  };
}

function mapBlogPostToEntry(post: BlogPost): MegaMenuEntry {
  return {
    href: `/blog/${encodeURIComponent(post.slug)}`,
    keyword: getFirstKeyword(post),
    title: post.title,
    description: post.excerpt || 'راهنمای کاربردی از وبلاگ آرین پژوهش',
    icon: FileText,
  };
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const requestedMenus = useRef(new Set<MenuKey>());
  const { isReady, portfolioEnabled } = useFeatureSettings();
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  const visibleNavLinks = useMemo(
    () => navLinks.filter(
      (link) => link.href !== '/portfolio' || (isReady && portfolioEnabled)
    ),
    [isReady, portfolioEnabled]
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const loadMenuData = useCallback((menu: MenuKey) => {
    if (requestedMenus.current.has(menu)) return;
    if (menu !== 'services' && menu !== 'blog') return;

    requestedMenus.current.add(menu);

    if (menu === 'services') {
      void servicesService.getAll().then((data) => {
        if (data.length > 0) setServices(data.slice(0, 6));
      });
      return;
    }

    void blogPostService.getAll({ pageNumber: 1, pageSize: 6 }).then((data) => {
      if (data.length > 0) setBlogPosts(data.slice(0, 6));
    });
  }, []);

  const menuEntries = useMemo<Record<MenuKey, MegaMenuEntry[]>>(
    () => ({
      services: services.length > 0 ? services.map(mapServiceToEntry) : serviceFallbacks,
      portfolio: portfolioEntries,
      about: aboutEntries,
      blog: blogPosts.length > 0 ? blogPosts.map(mapBlogPostToEntry) : blogFallbacks,
    }),
    [blogPosts, services]
  );

  const handleDesktopMenuOpen = (menu?: MenuKey) => {
    if (!menu) {
      setOpenMenu(null);
      return;
    }

    setOpenMenu(menu);
    loadMenuData(menu);
  };

  const handleNavClick = (href: string) => {
    setOpenMenu(null);
    setIsMobileMenuOpen(false);

    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    emitAuthChanged();
    router.push('/');
  };

  const activeMenuMeta = openMenu ? menuMeta[openMenu] : null;
  const activeEntries = openMenu ? menuEntries[openMenu] : [];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6"
    >
      <nav
        aria-label="ناوبری اصلی"
        onMouseLeave={() => setOpenMenu(null)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setOpenMenu(null);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setOpenMenu(null);
        }}
        className={cn(
          'relative container mx-auto max-w-7xl rounded-2xl border px-4 py-3 transition-[background-color,border-color,box-shadow] duration-300 sm:px-5',
          isScrolled
            ? 'border-border/80 bg-background/80 shadow-xl shadow-black/10 backdrop-blur-2xl dark:border-white/10 dark:bg-black/65 dark:shadow-black/30'
            : 'border-border/60 bg-background/55 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-black/35 dark:shadow-black/20'
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <Link href="/" onClick={() => handleNavClick('/')} className="shrink-0">
            <span className="text-xl font-black tracking-tight text-gradient xl:text-2xl">
              آرین پژوهش
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex xl:gap-2">
            {visibleNavLinks.map((link) => {
              const isOpen = Boolean(link.menu && openMenu === link.menu);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => handleDesktopMenuOpen(link.menu)}
                  onFocus={() => handleDesktopMenuOpen(link.menu)}
                  onClick={() => handleNavClick(link.href)}
                  aria-expanded={link.menu ? isOpen : undefined}
                  className={cn(
                    'group relative inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors xl:px-3.5',
                    isOpen
                      ? 'bg-sky-500/10 text-sky-700 dark:bg-cyan-400/10 dark:text-cyan-300'
                      : 'text-foreground/70 hover:bg-muted/60 hover:text-foreground'
                  )}
                >
                  {link.label}
                  {link.menu && (
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 transition-transform duration-200',
                        isOpen && 'rotate-180'
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      'absolute inset-x-3 -bottom-0.5 h-0.5 origin-right scale-x-0 rounded-full bg-gradient-to-l from-sky-400 to-blue-600 transition-transform duration-200 dark:from-cyan-400 dark:to-blue-500',
                      isOpen && 'scale-x-100'
                    )}
                  />
                </Link>
              );
            })}
          </div>

          <div className="hidden items-center gap-1.5 lg:flex">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="rounded-full p-2 transition-colors hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-sky-500"
              aria-label="جست‌وجو"
            >
              <Search className="h-5 w-5" />
            </button>
            <LanguageSwitcher />
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Button asChild variant="outline" size="sm" className="hidden rounded-full xl:inline-flex">
                    <Link href="/dashboard/admin">
                      <Shield className="ml-1 h-4 w-4" />
                      مدیریت
                    </Link>
                  </Button>
                )}
                <Button asChild size="sm" className="btn-primary px-4 shadow-glow">
                  <Link href="/dashboard">
                    <LayoutDashboard className="ml-1 h-4 w-4" />
                    داشبورد
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={handleLogout}
                  aria-label="خروج"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden rounded-full xl:inline-flex">
                  <Link href="/login">ورود</Link>
                </Button>
                <Button asChild size="sm" className="btn-primary px-4 shadow-glow">
                  <Link href="/register">ثبت‌نام</Link>
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="rounded-full p-2 hover:bg-muted/60"
              aria-label="جست‌وجو"
            >
              <Search className="h-5 w-5" />
            </button>
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              className="rounded-full p-2 hover:bg-muted/60"
              onClick={() => setIsMobileMenuOpen((current) => !current)}
              aria-label={isMobileMenuOpen ? 'بستن منو' : 'باز کردن منو'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {openMenu && activeMenuMeta && (
            <motion.div
              key={openMenu}
              initial={{ opacity: 0, y: -8, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.99 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              className="absolute inset-x-0 top-full hidden pt-3 lg:block"
              onMouseEnter={() => handleDesktopMenuOpen(openMenu)}
            >
              <div className="overflow-hidden rounded-2xl border border-border/80 bg-background/95 p-4 shadow-2xl shadow-black/15 backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/95 dark:shadow-black/45 xl:p-5">
                <div className="grid grid-cols-[minmax(210px,0.72fr)_minmax(0,2fr)] gap-4 xl:grid-cols-[minmax(240px,0.7fr)_minmax(0,2fr)] xl:gap-5">
                  <Link
                    href={activeMenuMeta.href}
                    onClick={() => handleNavClick(activeMenuMeta.href)}
                    className="group flex min-h-48 flex-col justify-between overflow-hidden rounded-2xl border border-sky-500/15 bg-gradient-to-br from-sky-500/12 via-blue-500/5 to-transparent p-5 dark:border-cyan-400/15 dark:from-cyan-400/10 dark:via-blue-500/5"
                  >
                    <div>
                      <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-sky-600 shadow-sm dark:bg-white/10 dark:text-cyan-300">
                        <Sparkles className="h-5 w-5" />
                      </span>
                      <h2 className="text-lg font-bold leading-7">{activeMenuMeta.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {activeMenuMeta.description}
                      </p>
                    </div>
                    <span className="mt-5 inline-flex items-center text-sm font-semibold text-sky-700 dark:text-cyan-300">
                      {activeMenuMeta.cta}
                      <ArrowLeft className="mr-1.5 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    </span>
                  </Link>

                  <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-3">
                    {activeEntries.map((entry) => {
                      const Icon = entry.icon;

                      return (
                        <Link
                          key={`${openMenu}-${entry.href}-${entry.keyword}`}
                          href={entry.href}
                          onClick={() => handleNavClick(entry.href)}
                          className="group flex min-w-0 items-start gap-3 rounded-xl border border-transparent p-3 transition-colors hover:border-border/80 hover:bg-muted/60 dark:hover:border-white/10 dark:hover:bg-white/[0.055] xl:p-3.5"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-background/80 text-sky-600 shadow-sm dark:border-white/10 dark:bg-white/[0.06] dark:text-cyan-300">
                            {entry.serviceIcon !== undefined ? (
                              <ServiceIcon
                                icon={entry.serviceIcon}
                                title={entry.title}
                                className="h-5 w-5"
                              />
                            ) : Icon ? (
                              <Icon className="h-5 w-5" />
                            ) : (
                              <FileText className="h-5 w-5" />
                            )}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-extrabold text-sky-700 dark:text-cyan-300">
                              {entry.keyword}
                            </span>
                            <span className="mt-0.5 block truncate text-sm font-semibold text-foreground">
                              {entry.title}
                            </span>
                            <span className="mt-1 line-clamp-2 block text-xs leading-5 text-muted-foreground">
                              {entry.description}
                            </span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {isMobileMenuOpen && (
        <div className="container mx-auto mt-2 max-w-7xl overflow-hidden rounded-2xl border border-border/70 bg-background/95 shadow-2xl backdrop-blur-2xl lg:hidden dark:border-white/10 dark:bg-black/90">
          <div className="flex flex-col gap-1 px-5 py-5">
            {visibleNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className="rounded-xl px-3 py-3 font-medium text-foreground/75 hover:bg-muted/60 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Button asChild variant="outline" className="w-full rounded-full">
                      <Link href="/dashboard/admin" onClick={() => setIsMobileMenuOpen(false)}>
                        <Shield className="ml-2 h-4 w-4" />
                        پنل مدیریت
                      </Link>
                    </Button>
                  )}
                  <Button asChild className="btn-primary w-full shadow-glow">
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <LayoutDashboard className="ml-2 h-4 w-4" />
                      داشبورد
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full rounded-full"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      void handleLogout();
                    }}
                  >
                    <LogOut className="ml-2 h-4 w-4" />
                    خروج
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="ghost" className="w-full rounded-full">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>ورود</Link>
                  </Button>
                  <Button asChild className="btn-primary w-full shadow-glow">
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>ثبت‌نام</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <GlobalSearch isOpen={isSearchOpen} onClose={closeSearch} />
    </motion.header>
  );
}
