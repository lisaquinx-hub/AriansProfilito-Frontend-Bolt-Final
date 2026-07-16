import { api, getApiErrorMessage } from './api';
import { ApiResponse, normalizeArray, normalizeObject } from '@/lib/api-utils';
import { FileAttachment, PublicFileAttachment } from '@/types/api';

class FileAttachmentsService {
  private endpoint = '/file-attachments';

  async getMy(): Promise<FileAttachment[]> {
    try {
      const response = await api.get<ApiResponse<FileAttachment[]>>(`${this.endpoint}/my`);
      return normalizeArray<FileAttachment>(response.data);
    } catch (error) {
      console.warn('Failed to fetch my attachments:', getApiErrorMessage(error));
      return [];
    }
  }

  async getPublicByReference(module: string, referenceId: string): Promise<PublicFileAttachment[]> {
    try {
      const response = await api.get<ApiResponse<PublicFileAttachment[]>>(
        `${this.endpoint}/public/${encodeURIComponent(module)}/${referenceId}`
      );
      return normalizeArray<PublicFileAttachment>(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async getMyById(id: string): Promise<FileAttachment | null> {
    try {
      const response = await api.get<ApiResponse<FileAttachment>>(`${this.endpoint}/my/${id}`);
      return normalizeObject<FileAttachment>(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async deleteMy(id: string): Promise<void> {
    try {
      await api.delete(`${this.endpoint}/my/${id}`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

export const fileAttachmentsService = new FileAttachmentsService();
