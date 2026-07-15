'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

export interface FormField {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'switch' | 'select' | 'email' | 'tel' | 'url' | 'date' | 'datetime-local' | 'tags' | 'password';
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
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      const initial: Record<string, unknown> = {};
      fields.forEach((f) => {
        if (initialValues && f.key in initialValues) {
          let val = initialValues[f.key];
          if (f.type === 'date' && typeof val === 'string' && val.includes('T')) {
            val = val.split('T')[0];
          } else if (f.type === 'datetime-local' && typeof val === 'string' && val.includes('T')) {
            val = val.replace('Z', '').slice(0, 16);
          }
          initial[f.key] = val;
        } else {
          if (f.type === 'switch') initial[f.key] = false;
          else if (f.type === 'number') initial[f.key] = 0;
          else initial[f.key] = '';
        }
      });
      setValues(initial);
      setError(null);
    }
  }, [open, initialValues, fields]);

  const handleChange = (key: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    for (const field of fields) {
      if (field.required) {
        const val = values[field.key];
        if (val === undefined || val === null || String(val).trim() === '') {
          setError(`فیلد "${field.label}" الزامی است`);
          return;
        }
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ذخیره‌سازی');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const value = values[field.key];

    if (field.type === 'switch') {
      return (
        <div className="flex items-center gap-3">
          <Switch
            checked={Boolean(value)}
            onCheckedChange={(checked) => handleChange(field.key, checked)}
          />
          <Label className="text-sm text-muted-foreground">{Boolean(value) ? 'فعال' : 'غیرفعال'}</Label>
        </div>
      );
    }

    if (field.type === 'select') {
      return (
        <select
          value={String(value ?? '')}
          onChange={(e) => handleChange(field.key, e.target.value)}
          className="w-full h-10 px-3 rounded-md bg-muted/50 border border-border focus:border-sky-500 dark:focus:border-cyan-500 text-foreground text-sm transition-colors focus:outline-none"
        >
          <option value="">انتخاب کنید...</option>
          {(field.options || []).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === 'textarea') {
      return (
        <Textarea
          value={String(value ?? '')}
          onChange={(e) => handleChange(field.key, e.target.value)}
          placeholder={field.placeholder}
          rows={field.rows || 4}
          className="bg-muted/50 border-border resize-none"
          required={field.required}
        />
      );
    }

    return (
      <Input
        type={field.type || 'text'}
        value={String(value ?? '')}
        onChange={(e) => handleChange(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
        placeholder={field.placeholder}
        className="bg-muted/50 border-border"
        required={field.required}
      />
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative glass rounded-2xl w-full max-w-2xl my-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm border border-red-500/20">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {fields.map((field) => (
                    <div
                      key={field.key}
                      className={field.fullWidth || field.type === 'textarea' ? 'col-span-full' : ''}
                    >
                      <Label className="text-sm font-medium mb-2 block">
                        {field.label}
                        {field.required && <span className="text-red-500 mr-1">*</span>}
                      </Label>
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  انصراف
                </Button>
                <Button
                  type="submit"
                  className="btn-primary shadow-glow"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  ) : null}
                  {submitLabel}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
