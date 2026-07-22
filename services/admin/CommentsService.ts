import { api, getApiErrorMessage } from '../api';
import { ApiResponse, normalizeArray, normalizeObject } from '@/lib/api-utils';
import { Comment, Project } from '@/types/api';

class AdminCommentsService {
  private endpoint = '/admin/comments';

  private toProjectComment(project: Project): Comment | null {
    const message = project.customerComment?.trim();
    if (!message) return null;

    return {
      id: project.id,
      source: 'project',
      projectId: project.id,
      projectTitle: project.title,
      projectCode: project.projectCode,
      userId: project.userId,
      userFullName: project.customerFullName,
      userEmail: project.customerEmail,
      fullName: project.customerFullName || 'مشتری پروژه',
      email: project.customerEmail || '',
      message,
      isApproved: Boolean(project.isCustomerCommentApproved),
      createdAt: project.updatedAt || project.createdAt,
      updatedAt: project.updatedAt,
    };
  }

  private async getProjectComment(id: string): Promise<Comment | null> {
    const response = await api.get<ApiResponse<Project>>(`/admin/projects/${id}`);
    const project = normalizeObject<Project>(response.data);
    return project ? this.toProjectComment(project) : null;
  }

  async getAll(): Promise<Comment[]> {
    try {
      const cacheBuster = Date.now();
      const [commentsResponse, projectsResponse] = await Promise.all([
        api.get<ApiResponse<Comment[]>>(this.endpoint, {
          params: { skip: 0, take: 500, cacheBuster },
        }),
        api.get<ApiResponse<Project[]>>('/admin/projects', {
          params: { cacheBuster },
        }),
      ]);

      const blogComments = normalizeArray<Comment>(commentsResponse.data)
        .map(comment => ({ ...comment, source: 'blog' as const }));
      const projectComments = normalizeArray<Project>(projectsResponse.data)
        .map(project => this.toProjectComment(project))
        .filter((comment): comment is Comment => comment !== null);

      return [...blogComments, ...projectComments].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async getById(id: string, source?: Comment['source']): Promise<Comment | null> {
    try {
      if (source === 'project') {
        return await this.getProjectComment(id);
      }

      const response = await api.get<ApiResponse<Comment>>(`${this.endpoint}/${id}`);
      const comment = normalizeObject<Comment>(response.data);
      return comment ? { ...comment, source: 'blog' } : null;
    } catch (error) {
      if (!source) {
        try {
          return await this.getProjectComment(id);
        } catch {
          // Preserve the original API error when neither source contains the id.
        }
      }
      throw new Error(getApiErrorMessage(error));
    }
  }

  async updateApproval(comment: Pick<Comment, 'id' | 'source'>, isApproved: boolean): Promise<void> {
    try {
      const url = comment.source === 'project'
        ? `/admin/projects/${comment.id}/customer-comment/approval`
        : `${this.endpoint}/${comment.id}/approval`;
      await api.patch(url, { isApproved });
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async delete(comment: Pick<Comment, 'id' | 'source'>): Promise<void> {
    try {
      const url = comment.source === 'project'
        ? `/admin/projects/${comment.id}/customer-comment`
        : `${this.endpoint}/${comment.id}`;
      await api.delete(url);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

export const adminCommentsService = new AdminCommentsService();
