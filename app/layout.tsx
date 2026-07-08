import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'آریان‌لب | استودیوی محصول دیجیتال',
  description: 'نسل جدید توسعه نرم‌افزار - طراحی مدرن، سرعت بالا و تجربه‌ای متفاوت',
  keywords: ['طراحی محصول', 'توسعه نرم‌افزار', 'UX', 'UI', 'دیجیتال', 'فارسی'],
  authors: [{ name: 'آریان‌لب' }],
  openGraph: {
    title: 'آریان‌لب | استودیوی محصول دیجیتال',
    description: 'نسل جدید توسعه نرم‌افزار - طراحی مدرن، سرعت بالا و تجربه‌ای متفاوت',
    type: 'website',
    locale: 'fa_IR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'آریان‌لب | استودیوی محصول دیجیتال',
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
          {children}
          <Toaster position="top-center" dir="rtl" />
        </ThemeProvider>
      </body>
    </html>
  );
}
