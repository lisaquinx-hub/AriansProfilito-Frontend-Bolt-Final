'use client';

import { useEffect, useMemo, useState } from 'react';
import { Images, Plus, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmDialog, DataTable } from '@/components/admin/DataTable';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { ViewDetailModal } from '@/components/admin/ViewDetailModal';
import {
  adminPortfolioService,
  CreatePortfolioDto,
} from '@/services/admin/PortfolioService';
import { portfolioService } from '@/services/PortfolioService';
import { getApiErrorMessage } from '@/services/api';
import { PortfolioCategory, PortfolioDetail } from '@/types/api';

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioDetail[]>([]);
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioDetail | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewItem, setViewItem] = useState<PortfolioDetail | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [portfolioItems, portfolioCategories] = await Promise.all([
        adminPortfolioService.getAll(),
        portfolioService.getCategories(),
      ]);
      setItems(Array.isArray(portfolioItems) ? portfolioItems : []);
      setCategories(Array.isArray(portfolioCategories) ? portfolioCategories : []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const handleView = async (item: PortfolioDetail) => {
    setViewItem({ ...item });
    setViewError(null);
    setViewLoading(true);
    try {
      const detail = await adminPortfolioService.getById(item.id);
      if (detail) setViewItem(detail);
    } catch (error) {
      setViewError(getApiErrorMessage(error));
    } finally {
      setViewLoading(false);
    }
  };

  const handleEdit = async (item: PortfolioDetail) => {
    try {
      const detail = await adminPortfolioService.getById(item.id);
      if (!detail) {
        toast.error('اطلاعات کامل نمونه‌کار دریافت نشد');
        return;
      }
      setEditingItem(detail);
      setIsFormOpen(true);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    const payload: CreatePortfolioDto = {
      title: String(data.title || '').trim(),
      slug: String(data.slug || '').trim(),
      description: String(data.description || '').trim(),
      shortDescription: String(data.shortDescription || '').trim() || null,
      clientName: String(data.clientName || '').trim(),
      projectDate: String(data.projectDate || ''),
      thumbnail: String(data.thumbnail || '').trim(),
      websiteUrl: String(data.websiteUrl || '').trim(),
      githubUrl: String(data.githubUrl || '').trim() || null,
      isFeatured: Boolean(data.isFeatured),
      displayOrder: Number(data.displayOrder) || 0,
      categoryId: String(data.categoryId || '').trim(),
    };

    try {
      if (editingItem) {
        await adminPortfolioService.update(editingItem.id, payload);
        toast.success('نمونه‌کار با موفقیت ویرایش شد');
      } else {
        await adminPortfolioService.create(payload);
        toast.success('نمونه‌کار با موفقیت ایجاد شد');
      }
      await fetchData();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await adminPortfolioService.delete(deleteId);
      setItems((current) => current.filter((item) => item.id !== deleteId));
      setDeleteId(null);
      toast.success('نمونه‌کار با موفقیت حذف شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const fields = useMemo<FormField[]>(() => [
    { key: 'title', label: 'عنوان', required: true, fullWidth: true },
    { key: 'slug', label: 'Slug', required: true },
    {
      key: 'categoryId',
      label: 'دسته‌بندی',
      type: 'select',
      required: true,
      options: categories.map((category) => ({ value: category.id, label: category.name })),
    },
    { key: 'clientName', label: 'نام مشتری', required: true },
    { key: 'projectDate', label: 'تاریخ پروژه', type: 'datetime-local', required: true },
    { key: 'shortDescription', label: 'توضیح کوتاه', type: 'textarea', fullWidth: true },
    { key: 'description', label: 'توضیحات کامل', type: 'textarea', rows: 7, required: true, fullWidth: true },
    {
      key: 'thumbnail',
      label: 'تصویر شاخص',
      type: 'url',
      placeholder: 'لینک مستقیم HTTPS تصویر',
      required: true,
      fullWidth: true,
    },
    { key: 'websiteUrl', label: 'آدرس وب‌سایت', type: 'url', required: true, fullWidth: true },
    { key: 'githubUrl', label: 'آدرس GitHub', type: 'url', fullWidth: true },
    { key: 'displayOrder', label: 'ترتیب نمایش', type: 'number' },
    { key: 'isFeatured', label: 'نمونه‌کار ویژه', type: 'switch' },
  ], [categories]);

  const columns = [
    { key: 'title', label: 'عنوان', render: (item: PortfolioDetail) => <div className="max-w-xs truncate">{item.title}</div> },
    { key: 'clientName', label: 'مشتری' },
    { key: 'categoryName', label: 'دسته‌بندی', render: (item: PortfolioDetail) => item.categoryName || '-' },
    {
      key: 'isFeatured',
      label: 'وضعیت',
      render: (item: PortfolioDetail) => (
        <span className={`rounded-full px-2 py-1 text-xs ${item.isFeatured ? 'bg-amber-500/10 text-amber-500' : 'bg-gray-500/10 text-gray-400'}`}>
          {item.isFeatured ? 'ویژه' : 'عادی'}
        </span>
      ),
    },
    { key: 'displayOrder', label: 'ترتیب' },
    {
      key: 'projectDate',
      label: 'تاریخ پروژه',
      render: (item: PortfolioDetail) => item.projectDate
        ? new Date(item.projectDate).toLocaleString('fa-IR')
        : '-',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Images className="h-6 w-6" />
            مدیریت نمونه‌کارها
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{items.length} نمونه‌کار</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => void fetchData()} disabled={isLoading}>
            <RefreshCw className={`ml-1 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            به‌روزرسانی
          </Button>
          <Button
            size="sm"
            className="btn-primary"
            onClick={() => {
              setEditingItem(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="ml-1 h-4 w-4" />
            نمونه‌کار جدید
          </Button>
        </div>
      </div>

      <Card className="glass">
        <CardContent className="p-4 sm:p-6">
          <DataTable
            data={items}
            columns={columns}
            loading={isLoading}
            onView={(item) => void handleView(item)}
            onEdit={(item) => void handleEdit(item)}
            onDelete={(item) => setDeleteId(item.id)}
            idLookup={{
              entityLabel: 'نمونه‌کار',
              getById: (id) => adminPortfolioService.getById(id),
            }}
            emptyMessage="نمونه‌کاری یافت نشد"
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف نمونه‌کار"
        description="آیا از حذف این نمونه‌کار اطمینان دارید؟"
        onConfirm={handleDelete}
        loading={isDeleting}
      />

      <EntityFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={editingItem ? 'ویرایش نمونه‌کار' : 'نمونه‌کار جدید'}
        fields={fields}
        initialValues={editingItem ? {
          title: editingItem.title,
          slug: editingItem.slug,
          categoryId: editingItem.categoryId,
          clientName: editingItem.clientName,
          projectDate: editingItem.projectDate,
          shortDescription: editingItem.shortDescription || '',
          description: editingItem.description,
          thumbnail: editingItem.thumbnail,
          websiteUrl: editingItem.websiteUrl,
          githubUrl: editingItem.githubUrl || '',
          displayOrder: editingItem.displayOrder,
          isFeatured: editingItem.isFeatured,
        } : undefined}
        onSubmit={handleSubmit}
        submitLabel={editingItem ? 'ذخیره تغییرات' : 'ایجاد'}
      />

      <ViewDetailModal
        open={Boolean(viewItem) || viewLoading}
        onClose={() => {
          setViewItem(null);
          setViewError(null);
          setViewLoading(false);
        }}
        title="جزئیات نمونه‌کار"
        loading={viewLoading}
        error={viewError}
        fields={viewItem ? [
          { label: 'شناسه', value: viewItem.id },
          { label: 'عنوان', value: viewItem.title },
          { label: 'Slug', value: viewItem.slug },
          { label: 'دسته‌بندی', value: viewItem.categoryName || '-' },
          { label: 'مشتری', value: viewItem.clientName },
          { label: 'تاریخ پروژه', value: new Date(viewItem.projectDate).toLocaleString('fa-IR') },
          { label: 'ترتیب نمایش', value: viewItem.displayOrder },
          { label: 'وضعیت', value: viewItem.isFeatured ? 'ویژه' : 'عادی' },
          { label: 'توضیح کوتاه', value: viewItem.shortDescription || '-', fullWidth: true },
          { label: 'توضیحات', value: viewItem.description, fullWidth: true },
          { label: 'وب‌سایت', value: viewItem.websiteUrl || '-', fullWidth: true },
          { label: 'GitHub', value: viewItem.githubUrl || '-', fullWidth: true },
        ] : []}
      />
    </div>
  );
}
