import { api, getApiErrorMessage, getApiStatus } from './api';
import { ApiResponse, normalizeArray, normalizeObject } from '@/lib/api-utils';
import { BlogCategory } from '@/types/api';

class BlogCategoryService {
  private listEndpoint = '/blog/categories';
  private detailEndpoint = '/blog-categories';

  async getAll(): Promise<BlogCategory[]> {
    try {
      const response = await api.get<ApiResponse<BlogCategory[]>>(this.listEndpoint);
      return normalizeArray<BlogCategory>(response.data);
    } catch (error) {
      console.error('Failed to fetch blog categories:', getApiErrorMessage(error));
      return [];
    }
  }

  async getBySlug(slug: string): Promise<BlogCategory | null> {
    try {
      const response = await api.get<ApiResponse<BlogCategory>>(
        `${this.detailEndpoint}/slug/${slug}`
      );
      return normalizeObject<BlogCategory>(response.data);
    } catch (error) {
      if (getApiStatus(error) !== 404) {
        console.error('Failed to fetch blog category:', getApiErrorMessage(error));
      }
      return null;
    }
  }

  async getById(id: string): Promise<BlogCategory | null> {
    try {
      const response = await api.get<ApiResponse<BlogCategory>>(`${this.detailEndpoint}/${id}`);
      return normalizeObject<BlogCategory>(response.data);
    } catch (error) {
      if (getApiStatus(error) !== 404) {
        console.error('Failed to fetch blog category by id:', getApiErrorMessage(error));
      }
      return null;
    }
  }
}

export const blogCategoryService = new BlogCategoryService();
