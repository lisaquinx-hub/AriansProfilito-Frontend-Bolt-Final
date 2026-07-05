'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
import { cn } from '@/lib/utils';

const sidebarLinks = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'داشبورد' },
  { href: '/dashboard/projects', icon: FolderKanban, label: 'پروژه‌ها' },
  { href: '/dashboard/profile', icon: User, label: 'پروفایل' },
  { href: '/dashboard/billing', icon: CreditCard, label: 'صورت‌حساب' },
  { href: '/dashboard/support', icon: LifeBuoy, label: 'پشتیبانی' },
  { href: '/dashboard/settings', icon: Settings, label: 'تنظیمات' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0, width: isSidebarOpen ? 280 : 80 }}
        className={cn(
          'fixed h-screen bg-card/50 backdrop-blur-xl border-l border-white/5 z-50',
          'transition-all duration-300'
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
            className="p-2 rounded-lg hover:bg-white/5"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-2 h-[calc(100vh-150px)] overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <Icon className="w-5 h-5 text-foreground/50 group-hover:text-cyan-400 transition-colors" />
                <span className={cn(
                  'transition-opacity',
                  isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
                )}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className={cn('transition-opacity', isSidebarOpen ? 'opacity-100' : 'opacity-0')}>
              <div className="text-sm font-medium">کاربر</div>
              <div className="text-xs text-foreground/50">user@email.com</div>
            </div>
          </div>
          {isSidebarOpen && (
            <Link href="/login" className="mt-3 flex items-center gap-2 text-sm text-red-400 hover:text-red-300">
              <LogOut className="w-4 h-4" />
              خروج
            </Link>
          )}
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={cn(
        'flex-1 transition-all duration-300',
        isSidebarOpen ? 'mr-[280px]' : 'mr-[80px]'
      )}>
        {/* Top Bar */}
        <header className="h-16 border-b border-white/5 bg-card/30 backdrop-blur-xl sticky top-0 z-40">
          <div className="h-full px-6 flex items-center justify-between">
            <div>
              <Link href="/" className="flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground">
                <ChevronLeft className="w-4 h-4" />
                بازگشت به سایت
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg hover:bg-white/5">
                <Bell className="w-5 h-5 text-foreground/50" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-500" />
              </button>
              <Link href="/logout">
                <Button variant="ghost" size="sm">
                  <LogOut className="w-4 h-4 ml-2" />
                  خروج
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
