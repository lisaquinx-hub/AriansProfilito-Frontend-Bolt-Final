import { api, getApiErrorMessage } from './api';
import { ApiResponse } from '@/lib/api-utils';

export interface PaymentListItem {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  gateway: string;
  authority: string;
  refId?: string;
  status: number;
  trackingCode?: string;
  paidAt?: string;
  createdAt: string;
}

export interface PaymentDetail extends PaymentListItem {
  userId?: string;
  customerFullName?: string;
  customerEmail?: string;
  projectId?: string;
  projectTitle?: string;
  cardPan?: string;
  gatewayResponse?: string;
  updatedAt?: string;
}

export interface SubmitPaymentDto {
  invoiceId: string;
  trackingCode: string;
  cardLastFour?: string;
}

class PaymentService {
  private endpoint = '/payments';

  async getMyPayments(): Promise<PaymentListItem[]> {
    try {
      const response = await api.get<ApiResponse<PaymentListItem[]>>(`${this.endpoint}/my`);
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async getMyPaymentById(id: string): Promise<PaymentDetail | null> {
    try {
      const response = await api.get<ApiResponse<PaymentDetail>>(`${this.endpoint}/my/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async submitPayment(data: SubmitPaymentDto): Promise<PaymentDetail | null> {
    try {
      const response = await api.post<ApiResponse<PaymentDetail>>(
        `${this.endpoint}/my`,
        data
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

export const paymentService = new PaymentService();
