import type { Metadata } from "next";

import { getFacilities } from "@/src/composition-root";
import { SearchResultsScreen } from "@/src/modules/search/presentation/SearchResultsScreen";

export const metadata: Metadata = {
  title: "支援先の検索結果",
  alternates: { canonical: "/search" },
};

export default async function SearchPage() {
  const facilities = await getFacilities();
  return <SearchResultsScreen facilities={facilities} />;
}
