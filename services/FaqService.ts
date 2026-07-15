import { api, getApiErrorMessage } from './api';
import { ApiResponse } from '@/lib/api-utils';
import { FAQ } from '@/types/api';

class FaqService {
  private endpoint = '/faqs';

  async getAll(): Promise<FAQ[]> {
    try {
      const response = await api.get<ApiResponse<FAQ[]>>(this.endpoint);
      return response.data.data || [];
    } catch (error) {
      console.warn('Failed to fetch FAQs:', getApiErrorMessage(error));
      return [];
    }
  }
}

export const faqService = new FaqService();
