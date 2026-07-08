'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, CreditCard, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { userService, DashboardData } from '@/services/UserService';
import { useAuth } from '@/hooks/useAuth';
import { getApiErrorMessage } from '@/services/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const dashboardData = await userService.getDashboard();
        setData(dashboardData);
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const stats = [
    { label: 'پروژه‌های فعال', value: data?.activeProjects ?? '-', icon: FolderKanban, color: 'from-sky-500 to-blue-600 dark:from-blue-500 dark:to-cyan-500' },
    { label: 'مجموع پروژه‌ها', value: data?.totalProjects ?? '-', icon: TrendingUp, color: 'from-green-500 to-teal-500' },
    { label: 'صورت‌حساب پرداختی', value: data?.totalSpent ?? '-', icon: CreditCard, color: 'from-sky-500 to-blue-600 dark:from-blue-500 dark:to-cyan-500' },
    { label: 'پرداخت‌های پیش‌رو', value: data?.upcomingPayments ?? '-', icon: Clock, color: 'from-orange-500 to-yellow-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">داشبورد</h1>
          <p className="text-muted-foreground mt-1">
            {user?.name ? `خوش آمدید، ${user.name}` : 'به آریان‌لب خوش آمدید'}
          </p>
        </div>
        <Link href="/dashboard/projects">
          <Button className="btn-primary shadow-glow">
            مشاهده پروژه‌ها
          </Button>
        </Link>
      </div>

      {/* Error State */}
      {error && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6 text-center"
        >
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <p className="text-muted-foreground">{error}</p>
          <Button
            variant="outline"
            className="mt-4 rounded-full"
            onClick={() => window.location.reload()}
          >
            تلاش مجدد
          </Button>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass rounded-xl p-6 animate-pulse">
              <div className="w-12 h-12 rounded-xl bg-muted mb-4" />
              <div className="h-6 bg-muted rounded w-20 mb-2" />
              <div className="h-4 bg-muted rounded w-24" />
            </div>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      {!isLoading && !error && (
        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Content Grid */}
      {!isLoading && !error && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">فعالیت‌های اخیر</h2>
            {data?.recentActivity && data.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {data.recentActivity.map((activity, index) => (
                  <div key={index} className="flex gap-4 text-sm">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'project' ? 'bg-sky-500 dark:bg-blue-400' :
                      activity.type === 'payment' ? 'bg-green-500' : 'bg-sky-500 dark:bg-cyan-400'
                    }`} />
                    <div className="flex-1">
                      <p className="text-foreground/80">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.date ? new Date(activity.date).toLocaleDateString('fa-IR') : '-'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                فعالیتی ثبت نشده است
              </div>
            )}
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">دسترسی سریع</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/dashboard/projects" className="glass rounded-xl p-4 hover:bg-muted/50 transition-colors text-center">
                <FolderKanban className="w-6 h-6 mx-auto mb-2 text-sky-500 dark:text-cyan-400" />
                <span className="text-sm">پروژه‌ها</span>
              </Link>
              <Link href="/dashboard/support" className="glass rounded-xl p-4 hover:bg-muted/50 transition-colors text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-sky-500 dark:text-cyan-400" />
                <span className="text-sm">پشتیبانی</span>
              </Link>
              <Link href="/dashboard/profile" className="glass rounded-xl p-4 hover:bg-muted/50 transition-colors text-center">
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-sky-500 dark:text-cyan-400" />
                <span className="text-sm">پروفایل</span>
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
