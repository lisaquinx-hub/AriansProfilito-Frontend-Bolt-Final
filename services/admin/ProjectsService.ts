import { api, getApiErrorMessage } from '../api';
import { ApiResponse } from '@/lib/api-utils';
import { Project } from '@/types/api';

export interface CreateProjectDto {
  userId: string;
  pricingPlanId: string;
  projectCode?: string | null;
  estimatedDeliveryDate?: string | null;
  title: string;
  description: string;
  status: number;
  progress: number;
  price: number;
  paidAmount: number;
  startDate?: string | null;
  endDate?: string | null;
  adminNote?: string | null;
  customerComment?: string | null;
}

export interface UpdateProjectDto {
  userId: string;
  pricingPlanId: string;
  estimatedDeliveryDate?: string | null;
  title: string;
  description: string;
  status: number;
  progress: number;
  price: number;
  paidAmount: number;
  startDate?: string | null;
  endDate?: string | null;
  adminNote?: string | null;
  customerComment?: string | null;
}

export interface UpdateProjectStatusDto {
  status: number;
  progress: number;
  adminNote?: string | null;
}

class AdminProjectsService {
  private endpoint = '/admin/projects';

  async getAll(): Promise<Project[]> {
    try {
      const response = await api.get<ApiResponse<Project[]>>(this.endpoint);
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.error('Failed to fetch projects:', getApiErrorMessage(error));
      return [];
    }
  }

  async getById(id: string): Promise<Project | null> {
    try {
      const response = await api.get<ApiResponse<Project>>(`${this.endpoint}/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async create(data: CreateProjectDto): Promise<Project | null> {
    try {
      const response = await api.post<ApiResponse<Project>>(this.endpoint, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async update(id: string, data: UpdateProjectDto): Promise<Project | null> {
    try {
      const response = await api.put<ApiResponse<Project>>(`${this.endpoint}/${id}`, data);
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

  async updateStatus(id: string, data: UpdateProjectStatusDto): Promise<Project | null> {
    try {
      const response = await api.patch<ApiResponse<Project>>(`${this.endpoint}/${id}/status`, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

export const adminProjectsService = new AdminProjectsService();
