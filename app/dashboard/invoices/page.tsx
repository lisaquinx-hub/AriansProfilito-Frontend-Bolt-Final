'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CreditCard, FileText, Loader2, RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { invoiceService, InvoiceDetail, InvoiceListItem } from '@/services/InvoiceService';
import { paymentService } from '@/services/PaymentService';
import { getApiErrorMessage } from '@/services/api';

const STATUS_COLORS: Record<number, string> = {
  1: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
  2: 'bg-green-500/20 text-green-600 dark:text-green-400',
  3: 'bg-red-500/20 text-red-600 dark:text-red-400',
  4: 'bg-sky-500/20 text-sky-600 dark:text-sky-400',
};

function formatAmount(value?: number) {
  if (value == null) return '-';
  return `${value.toLocaleString('fa-IR')} تومان`;
}

function normalizeDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, character => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(character)))
    .replace(/[٠-٩]/g, character => String('٠١٢٣٤٥٦٧٨٩'.indexOf(character)));
}

function documentLabel(invoice: InvoiceListItem) {
  return invoice.isFinalized || invoice.status === 2 ? 'فاکتور نهایی' : 'پیش‌فاکتور';
}

function statusLabel(invoice: InvoiceListItem) {
  if (invoice.status === 1 && invoice.hasPendingPayment) {
    return 'در انتظار تأیید ادمین';
  }
  return ({ 1: 'در انتظار پرداخت', 2: 'پرداخت‌شده', 3: 'ناموفق', 4: 'بازپرداخت' } as Record<number, string>)[invoice.status] || '-';
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<InvoiceDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [paymentInvoice, setPaymentInvoice] = useState<InvoiceListItem | null>(null);
  const [trackingCode, setTrackingCode] = useState('');
  const [cardLastFour, setCardLastFour] = useState('');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  const fetchInvoices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setInvoices(await invoiceService.getMyInvoices());
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchInvoices();
  }, []);

  const openDetail = async (invoice: InvoiceListItem) => {
    setDetailItem(invoice as InvoiceDetail);
    setDetailError(null);
    setIsDetailLoading(true);
    try {
      const detail = await invoiceService.getMyInvoiceById(invoice.id);
      if (detail) setDetailItem(detail);
    } catch (requestError) {
      setDetailError(getApiErrorMessage(requestError));
    } finally {
      setIsDetailLoading(false);
    }
  };

  const openPayment = (invoice: InvoiceListItem) => {
    setPaymentInvoice(invoice);
    setTrackingCode('');
    setCardLastFour('');
    setPaymentError(null);
  };

  const submitPayment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!paymentInvoice) return;
    const normalizedTrackingCode = normalizeDigits(trackingCode).trim();
    const normalizedCardLastFour = normalizeDigits(cardLastFour);
    if (normalizedTrackingCode.length < 4) {
      setPaymentError('کد پیگیری پرداخت را کامل وارد کنید');
      return;
    }
    if (normalizedCardLastFour && !/^\d{4}$/.test(normalizedCardLastFour)) {
      setPaymentError('فقط چهار رقم آخر کارت را وارد کنید');
      return;
    }

    setIsSubmittingPayment(true);
    setPaymentError(null);
    try {
      await paymentService.submitPayment({
        invoiceId: paymentInvoice.id,
        trackingCode: normalizedTrackingCode,
        cardLastFour: normalizedCardLastFour || undefined,
      });
      setPaymentInvoice(null);
      toast.success('پرداخت ثبت شد و در انتظار تأیید ادمین است');
      await fetchInvoices();
    } catch (requestError) {
      setPaymentError(getApiErrorMessage(requestError));
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold"><FileText className="h-7 w-7" />فاکتورها</h1>
          <p className="mt-1 text-muted-foreground">پیش‌فاکتورها، پرداخت و فاکتورهای نهایی شما</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void fetchInvoices()} disabled={isLoading}>
          <RefreshCw className={`ml-1 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />به‌روزرسانی
        </Button>
      </div>

      {error && (
        <div className="glass rounded-xl p-6 text-center">
          <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-500" />
          <p className="text-muted-foreground">{error}</p>
          <Button variant="outline" className="mt-4 rounded-full" onClick={() => void fetchInvoices()}>تلاش دوباره</Button>
        </div>
      )}

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map(item => (
            <div key={item} className="glass animate-pulse rounded-xl p-6">
              <div className="mb-3 flex justify-between"><div className="h-4 w-32 rounded bg-muted" /><div className="h-5 w-24 rounded bg-muted" /></div>
              <div className="mb-2 h-3 w-48 rounded bg-muted" /><div className="h-3 w-24 rounded bg-muted" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && !error && invoices.length === 0 && (
        <div className="glass rounded-2xl p-12 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-40" />
          <h3 className="mb-2 text-lg font-semibold">فاکتوری وجود ندارد</h3>
          <p className="text-sm text-muted-foreground">هنوز پیش‌فاکتوری برای شما ثبت نشده است.</p>
        </div>
      )}

      {!isLoading && !error && invoices.length > 0 && (
        <div className="space-y-4">
          {invoices.map((invoice, index) => (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.04, 0.2) }}
              className="glass rounded-xl p-5 transition-colors hover:bg-muted/20 md:p-6"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="font-semibold">#{invoice.invoiceNumber}</span>
                    <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-xs text-sky-600 dark:text-cyan-400">{documentLabel(invoice)}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_COLORS[invoice.status] || 'bg-muted text-muted-foreground'}`}>{statusLabel(invoice)}</span>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">{invoice.projectTitle}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                    <span>مبلغ: <span className="font-medium text-foreground">{formatAmount(invoice.finalAmount || invoice.amount)}</span></span>
                    <span>مانده: <span className="font-medium text-foreground">{formatAmount(invoice.remainingAmount)}</span></span>
                    <span>سررسید: {new Date(invoice.dueDate).toLocaleDateString('fa-IR')}</span>
                  </div>
                </div>
                <div className="flex flex-shrink-0 gap-2">
                  {(invoice.status === 1 || invoice.status === 3) && !invoice.hasPendingPayment && invoice.remainingAmount > 0 && (
                    <Button size="sm" className="btn-primary" onClick={() => openPayment(invoice)}>
                      <CreditCard className="ml-1 h-4 w-4" />ثبت پرداخت
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => void openDetail(invoice)}>مشاهده</Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {paymentInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSubmittingPayment && setPaymentInvoice(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="glass relative w-full max-w-md rounded-2xl p-6">
              <div className="mb-5 flex items-center justify-between">
                <div><h2 className="font-semibold">ثبت رسید پرداخت</h2><p className="mt-1 text-xs text-muted-foreground">پیش‌فاکتور #{paymentInvoice.invoiceNumber}</p></div>
                <button type="button" onClick={() => setPaymentInvoice(null)} disabled={isSubmittingPayment} className="rounded-lg p-2 hover:bg-muted"><X className="h-4 w-4" /></button>
              </div>
              <div className="mb-5 rounded-xl border border-sky-500/20 bg-sky-500/5 p-4 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">مبلغ قابل پرداخت</span><strong>{formatAmount(paymentInvoice.remainingAmount)}</strong></div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">مبلغ از اطلاعات فاکتور محاسبه می‌شود و قابل تغییر نیست. پس از ثبت کد پیگیری، مدیر پرداخت را بررسی می‌کند.</p>
              </div>
              <form onSubmit={submitPayment} className="space-y-4">
                <div className="space-y-2"><Label htmlFor="tracking-code">کد پیگیری پرداخت *</Label><Input id="tracking-code" value={trackingCode} onChange={event => setTrackingCode(event.target.value)} placeholder="کد پیگیری بانکی" autoComplete="off" required /></div>
                <div className="space-y-2"><Label htmlFor="card-last-four">چهار رقم آخر کارت</Label><Input id="card-last-four" inputMode="numeric" maxLength={4} value={cardLastFour} onChange={event => setCardLastFour(event.target.value.replace(/[^0-9۰-۹٠-٩]/g, '').slice(0, 4))} placeholder="مثلاً ۱۲۳۴" autoComplete="off" /></div>
                {paymentError && <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">{paymentError}</div>}
                <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setPaymentInvoice(null)} disabled={isSubmittingPayment}>انصراف</Button><Button type="submit" className="btn-primary" disabled={isSubmittingPayment}>{isSubmittingPayment && <Loader2 className="ml-1 h-4 w-4 animate-spin" />}ثبت برای تأیید</Button></div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(detailItem || isDetailLoading) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setDetailItem(null); setIsDetailLoading(false); }} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass relative w-full max-w-lg rounded-2xl p-6">
              <div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-semibold">جزئیات فاکتور</h2><button onClick={() => { setDetailItem(null); setIsDetailLoading(false); }} className="rounded-lg p-2 hover:bg-muted"><X className="h-4 w-4" /></button></div>
              {isDetailLoading && !detailItem && <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-sky-500" /></div>}
              {detailError && <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">{detailError}</div>}
              {detailItem && (
                <div className="space-y-1 text-sm">
                  {[
                    ['نوع سند', documentLabel(detailItem)],
                    ['شماره', `#${detailItem.invoiceNumber}`],
                    ['پروژه', detailItem.projectTitle || '-'],
                    ['وضعیت', statusLabel(detailItem)],
                    ['مبلغ اصلی', formatAmount(detailItem.amount)],
                    ['تخفیف', formatAmount(detailItem.discountAmount)],
                    ['مالیات', formatAmount(detailItem.taxAmount)],
                    ['مبلغ نهایی', formatAmount(detailItem.finalAmount)],
                    ['پرداخت تأییدشده', formatAmount(detailItem.paidAmount)],
                    ['مانده', formatAmount(detailItem.remainingAmount)],
                    ['سررسید', new Date(detailItem.dueDate).toLocaleDateString('fa-IR')],
                  ].map(([label, value]) => <div key={String(label)} className="flex justify-between gap-4 border-b border-border/50 py-2"><span className="text-muted-foreground">{label}</span><span className="text-left font-medium">{value}</span></div>)}
                  {detailItem.description && <div className="pt-3"><p className="mb-1 text-muted-foreground">توضیحات:</p><p>{detailItem.description}</p></div>}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
