import { getDictionary, type Locale } from "@/lib/i18n";
import { ProductsPageClient } from "@/components/products/products-page-client";
import { Suspense } from "react";

interface Category {
  id: string;
  nameEn: string;
  nameRo: string;
  slug: string;
  descriptionEn?: string;
  descriptionRo?: string;
  imageUrl?: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Locale };
  const dict = await getDictionary(lang);

  return {
    title: `${dict.products.pageTitle} - NovaWorks`,
    description: dict.hero.subtitle,
  };
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Locale };
  const dict = await getDictionary(lang);

  // Fetch categories server-side
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  let categories: Category[] = [];

  try {
    const response = await fetch(`${API_URL}/categories`, {
      cache: "no-store",
    });
    if (response.ok) {
      categories = await response.json();
    }
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsPageClient
        categories={categories}
        lang={lang}
        dict={dict.products}
      />
    </Suspense>
  );
}
