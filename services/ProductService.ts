// There is no backend Products controller or /api/products endpoint.
// Catalog products are local; service slugs fall back to ServicesController.
import { servicesService } from './ServicesService';
import { Service } from '@/types/api';
import { getProductBySlug, Product } from '@/lib/mock-data';

function mapCatalogProductToService(product: Product): Service {
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    shortDescription: product.shortDescription,
    description: product.longDescription,
    thumbnail: product.image,
    coverImage: product.image,
    features: product.features.map((feature, index) => ({
      id: `${product.id}-${index}`,
      title: feature.title,
      displayOrder: index,
    })),
  };
}

class ProductService {
  async getProducts(): Promise<Service[]> {
    return servicesService.getAll();
  }

  async getFeaturedProducts(): Promise<Service[]> {
    return servicesService.getFeatured();
  }

  async getProduct(slug: string): Promise<Service | null> {
    const catalogProduct = getProductBySlug(slug);
    if (catalogProduct) {
      return mapCatalogProductToService(catalogProduct);
    }

    return servicesService.getBySlug(slug);
  }
}

export const productService = new ProductService();
