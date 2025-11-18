'use client';

import Link from 'next/link';
import { User, LogIn, Settings, Package, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/components/auth-provider';
import type { Locale } from '@/lib/i18n-config';

interface UserMenuProps {
  lang: Locale;
  dict: {
    myAccount: string;
    orders: string;
    settings: string;
    login: string;
    logout: string;
  };
}

export function UserMenu({ lang, dict }: UserMenuProps) {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-3 min-h-0 h-auto">
            <User className="!size-5" strokeWidth={2} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 backdrop-blur-md bg-white/95 dark:bg-black/95"
        >
          <DropdownMenuItem asChild>
            <Link href={`/${lang}/auth`} className="cursor-pointer">
              <LogIn className="mr-2 h-4 w-4" />
              {dict.login}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-3 min-h-0 h-auto">
          <User className="!size-5" strokeWidth={2} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 backdrop-blur-md bg-white/95 dark:bg-black/95"
      >
        {user && (
          <>
            <div className="px-2 py-1.5 text-sm font-medium">
              {user.firstName} {user.lastName}
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        {isAdmin && (
          <>
            <DropdownMenuItem asChild>
              <Link href={`/${lang}/admin/dashboard`} className="cursor-pointer">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Admin Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem asChild>
          <Link href={`/${lang}/account`} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            {dict.myAccount}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${lang}/orders`} className="cursor-pointer">
            <Package className="mr-2 h-4 w-4" />
            {dict.orders}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${lang}/settings`} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            {dict.settings}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          {dict.logout}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
