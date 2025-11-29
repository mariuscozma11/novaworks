'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Locale } from '@/lib/i18n';

interface Category {
  id: string;
  nameEn: string;
  nameRo: string;
  slug: string;
}

interface CategoryFilterProps {
  categories: Category[];
  value: string;
  onChange: (categoryId: string) => void;
  lang: Locale;
  dict: {
    category: string;
    allCategories: string;
  };
}

export function CategoryFilter({
  categories,
  value,
  onChange,
  lang,
  dict,
}: CategoryFilterProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm">{dict.category}</h3>
      <RadioGroup value={value || 'all'} onValueChange={onChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="category-all" />
          <Label htmlFor="category-all" className="text-sm font-normal cursor-pointer">
            {dict.allCategories}
          </Label>
        </div>
        {categories.map((category) => {
          const categoryName = lang === 'ro' ? category.nameRo : category.nameEn;
          return (
            <div key={category.id} className="flex items-center space-x-2">
              <RadioGroupItem value={category.id} id={`category-${category.id}`} />
              <Label
                htmlFor={`category-${category.id}`}
                className="text-sm font-normal cursor-pointer"
              >
                {categoryName}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}
