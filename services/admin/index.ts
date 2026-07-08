import { api, getApiErrorMessage } from '../api';
import { ApiResponse, PaginationParams } from '@/lib/api-utils';
import { User } from '@/types/api';

class AdminUsersService {
  private endpoint = '/admin/users';

  async getAll(params?: PaginationParams): Promise<User[]> {
    try {
      const response = await api.get<ApiResponse<User[]>>(this.endpoint, { params });
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch users:', getApiErrorMessage(error));
      return [];
    }
  }

  async getById(id: string): Promise<User | null> {
    try {
      const response = await api.get<ApiResponse<User>>(`${this.endpoint}/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    try {
      const response = await api.put<ApiResponse<User>>(`${this.endpoint}/${id}`, data);
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

export const adminUsersService = new AdminUsersService();
