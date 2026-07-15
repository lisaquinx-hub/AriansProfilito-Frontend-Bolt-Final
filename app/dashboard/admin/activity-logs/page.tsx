'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { ViewDetailModal } from '@/components/admin/ViewDetailModal';
import { adminActivityLogsService } from '@/services/admin/ActivityLogsService';
import { ActivityLog } from '@/types/api';
import { getApiErrorMessage } from '@/services/api';
import { UserIdFilter } from '@/components/admin/UserIdFilter';
import { isValidUuid } from '@/lib/identifiers';

export default function AdminActivityLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userIdQuery, setUserIdQuery] = useState('');
  const [filterError, setFilterError] = useState<string | null>(null);

  const [viewItem, setViewItem] = useState<ActivityLog | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  const fetchLogs = async (userId?: string) => {
    setIsLoading(true);
    setFilterError(null);
    const data = await adminActivityLogsService.getAll({
      take: 100,
      userId: userId || undefined,
    });
    setLogs(data);
    setIsLoading(false);
  };

  useEffect(() => {
    const requestedUserId = new URLSearchParams(window.location.search)
      .get('userId')
      ?.trim() || '';
    setUserIdQuery(requestedUserId);
    if (requestedUserId && !isValidUuid(requestedUserId)) {
      setFilterError('شناسه کاربر باید یک UUID معتبر باشد');
      setIsLoading(false);
      return;
    }
    void fetchLogs(requestedUserId || undefined);
    // Query parameters are read once when this page is opened.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUserIdSearch = () => {
    const userId = userIdQuery.trim();
    if (!isValidUuid(userId)) {
      setFilterError('شناسه کاربر باید یک UUID معتبر باشد');
      return;
    }
    router.replace(`/dashboard/admin/activity-logs?userId=${encodeURIComponent(userId)}`, {
      scroll: false,
    });
    void fetchLogs(userId);
  };

  const handleClearFilter = () => {
    setUserIdQuery('');
    setFilterError(null);
    router.replace('/dashboard/admin/activity-logs', { scroll: false });
    void fetchLogs();
  };

  const handleView = async (item: ActivityLog) => {
    setViewItem({ ...item });
    setViewError(null);
    setViewLoading(true);
    try {
      const detail = await adminActivityLogsService.getById(item.id);
      if (detail) setViewItem(detail);
    } catch (err) {
      setViewError(getApiErrorMessage(err));
    } finally {
      setViewLoading(false);
    }
  };

  const columns = [
    {
      key: 'userFullName',
      label: 'کاربر',
      render: (log: ActivityLog) => log.userFullName || log.userEmail || 'سیستم',
    },
    { key: 'activity', label: 'فعالیت' },
    {
      key: 'description',
      label: 'توضیحات',
      render: (log: ActivityLog) => (
        <div className="max-w-xs truncate text-sm text-muted-foreground">
          {log.description || '-'}
        </div>
      ),
    },
    {
      key: 'ipAddress',
      label: 'IP',
      render: (log: ActivityLog) => log.ipAddress || '-',
    },
    {
      key: 'createdAt',
      label: 'تاریخ',
      render: (log: ActivityLog) => new Date(log.createdAt).toLocaleString('fa-IR'),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="w-6 h-6" />
            لاگ فعالیت‌ها
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {logs.length} رکورد
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => userIdQuery.trim() ? handleUserIdSearch() : void fetchLogs()}
        >
          <RefreshCw className="w-4 h-4 ml-1" />
          بروزرسانی
        </Button>
      </div>

      <Card className="glass">
        <CardContent className="p-6">
          <div className="mb-4">
            <h2 className="font-semibold">جستجو بر اساس شناسه کاربر</h2>
            <p className="text-sm text-muted-foreground mt-1">
              فعالیت‌های ثبت‌شده برای یک کاربر مشخص را نمایش می‌دهد.
            </p>
          </div>
          <UserIdFilter
            value={userIdQuery}
            onChange={setUserIdQuery}
            onSearch={handleUserIdSearch}
            onClear={handleClearFilter}
            loading={isLoading}
            error={filterError}
          />
        </CardContent>
      </Card>

      <Card className="glass">
        <CardContent className="p-6">
          <DataTable
            data={logs}
            columns={columns}
            loading={isLoading}
            onView={handleView}
            emptyMessage="لاگی یافت نشد"
          />
        </CardContent>
      </Card>

      <ViewDetailModal
        open={!!viewItem || viewLoading}
        onClose={() => { setViewItem(null); setViewError(null); setViewLoading(false); }}
        title="جزئیات لاگ فعالیت"
        loading={viewLoading}
        error={viewError}
        fields={viewItem ? [
          { label: 'شناسه', value: viewItem.id },
          { label: 'شناسه کاربر', value: viewItem.userId || '-' },
          { label: 'کاربر', value: viewItem.userFullName || viewItem.userEmail || 'سیستم' },
          { label: 'ایمیل کاربر', value: viewItem.userEmail || '-' },
          { label: 'فعالیت', value: viewItem.activity },
          { label: 'توضیحات', value: viewItem.description || '-', fullWidth: true },
          { label: 'آدرس IP', value: viewItem.ipAddress || '-' },
          { label: 'User Agent', value: viewItem.userAgent || '-', fullWidth: true },
          { label: 'تاریخ ایجاد', value: viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleString('fa-IR') : '-' },
        ] : []}
      />
    </div>
  );
}
