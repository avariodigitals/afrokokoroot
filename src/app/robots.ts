import { MetadataRoute } from "next";
import { getSeoSettings } from "@/lib/api";
import { siteConfig } from "@/lib/site-config";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seoSettings = await getSeoSettings();

  return {
    rules: seoSettings.indexingEnabled
      ? {
          userAgent: "*",
          allow: "/",
          disallow: ["/admin/", "/api/"],
        }
      : {
          userAgent: "*",
          disallow: "/",
        },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
