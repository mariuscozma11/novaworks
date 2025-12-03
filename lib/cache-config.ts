/**
 * Browser caching configuration
 *
 * This module provides utilities for configuring browser-side caching
 * to minimize redundant requests to the API.
 */

export const CACHE_DURATIONS = {
  // 1 day for product data and images
  PRODUCTS: 86400, // 24 hours in seconds
  CATEGORIES: 86400, // 24 hours in seconds
  // Shorter cache for dynamic content
  SEARCH: 3600, // 1 hour in seconds
} as const;

/**
 * Creates fetch options with browser caching enabled
 *
 * @param duration - Cache duration in seconds
 * @returns Fetch options with Cache-Control headers
 */
export function createCachedFetchOptions(duration: number): RequestInit {
  return {
    headers: {
      'Cache-Control': `public, max-age=${duration}, stale-while-revalidate=${duration * 2}`,
    },
    // Use browser cache, don't bypass it
    cache: 'force-cache' as RequestCache,
  };
}

/**
 * Creates a cached fetch wrapper for API calls
 *
 * @param url - The URL to fetch
 * @param duration - Cache duration in seconds
 * @param options - Additional fetch options
 * @returns Promise with the response
 */
export async function cachedFetch(
  url: string,
  duration: number = CACHE_DURATIONS.PRODUCTS,
  options?: RequestInit
): Promise<Response> {
  const cacheOptions = createCachedFetchOptions(duration);

  return fetch(url, {
    ...cacheOptions,
    ...options,
    headers: {
      ...cacheOptions.headers,
      ...options?.headers,
    },
  });
}
