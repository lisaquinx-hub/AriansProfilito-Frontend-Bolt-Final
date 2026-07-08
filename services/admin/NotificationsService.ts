import { api, getApiErrorMessage } from '../api';
import { ApiResponse } from '@/lib/api-utils';
import { Notification } from '@/types/api';

class AdminNotificationsService {
  private endpoint = '/admin/notifications';

  async getAll(): Promise<Notification[]> {
    try {
      const response = await api.get<ApiResponse<Notification[]>>(this.endpoint);
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch notifications:', getApiErrorMessage(error));
      return [];
    }
  }

  async getById(id: string): Promise<Notification | null> {
    try {
      const response = await api.get<ApiResponse<Notification>>(`${this.endpoint}/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async create(data: Partial<Notification>): Promise<Notification | null> {
    try {
      const response = await api.post<ApiResponse<Notification>>(this.endpoint, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async update(id: string, data: Partial<Notification>): Promise<Notification | null> {
    try {
      const response = await api.put<ApiResponse<Notification>>(`${this.endpoint}/${id}`, data);
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

export const adminNotificationsService = new AdminNotificationsService();
