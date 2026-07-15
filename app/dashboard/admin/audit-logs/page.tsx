'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClipboardList, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { ViewDetailModal } from '@/components/admin/ViewDetailModal';
import { adminAuditLogsService } from '@/services/admin/AuditLogsService';
import { AuditLog } from '@/types/api';
import { getApiErrorMessage } from '@/services/api';
import { UserIdFilter } from '@/components/admin/UserIdFilter';
import { isValidUuid } from '@/lib/identifiers';

export default function AdminAuditLogsPage() {
  const router = useRouter();
  const [items, setItems] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userIdQuery, setUserIdQuery] = useState('');
  const [filterError, setFilterError] = useState<string | null>(null);

  const [viewItem, setViewItem] = useState<AuditLog | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  const fetchData = async (userId?: string) => {
    setIsLoading(true);
    setFilterError(null);
    const data = await adminAuditLogsService.getAll({
      take: 100,
      userId: userId || undefined,
    });
    setItems(data);
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
    void fetchData(requestedUserId || undefined);
    // Query parameters are read once when this page is opened.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUserIdSearch = () => {
    const userId = userIdQuery.trim();
    if (!isValidUuid(userId)) {
      setFilterError('شناسه کاربر باید یک UUID معتبر باشد');
      return;
    }
    router.replace(`/dashboard/admin/audit-logs?userId=${encodeURIComponent(userId)}`, {
      scroll: false,
    });
    void fetchData(userId);
  };

  const handleClearFilter = () => {
    setUserIdQuery('');
    setFilterError(null);
    router.replace('/dashboard/admin/audit-logs', { scroll: false });
    void fetchData();
  };

  const handleView = async (item: AuditLog) => {
    setViewItem({ ...item });
    setViewError(null);
    setViewLoading(true);
    try {
      const detail = await adminAuditLogsService.getById(item.id);
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
      render: (item: AuditLog) => item.userFullName || item.userEmail || 'سیستم',
    },
    { key: 'action', label: 'عملیات' },
    { key: 'entityName', label: 'موجودیت' },
    { key: 'entityId', label: 'شناسه', render: (item: AuditLog) => item.entityId || '-' },
    {
      key: 'createdAt',
      label: 'تاریخ',
      render: (item: AuditLog) => new Date(item.createdAt).toLocaleString('fa-IR'),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="w-6 h-6" />
            لاگ ممیزی
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} رکورد</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => userIdQuery.trim() ? handleUserIdSearch() : void fetchData()}
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
              تغییرات ثبت‌شده توسط یک کاربر مشخص را نمایش می‌دهد.
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
            data={items}
            columns={columns}
            loading={isLoading}
            onView={handleView}
            idLookup={{
              entityLabel: 'لاگ ممیزی',
              getById: (id) => adminAuditLogsService.getById(id),
            }}
            emptyMessage="رکوردی یافت نشد"
          />
        </CardContent>
      </Card>

      <ViewDetailModal
        open={!!viewItem || viewLoading}
        onClose={() => { setViewItem(null); setViewError(null); setViewLoading(false); }}
        title="جزئیات لاگ ممیزی"
        loading={viewLoading}
        error={viewError}
        fields={viewItem ? [
          { label: 'شناسه', value: viewItem.id },
          { label: 'شناسه کاربر', value: viewItem.userId || '-' },
          { label: 'کاربر', value: viewItem.userFullName || viewItem.userEmail || 'سیستم' },
          { label: 'ایمیل کاربر', value: viewItem.userEmail || '-' },
          { label: 'عملیات', value: viewItem.action },
          { label: 'موجودیت', value: viewItem.entityName || '-' },
          { label: 'شناسه موجودیت', value: viewItem.entityId || '-' },
          { label: 'مقادیر قدیم', value: viewItem.oldValues ? JSON.stringify(viewItem.oldValues, null, 2) : '-', fullWidth: true },
          { label: 'مقادیر جدید', value: viewItem.newValues ? JSON.stringify(viewItem.newValues, null, 2) : '-', fullWidth: true },
          { label: 'آدرس IP', value: viewItem.ipAddress || '-' },
          { label: 'User Agent', value: viewItem.userAgent || '-', fullWidth: true },
          { label: 'تاریخ ایجاد', value: viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleString('fa-IR') : '-' },
        ] : []}
      />
    </div>
  );
}
