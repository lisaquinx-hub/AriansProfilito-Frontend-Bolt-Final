import type { ReactNode } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export interface LegalSection {
  id: string;
  title: string;
  content: ReactNode;
}

interface LegalPageProps {
  title: string;
  description: string;
  sections: LegalSection[];
}

export default function LegalPage({ title, description, sections }: LegalPageProps) {
  return (
    <main className="min-h-screen pt-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" />
      <Navbar />

      <div className="container mx-auto px-6 py-12 md:py-16 relative">
        <header className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">{title}</span>
          </h1>
          <p className="text-muted-foreground leading-8">{description}</p>
          <p className="text-xs text-muted-foreground mt-4">آخرین به‌روزرسانی: ۳۰ تیر ۱۴۰۵</p>
        </header>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-[220px_minmax(0,1fr)] gap-6 items-start">
          <nav aria-label="فهرست مطالب" className="glass rounded-2xl p-5 lg:sticky lg:top-28">
            <h2 className="font-semibold mb-4">فهرست مطالب</h2>
            <ul className="space-y-3 text-sm">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <article className="glass rounded-2xl p-6 md:p-10 space-y-10 leading-8">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <h2 className="text-xl md:text-2xl font-bold mb-4">{section.title}</h2>
                <div className="text-muted-foreground space-y-4">{section.content}</div>
              </section>
            ))}

            <div className="pt-6 border-t border-border text-sm text-muted-foreground">
              برای پرسش درباره این متن یا ثبت درخواست مرتبط، از{' '}
              <Link href="/#contact" className="text-sky-500 hover:text-sky-600 dark:text-cyan-400">
                فرم تماس
              </Link>{' '}
              استفاده کنید.
            </div>
          </article>
        </div>
      </div>

      <Footer />
    </main>
  );
}
