import { api, getApiErrorMessage } from '../api';
import { ApiResponse } from '@/lib/api-utils';
import { Service } from '@/types/api';

export interface CreateServiceDto {
  title: string;
  slug?: string;
  thumbnail: string;
  coverImage: string;
  shortDescription?: string;
  description: string;
  estimatedDeliveryDays: number;
  isFeatured: boolean;
  displayOrder: number;
  icon?: string;
  isActive: boolean;
  features: Array<{ title: string; displayOrder: number }>;
}

export type UpdateServiceDto = CreateServiceDto;

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

  async create(data: CreateServiceDto): Promise<Service | null> {
    try {
      const response = await api.post<ApiResponse<Service>>(this.endpoint, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async update(id: string, data: UpdateServiceDto): Promise<Service | null> {
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
