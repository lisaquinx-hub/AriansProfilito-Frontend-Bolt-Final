import { api } from './api';
import { Product, products as mockProducts, getProductBySlug, getRelatedProducts } from '@/lib/mock-data';

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

class ProductService {
  private endpoint = '/products';

  async getProducts(page: number = 1, limit: number = 10, category?: string): Promise<ProductListResponse> {
    // TODO: Replace with actual API call
    // const response = await api.get<ProductListResponse>(this.endpoint, { params: { page, limit, category } });
    // return response.data;

    let filtered = mockProducts;
    if (category && category !== 'all') {
      filtered = filtered.filter((p) => p.category === category);
    }
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);
    return {
      products: paginated,
      total: filtered.length,
      page,
      limit,
    };
  }

  async getProduct(slug: string): Promise<Product | undefined> {
    // TODO: Replace with actual API call
    // const response = await api.get<Product>(`${this.endpoint}/${slug}`);
    // return response.data;
    return getProductBySlug(slug);
  }

  async getRelated(productId: string): Promise<Product[]> {
    // TODO: Replace with actual API call
    // const response = await api.get<Product[]>(`${this.endpoint}/${productId}/related`);
    // return response.data;
    return getRelatedProducts(productId);
  }

  async searchProducts(query: string): Promise<Product[]> {
    // TODO: Replace with actual API call
    // const response = await api.get<Product[]>(`${this.endpoint}/search`, { params: { q: query } });
    // return response.data;
    const q = query.toLowerCase();
    return mockProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }
}

export const productService = new ProductService();
