import { api, getApiErrorMessage } from '../api';
import { ApiResponse, normalizeArray, normalizeObject } from '@/lib/api-utils';
import { FileAttachment } from '@/types/api';

export type FileAttachmentPayload = Pick<
  FileAttachment,
  | 'fileName'
  | 'originalFileName'
  | 'filePath'
  | 'extension'
  | 'contentType'
  | 'size'
  | 'uploadedByUserId'
  | 'module'
  | 'referenceId'
  | 'isPublic'
>;

class AdminFileAttachmentsService {
  private endpoint = '/admin/file-attachments';

  async getAll(): Promise<FileAttachment[]> {
    try {
      const response = await api.get<ApiResponse<FileAttachment[]>>(this.endpoint);
      return normalizeArray<FileAttachment>(response.data);
    } catch (error) {
      console.warn('Failed to fetch file attachments:', getApiErrorMessage(error));
      return [];
    }
  }

  async getByReference(module: string, referenceId: string): Promise<FileAttachment[]> {
    try {
      const response = await api.get<ApiResponse<FileAttachment[]>>(
        `${this.endpoint}/reference/${encodeURIComponent(module)}/${referenceId}`
      );
      return normalizeArray<FileAttachment>(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async getById(id: string): Promise<FileAttachment | null> {
    try {
      const response = await api.get<ApiResponse<FileAttachment>>(`${this.endpoint}/${id}`);
      return normalizeObject<FileAttachment>(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async create(data: FileAttachmentPayload): Promise<FileAttachment | null> {
    try {
      const response = await api.post<ApiResponse<FileAttachment>>(this.endpoint, data);
      return normalizeObject<FileAttachment>(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async update(id: string, data: FileAttachmentPayload): Promise<FileAttachment | null> {
    try {
      const response = await api.put<ApiResponse<FileAttachment>>(`${this.endpoint}/${id}`, data);
      return normalizeObject<FileAttachment>(response.data);
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

export const adminFileAttachmentsService = new AdminFileAttachmentsService();
