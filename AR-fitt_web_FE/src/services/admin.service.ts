import HTTPService from './base.service';
import adminAuthService from './adminAuth.service';
import { AppRelease } from './appRelease.service';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
  dob: string;
  isVerified: boolean;
  isSubscribed: boolean;
  isBodyScanned: boolean;
  isFaceScanned: boolean;
  role: string;
  createdAt: string;
  modifiedAt: string;
}

export interface AdminProduct {
  id: string;
  category_id: string;
  name: string;
  brand: string;
  price: string;
  currency: string;
  description?: string;
  lens_id?: string;
  gender?: string | null;
  category?: {
    id: string;
    name: string;
    description?: string;
    type: string;
  };
  colors?: Array<{
    id: string;
    color: string;
    color_hex: string;
  }>;
  sizes?: Array<{
    id: string;
    size: string;
  }>;
  images?: Array<{
    id: string;
    image: string;
  }>;
  imageUrls?: Array<{
    id: string;
    image_url: string;
  }>;
}

export interface AdminCategory {
  id: string;
  name: string;
  description?: string;
  type: string;
  createdAt: string;
  modifiedAt: string;
}

export interface CreateProductData {
  categoryId: string;
  name: string;
  brand: string;
  price: string;
  currency: string;
  description?: string;
  lensId?: string;
  gender?: string | null;
  colors?: Array<{
    color: string;
    colorHex: string;
  }>;
  sizes?: string[];
  imageUrls?: string[];
}

export interface UpdateProductData extends CreateProductData {}

export interface CreateCategoryData {
  name: string;
  description?: string;
  type: string;
}

export interface UpdateCategoryData extends CreateCategoryData {}

export interface UpdateUserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  role: string;
}

class AdminService {
  private baseURL = process.env.REACT_APP_NODE_BACKEND_BASE_URL;
  private adminAxios = adminAuthService.getAdminAxios();

  async getAppRelease(): Promise<AppRelease | null> {
    const response = await this.adminAxios.get('/admin/app-release');
    return response.data.data;
  }

  async uploadApk(file: File, version: string, onProgress: (progress: number) => void): Promise<AppRelease> {
    const data = new FormData();
    data.append('apk', file);
    data.append('version', version);
    const response = await this.adminAxios.post('/admin/app-release', data, {
      onUploadProgress: (event) => {
        onProgress(Math.min(100, Math.round((event.loaded / (event.total || file.size)) * 100)));
      },
    });
    return response.data.data;
  }

  // User Management
  async getUsers(): Promise<AdminUser[]> {
    try {
      const response = await this.adminAxios.get('/admin/users');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<AdminUser> {
    try {
      const response = await this.adminAxios.get(`/admin/users/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async updateUser(id: string, userData: UpdateUserData): Promise<AdminUser> {
    try {
      const response = await this.adminAxios.put(`/admin/users/${id}`, userData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.adminAxios.delete(`/admin/users/${id}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Product Management
  async getProducts(): Promise<AdminProduct[]> {
    try {
      const response = await this.adminAxios.get('/admin/products');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProductById(id: string): Promise<AdminProduct> {
    try {
      const response = await this.adminAxios.get(`/admin/products/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  async createProduct(productData: CreateProductData): Promise<AdminProduct> {
    try {
      const response = await this.adminAxios.post('/admin/products', productData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(id: string, productData: UpdateProductData): Promise<AdminProduct> {
    try {
      const response = await this.adminAxios.put(`/admin/products/${id}`, productData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await this.adminAxios.delete(`/admin/products/${id}`);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Category Management
  async getCategories(): Promise<AdminCategory[]> {
    try {
      const response = await this.adminAxios.get('/admin/categories');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async getCategoryById(id: string): Promise<AdminCategory> {
    try {
      const response = await this.adminAxios.get(`/admin/categories/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  }

  async createCategory(categoryData: CreateCategoryData): Promise<AdminCategory> {
    try {
      const response = await this.adminAxios.post('/admin/categories', categoryData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async updateCategory(id: string, categoryData: UpdateCategoryData): Promise<AdminCategory> {
    try {
      const response = await this.adminAxios.put(`/admin/categories/${id}`, categoryData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      await this.adminAxios.delete(`/admin/categories/${id}`);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  // Image Management
  async uploadProductImage(productId: string, imageFile: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await this.adminAxios.post(`/admin/products/${productId}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  async deleteProductImage(productId: string): Promise<void> {
    try {
      await this.adminAxios.delete(`/admin/products/${productId}/image`);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }
}

export const adminService = new AdminService();
