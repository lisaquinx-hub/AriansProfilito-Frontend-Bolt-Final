'use client';

import { useEffect, useState } from 'react';
import { Mail, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { adminEmailTemplatesService } from '@/services/admin/EmailTemplatesService';
import { EmailTemplate } from '@/types/api';

export default function AdminEmailTemplatesPage() {
  const [items, setItems] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    } catch (error) {
      console.error('Failed to delete:', error);
    }
    setIsDeleting(false);
  };

  const handleToggleActive = async (item: EmailTemplate) => {
    try {
      await adminEmailTemplatesService.updateActiveStatus(item.id, !item.isActive);
      setItems(items.map(i => i.id === item.id ? { ...i, isActive: !i.isActive } : i));
    } catch (error) {
      console.error('Failed to toggle:', error);
    }
  };

  const columns = [
    { key: 'name', label: 'نام' },
    { key: 'subject', label: 'موضوع' },
    {
      key: 'isActive',
      label: 'وضعیت',
      render: (item: EmailTemplate) => (
        <button
          onClick={() => handleToggleActive(item)}
          className={`px-2 py-1 rounded-full text-xs ${
            item.isActive ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'
          }`}
        >
          {item.isActive ? 'فعال' : 'غیرفعال'}
        </button>
      ),
    },
    {
      key: 'createdAt',
      label: 'تاریخ',
      render: (item: EmailTemplate) => item.createdAt ? new Date(item.createdAt).toLocaleDateString('fa-IR') : '-',
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
    </div>
  );
}
