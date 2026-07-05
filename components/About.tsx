'use client';

import { motion } from 'framer-motion';
import { stats } from '@/lib/mock-data';

export default function About() {
  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-medium text-cyan-400 mb-4">درباره ما</h2>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              تیم کوچک، استاندارد بزرگ، خروجی دقیق
            </h3>
            <p className="text-foreground/60 mb-8 leading-relaxed text-lg">
              ما محصول دیجیتال را مثل یک دستگاه دقیق می‌سازیم: کم‌صدا، سریع، زیبا و قابل اعتماد.
              هدف، فقط تحویل یک وب‌سایت نیست؛ هدف ساخت تجربه‌ای است که برند شما را گران‌تر،
              جدی‌تر و به‌یادماندنی‌تر نشان دهد.
            </p>

            {/* Stats */}
            <div className="flex gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-gradient">{stats.productsLaunched}</div>
                <div className="text-sm text-foreground/50 mt-1">محصول منتشرشده</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gradient">{stats.weeksToMvp}</div>
                <div className="text-sm text-foreground/50 mt-1">هفته تا نسخه اول</div>
              </div>
            </div>

            {/* Quote */}
            <div className="p-6 rounded-xl glass border-r-4 border-r-cyan-500">
              <h4 className="text-xl font-semibold mb-3">جزئیات، همان محصول است.</h4>
              <p className="text-foreground/60 text-sm leading-relaxed">
                اگر حرکت یک دکمه، فاصله یک کارت یا ریتم تایپوگرافی درست نباشد، تجربه ممتاز کامل نمی‌شود.
                ما روی همین فاصله‌های کوچک وسواس داریم.
              </p>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Animated Circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="w-full h-full rounded-full border border-white/5"
                />
              </div>
              <div className="absolute inset-8 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  className="w-full h-full rounded-full border border-cyan-500/20"
                />
              </div>
              <div className="absolute inset-16 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  className="w-full h-full rounded-full border border-blue-500/30"
                />
              </div>

              {/* Center Logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-glow-lg">
                  <span className="text-3xl font-bold text-white">آ</span>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-10 right-10 px-4 py-2 rounded-lg glass"
              >
                <span className="text-sm text-cyan-400">UX</span>
              </motion.div>
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-10 left-10 px-4 py-2 rounded-lg glass"
              >
                <span className="text-sm text-blue-400">SaaS</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
