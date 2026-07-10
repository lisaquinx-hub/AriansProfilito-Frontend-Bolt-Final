'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, RefreshCw, CheckCheck, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { ViewDetailModal } from '@/components/admin/ViewDetailModal';
import { adminContactMessagesService } from '@/services/admin/ContactMessagesService';
import { ContactMessage } from '@/types/api';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/services/api';
import { AnimatePresence, motion } from 'framer-motion';

export default function AdminContactMessagesPage() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [viewItem, setViewItem] = useState<ContactMessage | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  // Reply modal state
  const [replyItem, setReplyItem] = useState<ContactMessage | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await adminContactMessagesService.getAll();
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
      await adminContactMessagesService.delete(deleteId);
      setItems(prev => prev.filter(i => i.id !== deleteId));
      setDeleteId(null);
      toast.success('پیام با موفقیت حذف شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
    setIsDeleting(false);
  };

  const handleView = async (item: ContactMessage) => {
    setViewItem({ ...item });
    setViewError(null);
    setViewLoading(true);
    try {
      const detail = await adminContactMessagesService.getById(item.id);
      if (detail) setViewItem(detail);
    } catch (err) {
      setViewError(getApiErrorMessage(err));
    } finally {
      setViewLoading(false);
    }
  };

  const handleMarkAsRead = async (item: ContactMessage) => {
    try {
      await adminContactMessagesService.markAsRead(item.id);
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, isRead: true } : i));
      toast.success('پیام به عنوان خوانده‌شده علامت‌گذاری شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleReply = async () => {
    if (!replyItem || !replyMessage.trim()) return;
    setIsReplying(true);
    setReplyError(null);
    try {
      await adminContactMessagesService.reply(replyItem.id, replyMessage.trim());
      setReplyItem(null);
      setReplyMessage('');
      toast.success('پاسخ با موفقیت ارسال شد');
      fetchData();
    } catch (err) {
      setReplyError(getApiErrorMessage(err));
    } finally {
      setIsReplying(false);
    }
  };

  const columns = [
    {
      key: 'fullName',
      label: 'نام',
      render: (item: ContactMessage) => (
        <div>
          <div className="font-medium">{item.fullName}</div>
          <div className="text-xs text-muted-foreground">{item.email}</div>
        </div>
      ),
    },
    {
      key: 'subject',
      label: 'موضوع',
      render: (item: ContactMessage) => (
        <div className="max-w-xs truncate text-sm">{item.subject}</div>
      ),
    },
    {
      key: 'isRead',
      label: 'وضعیت',
      render: (item: ContactMessage) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          item.isRead ? 'bg-gray-500/10 text-gray-400' : 'bg-blue-500/10 text-blue-400'
        }`}>
          {item.isRead ? 'خوانده شده' : 'جدید'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'تاریخ',
      render: (item: ContactMessage) =>
        item.createdAt ? new Date(item.createdAt).toLocaleDateString('fa-IR') : '-',
    },
  ];

  const extraActions = [
    {
      label: 'علامت خوانده شد',
      icon: <CheckCheck className="w-4 h-4" />,
      onClick: (item: ContactMessage) => handleMarkAsRead(item),
      className: 'text-green-500 hover:text-green-400',
    },
    {
      label: 'پاسخ دادن',
      icon: <MessageSquare className="w-4 h-4" />,
      onClick: (item: ContactMessage) => {
        setReplyMessage('');
        setReplyError(null);
        setReplyItem(item);
      },
      className: 'text-blue-500 hover:text-blue-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            مدیریت پیام‌های تماس
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {items.filter(i => !i.isRead).length} پیام خوانده‌نشده
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData}>
          <RefreshCw className={`w-4 h-4 ml-1 ${isLoading ? 'animate-spin' : ''}`} />
          بروزرسانی
        </Button>
      </div>

      <Card className="glass">
        <CardContent className="p-6">
          <DataTable
            data={items}
            columns={columns}
            loading={isLoading}
            onView={handleView}
            onDelete={(item) => setDeleteId(item.id)}
            extraActions={extraActions}
            emptyMessage="پیامی یافت نشد"
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف پیام"
        description="آیا از حذف این پیام اطمینان دارید؟"
        onConfirm={handleDelete}
        loading={isDeleting}
      />

      <ViewDetailModal
        open={!!viewItem || viewLoading}
        onClose={() => { setViewItem(null); setViewError(null); setViewLoading(false); }}
        title="جزئیات پیام تماس"
        loading={viewLoading}
        error={viewError}
        fields={viewItem ? [
          { label: 'شناسه', value: viewItem.id },
          { label: 'نام', value: viewItem.fullName },
          { label: 'ایمیل', value: viewItem.email },
          { label: 'شماره تلفن', value: viewItem.phoneNumber || '-' },
          { label: 'موضوع', value: viewItem.subject },
          { label: 'شرکت', value: viewItem.company || '-' },
          { label: 'وضعیت', value: viewItem.isRead ? 'خوانده شده' : 'جدید' },
          { label: 'پیام', value: viewItem.message, fullWidth: true },
          { label: 'پاسخ مدیر', value: viewItem.adminReply || '-', fullWidth: true },
          { label: 'تاریخ پاسخ', value: viewItem.repliedAt ? new Date(viewItem.repliedAt).toLocaleString('fa-IR') : '-' },
          { label: 'تاریخ ایجاد', value: viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleString('fa-IR') : '-' },
        ] : []}
      />

      {/* Reply Modal */}
      <AnimatePresence>
        {replyItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50"
              onClick={() => { if (!isReplying) setReplyItem(null); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative glass rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold mb-2">پاسخ به پیام</h3>
              <p className="text-sm text-muted-foreground mb-1">از: {replyItem.fullName} ({replyItem.email})</p>
              <p className="text-sm text-muted-foreground mb-4">موضوع: {replyItem.subject}</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">پاسخ شما</label>
                  <textarea
                    value={replyMessage}
                    onChange={e => setReplyMessage(e.target.value)}
                    rows={5}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                    placeholder="پاسخ خود را وارد کنید..."
                  />
                </div>
                {replyError && (
                  <p className="text-sm text-red-400">{replyError}</p>
                )}
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => setReplyItem(null)} disabled={isReplying}>انصراف</Button>
                  <Button size="sm" className="btn-primary" onClick={handleReply} disabled={isReplying || !replyMessage.trim()}>
                    {isReplying ? 'در حال ارسال...' : 'ارسال پاسخ'}
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
