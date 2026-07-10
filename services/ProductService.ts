// There is no backend Products controller or /api/products endpoint.
// Products pages are backed by ServicesController (/api/services).
import { api, getApiErrorMessage } from './api';
import { ApiResponse } from '@/lib/api-utils';
import { Service } from '@/types/api';

class ProductService {
  private endpoint = '/services';

  async getProducts(): Promise<Service[]> {
    try {
      const response = await api.get<ApiResponse<Service[]>>(this.endpoint);
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch products:', getApiErrorMessage(error));
      return [];
    }
  }

  async getFeaturedProducts(): Promise<Service[]> {
    try {
      const response = await api.get<ApiResponse<Service[]>>(`${this.endpoint}/featured`);
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch featured products:', getApiErrorMessage(error));
      return [];
    }
  }

  async getProduct(slug: string): Promise<Service | null> {
    try {
      const response = await api.get<ApiResponse<Service>>(`${this.endpoint}/${slug}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch product:', getApiErrorMessage(error));
      return null;
    }
  }
}

export const productService = new ProductService();
