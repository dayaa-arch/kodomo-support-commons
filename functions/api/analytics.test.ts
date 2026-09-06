import assert from "node:assert/strict";
import test from "node:test";

import {
  onRequest,
  type AnalyticsEngineDatasetBinding,
} from "./analytics.ts";

const VALID_SLUG = "ward-child-family-tsurumi";

function createBinding() {
  const points: Parameters<AnalyticsEngineDatasetBinding["writeDataPoint"]>[0][] = [];
  return {
    points,
    binding: {
      writeDataPoint(point) {
        points.push(point);
      },
    } satisfies AnalyticsEngineDatasetBinding,
  };
}

function createRequest(
  body: unknown,
  options: { readonly method?: string; readonly origin?: string } = {},
) {
  return new Request("https://example.pages.dev/api/analytics", {
    method: options.method ?? "POST",
    headers: {
      "Content-Type": "application/json",
      ...(options.origin ? { Origin: options.origin } : {}),
    },
    body: options.method === "GET" ? undefined : JSON.stringify(body),
  });
}

test("許可したイベント名と施設slugだけを保存する", async () => {
  const { binding, points } = createBinding();
  const result = await onRequest({
    request: createRequest({ event: "facility_detail_view", slug: VALID_SLUG }),
    env: { ANALYTICS: binding },
  });

  assert.equal(result.status, 204);
  assert.deepEqual(points, [
    {
      indexes: [],
      blobs: ["facility_detail_view", VALID_SLUG],
      doubles: [],
    },
  ]);
});

test("未知イベント、未知slug、余分な項目を拒否する", async () => {
  const { binding, points } = createBinding();
  for (const body of [
    { event: "page_view", slug: VALID_SLUG },
    { event: "official_site_click", slug: "unknown" },
    { event: "official_site_click", slug: VALID_SLUG, userAgent: "secret" },
  ]) {
    const result = await onRequest({
      request: createRequest(body),
      env: { ANALYTICS: binding },
    });
    assert.equal(result.status, 400);
  }
  assert.deepEqual(points, []);
});

test("GETとcross-origin POSTを拒否する", async () => {
  const { binding } = createBinding();
  const getResult = await onRequest({
    request: createRequest(null, { method: "GET" }),
    env: { ANALYTICS: binding },
  });
  assert.equal(getResult.status, 405);

  const crossOriginResult = await onRequest({
    request: createRequest(
      { event: "official_site_click", slug: VALID_SLUG },
      { origin: "https://attacker.example" },
    ),
    env: { ANALYTICS: binding },
  });
  assert.equal(crossOriginResult.status, 403);
});

test("binding未設定時は保存せず503を返す", async () => {
  const result = await onRequest({
    request: createRequest({ event: "facility_detail_view", slug: VALID_SLUG }),
    env: {},
  });
  assert.equal(result.status, 503);
});

test("不正JSON、過大body、誤ったContent-Typeを拒否する", async () => {
  const { binding } = createBinding();
  const invalidJson = await onRequest({
    request: new Request("https://example.pages.dev/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{",
    }),
    env: { ANALYTICS: binding },
  });
  assert.equal(invalidJson.status, 400);

  const oversized = await onRequest({
    request: new Request("https://example.pages.dev/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "x".repeat(1025),
    }),
    env: { ANALYTICS: binding },
  });
  assert.equal(oversized.status, 413);

  const wrongContentType = await onRequest({
    request: new Request("https://example.pages.dev/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ event: "facility_detail_view", slug: VALID_SLUG }),
    }),
    env: { ANALYTICS: binding },
  });
  assert.equal(wrongContentType.status, 415);
});
