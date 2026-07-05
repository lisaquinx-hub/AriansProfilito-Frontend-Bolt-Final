import { api } from './api';

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  progress: number;
  startDate: string;
  deadline?: string;
  team: { id: string; name: string; role: string }[];
  milestones: { id: string; title: string; completed: boolean; date: string }[];
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  requirements: string[];
  timeline: string;
  budget: string;
}

class ProjectService {
  private endpoint = '/projects';

  async getProjects(): Promise<Project[]> {
    const response = await api.get<Project[]>(this.endpoint);
    return response.data;
  }

  async getProject(id: string): Promise<Project> {
    const response = await api.get<Project>(`${this.endpoint}/${id}`);
    return response.data;
  }

  async createProject(data: CreateProjectRequest): Promise<Project> {
    const response = await api.post<Project>(this.endpoint, data);
    return response.data;
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const response = await api.put<Project>(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  async getMilestones(projectId: string): Promise<Project['milestones']> {
    const response = await api.get<Project['milestones']>(`${this.endpoint}/${projectId}/milestones`);
    return response.data;
  }

  async completeMilestone(projectId: string, milestoneId: string): Promise<void> {
    await api.put(`${this.endpoint}/${projectId}/milestones/${milestoneId}/complete`);
  }
}

export const projectService = new ProjectService();
