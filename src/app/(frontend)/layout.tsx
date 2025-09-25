import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { LanguageProvider } from '@/contexts/LanguageContext'
import './styles.css'

export const metadata = {
  description: 'NovaWorks - Servicii Profesionale de Imprimare 3D',
  title: 'NovaWorks - Servicii de Imprimare 3D',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="ro">
      <body>
        <LanguageProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  )
}
