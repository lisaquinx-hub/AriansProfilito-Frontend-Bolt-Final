'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUp, Instagram, Linkedin, Twitter, Facebook, Youtube, Github, Globe } from 'lucide-react';
import { socialMediaService } from '@/services/SocialMediaService';
import { siteSettingsService } from '@/services/SettingsService';
import { SocialMedia, SiteSettings } from '@/types/api';
import { getSafeExternalUrl } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  Instagram, Twitter, Linkedin, Facebook, Youtube, Github, Globe,
};

const quickLinks = [
  { href: '/', label: 'خانه' },
  { href: '/portfolio', label: 'نمونه‌کارها' },
  { href: '/products', label: 'خدمات' },
  { href: '/pricing', label: 'تعرفه‌ها' },
  { href: '/blog', label: 'وبلاگ' },
  { href: '/#about', label: 'درباره ما' },
  { href: '/#contact', label: 'تماس با ما' },
];

const helpLinks = [
  { href: '/#faq', label: 'سؤالات متداول' },
  { href: '/#contact', label: 'تماس و پشتیبانی' },
  { href: '/privacy', label: 'حریم خصوصی' },
  { href: '/terms', label: 'شرایط استفاده' },
];

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialMedia[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [socialData, siteSettingsData] = await Promise.all([
        socialMediaService.getActive(),
        siteSettingsService.getCurrent(),
      ]);
      setSocialLinks(socialData);
      setSettings(siteSettingsData);
    };
    fetchData();
  }, []);

  const siteName = settings?.siteName || 'آریان‌لب';
  const footerDescription = settings?.footerText || 'استودیوی محصول دیجیتال ممتاز - طراحی مدرن، سرعت بالا و تجربه‌ای متفاوت';
  const copyright = settings?.copyright || `${siteName} © ۲۰۲۶`;
  const displaySocialLinks = socialLinks
    .filter((social) => social.isActive)
    .map((social) => ({ social, safeUrl: getSafeExternalUrl(social.url) }))
    .filter((item): item is { social: SocialMedia; safeUrl: string } => Boolean(item.safeUrl));

  return (
    <footer className="relative pt-24 pb-8 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <motion.span whileHover={{ scale: 1.02 }} className="text-2xl font-bold text-gradient">
                {siteName}
              </motion.span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">{footerDescription}</p>
            {settings?.email && (
              <p className="text-sm text-muted-foreground mt-3">{settings.email}</p>
            )}
            {settings?.phone && (
              <p className="text-sm text-muted-foreground mt-1">{settings.phone}</p>
            )}
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
                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div className="md:col-span-1">
            <h4 className="font-semibold mb-4">راهنما</h4>
            <ul className="space-y-3">
              {helpLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div className="md:col-span-1">
            <h4 className="font-semibold mb-4">شبکه‌های اجتماعی</h4>
            {displaySocialLinks.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {displaySocialLinks.map(({ social, safeUrl }) => {
                  const platform = social.platform || '';
                  const iconKey = Object.keys(iconMap).find(k => platform.toLowerCase().includes(k.toLowerCase()));
                  const Icon = iconKey ? iconMap[iconKey] : Globe;
                  return (
                    <a
                      key={social.id}
                      href={safeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg glass hover:glass-hover transition-all"
                      title={social.platform}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">-</p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">{copyright}</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-2 rounded-full glass hover:glass-hover transition-all"
            aria-label="بازگشت به بالا"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
