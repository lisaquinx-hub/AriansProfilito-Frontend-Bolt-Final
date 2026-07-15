'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { EntityIdLookup } from '@/components/admin/EntityIdLookup';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

type ExtraAction<T> = {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  className?: string;
};

interface DataTableProps<T> {
  data: T[] | unknown;
  columns: Column<T>[];
  loading?: boolean;
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  extraActions?: ExtraAction<T>[];
  emptyMessage?: string;
  pageSize?: number;
  idLookup?: {
    entityLabel: string;
    getById: (id: string) => Promise<T | null>;
  };
}

function normalizeData<T>(raw: T[] | unknown): T[] {
  if (Array.isArray(raw)) return raw;
  const r = raw as Record<string, unknown>;
  if (r && Array.isArray(r.items)) return r.items as T[];
  if (r && Array.isArray(r.data)) return r.data as T[];
  if (r && r.data && Array.isArray((r.data as Record<string, unknown>).items)) {
    return (r.data as Record<string, unknown>).items as T[];
  }
  return [];
}

export function DataTable<T extends { id: string }>({
  data: rawData,
  columns,
  loading = false,
  onView,
  onEdit,
  onDelete,
  extraActions,
  emptyMessage = 'داده‌ای یافت نشد',
  pageSize = 10,
  idLookup,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [idLookupActive, setIdLookupActive] = useState(false);
  const [idLookupResult, setIdLookupResult] = useState<T | null>(null);
  const sourceData = normalizeData<T>(rawData);
  const data = idLookupActive
    ? (idLookupResult ? [idLookupResult] : [])
    : sourceData;
  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setIdLookupResult(null);
    setIdLookupActive(false);
    setCurrentPage(1);
  }, [rawData]);

  const idLookupControl = idLookup ? (
    <EntityIdLookup<T>
      entityLabel={idLookup.entityLabel}
      getById={idLookup.getById}
      onResult={(item) => {
        setIdLookupResult(item);
        setIdLookupActive(true);
        setCurrentPage(1);
      }}
      onClear={() => {
        setIdLookupResult(null);
        setIdLookupActive(false);
        setCurrentPage(1);
      }}
    />
  ) : null;

  if (loading) {
    return (
      <div className="space-y-4">
        {idLookupControl}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div>
        {idLookupControl}
        <div className="text-center py-12 text-muted-foreground">
          {idLookupActive ? 'موردی با این شناسه یافت نشد' : emptyMessage}
        </div>
      </div>
    );
  }

  const hasActions = onView || onEdit || onDelete || (extraActions && extraActions.length > 0);

  return (
    <div className="space-y-4">
      {idLookupControl}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn(
                    'px-4 py-3 text-right text-sm font-medium text-muted-foreground',
                    col.className
                  )}
                >
                  {col.label}
                </th>
              ))}
              {hasActions && (
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground w-20">
                  عملیات
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="border-b border-border hover:bg-muted/30 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={cn('px-4 py-3 text-sm', col.className)}
                  >
                    {col.render
                      ? col.render(item)
                      : String((item as Record<string, unknown>)[col.key as string] ?? '')}
                  </td>
                ))}
                {hasActions && (
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="نمایش عملیات">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onView && (
                          <DropdownMenuItem onClick={() => onView(item)}>
                            <Eye className="h-4 w-4 ml-2" />
                            مشاهده
                          </DropdownMenuItem>
                        )}
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(item)}>
                            <Pencil className="h-4 w-4 ml-2" />
                            ویرایش
                          </DropdownMenuItem>
                        )}
                        {extraActions?.map((action, i) => (
                          <DropdownMenuItem
                            key={i}
                            onClick={() => action.onClick(item)}
                            className={action.className}
                          >
                            {action.icon}
                            {action.label}
                          </DropdownMenuItem>
                        ))}
                        {onDelete && (
                          <DropdownMenuItem
                            onClick={() => onDelete(item)}
                            className="text-red-500 focus:text-red-500"
                          >
                            <Trash2 className="h-4 w-4 ml-2" />
                            حذف
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="صفحه قبل"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentPage} از {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="صفحه بعد"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  loading?: boolean;
}

export function ConfirmDialog({ open, onOpenChange, title, description, onConfirm, loading }: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-label={title}>
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="relative glass rounded-2xl p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            انصراف
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'در حال حذف...' : 'حذف'}
          </Button>
        </div>
      </div>
    </div>
  );
}
