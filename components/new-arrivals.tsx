import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import type { Locale } from '@/lib/i18n';
import { ArrowRight } from 'lucide-react';

interface ProductImage {
  url: string;
  order?: number;
}

interface Product {
  id: string;
  nameEn: string;
  nameRo: string;
  slug: string;
  price: number;
  stock: number;
  images?: ProductImage[];
  createdAt: string;
}

interface NewArrivalsProps {
  lang: Locale;
  dict: {
    newArrivals: string;
    viewAll: string;
    outOfStock: string;
    quickView: string;
    addToCart: string;
    addToFavorites: string;
  };
}

export async function NewArrivals({ lang, dict }: NewArrivalsProps) {
  // Fetch products from API using the search endpoint with filtering
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  let products: Product[] = [];

  try {
    // Use the search endpoint with sorting and limit
    const params = new URLSearchParams({
      sortBy: 'createdAt',
      sortOrder: 'DESC',
      limit: '12',
      offset: '0',
    });

    const response = await fetch(`${API_URL}/products/search?${params.toString()}`, {
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      const data = await response.json();
      products = data.products || [];
    }
  } catch (error) {
    console.error('Failed to fetch new arrivals:', error);
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-sans">
            {dict.newArrivals}
          </h2>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${lang}/products/new`} className="gap-2">
              <span className="hidden sm:inline">{dict.viewAll}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`${
                // Show 4 on mobile, 8 on tablet, 12 on desktop
                index >= 4 ? 'hidden md:block' : ''
              } ${
                index >= 8 ? 'hidden lg:block' : ''
              } ${
                index >= 12 ? 'hidden' : ''
              }`}
            >
              <ProductCard
                product={product}
                lang={lang}
                dict={{
                  outOfStock: dict.outOfStock,
                  quickView: dict.quickView,
                  addToCart: dict.addToCart,
                  addToFavorites: dict.addToFavorites,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
