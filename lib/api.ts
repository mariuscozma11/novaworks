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
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'An error occurred',
        statusCode: response.status,
      }));
      throw error;
    }

    return response.json();
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
    name: string;
    slug: string;
    description?: string;
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
      name?: string;
      slug?: string;
      description?: string;
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

  static async getProduct(id: string) {
    return this.request<any>(`/products/${id}`);
  }

  static async createProduct(data: {
    name: string;
    slug: string;
    description: string;
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
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string;
      price?: number;
      stock?: number;
      categoryId?: string;
      images?: { url: string; order?: number }[];
    }
  ) {
    return this.request<any>(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  static async deleteProduct(id: string) {
    return this.request<void>(`/products/${id}`, {
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
      const error = await response.json().catch(() => ({
        message: 'Upload failed',
        statusCode: response.status,
      }));
      throw error;
    }

    return response.json();
  }
}
