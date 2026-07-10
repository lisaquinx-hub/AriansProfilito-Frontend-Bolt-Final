import { api, getApiErrorMessage } from './api';
import { ApiResponse } from '@/lib/api-utils';
import { BlogPost } from '@/types/api';

class BlogPostService {
  private endpoint = '/blog/posts';

  async getAll(params?: { categoryId?: string; skip?: number; take?: number }): Promise<BlogPost[]> {
    try {
      const response = await api.get<ApiResponse<BlogPost[]>>(this.endpoint, { params });
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
      console.error('Failed to fetch blog post:', getApiErrorMessage(error));
      return null;
    }
  }

  async getBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const response = await api.get<ApiResponse<BlogPost>>(`${this.endpoint}/${slug}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch blog post:', getApiErrorMessage(error));
      return null;
    }
  }
}

export const blogPostService = new BlogPostService();
