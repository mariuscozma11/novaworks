import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Locale } from '@/lib/i18n';

interface HeroProps {
  lang: Locale;
  dict: {
    title: string;
    subtitle: string;
    ctaButton: string;
    orShop: string;
  };
}

export function Hero({ lang, dict }: HeroProps) {
  return (
    <section className="relative w-full h-screen flex flex-col -mt-20">
      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 flex-1 flex items-center pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full">
          {/* Left Side - Text Content */}
          <div className="flex flex-col space-y-6 text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {dict.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              {dict.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="text-base md:text-lg px-8 py-6">
                {dict.ctaButton}
              </Button>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="hidden lg:block relative w-full h-[400px] md:h-[500px] lg:h-[600px] max-w-lg mx-auto lg:max-w-none order-1 lg:order-2">
            <Image
              src="/frontpage/hero-image.png"
              alt="3D Printing"
              fill
              className="object-contain drop-shadow-2xl"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 700px"
              quality={95}
            />
          </div>
        </div>
      </div>

      {/* Separator with "Or browse our shop" */}
      <div className="max-w-7xl mx-auto px-4 pb-8 md:pb-12">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <Separator className="flex-1" />
          <Link
            href={`/${lang}/products`}
            className="text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap font-medium"
          >
            {dict.orShop}
          </Link>
          <Separator className="flex-1" />
        </div>
      </div>
    </section>
  );
}
