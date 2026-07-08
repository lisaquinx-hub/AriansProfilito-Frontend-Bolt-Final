'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Image,
  Briefcase,
  DollarSign,
  HelpCircle,
  Settings,
  Share2,
  FolderOpen,
  FileText,
  MessageSquare,
  Code,
  Mail,
  Activity,
  ClipboardList,
  Receipt,
  CreditCard,
  HeadphonesIcon,
  Bell,
  Menu,
  X,
  ChevronLeft,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { authService } from '@/services/AuthService';
import { useAuth } from '@/hooks/useAuth';
import { NotificationDropdown } from '@/components/admin/NotificationDropdown';

const adminLinks = [
  { href: '/dashboard/admin', icon: LayoutDashboard, label: 'داشبورد' },
  { href: '/dashboard/admin/users', icon: Users, label: 'کاربران' },
  { href: '/dashboard/admin/hero-sections', icon: Image, label: 'هیرو سکشن‌ها' },
  { href: '/dashboard/admin/services', icon: Briefcase, label: 'خدمات' },
  { href: '/dashboard/admin/pricing', icon: DollarSign, label: 'قیمت‌گذاری' },
  { href: '/dashboard/admin/faqs', icon: HelpCircle, label: 'سوالات متداول' },
  { href: '/dashboard/admin/settings', icon: Settings, label: 'تنظیمات' },
  { href: '/dashboard/admin/site-settings', icon: Settings, label: 'تنظیمات سایت' },
  { href: '/dashboard/admin/social-media', icon: Share2, label: 'شبکه‌های اجتماعی' },
  { href: '/dashboard/admin/blog-categories', icon: FolderOpen, label: 'دسته‌بندی وبلاگ' },
  { href: '/dashboard/admin/blog-posts', icon: FileText, label: 'مقالات وبلاگ' },
  { href: '/dashboard/admin/comments', icon: MessageSquare, label: 'نظرات' },
  { href: '/dashboard/admin/technologies', icon: Code, label: 'تکنولوژی‌ها' },
  { href: '/dashboard/admin/email-templates', icon: Mail, label: 'قالب‌های ایمیل' },
  { href: '/dashboard/admin/activity-logs', icon: Activity, label: 'لاگ فعالیت‌ها' },
  { href: '/dashboard/admin/audit-logs', icon: ClipboardList, label: 'لاگ ممیزی' },
  { href: '/dashboard/admin/projects', icon: Briefcase, label: 'پروژه‌ها' },
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const displayName = user?.name || 'مدیر';
  const displayEmail = user?.email || '-';

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex bg-background overflow-x-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0, width: isSidebarOpen ? 280 : 80 }}
        className={cn(
          'hidden lg:flex flex-col fixed h-screen backdrop-blur-xl border-l z-50',
          'transition-all duration-300',
          'bg-card/50 border-border',
          'dark:bg-card/50 dark:border-white/5'
        )}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <Link href="/dashboard/admin">
            <span className={cn(
              'text-xl font-bold text-gradient transition-opacity',
              isSidebarOpen ? 'opacity-100' : 'opacity-0'
            )}>
              پنل مدیریت
            </span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-2 space-y-1 flex-1 overflow-y-auto">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors group',
                  isActive
                    ? 'bg-sky-500/10 dark:bg-cyan-500/10 text-sky-500 dark:text-cyan-400'
                    : 'hover:bg-muted'
                )}
              >
                <Icon className={cn(
                  'w-5 h-5 flex-shrink-0 transition-colors',
                  isActive
                    ? 'text-sky-500 dark:text-cyan-400'
                    : 'text-muted-foreground group-hover:text-sky-500 dark:group-hover:text-cyan-400'
                )} />
                <span className={cn(
                  'transition-opacity whitespace-nowrap text-sm',
                  isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                )}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-border dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 dark:from-blue-500 dark:to-cyan-500 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className={cn('transition-opacity', isSidebarOpen ? 'opacity-100' : 'opacity-0')}>
              <div className="text-sm font-medium">{displayName}</div>
              <div className="text-xs text-muted-foreground">{displayEmail}</div>
            </div>
          </div>
          {isSidebarOpen && (
            <button
              onClick={handleLogout}
              className="mt-3 flex items-center gap-2 text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
            >
              <LogOut className="w-4 h-4" />
              خروج
            </button>
          )}
        </div>
      </motion.aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-card z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6 flex items-center justify-between border-b border-border">
                <Link href="/dashboard/admin">
                  <span className="text-xl font-bold text-gradient">پنل مدیریت</span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="p-4 space-y-1">
                {adminLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors',
                        isActive
                          ? 'bg-sky-500/10 dark:bg-cyan-500/10 text-sky-500 dark:text-cyan-400'
                          : 'hover:bg-muted'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm text-red-500"
                >
                  <LogOut className="w-4 h-4" />
                  خروج
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={cn(
        'flex-1 min-w-0 transition-all duration-300',
        isSidebarOpen ? 'lg:mr-[280px]' : 'lg:mr-[80px]'
      )}>
        {/* Top Bar */}
        <header className="h-16 border-b border-border dark:border-white/5 bg-card/30 backdrop-blur-xl sticky top-0 z-30">
          <div className="h-full px-4 lg:px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-lg hover:bg-muted transition-colors lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              <Link href="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">بازگشت به داشبورد</span>
              </Link>
            </div>
            <div className="flex items-center gap-2 lg:gap-4">
              <NotificationDropdown isAdmin />
              <div className="flex items-center">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminLayoutContent>{children}</AdminLayoutContent>;
}
