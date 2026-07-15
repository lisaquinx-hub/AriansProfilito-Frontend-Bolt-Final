import { api } from '../api';
import { normalizeArray, normalizeObject, toIsoOrNull } from '@/lib/api-utils';
import type { BlogPost } from '@/types/api';

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

export interface UpdateBlogPostDto extends CreateBlogPostDto {}

function sanitizeBlogPostPayload<T extends CreateBlogPostDto | UpdateBlogPostDto>(
  data: T
): T {
  const isPublished = Boolean(data.isPublished);

  return {
    ...data,
    title: data.title.trim(),
    slug: data.slug.trim(),
    excerpt: data.excerpt.trim(),
    content: data.content.trim(),
    coverImage: data.coverImage?.trim() || null,
    readTime: Math.max(1, Number(data.readTime || 1)),
    isPublished,
    publishedAt: isPublished
      ? toIsoOrNull(data.publishedAt) || new Date().toISOString()
      : null,
    seoTitle: data.seoTitle?.trim() || null,
    seoDescription: data.seoDescription?.trim() || null,
    keywords: data.keywords?.trim() || null,
    categoryId: data.categoryId,
  };
}

class AdminBlogPostsService {
  private readonly endpoint = '/admin/blog/posts';

  async getAll(): Promise<BlogPost[]> {
    const response = await api.get(this.endpoint);
    return normalizeArray<BlogPost>(response.data);
  }

  async getById(id: string): Promise<BlogPost | null> {
    const response = await api.get(`${this.endpoint}/${id}`);
    return normalizeObject<BlogPost>(response.data);
  }

  async create(data: CreateBlogPostDto): Promise<BlogPost | null> {
    const payload = sanitizeBlogPostPayload(data);

    const response = await api.post(this.endpoint, payload);
    return normalizeObject<BlogPost>(response.data);
  }

  async update(id: string, data: UpdateBlogPostDto): Promise<BlogPost | null> {
    const payload = sanitizeBlogPostPayload(data);

    const response = await api.put(`${this.endpoint}/${id}`, payload);
    return normalizeObject<BlogPost>(response.data);
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.endpoint}/${id}`);
  }
}

export const adminBlogPostsService = new AdminBlogPostsService();
export default adminBlogPostsService;