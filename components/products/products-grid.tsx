'use client';

import { ProductCard } from '@/components/product-card';
import type { Locale } from '@/lib/i18n';

interface Product {
  id: string;
  nameEn: string;
  nameRo: string;
  slug: string;
  price: number;
  stock: number;
  images?: { url: string; order?: number }[];
}

interface ProductsGridProps {
  products: Product[];
  lang: Locale;
  dict: {
    outOfStock: string;
    quickView: string;
    addToCart: string;
    addToFavorites: string;
  };
}

export function ProductsGrid({ products, lang, dict }: ProductsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          lang={lang}
          dict={dict}
        />
      ))}
    </div>
  );
}
