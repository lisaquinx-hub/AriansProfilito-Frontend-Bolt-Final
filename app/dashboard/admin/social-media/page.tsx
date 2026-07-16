'use client';

import { useEffect, useState } from 'react';
import { Share2, RefreshCw, Plus, ToggleLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { adminSocialMediaService } from '@/services/admin/SocialMediaService';
import { SocialMedia } from '@/types/api';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { ViewDetailModal } from '@/components/admin/ViewDetailModal';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/services/api';
import { getSafeExternalUrl } from '@/lib/utils';

export default function AdminSocialMediaPage() {
  const [items, setItems] = useState<SocialMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SocialMedia | null>(null);

  const [viewItem, setViewItem] = useState<SocialMedia | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await adminSocialMediaService.getAll();
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
      await adminSocialMediaService.delete(deleteId);
      setItems(items.filter(i => i.id !== deleteId));
      setDeleteId(null);
      toast.success('شبکه اجتماعی با موفقیت حذف شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (item: SocialMedia) => {
    try {
      await adminSocialMediaService.updateActiveStatus(item.id, !item.isActive);
      setItems(items.map(i => i.id === item.id ? { ...i, isActive: !i.isActive } : i));
      toast.success('وضعیت شبکه اجتماعی تغییر کرد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleEdit = (item: SocialMedia) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleView = async (item: SocialMedia) => {
    setViewItem({ ...item });
    setViewError(null);
    setViewLoading(true);
    try {
      const detail = await adminSocialMediaService.getById(item.id);
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
        await adminSocialMediaService.update(editingItem.id, submitData as Partial<SocialMedia>);
        toast.success('شبکه اجتماعی با موفقیت ویرایش شد');
      } else {
        await adminSocialMediaService.create(submitData as Partial<SocialMedia>);
        toast.success('شبکه اجتماعی با موفقیت ایجاد شد');
      }
      fetchData();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      throw error;
    }
  };

  const fields: FormField[] = [
    { key: 'platform', label: 'پلتفرم', required: true },
    { key: 'url', label: 'لینک', type: 'url', required: true },
    {
      key: 'icon',
      label: 'لینک آیکون',
      type: 'url',
      placeholder: 'مثال: https://cdn.simpleicons.org/telegram/000000',
    },
    { key: 'displayOrder', label: 'ترتیب نمایش', type: 'number' },
    { key: 'isActive', label: 'فعال', type: 'switch' },
  ];

  const columns = [
    { key: 'platform', label: 'پلتفرم' },
    { key: 'url', label: 'لینک', render: (item: SocialMedia) => {
      const safeUrl = getSafeExternalUrl(item.url);
      return safeUrl ? (
        <a href={safeUrl} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:underline text-sm truncate max-w-xs block">
          {item.url}
        </a>
      ) : <span className="text-muted-foreground">-</span>;
    }},
    {
      key: 'isActive',
      label: 'وضعیت',
      render: (item: SocialMedia) => (
        <button
          onClick={() => handleToggleActive(item)}
          className={`px-2 py-1 rounded-full text-xs ${
            item.isActive ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'
          }`}
        >
          {item.isActive ? 'فعال' : 'غیرفعال'}
        </button>
      ),
    },
    { key: 'displayOrder', label: 'ترتیب', render: (item: SocialMedia) => item.displayOrder || 0 },
  ];

  const extraActions = [
    {
      label: 'تغییر وضعیت فعال',
      icon: <ToggleLeft className="w-4 h-4" />,
      onClick: (item: SocialMedia) => handleToggleActive(item),
      className: 'text-emerald-500 hover:text-emerald-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Share2 className="w-6 h-6" />
            مدیریت شبکه‌های اجتماعی
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} رکورد</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="w-4 h-4 ml-1" />
            به‌روزرسانی
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
            idLookup={{
              entityLabel: 'شبکه اجتماعی',
              getById: (id) => adminSocialMediaService.getById(id),
            }}
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
        title={editingItem ? 'ویرایش شبکه اجتماعی' : 'ایجاد شبکه اجتماعی جدید'}
        fields={fields}
        initialValues={editingItem ? { ...editingItem } as Record<string, unknown> : undefined}
        onSubmit={handleSubmit}
        submitLabel={editingItem ? 'ذخیره تغییرات' : 'ایجاد'}
      />

      <ViewDetailModal
        open={!!viewItem || viewLoading}
        onClose={() => { setViewItem(null); setViewError(null); setViewLoading(false); }}
        title="جزئیات شبکه اجتماعی"
        loading={viewLoading}
        error={viewError}
        fields={viewItem ? [
          { label: 'شناسه', value: viewItem.id },
          { label: 'پلتفرم', value: viewItem.platform },
          { label: 'لینک', value: viewItem.url },
          { label: 'آیکون', value: viewItem.icon || '-' },
          { label: 'ترتیب نمایش', value: viewItem.displayOrder ?? '-' },
          { label: 'وضعیت', value: viewItem.isActive ? 'فعال' : 'غیرفعال' },
          { label: 'تاریخ ایجاد', value: viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleString('fa-IR') : '-' },
        ] : []}
      />
    </div>
  );
}
