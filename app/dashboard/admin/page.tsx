'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, Receipt, CreditCard, HeadphonesIcon, FileText, MessageSquare, Activity } from 'lucide-react';
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

export default function AdminDashboardPage() {
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
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
        console.error('Failed to fetch dashboard stats:', error);
      }
      setIsLoading(false);
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

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="glass">
          <CardHeader>
            <CardTitle>دسترسی سریع</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link href="/dashboard/admin/blog-posts/new">
              <button className="px-4 py-2 rounded-lg bg-sky-500/10 text-sky-500 dark:text-cyan-400 hover:bg-sky-500/20 transition-colors">
                مقاله جدید
              </button>
            </Link>
            <Link href="/dashboard/admin/projects/new">
              <button className="px-4 py-2 rounded-lg bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 transition-colors">
                پروژه جدید
              </button>
            </Link>
            <Link href="/dashboard/admin/users">
              <button className="px-4 py-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors">
                مدیریت کاربران
              </button>
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
