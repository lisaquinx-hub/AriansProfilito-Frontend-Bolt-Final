import { api, getApiErrorMessage } from '../api';
import { ApiResponse } from '@/lib/api-utils';
import { BlogPost } from '@/types/api';

class AdminBlogPostsService {
  private endpoint = '/admin/blog-posts';

  async getAll(): Promise<BlogPost[]> {
    try {
      const response = await api.get<ApiResponse<BlogPost[]>>(this.endpoint);
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch blog posts:', getApiErrorMessage(error));
      return [];
    }
  }

  async getById(id: string): Promise<BlogPost | null> {
    try {
      const response = await api.get<ApiResponse<BlogPost>>(`${this.endpoint}/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async create(data: Partial<BlogPost>): Promise<BlogPost | null> {
    try {
      const response = await api.post<ApiResponse<BlogPost>>(this.endpoint, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async update(id: string, data: Partial<BlogPost>): Promise<BlogPost | null> {
    try {
      const response = await api.put<ApiResponse<BlogPost>>(`${this.endpoint}/${id}`, data);
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

export const adminBlogPostsService = new AdminBlogPostsService();
