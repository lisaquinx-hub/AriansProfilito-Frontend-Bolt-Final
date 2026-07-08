'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminUsersService } from '@/services/admin/index';
import { User } from '@/types/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    const data = await adminUsersService.getAll();
    setUsers(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await adminUsersService.delete(deleteId);
      setUsers(users.filter(u => u.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
    setIsDeleting(false);
  };

  const columns = [
    { key: 'name', label: 'نام' },
    { key: 'email', label: 'ایمیل' },
    {
      key: 'role',
      label: 'نقش',
      render: (user: User) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          user.role === 'Admin' ? 'bg-purple-500/10 text-purple-500' : 'bg-sky-500/10 text-sky-500'
        }`}>
          {user.role || 'کاربر'}
        </span>
      ),
    },
    {
      key: 'isActive',
      label: 'وضعیت',
      render: (user: User) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          user.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
        }`}>
          {user.isActive ? 'فعال' : 'غیرفعال'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'تاریخ ثبت',
      render: (user: User) => user.createdAt ? new Date(user.createdAt).toLocaleDateString('fa-IR') : '-',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" />
            مدیریت کاربران
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {users.length} کاربر ثبت شده
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchUsers}>
            <RefreshCw className="w-4 h-4 ml-1" />
            بروزرسانی
          </Button>
        </div>
      </div>

      <Card className="glass">
        <CardContent className="p-6">
          <DataTable
            data={users}
            columns={columns}
            loading={isLoading}
            onEdit={(user) => {/* TODO: Navigate to edit page */}}
            onDelete={(user) => setDeleteId(user.id)}
            emptyMessage="کاربری یافت نشد"
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف کاربر"
        description="آیا از حذف این کاربر اطمینان دارید؟ این عمل قابل بازگشت نیست."
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </div>
  );
}
