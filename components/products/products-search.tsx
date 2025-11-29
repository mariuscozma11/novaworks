'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebouncedCallback } from 'use-debounce';

interface ProductsSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function ProductsSearch({
  value,
  onChange,
  placeholder,
}: ProductsSearchProps) {
  const [searchValue, setSearchValue] = useState(value);

  // Sync local state with prop value
  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  const debouncedOnChange = useDebouncedCallback((value: string) => {
    onChange(value);
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    debouncedOnChange(newValue);
  };

  const handleClear = () => {
    setSearchValue('');
    onChange('');
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleChange}
        className="pl-9 pr-9"
      />
      {searchValue && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
