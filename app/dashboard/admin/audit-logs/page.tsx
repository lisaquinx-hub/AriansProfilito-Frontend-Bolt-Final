'use client';

import { useEffect, useState } from 'react';
import { ClipboardList, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { adminAuditLogsService } from '@/services/admin/AuditLogsService';
import { AuditLog } from '@/types/api';

export default function AdminAuditLogsPage() {
  const [items, setItems] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await adminAuditLogsService.getAll({ take: 100 });
    setItems(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      key: 'userFullName',
      label: 'کاربر',
      render: (item: AuditLog) => item.userFullName || item.userEmail || 'سیستم',
    },
    { key: 'action', label: 'عملیات' },
    { key: 'entityName', label: 'موجودیت' },
    { key: 'entityId', label: 'شناسه', render: (item: AuditLog) => item.entityId || '-' },
    {
      key: 'createdAt',
      label: 'تاریخ',
      render: (item: AuditLog) => new Date(item.createdAt).toLocaleString('fa-IR'),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="w-6 h-6" />
            لاگ ممیزی
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
            emptyMessage="رکوردی یافت نشد"
          />
        </CardContent>
      </Card>
    </div>
  );
}
