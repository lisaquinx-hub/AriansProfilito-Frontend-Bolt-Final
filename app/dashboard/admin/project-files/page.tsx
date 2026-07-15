'use client';

import { useEffect, useState } from 'react';
import { Files, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { EntityFormModal, FormField } from '@/components/admin/EntityFormModal';
import { EntityIdLookup } from '@/components/admin/EntityIdLookup';
import { ViewDetailModal } from '@/components/admin/ViewDetailModal';
import {
  adminProjectFilesService,
  ProjectFilePayload,
} from '@/services/admin/ProjectFilesService';
import { ProjectFile } from '@/types/api';
import { getApiErrorMessage } from '@/services/api';
import { toast } from 'sonner';

const formatSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export default function AdminProjectFilesPage() {
  const [items, setItems] = useState<ProjectFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewItem, setViewItem] = useState<ProjectFile | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<ProjectFile | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setItems(await adminProjectFilesService.getAll());
    setIsLoading(false);
  };

  useEffect(() => { void fetchData(); }, []);

  const handleView = async (item: ProjectFile) => {
    setViewItem(item);
    setViewError(null);
    setViewLoading(true);
    try {
      const detail = await adminProjectFilesService.getById(item.id);
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
      await adminProjectFilesService.delete(deleteId);
      setItems((current) => current.filter((item) => item.id !== deleteId));
      toast.success('فایل پروژه حذف شد');
      setDeleteId(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    const payload: ProjectFilePayload = {
      projectId: String(data.projectId || '').trim(),
      fileName: String(data.fileName || '').trim(),
      filePath: String(data.filePath || '').trim(),
      fileSize: Number(data.fileSize) || 0,
      contentType: String(data.contentType || '').trim(),
    };
    const saved = editingItem
      ? await adminProjectFilesService.update(editingItem.id, payload)
      : await adminProjectFilesService.create(payload);
    if (saved) {
      toast.success(editingItem ? 'فایل پروژه ویرایش شد' : 'فایل پروژه ایجاد شد');
      await fetchData();
    }
  };

  const fields: FormField[] = [
    { key: 'projectId', label: 'شناسه پروژه', required: true },
    { key: 'fileName', label: 'نام فایل', required: true },
    { key: 'filePath', label: 'مسیر فایل', required: true, fullWidth: true },
    { key: 'fileSize', label: 'حجم (بایت)', type: 'number', required: true },
    { key: 'contentType', label: 'نوع محتوا', required: true },
  ];

  const columns = [
    { key: 'fileName', label: 'نام فایل' },
    { key: 'projectTitle', label: 'پروژه', render: (item: ProjectFile) => item.projectTitle || item.projectCode || '-' },
    { key: 'fileSize', label: 'حجم', render: (item: ProjectFile) => formatSize(item.fileSize) },
    { key: 'contentType', label: 'نوع محتوا' },
    { key: 'createdAt', label: 'تاریخ', render: (item: ProjectFile) => new Date(item.createdAt).toLocaleDateString('fa-IR') },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Files className="w-6 h-6" />فایل‌های پروژه</h1>
          <p className="text-sm text-muted-foreground mt-1">{items.length} فایل</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => void fetchData()}><RefreshCw className="w-4 h-4 ml-1" />بروزرسانی</Button>
          <Button size="sm" className="btn-primary" onClick={() => { setEditingItem(null); setIsFormOpen(true); }}><Plus className="w-4 h-4 ml-1" />ایجاد</Button>
        </div>
      </div>

      <EntityIdLookup<ProjectFile[]>
        entityLabel="پروژه"
        getById={(projectId) => adminProjectFilesService.getByProjectId(projectId)}
        onResult={(files) => setItems(files || [])}
        onClear={() => void fetchData()}
      />

      <Card className="glass"><CardContent className="p-6">
        <DataTable
          data={items}
          columns={columns}
          loading={isLoading}
          onView={handleView}
          onEdit={(item) => { setEditingItem(item); setIsFormOpen(true); }}
          onDelete={(item) => setDeleteId(item.id)}
          idLookup={{
            entityLabel: 'فایل پروژه',
            getById: (id) => adminProjectFilesService.getById(id),
          }}
          emptyMessage="فایل پروژه‌ای یافت نشد"
        />
      </CardContent></Card>

      <EntityFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={editingItem ? 'ویرایش فایل پروژه' : 'فایل پروژه جدید'}
        fields={fields}
        initialValues={editingItem ? { ...editingItem } as Record<string, unknown> : undefined}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)} title="حذف فایل پروژه" description="آیا از حذف این فایل اطمینان دارید؟" onConfirm={() => void handleDelete()} loading={isDeleting} />
      <ViewDetailModal
        open={!!viewItem || viewLoading}
        onClose={() => { setViewItem(null); setViewError(null); setViewLoading(false); }}
        title="جزئیات فایل پروژه"
        loading={viewLoading}
        error={viewError}
        fields={viewItem ? [
          { label: 'شناسه', value: viewItem.id },
          { label: 'شناسه پروژه', value: viewItem.projectId },
          { label: 'پروژه', value: viewItem.projectTitle || '-' },
          { label: 'کد پروژه', value: viewItem.projectCode || '-' },
          { label: 'نام فایل', value: viewItem.fileName },
          { label: 'مسیر فایل', value: viewItem.filePath, fullWidth: true },
          { label: 'حجم', value: formatSize(viewItem.fileSize) },
          { label: 'نوع محتوا', value: viewItem.contentType },
          { label: 'تاریخ ایجاد', value: new Date(viewItem.createdAt).toLocaleString('fa-IR') },
        ] : []}
      />
    </div>
  );
}
