'use client';

import { useEffect, useState } from 'react';
import { Share2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { adminSocialMediaService } from '@/services/admin/SocialMediaService';
import { SocialMedia } from '@/types/api';

export default function AdminSocialMediaPage() {
  const [items, setItems] = useState<SocialMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await adminSocialMediaService.getAll();
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
      await adminSocialMediaService.delete(deleteId);
      setItems(items.filter(i => i.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete:', error);
    }
    setIsDeleting(false);
  };

  const handleToggleActive = async (item: SocialMedia) => {
    try {
      await adminSocialMediaService.updateActiveStatus(item.id, !item.isActive);
      setItems(items.map(i => i.id === item.id ? { ...i, isActive: !i.isActive } : i));
    } catch (error) {
      console.error('Failed to toggle:', error);
    }
  };

  const columns = [
    { key: 'platform', label: 'پلتفرم' },
    { key: 'url', label: 'لینک', render: (item: SocialMedia) => (
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:underline text-sm truncate max-w-xs block">
        {item.url}
      </a>
    )},
    {
      key: 'isActive',
      label: 'وضعیت',
      render: (item: SocialMedia) => (
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
    { key: 'displayOrder', label: 'ترتیب', render: (item: SocialMedia) => item.displayOrder || 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Share2 className="w-6 h-6" />
            مدیریت شبکه‌های اجتماعی
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} رکورد</p>
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
            emptyMessage="رکوردی یافت نشد"
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف رکورد"
        description="آیا از حذف این رکورد اطمینان دارید؟"
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </div>
  );
}
