'use client';

import { useEffect, useState } from 'react';
import { HeadphonesIcon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { adminSupportTicketsService } from '@/services/admin/SupportTicketsService';
import { SupportTicket } from '@/types/api';

export default function AdminSupportTicketsPage() {
  const [items, setItems] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await adminSupportTicketsService.getAll();
    setItems(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { key: 'subject', label: 'موضوع' },
    { key: 'userName', label: 'کاربر', render: (item: SupportTicket) => item.userName || '-' },
    {
      key: 'status',
      label: 'وضعیت',
      render: (item: SupportTicket) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          item.status === 'Open' ? 'bg-green-500/10 text-green-500' :
          item.status === 'InProgress' ? 'bg-yellow-500/10 text-yellow-500' :
          'bg-gray-500/10 text-gray-500'
        }`}>
          {item.status === 'Open' ? 'باز' : item.status === 'InProgress' ? 'در حال بررسی' : 'بسته'}
        </span>
      ),
    },
    {
      key: 'priority',
      label: 'اولویت',
      render: (item: SupportTicket) => item.priority || '-',
    },
    {
      key: 'createdAt',
      label: 'تاریخ',
      render: (item: SupportTicket) => new Date(item.createdAt).toLocaleDateString('fa-IR'),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <HeadphonesIcon className="w-6 h-6" />
            مدیریت تیکت‌های پشتیبانی
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} تیکت</p>
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
            emptyMessage="تیکتی یافت نشد"
          />
        </CardContent>
      </Card>
    </div>
  );
}
