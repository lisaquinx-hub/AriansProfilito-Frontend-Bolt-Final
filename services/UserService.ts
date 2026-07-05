import { api } from './api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  avatar?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
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
    const response = await api.get<UserProfile>(`${this.endpoint}/profile`);
    return response.data;
  }

  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
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
    const response = await api.put<UserProfile>(`${this.endpoint}/profile`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  async deleteAccount(): Promise<void> {
    await api.delete(`${this.endpoint}/account`);
    localStorage.removeItem('token');
  }

  async getDashboard(): Promise<DashboardData> {
    const response = await api.get<DashboardData>(`${this.endpoint}/dashboard`);
    return response.data;
  }

  async getActivity(page: number = 1, limit: number = 10): Promise<{ activities: UserActivity[]; total: number }> {
    const response = await api.get<{ activities: UserActivity[]; total: number }>(
      `${this.endpoint}/activity`,
      { params: { page, limit } }
    );
    return response.data;
  }
}

export const userService = new UserService();
