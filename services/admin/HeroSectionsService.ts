import { api, getApiErrorMessage } from '../api';
import { ApiResponse } from '@/lib/api-utils';
import { HeroSection } from '@/types/api';

class AdminHeroSectionsService {
  private endpoint = '/admin/hero-sections';

  async getAll(): Promise<HeroSection[]> {
    try {
      const response = await api.get<ApiResponse<HeroSection[]>>(this.endpoint);
      return response.data.data || [];
    } catch (error) {
      console.warn('Failed to fetch hero sections:', getApiErrorMessage(error));
      return [];
    }
  }

  async getById(id: string): Promise<HeroSection | null> {
    try {
      const response = await api.get<ApiResponse<HeroSection>>(`${this.endpoint}/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async create(data: Partial<HeroSection>): Promise<HeroSection | null> {
    try {
      const response = await api.post<ApiResponse<HeroSection>>(this.endpoint, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async update(id: string, data: Partial<HeroSection>): Promise<HeroSection | null> {
    try {
      const response = await api.put<ApiResponse<HeroSection>>(`${this.endpoint}/${id}`, data);
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

export const adminHeroSectionsService = new AdminHeroSectionsService();
