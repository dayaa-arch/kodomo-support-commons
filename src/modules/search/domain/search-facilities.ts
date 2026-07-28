import type { Facility } from "../../facility/index.ts";
import { ADJACENT_WARDS, type Ward } from "../../../shared/domain/wards.ts";
import type { SearchAnswers } from "./search-answers.ts";

/**
 * 検索結果に含まれた理由（所在地の観点）。
 * citywide は区に属さない市域全体の窓口を表す。
 */
export type LocationMatch = "selected" | "citywide" | "adjacent";

/** 表示順。選択区を最優先し、区を問わず使える市域全体の窓口を隣接区より前に置く。 */
const LOCATION_MATCH_ORDER: Readonly<Record<LocationMatch, number>> = {
  selected: 0,
  citywide: 1,
  adjacent: 2,
};

export interface SearchResult {
  readonly facility: Facility;
  readonly matchScore: number;
  readonly locationMatch: LocationMatch;
}

export function calculateMatchScore(
  facility: Facility,
  answers: SearchAnswers,
): number {
  let score = 0;

  if (
    answers.supportTheme !== "other" &&
    facility.supportThemes.includes(answers.supportTheme)
  ) {
    score += 4;
  }

  if (
    answers.targetAudience !== "other" &&
    facility.targetAudiences.includes(answers.targetAudience)
  ) {
    score += 2;
  }

  if (
    answers.targetAudience === "guardian" &&
    facility.guardianOnlyConsultation === true
  ) {
    score += 1;
  }

  if (
    answers.targetAudience === "child" &&
    facility.anonymousConsultation === true
  ) {
    score += 1;
  }

  return score;
}

/**
 * 施設が検索対象に入るかを所在地の観点で判定する。null は対象外。
 * 区を持たない施設は市域全体の窓口として、選んだ区にかかわらず常に含める。
 */
function resolveLocationMatch(
  facility: Facility,
  selectedWard: Ward,
  adjacentWards: readonly Ward[],
): LocationMatch | null {
  if (facility.ward === null) {
    return "citywide";
  }
  if (facility.ward === selectedWard) {
    return "selected";
  }
  if (adjacentWards.includes(facility.ward)) {
    return "adjacent";
  }
  return null;
}

export function searchFacilities(
  facilities: readonly Facility[],
  answers: SearchAnswers,
): readonly SearchResult[] {
  const adjacentWards = ADJACENT_WARDS[answers.ward];

  return facilities
    .map((facility) => ({
      facility,
      locationMatch: resolveLocationMatch(facility, answers.ward, adjacentWards),
    }))
    .filter(
      (
        candidate,
      ): candidate is { facility: Facility; locationMatch: LocationMatch } =>
        candidate.locationMatch !== null,
    )
    .map(({ facility, locationMatch }) => ({
      facility,
      matchScore: calculateMatchScore(facility, answers),
      locationMatch,
    }))
    .sort((left, right) => {
      if (left.locationMatch !== right.locationMatch) {
        return (
          LOCATION_MATCH_ORDER[left.locationMatch] -
          LOCATION_MATCH_ORDER[right.locationMatch]
        );
      }

      if (left.matchScore !== right.matchScore) {
        return right.matchScore - left.matchScore;
      }

      return left.facility.name.localeCompare(right.facility.name, "ja");
    });
}
