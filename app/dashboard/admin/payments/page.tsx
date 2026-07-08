'use client';

import { useEffect, useState } from 'react';
import { CreditCard, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { adminPaymentsService } from '@/services/admin/PaymentsService';
import { Payment } from '@/types/api';

export default function AdminPaymentsPage() {
  const [items, setItems] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await adminPaymentsService.getAll();
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
      await adminPaymentsService.delete(deleteId);
      setItems(items.filter(i => i.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete:', error);
    }
    setIsDeleting(false);
  };

  const columns = [
    {
      key: 'amount',
      label: 'مبلغ',
      render: (item: Payment) => item.amount?.toLocaleString() || 0,
    },
    { key: 'method', label: 'روش پرداخت' },
    { key: 'userName', label: 'کاربر', render: (item: Payment) => item.userName || '-' },
    {
      key: 'status',
      label: 'وضعیت',
      render: (item: Payment) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          item.status === 'Success' ? 'bg-green-500/10 text-green-500' :
          item.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' :
          'bg-red-500/10 text-red-500'
        }`}>
          {item.status === 'Success' ? 'موفق' : item.status === 'Pending' ? 'در انتظار' : 'ناموفق'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'تاریخ',
      render: (item: Payment) => item.createdAt ? new Date(item.createdAt).toLocaleDateString('fa-IR') : '-',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            مدیریت پرداخت‌ها
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} پرداخت</p>
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
            onView={() => {}}
            onDelete={(item) => setDeleteId(item.id)}
            emptyMessage="پرداختی یافت نشد"
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف پرداخت"
        description="آیا از حذف این رکورد اطمینان دارید؟"
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </div>
  );
}
