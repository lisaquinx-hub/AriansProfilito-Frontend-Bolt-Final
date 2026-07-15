import { api, getApiErrorMessage } from '../api';
import { ApiResponse, normalizeArray, normalizeObject, PaginationParams } from '@/lib/api-utils';
import { AuditLog } from '@/types/api';

interface AuditLogsFilter extends PaginationParams {
  action?: string;
  entityName?: string;
  entityId?: string;
  from?: string;
  to?: string;
}

class AdminAuditLogsService {
  private endpoint = '/admin/audit-logs';

  async getAll(params?: AuditLogsFilter): Promise<AuditLog[]> {
    try {
      const response = await api.get<ApiResponse<AuditLog[]>>(this.endpoint, { params });
      return normalizeArray<AuditLog>(response.data);
    } catch (error) {
      console.error('Failed to fetch audit logs:', getApiErrorMessage(error));
      return [];
    }
  }

  async getById(id: string): Promise<AuditLog | null> {
    try {
      const response = await api.get<ApiResponse<AuditLog>>(`${this.endpoint}/${id}`);
      return normalizeObject<AuditLog>(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

export const adminAuditLogsService = new AdminAuditLogsService();
