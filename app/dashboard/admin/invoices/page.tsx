'use client';

import { useEffect, useState } from 'react';
import { Receipt, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { adminInvoicesService } from '@/services/admin/InvoicesService';
import { Invoice } from '@/types/api';

export default function AdminInvoicesPage() {
  const [items, setItems] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await adminInvoicesService.getAll();
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
      await adminInvoicesService.delete(deleteId);
      setItems(items.filter(i => i.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete:', error);
    }
    setIsDeleting(false);
  };

  const columns = [
    { key: 'invoiceNumber', label: 'شماره فاکتور' },
    { key: 'userName', label: 'کاربر', render: (item: Invoice) => item.userName || '-' },
    {
      key: 'totalAmount',
      label: 'مبلغ',
      render: (item: Invoice) => item.totalAmount?.toLocaleString() || 0,
    },
    {
      key: 'status',
      label: 'وضعیت',
      render: (item: Invoice) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          item.status === 'Paid' ? 'bg-green-500/10 text-green-500' :
          item.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' :
          'bg-red-500/10 text-red-500'
        }`}>
          {item.status === 'Paid' ? 'پرداخت شده' : item.status === 'Pending' ? 'در انتظار' : 'لغو شده'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'تاریخ',
      render: (item: Invoice) => item.createdAt ? new Date(item.createdAt).toLocaleDateString('fa-IR') : '-',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Receipt className="w-6 h-6" />
            مدیریت فاکتورها
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} فاکتور</p>
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
            emptyMessage="فاکتوری یافت نشد"
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف فاکتور"
        description="آیا از حذف این فاکتور اطمینان دارید؟"
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </div>
  );
}
