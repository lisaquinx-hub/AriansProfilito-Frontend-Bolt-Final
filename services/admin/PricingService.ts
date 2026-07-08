import { api, getApiErrorMessage } from '../api';
import { ApiResponse } from '@/lib/api-utils';
import { PricingPlan } from '@/types/api';

class AdminPricingService {
  private endpoint = '/admin/pricing-plans';

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
      throw new Error(getApiErrorMessage(error));
    }
  }

  async create(data: Partial<PricingPlan>): Promise<PricingPlan | null> {
    try {
      const response = await api.post<ApiResponse<PricingPlan>>(this.endpoint, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async update(id: string, data: Partial<PricingPlan>): Promise<PricingPlan | null> {
    try {
      const response = await api.put<ApiResponse<PricingPlan>>(`${this.endpoint}/${id}`, data);
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

export const adminPricingService = new AdminPricingService();
