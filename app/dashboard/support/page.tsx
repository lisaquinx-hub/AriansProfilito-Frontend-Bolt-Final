'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LifeBuoy, Plus, AlertCircle, X, Send, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supportService, SupportTicket, CreateTicketRequest } from '@/services/SupportService';
import { getApiErrorMessage } from '@/services/api';

const STATUS_LABELS: Record<number, string> = { 1: 'باز', 2: 'پاسخ داده شده', 3: 'بسته' };
const STATUS_COLORS: Record<number, string> = {
  1: 'bg-sky-500/20 text-sky-500 dark:bg-blue-500/20 dark:text-blue-400',
  2: 'bg-yellow-500/20 text-yellow-500',
  3: 'bg-gray-500/20 text-gray-500',
};
const PRIORITY_LABELS: Record<number, string> = { 1: 'کم', 2: 'متوسط', 3: 'زیاد', 4: 'بحرانی' };

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateTicketRequest>({ title: '', description: '', priority: 2 });

  const fetchTickets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await supportService.getTickets();
      setTickets(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleCreate = async () => {
    if (!formData.title || !formData.description) {
      setSubmitError('موضوع و پیام الزامی است');
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await supportService.createTicket(formData);
      setSuccessMsg('تیکت با موفقیت ایجاد شد');
      setIsModalOpen(false);
      setFormData({ title: '', description: '', priority: 2 });
      fetchTickets();
    } catch (err) {
      setSubmitError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">پشتیبانی</h1>
          <p className="text-muted-foreground mt-1">تیکت‌های پشتیبانی شما</p>
        </div>
        <Button className="btn-primary shadow-glow" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 ml-2" />
          تیکت جدید
        </Button>
      </div>

      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4 text-green-500 text-sm"
        >
          {successMsg}
        </motion.div>
      )}

      {error && !isLoading && (
        <div className="glass rounded-xl p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <p className="text-muted-foreground">{error}</p>
          <Button variant="outline" className="mt-4 rounded-full" onClick={fetchTickets}>
            تلاش مجدد
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass rounded-xl p-6 animate-pulse">
              <div className="flex gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-40" />
                  <div className="h-3 bg-muted rounded w-24" />
                </div>
              </div>
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-1/2 mt-2" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && !error && tickets.length === 0 && (
        <div className="glass rounded-2xl p-12 text-center">
          <LifeBuoy className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">تیکتی وجود ندارد</h3>
          <p className="text-muted-foreground text-sm mb-6">
            هنوز تیکت پشتیبانی ثبت نکرده‌اید.
          </p>
          <Button className="btn-primary shadow-glow" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 ml-2" />
            تیکت جدید
          </Button>
        </div>
      )}

      {!isLoading && !error && tickets.length > 0 && (
        <div className="space-y-4">
          {tickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-xl p-6 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-sky-500 dark:text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{ticket.title}</h3>
                    {ticket.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {ticket.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[ticket.status] || 'bg-muted text-muted-foreground'}`}>
                        {STATUS_LABELS[ticket.status] || String(ticket.status)}
                      </span>
                      {ticket.priority && (
                        <span className="text-xs px-2 py-1 rounded-full bg-muted/30 text-muted-foreground">
                          {PRIORITY_LABELS[ticket.priority] || String(ticket.priority)}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('fa-IR') : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative glass rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">تیکت پشتیبانی جدید</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
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

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">موضوع *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-muted/50 border-border"
                    placeholder="موضوع تیکت را وارد کنید"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">پیام *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-muted/50 border-border resize-none"
                    rows={4}
                    placeholder="پیام خود را شرح دهید"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">اولویت</Label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-md bg-muted/50 border border-border text-foreground text-sm"
                  >
                    <option value={1}>کم</option>
                    <option value={2}>متوسط</option>
                    <option value={3}>زیاد</option>
                    <option value={4}>بحرانی</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  انصراف
                </Button>
                <Button
                  className="btn-primary shadow-glow"
                  onClick={handleCreate}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      در حال ارسال...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 ml-2" />
                      ارسال تیکت
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
