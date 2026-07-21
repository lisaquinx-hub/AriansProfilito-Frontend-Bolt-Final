import { ApiResponse, normalizeObject } from '@/lib/api-utils';
import { AnalyticsDashboard } from '@/types/api';
import { api } from '@/services/api';

class AdminAnalyticsService {
  private readonly endpoint = '/admin/analytics';

  async getDashboard(days = 30): Promise<AnalyticsDashboard> {
    const response = await api.get<ApiResponse<AnalyticsDashboard>>(this.endpoint, {
      params: { days },
    });
    const dashboard = normalizeObject<AnalyticsDashboard>(response.data);
    if (!dashboard) {
      throw new Error('پاسخ آمار سایت معتبر نیست');
    }
    return dashboard;
  }
}

export const adminAnalyticsService = new AdminAnalyticsService();
