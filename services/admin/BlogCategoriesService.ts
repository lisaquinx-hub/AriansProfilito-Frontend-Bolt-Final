import { api, getApiErrorMessage } from '../api';
import { ApiResponse } from '@/lib/api-utils';
import { BlogCategory } from '@/types/api';

class AdminBlogCategoriesService {
  private endpoint = '/admin/blog-categories';

  async getAll(): Promise<BlogCategory[]> {
    try {
      const response = await api.get<ApiResponse<BlogCategory[]>>(this.endpoint);
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch blog categories:', getApiErrorMessage(error));
      return [];
    }
  }

  async getById(id: string): Promise<BlogCategory | null> {
    try {
      const response = await api.get<ApiResponse<BlogCategory>>(`${this.endpoint}/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async create(data: Partial<BlogCategory>): Promise<BlogCategory | null> {
    try {
      const response = await api.post<ApiResponse<BlogCategory>>(this.endpoint, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async update(id: string, data: Partial<BlogCategory>): Promise<BlogCategory | null> {
    try {
      const response = await api.put<ApiResponse<BlogCategory>>(`${this.endpoint}/${id}`, data);
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
}

export const adminBlogCategoriesService = new AdminBlogCategoriesService();
