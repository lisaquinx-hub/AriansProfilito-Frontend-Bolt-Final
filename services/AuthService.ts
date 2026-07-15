import { api, getApiErrorMessage } from './api';
import { ApiResponse, normalizeObject } from '@/lib/api-utils';
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

  private parseAuthResponse(value: unknown): AuthResponse {
    const responseData = normalizeObject<AuthResponse>(value);
    if (!responseData?.accessToken || !responseData.user) {
      throw new Error('پاسخ احراز هویت سرور نامعتبر است');
    }
    return responseData;
  }

  private storeAuth(responseData: AuthResponse, persistent: boolean): void {
    setAccessToken(responseData.accessToken, persistent);
    setStoredUser({
      id: responseData.user.id,
      fullName: responseData.user.fullName,
      email: responseData.user.email,
      userName: responseData.user.userName,
      role: responseData.user.role,
      avatar: responseData.user.avatar,
      isActive: responseData.user.isActive,
    });
  }

  async login(data: LoginRequest, persistent = false): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>(`${this.endpoint}/login`, data);
      const responseData = this.parseAuthResponse(response.data);
      this.storeAuth(responseData, persistent);
      return responseData;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>(`${this.endpoint}/register`, data);
      const responseData = this.parseAuthResponse(response.data);
      this.storeAuth(responseData, false);
      return responseData;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async logout(): Promise<void> {
    // Swagger does not expose a logout endpoint; ending the local bearer session is sufficient.
    removeAccessToken();
  }

  async getMe(): Promise<AuthUser> {
    try {
      const response = await api.get<ApiResponse<AuthUser>>(`${this.endpoint}/me`);
      const user = normalizeObject<AuthUser>(response.data);
      if (!user) throw new Error('پاسخ اطلاعات کاربر نامعتبر است');
      setStoredUser(user);
      return user;
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
