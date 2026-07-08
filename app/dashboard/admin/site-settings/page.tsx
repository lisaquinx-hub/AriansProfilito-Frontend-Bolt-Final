'use client';

import { useEffect, useState } from 'react';
import { Settings, RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
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

  const fetchData = async () => {
    setIsLoading(true);
    const data = await adminSiteSettingsService.getAll();
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
      await adminSiteSettingsService.delete(deleteId);
      setItems(items.filter(i => i.id !== deleteId));
      setDeleteId(null);
      toast.success('رکورد با موفقیت حذف شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
    setIsDeleting(false);
  };

  const handleEdit = (item: SiteSettings) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    if (editingItem) {
      await adminSiteSettingsService.update(editingItem.id, data as Partial<SiteSettings>);
      toast.success('تنظیمات با موفقیت ویرایش شد');
    } else {
      await adminSiteSettingsService.create(data as Partial<SiteSettings>);
      toast.success('تنظیمات با موفقیت ایجاد شد');
    }
    fetchData();
  };

  const fields: FormField[] = [
    { key: 'siteName', label: 'نام سایت', type: 'text' },
    { key: 'logo', label: 'لوگو', type: 'url' },
    { key: 'darkLogo', label: 'لوگوی تاریک', type: 'url' },
    { key: 'favicon', label: 'فاویکون', type: 'url' },
    { key: 'email', label: 'ایمیل', type: 'email' },
    { key: 'phone', label: 'تلفن', type: 'text' },
    { key: 'address', label: 'آدرس', type: 'textarea', fullWidth: true },
    { key: 'footerText', label: 'متن فوتر', type: 'text' },
    { key: 'footerDescription', label: 'توضیحات فوتر', type: 'textarea', fullWidth: true },
    { key: 'copyright', label: 'کپی‌رایت', type: 'text' },
    { key: 'metaTitle', label: 'عنوان متا', type: 'text' },
    { key: 'metaDescription', label: 'توضیحات متا', type: 'textarea', fullWidth: true },
    { key: 'metaKeywords', label: 'کلمات کلیدی متا', type: 'text' },
  ];

  const columns = [
    { key: 'siteName', label: 'نام سایت', render: (item: SiteSettings) => item.siteName || '-' },
    { key: 'email', label: 'ایمیل', render: (item: SiteSettings) => item.email || '-' },
    { key: 'phone', label: 'تلفن', render: (item: SiteSettings) => item.phone || item.phoneNumber || '-' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6" />
            مدیریت تنظیمات سایت
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
            onEdit={handleEdit}
            onDelete={(item) => setDeleteId(item.id)}
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
        title={editingItem ? 'ویرایش تنظیمات سایت' : 'ایجاد تنظیمات سایت جدید'}
        fields={fields}
        initialValues={editingItem ? { ...editingItem } as Record<string, unknown> : undefined}
        onSubmit={handleSubmit}
        submitLabel={editingItem ? 'ذخیره تغییرات' : 'ایجاد'}
      />
    </div>
  );
}
