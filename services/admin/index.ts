import { api, getApiErrorMessage } from '../api';
import { ApiResponse, PaginationParams } from '@/lib/api-utils';
import { User } from '@/types/api';

export interface CreateUserDto {
  fullName: string;
  email: string;
  userName?: string;
  password: string;
  phoneNumber?: string;
  role: number;
  isActive: boolean;
  emailConfirmed: boolean;
  avatar?: string;
}

export interface UpdateUserDto {
  fullName: string;
  email: string;
  userName?: string;
  phoneNumber?: string;
  role: number;
  isActive: boolean;
  emailConfirmed: boolean;
  avatar?: string;
}

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

  async create(data: CreateUserDto): Promise<User | null> {
    try {
      const response = await api.post<ApiResponse<User>>(this.endpoint, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async update(id: string, data: UpdateUserDto): Promise<User | null> {
    try {
      const response = await api.put<ApiResponse<User>>(`${this.endpoint}/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async resetPassword(id: string, newPassword: string): Promise<void> {
    try {
      await api.post(`${this.endpoint}/${id}/reset-password`, { newPassword });
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
