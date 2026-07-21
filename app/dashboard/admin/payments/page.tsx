'use client';

import { useEffect, useState } from 'react';
import { CreditCard, RefreshCw, Plus, ToggleLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { ViewDetailModal } from '@/components/admin/ViewDetailModal';
import { adminPaymentsService, CreatePaymentDto, UpdatePaymentDto } from '@/services/admin/PaymentsService';
import { adminInvoicesService } from '@/services/admin/InvoicesService';
import { Invoice, Payment } from '@/types/api';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/services/api';
import { AnimatePresence, motion } from 'framer-motion';

const PAYMENT_STATUS_OPTIONS = [
  { value: '1', label: 'در انتظار تأیید ادمین' },
  { value: '2', label: 'تأیید پرداخت' },
  { value: '3', label: 'ناموفق' },
  { value: '4', label: 'بازپرداخت' },
];

function allowedStatusOptions(currentStatus: number) {
  if (currentStatus === 2) return PAYMENT_STATUS_OPTIONS.filter(option => ['2', '4'].includes(option.value));
  if (currentStatus === 4) return PAYMENT_STATUS_OPTIONS.filter(option => option.value === '4');
  return PAYMENT_STATUS_OPTIONS.filter(option => option.value !== '4');
}

export default function AdminPaymentsPage() {
  const [items, setItems] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Payment | null>(null);

  const [viewItem, setViewItem] = useState<Payment | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  // Status change modal state
  const [statusItem, setStatusItem] = useState<Payment | null>(null);
  const [statusValue, setStatusValue] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [paymentItems, invoiceItems] = await Promise.all([
        adminPaymentsService.getAll(),
        adminInvoicesService.getAll(),
      ]);
      setItems(paymentItems);
      setInvoices(invoiceItems);
    } finally {
      setIsLoading(false);
    }
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

  const handleView = async (item: Payment) => {
    setViewItem({ ...item });
    setViewError(null);
    setViewLoading(true);
    try {
      const detail = await adminPaymentsService.getById(item.id);
      if (detail) setViewItem(detail);
    } catch (err) {
      setViewError(getApiErrorMessage(err));
    } finally {
      setViewLoading(false);
    }
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

  const handleStatusUpdate = async () => {
    if (!statusItem) return;
    setIsUpdating(true);
    setUpdateError(null);
    try {
      await adminPaymentsService.updateStatus(statusItem.id, statusValue);
      setStatusItem(null);
      toast.success(statusValue === 2
        ? 'پرداخت تأیید، فاکتور نهایی و پروژه فعال شد'
        : 'وضعیت پرداخت با موفقیت به‌روز شد');
      fetchData();
    } catch (err) {
      setUpdateError(getApiErrorMessage(err));
    } finally {
      setIsUpdating(false);
    }
  };

  const fields: FormField[] = [
    {
      key: 'invoiceId',
      label: 'فاکتور و مشتری',
      type: 'select',
      required: true,
      options: invoices.map(invoice => ({
        value: invoice.id,
        label: `${invoice.invoiceNumber || invoice.id} — ${invoice.customerFullName || 'بدون نام'} — ${(invoice.finalAmount ?? invoice.amount).toLocaleString('fa-IR')} تومان`,
      })),
    },
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

  const extraActions = [
    {
      label: 'بررسی و تأیید',
      icon: <ToggleLeft className="w-4 h-4" />,
      onClick: (item: Payment) => {
        setStatusValue(item.status ?? 1);
        setUpdateError(null);
        setStatusItem(item);
      },
      className: 'text-amber-500 hover:text-amber-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><CreditCard className="w-6 h-6" />مدیریت پرداخت‌ها</h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} پرداخت</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}><RefreshCw className={`w-4 h-4 ml-1 ${isLoading ? 'animate-spin' : ''}`} />به‌روزرسانی</Button>
          <Button size="sm" className="btn-primary" onClick={() => { setEditingItem(null); setIsFormOpen(true); }}><Plus className="w-4 h-4 ml-1" />پرداخت جدید</Button>
        </div>
      </div>
      <Card className="glass"><CardContent className="p-6">
        <DataTable
          data={items}
          columns={columns}
          loading={isLoading}
          onView={handleView}
          onEdit={(i) => {
            if (i.status === 2 || i.status === 4) {
              toast.error('پرداخت تأییدشده یا بازپرداخت‌شده فقط از بخش بررسی وضعیت قابل تغییر است');
              return;
            }
            setEditingItem(i);
            setIsFormOpen(true);
          }}
          onDelete={(i) => {
            if (i.status === 2 || i.status === 4) {
              toast.error('سابقه پرداخت تأییدشده یا بازپرداخت‌شده قابل حذف نیست');
              return;
            }
            setDeleteId(i.id);
          }}
          extraActions={extraActions}
          idLookup={{
            entityLabel: 'پرداخت',
            getById: (id) => adminPaymentsService.getById(id),
          }}
          emptyMessage="پرداختی یافت نشد"
        />
      </CardContent></Card>
      <ConfirmDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)} title="حذف پرداخت" description="آیا از حذف این پرداخت اطمینان دارید؟" onConfirm={handleDelete} loading={isDeleting} />
      <EntityFormModal open={isFormOpen} onOpenChange={setIsFormOpen} title={editingItem ? 'ویرایش پرداخت' : 'پرداخت جدید'} fields={fields}
        initialValues={editingItem ? { invoiceId: editingItem.invoiceId || '', amount: editingItem.amount, gateway: editingItem.gateway || '', authority: editingItem.authority || '', refId: editingItem.refId || '', status: String(editingItem.status), cardPan: editingItem.cardPan || '', trackingCode: editingItem.trackingCode || '', paidAt: editingItem.paidAt?.split('T')[0] || '' } : undefined}
        onSubmit={handleSubmit} />
      <ViewDetailModal
        open={!!viewItem || viewLoading}
        onClose={() => { setViewItem(null); setViewError(null); setViewLoading(false); }}
        title="جزئیات پرداخت"
        loading={viewLoading}
        error={viewError}
        fields={viewItem ? [
          { label: 'شناسه', value: viewItem.id },
          { label: 'شماره فاکتور', value: viewItem.invoiceNumber || '-' },
          { label: 'مبلغ', value: viewItem.amount?.toLocaleString() || '-' },
          { label: 'درگاه پرداخت', value: viewItem.gateway || '-' },
          { label: 'Authority', value: viewItem.authority || '-' },
          { label: 'Ref ID', value: viewItem.refId || '-' },
          { label: 'وضعیت', value: PAYMENT_STATUS_OPTIONS.find(o => o.value === String(viewItem.status))?.label || String(viewItem.status) },
          { label: 'شماره کارت', value: viewItem.cardPan || '-' },
          { label: 'کد پیگیری', value: viewItem.trackingCode || '-' },
          { label: 'تاریخ پرداخت', value: viewItem.paidAt ? new Date(viewItem.paidAt).toLocaleString('fa-IR') : '-' },
          { label: 'تاریخ ایجاد', value: viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleString('fa-IR') : '-' },
        ] : []}
      />

      {/* Status Change Modal */}
      <AnimatePresence>
        {statusItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50"
              onClick={() => { if (!isUpdating) setStatusItem(null); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative glass rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold mb-4">بررسی پرداخت مشتری</h3>
              <p className="text-sm text-muted-foreground mb-4">پرداخت: {statusItem.invoiceNumber || statusItem.id}</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">وضعیت</label>
                  <select
                    value={statusValue}
                    onChange={e => setStatusValue(Number(e.target.value))}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {allowedStatusOptions(statusItem.status).map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                {updateError && (
                  <p className="text-sm text-red-400">{updateError}</p>
                )}
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => setStatusItem(null)} disabled={isUpdating}>انصراف</Button>
                  <Button size="sm" className="btn-primary" onClick={handleStatusUpdate} disabled={isUpdating}>
                    {isUpdating ? 'در حال ذخیره...' : 'ذخیره'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
