import { api, getApiErrorMessage } from './api';
import { ApiResponse } from '@/lib/api-utils';

export interface InvoiceListItem {
  id: string;
  projectId: string;
  projectTitle: string;
  invoiceNumber: string;
  amount: number;
  discountAmount: number;
  taxAmount: number;
  finalAmount: number;
  status: number;
  isPaid: boolean;
  isFinalized: boolean;
  hasPendingPayment: boolean;
  paidAmount: number;
  remainingAmount: number;
  paidAt?: string;
  dueDate: string;
  createdAt: string;
}

export interface InvoiceDetail extends InvoiceListItem {
  userId?: string;
  customerFullName?: string;
  customerEmail?: string;
  projectCode?: string;
  description?: string;
  updatedAt?: string;
  payments?: unknown[];
}

class InvoiceService {
  private endpoint = '/invoices';

  async getMyInvoices(): Promise<InvoiceListItem[]> {
    try {
      const response = await api.get<ApiResponse<InvoiceListItem[]>>(`${this.endpoint}/my`);
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async getMyInvoiceById(id: string): Promise<InvoiceDetail | null> {
    try {
      const response = await api.get<ApiResponse<InvoiceDetail>>(`${this.endpoint}/my/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

export const invoiceService = new InvoiceService();
