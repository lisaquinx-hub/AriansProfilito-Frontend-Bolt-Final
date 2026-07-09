import { api, getApiErrorMessage } from '../api';
import { ApiResponse } from '@/lib/api-utils';
import { Invoice } from '@/types/api';

export interface CreateInvoiceDto {
  userId: string;
  projectId: string;
  amount: number;
  discountAmount: number;
  taxAmount: number;
  status: number;
  description?: string;
  dueDate: string;
}

export interface UpdateInvoiceDto {
  userId: string;
  projectId: string;
  amount: number;
  discountAmount: number;
  taxAmount: number;
  status: number;
  description?: string;
  dueDate: string;
  paidAt?: string | null;
}

class AdminInvoicesService {
  private endpoint = '/admin/invoices';

  async getAll(): Promise<Invoice[]> {
    try {
      const response = await api.get<ApiResponse<Invoice[]>>(this.endpoint);
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch invoices:', getApiErrorMessage(error));
      return [];
    }
  }

  async getById(id: string): Promise<Invoice | null> {
    try {
      const response = await api.get<ApiResponse<Invoice>>(`${this.endpoint}/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async create(data: CreateInvoiceDto): Promise<Invoice | null> {
    try {
      const response = await api.post<ApiResponse<Invoice>>(this.endpoint, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async update(id: string, data: UpdateInvoiceDto): Promise<Invoice | null> {
    try {
      const response = await api.put<ApiResponse<Invoice>>(`${this.endpoint}/${id}`, data);
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

export const adminInvoicesService = new AdminInvoicesService();
