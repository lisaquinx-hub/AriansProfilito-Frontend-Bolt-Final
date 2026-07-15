'use client';

import { useEffect, useState } from 'react';
import { Briefcase, RefreshCw, Plus, Loader2, ToggleLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { ViewDetailModal } from '@/components/admin/ViewDetailModal';
import { adminProjectsService, CreateProjectDto, UpdateProjectDto } from '@/services/admin/ProjectsService';
import { adminPricingService } from '@/services/admin/PricingService';
import { adminUsersService } from '@/services/admin/index';
import { Project, PricingPlan, User } from '@/types/api';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/services/api';
import { AnimatePresence, motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

const PROJECT_STATUS_OPTIONS = [
  { value: 1, label: 'در انتظار' },
  { value: 2, label: 'در حال انجام' },
  { value: 3, label: 'تکمیل شده' },
  { value: 4, label: 'لغو شده' },
];

function statusLabel(s: number) {
  return PROJECT_STATUS_OPTIONS.find(o => o.value === s)?.label || String(s);
}
function statusClass(s: number) {
  if (s === 2) return 'bg-sky-500/10 text-sky-500';
  if (s === 3) return 'bg-green-500/10 text-green-500';
  if (s === 4) return 'bg-red-500/10 text-red-500';
  return 'bg-gray-500/10 text-gray-400';
}
function toIsoOrNull(val: string): string | null {
  const s = val.trim();
  return s ? s : null;
}

interface ProjectFormState {
  userId: string;
  pricingPlanId: string;
  projectCode: string;
  title: string;
  description: string;
  status: number;
  progress: number;
  price: number;
  paidAmount: number;
  estimatedDeliveryDate: string;
  startDate: string;
  endDate: string;
  adminNote: string;
  customerComment: string;
}

const EMPTY_FORM: ProjectFormState = {
  userId: '',
  pricingPlanId: '',
  projectCode: '',
  title: '',
  description: '',
  status: 1,
  progress: 0,
  price: 0,
  paidAmount: 0,
  estimatedDeliveryDate: '',
  startDate: '',
  endDate: '',
  adminNote: '',
  customerComment: '',
};

function projectToForm(item: Project): ProjectFormState {
  return {
    userId: item.userId || '',
    pricingPlanId: item.pricingPlanId || '',
    projectCode: item.projectCode || '',
    title: item.title || '',
    description: item.description || '',
    status: item.status ?? 1,
    progress: item.progress ?? 0,
    price: item.price ?? 0,
    paidAmount: item.paidAmount ?? 0,
    estimatedDeliveryDate: item.estimatedDeliveryDate ? item.estimatedDeliveryDate.split('T')[0] : '',
    startDate: item.startDate ? item.startDate.split('T')[0] : '',
    endDate: item.endDate ? item.endDate.split('T')[0] : '',
    adminNote: item.adminNote || '',
    customerComment: item.customerComment || '',
  };
}

export default function AdminProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Project | null>(null);
  const [form, setForm] = useState<ProjectFormState>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // View modal
  const [viewItem, setViewItem] = useState<Project | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  // Delete
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status change modal
  const [statusItem, setStatusItem] = useState<Project | null>(null);
  const [statusForm, setStatusForm] = useState({ status: 1, progress: 0, adminNote: '' });
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const [projectsData, usersData, plansData] = await Promise.all([
      adminProjectsService.getAll(),
      adminUsersService.getAll(),
      adminPricingService.getAll(),
    ]);
    setItems(Array.isArray(projectsData) ? projectsData : []);
    setUsers(Array.isArray(usersData) ? usersData : []);
    setPlans(Array.isArray(plansData) ? plansData : []);
    setIsLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setIsFormOpen(true);
  };

  const openEdit = (item: Project) => {
    setEditingItem(item);
    setForm(projectToForm(item));
    setFormError(null);
    setIsFormOpen(true);
  };

  const openView = async (item: Project) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!form.userId) { setFormError('انتخاب کاربر الزامی است'); return; }
    if (!form.pricingPlanId) { setFormError('انتخاب پلن قیمت‌گذاری الزامی است'); return; }
    if (!form.title.trim()) { setFormError('عنوان پروژه الزامی است'); return; }

    const progress = Math.min(100, Math.max(0, Number(form.progress) || 0));

    setIsSubmitting(true);
    try {
      if (editingItem) {
        const payload: UpdateProjectDto = {
          userId: form.userId,
          pricingPlanId: form.pricingPlanId,
          title: form.title.trim(),
          description: form.description.trim(),
          status: Number(form.status),
          progress,
          price: Number(form.price) || 0,
          paidAmount: Number(form.paidAmount) || 0,
          estimatedDeliveryDate: toIsoOrNull(form.estimatedDeliveryDate),
          startDate: toIsoOrNull(form.startDate),
          endDate: toIsoOrNull(form.endDate),
          adminNote: form.adminNote.trim() || null,
          customerComment: form.customerComment.trim() || null,
        };
        const updated = await adminProjectsService.update(editingItem.id, payload);
        if (updated) setItems(prev => (Array.isArray(prev) ? prev : []).map(i => i.id === editingItem.id ? updated : i));
        toast.success('پروژه با موفقیت ویرایش شد');
        setIsFormOpen(false);
      } else {
        const payload: CreateProjectDto = {
          userId: form.userId,
          pricingPlanId: form.pricingPlanId,
          projectCode: form.projectCode.trim() || null,
          title: form.title.trim(),
          description: form.description.trim(),
          status: Number(form.status),
          progress,
          price: Number(form.price) || 0,
          paidAmount: Number(form.paidAmount) || 0,
          estimatedDeliveryDate: toIsoOrNull(form.estimatedDeliveryDate),
          startDate: toIsoOrNull(form.startDate),
          endDate: toIsoOrNull(form.endDate),
          adminNote: form.adminNote.trim() || null,
          customerComment: form.customerComment.trim() || null,
        };
        const created = await adminProjectsService.create(payload);
        if (created) setItems(prev => [...(Array.isArray(prev) ? prev : []), created]);
        toast.success('پروژه با موفقیت ایجاد شد');
        setIsFormOpen(false);
      }
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await adminProjectsService.delete(deleteId);
      setItems(prev => (Array.isArray(prev) ? prev : []).filter(i => i.id !== deleteId));
      setDeleteId(null);
      toast.success('پروژه با موفقیت حذف شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!statusItem) return;
    setIsUpdatingStatus(true);
    setStatusError(null);
    try {
      await adminProjectsService.updateStatus(statusItem.id, {
        status: statusForm.status,
        progress: Math.min(100, Math.max(0, statusForm.progress)),
        adminNote: statusForm.adminNote.trim() || null,
      });
      setStatusItem(null);
      toast.success('وضعیت پروژه با موفقیت به‌روز شد');
      fetchData();
    } catch (err) {
      setStatusError(getApiErrorMessage(err));
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const columns = [
    { key: 'title', label: 'عنوان' },
    { key: 'customerFullName', label: 'مشتری', render: (i: Project) => i.customerFullName || '-' },
    { key: 'pricingPlanTitle', label: 'پلن', render: (i: Project) => i.pricingPlanTitle || '-' },
    {
      key: 'status', label: 'وضعیت', render: (i: Project) => (
        <span className={`px-2 py-1 rounded-full text-xs ${statusClass(i.status)}`}>{statusLabel(i.status)}</span>
      )
    },
    { key: 'progress', label: 'پیشرفت', render: (i: Project) => `${i.progress}%` },
    { key: 'price', label: 'قیمت', render: (i: Project) => i.price?.toLocaleString() || '-' },
    { key: 'createdAt', label: 'تاریخ', render: (i: Project) => i.createdAt ? new Date(i.createdAt).toLocaleDateString('fa-IR') : '-' },
  ];

  const extraActions = [
    {
      label: 'تغییر وضعیت',
      icon: <ToggleLeft className="w-4 h-4 ml-2" />,
      onClick: (item: Project) => {
        setStatusForm({ status: item.status ?? 1, progress: item.progress ?? 0, adminNote: item.adminNote || '' });
        setStatusError(null);
        setStatusItem(item);
      },
    },
  ];

  const inputCls = 'w-full h-10 px-3 rounded-md bg-muted/50 border border-border focus:border-sky-500 text-foreground text-sm focus:outline-none transition-colors';
  const selectCls = inputCls;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Briefcase className="w-6 h-6" />مدیریت پروژه‌ها</h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} پروژه</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ml-1 ${isLoading ? 'animate-spin' : ''}`} />بروزرسانی
          </Button>
          <Button size="sm" className="btn-primary" onClick={openCreate}>
            <Plus className="w-4 h-4 ml-1" />ایجاد پروژه
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
              data={items} columns={columns} loading={false}
              onView={openView} onEdit={openEdit} onDelete={(item) => setDeleteId(item.id)}
              extraActions={extraActions}
              idLookup={{
                entityLabel: 'پروژه',
                getById: (id) => adminProjectsService.getById(id),
              }}
              emptyMessage="پروژه‌ای یافت نشد"
            />
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}
        title="حذف پروژه" description="آیا از حذف این پروژه اطمینان دارید؟"
        onConfirm={handleDelete} loading={isDeleting}
      />

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSubmitting && setIsFormOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative glass rounded-2xl p-6 w-full max-w-2xl my-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold">{editingItem ? 'ویرایش پروژه' : 'ایجاد پروژه جدید'}</h3>
                <button onClick={() => setIsFormOpen(false)} disabled={isSubmitting} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {formError && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">{formError}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* User dropdown — loaded from GET /api/admin/users */}
                  <div className="space-y-1.5">
                    <Label>مشتری *</Label>
                    {users.length === 0 ? (
                      <p className="text-sm text-muted-foreground p-2 rounded bg-muted/30">هیچ کاربری برای انتخاب وجود ندارد.</p>
                    ) : (
                      <select
                        value={form.userId}
                        onChange={e => setForm(f => ({ ...f, userId: e.target.value }))}
                        className={selectCls}
                        required
                      >
                        <option value="">انتخاب کاربر...</option>
                        {users.map(u => (
                          <option key={u.id} value={u.id}>{u.fullName} ({u.email})</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Pricing plan dropdown — loaded from GET /api/admin/pricing/plans */}
                  <div className="space-y-1.5">
                    <Label>پلن قیمت‌گذاری *</Label>
                    {plans.length === 0 ? (
                      <p className="text-sm text-muted-foreground p-2 rounded bg-muted/30">هیچ پلن قیمت‌گذاری برای انتخاب وجود ندارد.</p>
                    ) : (
                      <select
                        value={form.pricingPlanId}
                        onChange={e => setForm(f => ({ ...f, pricingPlanId: e.target.value }))}
                        className={selectCls}
                        required
                      >
                        <option value="">انتخاب پلن...</option>
                        {plans.map(p => (
                          <option key={p.id} value={p.id}>{p.title} — {p.price?.toLocaleString?.()} تومان</option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label>عنوان *</Label>
                    <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      className="bg-muted/50 border-border" placeholder="عنوان پروژه" required />
                  </div>

                  <div className="space-y-1.5">
                    <Label>کد پروژه</Label>
                    <Input value={form.projectCode} onChange={e => setForm(f => ({ ...f, projectCode: e.target.value }))}
                      className="bg-muted/50 border-border" placeholder="اختیاری" />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <Label>توضیحات</Label>
                    <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      rows={3} className="bg-muted/50 border-border resize-none" placeholder="توضیحات پروژه" />
                  </div>

                  <div className="space-y-1.5">
                    <Label>وضعیت</Label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: Number(e.target.value) }))} className={selectCls}>
                      {PROJECT_STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label>پیشرفت (۰-۱۰۰)</Label>
                    <Input type="number" min={0} max={100} value={form.progress}
                      onChange={e => setForm(f => ({ ...f, progress: Number(e.target.value) }))}
                      className="bg-muted/50 border-border" />
                  </div>

                  <div className="space-y-1.5">
                    <Label>قیمت (تومان)</Label>
                    <Input type="number" min={0} value={form.price}
                      onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                      className="bg-muted/50 border-border" />
                  </div>

                  <div className="space-y-1.5">
                    <Label>مبلغ پرداخت شده</Label>
                    <Input type="number" min={0} value={form.paidAmount}
                      onChange={e => setForm(f => ({ ...f, paidAmount: Number(e.target.value) }))}
                      className="bg-muted/50 border-border" />
                  </div>

                  <div className="space-y-1.5">
                    <Label>تاریخ تحویل تخمینی</Label>
                    <Input type="date" value={form.estimatedDeliveryDate}
                      onChange={e => setForm(f => ({ ...f, estimatedDeliveryDate: e.target.value }))}
                      className="bg-muted/50 border-border" />
                  </div>

                  <div className="space-y-1.5">
                    <Label>تاریخ شروع</Label>
                    <Input type="date" value={form.startDate}
                      onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                      className="bg-muted/50 border-border" />
                  </div>

                  <div className="space-y-1.5">
                    <Label>تاریخ پایان</Label>
                    <Input type="date" value={form.endDate}
                      onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                      className="bg-muted/50 border-border" />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <Label>یادداشت مدیر</Label>
                    <Textarea value={form.adminNote} onChange={e => setForm(f => ({ ...f, adminNote: e.target.value }))}
                      rows={2} className="bg-muted/50 border-border resize-none" placeholder="اختیاری" />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <Label>توضیح مشتری</Label>
                    <Textarea value={form.customerComment} onChange={e => setForm(f => ({ ...f, customerComment: e.target.value }))}
                      rows={2} className="bg-muted/50 border-border resize-none" placeholder="اختیاری" />
                  </div>
                </div>

                <div className="flex gap-3 justify-end mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} disabled={isSubmitting}>انصراف</Button>
                  <Button type="submit" className="btn-primary"
                    disabled={isSubmitting || users.length === 0 || plans.length === 0 || !form.userId || !form.pricingPlanId}>
                    {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin ml-1" />در حال ذخیره...</> : (editingItem ? 'ذخیره تغییرات' : 'ایجاد پروژه')}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Detail Modal */}
      <ViewDetailModal
        open={!!viewItem || viewLoading}
        onClose={() => { setViewItem(null); setViewError(null); setViewLoading(false); }}
        title="جزئیات پروژه" loading={viewLoading} error={viewError}
        fields={viewItem ? [
          { label: 'عنوان', value: viewItem.title },
          { label: 'مشتری', value: viewItem.customerFullName || '-' },
          { label: 'ایمیل مشتری', value: viewItem.customerEmail || '-' },
          { label: 'پلن', value: viewItem.pricingPlanTitle || '-' },
          { label: 'وضعیت', value: statusLabel(viewItem.status) },
          { label: 'پیشرفت', value: `${viewItem.progress}%` },
          { label: 'قیمت', value: viewItem.price?.toLocaleString() || '-' },
          { label: 'پرداخت شده', value: viewItem.paidAmount?.toLocaleString() || '-' },
          { label: 'تحویل تخمینی', value: viewItem.estimatedDeliveryDate ? new Date(viewItem.estimatedDeliveryDate).toLocaleDateString('fa-IR') : '-' },
          { label: 'شروع', value: viewItem.startDate ? new Date(viewItem.startDate).toLocaleDateString('fa-IR') : '-' },
          { label: 'پایان', value: viewItem.endDate ? new Date(viewItem.endDate).toLocaleDateString('fa-IR') : '-' },
          { label: 'یادداشت مدیر', value: viewItem.adminNote || '-', fullWidth: true },
          { label: 'توضیح مشتری', value: viewItem.customerComment || '-', fullWidth: true },
          { label: 'تاریخ ایجاد', value: viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleString('fa-IR') : '-' },
        ] : []}
      />

      {/* Status Change Modal */}
      <AnimatePresence>
        {statusItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50" onClick={() => !isUpdatingStatus && setStatusItem(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative glass rounded-2xl p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-1">تغییر وضعیت پروژه</h3>
              <p className="text-sm text-muted-foreground mb-4">{statusItem.title}</p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>وضعیت</Label>
                  <select value={statusForm.status} onChange={e => setStatusForm(f => ({ ...f, status: Number(e.target.value) }))}
                    className="w-full h-10 px-3 rounded-md bg-muted/50 border border-border text-foreground text-sm focus:outline-none">
                    {PROJECT_STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>پیشرفت (۰-۱۰۰)</Label>
                  <Input type="number" min={0} max={100} value={statusForm.progress}
                    onChange={e => setStatusForm(f => ({ ...f, progress: Number(e.target.value) }))}
                    className="bg-muted/50 border-border" />
                </div>
                <div className="space-y-1.5">
                  <Label>یادداشت مدیر</Label>
                  <Textarea value={statusForm.adminNote} onChange={e => setStatusForm(f => ({ ...f, adminNote: e.target.value }))}
                    rows={2} className="bg-muted/50 border-border resize-none" placeholder="اختیاری" />
                </div>
                {statusError && <p className="text-sm text-red-400">{statusError}</p>}
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => setStatusItem(null)} disabled={isUpdatingStatus}>انصراف</Button>
                  <Button size="sm" className="btn-primary" onClick={handleStatusUpdate} disabled={isUpdatingStatus}>
                    {isUpdatingStatus ? 'در حال ذخیره...' : 'ذخیره'}
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
