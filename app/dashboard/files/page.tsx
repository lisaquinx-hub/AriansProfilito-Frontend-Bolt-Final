'use client';

import { useEffect, useState } from 'react';
import { Files, Paperclip, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { EntityIdLookup } from '@/components/admin/EntityIdLookup';
import { ViewDetailModal } from '@/components/admin/ViewDetailModal';
import { fileAttachmentsService } from '@/services/FileAttachmentsService';
import { projectFilesService } from '@/services/ProjectFilesService';
import { FileAttachment, ProjectFile } from '@/types/api';
import { getApiErrorMessage } from '@/services/api';
import { toast } from 'sonner';

const formatSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export default function FilesPage() {
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewAttachment, setViewAttachment] = useState<FileAttachment | null>(null);
  const [viewProjectFile, setViewProjectFile] = useState<ProjectFile | null>(null);
  const [viewError, setViewError] = useState<string | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAttachments = async () => {
    setIsLoading(true);
    setAttachments(await fileAttachmentsService.getMy());
    setIsLoading(false);
  };

  useEffect(() => { void fetchAttachments(); }, []);

  const showAttachment = async (item: FileAttachment) => {
    setViewAttachment(item);
    setViewError(null);
    setViewLoading(true);
    try {
      const detail = await fileAttachmentsService.getMyById(item.id);
      if (detail) setViewAttachment(detail);
    } catch (error) {
      setViewError(getApiErrorMessage(error));
    } finally {
      setViewLoading(false);
    }
  };

  const showProjectFile = async (item: ProjectFile) => {
    setViewProjectFile(item);
    setViewError(null);
    setViewLoading(true);
    try {
      const detail = await projectFilesService.getMyById(item.id);
      if (detail) setViewProjectFile(detail);
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
      await fileAttachmentsService.deleteMy(deleteId);
      setAttachments((items) => items.filter((item) => item.id !== deleteId));
      toast.success('پیوست حذف شد');
      setDeleteId(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const attachmentColumns = [
    { key: 'fileName', label: 'نام فایل' },
    { key: 'module', label: 'ماژول' },
    { key: 'size', label: 'حجم', render: (item: FileAttachment) => formatSize(item.size) },
    { key: 'isPublic', label: 'دسترسی', render: (item: FileAttachment) => item.isPublic ? 'عمومی' : 'خصوصی' },
    { key: 'createdAt', label: 'تاریخ', render: (item: FileAttachment) => new Date(item.createdAt).toLocaleDateString('fa-IR') },
  ];

  const projectFileColumns = [
    { key: 'fileName', label: 'نام فایل' },
    { key: 'projectTitle', label: 'پروژه', render: (item: ProjectFile) => item.projectTitle || item.projectCode || '-' },
    { key: 'fileSize', label: 'حجم', render: (item: ProjectFile) => formatSize(item.fileSize) },
    { key: 'contentType', label: 'نوع محتوا' },
    { key: 'createdAt', label: 'تاریخ', render: (item: ProjectFile) => new Date(item.createdAt).toLocaleDateString('fa-IR') },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Files className="w-7 h-7" />فایل‌ها</h1>
          <p className="text-muted-foreground mt-1">مشاهده پیوست‌ها و فایل‌های پروژه‌های شما</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void fetchAttachments()}><RefreshCw className="w-4 h-4 ml-1" />به‌روزرسانی</Button>
      </div>

      <Card className="glass">
        <CardHeader><CardTitle className="flex items-center gap-2"><Paperclip className="w-5 h-5" />پیوست‌های من</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            data={attachments}
            columns={attachmentColumns}
            loading={isLoading}
            onView={showAttachment}
            onDelete={(item) => setDeleteId(item.id)}
            idLookup={{
              entityLabel: 'پیوست شما',
              getById: (id) => fileAttachmentsService.getMyById(id),
            }}
            emptyMessage="پیوستی یافت نشد"
          />
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader><CardTitle>فایل‌های پروژه</CardTitle></CardHeader>
        <CardContent>
          <EntityIdLookup<ProjectFile[]>
            entityLabel="پروژه شما"
            getById={(projectId) => projectFilesService.getMyByProjectId(projectId)}
            onResult={(files) => setProjectFiles(files || [])}
            onClear={() => setProjectFiles([])}
          />
          <DataTable
            data={projectFiles}
            columns={projectFileColumns}
            onView={showProjectFile}
            idLookup={{
              entityLabel: 'فایل پروژه شما',
              getById: (id) => projectFilesService.getMyById(id),
            }}
            emptyMessage="برای مشاهده فایل‌ها، شناسه پروژه را وارد کنید"
          />
        </CardContent>
      </Card>

      <ConfirmDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)} title="حذف پیوست" description="آیا از حذف این پیوست اطمینان دارید؟" onConfirm={() => void handleDelete()} loading={isDeleting} />
      <ViewDetailModal
        open={!!viewAttachment || viewLoading && !viewProjectFile}
        onClose={() => { setViewAttachment(null); setViewError(null); setViewLoading(false); }}
        title="جزئیات پیوست"
        loading={viewLoading}
        error={viewError}
        fields={viewAttachment ? [
          { label: 'شناسه', value: viewAttachment.id },
          { label: 'نام فایل', value: viewAttachment.fileName },
          { label: 'نام اصلی', value: viewAttachment.originalFileName },
          { label: 'مسیر', value: viewAttachment.filePath, fullWidth: true },
          { label: 'حجم', value: formatSize(viewAttachment.size) },
          { label: 'ماژول', value: viewAttachment.module },
          { label: 'شناسه مرجع', value: viewAttachment.referenceId },
          { label: 'دسترسی', value: viewAttachment.isPublic ? 'عمومی' : 'خصوصی' },
        ] : []}
      />
      <ViewDetailModal
        open={!!viewProjectFile}
        onClose={() => { setViewProjectFile(null); setViewError(null); setViewLoading(false); }}
        title="جزئیات فایل پروژه"
        loading={viewLoading}
        error={viewError}
        fields={viewProjectFile ? [
          { label: 'شناسه', value: viewProjectFile.id },
          { label: 'شناسه پروژه', value: viewProjectFile.projectId },
          { label: 'پروژه', value: viewProjectFile.projectTitle || '-' },
          { label: 'نام فایل', value: viewProjectFile.fileName },
          { label: 'مسیر', value: viewProjectFile.filePath, fullWidth: true },
          { label: 'حجم', value: formatSize(viewProjectFile.fileSize) },
          { label: 'نوع محتوا', value: viewProjectFile.contentType },
        ] : []}
      />
    </div>
  );
}
