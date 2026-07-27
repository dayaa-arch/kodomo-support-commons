import type { FacilityRepository } from "../ports/facility-repository.ts";

export async function listFacilitySlugs(
  repository: FacilityRepository,
): Promise<readonly string[]> {
  const facilities = await repository.list();
  return facilities.map((facility) => facility.slug);
}
