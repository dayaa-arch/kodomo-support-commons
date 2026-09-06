export const ANALYTICS_EVENTS = [
  "facility_detail_view",
  "official_site_click",
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

export interface AnalyticsGateway {
  track(event: AnalyticsEvent, facilitySlug: string): void;
}
