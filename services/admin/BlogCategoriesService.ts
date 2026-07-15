import { api, getApiErrorMessage } from '../api';
import { ApiResponse, normalizeArray, normalizeObject } from '@/lib/api-utils';
import { BlogCategory } from '@/types/api';

export interface CreateBlogCategoryDto {
  name: string;
  slug: string;
  description?: string | null;
  isActive: boolean;
}

export type UpdateBlogCategoryDto = CreateBlogCategoryDto;

function sanitizeCategoryPayload<T extends CreateBlogCategoryDto>(data: T): T {
  return {
    ...data,
    name: data.name.trim(),
    slug: data.slug.trim(),
    description: data.description?.trim() || null,
    isActive: Boolean(data.isActive),
  };
}

class AdminBlogCategoriesService {
  private endpoint = '/admin/blog-categories';

  async getAll(): Promise<BlogCategory[]> {
    try {
      const response = await api.get<ApiResponse<BlogCategory[]>>(this.endpoint);
      return normalizeArray<BlogCategory>(response.data);
    } catch (error) {
      console.error('Failed to fetch blog categories:', getApiErrorMessage(error));
      return [];
    }
  }

  async getById(id: string): Promise<BlogCategory | null> {
    try {
      const response = await api.get<ApiResponse<BlogCategory>>(`${this.endpoint}/${id}`);
      return normalizeObject<BlogCategory>(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async create(data: CreateBlogCategoryDto): Promise<BlogCategory | null> {
    try {
      const response = await api.post<ApiResponse<BlogCategory>>(
        this.endpoint,
        sanitizeCategoryPayload(data)
      );
      return normalizeObject<BlogCategory>(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async update(id: string, data: UpdateBlogCategoryDto): Promise<BlogCategory | null> {
    try {
      const response = await api.put<ApiResponse<BlogCategory>>(
        `${this.endpoint}/${id}`,
        sanitizeCategoryPayload(data)
      );
      return normalizeObject<BlogCategory>(response.data);
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
