'use client';

import { useEffect, useState } from 'react';
import { Code, RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { adminTechnologiesService } from '@/services/admin/TechnologiesService';
import { Technology } from '@/types/api';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/services/api';

export default function AdminTechnologiesPage() {
  const [items, setItems] = useState<Technology[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Technology | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await adminTechnologiesService.getAll();
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
      await adminTechnologiesService.delete(deleteId);
      setItems(items.filter(i => i.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete:', error);
    }
    setIsDeleting(false);
  };

  const handleEdit = (item: Technology) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      if (editingItem) {
        await adminTechnologiesService.update(editingItem.id, data as Partial<Technology>);
        toast.success('تکنولوژی با موفقیت ویرایش شد');
      } else {
        await adminTechnologiesService.create(data as Partial<Technology>);
        toast.success('تکنولوژی با موفقیت ایجاد شد');
      }
      fetchData();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      throw error;
    }
  };

  const fields: FormField[] = [
    { key: 'name', label: 'نام', required: true },
    { key: 'icon', label: 'آیکون' },
    { key: 'color', label: 'رنگ' },
  ];

  const columns = [
    { key: 'name', label: 'نام' },
    { key: 'icon', label: 'آیکون', render: (item: Technology) => item.icon || '-' },
    { key: 'color', label: 'رنگ', render: (item: Technology) => item.color || '-' },
    { key: 'portfolioCount', label: 'پروژه‌ها', render: (item: Technology) => item.portfolioCount || 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Code className="w-6 h-6" />
            مدیریت تکنولوژی‌ها
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} تکنولوژی</p>
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
            emptyMessage="تکنولوژی یافت نشد"
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف تکنولوژی"
        description="آیا از حذف این تکنولوژی اطمینان دارید؟"
        onConfirm={handleDelete}
        loading={isDeleting}
      />

      <EntityFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={editingItem ? 'ویرایش تکنولوژی' : 'ایجاد تکنولوژی جدید'}
        fields={fields}
        initialValues={editingItem ? { ...editingItem } as Record<string, unknown> : undefined}
        onSubmit={handleSubmit}
        submitLabel={editingItem ? 'ذخیره تغییرات' : 'ایجاد'}
      />
    </div>
  );
}
