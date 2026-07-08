import { api, getApiErrorMessage } from './api';
import { ApiResponse } from '@/lib/api-utils';

export interface UserProject {
  id: string;
  title: string;
  description: string;
  status: string;
  progress: number;
  startDate: string;
  deadline?: string;
  team?: { id: string; name: string; role: string }[];
  milestones?: { id: string; title: string; completed: boolean; date: string }[];
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  requirements?: string[];
  timeline?: string;
  budget?: string;
}

class ProjectService {
  private endpoint = '/projects';

  async getProjects(): Promise<UserProject[]> {
    try {
      const response = await api.get<ApiResponse<UserProject[]>>(this.endpoint);
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch projects:', getApiErrorMessage(error));
      return [];
    }
  }

  async getProject(id: string): Promise<UserProject | null> {
    try {
      const response = await api.get<ApiResponse<UserProject>>(`${this.endpoint}/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async createProject(data: CreateProjectRequest): Promise<UserProject> {
    try {
      const response = await api.post<ApiResponse<UserProject>>(this.endpoint, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async updateProject(id: string, data: Partial<UserProject>): Promise<UserProject> {
    try {
      const response = await api.put<ApiResponse<UserProject>>(`${this.endpoint}/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async getMilestones(projectId: string): Promise<UserProject['milestones']> {
    try {
      const response = await api.get<ApiResponse<UserProject['milestones']>>(`${this.endpoint}/${projectId}/milestones`);
      return response.data.data || [];
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async completeMilestone(projectId: string, milestoneId: string): Promise<void> {
    try {
      await api.put(`${this.endpoint}/${projectId}/milestones/${milestoneId}/complete`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

export const projectService = new ProjectService();
