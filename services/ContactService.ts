import { api, getApiErrorMessage } from './api';
import { ApiResponse } from '@/lib/api-utils';

export interface CreateContactMessageDto {
  fullName: string;
  email: string;
  phoneNumber?: string;
  subject: string;
  message: string;
  company?: string;
}

class ContactService {
  private endpoint = '/contact-messages';

  async sendMessage(data: CreateContactMessageDto): Promise<void> {
    try {
      await api.post<ApiResponse<unknown>>(this.endpoint, data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

export const contactService = new ContactService();
