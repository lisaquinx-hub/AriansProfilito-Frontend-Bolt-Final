import { api, getApiErrorMessage } from './api';
import { ApiResponse } from '@/lib/api-utils';
import { Service } from '@/types/api';

class ServicesService {
  private endpoint = '/services';

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
      console.error('Failed to fetch service:', getApiErrorMessage(error));
      return null;
    }
  }
}

export const servicesService = new ServicesService();
