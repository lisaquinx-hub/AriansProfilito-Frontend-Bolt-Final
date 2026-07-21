import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import PublicSiteFrame from '@/components/PublicSiteFrame';
import MagicBentoProvider from '@/components/effects/MagicBentoProvider';
import { FeatureSettingsProvider } from '@/components/FeatureSettingsProvider';
import AnalyticsTracker from '@/components/AnalyticsTracker';

export const metadata: Metadata = {
  title: 'آریان پژوهش | استودیوی محصول دیجیتال',
  description: 'نسل جدید توسعه نرم‌افزار - طراحی مدرن، سرعت بالا و تجربه‌ای متفاوت',
  keywords: ['طراحی محصول', 'توسعه نرم‌افزار', 'UX', 'UI', 'دیجیتال', 'فارسی'],
  authors: [{ name: 'آریان پژوهش' }],
  openGraph: {
    title: 'آریان پژوهش | استودیوی محصول دیجیتال',
    description: 'نسل جدید توسعه نرم‌افزار - طراحی مدرن، سرعت بالا و تجربه‌ای متفاوت',
    type: 'website',
    locale: 'fa_IR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'آریان پژوهش | استودیوی محصول دیجیتال',
    description: 'نسل جدید توسعه نرم‌افزار - طراحی مدرن، سرعت بالا و تجربه‌ای متفاوت',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className="font-vazir min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <FeatureSettingsProvider>
            <MagicBentoProvider />
            <AnalyticsTracker />
            <PublicSiteFrame>{children}</PublicSiteFrame>
            <Toaster position="top-center" dir="rtl" />
          </FeatureSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
