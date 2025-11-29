'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchDialog } from '@/components/search-dialog';
import type { Locale } from '@/lib/i18n';

interface SearchButtonProps {
  lang: Locale;
  placeholder?: string;
  title?: string;
  buttonText?: string;
  noResultsTitle?: string;
  noResultsHint?: string;
}

export function SearchButton({
  lang,
  placeholder,
  title,
  buttonText,
  noResultsTitle,
  noResultsHint
}: SearchButtonProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        className="hidden md:flex p-3 min-h-0 h-auto"
        onClick={() => setSearchOpen(true)}
      >
        <Search className="size-5" strokeWidth={2} />
      </Button>
      <SearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        lang={lang}
        placeholder={placeholder}
        title={title}
        buttonText={buttonText}
        noResultsTitle={noResultsTitle}
        noResultsHint={noResultsHint}
      />
    </>
  );
}
