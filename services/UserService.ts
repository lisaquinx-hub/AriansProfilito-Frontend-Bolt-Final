import { api, getApiErrorMessage } from './api';
import { ApiResponse } from '@/lib/api-utils';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  userName?: string;
  phoneNumber?: string;
  role?: number;
  isActive?: boolean;
  emailConfirmed?: boolean;
  avatar?: string;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  email: string;
  userName?: string;
  phoneNumber?: string;
  avatar?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

class UserService {
  async getProfile(): Promise<UserProfile> {
    const response = await api.get<ApiResponse<UserProfile>>('/profile/me');
    return response.data.data;
  }

  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    const response = await api.put<ApiResponse<UserProfile>>('/profile/me', data);
    return response.data.data;
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await api.patch('/profile/change-password', data);
  }
}

export const userService = new UserService();
