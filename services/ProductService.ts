import { servicesService } from './ServicesService';
import type { Service } from '@/types/api';

export type Product = Service;

class ProductService {
  async getAll(): Promise<Product[]> {
    return servicesService.getAll();
  }

  async getFeatured(): Promise<Product[]> {
    return servicesService.getFeatured();
  }

  async getBySlug(slug: string): Promise<Product | null> {
    return servicesService.getBySlug(slug);
  }

  /**
   * Compatibility alias.
   * Do not use /api/products because backend has no ProductsController.
   */
  async getById(slug: string): Promise<Product | null> {
    return servicesService.getBySlug(slug);
  }
}

export const productService = new ProductService();
export default productService;