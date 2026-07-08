import { api, getApiErrorMessage } from './api';
import { ApiResponse } from '@/lib/api-utils';
import { removeAccessToken } from '@/lib/auth';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  avatar?: string;
  bio?: string;
  role?: string;
  roles?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  company?: string;
  bio?: string;
  avatar?: File;
}

export interface UserActivity {
  id: string;
  type: 'login' | 'project' | 'payment' | 'support';
  description: string;
  date: string;
}

export interface DashboardData {
  totalProjects: number;
  activeProjects: number;
  totalSpent: string;
  upcomingPayments: number;
  recentActivity: UserActivity[];
}

class UserService {
  private endpoint = '/users';

  async getProfile(): Promise<UserProfile> {
    try {
      const response = await api.get<ApiResponse<UserProfile>>(`${this.endpoint}/profile`);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      const response = await api.put<ApiResponse<UserProfile>>(`${this.endpoint}/profile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async deleteAccount(): Promise<void> {
    await api.delete(`${this.endpoint}/account`);
    removeAccessToken();
  }

  async getDashboard(): Promise<DashboardData> {
    try {
      const response = await api.get<ApiResponse<DashboardData>>(`${this.endpoint}/dashboard`);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async getActivity(page: number = 1, limit: number = 10): Promise<{ activities: UserActivity[]; total: number }> {
    try {
      const response = await api.get<ApiResponse<{ activities: UserActivity[]; total: number }>>(
        `${this.endpoint}/activity`,
        { params: { page, limit } }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

export const userService = new UserService();
