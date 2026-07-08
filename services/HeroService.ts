import { api, getApiErrorMessage } from './api';
import { ApiResponse, unwrapResponse } from '@/lib/api-utils';
import { HeroSection } from '@/types/api';

class HeroService {
  private endpoint = '/hero-sections';

  async getActive(): Promise<HeroSection | null> {
    try {
      const response = await api.get<ApiResponse<HeroSection>>(`${this.endpoint}/active`);
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to fetch active hero section:', getApiErrorMessage(error));
      return null;
    }
  }
}

export const heroService = new HeroService();
