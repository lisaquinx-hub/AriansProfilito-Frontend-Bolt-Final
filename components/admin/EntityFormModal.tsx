'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export interface FormField {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'switch' | 'select' | 'email' | 'tel' | 'url' | 'date';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  fullWidth?: boolean;
  rows?: number;
}

interface EntityFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fields: FormField[];
  initialValues?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  submitLabel?: string;
}

export function EntityFormModal({
  open,
  onOpenChange,
  title,
  fields,
  initialValues,
  onSubmit,
  submitLabel = 'ذخیره',
}: EntityFormModalProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      const initial: Record<string, unknown> = {};
      fields.forEach((field) => {
        const val = initialValues?.[field.key];
        initial[field.key] = field.type === 'switch' ? (val ?? false) : (val ?? '');
      });
      setFormData(initial);
      setSubmitError(null);
    }
  }, [open, initialValues, fields]);

  const handleChange = (key: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing = fields.filter((f) => f.required && !formData[f.key]);
    if (missing.length > 0) {
      setSubmitError(`${missing[0].label} الزامی است`);
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'خطا در ذخیره‌سازی');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.key];
    const colSpan = field.fullWidth ? 'md:col-span-2' : '';

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.key} className={cn('space-y-2', colSpan)}>
            <Label htmlFor={field.key}>
              {field.label}
              {field.required && <span className="text-red-500 mr-1">*</span>}
            </Label>
            <Textarea
              id={field.key}
              value={String(value ?? '')}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="bg-muted/50 border-border resize-none"
              rows={field.rows ?? 3}
              placeholder={field.placeholder}
            />
          </div>
        );
      case 'switch':
        return (
          <div key={field.key} className={cn('space-y-2', colSpan)}>
            <div className="flex items-center justify-between">
              <Label htmlFor={field.key}>{field.label}</Label>
              <Switch
                id={field.key}
                checked={Boolean(value)}
                onCheckedChange={(checked) => handleChange(field.key, checked)}
              />
            </div>
          </div>
        );
      case 'select':
        return (
          <div key={field.key} className={cn('space-y-2', colSpan)}>
            <Label htmlFor={field.key}>
              {field.label}
              {field.required && <span className="text-red-500 mr-1">*</span>}
            </Label>
            <select
              id={field.key}
              value={String(value ?? '')}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-full h-10 rounded-md border border-border bg-muted/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">انتخاب کنید</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        );
      case 'number':
        return (
          <div key={field.key} className={cn('space-y-2', colSpan)}>
            <Label htmlFor={field.key}>
              {field.label}
              {field.required && <span className="text-red-500 mr-1">*</span>}
            </Label>
            <Input
              id={field.key}
              type="number"
              value={String(value ?? '')}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="bg-muted/50 border-border"
              placeholder={field.placeholder}
            />
          </div>
        );
      case 'date':
        return (
          <div key={field.key} className={cn('space-y-2', colSpan)}>
            <Label htmlFor={field.key}>
              {field.label}
              {field.required && <span className="text-red-500 mr-1">*</span>}
            </Label>
            <Input
              id={field.key}
              type="date"
              value={String(value ?? '')}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="bg-muted/50 border-border"
            />
          </div>
        );
      default:
        return (
          <div key={field.key} className={cn('space-y-2', colSpan)}>
            <Label htmlFor={field.key}>
              {field.label}
              {field.required && <span className="text-red-500 mr-1">*</span>}
            </Label>
            <Input
              id={field.key}
              type={field.type || 'text'}
              value={String(value ?? '')}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="bg-muted/50 border-border"
              placeholder={field.placeholder}
            />
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative glass rounded-2xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">{title}</h3>
              <button
                onClick={() => onOpenChange(false)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                {fields.map((field) => renderField(field))}
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  انصراف
                </Button>
                <Button
                  type="submit"
                  className="btn-primary shadow-glow"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      در حال ذخیره...
                    </>
                  ) : (
                    submitLabel
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
