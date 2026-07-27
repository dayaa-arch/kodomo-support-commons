import type { Facility } from "../../domain/facility.ts";
import type { FacilityRepository } from "../ports/facility-repository.ts";

export async function getFacilityDetail(
  repository: FacilityRepository,
  slug: string,
): Promise<Facility | null> {
  return repository.findBySlug(slug);
}
