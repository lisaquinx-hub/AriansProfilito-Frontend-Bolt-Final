'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { contactService } from '@/services/ContactService';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });

  const scrollToForm = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.fullName.trim() || !form.email.trim() || !form.message.trim()) {
      setError('نام، ایمیل و پیام الزامی است');
      return;
    }
    setIsSubmitting(true);
    try {
      await contactService.sendMessage({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        subject: form.subject.trim() || 'تماس از سایت',
        message: form.message.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ارسال پیام. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative">
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
              برای ثبت پروژه، فرم تماس را تکمیل کنید یا مستقیماً با ما تماس بگیرید.
              درباره ایده، محصول یا چالشی که می‌خواهید حل کنید بنویسید تا مسیر پیشنهادی را بررسی کنیم.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild className="btn-primary gap-2 group">
                  <Link href="/#contact-form">
                    تماس برای ثبت پروژه
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" onClick={scrollToForm} className="rounded-full gap-2">
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
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-full-name" className="block text-sm text-foreground/70 mb-2">نام <span className="text-red-500">*</span></label>
                    <Input
                      id="contact-full-name"
                      name="fullName"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="نام شما"
                      autoComplete="name"
                      className="bg-muted/50 border-border focus:border-sky-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm text-foreground/70 mb-2">ایمیل <span className="text-red-500">*</span></label>
                    <Input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="email@example.com"
                      autoComplete="email"
                      className="bg-muted/50 border-border focus:border-sky-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-subject" className="block text-sm text-foreground/70 mb-2">موضوع</label>
                  <Input
                    id="contact-subject"
                    name="subject"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="موضوع پیام"
                    className="bg-muted/50 border-border focus:border-sky-500"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm text-foreground/70 mb-2">پیام <span className="text-red-500">*</span></label>
                  <Textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="پیام خود را بنویسید..."
                    className="bg-muted/50 border-border focus:border-sky-500 resize-none"
                    required
                  />
                </div>
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button type="submit" disabled={isSubmitting} className="w-full btn-primary shadow-glow">
                    {isSubmitting ? (
                      <span className="animate-pulse">در حال ارسال...</span>
                    ) : (
                      <>
                        ارسال پیام
                        <ArrowLeft className="mr-2 h-4 w-4" />
                      </>
                    )}
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
        </div>
      </div>
    </section>
  );
}
