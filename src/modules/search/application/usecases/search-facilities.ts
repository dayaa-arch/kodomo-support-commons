import type { Facility } from "../../../facility";
import {
  searchFacilities,
  type SearchResult,
} from "../../domain/search-facilities";
import type { SearchAnswers } from "../../domain/search-answers";

export function searchFacilitiesUseCase(
  facilities: readonly Facility[],
  answers: SearchAnswers,
): readonly SearchResult[] {
  return searchFacilities(facilities, answers);
}
