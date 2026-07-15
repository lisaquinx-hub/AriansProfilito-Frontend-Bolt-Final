import { api, getApiErrorMessage } from '../api';
import { ApiResponse, normalizeArray, normalizeObject, toIsoOrNull } from '@/lib/api-utils';
import { BlogPost } from '@/types/api';

export interface CreateBlogPostDto {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  readTime: number;
  isPublished: boolean;
  publishedAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  keywords?: string | null;
  categoryId: string;
}

export type UpdateBlogPostDto = CreateBlogPostDto;

function sanitizeBlogPostPayload<T extends CreateBlogPostDto>(data: T): T {
  const isPublished = Boolean(data.isPublished);

  return {
    ...data,
    title: data.title.trim(),
    slug: data.slug.trim(),
    excerpt: data.excerpt.trim(),
    content: data.content.trim(),
    coverImage: data.coverImage?.trim() || null,
    readTime: Math.max(1, Number(data.readTime) || 1),
    isPublished,
    publishedAt: isPublished
      ? toIsoOrNull(data.publishedAt) || new Date().toISOString()
      : null,
    seoTitle: data.seoTitle?.trim() || null,
    seoDescription: data.seoDescription?.trim() || null,
    keywords: data.keywords?.trim() || null,
    categoryId: data.categoryId.trim(),
  };
}

class AdminBlogPostsService {
  private endpoint = '/admin/blog/posts';

  async getAll(): Promise<BlogPost[]> {
    try {
      const response = await api.get<ApiResponse<BlogPost[]>>(this.endpoint);
      return normalizeArray<BlogPost>(response.data);
    } catch (error) {
      console.error('Failed to fetch blog posts:', getApiErrorMessage(error));
      return [];
    }
  }

  async getById(id: string): Promise<BlogPost | null> {
    try {
      const response = await api.get<ApiResponse<BlogPost>>(`${this.endpoint}/${id}`);
      return normalizeObject<BlogPost>(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async create(data: CreateBlogPostDto): Promise<BlogPost | null> {
    try {
      const response = await api.post<ApiResponse<BlogPost>>(
        this.endpoint,
        sanitizeBlogPostPayload(data)
      );
      return normalizeObject<BlogPost>(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async update(id: string, data: UpdateBlogPostDto): Promise<BlogPost | null> {
    try {
      const response = await api.put<ApiResponse<BlogPost>>(
        `${this.endpoint}/${id}`,
        sanitizeBlogPostPayload(data)
      );
      return normalizeObject<BlogPost>(response.data);
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
