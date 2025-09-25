'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import ProductGrid from '@/components/ProductGrid'
import { fetchProducts, type Product } from '@/lib/api'

export default function ProductsPage() {
  const { t } = useLanguage()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetchProducts({
          where: {
            isActive: { equals: true }
          }
        })

        setProducts(response.docs)
      } catch (err) {
        console.error('Error loading products:', err)
        setError('Eroare la încărcarea produselor')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
            <p className="text-slate-600">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="text-red-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">{t('common.error')}</h2>
            <p className="text-slate-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            {t('nav.products')}
          </h1>
          <p className="text-slate-600">
            Descoperă colecția noastră de piese 3D de înaltă calitate, perfecte pentru diverse aplicații.
          </p>
        </div>

        {/* Products Grid */}
        <ProductGrid products={products} />

        {/* No products message */}
        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Nu există produse momentan
            </h3>
            <p className="text-slate-600">
              Lucrăm la adăugarea de noi produse. Revino curând!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}