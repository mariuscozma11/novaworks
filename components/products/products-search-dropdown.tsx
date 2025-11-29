'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { Search, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProductSearchCard } from './product-search-card';
import { ProductSearchCardSkeleton } from './product-search-card-skeleton';
import { ApiClient } from '@/lib/api';
import type { Locale } from '@/lib/i18n';

interface ProductsSearchDropdownProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  lang: Locale;
  noResultsTitle?: string;
  noResultsHint?: string;
}

export function ProductsSearchDropdown({
  value,
  onChange,
  placeholder,
  lang,
  noResultsTitle = 'No products match your search',
  noResultsHint = 'Try different keywords or check spelling',
}: ProductsSearchDropdownProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(value);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounced search for live results
  const debouncedSetSearch = useDebouncedCallback((val: string) => {
    setDebouncedSearch(val);
  }, 300);

  // Fetch search results with React Query
  const { data, isLoading } = useQuery({
    queryKey: ['products-search-dropdown', debouncedSearch],
    queryFn: () => ApiClient.searchProducts({
      search: debouncedSearch,
      limit: 8,
      offset: 0,
    }),
    enabled: debouncedSearch.trim().length > 0,
    staleTime: 2 * 60 * 1000,
  });

  const handleInputChange = (val: string) => {
    setSearchValue(val);
    debouncedSetSearch(val);
    onChange(val);

    // Open popover if there's text
    if (val.trim().length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleClear = () => {
    setSearchValue('');
    setDebouncedSearch('');
    onChange('');
    setOpen(false);
  };

  const handleProductClick = () => {
    setOpen(false);
  };

  const showResults = debouncedSearch.trim().length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => {
              if (searchValue.trim().length > 0) {
                setOpen(true);
              }
            }}
            className="pl-9 pr-9"
          />
          {searchValue && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {showResults && (
          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="p-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <ProductSearchCardSkeleton key={index} />
                ))}
              </div>
            ) : data && data.products.length > 0 ? (
              <div className="p-2">
                {data.products.map((product) => (
                  <ProductSearchCard
                    key={product.id}
                    product={product}
                    lang={lang}
                    onClick={handleProductClick}
                  />
                ))}
                {data.total > 8 && (
                  <div className="text-center py-2 text-sm text-muted-foreground">
                    +{data.total - 8} more results - scroll down to see all
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground px-4">
                <p className="text-sm">{noResultsTitle}</p>
                <p className="text-xs mt-1">{noResultsHint}</p>
              </div>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
