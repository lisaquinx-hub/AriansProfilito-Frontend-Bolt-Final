export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  metric: string;
  metricValue: string;
  image: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export const services: Service[] = [
  {
    id: '1',
    title: 'طراحی محصول',
    description: 'رابط‌هایی آرام، واضح و دقیق که مسیر کاربر را کوتاه‌تر و حس محصول را حرفه‌ای‌تر می‌کنند.',
    icon: 'Palette',
  },
  {
    id: '2',
    title: 'توسعه سریع و مقیاس‌پذیر',
    description: 'کد تمیز، معماری قابل رشد و تجربه‌ای روان که از روز اول برای نسخه‌های بعدی آماده است.',
    icon: 'Rocket',
  },
  {
    id: '3',
    title: 'بهینه‌سازی تجربه',
    description: 'سرعت بارگذاری، دسترسی‌پذیری و جزئیات حرکتی را تا سطح یک محصول ممتاز ارتقا می‌دهیم.',
    icon: 'Zap',
  },
];

export const projects: Project[] = [
  {
    id: '1',
    title: 'پلتفرم ابری نوا',
    description: 'بازطراحی تجربه کاربری، داشبوردهای سریع و معماری فرانت‌اند برای رشد تیم‌های فنی.',
    metric: 'افزایش نرخ فعال‌سازی',
    metricValue: '۳.۲ برابر',
    image: 'https://images.pexels.com/photo/8386446/pexels-photo-8386446.jpeg',
  },
  {
    id: '2',
    title: 'کیف پول سپهر',
    description: 'طراحی سیستم تراکنش، مسیرهای امن پرداخت و رابطی مینیمال برای اعتماد بیشتر کاربران.',
    metric: 'کاهش زمان تراکنش',
    metricValue: '۴۰٪',
    image: 'https://images.pexels.com/photo/8370752/pexels-photo-8370752.jpeg',
  },
  {
    id: '3',
    title: 'دستیار هوشمند آوا',
    description: 'تجربه گفت‌وگوی فارسی، پردازش سریع درخواست‌ها و رابطی شفاف برای تیم‌های پشتیبانی.',
    metric: 'پاسخ‌گویی سریع‌تر',
    metricValue: '۶۵٪',
    image: 'https://images.pexels.com/photo/8386443/pexels-photo-8386443.jpeg',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    quote: 'خروجی نهایی فقط زیبا نبود؛ حس یک محصول بین‌المللی را داشت. سرعت تصمیم‌گیری و دقت اجرا فوق‌العاده بود.',
    author: 'سارا نیک‌پور',
    role: 'مدیر محصول فین‌تک',
  },
  {
    id: '2',
    quote: 'بعد از لانچ، کاربران بدون آموزش مسیرهای اصلی را پیدا کردند. همین سادگی، بزرگ‌ترین ارزش همکاری بود.',
    author: 'کیان فرهمند',
    role: 'بنیان‌گذار SaaS',
  },
  {
    id: '3',
    quote: 'تیم ما یک لندینگ سریع می‌خواست، اما نتیجه تبدیل به زبان بصری جدید برند شد. دقیق، آرام و کاملاً ممتاز.',
    author: 'مینا آرمان',
    role: 'مدیر بازاریابی',
  },
];

export const faqs: FAQ[] = [
  {
    id: '1',
    question: 'شروع یک پروژه چقدر زمان می‌برد؟',
    answer: 'معمولاً در یک جلسه کوتاه نیازها را مشخص می‌کنیم و ظرف ۴۸ ساعت نقشه مسیر، زمان‌بندی و پیشنهاد اجرایی آماده می‌شود.',
  },
  {
    id: '2',
    question: 'آیا فقط طراحی انجام می‌دهید؟',
    answer: 'خیر. از استراتژی محصول و طراحی تجربه کاربری تا پیاده‌سازی فرانت‌اند، بهینه‌سازی و آماده‌سازی برای لانچ را پوشش می‌دهیم.',
  },
  {
    id: '3',
    question: 'چه چیزی خروجی شما را ممتاز می‌کند؟',
    answer: 'تمرکز ما روی حس محصول است: تایپوگرافی دقیق، فاصله‌گذاری تمیز، عملکرد سریع، حرکت‌های نرم و جزئیاتی که اعتماد ایجاد می‌کنند.',
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'اصول طراحی تجربه کاربری در سال ۲۰۲۶',
    excerpt: 'روندهای جدید در طراحی UX و نحوه پیاده‌سازی آنها در محصولات دیجیتال ایرانی.',
    author: 'علی محمدی',
    date: '۱۴۰۵/۰۲/۱۵',
    readTime: '۸ دقیقه',
    image: 'https://images.pexels.com/photo/17794881/pexels-photo-17794881.jpeg',
    category: 'طراحی',
  },
  {
    id: '2',
    title: 'معماری میکروسرویس برای STARTUPها',
    excerpt: 'چگونه از روز اول برای رشد معماری خود برنامه‌ریزی کنیم.',
    author: 'رضا احمدی',
    date: '۱۴۰۵/۰۲/۱۰',
    readTime: '۱۲ دقیقه',
    image: 'https://images.pexels.com/photo/17794881/pexels-photo-17794881.jpeg',
    category: 'توسعه',
  },
  {
    id: '3',
    title: 'بهینه‌سازی عملکرد وب اپلیکیشن‌ها',
    excerpt: 'تکنیک‌های پیشرفته برای افزایش سرعت بارگذاری و تجربه کاربر.',
    author: 'سارا نیک‌پور',
    date: '۱۴۰۵/۰۲/۰۵',
    readTime: '۱۰ دقیقه',
    image: 'https://images.pexels.com/photo/17794881/pexels-photo-17794881.jpeg',
    category: 'عملکرد',
  },
];

export const pricingPlans: PricingPlan[] = [
  {
    id: '1',
    name: 'پایه',
    price: '۱۵,۰۰۰,۰۰۰',
    description: 'مناسب برای پروژه‌های کوچک و MVP',
    features: [
      'طراحی UI/UX',
      'توسعه فرانت‌اند',
      '۲ بازنگری طراحی',
      'پشتیبانی ۳ ماهه',
    ],
  },
  {
    id: '2',
    name: 'حرفه‌ای',
    price: '۳۵,۰۰۰,۰۰۰',
    description: 'مناسب برای STARTUPها و کسب‌وکارهای در حال رشد',
    features: [
      'همه امکانات پایه',
      'طراحی و توسعه کامل',
      'API Integration',
      'بهینه‌سازی SEO',
      'پشتیبانی ۶ ماهه',
    ],
    isPopular: true,
  },
  {
    id: '3',
    name: 'سازمانی',
    price: '۶۵,۰۰۰,۰۰۰',
    description: 'مناسب برای سازمان‌ها و پروژه‌های بزرگ',
    features: [
      'همه امکانات حرفه‌ای',
      'معماری اختصاصی',
      'تیم اختصاصی',
      'آموزش تیم',
      'پشتیبانی ۱۲ ماهه',
      'SLA تضمینی',
    ],
  },
];

export const stats = {
  productsLaunched: '۱۲+',
  weeksToMvp: '۴',
  uxScore: '۹۸٪',
  saasReady: 'SaaS',
};
