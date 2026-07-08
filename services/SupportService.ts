import { api, getApiErrorMessage } from './api';
import { ApiResponse } from '@/lib/api-utils';

export interface SupportTicket {
  id: string;
  subject: string;
  description?: string;
  status: string;
  priority?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  sender: string;
  content: string;
  attachments?: string[];
  createdAt: string;
}

export interface CreateTicketRequest {
  subject: string;
  message: string;
  priority?: string;
}

class SupportService {
  private endpoint = '/support';

  async createTicket(data: CreateTicketRequest): Promise<SupportTicket> {
    try {
      const response = await api.post<ApiResponse<SupportTicket>>(this.endpoint, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async getTickets(): Promise<SupportTicket[]> {
    try {
      const response = await api.get<ApiResponse<SupportTicket[]>>(this.endpoint);
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch tickets:', getApiErrorMessage(error));
      return [];
    }
  }

  async getTicket(id: string): Promise<SupportTicket> {
    try {
      const response = await api.get<ApiResponse<SupportTicket>>(`${this.endpoint}/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async getMessages(ticketId: string): Promise<SupportMessage[]> {
    try {
      const response = await api.get<ApiResponse<SupportMessage[]>>(`${this.endpoint}/${ticketId}/messages`);
      return response.data.data || [];
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async sendMessage(ticketId: string, content: string): Promise<SupportMessage> {
    try {
      const response = await api.post<ApiResponse<SupportMessage>>(`${this.endpoint}/${ticketId}/messages`, { content });
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async closeTicket(id: string): Promise<void> {
    try {
      await api.put(`${this.endpoint}/${id}/close`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

export const supportService = new SupportService();
