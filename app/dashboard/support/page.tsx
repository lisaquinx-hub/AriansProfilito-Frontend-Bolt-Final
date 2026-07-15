'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LifeBuoy, Plus, AlertCircle, X, Send, Loader2, MessageSquare,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supportService, SupportTicket, CreateTicketRequest } from '@/services/SupportService';
import { getApiErrorMessage } from '@/services/api';

const STATUS_LABELS: Record<number, string> = { 1: 'باز', 2: 'پاسخ داده شده', 3: 'بسته' };
const STATUS_COLORS: Record<number, string> = {
  1: 'bg-green-500/20 text-green-500',
  2: 'bg-sky-500/20 text-sky-500 dark:bg-blue-500/20 dark:text-blue-400',
  3: 'bg-gray-500/20 text-gray-500',
};
const PRIORITY_LABELS: Record<number, string> = { 1: 'کم', 2: 'متوسط', 3: 'زیاد', 4: 'بحرانی' };
const PRIORITY_COLORS: Record<number, string> = {
  1: 'bg-gray-500/20 text-gray-400',
  2: 'bg-yellow-500/20 text-yellow-500',
  3: 'bg-orange-500/20 text-orange-500',
  4: 'bg-red-500/20 text-red-500',
};

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateTicketRequest>({ title: '', description: '', priority: 2 });
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Detail/reply modal
  const [detailTicket, setDetailTicket] = useState<SupportTicket | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  // Reply
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  // Close
  const [isClosing, setIsClosing] = useState(false);
  const [closeConfirmId, setCloseConfirmId] = useState<string | null>(null);

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

  const openDetail = async (ticket: SupportTicket) => {
    setDetailTicket(ticket);
    setDetailError(null);
    setReplyText('');
    setReplyError(null);
    setIsDetailLoading(true);
    try {
      const detail = await supportService.getTicket(ticket.id);
      if (detail) setDetailTicket(detail);
    } catch (err) {
      setDetailError(getApiErrorMessage(err));
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!createForm.title.trim() || !createForm.description.trim()) {
      setCreateError('موضوع و توضیحات الزامی است');
      return;
    }
    setIsCreating(true);
    setCreateError(null);
    try {
      await supportService.createTicket(createForm);
      setIsCreateOpen(false);
      setCreateForm({ title: '', description: '', priority: 2 });
      await fetchTickets();
    } catch (err) {
      setCreateError(getApiErrorMessage(err));
    } finally {
      setIsCreating(false);
    }
  };

  const handleReply = async () => {
    if (!detailTicket || !replyText.trim()) return;
    setIsReplying(true);
    setReplyError(null);
    try {
      await supportService.sendMessage(detailTicket.id, replyText);
      setReplyText('');
      const refreshed = await supportService.getTicket(detailTicket.id);
      if (refreshed) setDetailTicket(refreshed);
    } catch (err) {
      setReplyError(getApiErrorMessage(err));
    } finally {
      setIsReplying(false);
    }
  };

  const handleClose = async (id: string) => {
    setIsClosing(true);
    try {
      await supportService.closeTicket(id);
      setCloseConfirmId(null);
      if (detailTicket?.id === id) {
        const refreshed = await supportService.getTicket(id);
        if (refreshed) setDetailTicket(refreshed);
      }
      await fetchTickets();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">پشتیبانی</h1>
          <p className="text-muted-foreground mt-1">تیکت‌های پشتیبانی شما</p>
        </div>
        <Button className="btn-primary shadow-glow" onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 ml-2" />
          تیکت جدید
        </Button>
      </div>

      {error && !isLoading && (
        <div className="glass rounded-xl p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <p className="text-muted-foreground">{error}</p>
          <Button variant="outline" className="mt-4 rounded-full" onClick={fetchTickets}>تلاش مجدد</Button>
        </div>
      )}

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-xl p-6 animate-pulse">
              <div className="flex gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-40" />
                  <div className="h-3 bg-muted rounded w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !error && tickets.length === 0 && (
        <div className="glass rounded-2xl p-12 text-center">
          <LifeBuoy className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">تیکتی وجود ندارد</h3>
          <p className="text-muted-foreground text-sm mb-6">هنوز تیکت پشتیبانی ثبت نکرده‌اید.</p>
          <Button className="btn-primary shadow-glow" onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 ml-2" />تیکت جدید
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
              transition={{ delay: index * 0.05 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-sky-500 dark:text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{ticket.title}</h3>
                    {ticket.ticketNumber && (
                      <span className="text-xs text-muted-foreground">#{ticket.ticketNumber}</span>
                    )}
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ticket.description}</p>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[ticket.status] || 'bg-muted text-muted-foreground'}`}>
                        {STATUS_LABELS[ticket.status] || String(ticket.status)}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${PRIORITY_COLORS[ticket.priority] || 'bg-muted text-muted-foreground'}`}>
                        {PRIORITY_LABELS[ticket.priority] || String(ticket.priority)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('fa-IR') : '-'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => openDetail(ticket)}>
                    <MessageSquare className="w-3.5 h-3.5 ml-1" />مشاهده
                  </Button>
                  {ticket.status !== 3 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs text-red-500 border-red-500/30 hover:bg-red-500/10"
                      onClick={() => setCloseConfirmId(ticket.id)}
                    >
                      <Lock className="w-3.5 h-3.5 ml-1" />بستن
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Ticket Modal */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50" onClick={() => setIsCreateOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative glass rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">تیکت پشتیبانی جدید</h3>
                <button onClick={() => setIsCreateOpen(false)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {createError && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">{createError}</div>
              )}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">موضوع *</Label>
                  <Input id="title" value={createForm.title}
                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                    className="bg-muted/50 border-border" placeholder="موضوع تیکت را وارد کنید" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">توضیحات *</Label>
                  <Textarea id="description" value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    className="bg-muted/50 border-border resize-none" rows={4}
                    placeholder="مشکل یا درخواست خود را شرح دهید" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">اولویت</Label>
                  <select id="priority" value={createForm.priority}
                    onChange={(e) => setCreateForm({ ...createForm, priority: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-md bg-muted/50 border border-border text-foreground text-sm">
                    <option value={1}>کم</option>
                    <option value={2}>متوسط</option>
                    <option value={3}>زیاد</option>
                    <option value={4}>بحرانی</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>انصراف</Button>
                <Button className="btn-primary shadow-glow" onClick={handleCreate} disabled={isCreating}>
                  {isCreating ? <><Loader2 className="w-4 h-4 ml-2 animate-spin" />ارسال...</> : <><Send className="w-4 h-4 ml-2" />ارسال تیکت</>}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Ticket Detail & Reply Modal */}
      <AnimatePresence>
        {detailTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDetailTicket(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative glass rounded-2xl w-full max-w-2xl my-auto" onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                  <h2 className="text-lg font-semibold">{detailTicket.title}</h2>
                  {detailTicket.ticketNumber && (
                    <span className="text-xs text-muted-foreground">#{detailTicket.ticketNumber}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[detailTicket.status]}`}>
                    {STATUS_LABELS[detailTicket.status]}
                  </span>
                  <button onClick={() => setDetailTicket(null)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                {isDetailLoading && (
                  <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-sky-500" /></div>
                )}
                {detailError && !isDetailLoading && (
                  <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">{detailError}</div>
                )}
                {!isDetailLoading && !detailError && (
                  <>
                    {/* Description */}
                    <div className="p-4 rounded-xl bg-muted/20">
                      <p className="text-sm text-muted-foreground">{detailTicket.description}</p>
                    </div>
                    {/* Info */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-muted-foreground">اولویت: </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${PRIORITY_COLORS[detailTicket.priority]}`}>
                          {PRIORITY_LABELS[detailTicket.priority]}
                        </span>
                      </div>
                      <div><span className="text-muted-foreground">تاریخ: </span>
                        {detailTicket.createdAt ? new Date(detailTicket.createdAt).toLocaleDateString('fa-IR') : '-'}
                      </div>
                      {detailTicket.assignedToFullName && (
                        <div className="col-span-2"><span className="text-muted-foreground">ارجاع به: </span>{detailTicket.assignedToFullName}</div>
                      )}
                    </div>
                    {/* Messages thread */}
                    <div>
                      <h4 className="font-semibold text-sm mb-3">پیام‌ها</h4>
                      {detailTicket.messages && detailTicket.messages.length > 0 ? (
                        <div className="space-y-3">
                          {detailTicket.messages.map((msg) => (
                            <div key={msg.id}
                              className={`p-3 rounded-xl text-sm ${msg.isAdminMessage ? 'bg-sky-500/10 dark:bg-blue-500/10 mr-8' : 'bg-muted/30 ml-8'}`}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-xs">
                                  {msg.senderFullName} {msg.isAdminMessage ? '(پشتیبانی)' : '(شما)'}
                                </span>
                                <span className="text-muted-foreground text-xs">
                                  {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString('fa-IR') : ''}
                                </span>
                              </div>
                              <p>{msg.message}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">هنوز پیامی برای این تیکت ثبت نشده است.</p>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Reply box (only when ticket is open) */}
              {detailTicket.status !== 3 && !isDetailLoading && (
                <div className="p-6 border-t border-border space-y-3">
                  {replyError && (
                    <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">{replyError}</div>
                  )}
                  <Textarea value={replyText} onChange={(e) => setReplyText(e.target.value)}
                    rows={3} className="bg-muted/50 border-border resize-none" placeholder="پیام خود را بنویسید..." />
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm"
                      className="text-xs text-red-500 border-red-500/30 hover:bg-red-500/10"
                      onClick={() => setCloseConfirmId(detailTicket.id)}>
                      <Lock className="w-3.5 h-3.5 ml-1" />بستن تیکت
                    </Button>
                    <Button size="sm" className="btn-primary" onClick={handleReply}
                      disabled={isReplying || !replyText.trim()}>
                      {isReplying ? <Loader2 className="w-3.5 h-3.5 animate-spin ml-1" /> : <Send className="w-3.5 h-3.5 ml-1" />}
                      پاسخ دادن
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Close Confirm */}
      <AnimatePresence>
        {closeConfirmId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60" onClick={() => setCloseConfirmId(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative glass rounded-2xl p-6 max-w-sm w-full">
              <h3 className="font-semibold mb-2">بستن تیکت</h3>
              <p className="text-muted-foreground text-sm mb-6">آیا از بستن این تیکت اطمینان دارید؟ پس از بستن نمی‌توانید پاسخ دهید.</p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setCloseConfirmId(null)}>انصراف</Button>
                <Button className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => closeConfirmId && handleClose(closeConfirmId)} disabled={isClosing}>
                  {isClosing ? 'در حال بستن...' : 'بستن تیکت'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
