import { api, getApiErrorMessage, getApiStatus } from './api';
import { ApiResponse, normalizeArray, normalizeObject } from '@/lib/api-utils';
import { Service } from '@/types/api';

class ServicesService {
  private endpoint = '/services';

  async getAll(): Promise<Service[]> {
    try {
      const response = await api.get<ApiResponse<Service[]>>(this.endpoint);
      return normalizeArray<Service>(response.data);
    } catch (error) {
      console.warn('Failed to fetch services:', getApiErrorMessage(error));
      return [];
    }
  }

  async getFeatured(): Promise<Service[]> {
    try {
      const response = await api.get<ApiResponse<Service[]>>(`${this.endpoint}/featured`);
      return normalizeArray<Service>(response.data);
    } catch (error) {
      console.warn('Failed to fetch featured services:', getApiErrorMessage(error));
      return [];
    }
  }

  // Products pages are backed by this service (no /api/products endpoint exists)
  async getBySlug(slug: string): Promise<Service | null> {
    try {
      const response = await api.get<ApiResponse<Service>>(
        `${this.endpoint}/${encodeURIComponent(slug)}`
      );
      return normalizeObject<Service>(response.data);
    } catch (error) {
      if (getApiStatus(error) !== 404) {
        console.warn('Failed to fetch service by slug:', getApiErrorMessage(error));
      }
      return null;
    }
  }
}

export const servicesService = new ServicesService();
