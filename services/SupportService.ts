import { api } from './api';

export interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  sender: 'user' | 'support';
  content: string;
  attachments?: string[];
  created_at: string;
}

export interface CreateTicketRequest {
  subject: string;
  message: string;
  priority?: 'low' | 'medium' | 'high';
  attachments?: File[];
}

class SupportService {
  private endpoint = '/support';

  async createTicket(data: CreateTicketRequest): Promise<SupportTicket> {
    const formData = new FormData();
    formData.append('subject', data.subject);
    formData.append('message', data.message);
    if (data.priority) formData.append('priority', data.priority);
    if (data.attachments) {
      data.attachments.forEach((file) => formData.append('attachments', file));
    }
    const response = await api.post<SupportTicket>(this.endpoint, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  async getTickets(page: number = 1, limit: number = 10): Promise<{ tickets: SupportTicket[]; total: number }> {
    const response = await api.get<{ tickets: SupportTicket[]; total: number }>(this.endpoint, {
      params: { page, limit },
    });
    return response.data;
  }

  async getTicket(id: string): Promise<SupportTicket> {
    const response = await api.get<SupportTicket>(`${this.endpoint}/${id}`);
    return response.data;
  }

  async getMessages(ticketId: string): Promise<SupportMessage[]> {
    const response = await api.get<SupportMessage[]>(`${this.endpoint}/${ticketId}/messages`);
    return response.data;
  }

  async sendMessage(ticketId: string, content: string, attachments?: File[]): Promise<SupportMessage> {
    const formData = new FormData();
    formData.append('content', content);
    if (attachments) {
      attachments.forEach((file) => formData.append('attachments', file));
    }
    const response = await api.post<SupportMessage>(`${this.endpoint}/${ticketId}/messages`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  async closeTicket(id: string): Promise<void> {
    await api.put(`${this.endpoint}/${id}/close`);
  }
}

export const supportService = new SupportService();
