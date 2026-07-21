'use client';

import { useEffect, useState } from 'react';
import { Plus, Receipt, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmDialog, DataTable } from '@/components/admin/DataTable';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { ViewDetailModal } from '@/components/admin/ViewDetailModal';
import {
  adminInvoicesService,
  CreateInvoiceDto,
  UpdateInvoiceDto,
} from '@/services/admin/InvoicesService';
import { adminProjectsService } from '@/services/admin/ProjectsService';
import { getApiErrorMessage } from '@/services/api';
import { Invoice, Project } from '@/types/api';

const PAYMENT_STATUS_LABELS: Record<number, string> = {
  1: 'در انتظار پرداخت',
  2: 'پرداخت‌شده',
  3: 'ناموفق',
  4: 'بازپرداخت',
};

function toUtcDate(value: unknown): string {
  const date = String(value || '').trim();
  return date ? new Date(`${date}T00:00:00.000Z`).toISOString() : '';
}

function documentLabel(invoice: Invoice): string {
  return invoice.isFinalized || invoice.status === 2 ? 'فاکتور نهایی' : 'پیش‌فاکتور';
}

function paymentLabel(invoice: Invoice): string {
  if (invoice.status === 1 && invoice.hasPendingPayment) {
    return 'پرداخت ثبت شده؛ در انتظار تأیید مدیر';
  }
  return PAYMENT_STATUS_LABELS[invoice.status] || String(invoice.status);
}

export default function AdminInvoicesPage() {
  const [items, setItems] = useState<Invoice[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Invoice | null>(null);
  const [viewItem, setViewItem] = useState<Invoice | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [invoiceItems, projectItems] = await Promise.all([
        adminInvoicesService.getAll(),
        adminProjectsService.getAll(),
      ]);
      setItems(invoiceItems);
      setProjects(projectItems);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await adminInvoicesService.delete(deleteId);
      setItems(current => current.filter(item => item.id !== deleteId));
      setDeleteId(null);
      toast.success('فاکتور با موفقیت حذف شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleView = async (item: Invoice) => {
    setViewItem({ ...item });
    setViewError(null);
    setViewLoading(true);
    try {
      const detail = await adminInvoicesService.getById(item.id);
      if (detail) setViewItem(detail);
    } catch (error) {
      setViewError(getApiErrorMessage(error));
    } finally {
      setViewLoading(false);
    }
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    const projectId = String(data.projectId || '');
    const project = projects.find(item => item.id === projectId);
    if (!project) throw new Error('پروژه انتخاب‌شده معتبر نیست');

    const amount = Number(data.amount) || 0;
    if (amount <= 0) throw new Error('مبلغ فاکتور باید بیشتر از صفر باشد');

    const common = {
      userId: project.userId,
      projectId: project.id,
      amount,
      discountAmount: Number(data.discountAmount) || 0,
      taxAmount: Number(data.taxAmount) || 0,
      description: String(data.description || '').trim() || undefined,
      dueDate: toUtcDate(data.dueDate),
    };

    if (editingItem) {
      const payload: UpdateInvoiceDto = {
        ...common,
        status: editingItem.status,
        paidAt: editingItem.paidAt || null,
      };
      await adminInvoicesService.update(editingItem.id, payload);
      toast.success('پیش‌فاکتور با موفقیت ویرایش شد');
    } else {
      const payload: CreateInvoiceDto = { ...common, status: 1 };
      await adminInvoicesService.create(payload);
      toast.success('پیش‌فاکتور با موفقیت ایجاد شد');
    }

    await fetchData();
  };

  const fields: FormField[] = [
    {
      key: 'projectId',
      label: 'پروژه و مشتری',
      type: 'select',
      required: true,
      options: projects.map(project => ({
        value: project.id,
        label: `${project.title} — ${project.customerFullName || project.customerEmail || 'بدون نام'} — ${project.price.toLocaleString('fa-IR')} تومان`,
      })),
    },
    { key: 'amount', label: 'مبلغ (تومان)', type: 'number', required: true },
    { key: 'discountAmount', label: 'تخفیف', type: 'number' },
    { key: 'taxAmount', label: 'مالیات', type: 'number' },
    { key: 'dueDate', label: 'تاریخ سررسید', type: 'date', required: true },
    { key: 'description', label: 'توضیحات', type: 'textarea', fullWidth: true },
  ];

  const columns = [
    { key: 'invoiceNumber', label: 'شماره', render: (item: Invoice) => item.invoiceNumber || '-' },
    { key: 'document', label: 'نوع سند', render: (item: Invoice) => documentLabel(item) },
    { key: 'customerFullName', label: 'مشتری', render: (item: Invoice) => item.customerFullName || '-' },
    { key: 'projectTitle', label: 'پروژه', render: (item: Invoice) => item.projectTitle || '-' },
    { key: 'finalAmount', label: 'مبلغ نهایی', render: (item: Invoice) => (item.finalAmount ?? item.amount).toLocaleString('fa-IR') },
    { key: 'status', label: 'وضعیت', render: (item: Invoice) => paymentLabel(item) },
    { key: 'dueDate', label: 'سررسید', render: (item: Invoice) => item.dueDate ? new Date(item.dueDate).toLocaleDateString('fa-IR') : '-' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold"><Receipt className="h-6 w-6" />مدیریت فاکتورها</h1>
          <p className="mt-1 text-sm text-muted-foreground">{items.length.toLocaleString('fa-IR')} سند</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => void fetchData()} disabled={isLoading}>
            <RefreshCw className={`ml-1 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />به‌روزرسانی
          </Button>
          <Button size="sm" className="btn-primary" onClick={() => { setEditingItem(null); setIsFormOpen(true); }} disabled={projects.length === 0}>
            <Plus className="ml-1 h-4 w-4" />پیش‌فاکتور جدید
          </Button>
        </div>
      </div>

      {projects.length === 0 && !isLoading && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-700 dark:text-amber-300">
          برای صدور پیش‌فاکتور ابتدا یک پروژه بسازید؛ مالک فاکتور خودکار از پروژه انتخاب می‌شود.
        </div>
      )}

      <Card className="glass"><CardContent className="p-6">
        <DataTable
          data={items}
          columns={columns}
          loading={isLoading}
          onView={handleView}
          onEdit={item => {
            if (item.isFinalized || item.status === 2) {
              toast.error('فاکتور نهایی قابل ویرایش نیست');
              return;
            }
            setEditingItem(item);
            setIsFormOpen(true);
          }}
          onDelete={item => {
            if (item.isFinalized || item.status === 2) {
              toast.error('فاکتور نهایی قابل حذف نیست');
              return;
            }
            setDeleteId(item.id);
          }}
          idLookup={{ entityLabel: 'فاکتور', getById: id => adminInvoicesService.getById(id) }}
          emptyMessage="فاکتوری یافت نشد"
        />
      </CardContent></Card>

      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={open => { if (!open) setDeleteId(null); }}
        title="حذف فاکتور"
        description="آیا از حذف این فاکتور اطمینان دارید؟"
        onConfirm={handleDelete}
        loading={isDeleting}
      />

      <EntityFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={editingItem ? 'ویرایش پیش‌فاکتور' : 'پیش‌فاکتور جدید'}
        fields={fields}
        initialValues={editingItem ? {
          projectId: editingItem.projectId || '',
          amount: editingItem.amount,
          discountAmount: editingItem.discountAmount || 0,
          taxAmount: editingItem.taxAmount || 0,
          dueDate: editingItem.dueDate?.split('T')[0] || '',
          description: editingItem.description || '',
        } : undefined}
        onSubmit={handleSubmit}
      />

      <ViewDetailModal
        open={Boolean(viewItem) || viewLoading}
        onClose={() => { setViewItem(null); setViewError(null); setViewLoading(false); }}
        title="جزئیات فاکتور"
        loading={viewLoading}
        error={viewError}
        fields={viewItem ? [
          { label: 'نوع سند', value: documentLabel(viewItem) },
          { label: 'شماره', value: viewItem.invoiceNumber || '-' },
          { label: 'مشتری', value: viewItem.customerFullName || '-' },
          { label: 'ایمیل مشتری', value: viewItem.customerEmail || '-' },
          { label: 'پروژه', value: viewItem.projectTitle || '-' },
          { label: 'مبلغ اصلی', value: viewItem.amount.toLocaleString('fa-IR') },
          { label: 'تخفیف', value: (viewItem.discountAmount || 0).toLocaleString('fa-IR') },
          { label: 'مالیات', value: (viewItem.taxAmount || 0).toLocaleString('fa-IR') },
          { label: 'مبلغ نهایی', value: (viewItem.finalAmount ?? viewItem.amount).toLocaleString('fa-IR') },
          { label: 'پرداخت تأییدشده', value: (viewItem.paidAmount || 0).toLocaleString('fa-IR') },
          { label: 'مانده', value: (viewItem.remainingAmount ?? viewItem.finalAmount ?? viewItem.amount).toLocaleString('fa-IR') },
          { label: 'وضعیت', value: paymentLabel(viewItem) },
          { label: 'توضیحات', value: viewItem.description || '-', fullWidth: true },
          { label: 'سررسید', value: viewItem.dueDate ? new Date(viewItem.dueDate).toLocaleDateString('fa-IR') : '-' },
          { label: 'تاریخ ایجاد', value: new Date(viewItem.createdAt).toLocaleString('fa-IR') },
        ] : []}
      />
    </div>
  );
}
