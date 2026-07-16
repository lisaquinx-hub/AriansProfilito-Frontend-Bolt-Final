'use client';

import { useEffect, useState } from 'react';
import { Bell, CheckCheck, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { ViewDetailModal } from '@/components/admin/ViewDetailModal';
import { notificationsService } from '@/services/NotificationsService';
import { Notification } from '@/types/api';
import { getApiErrorMessage } from '@/services/api';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewItem, setViewItem] = useState<Notification | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setItems(await notificationsService.getAll());
    setIsLoading(false);
  };

  useEffect(() => { void fetchData(); }, []);

  const handleView = async (item: Notification) => {
    setViewItem(item);
    setViewError(null);
    setViewLoading(true);
    try {
      const detail = await notificationsService.getById(item.id);
      if (detail) setViewItem(detail);
    } catch (error) {
      setViewError(getApiErrorMessage(error));
    } finally {
      setViewLoading(false);
    }
  };

  const markRead = async (item: Notification) => {
    try {
      await notificationsService.markAsRead(item.id);
      setItems((current) => current.map((notification) => notification.id === item.id ? { ...notification, isRead: true } : notification));
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const markAllRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setItems((current) => current.map((item) => ({ ...item, isRead: true })));
      toast.success('همه اعلان‌ها خوانده شدند');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await notificationsService.delete(deleteId);
      setItems((current) => current.filter((item) => item.id !== deleteId));
      setDeleteId(null);
      toast.success('اعلان حذف شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    { key: 'title', label: 'عنوان' },
    { key: 'message', label: 'پیام', render: (item: Notification) => <span className="line-clamp-1 max-w-sm">{item.message}</span> },
    { key: 'isRead', label: 'وضعیت', render: (item: Notification) => item.isRead ? 'خوانده‌شده' : 'خوانده‌نشده' },
    { key: 'createdAt', label: 'تاریخ', render: (item: Notification) => new Date(item.createdAt).toLocaleDateString('fa-IR') },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Bell className="w-7 h-7" />اعلان‌ها</h1>
          <p className="text-muted-foreground mt-1">{items.length} اعلان</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => void fetchData()}><RefreshCw className="w-4 h-4 ml-1" />به‌روزرسانی</Button>
          <Button variant="outline" size="sm" onClick={() => void markAllRead()}><CheckCheck className="w-4 h-4 ml-1" />خواندن همه</Button>
        </div>
      </div>

      <Card className="glass"><CardContent className="p-6">
        <DataTable
          data={items}
          columns={columns}
          loading={isLoading}
          onView={handleView}
          onDelete={(item) => setDeleteId(item.id)}
          extraActions={[{ label: 'علامت‌گذاری به‌عنوان خوانده‌شده', icon: <CheckCheck className="w-4 h-4 ml-2" />, onClick: (item) => void markRead(item) }]}
          emptyMessage="اعلانی یافت نشد"
        />
      </CardContent></Card>

      <ConfirmDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)} title="حذف اعلان" description="آیا از حذف این اعلان اطمینان دارید؟" onConfirm={() => void handleDelete()} loading={isDeleting} />
      <ViewDetailModal
        open={!!viewItem || viewLoading}
        onClose={() => { setViewItem(null); setViewError(null); setViewLoading(false); }}
        title="جزئیات اعلان"
        loading={viewLoading}
        error={viewError}
        fields={viewItem ? [
          { label: 'شناسه', value: viewItem.id },
          { label: 'عنوان', value: viewItem.title },
          { label: 'پیام', value: viewItem.message, fullWidth: true },
          { label: 'وضعیت', value: viewItem.isRead ? 'خوانده‌شده' : 'خوانده‌نشده' },
          { label: 'تاریخ', value: new Date(viewItem.createdAt).toLocaleString('fa-IR') },
        ] : []}
      />
    </div>
  );
}
