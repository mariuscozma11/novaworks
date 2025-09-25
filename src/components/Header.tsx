'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Menu, X, ShoppingCart, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { language, setLanguage, t } = useLanguage()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleLanguage = () => setLanguage(language === 'ro' ? 'en' : 'ro')

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">NW</span>
              </div>
              <span className="font-bold text-xl text-slate-900">NovaWorks</span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                type="search"
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-slate-600 hover:text-slate-900 font-medium">
              {t('nav.products')}
            </Link>
            <Link href="/categories" className="text-slate-600 hover:text-slate-900 font-medium">
              {t('nav.categories')}
            </Link>
            <Link href="/custom" className="text-slate-600 hover:text-slate-900 font-medium">
              {t('nav.custom')}
            </Link>
            <Link href="/about" className="text-slate-600 hover:text-slate-900 font-medium">
              {t('nav.about')}
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="text-slate-600 hover:text-slate-900"
            >
              <Globe className="w-4 h-4" />
              <span className="sr-only ml-1 text-xs font-medium">
                {language.toUpperCase()}
              </span>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              {/* Mobile Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    type="search"
                    placeholder={t('search.placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
              </div>

              {/* Mobile Navigation */}
              <Link
                href="/products"
                className="block px-3 py-2 text-slate-600 hover:text-slate-900 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.products')}
              </Link>
              <Link
                href="/categories"
                className="block px-3 py-2 text-slate-600 hover:text-slate-900 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.categories')}
              </Link>
              <Link
                href="/custom"
                className="block px-3 py-2 text-slate-600 hover:text-slate-900 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.custom')}
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-slate-600 hover:text-slate-900 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.about')}
              </Link>

              {/* Mobile Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center px-3 py-2 text-slate-600 hover:text-slate-900 font-medium"
              >
                <Globe className="w-4 h-4 mr-2" />
                {language === 'ro' ? 'English' : 'Română'}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}