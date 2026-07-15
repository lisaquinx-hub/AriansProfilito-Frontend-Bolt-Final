import { api } from './api';
import { normalizeArray, normalizeObject } from '@/lib/api-utils';
import type { Service } from '@/types/api';

class ServicesService {
  private readonly endpoint = '/services';

  async getAll(): Promise<Service[]> {
    const response = await api.get(this.endpoint);
    return normalizeArray<Service>(response.data);
  }

  async getFeatured(): Promise<Service[]> {
    const response = await api.get(`${this.endpoint}/featured`);
    return normalizeArray<Service>(response.data);
  }

  async getBySlug(slug: string): Promise<Service | null> {
    const response = await api.get(`${this.endpoint}/${slug}`);
    return normalizeObject<Service>(response.data);
  }

  /**
   * Compatibility alias.
   * Public backend route is /api/services/{slug}, not a numeric/id lookup.
   */
  async getById(slug: string): Promise<Service | null> {
    return this.getBySlug(slug);
  }
}

export const servicesService = new ServicesService();
export default servicesService;