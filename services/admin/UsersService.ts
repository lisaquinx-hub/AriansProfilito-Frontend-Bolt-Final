import { api } from '../api';
import { normalizeArray, normalizeObject } from '@/lib/api-utils';

export interface AdminUser {
  id: string;
  fullName?: string | null;
  email: string;
  userName?: string | null;
  phoneNumber?: string | null;
  role?: number | string;
  isActive?: boolean;
  emailConfirmed?: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface CreateAdminUserDto {
  fullName: string;
  userName: string;
  email: string;
  phoneNumber?: string | null;
  password: string;
  role: number;
  isActive: boolean;
  emailConfirmed?: boolean;
}

export interface UpdateAdminUserDto {
  fullName: string;
  userName: string;
  email: string;
  phoneNumber?: string | null;
  role: number;
  isActive: boolean;
  emailConfirmed?: boolean;
}

class AdminUsersService {
  private readonly endpoint = '/admin/users';

  async getAll(): Promise<AdminUser[]> {
    const response = await api.get(this.endpoint);
    return normalizeArray<AdminUser>(response.data);
  }

  async getById(id: string): Promise<AdminUser | null> {
    const response = await api.get(`${this.endpoint}/${id}`);
    return normalizeObject<AdminUser>(response.data);
  }

  async create(data: CreateAdminUserDto): Promise<AdminUser | null> {
    const payload: CreateAdminUserDto = {
      fullName: data.fullName.trim(),
      userName: data.userName.trim(),
      email: data.email.trim(),
      phoneNumber: data.phoneNumber?.trim() || null,
      password: data.password,
      role: Number(data.role),
      isActive: Boolean(data.isActive),
      emailConfirmed: Boolean(data.emailConfirmed),
    };

    const response = await api.post(this.endpoint, payload);
    return normalizeObject<AdminUser>(response.data);
  }

  async update(id: string, data: UpdateAdminUserDto): Promise<AdminUser | null> {
    const payload: UpdateAdminUserDto = {
      fullName: data.fullName.trim(),
      userName: data.userName.trim(),
      email: data.email.trim(),
      phoneNumber: data.phoneNumber?.trim() || null,
      role: Number(data.role),
      isActive: Boolean(data.isActive),
      emailConfirmed: Boolean(data.emailConfirmed),
    };

    const response = await api.put(`${this.endpoint}/${id}`, payload);
    return normalizeObject<AdminUser>(response.data);
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.endpoint}/${id}`);
  }

  async resetPassword(id: string, newPassword: string): Promise<void> {
    await api.patch(`${this.endpoint}/${id}/reset-password`, {
      newPassword,
    });
  }

  async activate(id: string): Promise<AdminUser | null> {
    const response = await api.patch(`${this.endpoint}/${id}/activate`);
    return normalizeObject<AdminUser>(response.data);
  }
}

export const adminUsersService = new AdminUsersService();
export default adminUsersService;