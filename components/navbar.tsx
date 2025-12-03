import Link from 'next/link';
import { Heart, ShoppingCart, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getDictionary, type Locale } from '@/lib/i18n';
import { LanguageSelector } from '@/components/language-selector';
import { NavbarClient } from '@/components/navbar-client';
import { UserMenu } from '@/components/user-menu';
import { SearchButton } from '@/components/search-button';

export async function Navbar({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);

  // Fetch categories from API
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  let categories: any[] = [];

  try {
    const response = await fetch(`${API_URL}/categories`, {
      cache: 'no-store',
    });
    if (response.ok) {
      categories = await response.json();
    }
  } catch (error) {
    console.error('Failed to fetch categories for navbar:', error);
  }

  // Map categories to dropdown items with correct language
  const categoryDropdownItems = categories.map((category) => ({
    label: lang === 'ro' ? category.nameRo : category.nameEn,
    href: `/${lang}/categories/${category.slug}`,
  }));

  const navigationItems = [
    {
      label: dict.navbar.products,
      href: `/${lang}/products`,
      hasDropdown: false,
    },
    {
      label: dict.navbar.categories,
      href: `/${lang}/categories`,
      hasDropdown: true,
      dropdownItems: categoryDropdownItems.length > 0 ? categoryDropdownItems : [
        { label: 'No categories', href: `/${lang}/categories` },
      ],
    },
    {
      label: dict.navbar.about,
      href: `/${lang}/about`,
      hasDropdown: false,
    },
    {
      label: dict.navbar.contact,
      href: `/${lang}/contact`,
      hasDropdown: false,
    },
  ];

  // Favorites and cart counts (mock data)
  const favoritesCount = 0;
  const cartCount = 0;

  return (
    <NavbarClient lang={lang}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo - Left */}
          <Link href={`/${lang}`} className="flex items-center space-x-2 cursor-pointer">
            <div className="text-2xl font-bold tracking-tight">
              Nova<span className="text-primary">Works</span>
            </div>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center space-x-4">
            {navigationItems.map((item) => (
              <div key={item.label}>
                {item.hasDropdown ? (
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1 font-medium px-3 text-[15px]"
                      >
                        {item.label}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="center"
                      className="w-48 backdrop-blur-md bg-white/95 dark:bg-black/95"
                    >
                      {item.dropdownItems?.map((dropdownItem) => (
                        <DropdownMenuItem key={dropdownItem.href} asChild>
                          <Link href={dropdownItem.href} className="cursor-pointer">
                            {dropdownItem.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href={item.href}>
                    <Button variant="ghost" className="font-medium px-3 text-[15px]">
                      {item.label}
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Icons - Right */}
          <div className="flex items-center space-x-1">
            {/* Language Selector */}
            <LanguageSelector currentLang={lang} />

            {/* Search Button */}
            <SearchButton
              lang={lang}
              placeholder={dict.products.searchPlaceholder}
              title={dict.products.searchTitle}
              buttonText={dict.products.searchButton}
              noResultsTitle={dict.products.noResultsTitle}
              noResultsHint={dict.products.noResultsHint}
            />

            {/* User Menu Dropdown */}
            <UserMenu
              lang={lang}
              dict={{
                myAccount: dict.navbar.myAccount,
                orders: dict.navbar.orders,
                settings: dict.navbar.settings,
                login: dict.navbar.login,
                logout: dict.navbar.logout,
              }}
            />

            {/* Favorites with Badge */}
            <Button variant="ghost" className="relative p-3 min-h-0 h-auto">
              <Heart className="size-5" strokeWidth={2} />
              <div className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center bg-red-500 text-white rounded-full text-[10px] font-semibold">
                {favoritesCount}
              </div>
            </Button>

            {/* Shopping Cart with Badge */}
            <Button variant="ghost" className="relative p-3 min-h-0 h-auto">
              <ShoppingCart className="size-5" strokeWidth={2} />
              <div className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center bg-red-500 text-white rounded-full text-[10px] font-semibold">
                {cartCount}
              </div>
            </Button>
          </div>
        </div>
      </div>
    </NavbarClient>
  );
}
