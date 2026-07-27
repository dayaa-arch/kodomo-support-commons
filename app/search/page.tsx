import { getFacilities } from "@/src/composition-root";
import { SearchResultsScreen } from "@/src/modules/search/presentation/SearchResultsScreen";

export default async function SearchPage() {
  const facilities = await getFacilities();
  return <SearchResultsScreen facilities={facilities} />;
}
