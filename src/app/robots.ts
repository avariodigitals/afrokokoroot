import { MetadataRoute } from "next";
import { getPublicSiteUrl, getSeoSettings } from "@/lib/api";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seoSettings = await getSeoSettings();
  const publicSiteUrl = await getPublicSiteUrl();

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
    sitemap: `${publicSiteUrl}/sitemap.xml`,
  };
}
