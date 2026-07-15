import { api, getApiErrorMessage } from '../api';
import { ApiResponse } from '@/lib/api-utils';
import { Technology } from '@/types/api';

export interface CreateTechnologyDto {
  name: string;
  icon?: string | null;
  color?: string | null;
}

export type UpdateTechnologyDto = CreateTechnologyDto;

class AdminTechnologiesService {
  private endpoint = '/admin/technologies';

  async getAll(): Promise<Technology[]> {
    try {
      const response = await api.get<ApiResponse<Technology[]>>(this.endpoint);
      return response.data.data || [];
    } catch (error) {
      console.warn('Failed to fetch technologies:', getApiErrorMessage(error));
      return [];
    }
  }

  async getById(id: string): Promise<Technology | null> {
    try {
      const response = await api.get<ApiResponse<Technology>>(`${this.endpoint}/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async create(data: CreateTechnologyDto): Promise<Technology | null> {
    try {
      const response = await api.post<ApiResponse<Technology>>(this.endpoint, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async update(id: string, data: UpdateTechnologyDto): Promise<Technology | null> {
    try {
      const response = await api.put<ApiResponse<Technology>>(`${this.endpoint}/${id}`, data);
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

export const adminTechnologiesService = new AdminTechnologiesService();
