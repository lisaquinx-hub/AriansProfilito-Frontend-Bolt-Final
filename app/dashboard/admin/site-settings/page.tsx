'use client';

import { useEffect, useState } from 'react';
import { Settings as SettingsIcon, RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { ViewDetailModal } from '@/components/admin/ViewDetailModal';
import { adminSiteSettingsService } from '@/services/admin/SettingsService';
import { SiteSettings } from '@/types/api';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/services/api';

export default function AdminSiteSettingsPage() {
  const [items, setItems] = useState<SiteSettings[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SiteSettings | null>(null);

  const [viewItem, setViewItem] = useState<SiteSettings | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await adminSiteSettingsService.getAll();
    setItems(data);
    setIsLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await adminSiteSettingsService.delete(deleteId);
      setItems(prev => prev.filter(i => i.id !== deleteId));
      setDeleteId(null);
      toast.success('رکورد با موفقیت حذف شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
    setIsDeleting(false);
  };

  const handleView = async (item: SiteSettings) => {
    setViewItem({ ...item });
    setViewError(null);
    setViewLoading(true);
    try {
      const detail = await adminSiteSettingsService.getById(item.id);
      if (detail) setViewItem(detail);
    } catch (err) {
      setViewError(getApiErrorMessage(err));
    } finally {
      setViewLoading(false);
    }
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    const payload: Partial<SiteSettings> = {
      siteName: String(data.siteName || ''),
      logo: String(data.logo || '') || undefined,
      darkLogo: String(data.darkLogo || '') || undefined,
      favicon: String(data.favicon || '') || undefined,
      email: String(data.email || ''),
      phone: String(data.phone || ''),
      address: String(data.address || ''),
      footerText: String(data.footerText || ''),
      copyright: String(data.copyright || ''),
      googleMap: String(data.googleMap || '') || undefined,
      googleAnalytics: String(data.googleAnalytics || '') || undefined,
      metaTitle: String(data.metaTitle || ''),
      metaDescription: String(data.metaDescription || ''),
      metaKeywords: String(data.metaKeywords || ''),
    };
    if (editingItem) {
      await adminSiteSettingsService.update(editingItem.id, payload);
      toast.success('تنظیمات با موفقیت ویرایش شد');
    } else {
      await adminSiteSettingsService.create(payload);
      toast.success('تنظیمات با موفقیت ایجاد شد');
    }
    fetchData();
  };

  const fields: FormField[] = [
    { key: 'siteName', label: 'نام سایت', required: true },
    { key: 'logo', label: 'لوگو (URL)', type: 'url' },
    { key: 'darkLogo', label: 'لوگوی تاریک (URL)', type: 'url' },
    { key: 'favicon', label: 'فاویکون (URL)', type: 'url' },
    { key: 'email', label: 'ایمیل', type: 'email', required: true },
    { key: 'phone', label: 'تلفن' },
    { key: 'address', label: 'آدرس', type: 'textarea', fullWidth: true },
    { key: 'footerText', label: 'متن فوتر', type: 'textarea', fullWidth: true },
    { key: 'copyright', label: 'کپی‌رایت' },
    { key: 'googleMap', label: 'Google Map URL', type: 'url' },
    { key: 'googleAnalytics', label: 'Google Analytics ID' },
    { key: 'metaTitle', label: 'عنوان متا' },
    { key: 'metaDescription', label: 'توضیحات متا', type: 'textarea', fullWidth: true },
    { key: 'metaKeywords', label: 'کلمات کلیدی متا' },
  ];

  const columns = [
    { key: 'siteName', label: 'نام سایت', render: (i: SiteSettings) => i.siteName || '-' },
    { key: 'email', label: 'ایمیل', render: (i: SiteSettings) => i.email || '-' },
    { key: 'phone', label: 'تلفن', render: (i: SiteSettings) => i.phone || '-' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><SettingsIcon className="w-6 h-6" />تنظیمات سایت</h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} رکورد</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}><RefreshCw className={`w-4 h-4 ml-1 ${isLoading ? 'animate-spin' : ''}`} />بروزرسانی</Button>
          <Button size="sm" className="btn-primary" onClick={() => { setEditingItem(null); setIsFormOpen(true); }}><Plus className="w-4 h-4 ml-1" />تنظیمات جدید</Button>
        </div>
      </div>
      <Card className="glass"><CardContent className="p-6">
        <DataTable data={items} columns={columns} loading={isLoading} onView={handleView} onEdit={(i) => { setEditingItem(i); setIsFormOpen(true); }} onDelete={(i) => setDeleteId(i.id)} emptyMessage="تنظیماتی یافت نشد" />
      </CardContent></Card>
      <ConfirmDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)} title="حذف تنظیمات" description="آیا از حذف اطمینان دارید؟" onConfirm={handleDelete} loading={isDeleting} />
      <EntityFormModal open={isFormOpen} onOpenChange={setIsFormOpen} title={editingItem ? 'ویرایش تنظیمات سایت' : 'تنظیمات جدید'} fields={fields}
        initialValues={editingItem ? { siteName: editingItem.siteName || '', logo: editingItem.logo || '', darkLogo: editingItem.darkLogo || '', favicon: editingItem.favicon || '', email: editingItem.email || '', phone: editingItem.phone || '', address: editingItem.address || '', footerText: editingItem.footerText || '', copyright: editingItem.copyright || '', googleMap: editingItem.googleMap || '', googleAnalytics: editingItem.googleAnalytics || '', metaTitle: editingItem.metaTitle || '', metaDescription: editingItem.metaDescription || '', metaKeywords: editingItem.metaKeywords || '' } : undefined}
        onSubmit={handleSubmit} />
      <ViewDetailModal
        open={!!viewItem || viewLoading}
        onClose={() => { setViewItem(null); setViewError(null); setViewLoading(false); }}
        title="جزئیات تنظیمات سایت"
        loading={viewLoading}
        error={viewError}
        fields={viewItem ? [
          { label: 'شناسه', value: viewItem.id },
          { label: 'نام سایت', value: viewItem.siteName || '-' },
          { label: 'ایمیل', value: viewItem.email || '-' },
          { label: 'تلفن', value: viewItem.phone || '-' },
          { label: 'آدرس', value: viewItem.address || '-', fullWidth: true },
          { label: 'متن فوتر', value: viewItem.footerText || '-', fullWidth: true },
          { label: 'کپی‌رایت', value: viewItem.copyright || '-' },
          { label: 'Google Analytics', value: viewItem.googleAnalytics || '-' },
          { label: 'عنوان متا', value: viewItem.metaTitle || '-' },
          { label: 'توضیحات متا', value: viewItem.metaDescription || '-', fullWidth: true },
          { label: 'کلمات کلیدی متا', value: viewItem.metaKeywords || '-' },
          { label: 'تاریخ ایجاد', value: viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleString('fa-IR') : '-' },
        ] : []}
      />
    </div>
  );
}
