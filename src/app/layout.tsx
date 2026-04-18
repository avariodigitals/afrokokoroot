import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Toaster } from "@/components/ui/sonner";
import JsonLd from "@/components/ui/JSONLD";
import { getSiteSettings } from "@/lib/api";
import { siteConfig } from "@/lib/site-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { seoSettings } = await getSiteSettings();
  const publicSiteUrl = seoSettings.publicSiteUrl || siteConfig.url;
  const defaultTitle = seoSettings.defaultTitle || siteConfig.name;
  const defaultDescription = seoSettings.defaultDescription || siteConfig.description;
  const defaultKeywords = seoSettings.defaultKeywords?.length ? seoSettings.defaultKeywords : siteConfig.keywords;

  return {
    metadataBase: new URL(publicSiteUrl),
    title: {
      default: defaultTitle,
      template: `%s | ${defaultTitle}`,
    },
    description: defaultDescription,
    keywords: defaultKeywords,
    authors: [
      {
        name: defaultTitle,
        url: publicSiteUrl,
      },
    ],
    creator: defaultTitle,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: publicSiteUrl,
      title: defaultTitle,
      description: defaultDescription,
      siteName: defaultTitle,
      images: [siteConfig.ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: defaultDescription,
      creator: "@afrokokoroot",
      images: [siteConfig.ogImage],
    },
    verification: {
      google: seoSettings.googleSiteVerification || undefined,
      other: seoSettings.bingSiteVerification
        ? {
            "msvalidate.01": seoSettings.bingSiteVerification,
          }
        : undefined,
    },
    robots: seoSettings.indexingEnabled
      ? {
          index: true,
          follow: true,
        }
      : {
          index: false,
          follow: false,
        },
    manifest: "/site.webmanifest",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = await headers();
  const currentPath = headerStore.get("x-current-path") || "";
  const isAdminRoute = currentPath.startsWith("/admin");
  const { contactInfo, seoSettings, marketingSettings } = await getSiteSettings();
  const publicSiteUrl = seoSettings.publicSiteUrl || siteConfig.url;
  const organizationName = seoSettings.defaultTitle || siteConfig.name;
  const organizationDescription = seoSettings.defaultDescription || siteConfig.description;
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: organizationName,
    description: organizationDescription,
    url: publicSiteUrl,
    logo: siteConfig.ogImage,
    email: contactInfo.email,
    telephone: contactInfo.phone,
    address: contactInfo.address,
    sameAs: Object.values(contactInfo.socials || {}).filter(Boolean),
  };

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {isAdminRoute ? (
          children
        ) : (
          <>
            <JsonLd data={organizationSchema} />
            {marketingSettings.googleAnalyticsId && (
              <>
                <Script
                  src={`https://www.googletagmanager.com/gtag/js?id=${marketingSettings.googleAnalyticsId}`}
                  strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                  {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${marketingSettings.googleAnalyticsId}');`}
                </Script>
              </>
            )}
            {marketingSettings.microsoftClarityId && (
              <Script id="microsoft-clarity" strategy="afterInteractive">
                {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${marketingSettings.microsoftClarityId}");`}
              </Script>
            )}
            {marketingSettings.metaPixelId && (
              <>
                <Script id="meta-pixel" strategy="afterInteractive">
                  {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '${marketingSettings.metaPixelId}'); fbq('track', 'PageView');`}
                </Script>
                <noscript>
                  <img
                    height="1"
                    width="1"
                    style={{ display: "none" }}
                    alt=""
                    src={`https://www.facebook.com/tr?id=${marketingSettings.metaPixelId}&ev=PageView&noscript=1`}
                  />
                </noscript>
              </>
            )}
            <Header />
            <main className="flex-1">
              <Breadcrumbs />
              {children}
            </main>
            <Footer />
            <ScrollToTop />
          </>
        )}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
