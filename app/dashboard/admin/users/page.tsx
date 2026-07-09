'use client';

import { useEffect, useState } from 'react';
import { Users, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { adminUsersService } from '@/services/admin/index';
import { User } from '@/types/api';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/services/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<User | null>(null);

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
      toast.success('کاربر با موفقیت حذف شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
    setIsDeleting(false);
  };

  const handleEdit = (item: User) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      if (!editingItem) {
        throw new Error('کاربر قابل ایجاد نیست');
      }
      await adminUsersService.update(editingItem.id, data as Partial<User>);
      toast.success('کاربر با موفقیت ویرایش شد');
      fetchUsers();
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  };

  const fields: FormField[] = [
    { key: 'name', label: 'نام', required: true },
    { key: 'email', label: 'ایمیل', type: 'email', required: true },
    { key: 'userName', label: 'نام کاربری', type: 'text' },
    {
      key: 'role',
      label: 'نقش',
      type: 'select',
      options: [
        { value: 'Admin', label: 'مدیر' },
        { value: 'User', label: 'کاربر' },
      ],
    },
    { key: 'isActive', label: 'فعال', type: 'switch' },
  ];

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
            onEdit={handleEdit}
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

      <EntityFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={editingItem ? 'ویرایش کاربر' : 'ایجاد کاربر جدید'}
        fields={fields}
        initialValues={editingItem ? { ...editingItem } as Record<string, unknown> : undefined}
        onSubmit={handleSubmit}
        submitLabel={editingItem ? 'ذخیره تغییرات' : 'ایجاد کاربر'}
      />
    </div>
  );
}
