'use client';

import { useEffect, useState } from 'react';
import { Briefcase, RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { adminServicesService } from '@/services/admin/ServicesService';
import { Service } from '@/types/api';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/services/api';

export default function AdminServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Service | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await adminServicesService.getAll();
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
      await adminServicesService.delete(deleteId);
      setItems(items.filter(i => i.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete:', error);
    }
    setIsDeleting(false);
  };

  const handleEdit = (item: Service) => {
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
    try {
      if (editingItem) {
        await adminServicesService.update(editingItem.id, submitData as Partial<Service>);
        toast.success('سرویس با موفقیت ویرایش شد');
      } else {
        await adminServicesService.create(submitData as Partial<Service>);
        toast.success('سرویس با موفقیت ایجاد شد');
      }
      fetchData();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      throw error;
    }
  };

  const fields: FormField[] = [
    { key: 'title', label: 'عنوان', required: true },
    { key: 'description', label: 'توضیحات', type: 'textarea', required: true, fullWidth: true },
    { key: 'icon', label: 'آیکون' },
    { key: 'isActive', label: 'فعال', type: 'switch' },
    { key: 'displayOrder', label: 'ترتیب نمایش', type: 'number' },
  ];

  const columns = [
    { key: 'title', label: 'عنوان' },
    { key: 'description', label: 'توضیحات', render: (item: Service) => (
      <div className="max-w-xs truncate text-sm">{item.description}</div>
    )},
    {
      key: 'isActive',
      label: 'وضعیت',
      render: (item: Service) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          item.isActive ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'
        }`}>
          {item.isActive ? 'فعال' : 'غیرفعال'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="w-6 h-6" />
            مدیریت خدمات
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
        description="آیا از حذف این سرویس اطمینان دارید؟"
        onConfirm={handleDelete}
        loading={isDeleting}
      />

      <EntityFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={editingItem ? 'ویرایش سرویس' : 'ایجاد سرویس جدید'}
        fields={fields}
        initialValues={editingItem ? { ...editingItem } as Record<string, unknown> : undefined}
        onSubmit={handleSubmit}
        submitLabel={editingItem ? 'ذخیره تغییرات' : 'ایجاد'}
      />
    </div>
  );
}
