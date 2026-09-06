import type { MetadataRoute } from "next";

import { getFacilities } from "@/src/composition-root";
import { absoluteSiteUrl } from "@/src/shared/domain/site-config";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const facilities = await getFacilities();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteSiteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteSiteUrl("/search"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteSiteUrl("/privacy"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteSiteUrl("/terms"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteSiteUrl("/data-policy"), changeFrequency: "monthly", priority: 0.5 },
  ];

  return [
    ...staticRoutes,
    ...facilities.map((facility) => ({
      url: absoluteSiteUrl(`/facilities/${facility.slug}`),
      lastModified: facility.lastCheckedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
