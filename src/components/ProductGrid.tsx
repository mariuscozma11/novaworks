import ProductCard from './ProductCard'
import { useLanguage } from '@/contexts/LanguageContext'
import type { Product } from '@/lib/api'

interface ProductGridProps {
  products: Product[]
  title?: string
  showViewAll?: boolean
  viewAllHref?: string
}

export default function ProductGrid({
  products,
  title,
  showViewAll = false,
  viewAllHref = '/products'
}: ProductGridProps) {
  const { t } = useLanguage()

  if (!products.length) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-400 mb-2">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8v2a1 1 0 01-1 1H7a1 1 0 01-1-1V5a1 1 0 011-1h10a1 1 0 011 1z"
            />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-slate-900">{t('common.no_products')}</h3>
        <p className="text-sm text-slate-500">Încearcă să ajustezi căutarea sau filtrele pentru a găsi ce cauți.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          {showViewAll && (
            <a
              href={viewAllHref}
              className="text-slate-600 hover:text-slate-900 font-medium text-sm flex items-center gap-1"
            >
              View all
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}