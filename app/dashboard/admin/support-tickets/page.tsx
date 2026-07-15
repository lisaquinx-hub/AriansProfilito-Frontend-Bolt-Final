'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LifeBuoy, RefreshCw, X, Send, Loader2, MessageSquare,
  Lock, UserCheck, Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { ViewDetailModal } from '@/components/admin/ViewDetailModal';
import { adminSupportTicketsService } from '@/services/admin/SupportTicketsService';
import { adminUsersService } from '@/services/admin/index';
import { SupportTicket } from '@/types/api';
import { getApiErrorMessage } from '@/services/api';
import { toast } from 'sonner';

const STATUS_LABELS: Record<number, string> = { 1: 'باز', 2: 'پاسخ داده شده', 3: 'بسته' };
const STATUS_COLORS: Record<number, string> = {
  1: 'bg-green-500/10 text-green-500',
  2: 'bg-sky-500/10 text-sky-500 dark:text-blue-400',
  3: 'bg-gray-500/10 text-gray-500',
};
const PRIORITY_LABELS: Record<number, string> = { 1: 'کم', 2: 'متوسط', 3: 'زیاد', 4: 'بحرانی' };
const PRIORITY_COLORS: Record<number, string> = {
  1: 'bg-gray-500/10 text-gray-400',
  2: 'bg-yellow-500/10 text-yellow-500',
  3: 'bg-orange-500/10 text-orange-500',
  4: 'bg-red-500/10 text-red-500',
};

export default function AdminSupportTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // View detail
  const [viewItem, setViewItem] = useState<SupportTicket | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  // Reply modal
  const [replyTicket, setReplyTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  // Status modal
  const [statusTicket, setStatusTicket] = useState<SupportTicket | null>(null);
  const [statusForm, setStatusForm] = useState({ status: 1, priority: 2, assignedToUserId: '' });
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  // Assign modal
  const [assignTicket, setAssignTicket] = useState<SupportTicket | null>(null);
  const [assignUserId, setAssignUserId] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);
  const [adminUsers, setAdminUsers] = useState<{ id: string; fullName: string }[]>([]);

  // Close confirm
  const [closeTicket, setCloseTicket] = useState<SupportTicket | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await adminSupportTicketsService.getAll();
    setTickets(data);
    setIsLoading(false);
  };

  const fetchAdminUsers = async () => {
    try {
      const users = await adminUsersService.getAll() as Array<{ id: string; fullName: string; role?: number }>;
      setAdminUsers(users.filter((u) => u.role === 2 || u.role === 3)
        .map((u) => ({ id: u.id, fullName: u.fullName })));
    } catch { setAdminUsers([]); }
  };

  useEffect(() => { fetchData(); fetchAdminUsers(); }, []);

  const handleView = async (ticket: SupportTicket) => {
    setViewItem({ ...ticket });
    setViewError(null);
    setViewLoading(true);
    try {
      const detail = await adminSupportTicketsService.getById(ticket.id);
      if (detail) setViewItem(detail);
    } catch (err) {
      setViewError(getApiErrorMessage(err));
    } finally {
      setViewLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyTicket || !replyText.trim()) return;
    setIsReplying(true);
    setReplyError(null);
    try {
      await adminSupportTicketsService.reply(replyTicket.id, replyText);
      setReplyText('');
      setReplyTicket(null);
      toast.success('پاسخ ارسال شد');
      fetchData();
    } catch (err) {
      setReplyError(getApiErrorMessage(err));
    } finally {
      setIsReplying(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!statusTicket) return;
    setIsUpdatingStatus(true);
    setStatusError(null);
    try {
      await adminSupportTicketsService.updateStatus(statusTicket.id, {
        status: statusForm.status,
        priority: statusForm.priority,
        assignedToUserId: statusForm.assignedToUserId || undefined,
      });
      setStatusTicket(null);
      toast.success('وضعیت به‌روز شد');
      fetchData();
    } catch (err) {
      setStatusError(getApiErrorMessage(err));
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAssign = async () => {
    if (!assignTicket) return;
    setIsAssigning(true);
    setAssignError(null);
    try {
      await adminSupportTicketsService.assign(assignTicket.id, assignUserId || '');
      setAssignTicket(null);
      setAssignUserId('');
      toast.success('ارجاع انجام شد');
      fetchData();
    } catch (err) {
      setAssignError(getApiErrorMessage(err));
    } finally {
      setIsAssigning(false);
    }
  };

  const handleClose = async () => {
    if (!closeTicket) return;
    setIsClosing(true);
    try {
      await adminSupportTicketsService.close(closeTicket.id);
      setCloseTicket(null);
      toast.success('تیکت بسته شد');
      fetchData();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setIsClosing(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await adminSupportTicketsService.delete(deleteId);
      setDeleteId(null);
      toast.success('تیکت حذف شد');
      fetchData();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    { key: 'ticketNumber', label: 'شماره', render: (t: SupportTicket) => <span className="text-xs text-muted-foreground">#{t.ticketNumber}</span> },
    { key: 'title', label: 'موضوع', render: (t: SupportTicket) => <div className="max-w-xs truncate font-medium">{t.title}</div> },
    { key: 'customerFullName', label: 'مشتری' },
    {
      key: 'status', label: 'وضعیت', render: (t: SupportTicket) => (
        <span className={`px-2 py-1 rounded-full text-xs ${STATUS_COLORS[t.status]}`}>{STATUS_LABELS[t.status]}</span>
      )
    },
    {
      key: 'priority', label: 'اولویت', render: (t: SupportTicket) => (
        <span className={`px-2 py-1 rounded-full text-xs ${PRIORITY_COLORS[t.priority]}`}>{PRIORITY_LABELS[t.priority]}</span>
      )
    },
    {
      key: 'createdAt', label: 'تاریخ', render: (t: SupportTicket) =>
        <span className="text-xs">{t.createdAt ? new Date(t.createdAt).toLocaleDateString('fa-IR') : '-'}</span>
    },
  ];

  const extraActions = [
    {
      label: 'پاسخ دادن',
      icon: <MessageSquare className="h-4 w-4 ml-2" />,
      onClick: (t: SupportTicket) => { setReplyTicket(t); setReplyText(''); setReplyError(null); },
    },
    {
      label: 'تغییر وضعیت',
      icon: <Settings className="h-4 w-4 ml-2" />,
      onClick: (t: SupportTicket) => {
        setStatusTicket(t);
        setStatusForm({ status: t.status, priority: t.priority, assignedToUserId: t.assignedToUserId || '' });
        setStatusError(null);
      },
    },
    {
      label: 'ارجاع',
      icon: <UserCheck className="h-4 w-4 ml-2" />,
      onClick: (t: SupportTicket) => {
        setAssignTicket(t);
        setAssignUserId(t.assignedToUserId || '');
        setAssignError(null);
      },
    },
    {
      label: 'بستن تیکت',
      icon: <Lock className="h-4 w-4 ml-2" />,
      onClick: (t: SupportTicket) => { if (t.status !== 3) setCloseTicket(t); },
    },
  ];

  const viewFields = viewItem ? [
    { label: 'شماره تیکت', value: viewItem.ticketNumber },
    { label: 'وضعیت', value: <span className={`px-2 py-1 rounded-full text-xs ${STATUS_COLORS[viewItem.status]}`}>{STATUS_LABELS[viewItem.status]}</span> },
    { label: 'اولویت', value: <span className={`px-2 py-1 rounded-full text-xs ${PRIORITY_COLORS[viewItem.priority]}`}>{PRIORITY_LABELS[viewItem.priority]}</span> },
    { label: 'مشتری', value: viewItem.customerFullName },
    { label: 'ایمیل', value: viewItem.customerEmail },
    { label: 'ارجاع به', value: viewItem.assignedToFullName || '-' },
    { label: 'بسته شده توسط', value: viewItem.closedByFullName || '-' },
    { label: 'تاریخ ایجاد', value: viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleDateString('fa-IR') : '-' },
    { label: 'توضیحات', value: viewItem.description, fullWidth: true },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><LifeBuoy className="w-6 h-6" />تیکت‌های پشتیبانی</h1>
          <p className="text-muted-foreground text-sm mt-1">{tickets.length} تیکت</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData}>
          <RefreshCw className={`w-4 h-4 ml-1 ${isLoading ? 'animate-spin' : ''}`} />به‌روزرسانی
        </Button>
      </div>

      <Card className="glass"><CardContent className="p-6">
        <DataTable
          data={tickets} columns={columns} loading={isLoading}
          onView={handleView}
          extraActions={extraActions}
          onDelete={(t) => setDeleteId(t.id)}
          idLookup={{
            entityLabel: 'تیکت پشتیبانی',
            getById: (id) => adminSupportTicketsService.getById(id),
          }}
          emptyMessage="تیکتی یافت نشد"
        />
      </CardContent></Card>

      {/* View detail with messages thread */}
      <ViewDetailModal
        open={!!viewItem || viewLoading}
        onClose={() => { setViewItem(null); setViewError(null); setViewLoading(false); }}
        title="جزئیات تیکت"
        loading={viewLoading}
        error={viewError}
        fields={viewFields}
      >
        {!viewLoading && !viewError && viewItem?.messages && (
          <div className="col-span-full mt-4">
            <h4 className="font-semibold text-sm mb-3 border-t border-border pt-4">پیام‌ها</h4>
            {viewItem.messages.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {viewItem.messages.map((msg) => (
                  <div key={msg.id}
                    className={`p-3 rounded-xl text-sm ${msg.isAdminMessage ? 'bg-sky-500/10 mr-8' : 'bg-muted/30 ml-8'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-xs">{msg.senderFullName} {msg.isAdminMessage ? '(ادمین)' : '(مشتری)'}</span>
                      <span className="text-muted-foreground text-xs">{new Date(msg.createdAt).toLocaleDateString('fa-IR')}</span>
                    </div>
                    <p>{msg.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">هنوز پیامی ثبت نشده است.</p>
            )}
          </div>
        )}
      </ViewDetailModal>

      {/* Reply Modal */}
      <AnimatePresence>
        {replyTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50" onClick={() => setReplyTicket(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative glass rounded-2xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">پاسخ به تیکت: {replyTicket.title}</h3>
                <button onClick={() => setReplyTicket(null)} className="p-1 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
              </div>
              {replyError && <div className="mb-3 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">{replyError}</div>}
              <Textarea value={replyText} onChange={(e) => setReplyText(e.target.value)}
                rows={4} className="bg-muted/50 border-border resize-none mb-4" placeholder="پیام پاسخ را وارد کنید..." />
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setReplyTicket(null)}>انصراف</Button>
                <Button className="btn-primary" onClick={handleReply} disabled={isReplying || !replyText.trim()}>
                  {isReplying ? <Loader2 className="w-4 h-4 animate-spin ml-1" /> : <Send className="w-4 h-4 ml-1" />}
                  ارسال پاسخ
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Status Modal */}
      <AnimatePresence>
        {statusTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50" onClick={() => setStatusTicket(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative glass rounded-2xl p-6 max-w-sm w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">تغییر وضعیت</h3>
                <button onClick={() => setStatusTicket(null)} className="p-1 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
              </div>
              {statusError && <div className="mb-3 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">{statusError}</div>}
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>وضعیت</Label>
                  <select value={statusForm.status} onChange={(e) => setStatusForm({ ...statusForm, status: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-md bg-muted/50 border border-border text-foreground text-sm">
                    <option value={1}>باز</option>
                    <option value={2}>پاسخ داده شده</option>
                    <option value={3}>بسته</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>اولویت</Label>
                  <select value={statusForm.priority} onChange={(e) => setStatusForm({ ...statusForm, priority: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-md bg-muted/50 border border-border text-foreground text-sm">
                    <option value={1}>کم</option>
                    <option value={2}>متوسط</option>
                    <option value={3}>زیاد</option>
                    <option value={4}>بحرانی</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-4">
                <Button variant="outline" onClick={() => setStatusTicket(null)}>انصراف</Button>
                <Button className="btn-primary" onClick={handleStatusUpdate} disabled={isUpdatingStatus}>
                  {isUpdatingStatus ? 'در حال ذخیره...' : 'ذخیره'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Assign Modal */}
      <AnimatePresence>
        {assignTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50" onClick={() => setAssignTicket(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative glass rounded-2xl p-6 max-w-sm w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">ارجاع تیکت</h3>
                <button onClick={() => setAssignTicket(null)} className="p-1 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
              </div>
              {assignError && <div className="mb-3 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">{assignError}</div>}
              <div className="space-y-2">
                <Label>ارجاع به (شناسه کاربر)</Label>
                {adminUsers.length > 0 ? (
                  <select value={assignUserId} onChange={(e) => setAssignUserId(e.target.value)}
                    className="w-full h-10 px-3 rounded-md bg-muted/50 border border-border text-foreground text-sm">
                    <option value="">-- بدون ارجاع --</option>
                    {adminUsers.map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}
                  </select>
                ) : (
                  <Input value={assignUserId} onChange={(e) => setAssignUserId(e.target.value)}
                    className="bg-muted/50 border-border" placeholder="شناسه کاربر (UUID)" />
                )}
              </div>
              <div className="flex gap-3 justify-end mt-4">
                <Button variant="outline" onClick={() => setAssignTicket(null)}>انصراف</Button>
                <Button className="btn-primary" onClick={handleAssign} disabled={isAssigning}>
                  {isAssigning ? 'در حال ارجاع...' : 'ارجاع'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Close confirm */}
      <ConfirmDialog
        open={!!closeTicket}
        onOpenChange={(o) => !o && setCloseTicket(null)}
        title="بستن تیکت"
        description="آیا از بستن این تیکت اطمینان دارید؟"
        onConfirm={handleClose}
        loading={isClosing}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="حذف تیکت"
        description="آیا از حذف این تیکت اطمینان دارید؟"
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </div>
  );
}
