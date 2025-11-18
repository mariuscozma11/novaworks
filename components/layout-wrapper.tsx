'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export function LayoutWrapper({
  navbar,
  footer,
  children,
}: {
  navbar: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.includes('/admin');

  if (isAdminRoute) {
    // Admin routes: no navbar/footer
    return <>{children}</>;
  }

  // Regular routes: with navbar/footer
  return (
    <>
      {navbar}
      <main className="pt-20 min-h-screen">{children}</main>
      {footer}
    </>
  );
}
