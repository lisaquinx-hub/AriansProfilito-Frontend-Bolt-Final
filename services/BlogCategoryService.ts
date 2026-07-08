import { api, getApiErrorMessage } from './api';
import { ApiResponse } from '@/lib/api-utils';
import { BlogCategory } from '@/types/api';

class BlogCategoryService {
  private endpoint = '/blog-categories';

  async getAll(): Promise<BlogCategory[]> {
    try {
      const response = await api.get<ApiResponse<BlogCategory[]>>(this.endpoint);
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch blog categories:', getApiErrorMessage(error));
      return [];
    }
  }

  async getBySlug(slug: string): Promise<BlogCategory | null> {
    try {
      const response = await api.get<ApiResponse<BlogCategory>>(`${this.endpoint}/slug/${slug}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch blog category:', getApiErrorMessage(error));
      return null;
    }
  }
}

export const blogCategoryService = new BlogCategoryService();
