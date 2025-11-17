'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard } from 'lucide-react';

export function AdminNavbar() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <div className="bg-primary text-primary-foreground border-b border-primary/20">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Hello, Admin</span>
        </div>
        {!isAdminPage && (
          <Link
            href="/admin/dashboard"
            className="text-sm flex items-center gap-2 hover:underline"
          >
            <LayoutDashboard className="h-4 w-4" />
            Go to Dashboard
          </Link>
        )}
      </div>
    </div>
  );
}
