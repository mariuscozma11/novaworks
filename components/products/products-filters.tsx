'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CategoryFilter } from './category-filter';
import { PriceRangeFilter } from './price-range-filter';
import { StockFilter } from './stock-filter';
import type { Locale } from '@/lib/i18n';

interface Category {
  id: string;
  nameEn: string;
  nameRo: string;
  slug: string;
}

interface ProductsFiltersProps {
  categories: Category[];
  categoryId: string;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  inStock: boolean;
  onCategoryChange: (categoryId: string) => void;
  onMinPriceChange: (value: number | undefined) => void;
  onMaxPriceChange: (value: number | undefined) => void;
  onInStockChange: (checked: boolean) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  lang: Locale;
  dict: {
    filters: string;
    category: string;
    allCategories: string;
    priceRange: string;
    minPrice: string;
    maxPrice: string;
    stockStatus: string;
    inStockOnly: string;
    clearFilters: string;
  };
}

export function ProductsFilters({
  categories,
  categoryId,
  minPrice,
  maxPrice,
  inStock,
  onCategoryChange,
  onMinPriceChange,
  onMaxPriceChange,
  onInStockChange,
  onClearFilters,
  hasActiveFilters,
  lang,
  dict,
}: ProductsFiltersProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{dict.filters}</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 px-2 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            {dict.clearFilters}
          </Button>
        )}
      </div>

      <Separator />

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        value={categoryId}
        onChange={onCategoryChange}
        lang={lang}
        dict={{
          category: dict.category,
          allCategories: dict.allCategories,
        }}
      />

      <Separator />

      {/* Price Range Filter */}
      <PriceRangeFilter
        minPrice={minPrice}
        maxPrice={maxPrice}
        onMinPriceChange={onMinPriceChange}
        onMaxPriceChange={onMaxPriceChange}
        dict={{
          priceRange: dict.priceRange,
          minPrice: dict.minPrice,
          maxPrice: dict.maxPrice,
        }}
      />

      <Separator />

      {/* Stock Filter */}
      <StockFilter
        value={inStock}
        onChange={onInStockChange}
        dict={{
          stockStatus: dict.stockStatus,
          inStockOnly: dict.inStockOnly,
        }}
      />
    </div>
  );
}
