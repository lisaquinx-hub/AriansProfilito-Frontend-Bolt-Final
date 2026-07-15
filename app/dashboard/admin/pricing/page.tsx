'use client';

import { useEffect, useState } from 'react';
import { DollarSign, RefreshCw, Plus, Pencil, Trash2, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { ViewDetailModal } from '@/components/admin/ViewDetailModal';
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

  const [viewItem, setViewItem] = useState<PricingPlan | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await adminPricingService.getAll();
    setItems(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    setDeleteId(id);
    setIsDeleting(true);
    try {
      await adminPricingService.delete(id);
      setItems(prev => prev.filter(i => i.id !== id));
      toast.success('پلن با موفقیت حذف شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setDeleteId(null);
      setIsDeleting(false);
    }
  };

  const handleEdit = (item: PricingPlan) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleView = async (item: PricingPlan) => {
    setViewItem({ ...item });
    setViewError(null);
    setViewLoading(true);
    try {
      const detail = await adminPricingService.getById(item.id);
      if (detail) setViewItem(detail);
    } catch (err) {
      setViewError(getApiErrorMessage(err));
    } finally {
      setViewLoading(false);
    }
  };

  const formFields: FormField[] = [
    { key: 'title', label: 'عنوان', type: 'text', required: true },
    { key: 'description', label: 'توضیحات', type: 'textarea', fullWidth: true },
    { key: 'price', label: 'قیمت', type: 'number', required: true },
    { key: 'duration', label: 'مدت (روز)', type: 'number', required: true },
    { key: 'deliveryDays', label: 'تحویل (روز)', type: 'number', required: true },
    { key: 'displayOrder', label: 'ترتیب نمایش', type: 'number' },
    { key: 'isPopular', label: 'محبوب', type: 'switch' },
    { key: 'isActive', label: 'فعال', type: 'switch' },
    {
      key: 'featuresText',
      label: 'ویژگی‌ها (هر خط یک ویژگی)',
      type: 'textarea',
      fullWidth: true,
      rows: 6,
      placeholder: 'ویژگی اول\nویژگی دوم\nویژگی سوم',
    },
  ];

  const getInitialValues = (item: PricingPlan | null) => {
    if (!item) {
      return {
        title: '',
        description: '',
        price: 0,
        duration: 30,
        deliveryDays: 7,
        displayOrder: 0,
        isPopular: false,
        isActive: true,
        featuresText: '',
      };
    }
    return {
      title: item.title,
      description: item.description,
      price: item.price,
      duration: item.duration,
      deliveryDays: item.deliveryDays,
      displayOrder: item.displayOrder,
      isPopular: item.isPopular,
      isActive: item.isActive ?? true,
      featuresText: (item.features || []).map(f => f.feature).join('\n'),
    };
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    const featuresText = String(data.featuresText || '');
    const features = featuresText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
      .map(f => ({ feature: f }));

    const payload = {
      title: String(data.title || '').trim(),
      description: String(data.description || '').trim(),
      price: Number(data.price) || 0,
      duration: Number(data.duration) || 0,
      deliveryDays: Number(data.deliveryDays) || 0,
      displayOrder: Number(data.displayOrder) || 0,
      isPopular: Boolean(data.isPopular),
      isActive: Boolean(data.isActive ?? true),
      features,
    };

    if (editingItem) {
      const updated = await adminPricingService.update(editingItem.id, payload);
      if (updated) {
        setItems(prev => prev.map(i => (i.id === editingItem.id ? updated : i)));
        toast.success('پلن با موفقیت به‌روز شد');
      }
    } else {
      const created = await adminPricingService.create(payload);
      if (created) {
        setItems(prev => [...prev, created]);
        toast.success('پلن با موفقیت ایجاد شد');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">پلن‌های قیمت‌گذاری</h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} پلن</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={handleCreate} className="btn-primary shadow-glow gap-2">
            <Plus className="w-4 h-4" />
            پلن جدید
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        </div>
      ) : items.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <DollarSign className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">پلن قیمت‌گذاری‌ای یافت نشد</p>
          <Button onClick={handleCreate} className="btn-primary mt-4 gap-2">
            <Plus className="w-4 h-4" />
            ایجاد اولین پلن
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((plan) => (
            <Card key={plan.id} className="glass hover:glass-hover transition-all">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{plan.title}</h3>
                      {plan.isPopular && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          محبوب
                        </span>
                      )}
                      {!plan.isActive && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-500/10 text-gray-400 border border-gray-500/20">
                          غیرفعال
                        </span>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-sky-500 dark:text-cyan-400 mt-1">
                      {plan.price.toLocaleString()} تومان
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{plan.description}</p>
                <div className="text-xs text-muted-foreground mb-3 flex gap-3">
                  <span>مدت: {plan.duration} روز</span>
                  <span>تحویل: {plan.deliveryDays} روز</span>
                </div>
                {plan.features && plan.features.length > 0 && (
                  <ul className="text-xs text-muted-foreground space-y-1 mb-4">
                    {plan.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                        {f.feature}
                      </li>
                    ))}
                    {plan.features.length > 3 && (
                      <li className="text-muted-foreground">+{plan.features.length - 3} مورد دیگر</li>
                    )}
                  </ul>
                )}
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1 gap-1"
                    onClick={() => handleView(plan)}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    جزئیات
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1 gap-1"
                    onClick={() => handleEdit(plan)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    ویرایش
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1 gap-1 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    onClick={() => handleDelete(plan.id)}
                    disabled={deleteId === plan.id && isDeleting}
                  >
                    {deleteId === plan.id && isDeleting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <EntityFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={editingItem ? 'ویرایش پلن' : 'پلن جدید'}
        fields={formFields}
        initialValues={getInitialValues(editingItem)}
        onSubmit={handleSubmit}
      />

      <ViewDetailModal
        open={!!viewItem || viewLoading}
        onClose={() => { setViewItem(null); setViewError(null); setViewLoading(false); }}
        title="جزئیات پلن قیمت‌گذاری"
        loading={viewLoading}
        error={viewError}
        fields={viewItem ? [
          { label: 'شناسه', value: viewItem.id },
          { label: 'عنوان', value: viewItem.title },
          { label: 'توضیحات', value: viewItem.description || '-', fullWidth: true },
          { label: 'قیمت', value: viewItem.price?.toLocaleString() || '-' },
          { label: 'مدت (روز)', value: viewItem.duration },
          { label: 'تحویل (روز)', value: viewItem.deliveryDays },
          { label: 'محبوب', value: viewItem.isPopular ? 'بله' : 'خیر' },
          { label: 'فعال', value: viewItem.isActive ? 'بله' : 'خیر' },
          { label: 'ترتیب نمایش', value: viewItem.displayOrder ?? '-' },
          { label: 'ویژگی‌ها', value: (viewItem.features || []).map(f => f.feature).join(' | ') || '-', fullWidth: true },
          { label: 'تاریخ ایجاد', value: viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleString('fa-IR') : '-' },
        ] : []}
      />
    </div>
  );
}
