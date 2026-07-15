import { api, getApiErrorMessage } from '../api';
import { ApiResponse } from '@/lib/api-utils';
import { EmailTemplate } from '@/types/api';

class AdminEmailTemplatesService {
  private endpoint = '/admin/email-templates';

  async getAll(): Promise<EmailTemplate[]> {
    try {
      const response = await api.get<ApiResponse<EmailTemplate[]>>(this.endpoint);
      return response.data.data || [];
    } catch (error) {
      console.warn('Failed to fetch email templates:', getApiErrorMessage(error));
      return [];
    }
  }

  async getActive(): Promise<EmailTemplate[]> {
    try {
      const response = await api.get<ApiResponse<EmailTemplate[]>>(`${this.endpoint}/active`);
      return response.data.data || [];
    } catch (error) {
      console.warn('Failed to fetch active email templates:', getApiErrorMessage(error));
      return [];
    }
  }

  async getById(id: string): Promise<EmailTemplate | null> {
    try {
      const response = await api.get<ApiResponse<EmailTemplate>>(`${this.endpoint}/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async getByName(name: string): Promise<EmailTemplate | null> {
    try {
      const response = await api.get<ApiResponse<EmailTemplate>>(
        `${this.endpoint}/by-name/${encodeURIComponent(name)}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async create(data: Partial<EmailTemplate>): Promise<EmailTemplate | null> {
    try {
      const response = await api.post<ApiResponse<EmailTemplate>>(this.endpoint, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async update(id: string, data: Partial<EmailTemplate>): Promise<EmailTemplate | null> {
    try {
      const response = await api.put<ApiResponse<EmailTemplate>>(`${this.endpoint}/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async updateActiveStatus(id: string, isActive: boolean): Promise<void> {
    try {
      await api.patch(`${this.endpoint}/${id}/active-status`, { isActive });
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

export const adminEmailTemplatesService = new AdminEmailTemplatesService();
