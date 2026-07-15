'use client';

import { useEffect, useState } from 'react';
import { Briefcase, RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { adminServicesService, CreateServiceDto } from '@/services/admin/ServicesService';
import { Service } from '@/types/api';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { ViewDetailModal } from '@/components/admin/ViewDetailModal';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/services/api';

export default function AdminServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Service | null>(null);
  const [viewItem, setViewItem] = useState<Service | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await adminServicesService.getAll();
    setItems(data);
    setIsLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleView = async (item: Service) => {
    setViewItem(null);
    setViewError(null);
    setViewLoading(true);
    // open modal immediately, load detail
    setViewItem({ ...item });
    try {
      const detail = await adminServicesService.getById(item.id);
      if (detail) setViewItem(detail);
    } catch (err) {
      setViewError(getApiErrorMessage(err));
    } finally {
      setViewLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await adminServicesService.delete(deleteId);
      setItems(prev => prev.filter(i => i.id !== deleteId));
      setDeleteId(null);
      toast.success('سرویس با موفقیت حذف شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
    setIsDeleting(false);
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    const featuresText = String(data.featuresText || '');
    const features = featuresText.split('\n').map((s, i) => ({ title: s.trim(), displayOrder: i })).filter(f => f.title);
    const payload: CreateServiceDto = {
      title: String(data.title || '').trim(),
      slug: String(data.slug || '') || undefined,
      thumbnail: String(data.thumbnail || '').trim(),
      coverImage: String(data.coverImage || '').trim(),
      shortDescription: String(data.shortDescription || '') || undefined,
      description: String(data.description || '').trim(),
      estimatedDeliveryDays: Number(data.estimatedDeliveryDays) || 0,
      isFeatured: Boolean(data.isFeatured),
      displayOrder: Number(data.displayOrder) || 0,
      icon: String(data.icon || '') || undefined,
      isActive: Boolean(data.isActive ?? true),
      features,
    };
    try {
      if (editingItem) {
        await adminServicesService.update(editingItem.id, payload);
        toast.success('سرویس با موفقیت ویرایش شد');
      } else {
        await adminServicesService.create(payload);
        toast.success('سرویس با موفقیت ایجاد شد');
      }
      fetchData();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      throw error;
    }
  };

  const fields: FormField[] = [
    { key: 'title', label: 'عنوان', required: true, fullWidth: true },
    { key: 'slug', label: 'Slug' },
    { key: 'thumbnail', label: 'تصویر کوچک (URL)', type: 'url' },
    { key: 'coverImage', label: 'تصویر اصلی (URL)', type: 'url' },
    { key: 'shortDescription', label: 'توضیح کوتاه', type: 'textarea', fullWidth: true },
    { key: 'description', label: 'توضیحات کامل', type: 'textarea', required: true, fullWidth: true, rows: 5 },
    { key: 'estimatedDeliveryDays', label: 'روزهای تحویل', type: 'number' },
    { key: 'displayOrder', label: 'ترتیب نمایش', type: 'number' },
    { key: 'icon', label: 'آیکون' },
    { key: 'isFeatured', label: 'ویژه', type: 'switch' },
    { key: 'isActive', label: 'فعال', type: 'switch' },
    { key: 'featuresText', label: 'ویژگی‌ها (هر خط یک ویژگی)', type: 'textarea', fullWidth: true, rows: 4 },
  ];

  const columns = [
    { key: 'title', label: 'عنوان' },
    { key: 'description', label: 'توضیحات', render: (i: Service) => <div className="max-w-xs truncate text-sm">{i.shortDescription || i.description}</div> },
    { key: 'isActive', label: 'وضعیت', render: (i: Service) => (
      <span className={`px-2 py-1 rounded-full text-xs ${i.isActive ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-400'}`}>
        {i.isActive ? 'فعال' : 'غیرفعال'}
      </span>
    )},
    { key: 'isFeatured', label: 'ویژه', render: (i: Service) => i.isFeatured ? 'بله' : 'خیر' },
  ];

  const viewFields = viewItem ? [
    { label: 'شناسه', value: viewItem.id },
    { label: 'عنوان', value: viewItem.title },
    { label: 'Slug', value: viewItem.slug },
    { label: 'وضعیت', value: viewItem.isActive ? 'فعال' : 'غیرفعال' },
    { label: 'ویژه', value: viewItem.isFeatured ? 'بله' : 'خیر' },
    { label: 'روزهای تحویل', value: viewItem.estimatedDeliveryDays },
    { label: 'ترتیب نمایش', value: viewItem.displayOrder },
    { label: 'آیکون', value: viewItem.icon },
    { label: 'توضیح کوتاه', value: viewItem.shortDescription, fullWidth: true },
    { label: 'توضیحات', value: viewItem.description, fullWidth: true },
    { label: 'ویژگی‌ها', value: viewItem.features?.map(f => f.title).join(' | ') || '-', fullWidth: true },
    { label: 'تاریخ ایجاد', value: viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleDateString('fa-IR') : '-' },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Briefcase className="w-6 h-6" />مدیریت خدمات</h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} خدمت</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}><RefreshCw className={`w-4 h-4 ml-1 ${isLoading ? 'animate-spin' : ''}`} />به‌روزرسانی</Button>
          <Button size="sm" className="btn-primary" onClick={() => { setEditingItem(null); setIsFormOpen(true); }}><Plus className="w-4 h-4 ml-1" />ایجاد</Button>
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
            entityLabel: 'خدمت',
            getById: (id) => adminServicesService.getById(id),
          }}
          emptyMessage="خدمتی یافت نشد"
        />
      </CardContent></Card>
      <ConfirmDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)} title="حذف خدمت" description="آیا از حذف این خدمت اطمینان دارید؟" onConfirm={handleDelete} loading={isDeleting} />
      <EntityFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={editingItem ? 'ویرایش خدمت' : 'خدمت جدید'}
        fields={fields}
        initialValues={editingItem ? {
          title: editingItem.title, slug: editingItem.slug || '', thumbnail: editingItem.thumbnail || '',
          coverImage: editingItem.coverImage || '', shortDescription: editingItem.shortDescription || '',
          description: editingItem.description, estimatedDeliveryDays: editingItem.estimatedDeliveryDays || 0,
          displayOrder: editingItem.displayOrder || 0, icon: editingItem.icon || '',
          isFeatured: editingItem.isFeatured || false, isActive: editingItem.isActive ?? true,
          featuresText: (editingItem.features || []).map(f => f.title).join('\n'),
        } : undefined}
        onSubmit={handleSubmit}
      />
      <ViewDetailModal
        open={!!viewItem || viewLoading}
        onClose={() => { setViewItem(null); setViewError(null); setViewLoading(false); }}
        title="جزئیات خدمت"
        loading={viewLoading}
        error={viewError}
        fields={viewFields}
      />
    </div>
  );
}
