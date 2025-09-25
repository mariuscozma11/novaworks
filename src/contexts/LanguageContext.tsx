'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export type Language = 'ro' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  ro: {
    // Header
    'nav.products': 'Produse',
    'nav.categories': 'Categorii',
    'nav.custom': 'Comenzi Personalizate',
    'nav.about': 'Despre',
    'search.placeholder': 'Caută produse 3D...',
    'cart.items': 'articole',

    // Footer
    'footer.company': 'Companie',
    'footer.about': 'Despre Noi',
    'footer.contact': 'Contact',
    'footer.terms': 'Termeni și Condiții',
    'footer.privacy': 'Politica de Confidențialitate',
    'footer.products': 'Produse',
    'footer.all_products': 'Toate Produsele',
    'footer.categories': 'Categorii',
    'footer.custom_orders': 'Comenzi Personalizate',
    'footer.support': 'Suport',
    'footer.faq': 'Întrebări Frecvente',
    'footer.shipping': 'Livrare',
    'footer.returns': 'Returnări',
    'footer.follow_us': 'Urmărește-ne',
    'footer.newsletter': 'Newsletter',
    'footer.newsletter_text': 'Primește cele mai noi produse și oferte speciale',
    'footer.email_placeholder': 'Adresa ta de email',
    'footer.subscribe': 'Abonează-te',
    'footer.rights': 'Toate drepturile rezervate.',
    'footer.made_with': 'Realizat cu',
    'footer.in': 'în',
    'footer.location': 'România',

    // Product related
    'product.add_to_cart': 'Adaugă în Coș',
    'product.sold_out': 'Stoc Epuizat',
    'product.featured': 'Recomandat',
    'product.customizable': 'Personalizabil',
    'product.out_of_stock': 'Stoc Epuizat',

    // Common
    'common.loading': 'Se încarcă...',
    'common.error': 'Eroare',
    'common.no_products': 'Nu au fost găsite produse',
  },
  en: {
    // Header
    'nav.products': 'Products',
    'nav.categories': 'Categories',
    'nav.custom': 'Custom Orders',
    'nav.about': 'About',
    'search.placeholder': 'Search 3D prints...',
    'cart.items': 'items',

    // Footer
    'footer.company': 'Company',
    'footer.about': 'About Us',
    'footer.contact': 'Contact',
    'footer.terms': 'Terms & Conditions',
    'footer.privacy': 'Privacy Policy',
    'footer.products': 'Products',
    'footer.all_products': 'All Products',
    'footer.categories': 'Categories',
    'footer.custom_orders': 'Custom Orders',
    'footer.support': 'Support',
    'footer.faq': 'FAQ',
    'footer.shipping': 'Shipping',
    'footer.returns': 'Returns',
    'footer.follow_us': 'Follow Us',
    'footer.newsletter': 'Newsletter',
    'footer.newsletter_text': 'Get the latest products and special offers',
    'footer.email_placeholder': 'Your email address',
    'footer.subscribe': 'Subscribe',
    'footer.rights': 'All rights reserved.',
    'footer.made_with': 'Made with',
    'footer.in': 'in',
    'footer.location': 'Romania',

    // Product related
    'product.add_to_cart': 'Add to Cart',
    'product.sold_out': 'Sold Out',
    'product.featured': 'Featured',
    'product.customizable': 'Customizable',
    'product.out_of_stock': 'Out of Stock',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.no_products': 'No products found',
  },
}

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('ro')

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ro']] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}