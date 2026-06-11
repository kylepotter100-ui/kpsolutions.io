import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/metadata";

export const dynamic = "force-static";

const routes: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/services", priority: 0.9 },
  { path: "/work", priority: 0.8 },
  { path: "/work/potter-sanctuary", priority: 0.7 },
  { path: "/process", priority: 0.9 },
  { path: "/pricing", priority: 0.9 },
  { path: "/contact", priority: 0.8 },
  { path: "/privacy", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
  { path: "/cookies", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  return routes.map(({ path, priority }) => ({
    url: `${baseUrl}${path === "/" ? "" : path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority,
  }));
}
