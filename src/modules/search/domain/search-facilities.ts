import type { Facility } from "../../facility/index.ts";
import { ADJACENT_WARDS } from "../../../shared/domain/wards.ts";
import type { SearchAnswers } from "./search-answers.ts";

export type LocationMatch = "selected" | "adjacent";

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

export function searchFacilities(
  facilities: readonly Facility[],
  answers: SearchAnswers,
): readonly SearchResult[] {
  const adjacentWards = ADJACENT_WARDS[answers.ward];

  return facilities
    .filter(
      (facility) =>
        facility.ward === answers.ward || adjacentWards.includes(facility.ward),
    )
    .map((facility) => ({
      facility,
      matchScore: calculateMatchScore(facility, answers),
      locationMatch:
        facility.ward === answers.ward
          ? ("selected" as const)
          : ("adjacent" as const),
    }))
    .sort((left, right) => {
      if (left.locationMatch !== right.locationMatch) {
        return left.locationMatch === "selected" ? -1 : 1;
      }

      if (left.matchScore !== right.matchScore) {
        return right.matchScore - left.matchScore;
      }

      return left.facility.name.localeCompare(right.facility.name, "ja");
    });
}
