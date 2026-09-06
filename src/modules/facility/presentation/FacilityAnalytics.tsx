"use client";

import { useEffect } from "react";

import { cloudflareAnalyticsGateway } from "@/src/shared/infrastructure/analytics/cloudflare-analytics-gateway";
import { Icon } from "@/src/shared/presentation/Icon";

export function FacilityAnalytics({
  slug,
  officialUrl,
}: {
  readonly slug: string;
  readonly officialUrl: string | null;
}) {
  useEffect(() => {
    cloudflareAnalyticsGateway.track("facility_detail_view", slug);
  }, [slug]);

  if (!officialUrl) return null;

  return (
    <a
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-700 px-6 py-3 font-black text-white shadow-[0_8px_20px_rgba(22,111,175,0.2)] transition hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
      href={officialUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        cloudflareAnalyticsGateway.track("official_site_click", slug)
      }
    >
      公式サイトを見る<Icon name="external-link" className="size-4" />
      <span className="sr-only">（新しいタブで開きます）</span>
    </a>
  );
}
