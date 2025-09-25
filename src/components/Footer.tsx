'use client'

import Link from 'next/link'
import { Heart, Mail, Phone, MapPin, Instagram, Facebook, Youtube } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-slate-900 font-bold text-sm">NW</span>
              </div>
              <span className="font-bold text-xl">NovaWorks</span>
            </div>
            <p className="text-slate-300 text-sm">
              {t('footer.company_description') || 'Servicii profesionale de imprimare 3D pentru prototipuri și piese personalizate de înaltă calitate.'}
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <Mail className="w-4 h-4" />
                <span>contact@novaworks.ro</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <Phone className="w-4 h-4" />
                <span>+40 123 456 789</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <MapPin className="w-4 h-4" />
                <span>București, România</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t('footer.products')}</h3>
            <div className="space-y-2">
              <Link href="/products" className="block text-slate-300 hover:text-white text-sm transition-colors">
                {t('footer.all_products')}
              </Link>
              <Link href="/categories" className="block text-slate-300 hover:text-white text-sm transition-colors">
                {t('footer.categories')}
              </Link>
              <Link href="/custom" className="block text-slate-300 hover:text-white text-sm transition-colors">
                {t('footer.custom_orders')}
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t('footer.support')}</h3>
            <div className="space-y-2">
              <Link href="/faq" className="block text-slate-300 hover:text-white text-sm transition-colors">
                {t('footer.faq')}
              </Link>
              <Link href="/shipping" className="block text-slate-300 hover:text-white text-sm transition-colors">
                {t('footer.shipping')}
              </Link>
              <Link href="/returns" className="block text-slate-300 hover:text-white text-sm transition-colors">
                {t('footer.returns')}
              </Link>
              <Link href="/contact" className="block text-slate-300 hover:text-white text-sm transition-colors">
                {t('footer.contact')}
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t('footer.newsletter')}</h3>
            <p className="text-slate-300 text-sm">
              {t('footer.newsletter_text')}
            </p>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder={t('footer.email_placeholder')}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
              />
              <Button className="w-full bg-white text-slate-900 hover:bg-slate-100">
                {t('footer.subscribe')}
              </Button>
            </div>

            {/* Social Links */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">{t('footer.follow_us')}</h4>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-300 hover:text-white hover:bg-slate-800"
                  asChild
                >
                  <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <Facebook className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-300 hover:text-white hover:bg-slate-800"
                  asChild
                >
                  <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <Instagram className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-300 hover:text-white hover:bg-slate-800"
                  asChild
                >
                  <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                    <Youtube className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-slate-800" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 text-sm text-slate-300">
            <span>© 2024 NovaWorks. {t('footer.rights')}</span>
            <div className="flex space-x-4">
              <Link href="/terms" className="hover:text-white transition-colors">
                {t('footer.terms')}
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                {t('footer.privacy')}
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-1 text-sm text-slate-300">
            <span>{t('footer.made_with')}</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>{t('footer.in')} {t('footer.location')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}