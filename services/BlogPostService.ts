import { api, getApiErrorMessage, getApiStatus } from './api';
import { ApiResponse, normalizeArray, normalizeObject } from '@/lib/api-utils';
import { BlogPost } from '@/types/api';

interface BlogPostQueryParams {
  categorySlug?: string;
  search?: string;
  pageNumber?: number;
  pageSize?: number;
}

interface BlogPostPage {
  items: BlogPost[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

class BlogPostService {
  private endpoint = '/blog/posts';

  async getAll(params?: BlogPostQueryParams): Promise<BlogPost[]> {
    try {
      const response = await api.get<ApiResponse<BlogPostPage>>(this.endpoint, {
        params: { pageNumber: 1, pageSize: 50, ...params },
      });
      return normalizeArray<BlogPost>(response.data);
    } catch (error) {
      console.warn('Failed to fetch blog posts:', getApiErrorMessage(error));
      return [];
    }
  }

  async getBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const response = await api.get<ApiResponse<BlogPost>>(
        `${this.endpoint}/${encodeURIComponent(slug)}`
      );
      return normalizeObject<BlogPost>(response.data);
    } catch (error) {
      if (getApiStatus(error) !== 404) {
        console.warn('Failed to fetch blog post:', getApiErrorMessage(error));
      }
      return null;
    }
  }
}

export const blogPostService = new BlogPostService();
