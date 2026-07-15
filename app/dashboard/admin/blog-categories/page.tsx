'use client';

import { useEffect, useState } from 'react';
import { FolderOpen, RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import {
  adminBlogCategoriesService,
  CreateBlogCategoryDto,
} from '@/services/admin/BlogCategoriesService';
import { BlogCategory } from '@/types/api';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { ViewDetailModal } from '@/components/admin/ViewDetailModal';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/services/api';

export default function AdminBlogCategoriesPage() {
  const [items, setItems] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BlogCategory | null>(null);

  const [viewItem, setViewItem] = useState<BlogCategory | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await adminBlogCategoriesService.getAll();
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
      await adminBlogCategoriesService.delete(deleteId);
      setItems(items.filter(i => i.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete:', error);
    }
    setIsDeleting(false);
  };

  const handleEdit = (item: BlogCategory) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleView = async (item: BlogCategory) => {
    setViewItem({ ...item });
    setViewError(null);
    setViewLoading(true);
    try {
      const detail = await adminBlogCategoriesService.getById(item.id);
      if (detail) setViewItem(detail);
    } catch (err) {
      setViewError(getApiErrorMessage(err));
    } finally {
      setViewLoading(false);
    }
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    const payload: CreateBlogCategoryDto = {
      name: String(data.name || '').trim(),
      slug: String(data.slug || '').trim(),
      description: editingItem?.description || null,
      isActive: editingItem?.isActive ?? true,
    };

    try {
      if (editingItem) {
        await adminBlogCategoriesService.update(editingItem.id, payload);
        toast.success('دسته‌بندی با موفقیت ویرایش شد');
      } else {
        await adminBlogCategoriesService.create(payload);
        toast.success('دسته‌بندی با موفقیت ایجاد شد');
      }
      fetchData();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      throw error;
    }
  };

  const fields: FormField[] = [
    { key: 'name', label: 'نام', required: true },
    { key: 'slug', label: 'اسلاگ' },
  ];

  const columns = [
    { key: 'name', label: 'نام' },
    { key: 'slug', label: 'اسلاگ' },
    { key: 'publishedPostCount', label: 'تعداد پست', render: (item: BlogCategory) => item.publishedPostCount || 0 },
    {
      key: 'createdAt',
      label: 'تاریخ',
      render: (item: BlogCategory) => item.createdAt ? new Date(item.createdAt).toLocaleDateString('fa-IR') : '-',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FolderOpen className="w-6 h-6" />
            مدیریت دسته‌بندی وبلاگ
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} دسته‌بندی</p>
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
            emptyMessage="دسته‌بندی یافت نشد"
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف دسته‌بندی"
        description="آیا از حذف این دسته‌بندی اطمینان دارید؟"
        onConfirm={handleDelete}
        loading={isDeleting}
      />

      <EntityFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={editingItem ? 'ویرایش دسته‌بندی' : 'ایجاد دسته‌بندی جدید'}
        fields={fields}
        initialValues={editingItem ? { ...editingItem } as Record<string, unknown> : undefined}
        onSubmit={handleSubmit}
        submitLabel={editingItem ? 'ذخیره تغییرات' : 'ایجاد'}
      />

      <ViewDetailModal
        open={!!viewItem || viewLoading}
        onClose={() => { setViewItem(null); setViewError(null); setViewLoading(false); }}
        title="جزئیات دسته‌بندی"
        loading={viewLoading}
        error={viewError}
        fields={viewItem ? [
          { label: 'شناسه', value: viewItem.id },
          { label: 'نام', value: viewItem.name },
          { label: 'اسلاگ', value: viewItem.slug || '-' },
          { label: 'تعداد پست‌های منتشر شده', value: viewItem.publishedPostCount || 0 },
          { label: 'تاریخ ایجاد', value: viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleString('fa-IR') : '-' },
        ] : []}
      />
    </div>
  );
}
