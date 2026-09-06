import type { MetadataRoute } from "next";

import {
  ALLOW_INDEXING,
  SITE_URL,
  absoluteSiteUrl,
} from "@/src/shared/domain/site-config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (!ALLOW_INDEXING) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteSiteUrl("/sitemap.xml"),
    host: SITE_URL.origin,
  };
}
