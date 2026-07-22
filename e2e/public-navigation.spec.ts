import { expect, test, type Page, type Route } from '@playwright/test';

const apiPattern = 'https://localhost:7297/api/**';
const frontendOrigin = 'http://localhost:3000';

const service = {
  id: '10c3f655-9c30-4f52-9c1f-49dbfa4d5581',
  title: 'طراحی و توسعه وب‌سایت',
  slug: 'web-development',
  shortDescription: 'طراحی سایت سریع، واکنش‌گرا و آماده رشد کسب‌وکار.',
  description: 'یک وب‌سایت حرفه‌ای با ساختار روشن، تجربه کاربری دقیق و پیاده‌سازی فنی قابل توسعه.',
  estimatedDeliveryDays: 14,
  isFeatured: true,
  displayOrder: 1,
  icon: 'globe',
  isActive: true,
  features: [
    { id: 'd4661221-12a4-4641-ac60-b524261ba0ee', title: 'طراحی واکنش‌گرا', displayOrder: 1 },
    { id: '4c233f10-a738-431e-b6cb-e738a78cbec6', title: 'بهینه‌سازی سرعت', displayOrder: 2 },
    { id: '5298a0de-2ac4-44e0-a3f0-a847e472cd66', title: 'ساختار فنی سئو', displayOrder: 3 },
    { id: '56977c06-565b-4d2e-be8b-88ffcc7f3d83', title: 'اتصال به API', displayOrder: 4 },
  ],
};

const blogPosts = [
  {
    id: '8bbabf78-dc2e-4372-9ebd-b871e7420931',
    title: 'SSL چیست و چرا هر وب‌سایت حرفه‌ای به آن نیاز دارد؟',
    slug: 'ssl-certificate-guide',
    excerpt: 'راهنمای ساده گواهی امنیتی و HTTPS.',
    coverImage: '',
    readTime: 7,
    viewCount: 20,
    isPublished: true,
    publishedAt: '2026-07-22T10:00:00Z',
    keywords: 'SSL, HTTPS, امنیت سایت',
    categoryId: '14c48ce1-80cd-4afe-805d-c71e3e5a1ba9',
    categoryName: 'امنیت وب',
    categorySlug: 'security',
    authorName: 'آرین پژوهش',
  },
  {
    id: 'bfad9cbf-9242-4532-986b-71483a4009ad',
    title: 'React در میان ابزارهای فرانت‌اند چه جایگاهی دارد؟',
    slug: 'react-frontend-ranking',
    excerpt: 'بررسی جایگاه React در توسعه رابط‌های مدرن.',
    coverImage: '',
    readTime: 8,
    viewCount: 12,
    isPublished: true,
    publishedAt: '2026-07-21T10:00:00Z',
    keywords: 'React, فرانت‌اند, Next.js',
    categoryId: '6b02c067-ed41-4e4e-97e6-158ee49f44c7',
    categoryName: 'توسعه وب',
    categorySlug: 'technology',
    authorName: 'آرین پژوهش',
  },
];

function corsHeaders() {
  return {
    'access-control-allow-origin': frontendOrigin,
    'access-control-allow-credentials': 'true',
    'access-control-allow-headers': 'Content-Type, X-CSRF-TOKEN',
    'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  };
}

async function json(route: Route, data: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: 'application/json',
    headers: corsHeaders(),
    body: JSON.stringify(data),
  });
}

async function mockPublicApi(page: Page) {
  await page.route('https://fonts.googleapis.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'text/css', body: '' })
  );
  await page.route('https://fonts.gstatic.com/**', (route) => route.abort());

  await page.route(apiPattern, async (route) => {
    const request = route.request();
    const { pathname } = new URL(request.url());

    if (request.method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: corsHeaders() });
      return;
    }

    if (pathname === '/api/services/web-development') {
      await json(route, { success: true, data: service });
      return;
    }

    if (pathname === '/api/services' || pathname === '/api/services/featured') {
      await json(route, { success: true, data: [service] });
      return;
    }

    if (pathname === '/api/blog/posts') {
      await json(route, {
        success: true,
        data: {
          items: blogPosts,
          pageNumber: 1,
          pageSize: 50,
          totalCount: blogPosts.length,
          totalPages: 1,
        },
      });
      return;
    }

    if (pathname === '/api/blog/categories') {
      await json(route, {
        success: true,
        data: [
          { id: blogPosts[0].categoryId, name: 'امنیت وب', slug: 'security', publishedPostCount: 1 },
          { id: blogPosts[1].categoryId, name: 'توسعه وب', slug: 'technology', publishedPostCount: 1 },
        ],
      });
      return;
    }

    await json(route, { success: true, data: [] });
  });
}

test.describe('public navigation and service presentation', () => {
  test('desktop blog item opens a keyword-based mega menu without click ripple', async ({ page }) => {
    await mockPublicApi(page);
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto('/');

    const blogLink = page.locator('nav').getByRole('link', { name: 'وبلاگ', exact: true });
    await blogLink.hover();

    await expect(page.getByText('دانش‌نامه آرین پژوهش')).toBeVisible();
    await expect(page.getByText('SSL', { exact: true }).first()).toBeVisible();
    await expect(page.getByText(blogPosts[0].title, { exact: true }).first()).toBeVisible();

    await page.locator('.glass').first().click({ position: { x: 12, y: 12 } });
    await expect(page.locator('.magic-bento-ripple')).toHaveCount(0);
  });

  test('mobile navigation goes directly to the blog page with no mega menu', async ({ page }) => {
    await mockPublicApi(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await page.getByRole('button', { name: 'باز کردن منو' }).click();
    await page.locator('header').getByRole('link', { name: 'وبلاگ', exact: true }).click();

    await expect(page).toHaveURL(/\/blog$/);
    await expect(page.getByRole('heading', { name: 'وبلاگ', exact: true })).toBeVisible();
    await expect(page.getByText('دانش‌نامه آرین پژوهش')).toHaveCount(0);
  });

  test('service detail contains the full presentation flow', async ({ page }) => {
    await mockPublicApi(page);
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto('/products/web-development');

    await expect(page.getByRole('heading', { name: service.title, exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'در پایان پروژه چه چیزی تحویل می‌گیرید؟' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'از گفت‌وگوی اول تا انتشار نهایی' })).toBeVisible();
    await expect(page.getByText('شناخت نیاز', { exact: true })).toBeVisible();
    await expect(page.getByText('تحویل و انتشار', { exact: true })).toBeVisible();
  });
});
