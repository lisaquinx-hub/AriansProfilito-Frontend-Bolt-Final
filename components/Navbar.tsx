'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '#services', label: 'خدمات' },
  { href: '#projects', label: 'پروژه‌ها' },
  { href: '#about', label: 'درباره ما' },
  { href: '#faq', label: 'سوالات' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
              className="text-2xl font-bold text-gradient"
            >
              آریان‌لب
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                whileHover={{ y: -2 }}
                className="text-foreground/70 hover:text-foreground transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-gradient-to-l from-sky-400 to-blue-500 dark:from-cyan-400 dark:to-blue-500 transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" className="rounded-full px-6">
                ورود
              </Button>
            </Link>
            <Link href="/register">
              <Button className="btn-primary px-6 shadow-glow">
                شروع همکاری
              </Button>
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
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
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-foreground/70 hover:text-foreground transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-border">
                <Link href="/login">
                  <Button variant="ghost" className="w-full rounded-full">
                    ورود
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full btn-primary shadow-glow">
                    شروع همکاری
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
