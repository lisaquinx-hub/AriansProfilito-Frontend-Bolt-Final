'use client';

import { useEffect, useState } from 'react';
import { Image, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { adminHeroSectionsService } from '@/services/admin/HeroSectionsService';
import { HeroSection } from '@/types/api';

export default function AdminHeroSectionsPage() {
  const [items, setItems] = useState<HeroSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await adminHeroSectionsService.getAll();
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
      await adminHeroSectionsService.delete(deleteId);
      setItems(items.filter(i => i.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete:', error);
    }
    setIsDeleting(false);
  };

  const columns = [
    { key: 'title', label: 'عنوان' },
    { key: 'subtitle', label: 'زیرعنوان', render: (item: HeroSection) => item.subtitle || '-' },
    {
      key: 'isActive',
      label: 'وضعیت',
      render: (item: HeroSection) => (
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
      render: (item: HeroSection) => item.createdAt ? new Date(item.createdAt).toLocaleDateString('fa-IR') : '-',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Image className="w-6 h-6" />
            مدیریت هیرو سکشن‌ها
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
