import { api, getApiErrorMessage } from '../api';
import { ApiResponse, normalizeArray, normalizeObject } from '@/lib/api-utils';
import { ProjectFile } from '@/types/api';

export type ProjectFilePayload = Pick<
  ProjectFile,
  'projectId' | 'fileName' | 'filePath' | 'fileSize' | 'contentType'
>;

class AdminProjectFilesService {
  private endpoint = '/admin/project-files';

  async getAll(): Promise<ProjectFile[]> {
    try {
      const response = await api.get<ApiResponse<ProjectFile[]>>(this.endpoint);
      return normalizeArray<ProjectFile>(response.data);
    } catch (error) {
      console.warn('Failed to fetch project files:', getApiErrorMessage(error));
      return [];
    }
  }

  async getByProjectId(projectId: string): Promise<ProjectFile[]> {
    try {
      const response = await api.get<ApiResponse<ProjectFile[]>>(
        `${this.endpoint}/project/${projectId}`
      );
      return normalizeArray<ProjectFile>(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async getById(id: string): Promise<ProjectFile | null> {
    try {
      const response = await api.get<ApiResponse<ProjectFile>>(`${this.endpoint}/${id}`);
      return normalizeObject<ProjectFile>(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async create(data: ProjectFilePayload): Promise<ProjectFile | null> {
    try {
      const response = await api.post<ApiResponse<ProjectFile>>(this.endpoint, data);
      return normalizeObject<ProjectFile>(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async update(id: string, data: ProjectFilePayload): Promise<ProjectFile | null> {
    try {
      const response = await api.put<ApiResponse<ProjectFile>>(`${this.endpoint}/${id}`, data);
      return normalizeObject<ProjectFile>(response.data);
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

export const adminProjectFilesService = new AdminProjectFilesService();
