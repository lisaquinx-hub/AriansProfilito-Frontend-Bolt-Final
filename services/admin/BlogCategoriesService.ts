import { api, getApiErrorMessage } from '../api';
import { ApiResponse } from '@/lib/api-utils';
import { BlogCategory } from '@/types/api';

export interface CreateBlogCategoryDto {
  name: string;
  slug: string;
  description?: string | null;
  isActive: boolean;
}

export interface UpdateBlogCategoryDto {
  name: string;
  slug: string;
  description?: string | null;
  isActive: boolean;
}

class AdminBlogCategoriesService {
  private readonly endpoint = '/admin/blog-categories';

  async getAll(): Promise<BlogCategory[]> {
    try {
      const response = await api.get<ApiResponse<BlogCategory[]>>(this.endpoint);

      const data = response.data?.data;

      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Failed to fetch blog categories:', getApiErrorMessage(error));
      return [];
    }
  }

  async getById(id: string): Promise<BlogCategory | null> {
    try {
      const response = await api.get<ApiResponse<BlogCategory>>(
        `${this.endpoint}/${id}`
      );

      return response.data?.data ?? null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async create(data: CreateBlogCategoryDto): Promise<BlogCategory | null> {
    try {
      const payload: CreateBlogCategoryDto = {
        name: data.name.trim(),
        slug: data.slug.trim(),
        description: data.description?.trim() || null,
        isActive: Boolean(data.isActive),
      };

      const response = await api.post<ApiResponse<BlogCategory>>(
        this.endpoint,
        payload
      );

      return response.data?.data ?? null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async update(
    id: string,
    data: UpdateBlogCategoryDto
  ): Promise<BlogCategory | null> {
    try {
      const payload: UpdateBlogCategoryDto = {
        name: data.name.trim(),
        slug: data.slug.trim(),
        description: data.description?.trim() || null,
        isActive: Boolean(data.isActive),
      };

      const response = await api.put<ApiResponse<BlogCategory>>(
        `${this.endpoint}/${id}`,
        payload
      );

      return response.data?.data ?? null;
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
export default adminBlogCategoriesService;