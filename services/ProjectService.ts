import { api, getApiErrorMessage } from './api';
import { ApiResponse } from '@/lib/api-utils';
import { Project } from '@/types/api';

export interface CustomerCommentRequest {
  customerComment: string;
}

class ProjectService {
  private endpoint = '/projects/my';

  async getMyProjects(): Promise<Project[]> {
    try {
      const response = await api.get<ApiResponse<Project[]>>(this.endpoint);
      return response.data.data || [];
    } catch (error) {
      console.warn('Failed to fetch projects:', getApiErrorMessage(error));
      return [];
    }
  }

  async getMyProjectById(id: string): Promise<Project | null> {
    try {
      const response = await api.get<ApiResponse<Project>>(`${this.endpoint}/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async updateCustomerComment(id: string, payload: CustomerCommentRequest): Promise<Project | null> {
    try {
      const response = await api.patch<ApiResponse<Project>>(`${this.endpoint}/${id}/customer-comment`, payload);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

export const projectService = new ProjectService();
