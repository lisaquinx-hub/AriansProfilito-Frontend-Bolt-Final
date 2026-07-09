'use client';

import { useEffect, useState } from 'react';
import { CreditCard, RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { adminPaymentsService, CreatePaymentDto, UpdatePaymentDto } from '@/services/admin/PaymentsService';
import { Payment } from '@/types/api';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/services/api';

const PAYMENT_STATUS_OPTIONS = [
  { value: '1', label: 'در انتظار' },
  { value: '2', label: 'پرداخت شده' },
  { value: '3', label: 'ناموفق' },
  { value: '4', label: 'بازپرداخت' },
];

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

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await adminPaymentsService.delete(deleteId);
      setItems(prev => prev.filter(i => i.id !== deleteId));
      setDeleteId(null);
      toast.success('پرداخت با موفقیت حذف شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
    setIsDeleting(false);
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    const toNullable = (v: unknown) => { const s = String(v || '').trim(); return s || null; };
    if (editingItem) {
      const payload: UpdatePaymentDto = {
        invoiceId: String(data.invoiceId || ''),
        amount: Number(data.amount) || 0,
        gateway: String(data.gateway || ''),
        authority: String(data.authority || '') || undefined,
        refId: String(data.refId || '') || undefined,
        status: Number(data.status) || 1,
        cardPan: String(data.cardPan || '') || undefined,
        trackingCode: String(data.trackingCode || '') || undefined,
        paidAt: toNullable(data.paidAt),
      };
      await adminPaymentsService.update(editingItem.id, payload);
      toast.success('پرداخت با موفقیت ویرایش شد');
    } else {
      const payload: CreatePaymentDto = {
        invoiceId: String(data.invoiceId || ''),
        amount: Number(data.amount) || 0,
        gateway: String(data.gateway || ''),
        authority: String(data.authority || '') || undefined,
        refId: String(data.refId || '') || undefined,
        status: Number(data.status) || 1,
        cardPan: String(data.cardPan || '') || undefined,
        trackingCode: String(data.trackingCode || '') || undefined,
        paidAt: toNullable(data.paidAt),
      };
      await adminPaymentsService.create(payload);
      toast.success('پرداخت با موفقیت ایجاد شد');
    }
    fetchData();
  };

  const fields: FormField[] = [
    { key: 'invoiceId', label: 'شناسه فاکتور (UUID)', type: 'text', required: true },
    { key: 'amount', label: 'مبلغ', type: 'number', required: true },
    { key: 'gateway', label: 'درگاه پرداخت', type: 'text', required: true },
    { key: 'status', label: 'وضعیت', type: 'select', required: true, options: PAYMENT_STATUS_OPTIONS },
    { key: 'authority', label: 'Authority' },
    { key: 'refId', label: 'Ref ID' },
    { key: 'cardPan', label: 'شماره کارت' },
    { key: 'trackingCode', label: 'کد پیگیری' },
    { key: 'paidAt', label: 'تاریخ پرداخت', type: 'date' },
  ];

  const columns = [
    { key: 'invoiceNumber', label: 'فاکتور', render: (i: Payment) => i.invoiceNumber || '-' },
    { key: 'amount', label: 'مبلغ', render: (i: Payment) => i.amount?.toLocaleString() || '-' },
    { key: 'gateway', label: 'درگاه', render: (i: Payment) => i.gateway || '-' },
    { key: 'status', label: 'وضعیت', render: (i: Payment) => PAYMENT_STATUS_OPTIONS.find(o => o.value === String(i.status))?.label || String(i.status) },
    { key: 'paidAt', label: 'تاریخ پرداخت', render: (i: Payment) => i.paidAt ? new Date(i.paidAt).toLocaleDateString('fa-IR') : '-' },
    { key: 'createdAt', label: 'تاریخ', render: (i: Payment) => i.createdAt ? new Date(i.createdAt).toLocaleDateString('fa-IR') : '-' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><CreditCard className="w-6 h-6" />مدیریت پرداخت‌ها</h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} پرداخت</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}><RefreshCw className={`w-4 h-4 ml-1 ${isLoading ? 'animate-spin' : ''}`} />بروزرسانی</Button>
          <Button size="sm" className="btn-primary" onClick={() => { setEditingItem(null); setIsFormOpen(true); }}><Plus className="w-4 h-4 ml-1" />پرداخت جدید</Button>
        </div>
      </div>
      <Card className="glass"><CardContent className="p-6">
        <DataTable data={items} columns={columns} loading={isLoading} onEdit={(i) => { setEditingItem(i); setIsFormOpen(true); }} onDelete={(i) => setDeleteId(i.id)} emptyMessage="پرداختی یافت نشد" />
      </CardContent></Card>
      <ConfirmDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)} title="حذف پرداخت" description="آیا از حذف این پرداخت اطمینان دارید؟" onConfirm={handleDelete} loading={isDeleting} />
      <EntityFormModal open={isFormOpen} onOpenChange={setIsFormOpen} title={editingItem ? 'ویرایش پرداخت' : 'پرداخت جدید'} fields={fields}
        initialValues={editingItem ? { invoiceId: editingItem.invoiceId || '', amount: editingItem.amount, gateway: editingItem.gateway || '', authority: editingItem.authority || '', refId: editingItem.refId || '', status: String(editingItem.status), cardPan: editingItem.cardPan || '', trackingCode: editingItem.trackingCode || '', paidAt: editingItem.paidAt?.split('T')[0] || '' } : undefined}
        onSubmit={handleSubmit} />
    </div>
  );
}
