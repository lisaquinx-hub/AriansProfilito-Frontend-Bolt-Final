'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Send, MessageCircle, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const tickets = [
  { id: '1', subject: 'مشکل در ورود به سیستم', status: 'open', date: '۱۴۰۵/۰۲/۱۰', latestMessage: 'سلام، مشکل برطرف شد؟' },
  { id: '2', subject: 'سؤال درباره قیمت‌گذاری', status: 'resolved', date: '۱۴۰۵/۰۱/۲۵', latestMessage: 'مشخص شد، ممنون.' },
];

const statusConfig: { [key: string]: { label: string; color: string; icon: React.ElementType } } = {
  open: { label: 'باز', color: 'text-yellow-500 bg-yellow-500/20', icon: Clock },
  pending: { label: 'در انتظار', color: 'text-sky-500 dark:text-blue-400 bg-sky-500/20 dark:bg-blue-500/20', icon: AlertCircle },
  resolved: { label: 'حل شده', color: 'text-green-500 bg-green-500/20', icon: CheckCircle },
};

export default function SupportPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">پشتیبانی</h1>
          <p className="text-muted-foreground mt-1">تیکت‌های پشتیبانی و پیام‌های شما</p>
        </div>
        <Button
          onClick={() => setIsCreating(!isCreating)}
          className="btn-primary shadow-glow"
        >
          <Plus className="w-4 h-4 ml-2" />
          تیکت جدید
        </Button>
      </div>

      {/* Create Ticket Form */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-6">ارسال تیکت جدید</h2>
            <div className="grid gap-5">
              <div>
                <label className="block text-sm text-foreground/70 mb-2">موضوع</label>
                <Input placeholder="موضوع تیکت" className="bg-muted/50 border-border" />
              </div>
              <div>
                <label className="block text-sm text-foreground/70 mb-2">پیام</label>
                <Textarea
                  rows={5}
                  placeholder="پیام خود را بنویسید..."
                  className="bg-muted/50 border-border resize-none"
                />
              </div>
              <div className="flex gap-4">
                <Button className="btn-primary rounded-full">ارسال تیکت</Button>
                <Button variant="outline" onClick={() => setIsCreating(false)} className="rounded-full">
                  انصراف
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tickets List */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Tickets Sidebar */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold mb-4">تیکت‌ها</h2>
          {tickets.map((ticket) => {
            const StatusIcon = statusConfig[ticket.status]?.icon || Clock;
            return (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setSelectedTicket(ticket.id)}
                className={cn(
                  'p-4 rounded-xl cursor-pointer transition-all',
                  selectedTicket === ticket.id ? 'glass' : 'bg-muted/50 hover:bg-muted'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium">{ticket.subject}</h3>
                  <span className={cn(
                    'text-xs px-2 py-1 rounded-full',
                    statusConfig[ticket.status]?.color
                  )}>
                    {statusConfig[ticket.status]?.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{ticket.latestMessage}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                  <StatusIcon className="w-3 h-3" />
                  <span>{ticket.date}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Messages */}
        <div className="md:col-span-2 glass rounded-xl p-6">
          {selectedTicket ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">مشکل در ورود به سیستم</h2>
              <div className="space-y-4 mb-6">
                {/* Messages */}
                {[
                  { sender: 'user', text: 'سلام، نمی‌توانم وارد سیستم شوم.', time: '۱۴۰۵/۰۲/۱۰ - ۱۰:۳۰' },
                  { sender: 'support', text: 'سلام، لطفاً ایمیل و رمز عبور‌تان را بررسی کنید.', time: '۱۴۰۵/۰۲/۱۰ - ۱۱:۴۵' },
                  { sender: 'user', text: 'مشخص شد، ممنون.', time: '۱۴۰۵/۰۲/۱۰ - ۱۲:۰۰' },
                ].map((msg, i) => (
                  <div key={i} className={cn(
                    'p-4 rounded-lg',
                    msg.sender === 'user' ? 'bg-sky-500/10 dark:bg-blue-500/10' : 'bg-sky-500/5 dark:bg-cyan-500/10'
                  )}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-xs',
                        msg.sender === 'user' ? 'bg-sky-500 dark:bg-blue-500' : 'bg-sky-500 dark:bg-cyan-500'
                      )}>
                        <MessageCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm text-muted-foreground">{msg.time}</span>
                    </div>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Reply Input */}
              <div className="flex gap-4">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="پیام جدید..."
                  className="bg-muted/50 border-border resize-none flex-1"
                  rows={2}
                />
                <Button className="btn-primary rounded-xl self-end">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">یک تیکت را برای مشاهده پیام‌ها انتخاب کنید</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
