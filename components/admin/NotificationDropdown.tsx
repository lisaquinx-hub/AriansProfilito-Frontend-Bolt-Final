'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { adminNotificationsService } from '@/services/admin/NotificationsService';
import { Notification } from '@/types/api';

interface NotificationDropdownProps {
  isAdmin?: boolean;
}

export function NotificationDropdown({ isAdmin: _isAdmin = false }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminNotificationsService.getAll();
      setNotifications(data);
    } catch (err) {
      setError('خطا در دریافت اعلان‌ها');
      console.error('Notification fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && notifications.length === 0 && !isLoading && !error) {
      fetchNotifications();
    }
  }, [isOpen]);

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

  const getIcon = (type?: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-sky-500 dark:text-cyan-400" />;
    }
  };

  const handleClickNotification = (notification: Notification) => {
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-muted transition-colors"
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
            className="absolute left-0 mt-2 w-80 sm:w-96 z-50"
          >
            <div className="glass rounded-2xl shadow-xl border border-border dark:border-white/5 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border dark:border-white/5">
                <h3 className="text-sm font-semibold">اعلان‌ها</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {unreadCount} خوانده‌نشده
                    </span>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Body */}
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
                    <button
                      onClick={fetchNotifications}
                      className="mt-3 text-xs text-sky-500 dark:text-cyan-400 hover:underline"
                    >
                      تلاش مجدد
                    </button>
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
                      <button
                        key={notification.id}
                        onClick={() => handleClickNotification(notification)}
                        className={cn(
                          'w-full flex gap-3 p-4 text-right hover:bg-muted/50 transition-colors',
                          !notification.isRead && 'bg-sky-500/5 dark:bg-cyan-500/5'
                        )}
                      >
                        <div className="flex-shrink-0 mt-1">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className={cn(
                              'text-sm truncate',
                              !notification.isRead ? 'font-semibold' : 'font-medium'
                            )}>
                              {notification.title || '-'}
                            </span>
                            {!notification.isRead && (
                              <span className="w-2 h-2 rounded-full bg-sky-500 dark:bg-cyan-500 flex-shrink-0" />
                            )}
                          </div>
                          {notification.message && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                          )}
                          {notification.createdAt && (
                            <p className="text-[10px] text-muted-foreground mt-1">
                              {new Date(notification.createdAt).toLocaleDateString('fa-IR')}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {!isLoading && !error && notifications.length > 0 && (
                <div className="p-3 border-t border-border dark:border-white/5 text-center">
                  {/* TODO: mark-as-read endpoint — implement when backend supports it */}
                  <span className="text-xs text-muted-foreground">
                    {notifications.length} اعلان
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
