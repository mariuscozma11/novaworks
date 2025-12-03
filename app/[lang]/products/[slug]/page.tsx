import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDictionary, type Locale } from '@/lib/i18n';
import { ProductImageGallery } from '@/components/products/product-image-gallery';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, ChevronRight } from 'lucide-react';

interface ProductImage {
  id: string;
  url: string;
  order: number;
}

interface Category {
  id: string;
  nameEn: string;
  nameRo: string;
  slug: string;
}

interface Product {
  id: string;
  nameEn: string;
  nameRo: string;
  slug: string;
  descriptionEn: string;
  descriptionRo: string;
  price: string;
  stock: number;
  categoryId: string;
  category: Category;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params as { lang: Locale; slug: string };
  const dict = await getDictionary(lang);

  // Fetch product
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  try {
    const response = await fetch(`${API_URL}/products/${slug}`, {
      cache: 'no-store',
    });

    if (response.ok) {
      const product: Product = await response.json();
      const name = lang === 'ro' ? product.nameRo : product.nameEn;
      const description = lang === 'ro' ? product.descriptionRo : product.descriptionEn;

      return {
        title: `${name} - NovaWorks`,
        description: description.substring(0, 160),
      };
    }
  } catch (error) {
    console.error('Failed to fetch product for metadata:', error);
  }

  return {
    title: 'Product - NovaWorks',
    description: dict.hero.subtitle,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params as { lang: Locale; slug: string };
  const dict = await getDictionary(lang);

  // Fetch product
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  let product: Product | null = null;

  try {
    const response = await fetch(`${API_URL}/products/${slug}`, {
      cache: 'no-store',
    });

    if (response.ok) {
      product = await response.json();
    }
  } catch (error) {
    console.error('Failed to fetch product:', error);
  }

  if (!product) {
    notFound();
  }

  const name = lang === 'ro' ? product.nameRo : product.nameEn;
  const description = lang === 'ro' ? product.descriptionRo : product.descriptionEn;
  const categoryName = lang === 'ro' ? product.category.nameRo : product.category.nameEn;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href={`/${lang}`} className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/${lang}/products`} className="hover:text-foreground transition-colors">
            Products
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href={`/${lang}/categories/${product.category.slug}`}
            className="hover:text-foreground transition-colors"
          >
            {categoryName}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">{name}</span>
        </nav>

        {/* Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div>
            <ProductImageGallery
              images={product.images.length > 0 ? product.images : [{ id: '1', url: '/placeholder-product.png', order: 0 }]}
              productName={name}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            <Badge variant="secondary" className="text-sm">
              {categoryName}
            </Badge>

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              {name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">
                {Number(product.price).toFixed(2)} RON
              </span>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {isOutOfStock ? (
                <Badge variant="destructive">Out of Stock</Badge>
              ) : product.stock <= 5 ? (
                <Badge variant="outline" className="border-orange-500 text-orange-500">
                  Only {product.stock} left in stock
                </Badge>
              ) : (
                <Badge variant="outline" className="border-green-500 text-green-500">
                  In Stock ({product.stock} available)
                </Badge>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-sm md:prose-base max-w-none">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{description}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                size="lg"
                className="flex-1"
                disabled={isOutOfStock}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5 mr-2" />
                Add to Favorites
              </Button>
            </div>

            {/* Additional Info */}
            <div className="border-t pt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <Link
                  href={`/${lang}/categories/${product.category.slug}`}
                  className="font-medium hover:text-primary transition-colors"
                >
                  {categoryName}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
