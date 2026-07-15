import { api, getApiErrorMessage } from './api';
import { ApiResponse, normalizeArray, normalizeObject } from '@/lib/api-utils';
import { Notification } from '@/types/api';

class NotificationsService {
  private endpoint = '/notifications/my';

  async getAll(): Promise<Notification[]> {
    try {
      const response = await api.get<ApiResponse<Notification[]>>(this.endpoint);
      return normalizeArray<Notification>(response.data);
    } catch (error) {
      console.warn('Failed to fetch notifications:', getApiErrorMessage(error));
      return [];
    }
  }

  async getUnread(): Promise<Notification[]> {
    try {
      const response = await api.get<ApiResponse<Notification[]>>(`${this.endpoint}/unread`);
      return normalizeArray<Notification>(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async getById(id: string): Promise<Notification | null> {
    try {
      const response = await api.get<ApiResponse<Notification>>(`${this.endpoint}/${id}`);
      return normalizeObject<Notification>(response.data);
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

  async markAsRead(id: string): Promise<void> {
    try {
      await api.patch(`${this.endpoint}/${id}/read`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await api.patch(`${this.endpoint}/read-all`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

export const notificationsService = new NotificationsService();
