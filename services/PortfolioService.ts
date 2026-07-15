import { api, getApiErrorMessage } from './api';
import { ApiResponse } from '@/lib/api-utils';
import { PortfolioListItem, PortfolioDetail, PortfolioCategory, PagedResult } from '@/types/api';

class PortfolioService {
  private baseEndpoint = '/portfolio';

  async getItems(params?: {
    pageNumber?: number;
    pageSize?: number;
    search?: string;
    categorySlug?: string;
    isFeatured?: boolean;
  }): Promise<PagedResult<PortfolioListItem>> {
    try {
      const response = await api.get<ApiResponse<PagedResult<PortfolioListItem>>>(
        `${this.baseEndpoint}/items`,
        { params }
      );
      return (
        response.data.data || {
          items: [],
          totalCount: 0,
          pageNumber: 1,
          pageSize: 10,
          totalPages: 0,
        }
      );
    } catch (error) {
      console.warn('Failed to fetch portfolio items:', getApiErrorMessage(error));
      return { items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 };
    }
  }

  async getBySlug(slug: string): Promise<PortfolioDetail | null> {
    try {
      const response = await api.get<ApiResponse<PortfolioDetail>>(
        `${this.baseEndpoint}/items/${encodeURIComponent(slug)}`
      );
      return response.data.data;
    } catch (error) {
      console.warn('Failed to fetch portfolio item:', getApiErrorMessage(error));
      return null;
    }
  }

  async getCategories(): Promise<PortfolioCategory[]> {
    try {
      const response = await api.get<ApiResponse<PortfolioCategory[]>>(
        `${this.baseEndpoint}/categories`
      );
      return response.data.data || [];
    } catch (error) {
      console.warn('Failed to fetch portfolio categories:', getApiErrorMessage(error));
      return [];
    }
  }
}

export const portfolioService = new PortfolioService();
