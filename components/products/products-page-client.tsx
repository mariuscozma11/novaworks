'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useQueryState, parseAsString, parseAsInteger, parseAsBoolean } from 'nuqs';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ProductsSearch } from './products-search';
import { ProductsFilters } from './products-filters';
import { ProductsToolbar } from './products-toolbar';
import { ProductsGrid } from './products-grid';
import { Pagination } from './pagination';
import { EmptyState } from './empty-state';
import { ProductsSkeleton } from './products-skeleton';
import { ApiClient } from '@/lib/api';
import type { Locale } from '@/lib/i18n';
import type { SortByOption } from '@/lib/types/product-filters';

interface Category {
  id: string;
  nameEn: string;
  nameRo: string;
  slug: string;
}

interface ProductsPageClientProps {
  categories: Category[];
  lang: Locale;
  dict: any; // TODO: Type this properly
}

const ITEMS_PER_PAGE = 20;

export function ProductsPageClient({
  categories,
  lang,
  dict,
}: ProductsPageClientProps) {
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  // URL state management with nuqs
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));
  const [categoryId, setCategoryId] = useQueryState('categoryId', parseAsString.withDefault(''));
  const [minPrice, setMinPrice] = useQueryState('minPrice', parseAsInteger);
  const [maxPrice, setMaxPrice] = useQueryState('maxPrice', parseAsInteger);
  const [inStock, setInStock] = useQueryState('inStock', parseAsBoolean.withDefault(false));
  const [sortValue, setSortValue] = useQueryState('sort', parseAsString.withDefault('createdAt-DESC'));
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  // Parse sort value
  const [sortBy, sortOrder] = sortValue.split('-') as [SortByOption, 'ASC' | 'DESC'];

  // Calculate offset for pagination
  const offset = (page - 1) * ITEMS_PER_PAGE;

  // Fetch products with React Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', search, categoryId, minPrice, maxPrice, inStock, sortBy, sortOrder, offset],
    queryFn: () => ApiClient.searchProducts({
      search: search || undefined,
      categoryId: categoryId || undefined,
      minPrice: minPrice ?? undefined,
      maxPrice: maxPrice ?? undefined,
      inStock: inStock || undefined,
      sortBy,
      sortOrder,
      limit: ITEMS_PER_PAGE,
      offset,
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (categoryId && categoryId !== 'all') count++;
    if (minPrice !== null) count++;
    if (maxPrice !== null) count++;
    if (inStock) count++;
    return count;
  }, [categoryId, minPrice, maxPrice, inStock]);

  const hasActiveFilters = activeFilterCount > 0 || search !== '';

  // Calculate total pages
  const totalPages = data ? Math.ceil(data.total / ITEMS_PER_PAGE) : 1;

  // Handlers
  const handleCategoryChange = (value: string) => {
    setCategoryId(value === 'all' ? '' : value);
    setPage(1); // Reset to first page when filter changes
  };

  const handleMinPriceChange = (value: number | undefined) => {
    setMinPrice(value ?? null);
    setPage(1);
  };

  const handleMaxPriceChange = (value: number | undefined) => {
    setMaxPrice(value ?? null);
    setPage(1);
  };

  const handleInStockChange = (checked: boolean) => {
    setInStock(checked || null);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value || null);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortValue(value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setCategoryId(null);
    setMinPrice(null);
    setMaxPrice(null);
    setInStock(null);
    setSearch(null);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title & Search */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">{dict.pageTitle}</h1>
          <ProductsSearch
            value={search}
            onChange={handleSearchChange}
            placeholder={dict.searchPlaceholder}
          />
        </div>

        {/* Main Layout */}
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <ProductsFilters
                categories={categories}
                categoryId={categoryId}
                minPrice={minPrice ?? undefined}
                maxPrice={maxPrice ?? undefined}
                inStock={inStock}
                onCategoryChange={handleCategoryChange}
                onMinPriceChange={handleMinPriceChange}
                onMaxPriceChange={handleMaxPriceChange}
                onInStockChange={handleInStockChange}
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
                lang={lang}
                dict={dict}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <ProductsToolbar
              total={data?.total ?? 0}
              sortValue={sortValue}
              onSortChange={handleSortChange}
              onOpenFilters={() => setFilterSheetOpen(true)}
              activeFilterCount={activeFilterCount}
              dict={dict}
            />

            {/* Products Grid or Loading/Empty State */}
            {isLoading ? (
              <ProductsSkeleton count={ITEMS_PER_PAGE} />
            ) : isError ? (
              <div className="text-center py-12 text-destructive">
                Error loading products. Please try again.
              </div>
            ) : data && data.products.length > 0 ? (
              <>
                <ProductsGrid
                  products={data.products}
                  lang={lang}
                  dict={dict}
                />
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  dict={dict}
                />
              </>
            ) : (
              <EmptyState dict={dict} />
            )}
          </div>
        </div>

        {/* Mobile Filter Sheet */}
        <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
            <SheetHeader className="pl-6">
              <SheetTitle>{dict.filters}</SheetTitle>
            </SheetHeader>
            <div className="mt-6 pl-6">
              <ProductsFilters
                categories={categories}
                categoryId={categoryId}
                minPrice={minPrice ?? undefined}
                maxPrice={maxPrice ?? undefined}
                inStock={inStock}
                onCategoryChange={handleCategoryChange}
                onMinPriceChange={handleMinPriceChange}
                onMaxPriceChange={handleMaxPriceChange}
                onInStockChange={handleInStockChange}
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
                lang={lang}
                dict={dict}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
