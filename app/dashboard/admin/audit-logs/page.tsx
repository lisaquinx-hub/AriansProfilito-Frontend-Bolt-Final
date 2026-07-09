'use client';

import { useEffect, useState } from 'react';
import { ClipboardList, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { ViewDetailModal } from '@/components/admin/ViewDetailModal';
import { adminAuditLogsService } from '@/services/admin/AuditLogsService';
import { AuditLog } from '@/types/api';
import { getApiErrorMessage } from '@/services/api';

export default function AdminAuditLogsPage() {
  const [items, setItems] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [viewItem, setViewItem] = useState<AuditLog | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await adminAuditLogsService.getAll({ take: 100 });
    setItems(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        <Button variant="outline" size="sm" onClick={fetchData}>
          <RefreshCw className="w-4 h-4 ml-1" />
          بروزرسانی
        </Button>
      </div>

      <Card className="glass">
        <CardContent className="p-6">
          <DataTable
            data={items}
            columns={columns}
            loading={isLoading}
            onView={handleView}
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
