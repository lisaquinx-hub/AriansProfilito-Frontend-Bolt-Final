import { api, getApiErrorMessage } from './api';
import { ApiResponse, normalizeArray, normalizeObject } from '@/lib/api-utils';
import { CreateCommentRequest, PublicComment } from '@/types/api';

class CommentsService {
  private endpoint = '/comments';

  async getApprovedByBlogPostId(blogPostId: string): Promise<PublicComment[]> {
    try {
      const response = await api.get<ApiResponse<PublicComment[]>>(`${this.endpoint}/blog-post/${blogPostId}/approved`);
      return normalizeArray<PublicComment>(response.data);
    } catch (error) {
      console.warn('Failed to fetch comments:', getApiErrorMessage(error));
      return [];
    }
  }

  async getById(id: string): Promise<PublicComment | null> {
    try {
      const response = await api.get<ApiResponse<PublicComment>>(`${this.endpoint}/${id}`);
      return normalizeObject<PublicComment>(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async create(data: CreateCommentRequest): Promise<PublicComment> {
    try {
      const response = await api.post<ApiResponse<PublicComment>>(this.endpoint, data);
      const comment = normalizeObject<PublicComment>(response.data);
      if (!comment?.id) {
        throw new Error('پاسخ ثبت نظر از سرور نامعتبر است');
      }
      return comment;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

export const commentsService = new CommentsService();
