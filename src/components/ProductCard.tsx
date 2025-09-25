import Link from 'next/link'
import Image from 'next/image'
import { Clock, Package, Weight } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'
import type { Product } from '@/lib/api'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useLanguage()
  const mainImage = product.images?.[0]
  const imageUrl = mainImage?.image?.url || '/placeholder-product.png'
  const imageAlt = mainImage?.alt || mainImage?.image?.alt || product.name

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
    }).format(price)
  }

  const getMaterialColor = (material?: string) => {
    if (!material) return 'bg-slate-100 text-slate-800'

    const materialLower = material.toLowerCase()
    if (materialLower.includes('pla')) return 'bg-green-100 text-green-800'
    if (materialLower.includes('petg')) return 'bg-blue-100 text-blue-800'
    if (materialLower.includes('abs')) return 'bg-orange-100 text-orange-800'
    if (materialLower.includes('tpu')) return 'bg-purple-100 text-purple-800'
    return 'bg-slate-100 text-slate-800'
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.featured && (
              <Badge variant="default" className="bg-slate-900 text-white">
                {t('product.featured')}
              </Badge>
            )}
            {product.customizable && <Badge variant="secondary">{t('product.customizable')}</Badge>}
            {!product.inStock && <Badge variant="destructive">{t('product.out_of_stock')}</Badge>}
          </div>

          {/* Material Badge */}
          {product.specifications.material && (
            <div className="absolute top-3 right-3">
              <Badge className={getMaterialColor(product.specifications.material)}>
                {product.specifications.material}
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="space-y-2">
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-semibold text-lg line-clamp-2 hover:text-slate-600 transition-colors">
              {product.name}
            </h3>
          </Link>

          {product.shortDescription && (
            <p className="text-sm text-slate-600 line-clamp-2">{product.shortDescription}</p>
          )}

          {/* Quick Specs */}
          <div className="flex items-center gap-4 text-xs text-slate-500">
            {product.specifications.printTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{product.specifications.printTime}h</span>
              </div>
            )}
            {product.specifications.dimensions && (
              <div className="flex items-center gap-1">
                <Package className="w-3 h-3" />
                <span>{product.specifications.dimensions}mm</span>
              </div>
            )}
            {product.specifications.weight && (
              <div className="flex items-center gap-1">
                <Weight className="w-3 h-3" />
                <span>{product.specifications.weight}g</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-2xl font-bold text-slate-900">{formatPrice(product.price)}</div>
          <div className="text-xs text-slate-500">{product.category.name}</div>
        </div>

        <Button size="sm" disabled={!product.inStock} className="bg-slate-900 hover:bg-slate-800">
          {product.inStock ? t('product.add_to_cart') : t('product.sold_out')}
        </Button>
      </CardFooter>
    </Card>
  )
}
