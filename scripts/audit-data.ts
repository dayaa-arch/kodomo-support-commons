import { readFile } from "node:fs/promises";
import path from "node:path";

import { assertDatasetFreshness } from "../src/modules/facility/infrastructure/data-audit.ts";
import { SEED_DATASET_PATH } from "../src/modules/facility/infrastructure/JsonFacilityRepository.ts";
import { validateSeedDataset } from "../src/modules/facility/infrastructure/seed-schema.ts";
import {
  CHILD_CONSULTATION_CONTACTS,
  EMERGENCY_CALL_CONTACTS,
} from "../src/shared/domain/emergency-contacts.ts";

const raw = await readFile(path.join(process.cwd(), SEED_DATASET_PATH), "utf8");
const dataset = validateSeedDataset(JSON.parse(raw));
assertDatasetFreshness(dataset);

process.stdout.write(
  `データ監査に成功しました: 施設 ${dataset.support_providers.length} 件、緊急相談先 ${CHILD_CONSULTATION_CONTACTS.length + EMERGENCY_CALL_CONTACTS.length} 件\n`,
);
