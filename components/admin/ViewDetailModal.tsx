'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, AlertCircle } from 'lucide-react';

interface DetailField {
  label: string;
  value: React.ReactNode;
  fullWidth?: boolean;
}

interface ViewDetailModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  loading?: boolean;
  error?: string | null;
  fields?: DetailField[];
  children?: React.ReactNode;
}

export function ViewDetailModal({
  open,
  onClose,
  title,
  loading,
  error,
  fields,
  children,
}: ViewDetailModalProps) {
  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative glass rounded-2xl w-full max-w-2xl my-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="بستن جزئیات"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
                </div>
              )}
              {error && !loading && (
                <div className="flex flex-col items-center py-8 text-center">
                  <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
                  <p className="text-muted-foreground text-sm">{error}</p>
                </div>
              )}
              {!loading && !error && fields && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fields.map((field, index) => (
                    <div
                      key={index}
                      className={`${field.fullWidth ? 'col-span-full' : ''}`}
                    >
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                        {field.label}
                      </div>
                      <div className="text-sm bg-muted/30 rounded-lg px-3 py-2 min-h-[36px]">
                        {field.value ?? <span className="text-muted-foreground/50">—</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!loading && !error && children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
