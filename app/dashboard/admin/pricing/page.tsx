'use client';

import { useEffect, useState } from 'react';
import { DollarSign, RefreshCw, Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { adminPricingService } from '@/services/admin/PricingService';
import { PricingPlan } from '@/types/api';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/services/api';

export default function AdminPricingPage() {
  const [items, setItems] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PricingPlan | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await adminPricingService.getAll();
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
      await adminPricingService.delete(deleteId);
      setItems(items.filter(i => i.id !== deleteId));
      setDeleteId(null);
      toast.success('پلن با موفقیت حذف شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
    setIsDeleting(false);
  };

  const handleEdit = (item: PricingPlan) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    const featuresStr = String(data.features || '');
    const submitData = {
      ...data,
      features: featuresStr ? featuresStr.split('\n').map((s: string) => s.trim()).filter(Boolean) : [],
      price: String(data.price || ''),
      displayOrder: data.displayOrder ? Number(data.displayOrder) : undefined,
    };
    if (editingItem) {
      await adminPricingService.update(editingItem.id, submitData as Partial<PricingPlan>);
      toast.success('پلن با موفقیت ویرایش شد');
    } else {
      await adminPricingService.create(submitData as Partial<PricingPlan>);
      toast.success('پلن با موفقیت ایجاد شد');
    }
    fetchData();
  };

  const fields: FormField[] = [
    { key: 'name', label: 'نام پلن', required: true, placeholder: 'مثلاً پایه' },
    { key: 'price', label: 'قیمت', required: true, placeholder: 'مثلاً ۹۹۰,۰۰۰ تومان' },
    { key: 'description', label: 'توضیحات', type: 'textarea', fullWidth: true },
    { key: 'features', label: 'ویژگی‌ها (هر خط یک ویژگی)', type: 'textarea', fullWidth: true, rows: 5 },
    { key: 'isPopular', label: 'محبوب', type: 'switch' },
    { key: 'isActive', label: 'فعال', type: 'switch' },
    { key: 'displayOrder', label: 'ترتیب نمایش', type: 'number' },
  ];

  const columns = [
    { key: 'name', label: 'نام پلن' },
    { key: 'price', label: 'قیمت' },
    { key: 'description', label: 'توضیحات', render: (item: PricingPlan) => (
      <div className="max-w-xs truncate text-sm">{item.description || '-'}</div>
    )},
    {
      key: 'isPopular',
      label: 'محبوب',
      render: (item: PricingPlan) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          item.isPopular ? 'bg-yellow-500/10 text-yellow-500' : 'bg-gray-500/10 text-gray-500'
        }`}>
          {item.isPopular ? 'بله' : 'خیر'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="w-6 h-6" />
            مدیریت قیمت‌گذاری
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} پلن</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="w-4 h-4 ml-1" />
            بروزرسانی
          </Button>
          <Button size="sm" className="btn-primary" onClick={handleCreate}>
            <Plus className="w-4 h-4 ml-1" />
            ایجاد پلن
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
            emptyMessage="پلنی یافت نشد"
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف پلن"
        description="آیا از حذف این پلن اطمینان دارید؟"
        onConfirm={handleDelete}
        loading={isDeleting}
      />

      <EntityFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={editingItem ? 'ویرایش پلن' : 'ایجاد پلن جدید'}
        fields={fields}
        initialValues={editingItem ? { ...editingItem, features: (editingItem.features || []).join('\n') } : undefined}
        onSubmit={handleSubmit}
        submitLabel={editingItem ? 'ذخیره تغییرات' : 'ایجاد پلن'}
      />
    </div>
  );
}
