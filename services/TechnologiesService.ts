import { api, getApiErrorMessage } from './api';
import { ApiResponse } from '@/lib/api-utils';
import { Technology } from '@/types/api';

class TechnologiesService {
  private endpoint = '/technologies';

  async getAll(): Promise<Technology[]> {
    try {
      const response = await api.get<ApiResponse<Technology[]>>(this.endpoint);
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch technologies:', getApiErrorMessage(error));
      return [];
    }
  }
}

export const technologiesService = new TechnologiesService();
