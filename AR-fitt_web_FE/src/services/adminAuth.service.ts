import axios, { AxiosInstance } from 'axios';

interface AdminLoginResponse {
  status: string;
  message: string;
  data: {
    admin: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
    auth: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
      tokenType: string;
      isAdminToken: boolean;
    };
  };
  isAdminAuth: boolean;
}

interface AdminVerifyResponse {
  status: string;
  message: string;
  data: {
    admin: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
  };
  isAdminAuth: boolean;
}

class AdminAuthService {
  private baseURL: string;
  private adminAxios: AxiosInstance;
  private adminTokenKey = 'admin-access-token';
  private adminRefreshTokenKey = 'admin-refresh-token';
  private adminUserKey = 'admin-user-data';

  constructor() {
    this.baseURL = process.env.REACT_APP_NODE_BACKEND_BASE_URL || '';
    
    // Create a separate axios instance for admin operations
    this.adminAxios = axios.create({
      baseURL: this.baseURL,
    });

    // Set up interceptors for admin authentication
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add admin token
    this.adminAxios.interceptors.request.use(
      (config) => {
        const token = this.getAdminToken();
        if (token) {
          // Use admin-specific header
          config.headers['x-admin-auth-token'] = `Bearer ${token}`;
          config.headers['admin-authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    this.adminAxios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = this.getAdminRefreshToken();
            if (refreshToken) {
              const newTokens = await this.refreshAdminToken(refreshToken);
              if (newTokens) {
                originalRequest.headers['x-admin-auth-token'] = `Bearer ${newTokens.accessToken}`;
                originalRequest.headers['admin-authorization'] = `Bearer ${newTokens.accessToken}`;
                return this.adminAxios(originalRequest);
              }
            }
          } catch (refreshError) {
            this.clearAdminAuth();
            window.location.href = '/admin/login';
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Admin Login
  async login(email: string, password: string): Promise<AdminLoginResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/admin/auth/login`, {
        email,
        password
      });


      if (response.data.status === 'success' && response.data.data) {
        const { admin, auth } = response.data.data;
        
        // Store admin tokens separately from user tokens
        this.setAdminToken(auth.accessToken);
        this.setAdminRefreshToken(auth.refreshToken);
        this.setAdminUser(admin);

        return response.data;
      }

      // If we get here, the response structure is unexpected
      console.error('Unexpected response structure:', response.data);
      throw new Error(response.data.message || 'Invalid admin credentials');
    } catch (error: any) {
      console.error('Admin login error:', error);
      throw error;
    }
  }

  // Admin Logout
  async logout(): Promise<void> {
    try {
      await this.adminAxios.post('/admin/auth/logout');
    } catch (error) {
      console.error('Admin logout error:', error);
    } finally {
      this.clearAdminAuth();
    }
  }

  // Verify Admin Token
  async verifyAdminToken(): Promise<boolean> {
    try {
      const response = await this.adminAxios.get('/admin/auth/verify');
      return response.data.status === 'success';
    } catch (error) {
      console.error('Admin token verification failed:', error);
      return false;
    }
  }

  // Refresh Admin Token
  async refreshAdminToken(refreshToken: string): Promise<any> {
    try {
      const response = await axios.post(`${this.baseURL}/admin/auth/refresh`, {}, {
        headers: {
          'x-admin-refresh-token': refreshToken
        }
      });

      if (response.data.status === 'success' && response.data.data) {
        const { auth } = response.data.data;
        this.setAdminToken(auth.accessToken);
        this.setAdminRefreshToken(auth.refreshToken);
        return auth;
      }

      return null;
    } catch (error) {
      console.error('Admin token refresh failed:', error);
      return null;
    }
  }

  // Token Management
  setAdminToken(token: string) {
    localStorage.setItem(this.adminTokenKey, token);
  }

  getAdminToken(): string | null {
    return localStorage.getItem(this.adminTokenKey);
  }

  setAdminRefreshToken(token: string) {
    localStorage.setItem(this.adminRefreshTokenKey, token);
  }

  getAdminRefreshToken(): string | null {
    return localStorage.getItem(this.adminRefreshTokenKey);
  }

  setAdminUser(user: any) {
    localStorage.setItem(this.adminUserKey, JSON.stringify(user));
  }

  getAdminUser(): any {
    const userStr = localStorage.getItem(this.adminUserKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  clearAdminAuth() {
    localStorage.removeItem(this.adminTokenKey);
    localStorage.removeItem(this.adminRefreshTokenKey);
    localStorage.removeItem(this.adminUserKey);
    
    // Also remove old admin token keys for backwards compatibility
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  }

  isAdminAuthenticated(): boolean {
    return !!this.getAdminToken();
  }

  // Get admin axios instance for use in other services
  getAdminAxios(): AxiosInstance {
    return this.adminAxios;
  }
}

export const adminAuthService = new AdminAuthService();
export default adminAuthService;
