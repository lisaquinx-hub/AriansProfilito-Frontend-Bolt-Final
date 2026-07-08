import { api, getApiErrorMessage } from '../api';
import { ApiResponse } from '@/lib/api-utils';
import { FAQ } from '@/types/api';

class AdminFaqService {
  private endpoint = '/admin/faqs';

  async getAll(): Promise<FAQ[]> {
    try {
      const response = await api.get<ApiResponse<FAQ[]>>(this.endpoint);
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch FAQs:', getApiErrorMessage(error));
      return [];
    }
  }

  async getById(id: string): Promise<FAQ | null> {
    try {
      const response = await api.get<ApiResponse<FAQ>>(`${this.endpoint}/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async create(data: Partial<FAQ>): Promise<FAQ | null> {
    try {
      const response = await api.post<ApiResponse<FAQ>>(this.endpoint, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async update(id: string, data: Partial<FAQ>): Promise<FAQ | null> {
    try {
      const response = await api.put<ApiResponse<FAQ>>(`${this.endpoint}/${id}`, data);
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

export const adminFaqService = new AdminFaqService();
