'use client';

import { useEffect, useState } from 'react';
import { Bell, RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { adminNotificationsService, CreateNotificationDto } from '@/services/admin/NotificationsService';
import { Notification } from '@/types/api';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/services/api';

export default function AdminNotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

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
      setItems(prev => prev.filter(i => i.id !== deleteId));
      setDeleteId(null);
      toast.success('اعلان با موفقیت حذف شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
    setIsDeleting(false);
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    const payload: CreateNotificationDto = {
      userId: String(data.userId || ''),
      title: String(data.title || '').trim(),
      message: String(data.message || '').trim(),
      type: Number(data.type) || 1,
      isRead: Boolean(data.isRead),
    };
    const created = await adminNotificationsService.create(payload);
    if (created) {
      setItems(prev => [created, ...prev]);
      toast.success('اعلان با موفقیت ایجاد شد');
    }
  };

  const fields: FormField[] = [
    { key: 'userId', label: 'شناسه کاربر (UUID)', type: 'text', required: true },
    { key: 'title', label: 'عنوان', type: 'text', required: true },
    { key: 'message', label: 'پیام', type: 'textarea', required: true, fullWidth: true },
    {
      key: 'type',
      label: 'نوع',
      type: 'select',
      options: [
        { value: '1', label: 'اطلاع (Info)' },
        { value: '2', label: 'موفقیت (Success)' },
        { value: '3', label: 'هشدار (Warning)' },
        { value: '4', label: 'خطا (Error)' },
      ],
    },
    { key: 'isRead', label: 'خوانده شده', type: 'switch' },
  ];

  const columns = [
    { key: 'title', label: 'عنوان' },
    {
      key: 'userFullName',
      label: 'کاربر',
      render: (item: Notification) => item.userFullName || '-',
    },
    {
      key: 'message',
      label: 'پیام',
      render: (item: Notification) => (
        <div className="max-w-xs truncate text-sm">{item.message}</div>
      ),
    },
    {
      key: 'isRead',
      label: 'وضعیت',
      render: (item: Notification) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          item.isRead ? 'bg-gray-500/10 text-gray-400' : 'bg-green-500/10 text-green-500'
        }`}>
          {item.isRead ? 'خوانده شده' : 'جدید'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'تاریخ',
      render: (item: Notification) =>
        item.createdAt ? new Date(item.createdAt).toLocaleDateString('fa-IR') : '-',
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
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="w-4 h-4 ml-1" />
            بروزرسانی
          </Button>
          <Button size="sm" className="btn-primary" onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 ml-1" />
            ایجاد اعلان
          </Button>
        </div>
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

      <EntityFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title="ایجاد اعلان جدید"
        fields={fields}
        onSubmit={handleSubmit}
        submitLabel="ایجاد اعلان"
      />
    </div>
  );
}
