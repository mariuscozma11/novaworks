import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { i18n, type Locale } from "@/lib/i18n";
import { AuthProvider } from "@/components/auth-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { Providers } from "@/components/providers";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export const metadata: Metadata = {
  title: "NovaWorks - 3D Printed Parts",
  description: "Premium 3D printed parts and custom creations",
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params as { lang: Locale };

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <Providers>
          <AuthProvider>
            <LayoutWrapper
              navbar={<Navbar lang={lang} />}
              footer={<Footer lang={lang} />}
            >
              {children}
            </LayoutWrapper>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
