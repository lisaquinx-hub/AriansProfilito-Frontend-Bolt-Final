import { api, getApiErrorMessage } from './api';
import { ApiResponse } from '@/lib/api-utils';
import { SupportTicket } from '@/types/api';

export type { SupportTicket };

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority?: number;
}

class SupportService {
  private myEndpoint = '/support-tickets/my';
  private baseEndpoint = '/support-tickets';

  async createTicket(data: CreateTicketRequest): Promise<SupportTicket | null> {
    try {
      const response = await api.post<ApiResponse<SupportTicket>>(this.baseEndpoint, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async getTickets(): Promise<SupportTicket[]> {
    try {
      const response = await api.get<ApiResponse<SupportTicket[]>>(this.myEndpoint);
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch tickets:', getApiErrorMessage(error));
      return [];
    }
  }

  async getTicket(id: string): Promise<SupportTicket | null> {
    try {
      const response = await api.get<ApiResponse<SupportTicket>>(`${this.myEndpoint}/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async sendMessage(ticketId: string, message: string): Promise<void> {
    try {
      await api.post(`${this.myEndpoint}/${ticketId}/messages`, { message });
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async closeTicket(id: string): Promise<void> {
    try {
      await api.patch(`${this.myEndpoint}/${id}/close`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

export const supportService = new SupportService();
