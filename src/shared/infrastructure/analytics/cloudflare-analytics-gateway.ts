import type {
  AnalyticsEvent,
  AnalyticsGateway,
} from "../../application/ports/analytics-gateway";

const analyticsEnabled =
  process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true";

export const cloudflareAnalyticsGateway: AnalyticsGateway = {
  track(event: AnalyticsEvent, facilitySlug: string) {
    if (!analyticsEnabled || typeof window === "undefined") return;

    void fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, slug: facilitySlug }),
      credentials: "omit",
      keepalive: true,
    }).catch(() => {
      // 分析の失敗は、支援情報の閲覧や外部サイトへの移動を妨げない。
    });
  },
};
