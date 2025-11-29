'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProductSearchCard } from '@/components/products/product-search-card';
import { ProductSearchCardSkeleton } from '@/components/products/product-search-card-skeleton';
import { ApiClient } from '@/lib/api';
import type { Locale } from '@/lib/i18n';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lang: Locale;
  placeholder?: string;
  title?: string;
  buttonText?: string;
  noResultsTitle?: string;
  noResultsHint?: string;
}

export function SearchDialog({
  open,
  onOpenChange,
  lang,
  placeholder = 'Search products...',
  title = 'Search Products',
  buttonText = 'Search',
  noResultsTitle = 'No products match your search',
  noResultsHint = 'Try different keywords or check spelling'
}: SearchDialogProps) {
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const router = useRouter();

  // Debounced search to avoid too many API calls
  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setDebouncedSearch(value);
  }, 300);

  // Fetch search results with React Query
  const { data, isLoading } = useQuery({
    queryKey: ['search-products', debouncedSearch],
    queryFn: () => ApiClient.searchProducts({
      search: debouncedSearch,
      limit: 8,
      offset: 0,
    }),
    enabled: debouncedSearch.trim().length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const handleInputChange = (value: string) => {
    setSearchValue(value);
    debouncedSetSearch(value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/${lang}/products?search=${encodeURIComponent(searchValue.trim())}`);
      onOpenChange(false);
      setSearchValue('');
      setDebouncedSearch('');
    }
  };

  const handleClear = () => {
    setSearchValue('');
    setDebouncedSearch('');
  };

  const handleProductClick = () => {
    onOpenChange(false);
    setSearchValue('');
    setDebouncedSearch('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSearch} className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={placeholder}
              value={searchValue}
              onChange={(e) => handleInputChange(e.target.value)}
              className="pl-9 pr-9"
              autoFocus
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

          {/* Search Results */}
          {debouncedSearch.trim().length > 0 && (
            <div className="mt-4 max-h-[320px] overflow-y-auto">
              {isLoading ? (
                <div className="space-y-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <ProductSearchCardSkeleton key={index} />
                  ))}
                </div>
              ) : data && data.products.length > 0 ? (
                <div className="space-y-1">
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
                      +{data.total - 8} more results
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">{noResultsTitle}</p>
                  <p className="text-xs mt-1">{noResultsHint}</p>
                </div>
              )}
            </div>
          )}

          <Button type="submit" className="w-full mt-4">
            {buttonText}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
