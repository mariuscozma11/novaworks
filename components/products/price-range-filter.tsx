'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDebouncedCallback } from 'use-debounce';

interface PriceRangeFilterProps {
  minPrice: number | undefined;
  maxPrice: number | undefined;
  onMinPriceChange: (value: number | undefined) => void;
  onMaxPriceChange: (value: number | undefined) => void;
  dict: {
    priceRange: string;
    minPrice: string;
    maxPrice: string;
  };
}

export function PriceRangeFilter({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  dict,
}: PriceRangeFilterProps) {
  const [minValue, setMinValue] = useState(minPrice?.toString() || '');
  const [maxValue, setMaxValue] = useState(maxPrice?.toString() || '');

  // Sync local state with props
  useEffect(() => {
    setMinValue(minPrice?.toString() || '');
  }, [minPrice]);

  useEffect(() => {
    setMaxValue(maxPrice?.toString() || '');
  }, [maxPrice]);

  const debouncedMinChange = useDebouncedCallback((value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    if (numValue === undefined || (!isNaN(numValue) && numValue >= 0)) {
      onMinPriceChange(numValue);
    }
  }, 300);

  const debouncedMaxChange = useDebouncedCallback((value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    if (numValue === undefined || (!isNaN(numValue) && numValue >= 0)) {
      onMaxPriceChange(numValue);
    }
  }, 300);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinValue(value);
    debouncedMinChange(value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxValue(value);
    debouncedMaxChange(value);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm">{dict.priceRange}</h3>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Label htmlFor="minPrice" className="text-xs text-muted-foreground">
            {dict.minPrice}
          </Label>
          <Input
            id="minPrice"
            type="number"
            placeholder="0"
            value={minValue}
            onChange={handleMinChange}
            min="0"
            step="1"
            className="mt-1"
          />
        </div>
        <span className="text-muted-foreground pt-6">-</span>
        <div className="flex-1">
          <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
            {dict.maxPrice}
          </Label>
          <Input
            id="maxPrice"
            type="number"
            placeholder="9999"
            value={maxValue}
            onChange={handleMaxChange}
            min="0"
            step="1"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}
