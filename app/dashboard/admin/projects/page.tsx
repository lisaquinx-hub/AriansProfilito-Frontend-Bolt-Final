'use client';

import { useEffect, useState } from 'react';
import { Briefcase, RefreshCw, Plus, Loader2, ToggleLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { ViewDetailModal } from '@/components/admin/ViewDetailModal';
import { adminProjectsService } from '@/services/admin/ProjectsService';
import { adminPricingService } from '@/services/admin/PricingService';
import { Project, PricingPlan, User } from '@/types/api';
import { toast } from 'sonner';
import { api, getApiErrorMessage } from '@/services/api';
import { ApiResponse } from '@/lib/api-utils';
import { AnimatePresence, motion } from 'framer-motion';

// ProjectStatus enum: Pending=1, InProgress=2, Completed=3, Cancelled=4
const PROJECT_STATUS_OPTIONS = [
  { value: '1', label: 'در انتظار' },
  { value: '2', label: 'در حال انجام' },
  { value: '3', label: 'تکمیل شده' },
  { value: '4', label: 'لغو شده' },
];

function statusLabel(s: number) {
  return PROJECT_STATUS_OPTIONS.find(o => o.value === String(s))?.label || String(s);
}

function statusClass(s: number) {
  if (s === 2) return 'bg-sky-500/10 text-sky-500';
  if (s === 3) return 'bg-green-500/10 text-green-500';
  if (s === 4) return 'bg-red-500/10 text-red-500';
  return 'bg-gray-500/10 text-gray-400';
}

export default function AdminProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Project | null>(null);

  const [viewItem, setViewItem] = useState<Project | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  // Status change modal state
  const [statusItem, setStatusItem] = useState<Project | null>(null);
  const [statusValue, setStatusValue] = useState(1);
  const [statusProgress, setStatusProgress] = useState(0);
  const [statusAdminNote, setStatusAdminNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const [data, usersData, plansData] = await Promise.all([
      adminProjectsService.getAll(),
      api.get<ApiResponse<User[]>>('/admin/users').then(r => r.data.data || []).catch(() => [] as User[]),
      adminPricingService.getAll(),
    ]);
    setItems(data);
    setUsers(usersData);
    setPlans(plansData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await adminProjectsService.delete(deleteId);
      setItems(prev => prev.filter(i => i.id !== deleteId));
      setDeleteId(null);
      toast.success('پروژه با موفقیت حذف شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
    setIsDeleting(false);
  };

  const handleEdit = (item: Project) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleView = async (item: Project) => {
    setViewItem({ ...item });
    setViewError(null);
    setViewLoading(true);
    try {
      const detail = await adminProjectsService.getById(item.id);
      if (detail) setViewItem(detail);
    } catch (err) {
      setViewError(getApiErrorMessage(err));
    } finally {
      setViewLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!statusItem) return;
    setIsUpdating(true);
    setUpdateError(null);
    try {
      await adminProjectsService.updateStatus(statusItem.id, statusValue);
      setStatusItem(null);
      toast.success('وضعیت پروژه با موفقیت به‌روز شد');
      fetchData();
    } catch (err) {
      setUpdateError(getApiErrorMessage(err));
    } finally {
      setIsUpdating(false);
    }
  };

  const formFields: FormField[] = [
    {
      key: 'userId',
      label: 'مشتری',
      type: 'select',
      required: true,
      options: users.map(u => ({ value: u.id, label: `${u.fullName} (${u.email})` })),
    },
    {
      key: 'pricingPlanId',
      label: 'پلن قیمت‌گذاری',
      type: 'select',
      required: true,
      options: plans.map(p => ({ value: p.id, label: p.title })),
    },
    { key: 'title', label: 'عنوان پروژه', type: 'text', required: true, fullWidth: true },
    { key: 'description', label: 'توضیحات', type: 'textarea', fullWidth: true },
    {
      key: 'status',
      label: 'وضعیت',
      type: 'select',
      required: true,
      options: PROJECT_STATUS_OPTIONS,
    },
    { key: 'progress', label: 'پیشرفت (۰-۱۰۰)', type: 'number' },
    { key: 'price', label: 'قیمت (تومان)', type: 'number' },
    { key: 'paidAmount', label: 'مبلغ پرداخت شده', type: 'number' },
    { key: 'estimatedDeliveryDate', label: 'تاریخ تحویل تخمینی', type: 'date' },
    { key: 'startDate', label: 'تاریخ شروع', type: 'date' },
    { key: 'endDate', label: 'تاریخ پایان', type: 'date' },
    { key: 'adminNote', label: 'یادداشت مدیر', type: 'textarea', fullWidth: true },
    { key: 'customerComment', label: 'توضیح مشتری', type: 'textarea', fullWidth: true },
  ];

  const getInitialValues = (item: Project | null): Record<string, unknown> => {
    if (!item) {
      return {
        userId: '',
        pricingPlanId: '',
        title: '',
        description: '',
        status: '1',
        progress: 0,
        price: 0,
        paidAmount: 0,
        estimatedDeliveryDate: '',
        startDate: '',
        endDate: '',
        adminNote: '',
        customerComment: '',
      };
    }
    return {
      userId: item.userId,
      pricingPlanId: item.pricingPlanId,
      title: item.title,
      description: item.description,
      status: String(item.status),
      progress: item.progress,
      price: item.price,
      paidAmount: item.paidAmount,
      estimatedDeliveryDate: item.estimatedDeliveryDate ? item.estimatedDeliveryDate.split('T')[0] : '',
      startDate: item.startDate ? item.startDate.split('T')[0] : '',
      endDate: item.endDate ? item.endDate.split('T')[0] : '',
      adminNote: item.adminNote || '',
      customerComment: item.customerComment || '',
    };
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    const toNullableDate = (val: unknown) => {
      const s = String(val || '').trim();
      return s ? s : null;
    };

    if (editingItem) {
      const payload = {
        userId: String(data.userId),
        pricingPlanId: String(data.pricingPlanId),
        title: String(data.title || '').trim(),
        description: String(data.description || '').trim(),
        status: Number(data.status) || 1,
        progress: Number(data.progress) || 0,
        price: Number(data.price) || 0,
        paidAmount: Number(data.paidAmount) || 0,
        estimatedDeliveryDate: toNullableDate(data.estimatedDeliveryDate),
        startDate: toNullableDate(data.startDate),
        endDate: toNullableDate(data.endDate),
        adminNote: String(data.adminNote || '') || undefined,
        customerComment: String(data.customerComment || '') || undefined,
      };
      const updated = await adminProjectsService.update(editingItem.id, payload);
      if (updated) {
        setItems(prev => prev.map(i => (i.id === editingItem.id ? updated : i)));
        toast.success('پروژه با موفقیت ویرایش شد');
      }
    } else {
      const payload = {
        userId: String(data.userId),
        pricingPlanId: String(data.pricingPlanId),
        title: String(data.title || '').trim(),
        description: String(data.description || '').trim(),
        status: Number(data.status) || 1,
        progress: Number(data.progress) || 0,
        price: Number(data.price) || 0,
        paidAmount: Number(data.paidAmount) || 0,
        estimatedDeliveryDate: toNullableDate(data.estimatedDeliveryDate),
        startDate: toNullableDate(data.startDate),
        endDate: toNullableDate(data.endDate),
        adminNote: String(data.adminNote || '') || undefined,
        customerComment: String(data.customerComment || '') || undefined,
      };
      const created = await adminProjectsService.create(payload);
      if (created) {
        setItems(prev => [...prev, created]);
        toast.success('پروژه با موفقیت ایجاد شد');
      }
    }
  };

  const columns = [
    { key: 'title', label: 'عنوان' },
    {
      key: 'customerFullName',
      label: 'مشتری',
      render: (item: Project) => item.customerFullName || '-',
    },
    {
      key: 'pricingPlanTitle',
      label: 'پلن',
      render: (item: Project) => item.pricingPlanTitle || '-',
    },
    {
      key: 'status',
      label: 'وضعیت',
      render: (item: Project) => (
        <span className={`px-2 py-1 rounded-full text-xs ${statusClass(item.status)}`}>
          {statusLabel(item.status)}
        </span>
      ),
    },
    {
      key: 'progress',
      label: 'پیشرفت',
      render: (item: Project) => `${item.progress}%`,
    },
    {
      key: 'price',
      label: 'قیمت',
      render: (item: Project) => item.price?.toLocaleString() || '-',
    },
    {
      key: 'createdAt',
      label: 'تاریخ',
      render: (item: Project) =>
        item.createdAt ? new Date(item.createdAt).toLocaleDateString('fa-IR') : '-',
    },
  ];

  const extraActions = [
    {
      label: 'تغییر وضعیت',
      icon: <ToggleLeft className="w-4 h-4" />,
      onClick: (item: Project) => {
        setStatusValue(item.status ?? 1);
        setStatusProgress(item.progress ?? 0);
        setStatusAdminNote(item.adminNote || '');
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
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="w-6 h-6" />
            مدیریت پروژه‌ها
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} پروژه</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ml-1 ${isLoading ? 'animate-spin' : ''}`} />
            بروزرسانی
          </Button>
          <Button size="sm" className="btn-primary" onClick={handleCreate}>
            <Plus className="w-4 h-4 ml-1" />
            ایجاد پروژه
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        </div>
      ) : (
        <Card className="glass">
          <CardContent className="p-6">
            <DataTable
              data={items}
              columns={columns}
              loading={false}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={(item) => setDeleteId(item.id)}
              extraActions={extraActions}
              emptyMessage="پروژه‌ای یافت نشد"
            />
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف پروژه"
        description="آیا از حذف این پروژه اطمینان دارید؟"
        onConfirm={handleDelete}
        loading={isDeleting}
      />

      <EntityFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={editingItem ? 'ویرایش پروژه' : 'ایجاد پروژه جدید'}
        fields={formFields}
        initialValues={getInitialValues(editingItem)}
        onSubmit={handleSubmit}
        submitLabel={editingItem ? 'ذخیره تغییرات' : 'ایجاد پروژه'}
      />

      <ViewDetailModal
        open={!!viewItem || viewLoading}
        onClose={() => { setViewItem(null); setViewError(null); setViewLoading(false); }}
        title="جزئیات پروژه"
        loading={viewLoading}
        error={viewError}
        fields={viewItem ? [
          { label: 'شناسه', value: viewItem.id },
          { label: 'عنوان', value: viewItem.title },
          { label: 'مشتری', value: viewItem.customerFullName || '-' },
          { label: 'ایمیل مشتری', value: viewItem.customerEmail || '-' },
          { label: 'پلن قیمت‌گذاری', value: viewItem.pricingPlanTitle || '-' },
          { label: 'وضعیت', value: statusLabel(viewItem.status) },
          { label: 'پیشرفت', value: `${viewItem.progress}%` },
          { label: 'قیمت', value: viewItem.price?.toLocaleString() || '-' },
          { label: 'مبلغ پرداخت شده', value: viewItem.paidAmount?.toLocaleString() || '-' },
          { label: 'تاریخ تحویل تخمینی', value: viewItem.estimatedDeliveryDate ? new Date(viewItem.estimatedDeliveryDate).toLocaleDateString('fa-IR') : '-' },
          { label: 'تاریخ شروع', value: viewItem.startDate ? new Date(viewItem.startDate).toLocaleDateString('fa-IR') : '-' },
          { label: 'تاریخ پایان', value: viewItem.endDate ? new Date(viewItem.endDate).toLocaleDateString('fa-IR') : '-' },
          { label: 'یادداشت مدیر', value: viewItem.adminNote || '-', fullWidth: true },
          { label: 'توضیح مشتری', value: viewItem.customerComment || '-', fullWidth: true },
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
              className="relative glass rounded-2xl p-6 max-w-sm w-full"
            >
              <h3 className="text-lg font-semibold mb-4">تغییر وضعیت پروژه</h3>
              <p className="text-sm text-muted-foreground mb-4">پروژه: {statusItem.title}</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">وضعیت</label>
                  <select
                    value={statusValue}
                    onChange={e => setStatusValue(Number(e.target.value))}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {PROJECT_STATUS_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">پیشرفت (۰-۱۰۰)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={statusProgress}
                    onChange={e => setStatusProgress(Number(e.target.value))}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">یادداشت مدیر</label>
                  <textarea
                    value={statusAdminNote}
                    onChange={e => setStatusAdminNote(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                    placeholder="اختیاری"
                  />
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
