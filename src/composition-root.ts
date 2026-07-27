import { getFacilityDetail as getFacilityDetailUseCase } from "@/src/modules/facility/application/usecases/get-facility-detail";
import { listFacilities as listFacilitiesUseCase } from "@/src/modules/facility/application/usecases/list-facilities";
import { listFacilitySlugs as listFacilitySlugsUseCase } from "@/src/modules/facility/application/usecases/list-facility-slugs";
import { InMemoryFacilityRepository } from "@/src/modules/facility/infrastructure/InMemoryFacilityRepository";
import { MOCK_FACILITIES } from "@/src/modules/facility/infrastructure/mock-facilities";

const facilityRepository = new InMemoryFacilityRepository(MOCK_FACILITIES);

export function getFacilities() {
  return listFacilitiesUseCase(facilityRepository);
}

export function getFacilityDetail(slug: string) {
  return getFacilityDetailUseCase(facilityRepository, slug);
}

export function getFacilitySlugs() {
  return listFacilitySlugsUseCase(facilityRepository);
}
