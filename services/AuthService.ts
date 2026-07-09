import { api, getApiErrorMessage } from './api';
import { ApiResponse } from '@/lib/api-utils';
import { setAccessToken, removeAccessToken, setStoredUser, getStoredUser, isAuthenticated } from '@/lib/auth';

export interface LoginRequest {
  emailOrUserName: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  userName: string;
  password: string;
  phoneNumber?: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  userName: string;
  role: number;
  avatar?: string;
  isActive: boolean;
  emailConfirmed: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
  user: AuthUser;
}

class AuthService {
  private endpoint = '/Auth';

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>(`${this.endpoint}/login`, data);
      const responseData = response.data.data;

      if (!responseData) {
        throw new Error('Invalid response from server');
      }

      setAccessToken(responseData.accessToken);

      const storedUser = {
        id: responseData.user.id,
        fullName: responseData.user.fullName,
        email: responseData.user.email,
        userName: responseData.user.userName,
        role: responseData.user.role,
        avatar: responseData.user.avatar,
        isActive: responseData.user.isActive,
      };
      setStoredUser(storedUser);

      return responseData;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>(`${this.endpoint}/register`, data);
      const responseData = response.data.data;

      if (!responseData) {
        throw new Error('Invalid response from server');
      }

      setAccessToken(responseData.accessToken);

      const storedUser = {
        id: responseData.user.id,
        fullName: responseData.user.fullName,
        email: responseData.user.email,
        userName: responseData.user.userName,
        role: responseData.user.role,
        avatar: responseData.user.avatar,
        isActive: responseData.user.isActive,
      };
      setStoredUser(storedUser);

      return responseData;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post(`${this.endpoint}/logout`);
    } catch {
      // ignore
    } finally {
      removeAccessToken();
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
