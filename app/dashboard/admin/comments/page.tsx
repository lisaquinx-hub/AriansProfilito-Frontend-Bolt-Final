'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, RefreshCw, ToggleLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { ViewDetailModal } from '@/components/admin/ViewDetailModal';
import { adminCommentsService } from '@/services/admin/CommentsService';
import { Comment } from '@/types/api';
import { getApiErrorMessage } from '@/services/api';
import { toast } from 'sonner';

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [viewItem, setViewItem] = useState<Comment | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  const fetchComments = async () => {
    setIsLoading(true);
    const data = await adminCommentsService.getAll();
    setComments(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await adminCommentsService.delete(deleteId);
      setComments(prev => prev.filter(c => c.id !== deleteId));
      setDeleteId(null);
      toast.success('نظر با موفقیت حذف شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
    setIsDeleting(false);
  };

  const handleApproval = async (comment: Comment) => {
    try {
      await adminCommentsService.updateApproval(comment.id, !comment.isApproved);
      setComments(prev => prev.map(c =>
        c.id === comment.id ? { ...c, isApproved: !c.isApproved } : c
      ));
      toast.success(!comment.isApproved ? 'نظر تأیید شد' : 'نظر رد شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleView = async (item: Comment) => {
    setViewItem({ ...item });
    setViewError(null);
    setViewLoading(true);
    try {
      const detail = await adminCommentsService.getById(item.id);
      if (detail) setViewItem(detail);
    } catch (err) {
      setViewError(getApiErrorMessage(err));
    } finally {
      setViewLoading(false);
    }
  };

  const columns = [
    {
      key: 'fullName',
      label: 'نام',
      render: (comment: Comment) => (
        <div>
          <div className="font-medium">{comment.fullName}</div>
          <div className="text-xs text-muted-foreground">{comment.email}</div>
        </div>
      ),
    },
    {
      key: 'message',
      label: 'پیام',
      render: (comment: Comment) => (
        <div className="max-w-xs truncate text-sm">{comment.message}</div>
      ),
    },
    {
      key: 'blogPostTitle',
      label: 'مقاله',
      render: (comment: Comment) => comment.blogPostTitle || '-',
    },
    {
      key: 'isApproved',
      label: 'وضعیت',
      render: (comment: Comment) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          comment.isApproved
            ? 'bg-green-500/10 text-green-500'
            : 'bg-yellow-500/10 text-yellow-500'
        }`}>
          {comment.isApproved ? 'تأیید شده' : 'در انتظار'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'تاریخ',
      render: (comment: Comment) =>
        comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('fa-IR') : '-',
    },
  ];

  const extraActions = [
    {
      label: 'تغییر تأیید',
      icon: <ToggleLeft className="w-4 h-4" />,
      onClick: (comment: Comment) => handleApproval(comment),
      className: 'text-amber-500 hover:text-amber-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            مدیریت نظرات
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {comments.filter(c => !c.isApproved).length} نظر در انتظار تأیید
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchComments}>
          <RefreshCw className="w-4 h-4 ml-1" />
          بروزرسانی
        </Button>
      </div>

      <Card className="glass">
        <CardContent className="p-6">
          <DataTable
            data={comments}
            columns={columns}
            loading={isLoading}
            onView={handleView}
            onDelete={(comment) => setDeleteId(comment.id)}
            extraActions={extraActions}
            idLookup={{
              entityLabel: 'نظر',
              getById: (id) => adminCommentsService.getById(id),
            }}
            emptyMessage="نظری یافت نشد"
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف نظر"
        description="آیا از حذف این نظر اطمینان دارید؟"
        onConfirm={handleDelete}
        loading={isDeleting}
      />

      <ViewDetailModal
        open={!!viewItem || viewLoading}
        onClose={() => { setViewItem(null); setViewError(null); setViewLoading(false); }}
        title="جزئیات نظر"
        loading={viewLoading}
        error={viewError}
        fields={viewItem ? [
          { label: 'شناسه', value: viewItem.id },
          { label: 'نام', value: viewItem.fullName },
          { label: 'ایمیل', value: viewItem.email },
          { label: 'مقاله', value: viewItem.blogPostTitle || '-' },
          { label: 'وضعیت', value: viewItem.isApproved ? 'تأیید شده' : 'در انتظار تأیید' },
          { label: 'پیام', value: viewItem.message, fullWidth: true },
          { label: 'تاریخ ایجاد', value: viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleString('fa-IR') : '-' },
        ] : []}
      />
    </div>
  );
}
