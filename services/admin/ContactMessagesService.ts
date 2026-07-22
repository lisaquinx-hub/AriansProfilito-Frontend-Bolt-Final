import { api, getApiErrorMessage } from '../api';
import { ApiResponse, normalizeArray, normalizeObject } from '@/lib/api-utils';
import { ContactMessage } from '@/types/api';

class AdminContactMessagesService {
  private endpoint = '/admin/contact-messages';

  async getAll(): Promise<ContactMessage[]> {
    const response = await api.get<ApiResponse<ContactMessage[]>>(this.endpoint);
    return normalizeArray<ContactMessage>(response.data);
  }

  async getUnread(): Promise<ContactMessage[]> {
    const response = await api.get<ApiResponse<ContactMessage[]>>(`${this.endpoint}/unread`);
    return normalizeArray<ContactMessage>(response.data);
  }

  async getById(id: string): Promise<ContactMessage | null> {
    try {
      const response = await api.get<ApiResponse<ContactMessage>>(`${this.endpoint}/${id}`);
      return normalizeObject<ContactMessage>(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async markAsRead(id: string): Promise<ContactMessage> {
    try {
      const response = await api.patch<ApiResponse<ContactMessage>>(`${this.endpoint}/${id}/read`);
      const message = normalizeObject<ContactMessage>(response.data);
      if (!message) {
        throw new Error('پاسخ پیام تماس معتبر نیست');
      }
      return message;
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
