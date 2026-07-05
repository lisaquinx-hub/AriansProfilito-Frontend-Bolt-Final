import { api } from './api';

export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  ticketId?: string;
}

class ContactService {
  private endpoint = '/contact';

  async sendMessage(data: ContactRequest): Promise<ContactResponse> {
    const response = await api.post<ContactResponse>(this.endpoint, data);
    return response.data;
  }

  async subscribeNewsletter(email: string): Promise<ContactResponse> {
    const response = await api.post<ContactResponse>(`${this.endpoint}/newsletter`, { email });
    return response.data;
  }
}

export const contactService = new ContactService();
