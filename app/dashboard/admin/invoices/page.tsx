'use client';

import { useEffect, useState } from 'react';
import { Receipt, RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { adminInvoicesService } from '@/services/admin/InvoicesService';
import { Invoice } from '@/types/api';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/services/api';

export default function AdminInvoicesPage() {
  const [items, setItems] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Invoice | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await adminInvoicesService.getAll();
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
      await adminInvoicesService.delete(deleteId);
      setItems(items.filter(i => i.id !== deleteId));
      setDeleteId(null);
      toast.success('فاکتور با موفقیت حذف شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
    setIsDeleting(false);
  };

  const handleEdit = (item: Invoice) => {
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
        tax: data.tax ? Number(data.tax) : undefined,
        totalAmount: data.totalAmount ? Number(data.totalAmount) : undefined,
      };
      if (editingItem) {
        await adminInvoicesService.update(editingItem.id, submitData as Partial<Invoice>);
        toast.success('فاکتور با موفقیت ویرایش شد');
      } else {
        await adminInvoicesService.create(submitData as Partial<Invoice>);
        toast.success('فاکتور با موفقیت ایجاد شد');
      }
      fetchData();
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  };

  const fields: FormField[] = [
    { key: 'invoiceNumber', label: 'شماره فاکتور', required: true },
    { key: 'userId', label: 'شناسه کاربر', type: 'text' },
    { key: 'projectId', label: 'شناسه پروژه', type: 'text' },
    { key: 'amount', label: 'مبلغ', type: 'number', required: true },
    { key: 'tax', label: 'مالیات', type: 'number' },
    { key: 'totalAmount', label: 'مبلغ کل', type: 'number' },
    {
      key: 'status',
      label: 'وضعیت',
      type: 'select',
      required: true,
      options: [
        { value: 'pending', label: 'در انتظار' },
        { value: 'paid', label: 'پرداخت شده' },
        { value: 'cancelled', label: 'لغو شده' },
        { value: 'overdue', label: 'سررسید گذشته' },
      ],
    },
    { key: 'dueDate', label: 'تاریخ سررسید', type: 'date' },
    { key: 'notes', label: 'یادداشت', type: 'textarea', fullWidth: true },
  ];

  const columns = [
    { key: 'invoiceNumber', label: 'شماره فاکتور' },
    { key: 'userName', label: 'کاربر', render: (item: Invoice) => item.userName || '-' },
    {
      key: 'totalAmount',
      label: 'مبلغ',
      render: (item: Invoice) => item.totalAmount?.toLocaleString() || 0,
    },
    {
      key: 'status',
      label: 'وضعیت',
      render: (item: Invoice) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          item.status === 'paid' ? 'bg-green-500/10 text-green-500' :
          item.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
          item.status === 'overdue' ? 'bg-red-500/10 text-red-500' :
          'bg-gray-500/10 text-gray-500'
        }`}>
          {item.status === 'paid' ? 'پرداخت شده' : item.status === 'pending' ? 'در انتظار' : item.status === 'overdue' ? 'سررسید گذشته' : 'لغو شده'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'تاریخ',
      render: (item: Invoice) => item.createdAt ? new Date(item.createdAt).toLocaleDateString('fa-IR') : '-',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Receipt className="w-6 h-6" />
            مدیریت فاکتورها
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} فاکتور</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="w-4 h-4 ml-1" />
            بروزرسانی
          </Button>
          <Button size="sm" className="btn-primary" onClick={handleCreate}>
            <Plus className="w-4 h-4 ml-1" />
            ایجاد فاکتور
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
            emptyMessage="فاکتوری یافت نشد"
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف فاکتور"
        description="آیا از حذف این فاکتور اطمینان دارید؟"
        onConfirm={handleDelete}
        loading={isDeleting}
      />

      <EntityFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={editingItem ? 'ویرایش فاکتور' : 'ایجاد فاکتور جدید'}
        fields={fields}
        initialValues={editingItem ? { ...editingItem } as Record<string, unknown> : undefined}
        onSubmit={handleSubmit}
        submitLabel={editingItem ? 'ذخیره تغییرات' : 'ایجاد فاکتور'}
      />
    </div>
  );
}
