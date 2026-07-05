'use client';

import { motion } from 'framer-motion';
import { FolderKanban, CreditCard, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const stats = [
  { label: 'پروژه‌های فعال', value: '۴', icon: FolderKanban, color: 'from-sky-500 to-blue-600 dark:from-blue-500 dark:to-cyan-500' },
  { label: 'مجموع پروژه‌ها', value: '۱۲', icon: TrendingUp, color: 'from-green-500 to-teal-500' },
  { label: 'صورت‌حساب پرداختی', value: '۴۵,۰۰۰,۰۰۰', icon: CreditCard, color: 'from-purple-500 to-pink-500' },
  { label: 'تاریخ عضویت', value: '۱۴۰۴/۰۱/۱۵', icon: Clock, color: 'from-orange-500 to-yellow-500' },
];

const recentProjects = [
  { name: 'پلتفرم ابری نوا', status: 'در حال توسعه', progress: 75 },
  { name: 'کیف پول سپهر', status: 'در انتظار تأیید', progress: 30 },
  { name: 'دستیار هوشمند آوا', status: 'تکمیل شده', progress: 100 },
];

const activities = [
  { type: 'project', text: 'پروژه «نوا» به مرحله تست رسید', time: '۲ ساعت پیش' },
  { type: 'payment', text: 'پرداخت فاکتور شماره ۱۲۴ انجام شد', time: '۱ روز پیش' },
  { type: 'support', text: 'تیکت پشتیبانی شما پاسخ داده شد', time: '۲ روز پیش' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">داشبورد</h1>
          <p className="text-muted-foreground mt-1">به آریان‌لب خوش آمدید</p>
        </div>
        <Link href="/dashboard/projects">
          <Button className="btn-primary shadow-glow">
            ایجاد پروژه جدید
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
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

      {/* Content Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold mb-4">پروژه‌های اخیر</h2>
          <div className="space-y-4">
            {recentProjects.map((project, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">{project.name}</span>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    project.status === 'تکمیل شده' ? 'bg-green-500/20 text-green-500' :
                    project.status === 'در حال توسعه' ? 'bg-sky-500/20 text-sky-500 dark:bg-blue-500/20 dark:text-blue-400' :
                    'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-sky-500 to-blue-600 dark:from-blue-500 dark:to-cyan-500 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <Link href="/dashboard/projects" className="block mt-4 text-sm text-sky-500 dark:text-cyan-400 hover:text-sky-600 dark:hover:text-cyan-300">
            مشاهده همه پروژه‌ها
          </Link>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold mb-4">فعالیت‌های اخیر</h2>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex gap-4 text-sm">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'project' ? 'bg-sky-500 dark:bg-blue-400' :
                  activity.type === 'payment' ? 'bg-green-500' : 'bg-sky-500 dark:bg-cyan-400'
                }`} />
                <div className="flex-1">
                  <p className="text-foreground/80">{activity.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
