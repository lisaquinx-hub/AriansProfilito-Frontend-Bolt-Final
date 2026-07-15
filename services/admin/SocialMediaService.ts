import { api, getApiErrorMessage } from '../api';
import { ApiResponse } from '@/lib/api-utils';
import { SocialMedia } from '@/types/api';

class AdminSocialMediaService {
  private endpoint = '/admin/social-media';

  async getAll(): Promise<SocialMedia[]> {
    try {
      const response = await api.get<ApiResponse<SocialMedia[]>>(this.endpoint);
      return response.data.data || [];
    } catch (error) {
      console.warn('Failed to fetch social media:', getApiErrorMessage(error));
      return [];
    }
  }

  async getById(id: string): Promise<SocialMedia | null> {
    try {
      const response = await api.get<ApiResponse<SocialMedia>>(`${this.endpoint}/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async create(data: Partial<SocialMedia>): Promise<SocialMedia | null> {
    try {
      const response = await api.post<ApiResponse<SocialMedia>>(this.endpoint, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async update(id: string, data: Partial<SocialMedia>): Promise<SocialMedia | null> {
    try {
      const response = await api.put<ApiResponse<SocialMedia>>(`${this.endpoint}/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async updateActiveStatus(id: string, isActive: boolean): Promise<void> {
    try {
      await api.patch(`${this.endpoint}/${id}/active-status`, { isActive });
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

export const adminSocialMediaService = new AdminSocialMediaService();
