import { Product } from '../types';

export type SortByOption = 'price' | 'createdAt' | 'nameEn' | 'stock';
export type SortOrder = 'ASC' | 'DESC';

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: SortByOption;
  sortOrder?: SortOrder;
  page?: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface ProductSearchParams {
  search: string;
  categoryId: string;
  minPrice: string;
  maxPrice: string;
  inStock: string;
  sortBy: SortByOption;
  sortOrder: SortOrder;
  page: string;
}
