/** @type {import('next').NextConfig} */
const isDevelopment = process.env.NODE_ENV === 'development';
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || (
  isDevelopment
    ? 'https://localhost:7297/api'
    : 'https://arianslab-api.onrender.com/api'
);

function getApiUrl(value) {
  try {
    const parsed = new URL(value);
    const localHttp =
      isDevelopment &&
      parsed.protocol === 'http:' &&
      ['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname);
    const normalizedPath = parsed.pathname.replace(/\/+$/, '');
    if (
      (parsed.protocol !== 'https:' && !localHttp) ||
      parsed.username ||
      parsed.password ||
      !normalizedPath.endsWith('/api')
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

const parsedApiUrl = getApiUrl(apiBaseUrl);
if (!parsedApiUrl) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL must be an HTTPS URL ending in /api and must not contain credentials.');
}

const apiOrigin = parsedApiUrl?.origin || null;
const connectSources = [
  "'self'",
  ...(apiOrigin ? [apiOrigin] : []),
  'https://translate.google.com',
  'https://translate.googleapis.com',
  'https://translate-pa.googleapis.com',
  ...(isDevelopment ? ['ws:', 'wss:'] : []),
];

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  `script-src 'self' 'unsafe-inline' https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com https://www.gstatic.com${isDevelopment ? " 'unsafe-eval'" : ''}`,
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://translate.googleapis.com https://www.gstatic.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "media-src 'self' https:",
  "frame-src 'self' https://translate.google.com",
  "worker-src 'self' blob:",
  `connect-src ${connectSources.join(' ')}`,
  ...(!isDevelopment ? ['upgrade-insecure-requests'] : []),
].join('; ');

const nextConfig = {
  poweredByHeader: false,
  outputFileTracingRoot: __dirname,
  compiler: {
    removeConsole: isDevelopment ? false : { exclude: ['error'] },
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '7297',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: contentSecurityPolicy },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000',
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '0' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${parsedApiUrl.href.replace(/\/+$/, '')}/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      { source: '/favicon.ico', destination: '/icon.svg', permanent: false },
      { source: '/contact', destination: '/#contact', permanent: false },
      { source: '/faq', destination: '/#faq', permanent: false },
      {
        source: '/dashboard/admin/blog-posts/new',
        destination: '/dashboard/admin/blog-posts',
        permanent: false,
      },
      {
        source: '/dashboard/admin/projects/new',
        destination: '/dashboard/admin/projects',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
