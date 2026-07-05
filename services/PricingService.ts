import { api } from './api';
import { PricingPlan } from '@/lib/mock-data';

export interface PricingRequest {
  name: string;
  email: string;
  company: string;
  planId: string;
  message?: string;
}

export interface PricingQuote {
  id: string;
  planName: string;
  basePrice: string;
  discount: number;
  finalPrice: string;
  validUntil: string;
}

class PricingService {
  private endpoint = '/pricing';

  async getPlans(): Promise<PricingPlan[]> {
    const response = await api.get<PricingPlan[]>(this.endpoint);
    return response.data;
  }

  async requestQuote(data: PricingRequest): Promise<PricingQuote> {
    const response = await api.post<PricingQuote>(`${this.endpoint}/quote`, data);
    return response.data;
  }

  async getCustomQuote(projectDetails: {
    features: string[];
    timeline: string;
    budget: string;
    description: string;
  }): Promise<PricingQuote> {
    const response = await api.post<PricingQuote>(`${this.endpoint}/custom`, projectDetails);
    return response.data;
  }
}

export const pricingService = new PricingService();
