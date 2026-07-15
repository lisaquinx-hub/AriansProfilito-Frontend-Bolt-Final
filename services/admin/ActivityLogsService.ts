import { api, getApiErrorMessage } from '../api';
import { ApiResponse, normalizeArray, normalizeObject, PaginationParams } from '@/lib/api-utils';
import { ActivityLog } from '@/types/api';

interface ActivityLogsFilter extends PaginationParams {
  userId?: string;
  activity?: string;
  from?: string;
  to?: string;
}

class AdminActivityLogsService {
  private endpoint = '/admin/activity-logs';

  async getAll(params?: ActivityLogsFilter): Promise<ActivityLog[]> {
    try {
      const response = await api.get<ApiResponse<ActivityLog[]>>(this.endpoint, { params });
      return normalizeArray<ActivityLog>(response.data);
    } catch (error) {
      console.error('Failed to fetch activity logs:', getApiErrorMessage(error));
      return [];
    }
  }

  async getById(id: string): Promise<ActivityLog | null> {
    try {
      const response = await api.get<ApiResponse<ActivityLog>>(`${this.endpoint}/${id}`);
      return normalizeObject<ActivityLog>(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

export const adminActivityLogsService = new AdminActivityLogsService();
