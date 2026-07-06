'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUp, Instagram, Linkedin, Twitter } from 'lucide-react';

const quickLinks = [
  { href: '/', label: 'خانه' },
  { href: '/portfolio', label: 'نمونه کارها' },
  { href: '/products', label: 'خدمات' },
  { href: '/pricing', label: 'تعرفه‌ها' },
  { href: '/blog', label: 'وبلاگ' },
  { href: '/#about', label: 'درباره ما' },
  { href: '/contact', label: 'تماس با ما' },
];

const legalLinks = [
  { href: '/terms', label: 'قوانین' },
  { href: '/privacy', label: 'حریم خصوصی' },
];

const socialLinks = [
  { href: '#', icon: Instagram },
  { href: '#', icon: Twitter },
  { href: '#', icon: Linkedin },
];

export default function Footer() {
  return (
    <footer className="relative pt-24 pb-8 border-t border-border">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <motion.span
                whileHover={{ scale: 1.02 }}
                className="text-2xl font-bold text-gradient"
              >
                آریان‌لب
              </motion.span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              استودیوی محصول دیجیتال ممتاز
              <br />
              طراحی مدرن، سرعت بالا و تجربه‌ای متفاوت
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h4 className="font-semibold mb-4">لینک‌های سریع</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith('/#') ? (
                    <a
                      href={link.href}
                      onClick={() => {
                        const id = link.href.replace('/#', '');
                        const element = document.getElementById(id);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="md:col-span-1">
            <h4 className="font-semibold mb-4">قوانین</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="md:col-span-1">
            <h4 className="font-semibold mb-4">ما را دنبال کنید</h4>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ y: -3, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full glass flex items-center justify-center glass-hover transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-muted-foreground text-sm">
              آریان‌لب © ۲۰۲۶
            </p>

            {/* Back to Top */}
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-full px-4 py-2"
            >
              <ArrowUp className="w-4 h-4" />
              بازگشت به معرفی
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
