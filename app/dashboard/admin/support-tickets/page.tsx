'use client';

import { useEffect, useState } from 'react';
import { HeadphonesIcon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { adminSupportTicketsService } from '@/services/admin/SupportTicketsService';
import { SupportTicket } from '@/types/api';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/services/api';

export default function AdminSupportTicketsPage() {
  const [items, setItems] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SupportTicket | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await adminSupportTicketsService.getAll();
    setItems(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (item: SupportTicket) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      if (!editingItem) {
        throw new Error('تیکت قابل ایجاد نیست');
      }
      await adminSupportTicketsService.update(editingItem.id, data as Partial<SupportTicket>);
      toast.success('تیکت با موفقیت ویرایش شد');
      fetchData();
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  };

  const fields: FormField[] = [
    { key: 'subject', label: 'موضوع', required: true },
    { key: 'description', label: 'توضیحات', type: 'textarea', required: true },
    {
      key: 'status',
      label: 'وضعیت',
      type: 'select',
      options: [
        { value: 'open', label: 'باز' },
        { value: 'in_progress', label: 'در حال بررسی' },
        { value: 'resolved', label: 'حل شده' },
        { value: 'closed', label: 'بسته' },
      ],
    },
    {
      key: 'priority',
      label: 'اولویت',
      type: 'select',
      options: [
        { value: 'low', label: 'کم' },
        { value: 'normal', label: 'عادی' },
        { value: 'high', label: 'زیاد' },
        { value: 'urgent', label: 'فوری' },
      ],
    },
    { key: 'assignedTo', label: 'محول شده به', type: 'text' },
  ];

  const columns = [
    { key: 'subject', label: 'موضوع' },
    { key: 'userName', label: 'کاربر', render: (item: SupportTicket) => item.userName || '-' },
    {
      key: 'status',
      label: 'وضعیت',
      render: (item: SupportTicket) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          item.status === 'open' ? 'bg-green-500/10 text-green-500' :
          item.status === 'in_progress' ? 'bg-yellow-500/10 text-yellow-500' :
          item.status === 'resolved' ? 'bg-blue-500/10 text-blue-500' :
          'bg-gray-500/10 text-gray-500'
        }`}>
          {item.status === 'open' ? 'باز' : item.status === 'in_progress' ? 'در حال بررسی' : item.status === 'resolved' ? 'حل شده' : 'بسته'}
        </span>
      ),
    },
    {
      key: 'priority',
      label: 'اولویت',
      render: (item: SupportTicket) => item.priority || '-',
    },
    {
      key: 'createdAt',
      label: 'تاریخ',
      render: (item: SupportTicket) => new Date(item.createdAt).toLocaleDateString('fa-IR'),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <HeadphonesIcon className="w-6 h-6" />
            مدیریت تیکت‌های پشتیبانی
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} تیکت</p>
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
            onEdit={handleEdit}
            emptyMessage="تیکتی یافت نشد"
          />
        </CardContent>
      </Card>

      <EntityFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={editingItem ? 'ویرایش تیکت' : 'ایجاد تیکت جدید'}
        fields={fields}
        initialValues={editingItem ? { ...editingItem } as Record<string, unknown> : undefined}
        onSubmit={handleSubmit}
        submitLabel={editingItem ? 'ذخیره تغییرات' : 'ایجاد تیکت'}
      />
    </div>
  );
}
