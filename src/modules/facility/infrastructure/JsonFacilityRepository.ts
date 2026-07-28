import { readFile } from "node:fs/promises";
import path from "node:path";

import type { FacilityRepository } from "../application/ports/facility-repository.ts";
import type { Facility } from "../domain/facility.ts";
import { toFacilities } from "./seed-mapper.ts";
import { validateSeedDataset } from "./seed-schema.ts";

/** 施設情報の正本。PR で更新され、公開前にレビューされる。 */
export const SEED_DATASET_PATH = "data/seed/yokohama_support_seed_v0.1.json";

/**
 * 正本 JSON から施設情報を供給する FacilityRepository の実装。
 *
 * 読み込み時に検証し、不正なデータがあれば例外を投げてビルドを失敗させる
 * （不正データを公開しないため）。結果はプロセス内でメモ化する。
 */
export class JsonFacilityRepository implements FacilityRepository {
  readonly #datasetPath: string;
  #cache: Promise<readonly Facility[]> | null = null;

  constructor(datasetPath: string = path.join(process.cwd(), SEED_DATASET_PATH)) {
    this.#datasetPath = datasetPath;
  }

  async list(): Promise<readonly Facility[]> {
    this.#cache ??= this.#load();
    return this.#cache;
  }

  async findBySlug(slug: string): Promise<Facility | null> {
    const facilities = await this.list();
    return facilities.find((facility) => facility.slug === slug) ?? null;
  }

  async #load(): Promise<readonly Facility[]> {
    const raw = await readFile(this.#datasetPath, "utf8");
    return toFacilities(validateSeedDataset(JSON.parse(raw)));
  }
}
