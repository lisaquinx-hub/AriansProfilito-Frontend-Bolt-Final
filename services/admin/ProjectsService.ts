import { api } from '../api';
import {
  addDays,
  generateProjectCode,
  normalizeArray,
  normalizeObject,
  toIsoOrNull,
} from '@/lib/api-utils';
import type { Project } from '@/types/api';

export interface CreateProjectDto {
  userId: string;
  pricingPlanId: string;
  projectCode?: string | null;
  estimatedDeliveryDate?: string | null;
  title: string;
  description: string;
  status: number;
  progress: number;
  price: number;
  paidAmount: number;
  startDate?: string | null;
  endDate?: string | null;
  adminNote?: string | null;
  customerComment?: string | null;
}

export interface UpdateProjectDto {
  userId?: string;
  pricingPlanId?: string;
  projectCode?: string | null;
  estimatedDeliveryDate?: string | null;
  title: string;
  description: string;
  status: number;
  progress: number;
  price: number;
  paidAmount: number;
  startDate?: string | null;
  endDate?: string | null;
  adminNote?: string | null;
  customerComment?: string | null;
}

export interface UpdateProjectStatusDto {
  status: number;
  progress: number;
  adminNote?: string | null;
}

function clampProgress(value: unknown): number {
  const numberValue = Number(value || 0);
  return Math.max(0, Math.min(100, Number.isFinite(numberValue) ? numberValue : 0));
}

function toMoney(value: unknown): number {
  const numberValue = Number(value || 0);
  return Number.isFinite(numberValue) && numberValue >= 0 ? numberValue : 0;
}

function defaultStartDate(): string {
  return new Date().toISOString();
}

function defaultDeliveryDate(): string {
  return addDays(new Date(), 30).toISOString();
}

function sanitizeCreateProjectPayload(data: CreateProjectDto): CreateProjectDto {
  const deliveryDate =
    toIsoOrNull(data.estimatedDeliveryDate) || defaultDeliveryDate();

  return {
    userId: data.userId,
    pricingPlanId: data.pricingPlanId,
    projectCode: data.projectCode?.trim() || generateProjectCode(),
    title: data.title.trim(),
    description: data.description.trim(),
    status: Number(data.status),
    progress: clampProgress(data.progress),
    price: toMoney(data.price),
    paidAmount: toMoney(data.paidAmount),
    estimatedDeliveryDate: deliveryDate,
    startDate: toIsoOrNull(data.startDate) || defaultStartDate(),
    endDate: toIsoOrNull(data.endDate) || deliveryDate,
    adminNote: data.adminNote?.trim() || '',
    customerComment: data.customerComment?.trim() || '',
  };
}

function sanitizeUpdateProjectPayload(data: UpdateProjectDto): UpdateProjectDto {
  const deliveryDate =
    toIsoOrNull(data.estimatedDeliveryDate) || defaultDeliveryDate();

  return {
    userId: data.userId,
    pricingPlanId: data.pricingPlanId,
    projectCode: data.projectCode?.trim() || generateProjectCode(),
    title: data.title.trim(),
    description: data.description.trim(),
    status: Number(data.status),
    progress: clampProgress(data.progress),
    price: toMoney(data.price),
    paidAmount: toMoney(data.paidAmount),
    estimatedDeliveryDate: deliveryDate,
    startDate: toIsoOrNull(data.startDate) || defaultStartDate(),
    endDate: toIsoOrNull(data.endDate) || deliveryDate,
    adminNote: data.adminNote?.trim() || '',
    customerComment: data.customerComment?.trim() || '',
  };
}

class AdminProjectsService {
  private readonly endpoint = '/admin/projects';

  async getAll(): Promise<Project[]> {
    const response = await api.get(this.endpoint);
    return normalizeArray<Project>(response.data);
  }

  async getById(id: string): Promise<Project | null> {
    const response = await api.get(`${this.endpoint}/${id}`);
    return normalizeObject<Project>(response.data);
  }

  async create(data: CreateProjectDto): Promise<Project | null> {
    const payload = sanitizeCreateProjectPayload(data);

    console.log('Admin project create payload:', payload);

    const response = await api.post(this.endpoint, payload);
    return normalizeObject<Project>(response.data);
  }

  async update(id: string, data: UpdateProjectDto): Promise<Project | null> {
    const payload = sanitizeUpdateProjectPayload(data);

    const response = await api.put(`${this.endpoint}/${id}`, payload);
    return normalizeObject<Project>(response.data);
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.endpoint}/${id}`);
  }

  async updateStatus(
    id: string,
    data: UpdateProjectStatusDto
  ): Promise<Project | null> {
    const payload: UpdateProjectStatusDto = {
      status: Number(data.status),
      progress: clampProgress(data.progress),
      adminNote: data.adminNote?.trim() || '',
    };

    const response = await api.patch(`${this.endpoint}/${id}/status`, payload);
    return normalizeObject<Project>(response.data);
  }
}

export const adminProjectsService = new AdminProjectsService();
export default adminProjectsService;