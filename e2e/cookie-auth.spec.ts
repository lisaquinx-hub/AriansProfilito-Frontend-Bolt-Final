import { expect, test, type BrowserContext, type Page, type Route } from '@playwright/test';

const apiOrigin = 'https://localhost:7297';
const apiPattern = `${apiOrigin}/api/**`;
const frontendOrigin = 'http://localhost:3000';

const customer = {
  id: '1f3c6bd8-4952-437f-9ed9-247931e65f23',
  fullName: 'کاربر تست',
  email: 'e2e@example.com',
  userName: 'e2e-user',
  role: 1,
  avatar: null,
  isActive: true,
  emailConfirmed: true,
};

const admin = {
  ...customer,
  id: 'bea2e243-a2a0-4854-a85e-c6f8987d25dd',
  fullName: 'مدیر تست',
  email: 'admin-e2e@example.com',
  userName: 'admin-e2e',
  role: 3,
};

function corsHeaders() {
  return {
    'access-control-allow-origin': frontendOrigin,
    'access-control-allow-credentials': 'true',
    'access-control-allow-headers': 'Content-Type, X-CSRF-TOKEN',
    'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    vary: 'Origin',
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

async function mockApi(page: Page, context: BrowserContext) {
  let csrfSequence = 0;
  let authenticatedUser: typeof customer | typeof admin | null = null;
  let logoutSeen = false;
  let commentSeen = false;
  let commentsRequestUrl = '';
  const blogPostId = 'c95ac91f-4835-4f14-8587-9a511d1475a4';

  await page.route('https://fonts.googleapis.com/**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'text/css', body: '' });
  });
  await page.route('https://fonts.gstatic.com/**', async (route) => {
    await route.abort();
  });
  await page.route('https://images.example.com/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect width="100%" height="100%" fill="#0284c7"/></svg>',
    });
  });

  await page.route(apiPattern, async (route) => {
    const request = route.request();
    const { pathname } = new URL(request.url());

    if (request.method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: corsHeaders() });
      return;
    }

    if (pathname === '/api/Auth/csrf-token') {
      csrfSequence += 1;
      await json(route, { success: true, data: { token: `csrf-e2e-${csrfSequence}` } });
      return;
    }

    if (pathname === '/api/Auth/login') {
      const payload = request.postDataJSON();
      const isAdminLogin = payload.emailOrUserName === admin.email;
      const user = isAdminLogin ? admin : customer;
      const accessCookie = isAdminLogin ? 'admin-access-cookie' : 'opaque-access-cookie';

      expect(request.headers()['x-csrf-token']).toBe(isAdminLogin ? 'csrf-e2e-4' : 'csrf-e2e-2');
      expect(payload).toMatchObject({
        emailOrUserName: user.email,
        password: 'StrongPass123',
        rememberMe: !isAdminLogin,
      });

      await context.addCookies([
        {
          name: '__Host-AriansLab.Access',
          value: accessCookie,
          url: `${apiOrigin}/`,
          httpOnly: true,
          secure: true,
          sameSite: 'None',
        },
        {
          name: '__Secure-AriansLab.Refresh',
          value: 'opaque-refresh-cookie',
          url: `${apiOrigin}/api/Auth`,
          httpOnly: true,
          secure: true,
          sameSite: 'None',
        },
      ]);
      authenticatedUser = user;
      await json(route, {
        success: true,
        data: {
          accessTokenExpiresAt: '2026-07-16T12:15:00Z',
          refreshTokenExpiresAt: '2026-08-15T12:00:00Z',
          user,
        },
      });
      return;
    }

    if (pathname === '/api/Auth/me') {
      expect(authenticatedUser).not.toBeNull();
      const expectedCookie = authenticatedUser?.role === 3
        ? 'admin-access-cookie'
        : 'opaque-access-cookie';
      expect(request.headers().cookie).toContain(`__Host-AriansLab.Access=${expectedCookie}`);
      await json(route, { success: true, data: authenticatedUser });
      return;
    }

    if (pathname === '/api/Auth/logout') {
      expect(request.headers()['x-csrf-token']).toBe('csrf-e2e-3');
      expect(request.headers().cookie).toContain('__Secure-AriansLab.Refresh=opaque-refresh-cookie');
      logoutSeen = true;
      authenticatedUser = null;
      await context.clearCookies();
      await json(route, { success: true, data: null });
      return;
    }

    if (pathname === '/api/blog/posts/e2e-comment-test') {
      await json(route, {
        success: true,
        data: {
          id: blogPostId,
          title: 'مقاله تست نظر',
          slug: 'e2e-comment-test',
          excerpt: 'تست ثبت نظر',
          content: 'محتوای تست ثبت نظر',
          coverImage: 'https://images.example.com/blog-cover.svg',
          readTime: 1,
          isPublished: true,
          publishedAt: '2026-07-16T10:00:00Z',
        },
      });
      return;
    }

    if (pathname === `/api/comments/blog-post/${blogPostId}/approved`) {
      await json(route, { success: true, data: [] });
      return;
    }

    if (pathname === '/api/comments' && request.method() === 'POST') {
      expect(request.headers()['x-csrf-token']).toBe('csrf-e2e-1');
      expect(request.postDataJSON()).toEqual({
        blogPostId,
        fullName: 'کاربر تست نظر',
        email: 'comment@example.com',
        message: 'این یک نظر تستی است.',
      });
      commentSeen = true;
      await json(route, {
        success: true,
        data: {
          id: '35fd9dd8-538c-4d74-b85c-835aaf21a36a',
          blogPostId,
          fullName: 'کاربر تست نظر',
          message: 'این یک نظر تستی است.',
          createdAt: '2026-07-16T10:15:00Z',
        },
      }, 201);
      return;
    }

    if (pathname === '/api/admin/comments' && request.method() === 'GET') {
      commentsRequestUrl = request.url();
      await json(route, {
        success: true,
        data: [{
          id: '9f6d28e3-195e-4bb6-888b-a0d24008175f',
          blogPostId,
          blogPostTitle: 'مقاله تست نظر',
          userId: customer.id,
          userFullName: customer.fullName,
          userEmail: customer.email,
          fullName: 'نظر جدید تست ادمین',
          email: 'new-comment@example.com',
          message: 'این نظر باید در پنل مدیریت دیده شود.',
          isApproved: false,
          createdAt: '2026-07-16T10:20:00Z',
        }],
      });
      return;
    }

    await json(route, { success: true, data: [] });
  });

  return {
    wasLoggedOut: () => logoutSeen,
    wasCommentSubmitted: () => commentSeen,
    adminCommentsRequestUrl: () => commentsRequestUrl,
    csrfCalls: () => csrfSequence,
  };
}

test('ورود، ثبت نظر، نمایش ادمین و صفحات حقوقی درست کار می‌کنند', async ({ page, context }) => {
  const apiState = await mockApi(page, context);

  await page.goto('/blog/e2e-comment-test', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'مقاله تست نظر', level: 1 })).toBeVisible();
  await expect(page.getByRole('img', { name: 'مقاله تست نظر' })).toBeVisible();
  await page.getByLabel('نام و نام خانوادگی').fill('کاربر تست نظر');
  await page.getByLabel('ایمیل').fill('comment@example.com');
  await page.getByLabel('پیام').fill('این یک نظر تستی است.');
  await page.getByRole('button', { name: 'ثبت نظر' }).click();
  await expect(page.getByText('نظر شما ثبت شد و پس از تأیید نمایش داده می‌شود.')).toBeVisible();
  expect(apiState.wasCommentSubmitted()).toBe(true);
  expect(apiState.csrfCalls()).toBe(1);

  await page.goto('/login');
  await page.getByLabel('ایمیل یا نام کاربری').fill(customer.email);
  await page.getByLabel('رمز عبور', { exact: true }).fill('StrongPass123');
  await page.getByLabel('مرا به خاطر بسپار').check();
  await page.getByRole('button', { name: /^ورود$/ }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('heading', { name: 'داشبورد' })).toBeVisible();

  const storage = await page.evaluate(() => ({
    local: {
      marker: localStorage.getItem('authSession'),
      access: localStorage.getItem('accessToken'),
      refresh: localStorage.getItem('refreshToken'),
    },
    session: {
      marker: sessionStorage.getItem('authSession'),
      access: sessionStorage.getItem('accessToken'),
      refresh: sessionStorage.getItem('refreshToken'),
    },
  }));

  expect(storage.local).toEqual({ marker: '1', access: null, refresh: null });
  expect(storage.session).toEqual({ marker: null, access: null, refresh: null });

  await page.getByRole('button', { name: 'خروج', exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'ورود به حساب' })).toBeVisible();
  expect(apiState.wasLoggedOut()).toBe(true);
  expect(apiState.csrfCalls()).toBe(3);

  const clearedStorage = await page.evaluate(() => ({
    local: localStorage.getItem('authSession'),
    session: sessionStorage.getItem('authSession'),
  }));
  expect(clearedStorage).toEqual({ local: null, session: null });

  await page.goto('/privacy');
  await expect(page.getByRole('heading', { name: 'سیاست حریم خصوصی', level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'کوکی‌ها و نشست کاربری' })).toBeAttached();

  await page.getByRole('link', { name: 'شرایط استفاده' }).last().click();
  await expect(page).toHaveURL(/\/terms$/);
  await expect(page.getByRole('heading', { name: 'شرایط استفاده', level: 1 })).toBeVisible();

  await page.goto('/register');
  await expect(page.getByRole('link', { name: 'شرایط استفاده' })).toHaveAttribute('href', '/terms');
  await expect(page.getByRole('link', { name: 'حریم خصوصی' })).toHaveAttribute('href', '/privacy');

  await page.goto('/login');
  await page.getByLabel('ایمیل یا نام کاربری').fill(admin.email);
  await page.getByLabel('رمز عبور', { exact: true }).fill('StrongPass123');
  await page.getByRole('button', { name: /^ورود$/ }).click();
  await expect(page).toHaveURL(/\/dashboard\/admin$/);

  await page.goto('/dashboard/admin/comments', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'مدیریت نظرات' })).toBeVisible();
  await expect(page.getByText('نظر جدید تست ادمین')).toBeVisible();
  await expect(page.getByText('new-comment@example.com')).toBeVisible();

  const commentsUrl = new URL(apiState.adminCommentsRequestUrl());
  expect(commentsUrl.searchParams.get('skip')).toBe('0');
  expect(commentsUrl.searchParams.get('take')).toBe('500');
  expect(commentsUrl.searchParams.get('cacheBuster')).toBeTruthy();
  expect(apiState.csrfCalls()).toBe(4);
});
