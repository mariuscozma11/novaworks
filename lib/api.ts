const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export class ApiClient {
  private static getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Handle 401 Unauthorized - clear token and redirect to login
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          window.location.href = '/auth/login';
        }
      }

      const error = await response.json().catch(() => ({
        message: 'An error occurred',
        statusCode: response.status,
      }));
      throw error;
    }

    // Handle empty responses (204 No Content, DELETE requests, etc.)
    const contentType = response.headers.get('content-type');
    if (
      response.status === 204 ||
      !contentType ||
      !contentType.includes('application/json')
    ) {
      return {} as T;
    }

    // Check if response body is empty
    const text = await response.text();
    if (!text || text.trim() === '') {
      return {} as T;
    }

    return JSON.parse(text);
  }

  // Auth endpoints
  static async login(email: string, password: string) {
    return this.request<{ access_token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    return this.request<{ access_token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async getProfile() {
    return this.request<any>('/auth/profile');
  }

  // Categories endpoints
  static async getCategories() {
    return this.request<any[]>('/categories');
  }

  static async getCategory(id: string) {
    return this.request<any>(`/categories/${id}`);
  }

  static async createCategory(data: {
    nameEn: string;
    nameRo: string;
    slug: string;
    descriptionEn?: string;
    descriptionRo?: string;
    imageUrl?: string;
  }) {
    return this.request<any>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateCategory(
    id: string,
    data: {
      nameEn?: string;
      nameRo?: string;
      slug?: string;
      descriptionEn?: string;
      descriptionRo?: string;
      imageUrl?: string;
    }
  ) {
    return this.request<any>(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  static async deleteCategory(id: string) {
    return this.request<void>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Products endpoints
  static async getProducts() {
    return this.request<any[]>('/products');
  }

  static async searchProducts(filters: {
    search?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sortBy?: 'price' | 'createdAt' | 'nameEn' | 'stock';
    sortOrder?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
  }) {
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.minPrice != null) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice != null) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.inStock != null) params.append('inStock', filters.inStock.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.limit != null) params.append('limit', filters.limit.toString());
    if (filters.offset != null) params.append('offset', filters.offset.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/products/search?${queryString}` : '/products/search';

    return this.request<{
      products: any[];
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    }>(endpoint);
  }

  static async getProduct(slug: string) {
    return this.request<any>(`/products/${slug}`);
  }

  static async createProduct(data: {
    nameEn: string;
    nameRo: string;
    slug: string;
    descriptionEn: string;
    descriptionRo: string;
    price: number;
    stock?: number;
    categoryId: string;
    images?: { url: string; order?: number }[];
  }) {
    return this.request<any>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateProduct(
    slug: string,
    data: {
      nameEn?: string;
      nameRo?: string;
      slug?: string;
      descriptionEn?: string;
      descriptionRo?: string;
      price?: number;
      stock?: number;
      categoryId?: string;
      images?: { url: string; order?: number }[];
    }
  ) {
    return this.request<any>(`/products/${slug}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  static async deleteProduct(slug: string) {
    return this.request<void>(`/products/${slug}`, {
      method: 'DELETE',
    });
  }

  // Upload endpoints
  static async uploadCategoryImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const token = this.getAuthToken();
    const response = await fetch(`${API_URL}/upload/category-image`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Upload failed',
        statusCode: response.status,
      }));
      throw error;
    }

    return response.json();
  }

  static async uploadProductImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const token = this.getAuthToken();
    const response = await fetch(`${API_URL}/upload/product-image`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Upload failed',
        statusCode: response.status,
      }));
      throw error;
    }

    return response.json();
  }

  static async uploadProductImages(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const token = this.getAuthToken();
    const response = await fetch(`${API_URL}/upload/product-images`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      // Handle 401 Unauthorized - clear token and redirect to login
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          window.location.href = '/auth/login';
        }
      }

      const error = await response.json().catch(() => ({
        message: 'Upload failed',
        statusCode: response.status,
      }));
      throw error;
    }

    return response.json();
  }
}
