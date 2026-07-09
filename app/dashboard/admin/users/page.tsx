'use client';

import { useEffect, useState } from 'react';
import { Users, RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { adminUsersService, CreateUserDto, UpdateUserDto } from '@/services/admin/index';
import { User } from '@/types/api';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/services/api';

// UserRole: Customer=1, Employee=2, Admin=3
const ROLE_OPTIONS = [
  { value: '1', label: 'مشتری' },
  { value: '2', label: 'کارمند' },
  { value: '3', label: 'مدیر' },
];

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

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await adminUsersService.delete(deleteId);
      setUsers(prev => prev.filter(u => u.id !== deleteId));
      setDeleteId(null);
      toast.success('کاربر با موفقیت حذف شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
    setIsDeleting(false);
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    if (editingItem) {
      const payload: UpdateUserDto = {
        fullName: String(data.fullName || '').trim(),
        email: String(data.email || '').trim(),
        userName: String(data.userName || '') || undefined,
        phoneNumber: String(data.phoneNumber || '') || undefined,
        role: Number(data.role) || 1,
        isActive: Boolean(data.isActive ?? true),
        emailConfirmed: Boolean(data.emailConfirmed ?? false),
        avatar: String(data.avatar || '') || undefined,
      };
      await adminUsersService.update(editingItem.id, payload);
      toast.success('کاربر با موفقیت ویرایش شد');
    } else {
      const payload: CreateUserDto = {
        fullName: String(data.fullName || '').trim(),
        email: String(data.email || '').trim(),
        userName: String(data.userName || '') || undefined,
        password: String(data.password || ''),
        phoneNumber: String(data.phoneNumber || '') || undefined,
        role: Number(data.role) || 1,
        isActive: Boolean(data.isActive ?? true),
        emailConfirmed: Boolean(data.emailConfirmed ?? false),
        avatar: String(data.avatar || '') || undefined,
      };
      await adminUsersService.create(payload);
      toast.success('کاربر با موفقیت ایجاد شد');
    }
    fetchUsers();
  };

  const editFields: FormField[] = [
    { key: 'fullName', label: 'نام کامل', required: true },
    { key: 'email', label: 'ایمیل', type: 'email', required: true },
    { key: 'userName', label: 'نام کاربری' },
    { key: 'phoneNumber', label: 'شماره تلفن' },
    { key: 'role', label: 'نقش', type: 'select', required: true, options: ROLE_OPTIONS },
    { key: 'isActive', label: 'فعال', type: 'switch' },
    { key: 'emailConfirmed', label: 'ایمیل تأیید شده', type: 'switch' },
  ];

  const createFields: FormField[] = [
    ...editFields.slice(0, 4),
    { key: 'password', label: 'رمز عبور', type: 'password', required: true },
    ...editFields.slice(4),
  ];

  const columns = [
    { key: 'fullName', label: 'نام' },
    { key: 'email', label: 'ایمیل' },
    { key: 'userName', label: 'نام کاربری', render: (i: User) => i.userName || '-' },
    { key: 'role', label: 'نقش', render: (i: User) => ROLE_OPTIONS.find(o => o.value === String(i.role))?.label || String(i.role) },
    { key: 'isActive', label: 'وضعیت', render: (i: User) => (
      <span className={`px-2 py-1 rounded-full text-xs ${i.isActive ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-400'}`}>
        {i.isActive ? 'فعال' : 'غیرفعال'}
      </span>
    )},
    { key: 'createdAt', label: 'تاریخ', render: (i: User) => i.createdAt ? new Date(i.createdAt).toLocaleDateString('fa-IR') : '-' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Users className="w-6 h-6" />مدیریت کاربران</h1>
          <p className="text-muted-foreground text-sm mt-1">{users.length} کاربر</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchUsers}><RefreshCw className={`w-4 h-4 ml-1 ${isLoading ? 'animate-spin' : ''}`} />بروزرسانی</Button>
          <Button size="sm" className="btn-primary" onClick={() => { setEditingItem(null); setIsFormOpen(true); }}><Plus className="w-4 h-4 ml-1" />کاربر جدید</Button>
        </div>
      </div>
      <Card className="glass"><CardContent className="p-6">
        <DataTable data={users} columns={columns} loading={isLoading} onEdit={(i) => { setEditingItem(i); setIsFormOpen(true); }} onDelete={(i) => setDeleteId(i.id)} emptyMessage="کاربری یافت نشد" />
      </CardContent></Card>
      <ConfirmDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)} title="حذف کاربر" description="آیا از حذف این کاربر اطمینان دارید؟" onConfirm={handleDelete} loading={isDeleting} />
      <EntityFormModal open={isFormOpen} onOpenChange={setIsFormOpen} title={editingItem ? 'ویرایش کاربر' : 'کاربر جدید'}
        fields={editingItem ? editFields : createFields}
        initialValues={editingItem ? { fullName: editingItem.fullName, email: editingItem.email, userName: editingItem.userName || '', phoneNumber: editingItem.phoneNumber || '', role: String(editingItem.role || '1'), isActive: editingItem.isActive ?? true, emailConfirmed: editingItem.emailConfirmed ?? false } : undefined}
        onSubmit={handleSubmit} />
    </div>
  );
}
