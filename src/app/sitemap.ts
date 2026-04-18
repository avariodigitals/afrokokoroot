import { MetadataRoute } from "next";
import { getEvents, getPrograms, getBlogPosts, getPublicSiteUrl } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = await getPublicSiteUrl();

  // Static routes
  const routes = [
    "",
    "/about",
    "/programs",
    "/events",
    "/blog",
    "/contact",
    "/donate",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic routes: Programs
  const programs = await getPrograms();
  const programRoutes = programs.map((program) => ({
    url: `${baseUrl}/programs/${program.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic routes: Events
  const events = await getEvents();
  const eventRoutes = events.map((event) => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: new Date().toISOString(), // In a real app, use event.updatedAt
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Dynamic routes: Blog Posts
  const blogPosts = await getBlogPosts();
  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date).toISOString() : new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...routes, ...programRoutes, ...eventRoutes, ...blogRoutes];
}
