'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Users, RefreshCw, Plus, Key, ToggleLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { ViewDetailModal } from '@/components/admin/ViewDetailModal';
import { adminUsersService, CreateUserDto, UpdateUserDto } from '@/services/admin/index';
import { User } from '@/types/api';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/services/api';
import { AnimatePresence, motion } from 'framer-motion';
import { UserIdFilter } from '@/components/admin/UserIdFilter';
import { isValidUuid } from '@/lib/identifiers';

// UserRole: Customer=1, Employee=2, Admin=3
const ROLE_OPTIONS = [
  { value: '1', label: 'مشتری' },
  { value: '2', label: 'کارمند' },
  { value: '3', label: 'مدیر' },
];

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userIdQuery, setUserIdQuery] = useState('');
  const [isIdSearching, setIsIdSearching] = useState(false);
  const [userSearchError, setUserSearchError] = useState<string | null>(null);
  const [isFilteredById, setIsFilteredById] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<User | null>(null);

  const [viewItem, setViewItem] = useState<User | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  // Reset password modal state
  const [resetItem, setResetItem] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setUserSearchError(null);
    const data = await adminUsersService.getAll();
    setUsers(data);
    setIsFilteredById(false);
    setIsLoading(false);
  };

  const searchUserById = async (rawUserId: string, updateUrl = true) => {
    const userId = rawUserId.trim();
    if (!isValidUuid(userId)) {
      setUserSearchError('شناسه کاربر باید یک UUID معتبر باشد');
      setIsLoading(false);
      return;
    }

    setIsIdSearching(true);
    setIsLoading(true);
    setUserSearchError(null);
    try {
      const user = await adminUsersService.getById(userId);
      if (!user) {
        setUsers([]);
        setUserSearchError('کاربری با این شناسه پیدا نشد');
      } else {
        setUsers([user]);
      }
      setIsFilteredById(true);
      if (updateUrl) {
        router.replace(`/dashboard/admin/users?userId=${encodeURIComponent(userId)}`, {
          scroll: false,
        });
      }
    } catch (error) {
      setUsers([]);
      setIsFilteredById(true);
      setUserSearchError(getApiErrorMessage(error));
    } finally {
      setIsIdSearching(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const requestedUserId = new URLSearchParams(window.location.search)
      .get('userId')
      ?.trim() || '';
    if (requestedUserId) {
      setUserIdQuery(requestedUserId);
      void searchUserById(requestedUserId, false);
    } else {
      void fetchUsers();
    }
    // Query parameters are read once when this page is opened.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClearUserSearch = () => {
    setUserIdQuery('');
    setUserSearchError(null);
    router.replace('/dashboard/admin/users', { scroll: false });
    void fetchUsers();
  };

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

  const handleView = async (item: User) => {
    setViewItem({ ...item });
    setViewError(null);
    setViewLoading(true);
    try {
      const detail = await adminUsersService.getById(item.id);
      if (detail) setViewItem(detail);
    } catch (err) {
      setViewError(getApiErrorMessage(err));
    } finally {
      setViewLoading(false);
    }
  };

  const handleToggleActivate = async (item: User) => {
    try {
      await adminUsersService.activate(item.id);
      setUsers(prev => prev.map(u => u.id === item.id ? { ...u, isActive: !u.isActive } : u));
      toast.success(item.isActive ? 'کاربر غیرفعال شد' : 'کاربر فعال شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleResetPassword = async () => {
    if (!resetItem || !newPassword.trim()) return;
    if (newPassword.length < 12 || newPassword.length > 128) {
      setResetError('رمز عبور باید بین ۱۲ تا ۱۲۸ کاراکتر باشد');
      return;
    }
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setResetError('رمز عبور باید شامل حرف بزرگ، حرف کوچک و عدد باشد');
      return;
    }
    setIsResetting(true);
    setResetError(null);
    try {
      await adminUsersService.resetPassword(resetItem.id, newPassword.trim());
      setResetItem(null);
      setNewPassword('');
      toast.success('رمز عبور با موفقیت بازنشانی شد');
    } catch (err) {
      setResetError(getApiErrorMessage(err));
    } finally {
      setIsResetting(false);
    }
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
    { key: 'emailConfirmed', label: 'ایمیل تأییدشده', type: 'switch' },
  ];

  const createFields: FormField[] = [
    ...editFields.slice(0, 4),
    { key: 'password', label: 'رمز عبور', type: 'password', required: true, placeholder: 'حداقل ۱۲ کاراکتر، شامل حروف بزرگ و کوچک و عدد' },
    ...editFields.slice(4),
  ];

  const columns = [
    { key: 'fullName', label: 'نام' },
    { key: 'email', label: 'ایمیل' },
    { key: 'userName', label: 'نام کاربری', render: (i: User) => i.userName || '-' },
    { key: 'role', label: 'نقش', render: (i: User) => ROLE_OPTIONS.find(o => o.value === String(i.role))?.label || String(i.role) },
    {
      key: 'isActive', label: 'وضعیت', render: (i: User) => (
        <span className={`px-2 py-1 rounded-full text-xs ${i.isActive ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-400'}`}>
          {i.isActive ? 'فعال' : 'غیرفعال'}
        </span>
      ),
    },
    { key: 'createdAt', label: 'تاریخ', render: (i: User) => i.createdAt ? new Date(i.createdAt).toLocaleDateString('fa-IR') : '-' },
  ];

  const extraActions = [
    {
      label: 'بازنشانی رمز عبور',
      icon: <Key className="w-4 h-4" />,
      onClick: (item: User) => {
        setNewPassword('');
        setResetError(null);
        setResetItem(item);
      },
      className: 'text-amber-500 hover:text-amber-400',
    },
    {
      label: 'فعال/غیرفعال',
      icon: <ToggleLeft className="w-4 h-4" />,
      onClick: (item: User) => handleToggleActivate(item),
      className: 'text-emerald-500 hover:text-emerald-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Users className="w-6 h-6" />مدیریت کاربران</h1>
          <p className="text-muted-foreground text-sm mt-1">{users.length} کاربر</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => userIdQuery.trim()
              ? void searchUserById(userIdQuery, false)
              : void fetchUsers()}
          >
            <RefreshCw className={`w-4 h-4 ml-1 ${isLoading ? 'animate-spin' : ''}`} />به‌روزرسانی
          </Button>
          <Button size="sm" className="btn-primary" onClick={() => { setEditingItem(null); setIsFormOpen(true); }}><Plus className="w-4 h-4 ml-1" />کاربر جدید</Button>
        </div>
      </div>
      <Card className="glass">
        <CardContent className="p-6">
          <div className="mb-4">
            <h2 className="font-semibold">جست‌وجوی مستقیم کاربر با شناسه</h2>
            <p className="text-sm text-muted-foreground mt-1">
              شناسه UUID کاربر را وارد کنید تا اطلاعات او مستقیماً از سرور دریافت شود.
            </p>
          </div>
          <UserIdFilter
            value={userIdQuery}
            onChange={setUserIdQuery}
            onSearch={() => void searchUserById(userIdQuery)}
            onClear={handleClearUserSearch}
            loading={isIdSearching}
            error={userSearchError}
          />
          {isFilteredById && users[0] && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/admin/activity-logs?userId=${encodeURIComponent(users[0].id)}`}>مشاهده لاگ فعالیت</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/admin/audit-logs?userId=${encodeURIComponent(users[0].id)}`}>مشاهده لاگ ممیزی</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="glass"><CardContent className="p-6">
        <DataTable
          data={users}
          columns={columns}
          loading={isLoading}
          onView={handleView}
          onEdit={(i) => { setEditingItem(i); setIsFormOpen(true); }}
          onDelete={(i) => setDeleteId(i.id)}
          extraActions={extraActions}
          emptyMessage="کاربری یافت نشد"
        />
      </CardContent></Card>
      <ConfirmDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)} title="حذف کاربر" description="آیا از حذف این کاربر اطمینان دارید؟" onConfirm={handleDelete} loading={isDeleting} />
      <EntityFormModal open={isFormOpen} onOpenChange={setIsFormOpen} title={editingItem ? 'ویرایش کاربر' : 'کاربر جدید'}
        fields={editingItem ? editFields : createFields}
        initialValues={editingItem ? { fullName: editingItem.fullName, email: editingItem.email, userName: editingItem.userName || '', phoneNumber: editingItem.phoneNumber || '', role: String(editingItem.role || '1'), isActive: editingItem.isActive ?? true, emailConfirmed: editingItem.emailConfirmed ?? false } : undefined}
        onSubmit={handleSubmit} />
      <ViewDetailModal
        open={!!viewItem || viewLoading}
        onClose={() => { setViewItem(null); setViewError(null); setViewLoading(false); }}
        title="جزئیات کاربر"
        loading={viewLoading}
        error={viewError}
        fields={viewItem ? [
          { label: 'شناسه', value: viewItem.id },
          { label: 'نام کامل', value: viewItem.fullName },
          { label: 'ایمیل', value: viewItem.email },
          { label: 'نام کاربری', value: viewItem.userName || '-' },
          { label: 'شماره تلفن', value: viewItem.phoneNumber || '-' },
          { label: 'نقش', value: ROLE_OPTIONS.find(o => o.value === String(viewItem.role))?.label || String(viewItem.role) },
          { label: 'وضعیت', value: viewItem.isActive ? 'فعال' : 'غیرفعال' },
          { label: 'ایمیل تأییدشده', value: viewItem.emailConfirmed ? 'بله' : 'خیر' },
          { label: 'آخرین ورود', value: viewItem.lastLoginAt ? new Date(viewItem.lastLoginAt).toLocaleString('fa-IR') : '-' },
          { label: 'تاریخ ایجاد', value: viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleString('fa-IR') : '-' },
        ] : []}
      />

      {/* Reset Password Modal */}
      <AnimatePresence>
        {resetItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50"
              onClick={() => { if (!isResetting) setResetItem(null); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative glass rounded-2xl p-6 max-w-sm w-full"
            >
              <h3 className="text-lg font-semibold mb-2">بازنشانی رمز عبور</h3>
              <p className="text-sm text-muted-foreground mb-4">کاربر: {resetItem.fullName} ({resetItem.email})</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">رمز عبور جدید</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    minLength={12}
                    maxLength={128}
                    autoComplete="new-password"
                    placeholder="حداقل ۱۲ کاراکتر، شامل حروف بزرگ و کوچک و عدد"
                    onKeyDown={e => e.key === 'Enter' && handleResetPassword()}
                  />
                </div>
                {resetError && (
                  <p className="text-sm text-red-400">{resetError}</p>
                )}
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => setResetItem(null)} disabled={isResetting}>انصراف</Button>
                  <Button size="sm" className="btn-primary" onClick={handleResetPassword} disabled={isResetting || !newPassword.trim()}>
                    {isResetting ? 'در حال ذخیره...' : 'بازنشانی'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
