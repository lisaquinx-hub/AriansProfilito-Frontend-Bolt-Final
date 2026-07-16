'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, AlertCircle, X, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { invoiceService, InvoiceListItem, InvoiceDetail } from '@/services/InvoiceService';
import { getApiErrorMessage } from '@/services/api';

const STATUS_LABELS: Record<number, string> = { 1: 'در انتظار', 2: 'پرداخت‌شده', 3: 'ناموفق', 4: 'بازپرداخت' };
const STATUS_COLORS: Record<number, string> = {
  1: 'bg-yellow-500/20 text-yellow-500',
  2: 'bg-green-500/20 text-green-500',
  3: 'bg-red-500/20 text-red-500',
  4: 'bg-sky-500/20 text-sky-500',
};

function formatAmount(n?: number) {
  if (n == null) return '-';
  return n.toLocaleString('fa-IR') + ' تومان';
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [detailItem, setDetailItem] = useState<InvoiceDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const fetchInvoices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await invoiceService.getMyInvoices();
      setInvoices(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchInvoices(); }, []);

  const openDetail = async (invoice: InvoiceListItem) => {
    setDetailItem(invoice as InvoiceDetail);
    setDetailError(null);
    setIsDetailLoading(true);
    try {
      const detail = await invoiceService.getMyInvoiceById(invoice.id);
      if (detail) setDetailItem(detail);
    } catch (err) {
      setDetailError(getApiErrorMessage(err));
    } finally {
      setIsDetailLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="w-7 h-7" />فاکتورها
          </h1>
          <p className="text-muted-foreground mt-1">لیست فاکتورهای شما</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchInvoices}>
          <RefreshCw className={`w-4 h-4 ml-1 ${isLoading ? 'animate-spin' : ''}`} />
          به‌روزرسانی
        </Button>
      </div>

      {error && (
        <div className="glass rounded-xl p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <p className="text-muted-foreground">{error}</p>
          <Button variant="outline" className="mt-4 rounded-full" onClick={fetchInvoices}>تلاش دوباره</Button>
        </div>
      )}

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass rounded-xl p-6 animate-pulse">
              <div className="flex justify-between mb-3">
                <div className="h-4 bg-muted rounded w-32" />
                <div className="h-5 bg-muted rounded w-20" />
              </div>
              <div className="h-3 bg-muted rounded w-48 mb-2" />
              <div className="h-3 bg-muted rounded w-24" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && !error && invoices.length === 0 && (
        <div className="glass rounded-2xl p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
          <h3 className="text-lg font-semibold mb-2">فاکتوری وجود ندارد</h3>
          <p className="text-muted-foreground text-sm">هنوز فاکتوری برای شما ثبت نشده است.</p>
        </div>
      )}

      {!isLoading && !error && invoices.length > 0 && (
        <div className="space-y-4">
          {invoices.map((inv, i) => (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-6 hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">#{inv.invoiceNumber}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[inv.status] || 'bg-muted text-muted-foreground'}`}>
                      {STATUS_LABELS[inv.status] || '-'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{inv.projectTitle}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                    <span>مبلغ: <span className="text-foreground font-medium">{formatAmount(inv.finalAmount || inv.amount)}</span></span>
                    <span>سررسید: {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('fa-IR') : '-'}</span>
                    <span>تاریخ: {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString('fa-IR') : '-'}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="flex-shrink-0 text-xs" onClick={() => openDetail(inv)}>
                  مشاهده
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Invoice Detail Modal */}
      <AnimatePresence>
        {(detailItem || isDetailLoading) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setDetailItem(null); setIsDetailLoading(false); }} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative glass rounded-2xl p-6 max-w-lg w-full">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold">جزئیات فاکتور</h2>
                <button onClick={() => { setDetailItem(null); setIsDetailLoading(false); }} className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {isDetailLoading && !detailItem && (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-sky-500" /></div>
              )}
              {detailError && <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">{detailError}</div>}
              {detailItem && (
                <div className="space-y-3 text-sm">
                  {[
                    ['شماره فاکتور', `#${detailItem.invoiceNumber}`],
                    ['پروژه', detailItem.projectTitle || '-'],
                    ['وضعیت', <span key="s" className={`px-2 py-0.5 rounded-full text-xs ${STATUS_COLORS[detailItem.status]}`}>{STATUS_LABELS[detailItem.status]}</span>],
                    ['مبلغ اصلی', formatAmount(detailItem.amount)],
                    ['تخفیف', formatAmount(detailItem.discountAmount)],
                    ['مالیات', formatAmount(detailItem.taxAmount)],
                    ['مبلغ نهایی', formatAmount(detailItem.finalAmount)],
                    ['پرداخت‌شده', detailItem.isPaid ? 'بله' : 'خیر'],
                    ['تاریخ پرداخت', detailItem.paidAt ? new Date(detailItem.paidAt).toLocaleDateString('fa-IR') : '-'],
                    ['سررسید', detailItem.dueDate ? new Date(detailItem.dueDate).toLocaleDateString('fa-IR') : '-'],
                    ['تاریخ ایجاد', detailItem.createdAt ? new Date(detailItem.createdAt).toLocaleDateString('fa-IR') : '-'],
                  ].map(([label, value], idx) => (
                    <div key={idx} className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium text-right">{value}</span>
                    </div>
                  ))}
                  {detailItem.description && (
                    <div className="pt-2">
                      <p className="text-muted-foreground mb-1">توضیحات:</p>
                      <p className="text-sm">{detailItem.description}</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
