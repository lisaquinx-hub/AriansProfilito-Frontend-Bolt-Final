'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Image, Briefcase, DollarSign, HelpCircle,
  Settings, Share2, FolderOpen, FileText, MessageSquare, Code,
  Mail, Activity, ClipboardList, Receipt, CreditCard, HeadphonesIcon,
  Bell, Menu, X, Home, LogOut, Files, Paperclip, User, Images, BarChart3, Inbox,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { authService } from '@/services/AuthService';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NotificationDropdown } from '@/components/admin/NotificationDropdown';
import {
  ContactMessagesStatusProvider,
  useContactMessagesStatus,
} from '@/components/admin/ContactMessagesStatusProvider';

const adminLinks = [
  { href: '/dashboard/admin', icon: LayoutDashboard, label: 'داشبورد' },
  { href: '/dashboard/admin/analytics', icon: BarChart3, label: 'آمار و تحلیل سایت' },
  { href: '/dashboard/admin/users', icon: Users, label: 'کاربران' },
  { href: '/dashboard/admin/hero-sections', icon: Image, label: 'هیرو سکشن‌ها' },
  { href: '/dashboard/admin/portfolio', icon: Images, label: 'نمونه‌کارها' },
  { href: '/dashboard/admin/services', icon: Briefcase, label: 'خدمات' },
  { href: '/dashboard/admin/pricing', icon: DollarSign, label: 'قیمت‌گذاری' },
  { href: '/dashboard/admin/faqs', icon: HelpCircle, label: 'سؤالات متداول' },
  { href: '/dashboard/admin/settings', icon: Settings, label: 'تنظیمات' },
  { href: '/dashboard/admin/site-settings', icon: Settings, label: 'تنظیمات سایت' },
  { href: '/dashboard/admin/social-media', icon: Share2, label: 'شبکه‌های اجتماعی' },
  { href: '/dashboard/admin/blog-categories', icon: FolderOpen, label: 'دسته‌بندی وبلاگ' },
  { href: '/dashboard/admin/blog-posts', icon: FileText, label: 'مقالات وبلاگ' },
  { href: '/dashboard/admin/comments', icon: MessageSquare, label: 'نظرات' },
  { href: '/dashboard/admin/contact-messages', icon: Inbox, label: 'درخواست‌های فرم تماس' },
  { href: '/dashboard/admin/technologies', icon: Code, label: 'تکنولوژی‌ها' },
  { href: '/dashboard/admin/email-templates', icon: Mail, label: 'قالب‌های ایمیل' },
  { href: '/dashboard/admin/activity-logs', icon: Activity, label: 'لاگ فعالیت‌ها' },
  { href: '/dashboard/admin/audit-logs', icon: ClipboardList, label: 'لاگ ممیزی' },
  { href: '/dashboard/admin/projects', icon: Briefcase, label: 'پروژه‌ها' },
  { href: '/dashboard/admin/project-files', icon: Files, label: 'فایل‌های پروژه' },
  { href: '/dashboard/admin/file-attachments', icon: Paperclip, label: 'پیوست‌ها' },
  { href: '/dashboard/admin/invoices', icon: Receipt, label: 'فاکتورها' },
  { href: '/dashboard/admin/payments', icon: CreditCard, label: 'پرداخت‌ها' },
  { href: '/dashboard/admin/support-tickets', icon: HeadphonesIcon, label: 'تیکت‌های پشتیبانی' },
  { href: '/dashboard/admin/notifications', icon: Bell, label: 'اعلان‌ها' },
];

interface AdminLayoutContentProps {
  children: React.ReactNode;
}

function AdminLayoutContent({ children }: AdminLayoutContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { unreadCount, isLoading: isContactStatusLoading, hasError: hasContactStatusError } = useContactMessagesStatus();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const displayName = user?.fullName || user?.email || 'مدیر';
  const displayEmail = user?.email || '-';
  const contactStatus = isContactStatusLoading
    ? 'loading'
    : hasContactStatusError
      ? 'error'
      : unreadCount > 0
        ? 'new'
        : 'empty';
  const contactStatusLabel = isContactStatusLoading
    ? 'در حال بررسی'
    : hasContactStatusError
      ? 'خطا در بررسی'
      : unreadCount > 0
        ? `${unreadCount.toLocaleString('fa-IR')} درخواست جدید`
        : 'بدون درخواست جدید';

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex bg-background/20 dark:bg-background/20 overflow-x-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0, width: isSidebarOpen ? 280 : 80 }}
        className={cn(
          'fixed right-0 top-0 z-50 hidden h-screen flex-col border-l backdrop-blur-xl lg:flex',
          'transition-all duration-300',
          'bg-card/50 border-border',
          'dark:bg-card/50 dark:border-white/5'
        )}
      >
        <div className={cn('flex h-16 flex-shrink-0 items-center px-4', isSidebarOpen ? 'justify-between' : 'justify-center')}>
          {isSidebarOpen && (
            <Link href="/dashboard/admin">
              <span className="text-xl font-bold text-gradient">پنل مدیریت</span>
            </Link>
          )}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-muted"
            aria-label={isSidebarOpen ? 'بستن نوار کناری' : 'باز کردن نوار کناری'}
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="px-2 space-y-1 flex-1 overflow-y-auto">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const isContactMessagesLink = link.href === '/dashboard/admin/contact-messages';
            const isActive = link.href === '/dashboard/admin'
              ? pathname === link.href
              : pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link key={link.href} href={link.href} prefetch={false}
                className={cn('flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors group',
                  isActive ? 'bg-sky-500/10 dark:bg-cyan-500/10 text-sky-500 dark:text-cyan-400' : 'hover:bg-muted'
                )}>
                <span className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
                  <Icon className={cn('w-5 h-5 transition-colors', isActive ? 'text-sky-500 dark:text-cyan-400' : 'text-muted-foreground group-hover:text-sky-500 dark:group-hover:text-cyan-400')} />
                  {isContactMessagesLink && (
                    <span
                      data-contact-menu-status={contactStatus}
                      className={cn(
                        'absolute -left-1.5 -top-1 h-2.5 w-2.5 rounded-full border-2 border-card',
                        contactStatus === 'new' && 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]',
                        contactStatus === 'empty' && 'bg-red-500',
                        contactStatus === 'loading' && 'animate-pulse bg-muted-foreground',
                        contactStatus === 'error' && 'bg-amber-500'
                      )}
                      title={contactStatusLabel}
                    />
                  )}
                </span>
                <span className={cn('transition-opacity whitespace-nowrap text-sm', isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden')}>
                  {link.label}
                </span>
                {isContactMessagesLink && isSidebarOpen && (
                  <span
                    className={cn(
                      'mr-auto min-w-6 rounded-full px-1.5 py-0.5 text-center text-[11px] font-semibold text-white',
                      contactStatus === 'new' && 'bg-emerald-500',
                      contactStatus === 'empty' && 'bg-red-500',
                      contactStatus === 'loading' && 'animate-pulse bg-muted-foreground',
                      contactStatus === 'error' && 'bg-amber-500'
                    )}
                    aria-label={contactStatusLabel}
                  >
                    {contactStatus === 'loading' ? '…' : contactStatus === 'error' ? '!' : unreadCount.toLocaleString('fa-IR')}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border dark:border-white/5">
          {/* Avatar/user card — click to go to profile */}
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 rounded-xl p-2 hover:bg-muted/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 dark:from-blue-500 dark:to-cyan-500 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className={cn('transition-opacity min-w-0', isSidebarOpen ? 'opacity-100' : 'opacity-0')}>
              <div className="text-sm font-medium truncate">{displayName}</div>
              <div className="text-xs text-muted-foreground truncate">{displayEmail}</div>
            </div>
          </Link>
          {isSidebarOpen && (
            <button onClick={handleLogout} className="mt-2 px-2 flex items-center gap-2 text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300">
              <LogOut className="w-4 h-4" />خروج
            </button>
          )}
        </div>
      </motion.aside>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
            <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }} className="fixed right-0 top-0 bottom-0 w-72 bg-card z-50 lg:hidden overflow-y-auto">
              <div className="p-6 flex items-center justify-between border-b border-border">
                <Link href="/dashboard/admin"><span className="text-xl font-bold text-gradient">پنل مدیریت</span></Link>
                <button type="button" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="بستن منو"><X className="w-5 h-5" /></button>
              </div>
              <nav className="p-4 space-y-1">
                {adminLinks.map((link) => {
                  const Icon = link.icon;
                  const isContactMessagesLink = link.href === '/dashboard/admin/contact-messages';
                  const isActive = link.href === '/dashboard/admin'
                    ? pathname === link.href
                    : pathname === link.href || pathname.startsWith(link.href + '/');
                  return (
                    <Link key={link.href} href={link.href} prefetch={false} onClick={() => setIsMobileMenuOpen(false)}
                      className={cn('flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors', isActive ? 'bg-sky-500/10 text-sky-500' : 'hover:bg-muted')}>
                      <span className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
                        <Icon className="h-5 w-5" />
                        {isContactMessagesLink && (
                          <span
                            data-contact-menu-status={contactStatus}
                            className={cn(
                              'absolute -left-1.5 -top-1 h-2.5 w-2.5 rounded-full border-2 border-card',
                              contactStatus === 'new' && 'bg-emerald-500',
                              contactStatus === 'empty' && 'bg-red-500',
                              contactStatus === 'loading' && 'animate-pulse bg-muted-foreground',
                              contactStatus === 'error' && 'bg-amber-500'
                            )}
                          />
                        )}
                      </span>
                      <span className="text-sm">{link.label}</span>
                      {isContactMessagesLink && (
                        <span
                          className={cn(
                            'mr-auto min-w-6 rounded-full px-1.5 py-0.5 text-center text-[11px] font-semibold text-white',
                            contactStatus === 'new' && 'bg-emerald-500',
                            contactStatus === 'empty' && 'bg-red-500',
                            contactStatus === 'loading' && 'animate-pulse bg-muted-foreground',
                            contactStatus === 'error' && 'bg-amber-500'
                          )}
                          aria-label={contactStatusLabel}
                        >
                          {contactStatus === 'loading' ? '…' : contactStatus === 'error' ? '!' : unreadCount.toLocaleString('fa-IR')}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-border">
                <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-500"><LogOut className="w-4 h-4" />خروج</button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={cn('flex-1 min-w-0 transition-all duration-300', isSidebarOpen ? 'lg:mr-[280px]' : 'lg:mr-[80px]')}>
        <header className="h-16 border-b border-border dark:border-white/5 bg-card/30 backdrop-blur-xl sticky top-0 z-30">
          <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setIsMobileMenuOpen(true)} className="p-2 rounded-lg hover:bg-muted transition-colors lg:hidden" aria-label="باز کردن منو"><Menu className="w-5 h-5" /></button>
              <Link
                href="/"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="صفحه اصلی"
                title="صفحه اصلی"
              >
                <Home className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex flex-shrink-0 items-center gap-4 sm:gap-5">
              <NotificationDropdown isAdmin />
              <ThemeToggle />
              <Link
                href="/dashboard/profile"
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 transition-all hover:ring-2 hover:ring-sky-400 dark:from-blue-500 dark:to-cyan-500"
                title="پروفایل"
              >
                <User className="h-5 w-5 text-white" />
              </Link>
            </div>
          </div>
        </header>
        <main className="p-4 lg:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ContactMessagesStatusProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </ContactMessagesStatusProvider>
  );
}
