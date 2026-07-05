import { api } from './api';
import { BlogPost } from '@/lib/mock-data';

export interface BlogComment {
  id: string;
  author: string;
  content: string;
  date: string;
}

export interface BlogPostDetail extends BlogPost {
  content: string;
  comments: BlogComment[];
}

class BlogService {
  private endpoint = '/blog';

  async getPosts(page: number = 1, limit: number = 10, category?: string): Promise<{ posts: BlogPost[]; total: number }> {
    const response = await api.get<{ posts: BlogPost[]; total: number }>(this.endpoint, {
      params: { page, limit, category },
    });
    return response.data;
  }

  async getPostBySlug(slug: string): Promise<BlogPostDetail> {
    const response = await api.get<BlogPostDetail>(`${this.endpoint}/${slug}`);
    return response.data;
  }

  async searchPosts(query: string): Promise<BlogPost[]> {
    const response = await api.get<BlogPost[]>(`${this.endpoint}/search`, { params: { q: query } });
    return response.data;
  }

  async getCategories(): Promise<string[]> {
    const response = await api.get<string[]>(`${this.endpoint}/categories`);
    return response.data;
  }

  async addComment(postId: string, content: string): Promise<BlogComment> {
    const response = await api.post<BlogComment>(`${this.endpoint}/${postId}/comments`, { content });
    return response.data;
  }
}

export const blogService = new BlogService();
