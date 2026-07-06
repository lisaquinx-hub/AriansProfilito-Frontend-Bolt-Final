import { api } from './api';
import { Project, projects as mockProjects, getProjectBySlug, getProjectsByCategory, getFeaturedProjects } from '@/lib/mock-data';

export interface ProjectListResponse {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
}

export type SortOption = 'newest' | 'oldest' | 'featured';

class PortfolioService {
  private endpoint = '/portfolio';

  async getProjects(
    page: number = 1,
    limit: number = 10,
    category?: string,
    sort: SortOption = 'featured'
  ): Promise<ProjectListResponse> {
    // TODO: Replace with actual API call
    let filtered = category && category !== 'all'
      ? getProjectsByCategory(category)
      : mockProjects;

    // Sort
    if (sort === 'newest') {
      filtered = [...filtered].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    } else if (sort === 'oldest') {
      filtered = [...filtered].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    } else if (sort === 'featured') {
      filtered = [...filtered].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);
    return {
      projects: paginated,
      total: filtered.length,
      page,
      limit,
    };
  }

  async getProject(slug: string): Promise<Project | undefined> {
    return getProjectBySlug(slug);
  }

  async getFeatured(): Promise<Project[]> {
    return getFeaturedProjects();
  }

  async searchProjects(query: string): Promise<Project[]> {
    const q = query.toLowerCase();
    return mockProjects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }
}

export const portfolioService = new PortfolioService();
