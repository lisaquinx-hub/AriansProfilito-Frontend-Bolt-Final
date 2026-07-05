import { api } from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  created_at: string;
}

class AuthService {
  private endpoint = '/auth';

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(`${this.endpoint}/login`, data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(`${this.endpoint}/register`, data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  }

  async logout(): Promise<void> {
    await api.post(`${this.endpoint}/logout`);
    localStorage.removeItem('token');
  }

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>(`${this.endpoint}/me`);
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put<User>(`${this.endpoint}/profile`, data);
    return response.data;
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await api.put(`${this.endpoint}/password`, { oldPassword, newPassword });
  }

  async requestPasswordReset(email: string): Promise<void> {
    await api.post(`${this.endpoint}/forgot-password`, { email });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post(`${this.endpoint}/reset-password`, { token, password });
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  }
}

export const authService = new AuthService();
