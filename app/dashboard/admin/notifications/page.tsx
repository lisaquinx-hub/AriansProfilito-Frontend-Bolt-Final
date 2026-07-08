'use client';

import { useEffect, useState } from 'react';
import { Bell, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { adminNotificationsService } from '@/services/admin/NotificationsService';
import { Notification } from '@/types/api';

export default function AdminNotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await adminNotificationsService.getAll();
    setItems(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await adminNotificationsService.delete(deleteId);
      setItems(items.filter(i => i.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete:', error);
    }
    setIsDeleting(false);
  };

  const columns = [
    { key: 'title', label: 'عنوان' },
    { key: 'message', label: 'پیام', render: (item: Notification) => (
      <div className="max-w-xs truncate text-sm">{item.message}</div>
    )},
    {
      key: 'isRead',
      label: 'وضعیت',
      render: (item: Notification) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          item.isRead ? 'bg-gray-500/10 text-gray-500' : 'bg-green-500/10 text-green-500'
        }`}>
          {item.isRead ? 'خوانده شده' : 'جدید'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'تاریخ',
      render: (item: Notification) => new Date(item.createdAt).toLocaleDateString('fa-IR'),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-6 h-6" />
            مدیریت اعلان‌ها
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} اعلان</p>
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
            onDelete={(item) => setDeleteId(item.id)}
            emptyMessage="اعلانی یافت نشد"
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف اعلان"
        description="آیا از حذف این اعلان اطمینان دارید؟"
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </div>
  );
}
