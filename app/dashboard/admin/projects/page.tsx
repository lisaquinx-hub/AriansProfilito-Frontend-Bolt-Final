'use client';

import { useEffect, useState } from 'react';
import { Briefcase, RefreshCw, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { adminProjectsService } from '@/services/admin/ProjectsService';
import { adminPricingService } from '@/services/admin/PricingService';
import { Project, PricingPlan } from '@/types/api';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/services/api';
import { api } from '@/services/api';
import { ApiResponse } from '@/lib/api-utils';
import { User } from '@/types/api';

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
              onEdit={handleEdit}
              onDelete={(item) => setDeleteId(item.id)}
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
    </div>
  );
}
