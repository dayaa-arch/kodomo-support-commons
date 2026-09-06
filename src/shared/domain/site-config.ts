export const SITE_NAME = "よこはま支援さがし";
export const SITE_DESCRIPTION =
  "横浜市内の子ども・家庭向け支援情報を、3問から探して比較できるOSSプロジェクトです。";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL = new URL(
  configuredSiteUrl || "https://kodomo-support-commons.pages.dev",
);

export const ALLOW_INDEXING =
  Boolean(configuredSiteUrl) && process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

export function absoluteSiteUrl(pathname: string): string {
  return new URL(pathname, SITE_URL).toString();
}
