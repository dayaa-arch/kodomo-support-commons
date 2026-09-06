export const SITE_NAME = "よこはま支援さがし";
export const SITE_DESCRIPTION =
  "3つの質問に答えて、横浜市内の子ども・家庭向けの相談窓口や居場所を探せます。対象者や相談方法、受付時間を比べて、支援先を選べます。";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL = new URL(
  configuredSiteUrl || "https://kodomo-support-commons.pages.dev",
);

export const ALLOW_INDEXING =
  Boolean(configuredSiteUrl) && process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

export function absoluteSiteUrl(pathname: string): string {
  return new URL(pathname, SITE_URL).toString();
}
