import { api, getApiErrorMessage } from './api';
import { ApiResponse, normalizeArray, normalizeObject } from '@/lib/api-utils';
import { Service } from '@/types/api';

class ServicesService {
  private endpoint = '/services';

  async getAll(): Promise<Service[]> {
    try {
      const response = await api.get<ApiResponse<Service[]>>(this.endpoint);
      return normalizeArray<Service>(response.data);
    } catch (error) {
      console.error('Failed to fetch services:', getApiErrorMessage(error));
      return [];
    }
  }

  async getFeatured(): Promise<Service[]> {
    try {
      const response = await api.get<ApiResponse<Service[]>>(`${this.endpoint}/featured`);
      return normalizeArray<Service>(response.data);
    } catch (error) {
      console.error('Failed to fetch featured services:', getApiErrorMessage(error));
      return [];
    }
  }

  async getById(id: string): Promise<Service | null> {
    try {
      const response = await api.get<ApiResponse<Service>>(`${this.endpoint}/${id}`);
      return normalizeObject<Service>(response.data);
    } catch (error) {
      console.error('Failed to fetch service:', getApiErrorMessage(error));
      return null;
    }
  }

  // Products pages are backed by this service (no /api/products endpoint exists)
  async getBySlug(slug: string): Promise<Service | null> {
    try {
      const response = await api.get<ApiResponse<Service>>(`${this.endpoint}/${slug}`);
      return normalizeObject<Service>(response.data);
    } catch (error) {
      console.error('Failed to fetch service by slug:', getApiErrorMessage(error));
      return null;
    }
  }
}

export const servicesService = new ServicesService();
