'use client';

import { useEffect, useState } from 'react';
import { DollarSign, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { adminPricingService } from '@/services/admin/PricingService';
import { PricingPlan } from '@/types/api';

export default function AdminPricingPage() {
  const [items, setItems] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    } catch (error) {
      console.error('Failed to delete:', error);
    }
    setIsDeleting(false);
  };

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
        <Button variant="outline" size="sm" onClick={fetchData}>
          <RefreshCw className="w-4 h-4 ml-1" />
          بروزرسانی
        </Button>
      </div>

      <Card className="glass">
        <CardContent className="p-6">
          <DataTable
            data={items}
            columns={columns}
            loading={isLoading}
            onEdit={() => {}}
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
    </div>
  );
}
