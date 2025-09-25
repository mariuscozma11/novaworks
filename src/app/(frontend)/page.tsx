'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'
import ProductGrid from '@/components/ProductGrid'
import { fetchFeaturedProducts, fetchProducts, type Product } from '@/lib/api'
import './styles.css'

export default function HomePage() {
  const { t } = useLanguage()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [recentProducts, setRecentProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)

        // Try to get featured products first
        const featured = await fetchFeaturedProducts(4)
        setFeaturedProducts(featured)

        // If no featured products, get recent products
        if (featured.length === 0) {
          const recent = await fetchProducts({
            limit: 4,
            where: {
              isActive: { equals: true },
            },
          })
          setRecentProducts(recent.docs)
        }
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const productsToShow = featuredProducts.length > 0 ? featuredProducts : recentProducts

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              NovaWorks
              <span className="block text-slate-300 text-2xl md:text-3xl mt-4">
                Servicii Profesionale de Imprimare 3D
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Piese 3D de înaltă calitate, prototipuri și design personalizat. De la PLA la PETG,
              aducem ideile tale la viață cu precizie și rapiditate.
            </p>

            {productsToShow.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                  <Link href="/products">
                    Vezi Produsele
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-slate-300 text-white hover:bg-slate-800"
                >
                  <Link href="/custom">Comandă Personalizată</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products Section */}
      {loading ? (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-4"></div>
            <p className="text-slate-600">{t('common.loading')}</p>
          </div>
        </section>
      ) : productsToShow.length > 0 ? (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProductGrid
              products={productsToShow}
              title={featuredProducts.length > 0 ? 'Produse Recomandate' : 'Produse Recente'}
              showViewAll={true}
              viewAllHref="/products"
            />
          </div>
        </section>
      ) : (
        /* Coming Soon Section - only show if no products */
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">În Curând</h2>
            <p className="text-slate-600 text-lg mb-8">
              Lucrăm la un catalog complet de produse 3D. Pentru comenzi personalizate sau
              întrebări, nu ezita să ne contactezi.
            </p>

            <div className="bg-slate-50 p-8 rounded-lg">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Servicii Disponibile</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-900">Materiale Premium</h4>
                  <p className="text-sm text-slate-600">PLA, PETG, ABS și TPU de înaltă calitate</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-900">Livrare Rapidă</h4>
                  <p className="text-sm text-slate-600">
                    Comenzile sunt procesate în 2-3 zile lucrătoare
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-900">Design Personalizat</h4>
                  <p className="text-sm text-slate-600">
                    Prototipuri și piese după specificațiile tale
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Custom Orders CTA */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ai o Idee Unică?</h2>
          <p className="text-slate-300 mb-8 text-lg">
            Transformăm conceptele tale în realitate cu servicii de imprimare 3D personalizată.
            Încarcă fișierul tău CAD și primește o cotație rapidă.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <h3 className="font-medium mb-1">Încarcă Fișierul</h3>
              <p className="text-sm text-slate-300">STL, OBJ, 3MF</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-medium mb-1">Primește Cotația</h3>
              <p className="text-sm text-slate-300">În 24 de ore</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              <h3 className="font-medium mb-1">Producție</h3>
              <p className="text-sm text-slate-300">Calitate garantată</p>
            </div>
          </div>

          <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
            <Link href="/custom">
              Începe Comanda Personalizată
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
