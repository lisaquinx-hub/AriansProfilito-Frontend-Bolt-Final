'use client';

import { useEffect, useState } from 'react';
import { FileText, RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { ViewDetailModal } from '@/components/admin/ViewDetailModal';
import { adminBlogPostsService } from '@/services/admin/BlogPostsService';
import { adminBlogCategoriesService } from '@/services/admin/BlogCategoriesService';
import { BlogPost, BlogCategory } from '@/types/api';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/services/api';

export default function AdminBlogPostsPage() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BlogPost | null>(null);

  const [viewItem, setViewItem] = useState<BlogPost | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const [posts, cats] = await Promise.all([
      adminBlogPostsService.getAll(),
      adminBlogCategoriesService.getAll(),
    ]);
    setItems(Array.isArray(posts) ? posts : []);
    setCategories(Array.isArray(cats) ? cats : []);
    setIsLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await adminBlogPostsService.delete(deleteId);
      setItems(prev => (Array.isArray(prev) ? prev : []).filter(i => i.id !== deleteId));
      setDeleteId(null);
      toast.success('پست با موفقیت حذف شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
    setIsDeleting(false);
  };

  const handleView = async (item: BlogPost) => {
    setViewItem({ ...item });
    setViewError(null);
    setViewLoading(true);
    try {
      const detail = await adminBlogPostsService.getById(item.id);
      if (detail) setViewItem(detail);
    } catch (err) {
      setViewError(getApiErrorMessage(err));
    } finally {
      setViewLoading(false);
    }
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    const payload = {
      title: String(data.title || '').trim(),
      slug: String(data.slug || '').trim(),
      excerpt: String(data.excerpt || '').trim(),
      content: String(data.content || '').trim(),
      coverImage: String(data.coverImage || '').trim(),
      readTime: Number(data.readTime) || 1,
      isPublished: Boolean(data.isPublished),
      publishedAt: data.publishedAt ? String(data.publishedAt) : undefined,
      seoTitle: String(data.seoTitle || '') || undefined,
      seoDescription: String(data.seoDescription || '') || undefined,
      keywords: String(data.keywords || '') || undefined,
      categoryId: String(data.categoryId || ''),
    };
    try {
      if (editingItem) {
        await adminBlogPostsService.update(editingItem.id, payload);
        toast.success('پست با موفقیت ویرایش شد');
      } else {
        await adminBlogPostsService.create(payload);
        toast.success('پست با موفقیت ایجاد شد');
      }
      fetchData();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      throw error;
    }
  };

  const fields: FormField[] = [
    { key: 'title', label: 'عنوان', required: true, fullWidth: true },
    { key: 'slug', label: 'Slug', required: true },
    {
      key: 'categoryId',
      label: 'دسته‌بندی',
      type: 'select',
      required: true,
      options: categories.map(c => ({ value: c.id, label: c.name })),
    },
    { key: 'excerpt', label: 'خلاصه', type: 'textarea', fullWidth: true },
    { key: 'content', label: 'متن', type: 'textarea', fullWidth: true, rows: 8 },
    { key: 'coverImage', label: 'تصویر شاخص', type: 'url', fullWidth: true },
    { key: 'readTime', label: 'زمان مطالعه (دقیقه)', type: 'number' },
    { key: 'publishedAt', label: 'تاریخ انتشار', type: 'datetime-local' },
    { key: 'isPublished', label: 'منتشرشده', type: 'switch' },
    { key: 'seoTitle', label: 'عنوان SEO', fullWidth: true },
    { key: 'seoDescription', label: 'توضیحات SEO', type: 'textarea', fullWidth: true },
    { key: 'keywords', label: 'کلمات کلیدی', fullWidth: true },
  ];

  const columns = [
    { key: 'title', label: 'عنوان', render: (item: BlogPost) => <div className="max-w-xs truncate">{item.title}</div> },
    { key: 'categoryName', label: 'دسته‌بندی', render: (item: BlogPost) => item.categoryName || '-' },
    {
      key: 'isPublished',
      label: 'وضعیت',
      render: (item: BlogPost) => (
        <span className={`px-2 py-1 rounded-full text-xs ${item.isPublished ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-400'}`}>
          {item.isPublished ? 'منتشرشده' : 'پیش‌نویس'}
        </span>
      ),
    },
    { key: 'readTime', label: 'مطالعه', render: (item: BlogPost) => `${item.readTime || 0} دقیقه` },
    {
      key: 'createdAt',
      label: 'تاریخ',
      render: (item: BlogPost) => item.createdAt ? new Date(item.createdAt).toLocaleDateString('fa-IR') : '-',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6" />مدیریت پست‌های وبلاگ
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} پست</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className={`w-4 h-4 ml-1 ${isLoading ? 'animate-spin' : ''}`} />به‌روزرسانی
          </Button>
          <Button size="sm" className="btn-primary" onClick={() => { setEditingItem(null); setIsFormOpen(true); }}>
            <Plus className="w-4 h-4 ml-1" />پست جدید
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
            onEdit={(item) => { setEditingItem(item); setIsFormOpen(true); }}
            onDelete={(item) => setDeleteId(item.id)}
            idLookup={{
              entityLabel: 'پست وبلاگ',
              getById: (id) => adminBlogPostsService.getById(id),
            }}
            emptyMessage="پستی یافت نشد"
          />
        </CardContent>
      </Card>
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف پست"
        description="آیا از حذف این پست اطمینان دارید؟"
        onConfirm={handleDelete}
        loading={isDeleting}
      />
      <EntityFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={editingItem ? 'ویرایش پست' : 'پست جدید'}
        fields={fields}
        initialValues={editingItem ? {
          title: editingItem.title,
          slug: editingItem.slug,
          excerpt: editingItem.excerpt || '',
          content: editingItem.content || '',
          coverImage: editingItem.coverImage || '',
          readTime: editingItem.readTime || 1,
          isPublished: editingItem.isPublished,
          publishedAt: editingItem.publishedAt ? editingItem.publishedAt.replace('Z','').slice(0,16) : '',
          seoTitle: editingItem.seoTitle || '',
          seoDescription: editingItem.seoDescription || '',
          keywords: editingItem.keywords || '',
          categoryId: editingItem.categoryId || '',
        } : undefined}
        onSubmit={handleSubmit}
      />
      <ViewDetailModal
        open={!!viewItem || viewLoading}
        onClose={() => { setViewItem(null); setViewError(null); setViewLoading(false); }}
        title="جزئیات پست وبلاگ"
        loading={viewLoading}
        error={viewError}
        fields={viewItem ? [
          { label: 'شناسه', value: viewItem.id },
          { label: 'عنوان', value: viewItem.title, fullWidth: true },
          { label: 'Slug', value: viewItem.slug },
          { label: 'دسته‌بندی', value: viewItem.categoryName || '-' },
          { label: 'وضعیت', value: viewItem.isPublished ? 'منتشرشده' : 'پیش‌نویس' },
          { label: 'زمان مطالعه', value: `${viewItem.readTime || 0} دقیقه` },
          { label: 'تاریخ انتشار', value: viewItem.publishedAt ? new Date(viewItem.publishedAt).toLocaleDateString('fa-IR') : '-' },
          { label: 'نویسنده', value: viewItem.authorName || '-' },
          { label: 'خلاصه', value: viewItem.excerpt || '-', fullWidth: true },
          { label: 'کلمات کلیدی', value: viewItem.keywords || '-', fullWidth: true },
          { label: 'تاریخ ایجاد', value: viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleString('fa-IR') : '-' },
        ] : []}
      />
    </div>
  );
}
