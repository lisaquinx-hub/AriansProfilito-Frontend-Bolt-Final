import { api, getApiErrorMessage } from '../api';
import { ApiResponse } from '@/lib/api-utils';
import { Project } from '@/types/api';

class AdminProjectsService {
  private endpoint = '/admin/projects';

  async getAll(): Promise<Project[]> {
    try {
      const response = await api.get<ApiResponse<Project[]>>(this.endpoint);
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch projects:', getApiErrorMessage(error));
      return [];
    }
  }

  async getById(id: string): Promise<Project | null> {
    try {
      const response = await api.get<ApiResponse<Project>>(`${this.endpoint}/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async create(data: Partial<Project>): Promise<Project | null> {
    try {
      const response = await api.post<ApiResponse<Project>>(this.endpoint, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async update(id: string, data: Partial<Project>): Promise<Project | null> {
    try {
      const response = await api.put<ApiResponse<Project>>(`${this.endpoint}/${id}`, data);
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

export const adminProjectsService = new AdminProjectsService();
