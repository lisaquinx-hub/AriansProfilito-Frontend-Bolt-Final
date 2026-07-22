'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Briefcase,
  Receipt,
  CreditCard,
  HeadphonesIcon,
  FileText,
  MessageSquare,
  Activity,
  Images,
  Eye,
  EyeOff,
  Inbox,
  ArrowLeft,
  LoaderCircle,
  TriangleAlert,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { adminUsersService } from '@/services/admin/index';
import { adminProjectsService } from '@/services/admin/ProjectsService';
import { adminInvoicesService } from '@/services/admin/InvoicesService';
import { adminPaymentsService } from '@/services/admin/PaymentsService';
import { adminSupportTicketsService } from '@/services/admin/SupportTicketsService';
import { adminBlogPostsService } from '@/services/admin/BlogPostsService';
import { adminCommentsService } from '@/services/admin/CommentsService';
import { adminActivityLogsService } from '@/services/admin/ActivityLogsService';
import { cn } from '@/lib/utils';
import { UserIdFilter } from '@/components/admin/UserIdFilter';
import { isValidUuid } from '@/lib/identifiers';
import { getApiErrorMessage } from '@/services/api';
import { User } from '@/types/api';
import { Switch } from '@/components/ui/switch';
import { useFeatureSettings } from '@/components/FeatureSettingsProvider';
import { toast } from 'sonner';
import { useContactMessagesStatus } from '@/components/admin/ContactMessagesStatusProvider';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  href: string;
  color: string;
}

function StatCard({ title, value, icon: Icon, href, color }: StatCardProps) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card className="glass hover:glass-hover transition-all cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', color)}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{value}</div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}

interface ContactRequestStatusCardProps {
  unreadCount: number;
  isLoading: boolean;
  hasError: boolean;
}

function ContactRequestStatusCard({
  unreadCount,
  isLoading,
  hasError,
}: ContactRequestStatusCardProps) {
  const status = isLoading
    ? 'loading'
    : hasError
      ? 'error'
      : unreadCount > 0
        ? 'new'
        : 'empty';
  const title = status === 'new'
    ? 'درخواست جدید فرم تماس دارید'
    : status === 'empty'
      ? 'درخواست جدیدی ندارید'
      : status === 'error'
        ? 'وضعیت درخواست‌ها در دسترس نیست'
        : 'در حال بررسی درخواست‌ها';
  const description = status === 'new'
    ? `${unreadCount.toLocaleString('fa-IR')} درخواست خوانده‌نشده برای بررسی دارید.`
    : status === 'empty'
      ? 'در حال حاضر هیچ درخواست خوانده‌نشده‌ای ثبت نشده است.'
      : status === 'error'
        ? 'برای مشاهده و بررسی مستقیم پیام‌ها وارد این بخش شوید.'
        : 'آخرین درخواست‌های ثبت‌شده در حال دریافت است.';

  return (
    <Link href="/dashboard/admin/contact-messages" aria-label="مشاهده درخواست‌های فرم تماس">
      <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}>
        <Card
          data-contact-request-status={status}
          className={cn(
            'glass overflow-hidden border transition-all hover:shadow-lg',
            status === 'new' && 'border-emerald-500/45 hover:shadow-emerald-500/10',
            status === 'empty' && 'border-red-500/35 hover:shadow-red-500/10',
            status === 'error' && 'border-amber-500/40 hover:shadow-amber-500/10'
          )}
        >
          <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
            <div
              className={cn(
                'relative flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full text-white shadow-lg',
                status === 'new' && 'bg-emerald-500 shadow-emerald-500/30',
                status === 'empty' && 'bg-red-500 shadow-red-500/25',
                status === 'loading' && 'bg-slate-500 shadow-slate-500/20',
                status === 'error' && 'bg-amber-500 shadow-amber-500/25'
              )}
              aria-hidden="true"
            >
              {status === 'new' && (
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/35" />
              )}
              {status === 'loading' ? (
                <LoaderCircle className="h-7 w-7 animate-spin" />
              ) : status === 'error' ? (
                <TriangleAlert className="h-7 w-7" />
              ) : (
                <Inbox className="relative h-7 w-7" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold">{title}</h2>
                {!isLoading && !hasError && (
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-1 text-xs font-semibold text-white',
                      status === 'new' ? 'bg-emerald-500' : 'bg-red-500'
                    )}
                  >
                    {unreadCount.toLocaleString('fa-IR')}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-sky-600 dark:text-cyan-400">
                مشاهده پیام‌های تماس
                <ArrowLeft className="h-4 w-4" />
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}

export default function AdminDashboardPage() {
  const {
    isReady: featureSettingsReady,
    portfolioEnabled,
    setPortfolioEnabled,
  } = useFeatureSettings();
  const {
    unreadCount: unreadContactMessages,
    isLoading: isContactStatusLoading,
    hasError: hasContactStatusError,
  } = useContactMessagesStatus();
  const [stats, setStats] = useState({
    users: 0,
    projects: 0,
    invoices: 0,
    payments: 0,
    supportTickets: 0,
    blogPosts: 0,
    pendingComments: 0,
    activityLogs: 0,
  });
  const [userIdQuery, setUserIdQuery] = useState('');
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [isSearchingUser, setIsSearchingUser] = useState(false);
  const [userSearchError, setUserSearchError] = useState<string | null>(null);

  const handleUserSearch = async () => {
    const userId = userIdQuery.trim();
    if (!isValidUuid(userId)) {
      setFoundUser(null);
      setUserSearchError('شناسه کاربر باید یک UUID معتبر باشد');
      return;
    }

    setIsSearchingUser(true);
    setUserSearchError(null);
    try {
      const user = await adminUsersService.getById(userId);
      if (!user) {
        setFoundUser(null);
        setUserSearchError('کاربری با این شناسه پیدا نشد');
      } else {
        setFoundUser(user);
      }
    } catch (error) {
      setFoundUser(null);
      setUserSearchError(getApiErrorMessage(error));
    } finally {
      setIsSearchingUser(false);
    }
  };

  const handleClearUserSearch = () => {
    setUserIdQuery('');
    setFoundUser(null);
    setUserSearchError(null);
  };

  const handlePortfolioVisibilityChange = (enabled: boolean) => {
    setPortfolioEnabled(enabled);
    toast.success(
      enabled
        ? 'بخش نمونه‌کارها در سایت نمایش داده می‌شود'
        : 'بخش نمونه‌کارها و لینک‌های آن پنهان شد'
    );
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          users,
          projects,
          invoices,
          payments,
          supportTickets,
          blogPosts,
          comments,
          activityLogs,
        ] = await Promise.all([
          adminUsersService.getAll({ take: 100 }),
          adminProjectsService.getAll(),
          adminInvoicesService.getAll(),
          adminPaymentsService.getAll(),
          adminSupportTicketsService.getAll(),
          adminBlogPostsService.getAll(),
          adminCommentsService.getAll(),
          adminActivityLogsService.getAll({ take: 100 }),
        ]);

        setStats({
          users: users.length,
          projects: projects.length,
          invoices: invoices.length,
          payments: payments.length,
          supportTickets: supportTickets.length,
          blogPosts: blogPosts.length,
          pendingComments: comments.filter(c => !c.isApproved).length,
          activityLogs: activityLogs.length,
        });
      } catch (error) {
        console.warn('Failed to fetch dashboard stats:', error);
      }
    };
    fetchStats();
  }, []);

  const statCards: StatCardProps[] = [
    { title: 'کاربران', value: stats.users, icon: Users, href: '/dashboard/admin/users', color: 'bg-blue-500' },
    { title: 'پروژه‌ها', value: stats.projects, icon: Briefcase, href: '/dashboard/admin/projects', color: 'bg-purple-500' },
    { title: 'فاکتورها', value: stats.invoices, icon: Receipt, href: '/dashboard/admin/invoices', color: 'bg-orange-500' },
    { title: 'پرداخت‌ها', value: stats.payments, icon: CreditCard, href: '/dashboard/admin/payments', color: 'bg-green-500' },
    { title: 'تیکت‌های پشتیبانی', value: stats.supportTickets, icon: HeadphonesIcon, href: '/dashboard/admin/support-tickets', color: 'bg-pink-500' },
    { title: 'مقالات وبلاگ', value: stats.blogPosts, icon: FileText, href: '/dashboard/admin/blog-posts', color: 'bg-sky-500' },
    { title: 'نظرات در انتظار', value: stats.pendingComments, icon: MessageSquare, href: '/dashboard/admin/comments', color: 'bg-red-500' },
    { title: 'لاگ فعالیت‌ها', value: stats.activityLogs, icon: Activity, href: '/dashboard/admin/activity-logs', color: 'bg-gray-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">داشبورد مدیریت</h1>
        <p className="text-muted-foreground">نمای کلی از وضعیت سیستم</p>
      </div>

      <ContactRequestStatusCard
        unreadCount={unreadContactMessages}
        isLoading={isContactStatusLoading}
        hasError={hasContactStatusError}
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Images className="h-5 w-5 text-sky-500 dark:text-cyan-400" />
            نمایش نمونه‌کارها در سایت
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                  portfolioEnabled
                    ? 'bg-emerald-500/15 text-emerald-500'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {portfolioEnabled ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="font-medium">
                  {portfolioEnabled ? 'نمونه‌کارها فعال است' : 'نمونه‌کارها غیرفعال است'}
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  با خاموش‌کردن این گزینه، بخش نمونه‌کار صفحهٔ اصلی و لینک آن در ناوبار،
                  فوتر و جست‌وجوی سایت پنهان می‌شود.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <span className="text-sm text-muted-foreground">
                {portfolioEnabled ? 'فعال' : 'غیرفعال'}
              </span>
              <Switch
                checked={portfolioEnabled}
                onCheckedChange={handlePortfolioVisibilityChange}
                disabled={!featureSettingsReady}
                aria-label="تغییر وضعیت نمایش نمونه‌کارها"
              />
            </div>
          </div>
          <p className="mt-4 border-t border-border/70 pt-4 text-xs leading-5 text-muted-foreground">
            این کنترل فرانت‌اند در همین مرورگر ذخیره می‌شود. برای اعمال سراسری روی همهٔ
            بازدیدکنندگان، بک‌اند باید یک Feature Flag عمومی ارائه کند.
          </p>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle>جست‌وجوی کاربر با شناسه</CardTitle>
        </CardHeader>
        <CardContent>
          <UserIdFilter
            value={userIdQuery}
            onChange={setUserIdQuery}
            onSearch={() => void handleUserSearch()}
            onClear={handleClearUserSearch}
            loading={isSearchingUser}
            error={userSearchError}
          />
          {foundUser && (
            <div className="mt-5 p-4 rounded-xl bg-muted/40 border border-border">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-semibold truncate">{foundUser.fullName}</div>
                  <div className="text-sm text-muted-foreground truncate">{foundUser.email}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-1 break-all" dir="ltr">
                    {foundUser.id}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/dashboard/admin/users?userId=${encodeURIComponent(foundUser.id)}`}
                    className="px-3 py-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors text-sm"
                  >
                    مشاهده کاربر
                  </Link>
                  <Link
                    href={`/dashboard/admin/activity-logs?userId=${encodeURIComponent(foundUser.id)}`}
                    className="px-3 py-2 rounded-lg bg-gray-500/10 text-foreground hover:bg-gray-500/20 transition-colors text-sm"
                  >
                    لاگ فعالیت
                  </Link>
                  <Link
                    href={`/dashboard/admin/audit-logs?userId=${encodeURIComponent(foundUser.id)}`}
                    className="px-3 py-2 rounded-lg bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 transition-colors text-sm"
                  >
                    لاگ ممیزی
                  </Link>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="glass">
          <CardHeader>
            <CardTitle>دسترسی سریع</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link href="/dashboard/admin/blog-posts" className="px-4 py-2 rounded-lg bg-sky-500/10 text-sky-500 dark:text-cyan-400 hover:bg-sky-500/20 transition-colors">
              مقاله جدید
            </Link>
            <Link href="/dashboard/admin/projects" className="px-4 py-2 rounded-lg bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 transition-colors">
              پروژه جدید
            </Link>
            <Link href="/dashboard/admin/users" className="px-4 py-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors">
              مدیریت کاربران
            </Link>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>راهنما</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>از منوی سمت راست می‌توانید به بخش‌های مختلف مدیریت دسترسی پیدا کنید.</p>
            <p className="mt-2">برای اضافه کردن محتوای جدید، روی گزینه‌های مربوطه کلیک کنید.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
