'use client';

import { useEffect, useState } from 'react';
import { HelpCircle, RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { adminFaqService } from '@/services/admin/FaqService';
import { FAQ } from '@/types/api';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { ViewDetailModal } from '@/components/admin/ViewDetailModal';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/services/api';

export default function AdminFaqsPage() {
  const [items, setItems] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQ | null>(null);

  const [viewItem, setViewItem] = useState<FAQ | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await adminFaqService.getAll();
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
      await adminFaqService.delete(deleteId);
      setItems(items.filter(i => i.id !== deleteId));
      setDeleteId(null);
      toast.success('سؤال با موفقیت حذف شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (item: FAQ) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleView = async (item: FAQ) => {
    setViewItem({ ...item });
    setViewError(null);
    setViewLoading(true);
    try {
      const detail = await adminFaqService.getById(item.id);
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
        await adminFaqService.update(editingItem.id, submitData as Partial<FAQ>);
        toast.success('سؤال با موفقیت ویرایش شد');
      } else {
        await adminFaqService.create(submitData as Partial<FAQ>);
        toast.success('سؤال با موفقیت ایجاد شد');
      }
      fetchData();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      throw error;
    }
  };

  const fields: FormField[] = [
    { key: 'question', label: 'سؤال', required: true },
    { key: 'answer', label: 'پاسخ', type: 'textarea', required: true, fullWidth: true },
    { key: 'displayOrder', label: 'ترتیب نمایش', type: 'number' },
    { key: 'isActive', label: 'فعال', type: 'switch' },
  ];

  const columns = [
    { key: 'question', label: 'سؤال', render: (item: FAQ) => (
      <div className="max-w-xs truncate font-medium">{item.question}</div>
    )},
    { key: 'answer', label: 'پاسخ', render: (item: FAQ) => (
      <div className="max-w-xs truncate text-sm text-muted-foreground">{item.answer}</div>
    )},
    {
      key: 'displayOrder',
      label: 'ترتیب',
      render: (item: FAQ) => item.displayOrder || 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <HelpCircle className="w-6 h-6" />
            مدیریت سؤالات متداول
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} سؤال</p>
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
            idLookup={{
              entityLabel: 'سؤال متداول',
              getById: (id) => adminFaqService.getById(id),
            }}
            emptyMessage="سؤالی یافت نشد"
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف سؤال"
        description="آیا از حذف این سؤال اطمینان دارید؟"
        onConfirm={handleDelete}
        loading={isDeleting}
      />

      <EntityFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={editingItem ? 'ویرایش سؤال' : 'ایجاد سؤال جدید'}
        fields={fields}
        initialValues={editingItem ? { ...editingItem } as Record<string, unknown> : undefined}
        onSubmit={handleSubmit}
        submitLabel={editingItem ? 'ذخیره تغییرات' : 'ایجاد'}
      />

      <ViewDetailModal
        open={!!viewItem || viewLoading}
        onClose={() => { setViewItem(null); setViewError(null); setViewLoading(false); }}
        title="جزئیات سؤال متداول"
        loading={viewLoading}
        error={viewError}
        fields={viewItem ? [
          { label: 'شناسه', value: viewItem.id },
          { label: 'سؤال', value: viewItem.question, fullWidth: true },
          { label: 'پاسخ', value: viewItem.answer, fullWidth: true },
          { label: 'ترتیب نمایش', value: viewItem.displayOrder ?? '-' },
          { label: 'وضعیت', value: viewItem.isActive ? 'فعال' : 'غیرفعال' },
          { label: 'تاریخ ایجاد', value: viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleString('fa-IR') : '-' },
        ] : []}
      />
    </div>
  );
}
