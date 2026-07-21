import {
  api,
  ensureFreshSession,
  getApiErrorMessage,
  getApiStatus,
  resetCsrfToken,
} from './api';
import { ApiResponse, normalizeObject } from '@/lib/api-utils';
import {
  clearAuthSession,
  getStoredUser,
  isAuthenticated,
  setAuthSession,
  setStoredUser,
} from '@/lib/auth';

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
  accessTokenExpiresAt?: string;
  refreshTokenExpiresAt?: string;
  user: AuthUser;
}

let getMeRequest: Promise<AuthUser> | null = null;

class AuthService {
  private endpoint = '/Auth';

  private parseAuthResponse(value: unknown): AuthResponse {
    const responseData = normalizeObject<AuthResponse>(value);
    if (!responseData?.user?.id) {
      throw new Error('پاسخ احراز هویت سرور نامعتبر است');
    }
    return responseData;
  }

  async login(data: LoginRequest, persistent = false): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>(
        `${this.endpoint}/login`,
        { ...data, rememberMe: persistent }
      );
      const responseData = this.parseAuthResponse(response.data);
      resetCsrfToken();
      setAuthSession(
        responseData.user,
        persistent,
        responseData.accessTokenExpiresAt
      );
      return responseData;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>(`${this.endpoint}/register`, data);
      const responseData = this.parseAuthResponse(response.data);
      resetCsrfToken();
      setAuthSession(
        responseData.user,
        false,
        responseData.accessTokenExpiresAt
      );
      return responseData;
    } catch (error) {
      if (getApiStatus(error) === 409) {
        throw new Error('این ایمیل یا نام کاربری قبلاً ثبت شده است؛ وارد حساب خود شوید یا اطلاعات دیگری انتخاب کنید');
      }
      throw new Error(getApiErrorMessage(error));
    }
  }

  async logout(): Promise<void> {
    resetCsrfToken();
    try {
      await api.post(`${this.endpoint}/logout`);
    } catch {
      // Local state is still cleared if the server is unavailable.
    } finally {
      clearAuthSession();
      resetCsrfToken();
    }
  }

  async getMe(): Promise<AuthUser> {
    if (!getMeRequest) {
      getMeRequest = (async () => {
        try {
          await ensureFreshSession();
          const response = await api.get<ApiResponse<AuthUser>>(`${this.endpoint}/me`);
          const user = normalizeObject<AuthUser>(response.data);
          if (!user?.id) throw new Error('پاسخ اطلاعات کاربر نامعتبر است');
          setStoredUser(user);
          return user;
        } catch (error) {
          throw new Error(getApiErrorMessage(error));
        }
      })().finally(() => {
        getMeRequest = null;
      });
    }

    return getMeRequest;
  }

  checkAuth(): boolean {
    return isAuthenticated();
  }

  getCurrentUserFromStorage<T>(): T | null {
    return getStoredUser<T>();
  }
}

export const authService = new AuthService();
