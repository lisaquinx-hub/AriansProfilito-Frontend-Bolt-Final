'use client';

import { useEffect, useState } from 'react';
import { Image as ImageIcon, RefreshCw, Plus, ToggleLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { adminHeroSectionsService } from '@/services/admin/HeroSectionsService';
import { HeroSection } from '@/types/api';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { ViewDetailModal } from '@/components/admin/ViewDetailModal';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/services/api';

export default function AdminHeroSectionsPage() {
  const [items, setItems] = useState<HeroSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HeroSection | null>(null);

  const [viewItem, setViewItem] = useState<HeroSection | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await adminHeroSectionsService.getAll();
    setItems(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await adminHeroSectionsService.delete(deleteId);
      setItems(items.filter(i => i.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete:', error);
    }
    setIsDeleting(false);
  };

  const handleEdit = (item: HeroSection) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleView = async (item: HeroSection) => {
    setViewItem({ ...item });
    setViewError(null);
    setViewLoading(true);
    try {
      const detail = await adminHeroSectionsService.getById(item.id);
      if (detail) setViewItem(detail);
    } catch (err) {
      setViewError(getApiErrorMessage(err));
    } finally {
      setViewLoading(false);
    }
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    const submitData = {
      ...data,
      displayOrder: data.displayOrder ? Number(data.displayOrder) : undefined,
    };
    try {
      if (editingItem) {
        await adminHeroSectionsService.update(editingItem.id, submitData as Partial<HeroSection>);
        toast.success('هیرو سکشن با موفقیت ویرایش شد');
      } else {
        await adminHeroSectionsService.create(submitData as Partial<HeroSection>);
        toast.success('هیرو سکشن با موفقیت ایجاد شد');
      }
      fetchData();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      throw error;
    }
  };

  const fields: FormField[] = [
    { key: 'title', label: 'عنوان', required: true },
    { key: 'subtitle', label: 'زیرعنوان' },
    { key: 'description', label: 'توضیحات', type: 'textarea', fullWidth: true },
    { key: 'primaryButtonText', label: 'متن دکمه اصلی' },
    { key: 'primaryButtonUrl', label: 'لینک دکمه اصلی' },
    { key: 'secondaryButtonText', label: 'متن دکمه فرعی' },
    { key: 'secondaryButtonUrl', label: 'لینک دکمه فرعی' },
    { key: 'backgroundImage', label: 'تصویر پس‌زمینه', type: 'url' },
    { key: 'videoUrl', label: 'لینک ویدیو', type: 'url' },
    { key: 'isActive', label: 'فعال', type: 'switch' },
    { key: 'displayOrder', label: 'ترتیب نمایش', type: 'number' },
  ];

  const handleToggleActive = async (item: HeroSection) => {
    try {
      await adminHeroSectionsService.updateActiveStatus(item.id, !item.isActive);
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, isActive: !i.isActive } : i));
      toast.success(item.isActive ? 'غیرفعال شد' : 'فعال شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const columns = [
    { key: 'title', label: 'عنوان' },
    { key: 'subtitle', label: 'زیرعنوان', render: (item: HeroSection) => item.subtitle || '-' },
    {
      key: 'isActive',
      label: 'وضعیت',
      render: (item: HeroSection) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          item.isActive ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'
        }`}>
          {item.isActive ? 'فعال' : 'غیرفعال'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'تاریخ',
      render: (item: HeroSection) => item.createdAt ? new Date(item.createdAt).toLocaleDateString('fa-IR') : '-',
    },
  ];

  const extraActions = [
    {
      label: 'تغییر وضعیت فعال',
      icon: <ToggleLeft className="w-4 h-4" />,
      onClick: (item: HeroSection) => handleToggleActive(item),
      className: 'text-emerald-500 hover:text-emerald-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ImageIcon className="w-6 h-6" />
            مدیریت هیرو سکشن‌ها
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} رکورد</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="w-4 h-4 ml-1" />
            بروزرسانی
          </Button>
          <Button size="sm" className="btn-primary" onClick={handleCreate}>
            <Plus className="w-4 h-4 ml-1" />
            ایجاد
          </Button>
        </div>
      </div>

      <Card className="glass">
        <CardContent className="p-6">
          <DataTable
            data={items}
            columns={columns}
            loading={isLoading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={(item) => setDeleteId(item.id)}
            extraActions={extraActions}
            emptyMessage="رکوردی یافت نشد"
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف رکورد"
        description="آیا از حذف این رکورد اطمینان دارید؟"
        onConfirm={handleDelete}
        loading={isDeleting}
      />

      <EntityFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={editingItem ? 'ویرایش هیرو سکشن' : 'ایجاد هیرو سکشن جدید'}
        fields={fields}
        initialValues={editingItem ? { ...editingItem } as Record<string, unknown> : undefined}
        onSubmit={handleSubmit}
        submitLabel={editingItem ? 'ذخیره تغییرات' : 'ایجاد'}
      />

      <ViewDetailModal
        open={!!viewItem || viewLoading}
        onClose={() => { setViewItem(null); setViewError(null); setViewLoading(false); }}
        title="جزئیات هیرو سکشن"
        loading={viewLoading}
        error={viewError}
        fields={viewItem ? [
          { label: 'شناسه', value: viewItem.id },
          { label: 'عنوان', value: viewItem.title },
          { label: 'زیرعنوان', value: viewItem.subtitle || '-' },
          { label: 'توضیحات', value: viewItem.description || '-', fullWidth: true },
          { label: 'متن دکمه اصلی', value: viewItem.primaryButtonText || '-' },
          { label: 'لینک دکمه اصلی', value: viewItem.primaryButtonUrl || '-' },
          { label: 'متن دکمه فرعی', value: viewItem.secondaryButtonText || '-' },
          { label: 'لینک دکمه فرعی', value: viewItem.secondaryButtonUrl || '-' },
          { label: 'وضعیت', value: viewItem.isActive ? 'فعال' : 'غیرفعال' },
          { label: 'تاریخ ایجاد', value: viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleString('fa-IR') : '-' },
        ] : []}
      />
    </div>
  );
}
