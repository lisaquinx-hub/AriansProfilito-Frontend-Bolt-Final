import { api, getApiErrorMessage } from './api';
import { ApiResponse } from '@/lib/api-utils';
import { BlogPost, BlogCategory } from '@/types/api';

class BlogService {
  private postsEndpoint = '/blog/posts';
  private categoriesEndpoint = '/blog/categories';

  async getPosts(params?: { categoryId?: string; skip?: number; take?: number }): Promise<BlogPost[]> {
    try {
      const response = await api.get<ApiResponse<BlogPost[]>>(this.postsEndpoint, { params });
      return response.data.data || [];
    } catch (error) {
      console.warn('Failed to fetch blog posts:', getApiErrorMessage(error));
      return [];
    }
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const response = await api.get<ApiResponse<BlogPost>>(
        `${this.postsEndpoint}/${encodeURIComponent(slug)}`
      );
      return response.data.data;
    } catch (error) {
      console.warn('Failed to fetch blog post:', getApiErrorMessage(error));
      return null;
    }
  }

  async getCategories(): Promise<BlogCategory[]> {
    try {
      const response = await api.get<ApiResponse<BlogCategory[]>>(this.categoriesEndpoint);
      return response.data.data || [];
    } catch (error) {
      console.warn('Failed to fetch blog categories:', getApiErrorMessage(error));
      return [];
    }
  }
}

export const blogService = new BlogService();
