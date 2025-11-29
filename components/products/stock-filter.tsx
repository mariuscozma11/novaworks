'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface StockFilterProps {
  value: boolean;
  onChange: (checked: boolean) => void;
  dict: {
    stockStatus: string;
    inStockOnly: string;
  };
}

export function StockFilter({ value, onChange, dict }: StockFilterProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm">{dict.stockStatus}</h3>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="inStock"
          checked={value}
          onCheckedChange={(checked) => onChange(checked === true)}
        />
        <Label htmlFor="inStock" className="text-sm font-normal cursor-pointer">
          {dict.inStockOnly}
        </Label>
      </div>
    </div>
  );
}
