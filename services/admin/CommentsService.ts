import { api, getApiErrorMessage } from '../api';
import { ApiResponse, normalizeArray, normalizeObject } from '@/lib/api-utils';
import { Comment } from '@/types/api';

class AdminCommentsService {
  private endpoint = '/admin/comments';

  async getAll(): Promise<Comment[]> {
    try {
      const response = await api.get<ApiResponse<Comment[]>>(this.endpoint);
      return normalizeArray<Comment>(response.data);
    } catch (error) {
      console.warn('Failed to fetch comments:', getApiErrorMessage(error));
      return [];
    }
  }

  async getById(id: string): Promise<Comment | null> {
    try {
      const response = await api.get<ApiResponse<Comment>>(`${this.endpoint}/${id}`);
      return normalizeObject<Comment>(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async updateApproval(id: string, isApproved: boolean): Promise<void> {
    try {
      await api.patch(`${this.endpoint}/${id}/approval`, { isApproved });
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

export const adminCommentsService = new AdminCommentsService();
