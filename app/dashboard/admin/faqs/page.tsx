'use client';

import { useEffect, useState } from 'react';
import { HelpCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { adminFaqService } from '@/services/admin/FaqService';
import { FAQ } from '@/types/api';

export default function AdminFaqsPage() {
  const [items, setItems] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    } catch (error) {
      console.error('Failed to delete:', error);
    }
    setIsDeleting(false);
  };

  const columns = [
    { key: 'question', label: 'سوال', render: (item: FAQ) => (
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
            مدیریت سوالات متداول
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} سوال</p>
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
            emptyMessage="سوالی یافت نشد"
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف سوال"
        description="آیا از حذف این سوال اطمینان دارید؟"
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </div>
  );
}
