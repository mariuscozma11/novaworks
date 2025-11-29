'use client';

import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  dict: {
    noResults: string;
    noResultsDescription: string;
  };
}

export function EmptyState({ dict }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24">
      <PackageOpen className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">{dict.noResults}</h3>
      <p className="text-muted-foreground text-center max-w-md">
        {dict.noResultsDescription}
      </p>
    </div>
  );
}
