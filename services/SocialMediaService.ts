import { api, getApiErrorMessage } from './api';
import { ApiResponse } from '@/lib/api-utils';
import { SocialMedia } from '@/types/api';

class SocialMediaService {
  private endpoint = '/social-media';

  async getActive(): Promise<SocialMedia[]> {
    try {
      const response = await api.get<ApiResponse<SocialMedia[]>>(`${this.endpoint}/active`);
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch social media:', getApiErrorMessage(error));
      return [];
    }
  }
}

export const socialMediaService = new SocialMediaService();
