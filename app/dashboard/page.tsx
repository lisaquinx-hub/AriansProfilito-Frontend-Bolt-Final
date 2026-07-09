'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, CreditCard, TrendingUp, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import { ApiResponse } from '@/lib/api-utils';
import { Project, Invoice } from '@/types/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [projRes, invRes] = await Promise.allSettled([
          api.get<ApiResponse<Project[]>>('/projects/my'),
          api.get<ApiResponse<Invoice[]>>('/invoices/my'),
        ]);
        if (projRes.status === 'fulfilled') setProjects(projRes.value.data.data || []);
        if (invRes.status === 'fulfilled') setInvoices(invRes.value.data.data || []);
      } catch {
        // silently fail - no backend dashboard endpoint
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeProjects = projects.filter(p => p.status === 2).length;
  const displayName = user?.fullName || user?.email || 'کاربر';

  const stats = [
    { label: 'پروژه‌های فعال', value: activeProjects, icon: FolderKanban, color: 'from-sky-500 to-blue-600 dark:from-blue-500 dark:to-cyan-500' },
    { label: 'مجموع پروژه‌ها', value: projects.length, icon: TrendingUp, color: 'from-green-500 to-teal-500' },
    { label: 'فاکتورها', value: invoices.length, icon: CreditCard, color: 'from-sky-500 to-blue-600 dark:from-blue-500 dark:to-cyan-500' },
    { label: 'فاکتور منتظر پرداخت', value: invoices.filter(i => i.status === 1).length, icon: Clock, color: 'from-orange-500 to-yellow-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">داشبورد</h1>
          <p className="text-muted-foreground mt-1">خوش آمدید، {displayName}</p>
        </div>
        <Link href="/dashboard/projects">
          <Button className="btn-primary shadow-glow">مشاهده پروژه‌ها</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        </div>
      ) : (
        <>
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

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold mb-4">پروژه‌های اخیر</h2>
              {projects.length > 0 ? (
                <div className="space-y-3">
                  {projects.slice(0, 5).map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-sm p-3 rounded-lg bg-muted/30">
                      <span className="font-medium truncate max-w-[60%]">{p.title}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        p.status === 2 ? 'bg-sky-500/10 text-sky-500' :
                        p.status === 3 ? 'bg-green-500/10 text-green-500' :
                        'bg-gray-500/10 text-gray-400'
                      }`}>
                        {p.status === 1 ? 'در انتظار' : p.status === 2 ? 'در حال انجام' : p.status === 3 ? 'تکمیل' : 'لغو'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-6">پروژه‌ای یافت نشد</p>
              )}
            </motion.div>

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
        </>
      )}
    </div>
  );
}
