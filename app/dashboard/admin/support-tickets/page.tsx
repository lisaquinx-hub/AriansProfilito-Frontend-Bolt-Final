'use client';

import { useEffect, useState } from 'react';
import { HeadphonesIcon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { adminSupportTicketsService, UpdateTicketStatusDto } from '@/services/admin/SupportTicketsService';
import { SupportTicket } from '@/types/api';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/services/api';

// TicketStatus: Open=1, Answered=2, Closed=3
// TicketPriority: Low=1, Medium=2, High=3, Critical=4

const STATUS_OPTIONS = [
  { value: '1', label: 'باز' },
  { value: '2', label: 'پاسخ داده شده' },
  { value: '3', label: 'بسته' },
];

const PRIORITY_OPTIONS = [
  { value: '1', label: 'کم' },
  { value: '2', label: 'متوسط' },
  { value: '3', label: 'زیاد' },
  { value: '4', label: 'بحرانی' },
];

function statusLabel(s: number) {
  return STATUS_OPTIONS.find(o => o.value === String(s))?.label || String(s);
}
function statusClass(s: number) {
  if (s === 1) return 'bg-green-500/10 text-green-500';
  if (s === 2) return 'bg-yellow-500/10 text-yellow-500';
  return 'bg-gray-500/10 text-gray-400';
}

export default function AdminSupportTicketsPage() {
  const [items, setItems] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SupportTicket | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await adminSupportTicketsService.getAll();
    setItems(data);
    setIsLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await adminSupportTicketsService.delete(deleteId);
      setItems(prev => prev.filter(i => i.id !== deleteId));
      setDeleteId(null);
      toast.success('تیکت با موفقیت حذف شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
    setIsDeleting(false);
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    if (!editingItem) return;
    const payload: UpdateTicketStatusDto = {
      status: Number(data.status) || 1,
      priority: Number(data.priority) || 2,
      assignedToUserId: String(data.assignedToUserId || '') || null,
    };
    await adminSupportTicketsService.updateStatus(editingItem.id, payload);
    toast.success('تیکت با موفقیت به‌روز شد');
    fetchData();
  };

  const fields: FormField[] = [
    { key: 'status', label: 'وضعیت', type: 'select', required: true, options: STATUS_OPTIONS },
    { key: 'priority', label: 'اولویت', type: 'select', required: true, options: PRIORITY_OPTIONS },
    { key: 'assignedToUserId', label: 'محول به (UUID کاربر)', type: 'text' },
  ];

  const columns = [
    { key: 'ticketNumber', label: 'شماره تیکت', render: (i: SupportTicket) => i.ticketNumber || '-' },
    { key: 'title', label: 'موضوع', render: (i: SupportTicket) => <div className="max-w-xs truncate">{i.title}</div> },
    { key: 'customerFullName', label: 'مشتری', render: (i: SupportTicket) => i.customerFullName || '-' },
    { key: 'status', label: 'وضعیت', render: (i: SupportTicket) => (
      <span className={`px-2 py-1 rounded-full text-xs ${statusClass(i.status)}`}>{statusLabel(i.status)}</span>
    )},
    { key: 'priority', label: 'اولویت', render: (i: SupportTicket) => PRIORITY_OPTIONS.find(o => o.value === String(i.priority))?.label || '-' },
    { key: 'createdAt', label: 'تاریخ', render: (i: SupportTicket) => i.createdAt ? new Date(i.createdAt).toLocaleDateString('fa-IR') : '-' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><HeadphonesIcon className="w-6 h-6" />تیکت‌های پشتیبانی</h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} تیکت</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData}><RefreshCw className={`w-4 h-4 ml-1 ${isLoading ? 'animate-spin' : ''}`} />بروزرسانی</Button>
      </div>
      <Card className="glass"><CardContent className="p-6">
        <DataTable data={items} columns={columns} loading={isLoading}
          onEdit={(i) => { setEditingItem(i); setIsFormOpen(true); }}
          onDelete={(i) => setDeleteId(i.id)}
          emptyMessage="تیکتی یافت نشد" />
      </CardContent></Card>
      <ConfirmDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)} title="حذف تیکت" description="آیا از حذف این تیکت اطمینان دارید؟" onConfirm={handleDelete} loading={isDeleting} />
      <EntityFormModal open={isFormOpen} onOpenChange={setIsFormOpen} title="ویرایش وضعیت تیکت" fields={fields}
        initialValues={editingItem ? { status: String(editingItem.status), priority: String(editingItem.priority), assignedToUserId: editingItem.assignedToUserId || '' } : undefined}
        onSubmit={handleSubmit} submitLabel="ذخیره" />
    </div>
  );
}
