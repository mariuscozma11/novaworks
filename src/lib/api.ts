// API utility functions for fetching data from Payload CMS

export interface PayloadImage {
  id: string
  alt?: string
  updatedAt: string
  createdAt: string
  url: string
  thumbnailURL?: string | null
  filename: string
  mimeType: string
  filesize: number
  width: number
  height: number
  focalX: number
  focalY: number
}

export interface ProductImage {
  id: string
  image: PayloadImage
  alt?: string | null
}

export interface ProductSpecifications {
  material?: string
  dimensions?: string
  weight?: string
  printTime?: string
  infill?: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string | null
  isActive: boolean
  sortOrder: number
  updatedAt: string
  createdAt: string
}

export interface Product {
  id: number
  name: string
  slug: string
  description?: string | null
  shortDescription?: string | null
  category: Category
  price: number
  images: ProductImage[]
  specifications: ProductSpecifications
  customizable: boolean
  customizationOptions?: string | null
  inStock: boolean
  stockQuantity?: number | null
  isActive: boolean
  featured: boolean
  tags: any[]
  updatedAt: string
  createdAt: string
}

export interface ProductsResponse {
  docs: Product[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage?: number | null
  nextPage?: number | null
}

export interface CategoriesResponse {
  docs: Category[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage?: number | null
  nextPage?: number | null
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

export async function fetchProducts(params?: {
  limit?: number
  page?: number
  where?: any
}): Promise<ProductsResponse> {
  try {
    const searchParams = new URLSearchParams()

    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.where) searchParams.set('where', JSON.stringify(params.where))

    const url = `${API_BASE_URL}/api/products${searchParams.toString() ? `?${searchParams}` : ''}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await fetchProducts({
      limit: 1,
      where: {
        slug: { equals: slug }
      }
    })

    return response.docs[0] || null
  } catch (error) {
    console.error('Error fetching product by slug:', error)
    throw error
  }
}

export async function fetchFeaturedProducts(limit = 8): Promise<Product[]> {
  try {
    const response = await fetchProducts({
      limit,
      where: {
        featured: { equals: true },
        isActive: { equals: true }
      }
    })

    return response.docs
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
}

export async function fetchCategories(params?: {
  limit?: number
  page?: number
}): Promise<CategoriesResponse> {
  try {
    const searchParams = new URLSearchParams()

    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.page) searchParams.set('page', params.page.toString())

    // Only fetch active categories
    searchParams.set('where', JSON.stringify({
      isActive: { equals: true }
    }))

    const url = `${API_BASE_URL}/api/categories?${searchParams}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

export async function fetchProductsByCategory(categorySlug: string, params?: {
  limit?: number
  page?: number
}): Promise<ProductsResponse> {
  try {
    return await fetchProducts({
      ...params,
      where: {
        'category.slug': { equals: categorySlug },
        isActive: { equals: true }
      }
    })
  } catch (error) {
    console.error('Error fetching products by category:', error)
    throw error
  }
}