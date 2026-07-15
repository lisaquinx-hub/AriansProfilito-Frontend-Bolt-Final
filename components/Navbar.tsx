'use client';

import { useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, LayoutDashboard, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { GlobalSearch } from '@/components/shared';
import { cn } from '@/lib/utils';
import { useAuth, emitAuthChanged } from '@/hooks/useAuth';
import { authService } from '@/services/AuthService';

const navLinks = [
  { href: '/#services', label: 'خدمات' },
  { href: '/portfolio', label: 'نمونه‌کارها' },
  { href: '/#about', label: 'درباره ما' },
  { href: '/pricing', label: 'تعرفه‌ها' },
  { href: '/blog', label: 'وبلاگ' },
  { href: '/#contact', label: 'تماس' },
];

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    emitAuthChanged();
    router.push('/');
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed top-0 right-0 left-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-xl border-b shadow-lg'
          : 'bg-transparent',
        'dark:border-white/5 dark:shadow-black/20',
        'border-border shadow-black/5'
      )}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl font-bold text-gradient"
            >
              آریان‌لب
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              link.href.startsWith('/#') ? (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-foreground/70 hover:text-foreground transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-gradient-to-l from-sky-400 to-blue-500 dark:from-cyan-400 dark:to-blue-500 transition-all duration-300 group-hover:w-full" />
                </motion.a>
              ) : (
                <Link key={link.href} href={link.href}>
                  <motion.span
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-foreground/70 hover:text-foreground transition-colors relative group inline-block"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-gradient-to-l from-sky-400 to-blue-500 dark:from-cyan-400 dark:to-blue-500 transition-all duration-300 group-hover:w-full" />
                  </motion.span>
                </Link>
              )
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <motion.button
              onClick={() => setIsSearchOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
              aria-label="جست‌وجو"
            >
              <Search className="w-5 h-5" />
            </motion.button>
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button asChild variant="outline" className="rounded-full px-4">
                      <Link href="/dashboard/admin">
                        <Shield className="w-4 h-4 ml-1" />
                        پنل مدیریت
                      </Link>
                    </Button>
                  </motion.div>
                )}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button asChild className="btn-primary px-6 shadow-glow">
                    <Link href="/dashboard">
                      <LayoutDashboard className="w-4 h-4 ml-1" />
                      داشبورد
                    </Link>
                  </Button>
                </motion.div>
                <Button
                  variant="ghost"
                  className="rounded-full px-4"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 ml-1" />
                  خروج
                </Button>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button asChild variant="ghost" className="rounded-full px-6">
                    <Link href="/login">ورود</Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button asChild className="btn-primary px-6 shadow-glow">
                    <Link href="/register">ثبت‌نام</Link>
                  </Button>
                </motion.div>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <motion.button
              onClick={() => setIsSearchOpen(true)}
              whileTap={{ scale: 0.95 }}
              className="p-2"
              aria-label="جست‌وجو"
            >
              <Search className="w-5 h-5" />
            </motion.button>
            <ThemeToggle />
            <motion.button
              className="p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
              aria-label={isMobileMenuOpen ? 'بستن منو' : 'باز کردن منو'}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </motion.button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                link.href.startsWith('/#') ? (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="text-foreground/70 hover:text-foreground transition-colors py-2"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-foreground/70 hover:text-foreground transition-colors py-2"
                  >
                    {link.label}
                  </Link>
                )
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-border">
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <Button asChild variant="outline" className="w-full rounded-full">
                        <Link href="/dashboard/admin" onClick={() => setIsMobileMenuOpen(false)}>
                          <Shield className="w-4 h-4 ml-2" />
                          پنل مدیریت
                        </Link>
                      </Button>
                    )}
                    <Button asChild className="w-full btn-primary shadow-glow">
                      <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                        <LayoutDashboard className="w-4 h-4 ml-2" />
                        داشبورد
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full rounded-full"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      <LogOut className="w-4 h-4 ml-2" />
                      خروج
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="ghost" className="w-full rounded-full">
                      <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>ورود</Link>
                    </Button>
                    <Button asChild className="w-full btn-primary shadow-glow">
                      <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>ثبت‌نام</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <GlobalSearch isOpen={isSearchOpen} onClose={closeSearch} />
    </motion.header>
  );
}
