'use client';

import { useEffect, useState } from 'react';
import { Mail, RefreshCw, Plus, ToggleLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { adminEmailTemplatesService } from '@/services/admin/EmailTemplatesService';
import { EmailTemplate } from '@/types/api';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { ViewDetailModal } from '@/components/admin/ViewDetailModal';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/services/api';

export default function AdminEmailTemplatesPage() {
  const [items, setItems] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EmailTemplate | null>(null);

  const [viewItem, setViewItem] = useState<EmailTemplate | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await adminEmailTemplatesService.getAll();
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
      await adminEmailTemplatesService.delete(deleteId);
      setItems(items.filter(i => i.id !== deleteId));
      setDeleteId(null);
      toast.success('قالب با موفقیت حذف شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
    setIsDeleting(false);
  };

  const handleToggleActive = async (item: EmailTemplate) => {
    try {
      await adminEmailTemplatesService.updateActiveStatus(item.id, !item.isActive);
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, isActive: !i.isActive } : i));
      toast.success(item.isActive ? 'غیرفعال شد' : 'فعال شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleEdit = (item: EmailTemplate) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleView = async (item: EmailTemplate) => {
    setViewItem({ ...item });
    setViewError(null);
    setViewLoading(true);
    try {
      const detail = await adminEmailTemplatesService.getById(item.id);
      if (detail) setViewItem(detail);
    } catch (err) {
      setViewError(getApiErrorMessage(err));
    } finally {
      setViewLoading(false);
    }
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      if (editingItem) {
        await adminEmailTemplatesService.update(editingItem.id, data as Partial<EmailTemplate>);
        toast.success('قالب با موفقیت ویرایش شد');
      } else {
        await adminEmailTemplatesService.create(data as Partial<EmailTemplate>);
        toast.success('قالب با موفقیت ایجاد شد');
      }
      fetchData();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      throw error;
    }
  };

  const fields: FormField[] = [
    { key: 'name', label: 'نام', required: true },
    { key: 'subject', label: 'موضوع', required: true },
    { key: 'body', label: 'متن ایمیل', type: 'textarea', required: true, fullWidth: true },
    { key: 'isActive', label: 'فعال', type: 'switch' },
  ];

  const columns = [
    { key: 'name', label: 'نام' },
    { key: 'subject', label: 'موضوع' },
    {
      key: 'isActive',
      label: 'وضعیت',
      render: (item: EmailTemplate) => (
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
      render: (item: EmailTemplate) => item.createdAt ? new Date(item.createdAt).toLocaleDateString('fa-IR') : '-',
    },
  ];

  const extraActions = [
    {
      label: 'تغییر وضعیت فعال',
      icon: <ToggleLeft className="w-4 h-4" />,
      onClick: (item: EmailTemplate) => handleToggleActive(item),
      className: 'text-emerald-500 hover:text-emerald-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Mail className="w-6 h-6" />
            مدیریت قالب‌های ایمیل
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} قالب</p>
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
              entityLabel: 'قالب ایمیل',
              getById: (id) => adminEmailTemplatesService.getById(id),
            }}
            emptyMessage="قالبی یافت نشد"
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف قالب"
        description="آیا از حذف این قالب اطمینان دارید؟"
        onConfirm={handleDelete}
        loading={isDeleting}
      />

      <EntityFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={editingItem ? 'ویرایش قالب' : 'ایجاد قالب جدید'}
        fields={fields}
        initialValues={editingItem ? { ...editingItem } as Record<string, unknown> : undefined}
        onSubmit={handleSubmit}
        submitLabel={editingItem ? 'ذخیره تغییرات' : 'ایجاد'}
      />

      <ViewDetailModal
        open={!!viewItem || viewLoading}
        onClose={() => { setViewItem(null); setViewError(null); setViewLoading(false); }}
        title="جزئیات قالب ایمیل"
        loading={viewLoading}
        error={viewError}
        fields={viewItem ? [
          { label: 'شناسه', value: viewItem.id },
          { label: 'نام', value: viewItem.name },
          { label: 'موضوع', value: viewItem.subject },
          { label: 'وضعیت', value: viewItem.isActive ? 'فعال' : 'غیرفعال' },
          { label: 'متن ایمیل', value: viewItem.body || '-', fullWidth: true },
          { label: 'تاریخ ایجاد', value: viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleString('fa-IR') : '-' },
        ] : []}
      />
    </div>
  );
}
