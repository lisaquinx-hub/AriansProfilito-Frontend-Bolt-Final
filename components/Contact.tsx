'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const scrollToForm = () => {
    const formElement = document.getElementById('contact-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="contact" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-sky-500/5 dark:from-cyan-500/5 to-transparent" />

      <div className="container mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              برای ساخت محصولی آرام، سریع و ممتاز آماده‌اید؟
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              یک پیام کوتاه کافی است. درباره ایده، محصول یا چالشی که می‌خواهید حل کنید بنویسید
              تا مسیر پیشنهاتی را با شما بررسی کنیم.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="btn-primary gap-2 group">
                    ثبت درخواست پروژه
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  </Button>
                </motion.div>
              </Link>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  onClick={scrollToForm}
                  className="rounded-full gap-2"
                >
                  تماس با ما
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            id="contact-form"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl p-8"
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-foreground/70 mb-2">نام</label>
                    <Input
                      placeholder="نام شما"
                      className="bg-muted/50 border-border focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-foreground/70 mb-2">ایمیل</label>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      className="bg-muted/50 border-border focus:border-sky-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-foreground/70 mb-2">پیام</label>
                  <Textarea
                    rows={5}
                    placeholder="پیام خود را بنویسید..."
                    className="bg-muted/50 border-border focus:border-sky-500 resize-none"
                  />
                </div>
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    type="submit"
                    className="w-full btn-primary shadow-glow"
                  >
                    ارسال پیام
                    <ArrowLeft className="mr-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h4 className="text-xl font-semibold mb-2">پیام شما ارسال شد</h4>
                <p className="text-muted-foreground">
                  پاسخ‌گویی معمولاً کمتر از یک روز کاری طول می‌کشد.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Alternative Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground mb-4">یا مستقیماً ایمیل بزنید</p>
            <motion.a
              href="mailto:contact@aryanlab.com"
              whileHover={{ scale: 1.02 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass glass-hover transition-colors"
            >
              <Mail className="w-5 h-5 text-sky-500 dark:text-cyan-400" />
              <span>contact@aryanlab.com</span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
