'use client';

import { useEffect, useState } from 'react';
import { Briefcase, RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { adminProjectsService } from '@/services/admin/ProjectsService';
import { Project } from '@/types/api';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/services/api';

export default function AdminProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Project | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await adminProjectsService.getAll();
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
      await adminProjectsService.delete(deleteId);
      setItems(items.filter(i => i.id !== deleteId));
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

  const handleSubmit = async (data: Record<string, unknown>) => {
    const submitData = {
      ...data,
      displayOrder: data.displayOrder ? Number(data.displayOrder) : undefined,
    };
    if (editingItem) {
      await adminProjectsService.update(editingItem.id, submitData as Partial<Project>);
      toast.success('پروژه با موفقیت ویرایش شد');
    } else {
      await adminProjectsService.create(submitData as Partial<Project>);
      toast.success('پروژه با موفقیت ایجاد شد');
    }
    fetchData();
  };

  const fields: FormField[] = [
    { key: 'title', label: 'عنوان', required: true },
    { key: 'slug', label: 'اسلاگ', type: 'text' },
    { key: 'description', label: 'توضیحات کوتاه', type: 'textarea', required: true },
    { key: 'longDescription', label: 'توضیحات کامل', type: 'textarea', fullWidth: true, rows: 5 },
    { key: 'category', label: 'دسته‌بندی', type: 'text' },
    { key: 'metric', label: 'معیار', type: 'text' },
    { key: 'metricValue', label: 'مقدار معیار', type: 'text' },
    { key: 'image', label: 'تصویر', type: 'url' },
    { key: 'featured', label: 'ویژه', type: 'switch' },
    { key: 'completionTime', label: 'زمان تکمیل', type: 'text' },
    { key: 'startingPrice', label: 'قیمت شروع', type: 'text' },
    { key: 'clientName', label: 'نام مشتری', type: 'text' },
    { key: 'projectUrl', label: 'آدرس پروژه', type: 'url' },
    { key: 'isActive', label: 'فعال', type: 'switch' },
    { key: 'displayOrder', label: 'ترتیب نمایش', type: 'number' },
  ];

  const columns = [
    { key: 'title', label: 'عنوان' },
    { key: 'category', label: 'دسته', render: (item: Project) => item.category || '-' },
    {
      key: 'featured',
      label: 'ویژه',
      render: (item: Project) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          item.featured ? 'bg-yellow-500/10 text-yellow-500' : 'bg-gray-500/10 text-gray-500'
        }`}>
          {item.featured ? 'بله' : 'خیر'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'تاریخ',
      render: (item: Project) => item.createdAt ? new Date(item.createdAt).toLocaleDateString('fa-IR') : '-',
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
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="w-4 h-4 ml-1" />
            بروزرسانی
          </Button>
          <Button size="sm" className="btn-primary" onClick={handleCreate}>
            <Plus className="w-4 h-4 ml-1" />
            ایجاد پروژه
          </Button>
        </div>
      </div>

      <Card className="glass">
        <CardContent className="p-6">
          <DataTable
            data={items}
            columns={columns}
            loading={isLoading}
            onEdit={handleEdit}
            onDelete={(item) => setDeleteId(item.id)}
            emptyMessage="پروژه‌ای یافت نشد"
          />
        </CardContent>
      </Card>

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
        fields={fields}
        initialValues={editingItem ? { ...editingItem } as Record<string, unknown> : undefined}
        onSubmit={handleSubmit}
        submitLabel={editingItem ? 'ذخیره تغییرات' : 'ایجاد پروژه'}
      />
    </div>
  );
}
