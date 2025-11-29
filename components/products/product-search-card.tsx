'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n';

interface ProductSearchCardProps {
  product: {
    id: string;
    nameEn: string;
    nameRo: string;
    slug: string;
    price: string;
    images?: { url: string }[];
    stock?: number;
  };
  lang: Locale;
  onClick?: () => void;
}

export function ProductSearchCard({ product, lang, onClick }: ProductSearchCardProps) {
  const name = lang === 'ro' ? product.nameRo : product.nameEn;
  const imageUrl = product.images?.[0]?.url || '/placeholder-product.png';
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  return (
    <Link
      href={`/${lang}/products/${product.slug}`}
      onClick={onClick}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
    >
      {/* Product Image */}
      <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-muted">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          sizes="64px"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-1">{name}</h4>
        <p className="text-sm font-semibold text-primary mt-1">{product.price} RON</p>
      </div>
    </Link>
  );
}
