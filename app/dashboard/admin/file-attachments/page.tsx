'use client';

import { useEffect, useState } from 'react';
import { Paperclip, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { ViewDetailModal } from '@/components/admin/ViewDetailModal';
import { UserIdFilter } from '@/components/admin/UserIdFilter';
import {
  adminFileAttachmentsService,
  FileAttachmentPayload,
} from '@/services/admin/FileAttachmentsService';
import { FileAttachment } from '@/types/api';
import { getApiErrorMessage } from '@/services/api';
import { toast } from 'sonner';
import { isValidUuid } from '@/lib/identifiers';

const formatSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export default function AdminFileAttachmentsPage() {
  const [items, setItems] = useState<FileAttachment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewItem, setViewItem] = useState<FileAttachment | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<FileAttachment | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [referenceModule, setReferenceModule] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [referenceLoading, setReferenceLoading] = useState(false);
  const [referenceError, setReferenceError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setItems(await adminFileAttachmentsService.getAll());
    setIsLoading(false);
  };

  useEffect(() => { void fetchData(); }, []);

  const handleView = async (item: FileAttachment) => {
    setViewItem(item);
    setViewError(null);
    setViewLoading(true);
    try {
      const detail = await adminFileAttachmentsService.getById(item.id);
      if (detail) setViewItem(detail);
    } catch (error) {
      setViewError(getApiErrorMessage(error));
    } finally {
      setViewLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await adminFileAttachmentsService.delete(deleteId);
      setItems((current) => current.filter((item) => item.id !== deleteId));
      toast.success('پیوست با موفقیت حذف شد');
      setDeleteId(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    const payload: FileAttachmentPayload = {
      fileName: String(data.fileName || '').trim(),
      originalFileName: String(data.originalFileName || '').trim(),
      filePath: String(data.filePath || '').trim(),
      extension: String(data.extension || '').trim(),
      contentType: String(data.contentType || '').trim(),
      size: Number(data.size) || 0,
      uploadedByUserId: String(data.uploadedByUserId || '').trim(),
      module: String(data.module || '').trim(),
      referenceId: String(data.referenceId || '').trim(),
      isPublic: Boolean(data.isPublic),
    };

    const saved = editingItem
      ? await adminFileAttachmentsService.update(editingItem.id, payload)
      : await adminFileAttachmentsService.create(payload);
    if (saved) {
      toast.success(editingItem ? 'پیوست ویرایش شد' : 'پیوست ایجاد شد');
      await fetchData();
    }
  };

  const handleReferenceSearch = async () => {
    const moduleName = referenceModule.trim();
    const id = referenceId.trim();
    if (!moduleName) {
      setReferenceError('نام ماژول را وارد کنید');
      return;
    }
    if (!isValidUuid(id)) {
      setReferenceError('شناسه مرجع باید یک UUID معتبر باشد');
      return;
    }
    setReferenceLoading(true);
    setReferenceError(null);
    try {
      setItems(await adminFileAttachmentsService.getByReference(moduleName, id));
    } catch (error) {
      setReferenceError(getApiErrorMessage(error));
      setItems([]);
    } finally {
      setReferenceLoading(false);
    }
  };

  const clearReferenceSearch = () => {
    setReferenceModule('');
    setReferenceId('');
    setReferenceError(null);
    void fetchData();
  };

  const fields: FormField[] = [
    { key: 'fileName', label: 'نام فایل', required: true },
    { key: 'originalFileName', label: 'نام اصلی فایل', required: true },
    { key: 'filePath', label: 'مسیر فایل', required: true, fullWidth: true },
    { key: 'extension', label: 'پسوند', required: true },
    { key: 'contentType', label: 'نوع محتوا', required: true },
    { key: 'size', label: 'حجم (بایت)', type: 'number', required: true },
    { key: 'uploadedByUserId', label: 'شناسه آپلودکننده', required: true },
    { key: 'module', label: 'ماژول', required: true },
    { key: 'referenceId', label: 'شناسه مرجع', required: true },
    { key: 'isPublic', label: 'فایل عمومی', type: 'switch' },
  ];

  const columns = [
    { key: 'fileName', label: 'نام فایل' },
    { key: 'module', label: 'ماژول' },
    { key: 'uploadedByFullName', label: 'آپلودکننده', render: (item: FileAttachment) => item.uploadedByFullName || item.uploadedByEmail || '-' },
    { key: 'size', label: 'حجم', render: (item: FileAttachment) => formatSize(item.size) },
    { key: 'isPublic', label: 'دسترسی', render: (item: FileAttachment) => item.isPublic ? 'عمومی' : 'خصوصی' },
    { key: 'createdAt', label: 'تاریخ', render: (item: FileAttachment) => new Date(item.createdAt).toLocaleDateString('fa-IR') },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Paperclip className="w-6 h-6" />پیوست‌های فایل</h1>
          <p className="text-sm text-muted-foreground mt-1">{items.length} پیوست</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => void fetchData()}><RefreshCw className="w-4 h-4 ml-1" />به‌روزرسانی</Button>
          <Button size="sm" className="btn-primary" onClick={() => { setEditingItem(null); setIsFormOpen(true); }}><Plus className="w-4 h-4 ml-1" />ایجاد</Button>
        </div>
      </div>

      <Card className="glass"><CardContent className="p-6">
        <div className="mb-4">
          <h2 className="font-semibold">جست‌وجو با ماژول و شناسه مرجع</h2>
          <p className="text-sm text-muted-foreground mt-1">مسیر API reference/&#123;module&#125;/&#123;referenceId&#125;</p>
        </div>
        <div className="space-y-3">
          <Input
            value={referenceModule}
            onChange={(event) => setReferenceModule(event.target.value)}
            placeholder="نام ماژول"
            className="bg-muted/50 border-border"
          />
          <UserIdFilter
            value={referenceId}
            onChange={setReferenceId}
            onSearch={() => void handleReferenceSearch()}
            onClear={clearReferenceSearch}
            loading={referenceLoading}
            error={referenceError}
            placeholder="شناسه مرجع (UUID)"
          />
        </div>
      </CardContent></Card>

      <Card className="glass"><CardContent className="p-6">
        <DataTable
          data={items}
          columns={columns}
          loading={isLoading}
          onView={handleView}
          onEdit={(item) => { setEditingItem(item); setIsFormOpen(true); }}
          onDelete={(item) => setDeleteId(item.id)}
          idLookup={{
            entityLabel: 'پیوست فایل',
            getById: (id) => adminFileAttachmentsService.getById(id),
          }}
          emptyMessage="پیوستی یافت نشد"
        />
      </CardContent></Card>

      <EntityFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={editingItem ? 'ویرایش پیوست' : 'پیوست جدید'}
        fields={fields}
        initialValues={editingItem ? { ...editingItem } as Record<string, unknown> : undefined}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)} title="حذف پیوست" description="آیا از حذف این پیوست اطمینان دارید؟" onConfirm={() => void handleDelete()} loading={isDeleting} />
      <ViewDetailModal
        open={!!viewItem || viewLoading}
        onClose={() => { setViewItem(null); setViewError(null); setViewLoading(false); }}
        title="جزئیات پیوست"
        loading={viewLoading}
        error={viewError}
        fields={viewItem ? [
          { label: 'شناسه', value: viewItem.id },
          { label: 'نام فایل', value: viewItem.fileName },
          { label: 'نام اصلی', value: viewItem.originalFileName },
          { label: 'مسیر فایل', value: viewItem.filePath, fullWidth: true },
          { label: 'نوع محتوا', value: viewItem.contentType },
          { label: 'حجم', value: formatSize(viewItem.size) },
          { label: 'آپلودکننده', value: viewItem.uploadedByFullName || viewItem.uploadedByEmail || '-' },
          { label: 'شناسه آپلودکننده', value: viewItem.uploadedByUserId },
          { label: 'ماژول', value: viewItem.module },
          { label: 'شناسه مرجع', value: viewItem.referenceId },
          { label: 'دسترسی', value: viewItem.isPublic ? 'عمومی' : 'خصوصی' },
          { label: 'تاریخ ایجاد', value: new Date(viewItem.createdAt).toLocaleString('fa-IR') },
        ] : []}
      />
    </div>
  );
}
