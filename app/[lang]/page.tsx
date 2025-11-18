import { getDictionary, type Locale } from '@/lib/i18n';
import { Hero } from '@/components/hero';
import { BrowseCategories } from '@/components/browse-categories';
import { NewArrivals } from '@/components/new-arrivals';

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params as { lang: Locale };
  const dict = await getDictionary(lang);

  return (
    <div className="min-h-screen">
      <Hero
        lang={lang}
        dict={{
          title: dict.hero.title,
          subtitle: dict.hero.subtitle,
          ctaButton: dict.hero.ctaButton,
          orShop: dict.hero.orShop,
        }}
      />
      <BrowseCategories
        lang={lang}
        dict={{
          browseTitle: dict.categories.browseTitle,
        }}
      />
      <NewArrivals
        lang={lang}
        dict={{
          newArrivals: dict.products.newArrivals,
          viewAll: dict.products.viewAll,
          outOfStock: dict.products.outOfStock,
          quickView: dict.products.quickView,
          addToCart: dict.products.addToCart,
          addToFavorites: dict.products.addToFavorites,
        }}
      />
      {/* More sections will be added here */}
    </div>
  );
}
