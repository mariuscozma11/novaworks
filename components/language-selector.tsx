'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Locale } from '@/lib/i18n';

export function LanguageSelector({ currentLang }: { currentLang: Locale }) {
  const pathname = usePathname();

  const redirectedPathname = (locale: Locale) => {
    if (!pathname) return `/${locale}`;

    // Remove current locale from pathname and add new locale
    const segments = pathname.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-3 cursor-pointer min-h-0 h-auto">
          <Globe className="!size-5" strokeWidth={2} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-32 backdrop-blur-md bg-white/95 dark:bg-black/95"
      >
        <DropdownMenuItem asChild>
          <Link
            href={redirectedPathname('en')}
            className={`cursor-pointer ${currentLang === 'en' ? 'bg-accent' : ''}`}
          >
            🇬🇧 English
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={redirectedPathname('ro')}
            className={`cursor-pointer ${currentLang === 'ro' ? 'bg-accent' : ''}`}
          >
            🇷🇴 Română
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
