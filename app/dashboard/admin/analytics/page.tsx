'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  Eye,
  Headphones,
  MessageSquare,
  MonitorSmartphone,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
  WalletCards,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import { getApiErrorMessage } from '@/services/api';
import { adminAnalyticsService } from '@/services/admin/AnalyticsService';
import { AnalyticsDashboard, AnalyticsOverview } from '@/types/api';

type Period = 7 | 30 | 90;

const periods: Array<{ value: Period; label: string }> = [
  { value: 7, label: '۷ روز' },
  { value: 30, label: '۳۰ روز' },
  { value: 90, label: '۹۰ روز' },
];

const trafficChartConfig = {
  pageViews: {
    label: 'بازدید صفحه',
    theme: { light: '#0284c7', dark: '#38bdf8' },
  },
  uniqueVisitors: {
    label: 'بازدیدکننده یکتا',
    theme: { light: '#7c3aed', dark: '#a78bfa' },
  },
  registrations: {
    label: 'ثبت‌نام',
    theme: { light: '#059669', dark: '#34d399' },
  },
} satisfies ChartConfig;

const deviceChartConfig = {
  desktop: {
    label: 'دسکتاپ',
    theme: { light: '#0284c7', dark: '#38bdf8' },
  },
  mobile: {
    label: 'موبایل',
    theme: { light: '#7c3aed', dark: '#a78bfa' },
  },
  tablet: {
    label: 'تبلت',
    theme: { light: '#059669', dark: '#34d399' },
  },
} satisfies ChartConfig;

const numberFormatter = new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 0 });
const percentFormatter = new Intl.NumberFormat('fa-IR', {
  maximumFractionDigits: 1,
  minimumFractionDigits: 0,
});

function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

function formatMoney(value: number): string {
  return `${numberFormatter.format(value)} تومان`;
}

function formatDate(value: string, long = false): string {
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('fa-IR',
    long
      ? { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }
      : { month: 'short', day: 'numeric', timeZone: 'UTC' }
  ).format(date);
}

function translateDevice(value: string): string {
  return ({ desktop: 'دسکتاپ', mobile: 'موبایل', tablet: 'تبلت' } as Record<string, string>)[value] || value;
}

function translateSource(value: string): string {
  return value === 'direct' ? 'ورود مستقیم' : value;
}

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  change?: number;
  icon: React.ElementType;
  color: string;
}

function MetricCard({ title, value, description, change, icon: Icon, color }: MetricCardProps) {
  const hasChange = typeof change === 'number';
  const positive = (change || 0) >= 0;

  return (
    <Card className="glass h-full overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-2 break-words text-2xl font-bold tabular-nums">{value}</p>
          </div>
          <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl', color)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex min-h-5 items-center gap-2 text-xs">
          {hasChange && (
            <span
              className={cn(
                'inline-flex items-center gap-1 font-medium',
                positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              )}
              dir="ltr"
            >
              {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              {positive ? '+' : ''}{percentFormatter.format(change || 0)}٪
            </span>
          )}
          <span className="text-muted-foreground">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6" aria-label="در حال دریافت آمار">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-36 animate-pulse rounded-2xl border border-border bg-card/50" />
        ))}
      </div>
      <div className="h-[360px] animate-pulse rounded-2xl border border-border bg-card/50" />
    </div>
  );
}

function OperationalSummary({ overview }: { overview: AnalyticsOverview }) {
  const items = [
    { label: 'کل بازدید ثبت‌شده', value: overview.totalPageViews, icon: Eye },
    { label: 'کل کاربران ثبت‌نامی', value: overview.totalUsers, icon: Users },
    { label: 'کل پروژه‌ها', value: overview.totalProjects, icon: BriefcaseBusiness },
    { label: 'پیام خوانده‌نشده', value: overview.unreadMessages, icon: MessageSquare },
    { label: 'تیکت باز', value: overview.openTickets, icon: Headphones },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {items.map(({ label, value, icon: Icon }) => (
        <Card key={label} className="glass">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-1 text-lg font-bold tabular-nums">{formatNumber(value)}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<Period>(30);
  const [dashboard, setDashboard] = useState<AnalyticsDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setDashboard(await adminAnalyticsService.getDashboard(period));
    } catch (loadError) {
      setError(getApiErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const chartData = useMemo(
    () => dashboard?.daily.map((point) => ({ ...point, displayDate: formatDate(point.date) })) || [],
    [dashboard]
  );

  const maxTopPageViews = Math.max(1, ...(dashboard?.topPages.map((item) => item.pageViews) || [0]));

  if (isLoading && !dashboard) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">آمار و تحلیل سایت</h1>
          <p className="mt-2 text-muted-foreground">نمای زندهٔ ترافیک و عملکرد کسب‌وکار</p>
        </div>
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:bg-cyan-400/10 dark:text-cyan-400">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">آمار و تحلیل سایت</h1>
              <p className="mt-1 text-sm text-muted-foreground">بازدید، کاربران، درآمد و وضعیت عملیات</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border border-border bg-card/60 p-1" role="group" aria-label="انتخاب بازه آمار">
            {periods.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setPeriod(item.value)}
                className={cn(
                  'rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:text-sm',
                  period === item.value
                    ? 'bg-sky-500 text-white shadow-sm dark:bg-cyan-500'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                aria-pressed={period === item.value}
              >
                {item.label}
              </button>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => void loadDashboard()}
            disabled={isLoading}
            aria-label="به‌روزرسانی آمار"
            title="به‌روزرسانی آمار"
          >
            <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-red-600 dark:text-red-400">دریافت آمار با خطا روبه‌رو شد</p>
              <p className="mt-1 text-sm text-muted-foreground">{error}</p>
            </div>
            <Button variant="outline" onClick={() => void loadDashboard()}>تلاش دوباره</Button>
          </CardContent>
        </Card>
      )}

      {dashboard && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: `بازدید ${formatNumber(dashboard.days)} روز اخیر`,
                value: formatNumber(dashboard.overview.periodPageViews),
                description: 'نسبت به بازهٔ قبلی',
                change: dashboard.overview.pageViewsChangePercent,
                icon: Eye,
                color: 'bg-sky-500/10 text-sky-600 dark:bg-cyan-400/10 dark:text-cyan-400',
              },
              {
                title: 'بازدیدکننده یکتا',
                value: formatNumber(dashboard.overview.uniqueVisitors),
                description: 'نسبت به بازهٔ قبلی',
                change: dashboard.overview.uniqueVisitorsChangePercent,
                icon: Users,
                color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
              },
              {
                title: 'ثبت‌نام جدید',
                value: formatNumber(dashboard.overview.newRegistrations),
                description: 'نسبت به بازهٔ قبلی',
                change: dashboard.overview.registrationsChangePercent,
                icon: UserPlus,
                color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
              },
              {
                title: 'درآمد موفق',
                value: formatMoney(dashboard.overview.paidRevenue),
                description: 'نسبت به بازهٔ قبلی',
                change: dashboard.overview.revenueChangePercent,
                icon: WalletCards,
                color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
              },
            ].map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <MetricCard {...metric} />
              </motion.div>
            ))}
          </div>

          <OperationalSummary overview={dashboard.overview} />

          <Card className="glass overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-sky-600 dark:text-cyan-400" />
                  روند روزانه
                </CardTitle>
                <p className="mt-2 text-xs text-muted-foreground">بازدید، کاربران یکتا و ثبت‌نام‌ها در بازهٔ انتخابی</p>
              </div>
            </CardHeader>
            <CardContent className="px-2 pb-5 sm:px-5">
              <ChartContainer config={trafficChartConfig} className="h-[300px] w-full aspect-auto sm:h-[360px]">
                <AreaChart data={chartData} margin={{ top: 12, right: 8, left: 0, bottom: 4 }}>
                  <defs>
                    <linearGradient id="pageViewsFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-pageViews)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--color-pageViews)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="4 4" />
                  <XAxis dataKey="displayDate" tickLine={false} axisLine={false} minTickGap={28} />
                  <YAxis tickLine={false} axisLine={false} allowDecimals={false} width={38} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent labelFormatter={(value) => String(value)} />}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area
                    type="monotone"
                    dataKey="pageViews"
                    stroke="var(--color-pageViews)"
                    fill="url(#pageViewsFill)"
                    strokeWidth={2.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="uniqueVisitors"
                    stroke="var(--color-uniqueVisitors)"
                    fill="transparent"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="registrations"
                    stroke="var(--color-registrations)"
                    fill="transparent"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 xl:grid-cols-5">
            <Card className="glass xl:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MonitorSmartphone className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  نوع دستگاه
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dashboard.devices.length === 0 ? (
                  <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">هنوز بازدیدی ثبت نشده است</div>
                ) : (
                  <ChartContainer config={deviceChartConfig} className="mx-auto h-64 w-full max-w-sm aspect-auto">
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                      <Pie
                        data={dashboard.devices}
                        dataKey="count"
                        nameKey="name"
                        innerRadius={58}
                        outerRadius={88}
                        paddingAngle={3}
                        strokeWidth={0}
                      >
                        {dashboard.devices.map((item) => (
                          <Cell key={item.name} fill={`var(--color-${item.name})`} />
                        ))}
                      </Pie>
                      <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                    </PieChart>
                  </ChartContainer>
                )}
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {dashboard.devices.map((item) => (
                    <div key={item.name} className="rounded-xl bg-muted/50 p-3 text-center">
                      <p className="text-xs text-muted-foreground">{translateDevice(item.name)}</p>
                      <p className="mt-1 font-bold">{percentFormatter.format(item.percentage)}٪</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass xl:col-span-3">
              <CardHeader>
                <CardTitle className="text-lg">منابع ورودی</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboard.trafficSources.length === 0 ? (
                  <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">هنوز منبع ورودی ثبت نشده است</div>
                ) : dashboard.trafficSources.map((item) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="min-w-0 truncate" dir={item.name === 'direct' ? 'rtl' : 'ltr'}>
                        {translateSource(item.name)}
                      </span>
                      <span className="shrink-0 text-muted-foreground">
                        {formatNumber(item.count)} · {percentFormatter.format(item.percentage)}٪
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-l from-sky-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500"
                        style={{ width: `${Math.max(2, item.percentage)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg">صفحات پربازدید</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboard.topPages.length === 0 ? (
                  <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">داده‌ای برای این بازه وجود ندارد</div>
                ) : dashboard.topPages.map((item, index) => (
                  <div key={item.path} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-xs font-bold text-sky-600 dark:text-cyan-400">
                        {formatNumber(index + 1)}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm" dir="ltr" title={item.path}>{item.path}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatNumber(item.pageViews)} بازدید
                      </span>
                    </div>
                    <div className="mr-10 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-sky-500 dark:bg-cyan-400"
                        style={{ width: `${item.pageViews * 100 / maxTopPageViews}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg">مرورگرها</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboard.browsers.length === 0 ? (
                  <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">داده‌ای برای این بازه وجود ندارد</div>
                ) : dashboard.browsers.map((item) => (
                  <div key={item.name} className="rounded-xl border border-border/70 bg-muted/20 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{item.name}</span>
                      <div className="text-left">
                        <span className="font-bold">{percentFormatter.format(item.percentage)}٪</span>
                        <span className="mr-2 text-xs text-muted-foreground">({formatNumber(item.count)})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <p className="rounded-xl border border-border/70 bg-muted/20 px-4 py-3 text-xs leading-6 text-muted-foreground">
            آمار بازدید از زمان فعال‌شدن این بخش جمع‌آوری می‌شود. شناسهٔ بازدیدکننده در سرور هش می‌شود،
            IP ذخیره نمی‌شود و بازدیدهای ربات‌ها، ورود، ثبت‌نام و داشبورد در اعداد ترافیک محاسبه نمی‌شوند.
          </p>
        </>
      )}
    </div>
  );
}
