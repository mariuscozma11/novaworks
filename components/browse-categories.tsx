import Link from 'next/link';
import Image from 'next/image';
import type { Locale } from '@/lib/i18n';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface Category {
  id: string;
  nameEn: string;
  nameRo: string;
  slug: string;
  imageUrl?: string;
}

interface BrowseCategoriesProps {
  lang: Locale;
  dict: {
    browseTitle: string;
  };
}

export async function BrowseCategories({ lang, dict }: BrowseCategoriesProps) {
  // Fetch categories from API
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  let categories: Category[] = [];

  try {
    const response = await fetch(`${API_URL}/categories`, {
      cache: 'force-cache',
    });
    if (response.ok) {
      categories = await response.json();
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full bg-muted/40 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title - Top Left */}
        <h2 className="text-3xl md:text-4xl font-bold mb-12 font-sans">
          {dict.browseTitle}
        </h2>

        {/* Carousel */}
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {categories.map((category) => {
              const categoryName = lang === 'ro' ? category.nameRo : category.nameEn;

              return (
                <CarouselItem key={category.id} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                  <Link
                    href={`/${lang}/categories/${category.slug}`}
                    className="flex flex-col items-center gap-4 group py-4"
                  >
                    {/* Circular Image Container */}
                    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-background shadow-lg transition-transform duration-300 group-hover:scale-105 p-6 md:p-8">
                      {category.imageUrl ? (
                        <Image
                          src={category.imageUrl}
                          alt={categoryName}
                          fill
                          className="object-contain scale-60"
                          sizes="(max-width: 768px) 128px, 160px"
                          loading="lazy"
                          quality={75}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <span className="text-4xl">📦</span>
                        </div>
                      )}
                    </div>

                    {/* Category Name */}
                    <h3 className="text-center font-medium text-base md:text-lg font-sans group-hover:text-primary transition-colors">
                      {categoryName}
                    </h3>
                  </Link>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="-left-4 md:-left-12" />
          <CarouselNext className="-right-4 md:-right-12" />
        </Carousel>
      </div>
    </section>
  );
}
