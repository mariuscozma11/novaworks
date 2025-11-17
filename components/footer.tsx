import Link from 'next/link';
import { getDictionary, type Locale } from '@/lib/i18n';

export async function Footer({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="text-2xl font-bold tracking-tight">
              Nova<span className="text-primary">Works</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {dict.footer.tagline}
            </p>
          </div>

          {/* Shop Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">{dict.footer.shop}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={`/${lang}/products`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dict.navbar.products}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/categories`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dict.navbar.categories}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/products/new`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dict.navbar.newArrivals}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/products/sale`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dict.navbar.sale}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">{dict.footer.company}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={`/${lang}/about`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dict.navbar.about}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/contact`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dict.navbar.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">{dict.footer.support}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={`/${lang}/privacy`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dict.footer.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/terms`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dict.footer.termsOfService}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/shipping`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dict.footer.shippingReturns}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} NovaWorks. {dict.footer.allRightsReserved}.
          </p>
        </div>
      </div>
    </footer>
  );
}
