'use client';

import { useEffect, useState } from 'react';
import { Settings as SettingsIcon, RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { ViewDetailModal } from '@/components/admin/ViewDetailModal';
import { adminSettingsService } from '@/services/admin/SettingsService';
import { Settings } from '@/types/api';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/services/api';

export default function AdminSettingsPage() {
  const [items, setItems] = useState<Settings[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Settings | null>(null);

  const [viewItem, setViewItem] = useState<Settings | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await adminSettingsService.getAll();
    setItems(data);
    setIsLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await adminSettingsService.delete(deleteId);
      setItems(prev => prev.filter(i => i.id !== deleteId));
      setDeleteId(null);
      toast.success('رکورد با موفقیت حذف شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
    setIsDeleting(false);
  };

  const handleView = async (item: Settings) => {
    setViewItem({ ...item });
    setViewError(null);
    setViewLoading(true);
    try {
      const detail = await adminSettingsService.getById(item.id);
      if (detail) setViewItem(detail);
    } catch (err) {
      setViewError(getApiErrorMessage(err));
    } finally {
      setViewLoading(false);
    }
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    const payload: Partial<Settings> = {
      siteName: String(data.siteName || ''),
      logo: String(data.logo || ''),
      email: String(data.email || ''),
      phoneNumber: String(data.phoneNumber || ''),
      address: String(data.address || ''),
      telegram: String(data.telegram || ''),
      instagram: String(data.instagram || ''),
      linkedin: String(data.linkedin || ''),
      whatsApp: String(data.whatsApp || ''),
      footerDescription: String(data.footerDescription || ''),
    };
    if (editingItem) {
      await adminSettingsService.update(editingItem.id, payload);
      toast.success('تنظیمات با موفقیت ویرایش شد');
    } else {
      await adminSettingsService.create(payload);
      toast.success('تنظیمات با موفقیت ایجاد شد');
    }
    fetchData();
  };

  const fields: FormField[] = [
    { key: 'siteName', label: 'نام سایت', required: true },
    { key: 'logo', label: 'لوگو (URL)', type: 'url' },
    { key: 'email', label: 'ایمیل', type: 'email', required: true },
    { key: 'phoneNumber', label: 'تلفن' },
    { key: 'address', label: 'آدرس', type: 'textarea', fullWidth: true },
    { key: 'telegram', label: 'تلگرام' },
    { key: 'instagram', label: 'اینستاگرام' },
    { key: 'linkedin', label: 'لینکدین' },
    { key: 'whatsApp', label: 'واتساپ' },
    { key: 'footerDescription', label: 'توضیحات فوتر', type: 'textarea', fullWidth: true },
  ];

  const columns = [
    { key: 'siteName', label: 'نام سایت', render: (i: Settings) => i.siteName || '-' },
    { key: 'email', label: 'ایمیل', render: (i: Settings) => i.email || '-' },
    { key: 'phoneNumber', label: 'تلفن', render: (i: Settings) => i.phoneNumber || '-' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><SettingsIcon className="w-6 h-6" />مدیریت تنظیمات</h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} رکورد</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}><RefreshCw className={`w-4 h-4 ml-1 ${isLoading ? 'animate-spin' : ''}`} />به‌روزرسانی</Button>
          <Button size="sm" className="btn-primary" onClick={() => { setEditingItem(null); setIsFormOpen(true); }}><Plus className="w-4 h-4 ml-1" />تنظیمات جدید</Button>
        </div>
      </div>
      <Card className="glass"><CardContent className="p-6">
        <DataTable
          data={items}
          columns={columns}
          loading={isLoading}
          onView={handleView}
          onEdit={(i) => { setEditingItem(i); setIsFormOpen(true); }}
          onDelete={(i) => setDeleteId(i.id)}
          idLookup={{
            entityLabel: 'تنظیمات',
            getById: (id) => adminSettingsService.getById(id),
          }}
          emptyMessage="تنظیماتی یافت نشد"
        />
      </CardContent></Card>
      <ConfirmDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)} title="حذف تنظیمات" description="آیا از حذف اطمینان دارید؟" onConfirm={handleDelete} loading={isDeleting} />
      <EntityFormModal open={isFormOpen} onOpenChange={setIsFormOpen} title={editingItem ? 'ویرایش تنظیمات' : 'تنظیمات جدید'} fields={fields}
        initialValues={editingItem ? { siteName: editingItem.siteName || '', logo: editingItem.logo || '', email: editingItem.email || '', phoneNumber: editingItem.phoneNumber || '', address: editingItem.address || '', telegram: editingItem.telegram || '', instagram: editingItem.instagram || '', linkedin: editingItem.linkedin || '', whatsApp: editingItem.whatsApp || '', footerDescription: editingItem.footerDescription || '' } : undefined}
        onSubmit={handleSubmit} />
      <ViewDetailModal
        open={!!viewItem || viewLoading}
        onClose={() => { setViewItem(null); setViewError(null); setViewLoading(false); }}
        title="جزئیات تنظیمات"
        loading={viewLoading}
        error={viewError}
        fields={viewItem ? [
          { label: 'شناسه', value: viewItem.id },
          { label: 'نام سایت', value: viewItem.siteName || '-' },
          { label: 'ایمیل', value: viewItem.email || '-' },
          { label: 'تلفن', value: viewItem.phoneNumber || '-' },
          { label: 'آدرس', value: viewItem.address || '-', fullWidth: true },
          { label: 'تلگرام', value: viewItem.telegram || '-' },
          { label: 'اینستاگرام', value: viewItem.instagram || '-' },
          { label: 'لینکدین', value: viewItem.linkedin || '-' },
          { label: 'واتساپ', value: viewItem.whatsApp || '-' },
          { label: 'توضیحات فوتر', value: viewItem.footerDescription || '-', fullWidth: true },
          { label: 'تاریخ ایجاد', value: viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleString('fa-IR') : '-' },
        ] : []}
      />
    </div>
  );
}
