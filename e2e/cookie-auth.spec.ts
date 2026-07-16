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
  let loginSeen = false;
  let logoutSeen = false;

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
      expect(request.headers()['x-csrf-token']).toBe('csrf-e2e-1');
      expect(request.postDataJSON()).toMatchObject({
        emailOrUserName: customer.email,
        password: 'StrongPass123',
        rememberMe: true,
      });

      await context.addCookies([
        {
          name: '__Host-AriansLab.Access',
          value: 'opaque-access-cookie',
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
      loginSeen = true;
      await json(route, {
        success: true,
        data: {
          accessTokenExpiresAt: '2026-07-16T12:15:00Z',
          refreshTokenExpiresAt: '2026-08-15T12:00:00Z',
          user: customer,
        },
      });
      return;
    }

    if (pathname === '/api/Auth/me') {
      expect(loginSeen).toBe(true);
      expect(request.headers().cookie).toContain('__Host-AriansLab.Access=opaque-access-cookie');
      await json(route, { success: true, data: customer });
      return;
    }

    if (pathname === '/api/Auth/logout') {
      expect(request.headers()['x-csrf-token']).toBe('csrf-e2e-2');
      expect(request.headers().cookie).toContain('__Secure-AriansLab.Refresh=opaque-refresh-cookie');
      logoutSeen = true;
      await context.clearCookies();
      await json(route, { success: true, data: null });
      return;
    }

    await json(route, { success: true, data: [] });
  });

  return {
    wasLoggedOut: () => logoutSeen,
    csrfCalls: () => csrfSequence,
  };
}

test('جریان امن ورود و خروج و صفحات حقوقی قابل استفاده‌اند', async ({ page, context }) => {
  const apiState = await mockApi(page, context);

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
  expect(apiState.csrfCalls()).toBe(2);

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
});
