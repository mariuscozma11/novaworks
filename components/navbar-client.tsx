'use client';

import { useState, useEffect, type ReactNode } from 'react';
import type { Locale } from '@/lib/i18n';

export function NavbarClient({ children, lang }: { children: ReactNode; lang: Locale }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'py-2 backdrop-blur-md bg-white/70 dark:bg-black/70 shadow-sm'
          : 'py-4 bg-white dark:bg-black'
      }`}
    >
      {children}
    </nav>
  );
}
