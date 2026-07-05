'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUp, Instagram, Linkedin, Twitter } from 'lucide-react';

const navLinks = [
  { href: '#services', label: 'خدمات' },
  { href: '#projects', label: 'پروژه‌ها' },
  { href: '#contact', label: 'تماس' },
];

const socialLinks = [
  { href: '#', icon: Instagram },
  { href: '#', icon: Twitter },
  { href: '#', icon: Linkedin },
];

export default function Footer() {
  return (
    <footer className="relative pt-24 pb-8 border-t border-white/5">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-gradient">آریان‌لب</span>
            </Link>
            <p className="text-foreground/50 text-sm leading-relaxed">
              استودیوی محصول دیجیتال ممتاز
              <br />
              طراحی مدرن، سرعت بالا و تجربه‌ای متفاوت
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">لینک‌های سریع</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-foreground/50 hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold mb-4">ما را دنبال کنید</h4>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ y: -3 }}
                    className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <Icon className="w-5 h-5 text-foreground/70" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-foreground/40 text-sm">
              آریان‌لب © ۲۰۲۶
            </p>

            {/* Back to Top */}
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              whileHover={{ y: -3 }}
              className="flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground transition-colors"
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
