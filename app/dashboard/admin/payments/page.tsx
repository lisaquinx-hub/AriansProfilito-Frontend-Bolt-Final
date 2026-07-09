'use client';

import { useEffect, useState } from 'react';
import { CreditCard, RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { adminPaymentsService } from '@/services/admin/PaymentsService';
import { Payment } from '@/types/api';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/services/api';

export default function AdminPaymentsPage() {
  const [items, setItems] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Payment | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await adminPaymentsService.getAll();
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
      await adminPaymentsService.delete(deleteId);
      setItems(items.filter(i => i.id !== deleteId));
      setDeleteId(null);
      toast.success('پرداخت با موفقیت حذف شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
    setIsDeleting(false);
  };

  const handleEdit = (item: Payment) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      const submitData = {
        ...data,
        amount: data.amount ? Number(data.amount) : undefined,
      };
      if (editingItem) {
        await adminPaymentsService.update(editingItem.id, submitData as Partial<Payment>);
        toast.success('پرداخت با موفقیت ویرایش شد');
      } else {
        await adminPaymentsService.create(submitData as Partial<Payment>);
        toast.success('پرداخت با موفقیت ایجاد شد');
      }
      fetchData();
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  };

  const fields: FormField[] = [
    { key: 'invoiceId', label: 'شناسه فاکتور', type: 'text' },
    { key: 'userId', label: 'شناسه کاربر', type: 'text' },
    { key: 'amount', label: 'مبلغ', type: 'number', required: true },
    {
      key: 'method',
      label: 'روش پرداخت',
      type: 'select',
      required: true,
      options: [
        { value: 'card', label: 'کارت' },
        { value: 'bank_transfer', label: 'انتقال بانکی' },
        { value: 'online', label: 'آنلاین' },
        { value: 'cash', label: 'نقدی' },
      ],
    },
    { key: 'transactionId', label: 'شناسه تراکنش', type: 'text' },
    {
      key: 'status',
      label: 'وضعیت',
      type: 'select',
      required: true,
      options: [
        { value: 'pending', label: 'در انتظار' },
        { value: 'completed', label: 'موفق' },
        { value: 'failed', label: 'ناموفق' },
        { value: 'refunded', label: 'بازگشت داده شده' },
      ],
    },
    { key: 'notes', label: 'یادداشت', type: 'textarea', fullWidth: true },
  ];

  const columns = [
    {
      key: 'amount',
      label: 'مبلغ',
      render: (item: Payment) => item.amount?.toLocaleString() || 0,
    },
    { key: 'method', label: 'روش پرداخت' },
    { key: 'userName', label: 'کاربر', render: (item: Payment) => item.userName || '-' },
    {
      key: 'status',
      label: 'وضعیت',
      render: (item: Payment) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          item.status === 'completed' ? 'bg-green-500/10 text-green-500' :
          item.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
          item.status === 'refunded' ? 'bg-blue-500/10 text-blue-500' :
          'bg-red-500/10 text-red-500'
        }`}>
          {item.status === 'completed' ? 'موفق' : item.status === 'pending' ? 'در انتظار' : item.status === 'refunded' ? 'بازگشت داده شده' : 'ناموفق'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'تاریخ',
      render: (item: Payment) => item.createdAt ? new Date(item.createdAt).toLocaleDateString('fa-IR') : '-',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            مدیریت پرداخت‌ها
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} پرداخت</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="w-4 h-4 ml-1" />
            بروزرسانی
          </Button>
          <Button size="sm" className="btn-primary" onClick={handleCreate}>
            <Plus className="w-4 h-4 ml-1" />
            ایجاد پرداخت
          </Button>
        </div>
      </div>

      <Card className="glass">
        <CardContent className="p-6">
          <DataTable
            data={items}
            columns={columns}
            loading={isLoading}
            onEdit={handleEdit}
            onDelete={(item) => setDeleteId(item.id)}
            emptyMessage="پرداختی یافت نشد"
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف پرداخت"
        description="آیا از حذف این رکورد اطمینان دارید؟"
        onConfirm={handleDelete}
        loading={isDeleting}
      />

      <EntityFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={editingItem ? 'ویرایش پرداخت' : 'ایجاد پرداخت جدید'}
        fields={fields}
        initialValues={editingItem ? { ...editingItem } as Record<string, unknown> : undefined}
        onSubmit={handleSubmit}
        submitLabel={editingItem ? 'ذخیره تغییرات' : 'ایجاد پرداخت'}
      />
    </div>
  );
}
