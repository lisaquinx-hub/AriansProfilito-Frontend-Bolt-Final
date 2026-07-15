import { api, getApiErrorMessage } from '../api';
import { ApiResponse } from '@/lib/api-utils';
import { Settings, SiteSettings } from '@/types/api';

class AdminSettingsService {
  private endpoint = '/admin/settings';

  async getAll(): Promise<Settings[]> {
    try {
      const response = await api.get<ApiResponse<Settings[]>>(this.endpoint);
      return response.data.data || [];
    } catch (error) {
      console.warn('Failed to fetch settings:', getApiErrorMessage(error));
      return [];
    }
  }

  async getById(id: string): Promise<Settings | null> {
    try {
      const response = await api.get<ApiResponse<Settings>>(`${this.endpoint}/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async create(data: Partial<Settings>): Promise<Settings | null> {
    try {
      const response = await api.post<ApiResponse<Settings>>(this.endpoint, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async update(id: string, data: Partial<Settings>): Promise<Settings | null> {
    try {
      const response = await api.put<ApiResponse<Settings>>(`${this.endpoint}/${id}`, data);
      return response.data.data;
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

class AdminSiteSettingsService {
  private endpoint = '/admin/site-settings';

  async getAll(): Promise<SiteSettings[]> {
    try {
      const response = await api.get<ApiResponse<SiteSettings[]>>(this.endpoint);
      return response.data.data || [];
    } catch (error) {
      console.warn('Failed to fetch site settings:', getApiErrorMessage(error));
      return [];
    }
  }

  async getById(id: string): Promise<SiteSettings | null> {
    try {
      const response = await api.get<ApiResponse<SiteSettings>>(`${this.endpoint}/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async create(data: Partial<SiteSettings>): Promise<SiteSettings | null> {
    try {
      const response = await api.post<ApiResponse<SiteSettings>>(this.endpoint, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async update(id: string, data: Partial<SiteSettings>): Promise<SiteSettings | null> {
    try {
      const response = await api.put<ApiResponse<SiteSettings>>(`${this.endpoint}/${id}`, data);
      return response.data.data;
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

export const adminSettingsService = new AdminSettingsService();
export const adminSiteSettingsService = new AdminSiteSettingsService();
