import { api, getApiErrorMessage } from './api';
import { ApiResponse, normalizeArray, normalizeObject } from '@/lib/api-utils';
import { Comment, CreateCommentRequest } from '@/types/api';

class CommentsService {
  private endpoint = '/comments';

  async getApprovedByBlogPostId(blogPostId: string): Promise<Comment[]> {
    try {
      const response = await api.get<ApiResponse<Comment[]>>(
        `${this.endpoint}/blog-post/${blogPostId}/approved`
      );

      return normalizeArray<Comment>(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', getApiErrorMessage(error));
      return [];
    }
  }

  async create(data: CreateCommentRequest): Promise<Comment | null> {
    try {
      const response = await api.post<ApiResponse<Comment>>(this.endpoint, data);
      return normalizeObject<Comment>(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

export const commentsService = new CommentsService();
export default commentsService;