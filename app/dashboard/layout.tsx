'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  User,
  FolderKanban,
  CreditCard,
  LifeBuoy,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { authService } from '@/services/AuthService';
import { getStoredUser } from '@/lib/auth';
import { cn } from '@/lib/utils';

const sidebarLinks = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'داشبورد' },
  { href: '/dashboard/projects', icon: FolderKanban, label: 'پروژه‌ها' },
  { href: '/dashboard/profile', icon: User, label: 'پروفایل' },
  { href: '/dashboard/billing', icon: CreditCard, label: 'صورت‌حساب' },
  { href: '/dashboard/support', icon: LifeBuoy, label: 'پشتیبانی' },
  { href: '/dashboard/settings', icon: Settings, label: 'تنظیمات' },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardContent({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = getStoredUser<{ name: string; email: string; avatar?: string }>();
  const displayName = user?.name || 'کاربر';
  const displayEmail = user?.email || 'user@email.com';

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
          'hidden md:flex flex-col fixed h-screen backdrop-blur-xl border-l z-50',
          'transition-all duration-300',
          'bg-card/50 border-border',
          'dark:bg-card/50 dark:border-white/5'
        )}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <Link href="/">
            <span className={cn(
              'text-xl font-bold text-gradient transition-opacity',
              isSidebarOpen ? 'opacity-100' : 'opacity-0'
            )}>
              آریان‌لب
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
        <nav className="px-4 space-y-2 flex-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors group"
              >
                <Icon className="w-5 h-5 text-muted-foreground group-hover:text-sky-500 dark:group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                <span className={cn(
                  'transition-opacity whitespace-nowrap',
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
              <User className="w-5 h-5 text-white" />
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
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            {/* Mobile Menu */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-card z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6 flex items-center justify-between border-b border-border">
                <Link href="/">
                  <span className="text-xl font-bold text-gradient">آریان‌لب</span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="p-4 space-y-2">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors"
                    >
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      <span>{link.label}</span>
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
        isSidebarOpen ? 'md:mr-[280px]' : 'md:mr-[80px]'
      )}>
        {/* Top Bar */}
        <header className="h-16 border-b border-border dark:border-white/5 bg-card/30 backdrop-blur-xl sticky top-0 z-30">
          <div className="h-full px-4 md:px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-lg hover:bg-muted transition-colors md:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">بازگشت به سایت</span>
              </Link>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <ThemeToggle />
              <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-sky-500 dark:bg-cyan-500" />
              </button>
              <button
                onClick={handleLogout}
                className="hidden sm:block"
              >
                <Button variant="ghost" size="sm">
                  <LogOut className="w-4 h-4 ml-2" />
                  خروج
                </Button>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthGuard>
      <DashboardContent>{children}</DashboardContent>
    </AuthGuard>
  );
}
