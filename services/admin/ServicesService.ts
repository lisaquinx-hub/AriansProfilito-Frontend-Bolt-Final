import { api, getApiErrorMessage } from '../api';
import { ApiResponse } from '@/lib/api-utils';
import { Service } from '@/types/api';

class AdminServicesService {
  private endpoint = '/admin/services';

  async getAll(): Promise<Service[]> {
    try {
      const response = await api.get<ApiResponse<Service[]>>(this.endpoint);
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch services:', getApiErrorMessage(error));
      return [];
    }
  }

  async getById(id: string): Promise<Service | null> {
    try {
      const response = await api.get<ApiResponse<Service>>(`${this.endpoint}/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async create(data: Partial<Service>): Promise<Service | null> {
    try {
      const response = await api.post<ApiResponse<Service>>(this.endpoint, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async update(id: string, data: Partial<Service>): Promise<Service | null> {
    try {
      const response = await api.put<ApiResponse<Service>>(`${this.endpoint}/${id}`, data);
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

export const adminServicesService = new AdminServicesService();
