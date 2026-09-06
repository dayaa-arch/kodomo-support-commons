import { readFile } from "node:fs/promises";
import path from "node:path";

import { SEED_DATASET_PATH } from "../src/modules/facility/infrastructure/JsonFacilityRepository.ts";
import { validateSeedDataset } from "../src/modules/facility/infrastructure/seed-schema.ts";
import {
  CHILD_CONSULTATION_CONTACTS,
  EMERGENCY_CALL_CONTACTS,
} from "../src/shared/domain/emergency-contacts.ts";

const raw = await readFile(path.join(process.cwd(), SEED_DATASET_PATH), "utf8");
const dataset = validateSeedDataset(JSON.parse(raw));
const urls = new Set<string>();

for (const source of dataset.source_catalog) urls.add(source.url);
for (const provider of dataset.support_providers) {
  urls.add(provider.source_url);
  if (provider.official_site_url) urls.add(provider.official_site_url);
}
for (const contact of [
  ...CHILD_CONSULTATION_CONTACTS,
  ...EMERGENCY_CALL_CONTACTS,
]) {
  urls.add(contact.sourceUrl);
}

const timeoutMs = Number(process.env.LINK_AUDIT_TIMEOUT_MS ?? "15000");

async function inspectUrl(url: string): Promise<string | null> {
  let lastError = "不明なエラー";
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: {
          "User-Agent":
            "kodomo-support-commons-link-audit/1.0 (+https://github.com/dayaa-arch/kodomo-support-commons)",
        },
      });
      await response.body?.cancel();
      if (response.status < 400) return null;
      lastError = `HTTP ${response.status} (${response.url})`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    } finally {
      clearTimeout(timeout);
    }
  }
  return `${url}: ${lastError}`;
}

const queue = [...urls];
const failures: string[] = [];
const workers = Array.from({ length: Math.min(6, queue.length) }, async () => {
  while (queue.length > 0) {
    const url = queue.shift();
    if (!url) return;
    const failure = await inspectUrl(url);
    if (failure) failures.push(failure);
  }
});
await Promise.all(workers);

if (failures.length > 0) {
  throw new Error(`リンク監査に失敗しました:\n- ${failures.sort().join("\n- ")}`);
}

process.stdout.write(`リンク監査に成功しました: ${urls.size} URL\n`);
