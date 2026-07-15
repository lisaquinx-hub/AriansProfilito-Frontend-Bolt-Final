import { api, getApiErrorMessage } from './api';
import { ApiResponse, normalizeArray, normalizeObject } from '@/lib/api-utils';
import { ProjectFile } from '@/types/api';

class ProjectFilesService {
  private endpoint = '/project-files/my';

  async getMyByProjectId(projectId: string): Promise<ProjectFile[]> {
    try {
      const response = await api.get<ApiResponse<ProjectFile[]>>(
        `${this.endpoint}/project/${projectId}`
      );
      return normalizeArray<ProjectFile>(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async getMyById(id: string): Promise<ProjectFile | null> {
    try {
      const response = await api.get<ApiResponse<ProjectFile>>(`${this.endpoint}/${id}`);
      return normalizeObject<ProjectFile>(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

export const projectFilesService = new ProjectFilesService();
