'use client';

import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SortSelect } from './sort-select';

interface ProductsToolbarProps {
  total: number;
  sortValue: string;
  onSortChange: (value: string) => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
  dict: {
    filters: string;
    sortBy: string;
    newest: string;
    priceAsc: string;
    priceDesc: string;
    nameAsc: string;
    nameDesc: string;
    stockSort: string;
    resultsCount: string;
    resultsCountSingular: string;
  };
}

export function ProductsToolbar({
  total,
  sortValue,
  onSortChange,
  onOpenFilters,
  activeFilterCount,
  dict,
}: ProductsToolbarProps) {
  const resultsText = total === 1
    ? dict.resultsCountSingular
    : dict.resultsCount.replace('{count}', total.toString());

  return (
    <div className="flex items-center justify-between gap-4 pb-6">
      {/* Left: Mobile filter trigger + Results count */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenFilters}
          className="lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          {dict.filters}
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 px-1.5">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
        <p className="text-sm text-muted-foreground hidden sm:block">
          {resultsText}
        </p>
      </div>

      {/* Right: Sort dropdown */}
      <SortSelect
        value={sortValue}
        onChange={onSortChange}
        dict={{
          sortBy: dict.sortBy,
          newest: dict.newest,
          priceAsc: dict.priceAsc,
          priceDesc: dict.priceDesc,
          nameAsc: dict.nameAsc,
          nameDesc: dict.nameDesc,
          stockSort: dict.stockSort,
        }}
      />
    </div>
  );
}
