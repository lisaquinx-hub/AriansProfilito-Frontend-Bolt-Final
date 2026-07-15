# AriansProfilito Frontend

فرانت‌اند وب‌سایت و پنل کاربری/مدیریت آریان‌لب، ساخته‌شده با Next.js، TypeScript و Tailwind CSS.

## پیش‌نیازها

- Node.js 20 یا جدیدتر
- npm
- اجرای AriansLab API روی HTTPS

## راه‌اندازی

فایل تنظیمات محیطی را بسازید:

```bash
cp .env.example .env.local
```

در ویندوز می‌توانید از دستور زیر استفاده کنید:

```powershell
Copy-Item .env.example .env.local
```

آدرس API را در `.env.local` تنظیم کنید. مقدار توسعه محلی به‌صورت زیر است:

```env
NEXT_PUBLIC_API_BASE_URL=https://localhost:7297/api
```

سپس پروژه را اجرا کنید:

```bash
npm ci
npm run dev
```

وب‌سایت به‌صورت پیش‌فرض در `http://localhost:3000` در دسترس خواهد بود.

## بررسی پیش از انتشار

برای اجرای typecheck، lint، بررسی آسیب‌پذیری وابستگی‌ها و production build از دستور زیر استفاده کنید:

```bash
npm run verify
```

برای اجرای خروجی production:

```bash
npm start
```

## نکات امنیتی انتشار

- API باید فقط از HTTPS استفاده کند و CORS را به دامنه‌های مجاز محدود کند.
- مجوز نقش‌ها باید در بک‌اند برای تمام endpointهای محافظت‌شده کنترل شود؛ محافظ فرانت‌اند جایگزین authorization سمت سرور نیست.
- در فرانت‌اند، نشست عادی در `sessionStorage` و حالت «مرا به خاطر بسپار» در `localStorage` نگهداری می‌شود. برای بالاترین سطح امنیت، بک‌اند باید مهاجرت به کوکی `HttpOnly`, `Secure` و `SameSite` را پشتیبانی کند.
- کلید، رمز و توکن واقعی را در فایل‌های `NEXT_PUBLIC_*` یا مخزن Git قرار ندهید.
