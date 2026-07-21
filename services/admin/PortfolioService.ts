import { api, getApiErrorMessage } from '../api';
import { ApiResponse, normalizeArray, normalizeObject, toIsoOrNull } from '@/lib/api-utils';
import { PortfolioDetail } from '@/types/api';

export interface CreatePortfolioDto {
  title: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  clientName: string;
  projectDate: string;
  thumbnail: string;
  websiteUrl: string;
  githubUrl?: string | null;
  isFeatured: boolean;
  displayOrder: number;
  categoryId: string;
}

export type UpdatePortfolioDto = CreatePortfolioDto;

function sanitizePortfolioPayload<T extends CreatePortfolioDto>(data: T): T {
  const projectDate = toIsoOrNull(data.projectDate);
  if (!projectDate) {
    throw new Error('تاریخ پروژه معتبر نیست');
  }

  return {
    ...data,
    title: data.title.trim(),
    slug: data.slug.trim().toLowerCase(),
    description: data.description.trim(),
    shortDescription: data.shortDescription?.trim() || null,
    clientName: data.clientName.trim(),
    projectDate,
    thumbnail: data.thumbnail.trim(),
    websiteUrl: data.websiteUrl.trim(),
    githubUrl: data.githubUrl?.trim() || null,
    isFeatured: Boolean(data.isFeatured),
    displayOrder: Math.max(0, Number(data.displayOrder) || 0),
    categoryId: data.categoryId.trim(),
  };
}

class AdminPortfolioService {
  private endpoint = '/admin/portfolio';

  async getAll(): Promise<PortfolioDetail[]> {
    try {
      const response = await api.get<ApiResponse<PortfolioDetail[]>>(this.endpoint);
      return normalizeArray<PortfolioDetail>(response.data);
    } catch (error) {
      console.warn('Failed to fetch portfolio items:', getApiErrorMessage(error));
      return [];
    }
  }

  async getById(id: string): Promise<PortfolioDetail | null> {
    try {
      const response = await api.get<ApiResponse<PortfolioDetail>>(`${this.endpoint}/${id}`);
      return normalizeObject<PortfolioDetail>(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async create(data: CreatePortfolioDto): Promise<PortfolioDetail | null> {
    try {
      const response = await api.post<ApiResponse<PortfolioDetail>>(
        this.endpoint,
        sanitizePortfolioPayload(data)
      );
      return normalizeObject<PortfolioDetail>(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async update(id: string, data: UpdatePortfolioDto): Promise<PortfolioDetail | null> {
    try {
      const response = await api.put<ApiResponse<PortfolioDetail>>(
        `${this.endpoint}/${id}`,
        sanitizePortfolioPayload(data)
      );
      return normalizeObject<PortfolioDetail>(response.data);
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

export const adminPortfolioService = new AdminPortfolioService();
