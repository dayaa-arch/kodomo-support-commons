import type { Facility } from "../../domain/facility.ts";
import type { FacilityRepository } from "../ports/facility-repository.ts";

export async function listFacilities(
  repository: FacilityRepository,
): Promise<readonly Facility[]> {
  return repository.list();
}
