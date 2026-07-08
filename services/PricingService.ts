import { api, getApiErrorMessage } from './api';
import { ApiResponse } from '@/lib/api-utils';
import { PricingPlan } from '@/types/api';

class PricingService {
  private endpoint = '/pricing/plans';

  async getAll(): Promise<PricingPlan[]> {
    try {
      const response = await api.get<ApiResponse<PricingPlan[]>>(this.endpoint);
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch pricing plans:', getApiErrorMessage(error));
      return [];
    }
  }

  async getById(id: string): Promise<PricingPlan | null> {
    try {
      const response = await api.get<ApiResponse<PricingPlan>>(`${this.endpoint}/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch pricing plan:', getApiErrorMessage(error));
      return null;
    }
  }
}

export const pricingService = new PricingService();
