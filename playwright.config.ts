import { defineConfig, devices } from '@playwright/test';

const localChromiumPath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 120_000,
  reporter: process.env.CI ? [['line'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:3000',
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    ...devices['Desktop Chrome'],
    launchOptions: localChromiumPath
      ? {
          executablePath: localChromiumPath,
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--no-zygote', '--single-process'],
        }
      : undefined,
  },
  webServer: {
    command: 'npm run dev -- --hostname localhost',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
