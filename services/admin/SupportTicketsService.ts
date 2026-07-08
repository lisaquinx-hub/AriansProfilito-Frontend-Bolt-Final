import { api, getApiErrorMessage } from '../api';
import { ApiResponse } from '@/lib/api-utils';
import { SupportTicket } from '@/types/api';

class AdminSupportTicketsService {
  private endpoint = '/admin/support-tickets';

  async getAll(): Promise<SupportTicket[]> {
    try {
      const response = await api.get<ApiResponse<SupportTicket[]>>(this.endpoint);
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch support tickets:', getApiErrorMessage(error));
      return [];
    }
  }

  async getById(id: string): Promise<SupportTicket | null> {
    try {
      const response = await api.get<ApiResponse<SupportTicket>>(`${this.endpoint}/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async update(id: string, data: Partial<SupportTicket>): Promise<SupportTicket | null> {
    try {
      const response = await api.put<ApiResponse<SupportTicket>>(`${this.endpoint}/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

export const adminSupportTicketsService = new AdminSupportTicketsService();
