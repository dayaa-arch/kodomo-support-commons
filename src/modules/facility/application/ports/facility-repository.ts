import type { Facility } from "../../domain/facility.ts";

export interface FacilityRepository {
  list(): Promise<readonly Facility[]>;
  findBySlug(slug: string): Promise<Facility | null>;
}
