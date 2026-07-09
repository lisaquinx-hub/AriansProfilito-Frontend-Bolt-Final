'use client';

import { useEffect, useState } from 'react';
import { Receipt, RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { adminInvoicesService, CreateInvoiceDto, UpdateInvoiceDto } from '@/services/admin/InvoicesService';
import { Invoice } from '@/types/api';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/services/api';

// PaymentStatus: Pending=1, Paid=2, Failed=3, Refunded=4
const PAYMENT_STATUS_OPTIONS = [
  { value: '1', label: 'در انتظار' },
  { value: '2', label: 'پرداخت شده' },
  { value: '3', label: 'ناموفق' },
  { value: '4', label: 'بازپرداخت' },
];

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

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await adminInvoicesService.delete(deleteId);
      setItems(prev => prev.filter(i => i.id !== deleteId));
      setDeleteId(null);
      toast.success('فاکتور با موفقیت حذف شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
    setIsDeleting(false);
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    const toNullableDate = (v: unknown) => { const s = String(v || '').trim(); return s || null; };
    if (editingItem) {
      const payload: UpdateInvoiceDto = {
        userId: String(data.userId || ''),
        projectId: String(data.projectId || ''),
        amount: Number(data.amount) || 0,
        discountAmount: Number(data.discountAmount) || 0,
        taxAmount: Number(data.taxAmount) || 0,
        status: Number(data.status) || 1,
        description: String(data.description || '') || undefined,
        dueDate: String(data.dueDate || ''),
        paidAt: toNullableDate(data.paidAt),
      };
      await adminInvoicesService.update(editingItem.id, payload);
      toast.success('فاکتور با موفقیت ویرایش شد');
    } else {
      const payload: CreateInvoiceDto = {
        userId: String(data.userId || ''),
        projectId: String(data.projectId || ''),
        amount: Number(data.amount) || 0,
        discountAmount: Number(data.discountAmount) || 0,
        taxAmount: Number(data.taxAmount) || 0,
        status: Number(data.status) || 1,
        description: String(data.description || '') || undefined,
        dueDate: String(data.dueDate || ''),
      };
      await adminInvoicesService.create(payload);
      toast.success('فاکتور با موفقیت ایجاد شد');
    }
    fetchData();
  };

  const fields: FormField[] = [
    { key: 'userId', label: 'شناسه کاربر (UUID)', type: 'text', required: true },
    { key: 'projectId', label: 'شناسه پروژه (UUID)', type: 'text', required: true },
    { key: 'amount', label: 'مبلغ', type: 'number', required: true },
    { key: 'discountAmount', label: 'تخفیف', type: 'number' },
    { key: 'taxAmount', label: 'مالیات', type: 'number' },
    { key: 'status', label: 'وضعیت', type: 'select', required: true, options: PAYMENT_STATUS_OPTIONS },
    { key: 'dueDate', label: 'تاریخ سررسید', type: 'date', required: true },
    { key: 'paidAt', label: 'تاریخ پرداخت', type: 'date' },
    { key: 'description', label: 'توضیحات', type: 'textarea', fullWidth: true },
  ];

  const columns = [
    { key: 'invoiceNumber', label: 'شماره فاکتور', render: (i: Invoice) => i.invoiceNumber || '-' },
    { key: 'customerFullName', label: 'مشتری', render: (i: Invoice) => i.customerFullName || '-' },
    { key: 'amount', label: 'مبلغ', render: (i: Invoice) => i.amount?.toLocaleString() || '-' },
    { key: 'status', label: 'وضعیت', render: (i: Invoice) => PAYMENT_STATUS_OPTIONS.find(o => o.value === String(i.status))?.label || String(i.status) },
    { key: 'dueDate', label: 'سررسید', render: (i: Invoice) => i.dueDate ? new Date(i.dueDate).toLocaleDateString('fa-IR') : '-' },
    { key: 'createdAt', label: 'تاریخ', render: (i: Invoice) => i.createdAt ? new Date(i.createdAt).toLocaleDateString('fa-IR') : '-' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Receipt className="w-6 h-6" />مدیریت فاکتورها</h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} فاکتور</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}><RefreshCw className={`w-4 h-4 ml-1 ${isLoading ? 'animate-spin' : ''}`} />بروزرسانی</Button>
          <Button size="sm" className="btn-primary" onClick={() => { setEditingItem(null); setIsFormOpen(true); }}><Plus className="w-4 h-4 ml-1" />فاکتور جدید</Button>
        </div>
      </div>
      <Card className="glass"><CardContent className="p-6">
        <DataTable data={items} columns={columns} loading={isLoading} onEdit={(i) => { setEditingItem(i); setIsFormOpen(true); }} onDelete={(i) => setDeleteId(i.id)} emptyMessage="فاکتوری یافت نشد" />
      </CardContent></Card>
      <ConfirmDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)} title="حذف فاکتور" description="آیا از حذف این فاکتور اطمینان دارید؟" onConfirm={handleDelete} loading={isDeleting} />
      <EntityFormModal open={isFormOpen} onOpenChange={setIsFormOpen} title={editingItem ? 'ویرایش فاکتور' : 'فاکتور جدید'} fields={fields}
        initialValues={editingItem ? { userId: editingItem.userId || '', projectId: editingItem.projectId || '', amount: editingItem.amount, discountAmount: editingItem.discountAmount || 0, taxAmount: editingItem.taxAmount || 0, status: String(editingItem.status), dueDate: editingItem.dueDate?.split('T')[0] || '', paidAt: editingItem.paidAt?.split('T')[0] || '', description: editingItem.description || '' } : undefined}
        onSubmit={handleSubmit} />
    </div>
  );
}
