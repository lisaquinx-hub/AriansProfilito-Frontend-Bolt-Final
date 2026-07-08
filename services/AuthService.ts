import { api, ApiResponse, getApiErrorMessage } from './api';
import { setAccessToken, removeAccessToken, setStoredUser, getStoredUser, isAuthenticated } from '@/lib/auth';

export interface LoginRequest {
  emailOrUserName: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  userName?: string;
  avatar?: string;
  createdAt?: string;
}

export interface LoginResponseData {
  token: string;
  user?: AuthUser;
  accessToken?: string;
}

export interface RegisterResponseData {
  userId?: string;
  message?: string;
}

export interface CurrentUserData {
  id: string;
  name: string;
  email: string;
  userName?: string;
  avatar?: string;
}

class AuthService {
  private endpoint = '/Auth';

  async login(data: LoginRequest): Promise<LoginResponseData> {
    try {
      const response = await api.post<ApiResponse<LoginResponseData>>(`${this.endpoint}/login`, data);

      const responseData = response.data.data;

      if (!responseData) {
        throw new Error('Invalid response from server');
      }

      if (responseData.token) {
        setAccessToken(responseData.token);
      } else if (responseData.accessToken) {
        setAccessToken(responseData.accessToken);
      }

      if (responseData.user) {
        setStoredUser(responseData.user);
      }

      return responseData;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async register(data: RegisterRequest): Promise<RegisterResponseData> {
    try {
      const response = await api.post<ApiResponse<RegisterResponseData>>(`${this.endpoint}/register`, data);
      return response.data.data || {};
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post(`${this.endpoint}/logout`);
    } catch {
      // Ignore logout API errors
    } finally {
      removeAccessToken();
    }
  }

  async getCurrentUser(): Promise<CurrentUserData> {
    try {
      const response = await api.get<ApiResponse<CurrentUserData>>(`${this.endpoint}/me`);
      return response.data.data!;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async updateProfile(data: Partial<CurrentUserData>): Promise<CurrentUserData> {
    try {
      const response = await api.put<ApiResponse<CurrentUserData>>(`${this.endpoint}/profile`, data);
      return response.data.data!;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      await api.put(`${this.endpoint}/password`, { oldPassword, newPassword });
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  checkAuth(): boolean {
    return isAuthenticated();
  }

  getCurrentUserFromStorage<T>(): T | null {
    return getStoredUser<T>();
  }
}

export const authService = new AuthService();
