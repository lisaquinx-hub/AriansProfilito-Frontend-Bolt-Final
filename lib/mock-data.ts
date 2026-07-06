// =============================================
// INTERFACES
// =============================================

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  metric: string;
  metricValue: string;
  image: string;
  category: string;
  featured?: boolean;
  completionTime?: string;
  startingPrice?: string;
  technologies?: string[];
  features?: string[];
  gallery?: string[];
  date?: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  startingPrice: string;
  completionTime: string;
  image: string;
  gallery: string[];
  technologies: string[];
  features: ProductFeature[];
  pricingPlans: ProductPricingPlan[];
  faqs: ProductFAQ[];
  relatedProductIds?: string[];
}

export interface ProductFeature {
  title: string;
  description: string;
}

export interface ProductPricingPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface ProductFAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  avatar?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  author: string;
  authorAvatar?: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
  tags?: string[];
  views?: number;
  likes?: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface Technology {
  id: string;
  name: string;
  icon?: string;
}

// =============================================
// CATEGORIES
// =============================================

export const productCategories: Category[] = [
  { id: 'web', name: 'طراحی وب', count: 5 },
  { id: 'mobile', name: 'اپلیکیشن موبایل', count: 3 },
  { id: 'saas', name: 'SaaS', count: 4 },
  { id: 'ecommerce', name: 'فروشگاه آنلاین', count: 3 },
  { id: 'dashboard', name: 'داشبورد مدیریت', count: 2 },
];

export const blogCategories: Category[] = [
  { id: 'design', name: 'طراحی', count: 5 },
  { id: 'development', name: 'توسعه', count: 8 },
  { id: 'performance', name: 'عملکرد', count: 3 },
  { id: 'marketing', name: 'بازاریابی', count: 4 },
  { id: 'news', name: 'اخبار', count: 2 },
];

export const portfolioCategories: Category[] = [
  { id: 'all', name: 'همه', count: 12 },
  { id: 'web', name: 'طراحی وب', count: 5 },
  { id: 'mobile', name: 'موبایل', count: 3 },
  { id: 'saas', name: 'SaaS', count: 4 },
];

// =============================================
// TECHNOLOGIES
// =============================================

export const technologies: Technology[] = [
  { id: 'react', name: 'React' },
  { id: 'nextjs', name: 'Next.js' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'tailwind', name: 'Tailwind CSS' },
  { id: 'aspnet', name: 'ASP.NET Core' },
  { id: 'sqlserver', name: 'SQL Server' },
  { id: 'docker', name: 'Docker' },
  { id: 'kubernetes', name: 'Kubernetes' },
  { id: 'aws', name: 'AWS' },
  { id: 'figma', name: 'Figma' },
  { id: 'nodejs', name: 'Node.js' },
  { id: 'python', name: 'Python' },
];

// =============================================
// PRODUCTS
// =============================================

export const products: Product[] = [
  {
    id: '1',
    slug: 'web-design-package',
    title: 'طراحی وب حرفه‌ای',
    shortDescription: 'طراحی وب‌سایت مدرن با تمرکز بر تجربه کاربری و عملکرد بالا',
    longDescription: `طراحی وب حرفه‌ای ما شامل یک فرآیند کامل از تحلیل نیازها تا اجرای نهایی است.

ما با درک عمیق از کسب‌وکار و مخاطبان هدف، وب‌سایتی می‌سازیم که نه تنها زیبا است، بلکه عملکرد عالی هم دارد.

فرآیند کار ما شامل:
- تحلیل نیازمندی‌ها و رقبا
- طراحی UI/UX با استانداردهای روز
- توسعه با فریمورک‌های مدرن
- بهینه‌سازی SEO
- تست و بهینه‌سازی عملکرد`,
    category: 'web',
    startingPrice: '۱۵,۰۰۰,۰۰۰',
    completionTime: '۴-۸ هفته',
    image: 'https://images.pexels.com/photo/196644/pexels-photo-196644.jpeg',
    gallery: [
      'https://images.pexels.com/photo/196644/pexels-photo-196644.jpeg',
      'https://images.pexels.com/photo/270348/pexels-photo-270348.jpeg',
      'https://images.pexels.com/photo/3182851/pexels-photo-3182851.jpeg',
    ],
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    features: [
      { title: 'طراحی مدرن', description: 'طراحی با جدیدترین روندهای UI/UX' },
      { title: 'رسپانسیو کامل', description: 'نمایش عالی در تمام دستگاه‌ها' },
      { title: 'سرعت بالا', description: 'بهینه‌سازی حرفه‌ای برای لود سریع' },
      { title: 'SEO اختصاصی', description: 'بهینه‌سازی موتور جستجو' },
      { title: 'امنیت', description: 'استانداردهای امنیتی روز' },
    ],
    pricingPlans: [
      {
        id: '1',
        name: 'پایه',
        price: '۱۵,۰۰۰,۰۰۰',
        description: 'مناسب برای کسب‌وکارهای کوچک',
        features: ['طراحی ۵ صفحه', 'فرم تماس', 'رسپانسیو', 'SEO پایه'],
      },
      {
        id: '2',
        name: 'حرفه‌ای',
        price: '۳۵,۰۰۰,۰۰۰',
        description: 'پکیج کامل برای رشد',
        features: ['طراحی نامحدود', 'سیستم مدیریت محتوا', 'آنالیتیکس', 'SEO پیشرفته', 'پشتیبانی ۶ ماهه'],
        isPopular: true,
      },
      {
        id: '3',
        name: 'سازمانی',
        price: '۷۵,۰۰۰,۰۰۰',
        description: 'راه حل سازمانی کامل',
        features: ['همه امکانات', 'API سفارشی', 'ادغام سیستم‌ها', 'پشتیبانی ۱۲ ماهه', 'SLA تضمینی'],
      },
    ],
    faqs: [
      { id: '1', question: 'مدت زمان اجرای پروژه چقدر است؟', answer: 'معمولاً ۴ تا ۸ هفته بسته به پیچیدگی پروژه.' },
      { id: '2', question: 'آیا پشتیبانی ارائه می‌دهید؟', answer: 'بله، پشتیبانی از ۳ تا ۱۲ ماه بسته به پکیج انتخابی.' },
    ],
    relatedProductIds: ['2', '3'],
  },
  {
    id: '2',
    slug: 'mobile-app-development',
    title: 'توسعه اپلیکیشن موبایل',
    shortDescription: 'اپلیکیشن iOS و Android با کیفیت بالا و کارایی عالی',
    longDescription: `توسعه اپلیکیشن موبایل با رویکرد کاربرمحور و تکنولوژی‌های روز.

ما اپلیکیشنی می‌سازیم که کاربران عاشق آن شوند. از طراحی تا انتشار در استورها.`,
    category: 'mobile',
    startingPrice: '۴۵,۰۰۰,۰۰۰',
    completionTime: '۸-۱۲ هفته',
    image: 'https://images.pexels.com/photo/607812/pexels-photo-607812.jpeg',
    gallery: [
      'https://images.pexels.com/photo/607812/pexels-photo-607812.jpeg',
      'https://images.pexels.com/photo/1474217/pexels-photo-1474217.jpeg',
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'AWS'],
    features: [
      { title: 'کاهشیف', description: 'یک کدبیس برای iOS و Android' },
      { title: 'عملکرد بومی', description: 'سرعت و کارایی عالی' },
      { title: 'آپدیت آسان', description: 'آپدیت بدون نیاز به استور' },
    ],
    pricingPlans: [
      {
        id: '1',
        name: 'MVP',
        price: '۴۵,۰۰۰,۰۰۰',
        description: 'نسخه اولیه سریع',
        features: ['اپلیکیشن ساده', 'iOS و Android', 'ثبت در استور'],
      },
      {
        id: '2',
        name: 'استاندارد',
        price: '۸۵,۰۰۰,۰۰۰',
        description: 'اپلیکیشن کامل',
        features: ['آم امکانات MVP', 'پوش نوتیفیکیشن', 'آنالیتیکس', 'پشتیبانی ۶ ماهه'],
        isPopular: true,
      },
    ],
    faqs: [
      { id: '1', question: 'هر دو پلتفرم را پشتیبانی می‌کنید؟', answer: 'بله، هم iOS و هم Android.' },
    ],
    relatedProductIds: ['1', '4'],
  },
  {
    id: '3',
    slug: 'saas-platform',
    title: 'پلتفرم SaaS',
    shortDescription: 'راه‌اندازی پلتفرم SaaS با معماری مقیاس‌پذیر',
    longDescription: `ساخت پلتفرم SaaS از صفر تا صد. از معماری تا استقرار در کلود.

معماری ما برای رشد طراحی شده و می‌تواند هزاران کاربر را همزمان پشتیبانی کند.`,
    category: 'saas',
    startingPrice: '۱۲۰,۰۰۰,۰۰۰',
    completionTime: '۱۲-۲۰ هفته',
    image: 'https://images.pexels.com/photo/1460924/pexels-photo-1460924.jpeg',
    gallery: [
      'https://images.pexels.com/photo/1460924/pexels-photo-1460924.jpeg',
      'https://images.pexels.com/photo/270348/pexels-photo-270348.jpeg',
    ],
    technologies: ['React', 'Next.js', 'ASP.NET Core', 'SQL Server', 'Docker', 'Kubernetes'],
    features: [
      { title: 'مقیاس‌پذیری', description: 'معماری برای میلیون‌ها کاربر' },
      { title: 'Multi-tenancy', description: 'پشتیبانی از چند کاربر' },
      { title: 'پرداخت', description: 'ادغام درگاه پرداخت' },
    ],
    pricingPlans: [
      {
        id: '1',
        name: 'MVP',
        price: '۱۲۰,۰۰۰,۰۰۰',
        description: 'نسخه اولیه',
        features: ['احراز هویت', 'داشبورد', 'پرداخت', '۱۰ ماژول اصلی'],
      },
      {
        id: '2',
        name: 'کامل',
        price: '۲۵۰,۰۰۰,۰۰۰',
        description: 'پلتفرم سازمانی کامل',
        features: ['همه امکانات MVP', 'API کامل', 'وب‌هوک', 'گزارش‌گیری', 'پشتیبانی ۱۲ ماهه'],
        isPopular: true,
      },
    ],
    faqs: [
      { id: '1', question: 'چه تکنولوژی‌هایی استفاده می‌کنید؟', answer: 'Next.js, ASP.NET Core, SQL Server, و Docker.' },
    ],
    relatedProductIds: ['1', '4'],
  },
  {
    id: '4',
    slug: 'ecommerce-full',
    title: 'فروشگاه آنلاین کامل',
    shortDescription: 'فروشگاه آنلاین با درگاه پرداخت و مدیریت حرفه‌ای',
    longDescription: `فروشگاه آنلاین با تمام امکانات مورد نیاز برای فروش آنلاین.

از درگاه پرداخت تا مدیریت موجودی و ارسال سفارشات.`,
    category: 'ecommerce',
    startingPrice: '۳۵,۰۰۰,۰۰۰',
    completionTime: '۶-۱۰ هفته',
    image: 'https://images.pexels.com/photo/230544/pexels-photo-230544.jpeg',
    gallery: [
      'https://images.pexels.com/photo/230544/pexels-photo-230544.jpeg',
      'https://images.pexels.com/photo/3182851/pexels-photo-3182851.jpeg',
    ],
    technologies: ['React', 'Next.js', 'TypeScript', 'Node.js'],
    features: [
      { title: 'درگاه پرداخت', description: 'اتصال به همه درگاه‌ها' },
      { title: 'مدیریت محصول', description: 'افزودن و مدیریت محصولات' },
      { title: 'گزارش فروش', description: 'گزارش‌گیری حرفه‌ای' },
    ],
    pricingPlans: [
      {
        id: '1',
        name: 'استاندارد',
        price: '۳۵,۰۰۰,۰۰۰',
        description: 'فروشگاه کامل',
        features: ['تا ۱۰۰ محصول', 'درگاه پرداخت', 'صورت‌حساب', 'سبد خرید'],
      },
      {
        id: '2',
        name: 'حرفه‌ای',
        price: '۶۵,۰۰۰,۰۰۰',
        description: 'فروشگاه پیشرفته',
        features: ['محصول نامحدود', 'همه امکانات', 'تخفیف و کوپن', 'گزارش پیشرفته', 'پشتیبانی ۶ ماهه'],
        isPopular: true,
      },
    ],
    faqs: [],
    relatedProductIds: ['1', '5'],
  },
  {
    id: '5',
    slug: 'admin-dashboard',
    title: 'داشبورد مدیریت',
    shortDescription: 'پنل مدیریت حرفه‌ای با گزارش‌گیری پیشرفته',
    longDescription: `داشبورد مدیریت برای کنترل کامل کسب‌وکار شما.

نمایش داده‌ها، مدیریت کاربران، و گزارش‌گیری پیشرفته.`,
    category: 'dashboard',
    startingPrice: '۴۵,۰۰۰,۰۰۰',
    completionTime: '۶-۸ هفته',
    image: 'https://images.pexels.com/photo/669615/pexels-photo-669615.jpeg',
    gallery: [
      'https://images.pexels.com/photo/669615/pexels-photo-669615.jpeg',
    ],
    technologies: ['React', 'TypeScript', 'ASP.NET Core', 'SQL Server'],
    features: [
      { title: 'نمای کلی', description: 'داشبورد با چارت‌ها' },
      { title: 'مدیریت کاربران', description: 'سیستم کاربران و سطوح دسترسی' },
      { title: 'گزارش‌گیری', description: 'گزارش‌های قابل پرینت' },
    ],
    pricingPlans: [
      {
        id: '1',
        name: 'استاندارد',
        price: '۴۵,۰۰۰,۰۰۰',
        description: 'داشبورد پایه',
        features: ['نمای کلی', 'مدیریت کاربران', 'گزارش ساده'],
      },
      {
        id: '2',
        name: 'پیشرفته',
        price: '۸۵,۰۰۰,۰۰۰',
        description: 'داشبورد کامل',
        features: ['همه امکانات', 'چارت‌های پیشرفته', 'API', 'گزارش PDF', 'پشتیبانی ۱۲ ماهه'],
        isPopular: true,
      },
    ],
    faqs: [],
    relatedProductIds: ['3', '4'],
  },
];

// =============================================
// PROJECTS/PORTFOLIO (Extended)
// =============================================

export const projects: Project[] = [
  {
    id: '1',
    title: 'پلتفرم ابری نوا',
    slug: 'nova-cloud-platform',
    description: 'بازطراحی تجربه کاربری، داشبوردهای سریع و معماری فرانت‌اند برای رشد تیم‌های فنی.',
    longDescription: 'پلتفرم ابری نوا یک راه‌حل جامع برای مدیریت زیرساخت ابری است. این پروژه شامل طراحی مجدد تجربه کاربری و ساختن داشبوردهای پیشرفته بود.',
    metric: 'افزایش نرخ فعال‌سازی',
    metricValue: '۳.۲ برابر',
    image: 'https://images.pexels.com/photo/8386446/pexels-photo-8386446.jpeg',
    category: 'saas',
    featured: true,
    completionTime: '۱۶ هفته',
    startingPrice: '۱۵۰,۰۰۰,۰۰۰',
    technologies: ['React', 'Next.js', 'TypeScript', 'Docker'],
    features: ['طراحی مدرن', 'رسپانسیو', 'عملکرد بالا', 'SEO', 'امن'],
    gallery: [
      'https://images.pexels.com/photo/8386446/pexels-photo-8386446.jpeg',
      'https://images.pexels.com/photo/270348/pexels-photo-270348.jpeg',
    ],
    date: '۱۴۰۴/۰۹/۱۵',
  },
  {
    id: '2',
    title: 'کیف پول سپهر',
    slug: 'sepehr-wallet',
    description: 'طراحی سیستم تراکنش، مسیرهای امن پرداخت و رابطی مینیمال برای اعتماد بیشتر کاربران.',
    longDescription: 'کیف پول سپهر یک اپلیکیشن پرداخت موبایلی است که با تمرکز بر امنیت و سادگی طراحی شده است.',
    metric: 'کاهش زمان تراکنش',
    metricValue: '۴۰٪',
    image: 'https://images.pexels.com/photo/8370752/pexels-photo-8370752.jpeg',
    category: 'mobile',
    featured: true,
    completionTime: '۱۲ هفته',
    startingPrice: '۸۵,۰۰۰,۰۰۰',
    technologies: ['React', 'TypeScript', 'Node.js', 'AWS'],
    features: ['طراحی مدرن', 'رسپانسیو', 'امن', 'عملکرد بالا'],
    gallery: [],
    date: '۱۴۰۴/۰۷/۱۲',
  },
  {
    id: '3',
    title: 'دستیار هوشمند آوا',
    slug: 'ava-ai-assistant',
    description: 'تجربه گفت‌وگوی فارسی، پردازش سریع درخواست‌ها و رابطی شفاف برای تیم‌های پشتیبانی.',
    longDescription: 'دستیار هوشمند آوا یک چت‌بات مبتنی بر هوش مصنوعی برای پشتیبانی مشتریان است.',
    metric: 'پاسخ‌گویی سریع‌تر',
    metricValue: '۶۵٪',
    image: 'https://images.pexels.com/photo/8386443/pexels-photo-8386443.jpeg',
    category: 'saas',
    featured: false,
    completionTime: '۱۰ هفته',
    startingPrice: '۶۵,۰۰۰,۰۰۰',
    technologies: ['React', 'Python', 'ASP.NET Core', 'Docker'],
    features: ['AI پشتیبانی', 'پردازش زبان فارسی', 'عملکرد بالا'],
    gallery: [],
    date: '۱۴۰۴/۰۵/۲۵',
  },
  {
    id: '4',
    title: 'فروشگاه دیجی‌کالای',
    slug: 'digi-kalaie-store',
    description: 'فروشگاه آنلاین با سیستم مدیریت پیشرفته و تجربه خرید روان.',
    longDescription: 'فروشگاه آنلاین دیجی‌کالای یک پلتفرم فروش آنلاین با امکانات کامل است.',
    metric: 'افزایش فروش',
    metricValue: '۱۸۰٪',
    image: 'https://images.pexels.com/photo/230544/pexels-photo-230544.jpeg',
    category: 'ecommerce',
    featured: true,
    completionTime: '۱۴ هفته',
    startingPrice: '۹۵,۰۰۰,۰۰۰',
    technologies: ['React', 'Next.js', 'TypeScript', 'Node.js'],
    features: ['سبد خرید', 'پرداخت امن', 'گزارش', 'SEO'],
    gallery: [],
    date: '۱۴۰۴/۰۴/۱۰',
  },
  {
    id: '5',
    title: 'اپ پزشک آنلاین',
    slug: 'online-doctor-app',
    description: 'اپلیکیشن نوبت‌دهی و مشاوره آنلاین پزشکی.',
    longDescription: 'اپ پزشک آنلاین امکان رزرو نوبت و مشاوره ویدیویی با پزشکان را فراهم می‌کند.',
    metric: 'رضایت کاربران',
    metricValue: '۹۲٪',
    image: 'https://images.pexels.com/photo/607812/pexels-photo-607812.jpeg',
    category: 'mobile',
    featured: false,
    completionTime: '۱۸ هفته',
    startingPrice: '۱۲۰,۰۰۰,۰۰۰',
    technologies: ['React', 'TypeScript', 'Node.js', 'AWS'],
    features: ['رزرو آنلاین', 'تماس تصویری', 'پرونده پزشکی'],
    gallery: [],
    date: '۱۴۰۴/۰۲/۱۵',
  },
  {
    id: '6',
    title: 'داشبورد سرمایه‌گذاری',
    slug: 'investment-dashboard',
    description: 'پنل مدیریت سرمایه با چارت‌ها و گزارش‌های پیشرفته.',
    longDescription: 'داشبورد سرمایه‌گذاری یک ابزار تحلیلی برای سرمایه‌گذاران است.',
    metric: 'تصمیم‌گیری سریع‌تر',
    metricValue: '۳ برابر',
    image: 'https://images.pexels.com/photo/669615/pexels-photo-669615.jpeg',
    category: 'dashboard',
    featured: false,
    completionTime: '۸ هفته',
    startingPrice: '۵۵,۰۰۰,۰۰۰',
    technologies: ['React', 'TypeScript', 'ASP.NET Core', 'SQL Server'],
    features: ['چارت‌ها', 'گزارش PDF', 'API'],
    gallery: [],
    date: '۱۴۰۴/۰۱/۲۰',
  },
  {
    id: '7',
    title: 'سایت شرکتی نوآوران',
    slug: 'novaran-corporate',
    description: 'وب‌سایت معرفی شرکت با طراحی مدرن و فرم‌های تماس.',
    longDescription: 'سایت شرکتی نوآوران با طراحی مینیمال و حرفه‌ای.',
    metric: 'افزایش تماس‌ها',
    metricValue: '۲۱۵٪',
    image: 'https://images.pexels.com/photo/196644/pexels-photo-196644.jpeg',
    category: 'web',
    featured: false,
    completionTime: '۴ هفته',
    startingPrice: '۲۵,۰۰۰,۰۰۰',
    technologies: ['React', 'Next.js', 'Tailwind CSS'],
    features: ['طراحی مدرن', 'رسپانسیو', 'SEO'],
    gallery: [],
    date: '۱۴۰۳/۱۱/۰۵',
  },
  {
    id: '8',
    title: 'سیستم CRM پیشرفته',
    slug: 'advanced-crm',
    description: 'سیستم مدیریت ارتباط با مشتری با اتوماسیون فروش.',
    longDescription: 'سیستم CRM پیشرفته برای مدیریت مشتریان و فرآیندهای فروش.',
    metric: 'افزایش فروش',
    metricValue: '۱۵۰٪',
    image: 'https://images.pexels.com/photo/3182851/pexels-photo-3182851.jpeg',
    category: 'saas',
    featured: true,
    completionTime: '۲۰ هفته',
    startingPrice: '۱۸۰,۰۰۰,۰۰۰',
    technologies: ['React', 'Next.js', 'ASP.NET Core', 'SQL Server', 'Docker'],
    features: ['اتوماسیون', 'گزارش', 'API', 'امن'],
    gallery: [],
    date: '۱۴۰۳/۰۹/۱۸',
  },
];

// =============================================
// BLOG POSTS (Extended)
// =============================================

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'ux-design-principles-2026',
    title: 'اصول طراحی تجربه کاربری در سال ۲۰۲۶',
    excerpt: 'روندهای جدید در طراحی UX و نحوه پیاده‌سازی آنها در محصولات دیجیتال ایرانی.',
    content: `در این مقاله به بررسی روندهای جدید طراحی UX می‌پردازیم...

 طراحی مینیمال، انیمیشن‌های ظریف، و تمرکز بر دسترسی‌پذیری از مهم‌ترین روندهای امسال هستند.`,
    author: 'علی محمدی',
    authorAvatar: 'ع',
    date: '۱۴۰۵/۰۲/۱۵',
    readTime: '۸ دقیقه',
    image: 'https://images.pexels.com/photo/17794881/pexels-photo-17794881.jpeg',
    category: 'طراحی',
    tags: ['UX', 'طراحی', 'رندها'],
    views: 1250,
    likes: 89,
  },
  {
    id: '2',
    slug: 'microservices-architecture-startups',
    title: 'معماری میکروسرویس برای STARTUPها',
    excerpt: 'چگونه از روز اول برای رشد معماری خود برنامه‌ریزی کنیم.',
    content: 'معماری میکروسرویس راهی برای ساخت سیستم‌های مقیاس‌پذیر است...',
    author: 'رضا احمدی',
    authorAvatar: 'ر',
    date: '۱۴۰۵/۰۲/۱۰',
    readTime: '۱۲ دقیقه',
    image: 'https://images.pexels.com/photo/17794881/pexels-photo-17794881.jpeg',
    category: 'توسعه',
    tags: ['معماری', 'میکروسرویس', 'Startup'],
    views: 980,
    likes: 67,
  },
  {
    id: '3',
    slug: 'web-performance-optimization',
    title: 'بهینه‌سازی عملکرد وب اپلیکیشن‌ها',
    excerpt: 'تکنیک‌های پیشرفته برای افزایش سرعت بارگذاری و تجربه کاربر.',
    content: 'سرعت بارگذاری یکی از مهم‌ترین فاکتورها در موفقیت یک وب‌سایت است...',
    author: 'سارا نیک‌پور',
    authorAvatar: 'س',
    date: '۱۴۰۵/۰۲/۰۵',
    readTime: '۱۰ دقیقه',
    image: 'https://images.pexels.com/photo/17794881/pexels-photo-17794881.jpeg',
    category: 'عملکرد',
    tags: ['عملکرد', 'بهینه‌سازی', 'سرعت'],
    views: 1450,
    likes: 112,
  },
  {
    id: '4',
    slug: 'react-nextjs-best-practices',
    title: 'بهترین روش‌های React و Next.js',
    excerpt: 'نکات و تکنیک‌هایی که کد شما را بهتر و سریع‌تر می‌کند.',
    content: 'React و Next.js محبوب‌ترین فریمورک‌ها برای توسعه فرانت‌اند هستند...',
    author: 'مریم کریمی',
    authorAvatar: 'م',
    date: '۱۴۰۵/۰۱/۲۸',
    readTime: '۱۵ دقیقه',
    image: 'https://images.pexels.com/photo/17794881/pexels-photo-17794881.jpeg',
    category: 'توسعه',
    tags: ['React', 'Next.js', 'فرانت‌اند'],
    views: 2100,
    likes: 156,
  },
  {
    id: '5',
    slug: 'digital-marketing-strategies',
    title: 'استراتژی‌های بازاریابی دیجیتال',
    excerpt: 'روش‌های آزموده‌شده برای جذب مشتری بیشتر.',
    content: 'بازاریابی دیجیتال یکی از ارکان اصلی موفقیت کسب‌وکارهای آنلاین است...',
    author: 'امیر حسینی',
    authorAvatar: 'ا',
    date: '۱۴۰۵/۰۱/۱۵',
    readTime: '۹ دقیقه',
    image: 'https://images.pexels.com/photo/17794881/pexels-photo-17794881.jpeg',
    category: 'بازاریابی',
    tags: ['بازاریابی', 'دیجیتال', 'استراتژی'],
    views: 890,
    likes: 45,
  },
  {
    id: '6',
    slug: 'api-security-guide',
    title: 'راهنمای امنیت API',
    excerpt: 'چگونه API‌های خود را در برابر حملات امن کنیم.',
    content: 'امنیت API یکی از مهم‌ترین جنبه‌های توسعه نرم‌افزار مدرن است...',
    author: 'رضا احمدی',
    authorAvatar: 'ر',
    date: '۱۴۰۴/۱۲/۲۵',
    readTime: '۱۴ دقیقه',
    image: 'https://images.pexels.com/photo/17794881/pexels-photo-17794881.jpeg',
    category: 'توسعه',
    tags: ['امنیت', 'API', 'Backend'],
    views: 1680,
    likes: 134,
  },
];

// =============================================
// TESTIMONIALS
// =============================================

export const testimonials: Testimonial[] = [
  {
    id: '1',
    quote: 'خروجی نهایی فقط زیبا نبود؛ حس یک محصول بین‌المللی را داشت. سرعت تصمیم‌گیری و دقت اجرا فوق‌العاده بود.',
    author: 'سارا نیک‌پور',
    role: 'مدیر محصول فین‌تک',
    avatar: 'س',
  },
  {
    id: '2',
    quote: 'بعد از لانچ، کاربران بدون آموزش مسیرهای اصلی را پیدا کردند. همین سادگی، بزرگ‌ترین ارزش همکاری بود.',
    author: 'کیان فرهمند',
    role: 'بنیان‌گذار SaaS',
    avatar: 'ک',
  },
  {
    id: '3',
    quote: 'تیم ما یک لندینگ سریع می‌خواست، اما نتیجه تبدیل به زبان بصری جدید برند شد. دقیق، آرام و کاملاً ممتاز.',
    author: 'مینا آرمان',
    role: 'مدیر بازاریابی',
    avatar: 'م',
  },
  {
    id: '4',
    quote: 'از طراحی تا اجرا، تیم آریان‌لب همواره حرفه‌ای و دقیق بود. نتیجه کار از انتظارات ما فراتر رفت.',
    author: 'محمد رضایی',
    role: 'مدیرعامل نوآوران',
    avatar: 'م',
  },
];

// =============================================
// FAQS
// =============================================

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
  {
    id: '4',
    question: 'روش پرداخت چگونه است؟',
    answer: 'پرداخت معمولاً در چند مرحله انجام می‌شود: پیش‌پرداخت برای شروع، پرداخت میانی پس از تأیید طراحی، و پرداخت نهایی پس از تحویل.',
  },
  {
    id: '5',
    question: 'آیا پشتیبانی پس از تحویل دارید؟',
    answer: 'بله، همه پکیج‌های ما شامل پشتیبانی هستند. مدت زمان پشتیبانی بسته به پکیج انتخابی متفاوت است.',
  },
];

// =============================================
// PRICING PLANS
// =============================================

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

// =============================================
// SERVICES
// =============================================

export const services: Service[] = [
  {
    id: '1',
    title: 'طراحی UI/UX',
    description: 'طراحی تجربه کاربری و رابط کاربری مدرن با تمرکز بر سادگی و کارایی',
    icon: 'Palette',
  },
  {
    id: '2',
    title: 'توسعه وب',
    description: 'ساخت وب‌اپلیکیشن‌های سریع و مقیاس‌پذیر با جدیدترین تکنولوژی‌ها',
    icon: 'Rocket',
  },
  {
    id: '3',
    title: 'بهینه‌سازی عملکرد',
    description: 'افزایش سرعت و بهبود عملکرد اپلیکیشن‌های موجود',
    icon: 'Zap',
  },
];

// =============================================
// STATS
// =============================================

export const stats = {
  productsLaunched: '۱۲+',
  weeksToMvp: '۴',
  uxScore: '۹۸٪',
  saasReady: 'SaaS',
  happyClients: '۵۰+',
  teamMembers: '۱۵',
};

// =============================================
// HELPER FUNCTIONS
// =============================================

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRelatedProducts(productId: string): Product[] {
  const product = products.find((p) => p.id === productId);
  if (!product?.relatedProductIds) return [];
  return products.filter((p) => product.relatedProductIds?.includes(p.id));
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getProjectsByCategory(category: string): Project[] {
  if (category === 'all') return projects;
  return projects.filter((p) => p.category === category);
}

export function searchBlogPosts(query: string): BlogPost[] {
  const q = query.toLowerCase();
  return blogPosts.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
}

export function getPopularBlogPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);
}

export function getRelatedBlogPosts(postId: string): BlogPost[] {
  const post = blogPosts.find((p) => p.id === postId);
  if (!post) return [];
  return blogPosts
    .filter((p) => p.id !== postId && p.category === post.category)
    .slice(0, 3);
}
