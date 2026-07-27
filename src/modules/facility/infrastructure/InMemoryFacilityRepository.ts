import type { FacilityRepository } from "../application/ports/facility-repository.ts";
import type { Facility } from "../domain/facility.ts";

export class InMemoryFacilityRepository implements FacilityRepository {
  readonly #facilities: readonly Facility[];

  constructor(facilities: readonly Facility[]) {
    this.#facilities = facilities;
  }

  async list(): Promise<readonly Facility[]> {
    return this.#facilities;
  }

  async findBySlug(slug: string): Promise<Facility | null> {
    return this.#facilities.find((facility) => facility.slug === slug) ?? null;
  }
}
