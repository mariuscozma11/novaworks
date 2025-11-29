'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SortByOption, SortOrder } from '@/lib/types/product-filters';

interface SortSelectProps {
  value: string; // Format: "sortBy-sortOrder" e.g., "price-ASC"
  onChange: (value: string) => void;
  dict: {
    sortBy: string;
    newest: string;
    priceAsc: string;
    priceDesc: string;
    nameAsc: string;
    nameDesc: string;
    stockSort: string;
  };
}

export function SortSelect({ value, onChange, dict }: SortSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full md:w-[200px]">
        <SelectValue placeholder={dict.sortBy} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="createdAt-DESC">{dict.newest}</SelectItem>
        <SelectItem value="price-ASC">{dict.priceAsc}</SelectItem>
        <SelectItem value="price-DESC">{dict.priceDesc}</SelectItem>
        <SelectItem value="nameEn-ASC">{dict.nameAsc}</SelectItem>
        <SelectItem value="nameEn-DESC">{dict.nameDesc}</SelectItem>
        <SelectItem value="stock-DESC">{dict.stockSort}</SelectItem>
      </SelectContent>
    </Select>
  );
}
