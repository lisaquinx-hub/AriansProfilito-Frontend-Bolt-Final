import { api, getApiErrorMessage } from './api';
import { ApiResponse } from '@/lib/api-utils';
import { Settings, SiteSettings } from '@/types/api';

class SettingsService {
  private endpoint = '/settings';

  async getCurrent(): Promise<Settings | null> {
    try {
      const response = await api.get<ApiResponse<Settings>>(`${this.endpoint}/current`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch settings:', getApiErrorMessage(error));
      return null;
    }
  }

  async getById(id: string): Promise<Settings | null> {
    try {
      const response = await api.get<ApiResponse<Settings>>(`${this.endpoint}/${id}`);
      return response.data.data || null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

class SiteSettingsService {
  private endpoint = '/site-settings';

  async getCurrent(): Promise<SiteSettings | null> {
    try {
      const response = await api.get<ApiResponse<SiteSettings>>(`${this.endpoint}/current`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch site settings:', getApiErrorMessage(error));
      return null;
    }
  }

  async getById(id: string): Promise<SiteSettings | null> {
    try {
      const response = await api.get<ApiResponse<SiteSettings>>(`${this.endpoint}/${id}`);
      return response.data.data || null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

export const settingsService = new SettingsService();
export const siteSettingsService = new SiteSettingsService();
