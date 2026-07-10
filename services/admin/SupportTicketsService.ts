import { api, getApiErrorMessage } from '../api';
import { ApiResponse } from '@/lib/api-utils';
import { SupportTicket } from '@/types/api';

export interface UpdateTicketStatusDto {
  status: number;
  priority: number;
  assignedToUserId?: string | null;
}

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

  async updateStatus(id: string, data: UpdateTicketStatusDto): Promise<SupportTicket | null> {
    try {
      const response = await api.patch<ApiResponse<SupportTicket>>(`${this.endpoint}/${id}/status`, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async close(id: string): Promise<void> {
    try {
      await api.patch(`${this.endpoint}/${id}/close`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async assign(id: string, assignedToUserId: string): Promise<void> {
    try {
      await api.patch(`${this.endpoint}/${id}/assign`, { assignedToUserId });
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async reply(id: string, message: string): Promise<void> {
    try {
      await api.post(`${this.endpoint}/${id}/messages`, { message });
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

export const adminSupportTicketsService = new AdminSupportTicketsService();
