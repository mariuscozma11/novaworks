'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Locale } from '@/lib/i18n';

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
}

interface ProductCardProps {
  product: Product;
  lang: Locale;
  dict: {
    outOfStock: string;
    quickView: string;
    addToCart: string;
    addToFavorites: string;
  };
}

export function ProductCard({ product, lang, dict }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const productName = lang === 'ro' ? product.nameRo : product.nameEn;
  const isOutOfStock = product.stock <= 0;

  // Get the first image or use a placeholder
  const primaryImage = product.images?.[0]?.url || '/placeholder-product.png';

  return (
    <div
      className="group relative flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link href={`/${lang}/products/${product.slug}`} className="relative">
        <div className="relative aspect-square rounded-lg border border-border bg-muted overflow-hidden p-4">
          <Image
            src={primaryImage}
            alt={productName}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
            quality={75}
          />

          {/* Badges */}
          {isOutOfStock && (
            <Badge
              variant="destructive"
              className="absolute top-2 left-2 font-medium"
            >
              {dict.outOfStock}
            </Badge>
          )}

          {/* Hover Action Buttons */}
          <div
            className={`absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 p-4 bg-gradient-to-t from-black/60 to-transparent transition-all duration-300 ${
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
          >
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 bg-white/90 hover:bg-white"
              onClick={(e) => {
                e.preventDefault();
                // Quick view action
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>

            {!isOutOfStock && (
              <Button
                size="icon"
                variant="secondary"
                className="h-9 w-9 bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.preventDefault();
                  // Add to cart action
                }}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            )}

            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 bg-white/90 hover:bg-white"
              onClick={(e) => {
                e.preventDefault();
                // Add to favorites action
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-3 flex flex-col gap-1">
        <Link
          href={`/${lang}/products/${product.slug}`}
          className="font-medium text-sm md:text-base line-clamp-2 hover:text-primary transition-colors"
        >
          {productName}
        </Link>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-base md:text-lg">
            {Number(product.price).toFixed(2)} RON
          </span>
          {/* Discount price placeholder for future */}
          {/* <span className="text-sm text-muted-foreground line-through">
            {oldPrice.toFixed(2)} RON
          </span> */}
        </div>
      </div>
    </div>
  );
}
