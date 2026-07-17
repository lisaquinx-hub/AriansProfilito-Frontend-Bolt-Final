'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { adminNotificationsService } from '@/services/admin/NotificationsService';
import { notificationsService } from '@/services/NotificationsService';
import { Notification } from '@/types/api';

interface NotificationDropdownProps {
  isAdmin?: boolean;
}

// NotificationType: Info=1, Success=2, Warning=3, Error=4
function getNotificationIcon(type?: number) {
  switch (type) {
    case 2: return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case 3: return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    case 4: return <AlertCircle className="w-4 h-4 text-red-500" />;
    default: return <Info className="w-4 h-4 text-sky-500 dark:text-cyan-400" />;
  }
}

export function NotificationDropdown({ isAdmin = false }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let data: Notification[] = [];
      if (isAdmin) {
        data = await adminNotificationsService.getAll();
      } else {
        data = await notificationsService.getAll();
      }
      setNotifications(data);
    } catch {
      setError('خطا در دریافت اعلان‌ها');
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!isOpen) return;
    void fetchNotifications();
  }, [fetchNotifications, isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full hover:bg-muted transition-colors"
        aria-label="اعلان‌ها"
      >
        <Bell className="w-5 h-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-sky-500 dark:bg-cyan-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 99 ? '۹۹+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 z-50 mt-2 w-[min(24rem,calc(100vw-2rem))]"
          >
            <div className="overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl dark:border-white/10 dark:bg-[#0f1115]">
              <div className="flex items-center justify-between p-4 border-b border-border dark:border-white/5">
                <h3 className="text-sm font-semibold">اعلان‌ها</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <span className="text-xs text-muted-foreground">{unreadCount} خوانده‌نشده</span>
                  )}
                  <button type="button" onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-muted transition-colors" aria-label="بستن اعلان‌ها">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {isLoading && (
                  <div className="p-4 space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-muted animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
                          <div className="h-2 bg-muted animate-pulse rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {error && (
                  <div className="p-8 text-center">
                    <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">{error}</p>
                    <button onClick={fetchNotifications} className="mt-3 text-xs text-sky-500 dark:text-cyan-400 hover:underline">تلاش دوباره</button>
                  </div>
                )}

                {!isLoading && !error && notifications.length === 0 && (
                  <div className="p-8 text-center">
                    <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground">اعلانی موجود نیست</p>
                  </div>
                )}

                {!isLoading && !error && notifications.length > 0 && (
                  <div className="divide-y divide-border dark:divide-white/5">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          'flex gap-3 p-4',
                          !notification.isRead && 'bg-sky-500/5 dark:bg-cyan-500/5'
                        )}
                      >
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className={cn('text-sm truncate', !notification.isRead ? 'font-semibold' : 'font-medium')}>
                              {notification.title || '-'}
                            </span>
                            {!notification.isRead && (
                              <span className="w-2 h-2 rounded-full bg-sky-500 dark:bg-cyan-500 flex-shrink-0" />
                            )}
                          </div>
                          {notification.message && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                          )}
                          {notification.createdAt && (
                            <p className="text-xs text-muted-foreground/60 mt-1">
                              {new Date(notification.createdAt).toLocaleDateString('fa-IR')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Link
                href={isAdmin ? '/dashboard/admin/notifications' : '/dashboard/notifications'}
                onClick={() => setIsOpen(false)}
                className="block p-3 text-center text-sm text-sky-500 dark:text-cyan-400 border-t border-border hover:bg-muted/30 transition-colors"
              >
                مشاهده همه اعلان‌ها
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
