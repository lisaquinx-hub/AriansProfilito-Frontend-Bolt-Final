'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, ArrowLeft } from 'lucide-react';
import { faqs as mockFaqs } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { faqService } from '@/services/FaqService';
import { FAQ as FAQType } from '@/types/api';

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [faqs, setFaqs] = useState<FAQType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      setIsLoading(true);
      const data = await faqService.getAll();
      if (data && data.length > 0) {
        setFaqs(data);
      } else {
        setFaqs(mockFaqs);
      }
      setIsLoading(false);
    };
    fetchFaqs();
  }, []);

  // Show first 4 FAQs on homepage
  const displayedFaqs = faqs.slice(0, 4);

  if (displayedFaqs.length === 0 && !isLoading) {
    return null;
  }

  return (
    <section id="faq" className="py-24 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-medium text-sky-500 dark:text-cyan-400 mb-4">سوالات متداول</h2>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            شفاف، کوتاه، بدون پیچیدگی
          </h3>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto space-y-4"
        >
          {displayedFaqs.map((faq) => (
            <div
              key={faq.id}
              className={cn(
                'rounded-xl overflow-hidden transition-all duration-300',
                openId === faq.id ? 'glass' : 'glass hover:bg-muted/50'
              )}
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full p-6 flex items-center justify-between text-right"
              >
                <span className="font-semibold">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openId === faq.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className={cn(
                    'w-5 h-5 transition-colors',
                    openId === faq.id ? 'text-sky-500 dark:text-cyan-400' : 'text-muted-foreground'
                  )} />
                </motion.div>
              </button>

              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>

        {/* View All Button */}
        {faqs.length > 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center mt-12"
          >
            <Link href="/faq">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" className="rounded-full gap-2 group">
                  همه سوالات
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
