import { api, getApiErrorMessage } from './api';
import { ApiResponse } from '@/lib/api-utils';
import { HeroSection } from '@/types/api';

class HeroService {
  private endpoint = '/hero-sections';

  async getActive(): Promise<HeroSection | null> {
    try {
      const response = await api.get<ApiResponse<HeroSection>>(`${this.endpoint}/active`);
      return response.data.data || null;
    } catch (error) {
      console.warn('Failed to fetch active hero section:', getApiErrorMessage(error));
      return null;
    }
  }

  async getById(id: string): Promise<HeroSection | null> {
    try {
      const response = await api.get<ApiResponse<HeroSection>>(`${this.endpoint}/${id}`);
      return response.data.data || null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

export const heroService = new HeroService();
