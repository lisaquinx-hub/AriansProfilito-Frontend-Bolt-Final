import { api, getApiErrorMessage } from '../api';
import { ApiResponse, PaginationParams } from '@/lib/api-utils';
import { ActivityLog } from '@/types/api';

interface ActivityLogsFilter extends PaginationParams {
  activity?: string;
  from?: string;
  to?: string;
}

class AdminActivityLogsService {
  private readonly endpoint = '/admin/activity-logs';

  async getAll(params?: ActivityLogsFilter): Promise<ActivityLog[]> {
    try {
      const response = await api.get<ApiResponse<ActivityLog[]>>(this.endpoint, {
        params,
      });

      const data = response.data?.data;

      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Failed to fetch activity logs:', getApiErrorMessage(error));
      return [];
    }
  }

  async getById(id: string): Promise<ActivityLog | null> {
    try {
      const response = await api.get<ApiResponse<ActivityLog>>(
        `${this.endpoint}/${id}`
      );

      return response.data?.data ?? null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

export const adminActivityLogsService = new AdminActivityLogsService();
export default adminActivityLogsService;