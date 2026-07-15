// There is no backend Products controller or /api/products endpoint.
// Products pages are backed by ServicesController (/api/services).
import { servicesService } from './ServicesService';
import { Service } from '@/types/api';

class ProductService {
  async getProducts(): Promise<Service[]> {
    return servicesService.getAll();
  }

  async getFeaturedProducts(): Promise<Service[]> {
    return servicesService.getFeatured();
  }

  async getProduct(slug: string): Promise<Service | null> {
    return servicesService.getBySlug(slug);
  }
}

export const productService = new ProductService();
