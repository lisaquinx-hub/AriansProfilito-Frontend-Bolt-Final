import { api, getApiErrorMessage } from '../api';
import { ApiResponse } from '@/lib/api-utils';
import { AdminDashboardStats } from '@/types/api';

class AdminDashboardService {
  private endpoint = '/admin/dashboard';

  async getStats(): Promise<AdminDashboardStats | null> {
    try {
      const response = await api.get<ApiResponse<AdminDashboardStats>>(`${this.endpoint}/stats`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', getApiErrorMessage(error));
      return null;
    }
  }
}

export const adminDashboardService = new AdminDashboardService();
