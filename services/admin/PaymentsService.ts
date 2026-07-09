import { api, getApiErrorMessage } from '../api';
import { ApiResponse } from '@/lib/api-utils';
import { Payment } from '@/types/api';

export interface CreatePaymentDto {
  invoiceId: string;
  amount: number;
  gateway: string;
  authority?: string;
  refId?: string;
  status: number;
  cardPan?: string;
  trackingCode?: string;
  gatewayResponse?: string;
  paidAt?: string | null;
}

export interface UpdatePaymentDto {
  invoiceId: string;
  amount: number;
  gateway: string;
  authority?: string;
  refId?: string;
  status: number;
  cardPan?: string;
  trackingCode?: string;
  gatewayResponse?: string;
  paidAt?: string | null;
}

class AdminPaymentsService {
  private endpoint = '/admin/payments';

  async getAll(): Promise<Payment[]> {
    try {
      const response = await api.get<ApiResponse<Payment[]>>(this.endpoint);
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch payments:', getApiErrorMessage(error));
      return [];
    }
  }

  async getById(id: string): Promise<Payment | null> {
    try {
      const response = await api.get<ApiResponse<Payment>>(`${this.endpoint}/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async create(data: CreatePaymentDto): Promise<Payment | null> {
    try {
      const response = await api.post<ApiResponse<Payment>>(this.endpoint, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async update(id: string, data: UpdatePaymentDto): Promise<Payment | null> {
    try {
      const response = await api.put<ApiResponse<Payment>>(`${this.endpoint}/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

export const adminPaymentsService = new AdminPaymentsService();
