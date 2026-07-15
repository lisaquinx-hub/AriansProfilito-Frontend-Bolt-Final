import { api, getApiErrorMessage } from '../api';
import { ApiResponse } from '@/lib/api-utils';
import { ContactMessage } from '@/types/api';

class AdminContactMessagesService {
  private endpoint = '/admin/contact-messages';

  async getAll(): Promise<ContactMessage[]> {
    try {
      const response = await api.get<ApiResponse<ContactMessage[]>>(this.endpoint);
      return response.data.data || [];
    } catch (error) {
      console.warn('Failed to fetch contact messages:', getApiErrorMessage(error));
      return [];
    }
  }

  async getUnread(): Promise<ContactMessage[]> {
    try {
      const response = await api.get<ApiResponse<ContactMessage[]>>(`${this.endpoint}/unread`);
      return response.data.data || [];
    } catch (error) {
      return [];
    }
  }

  async getById(id: string): Promise<ContactMessage | null> {
    try {
      const response = await api.get<ApiResponse<ContactMessage>>(`${this.endpoint}/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async markAsRead(id: string): Promise<void> {
    try {
      await api.patch(`${this.endpoint}/${id}/read`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async reply(id: string, replyMessage: string): Promise<void> {
    try {
      await api.post(`${this.endpoint}/${id}/reply`, { replyMessage });
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

export const adminContactMessagesService = new AdminContactMessagesService();
