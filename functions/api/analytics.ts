import seedDataset from "../../data/seed/yokohama_support_seed_v0.1.json" with { type: "json" };

const ALLOWED_EVENTS = new Set([
  "facility_detail_view",
  "official_site_click",
]);
const FACILITY_SLUGS = new Set(
  seedDataset.support_providers.map((provider) => provider.id),
);
const MAX_BODY_SIZE = 1024;

export interface AnalyticsEngineDatasetBinding {
  writeDataPoint(point: {
    readonly indexes: readonly string[];
    readonly blobs: readonly string[];
    readonly doubles: readonly number[];
  }): void;
}

export interface AnalyticsFunctionContext {
  readonly request: Request;
  readonly env: {
    readonly ANALYTICS?: AnalyticsEngineDatasetBinding;
  };
}

function response(status: number, message?: string): Response {
  return new Response(message ?? null, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...(status === 405 ? { Allow: "POST" } : {}),
    },
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function onRequest(
  context: AnalyticsFunctionContext,
): Promise<Response> {
  const { request, env } = context;
  if (request.method !== "POST") return response(405, "Method Not Allowed");

  const requestUrl = new URL(request.url);
  const origin = request.headers.get("Origin");
  if (
    (origin && origin !== requestUrl.origin) ||
    request.headers.get("Sec-Fetch-Site") === "cross-site"
  ) {
    return response(403, "Forbidden");
  }

  if (!request.headers.get("Content-Type")?.startsWith("application/json")) {
    return response(415, "Content-Type must be application/json");
  }

  const contentLength = Number(request.headers.get("Content-Length") ?? "0");
  if (contentLength > MAX_BODY_SIZE) return response(413, "Payload Too Large");

  let bodyText: string;
  let body: unknown;
  try {
    bodyText = await request.text();
    if (new TextEncoder().encode(bodyText).byteLength > MAX_BODY_SIZE) {
      return response(413, "Payload Too Large");
    }
    body = JSON.parse(bodyText);
  } catch {
    return response(400, "Invalid JSON");
  }

  if (!isRecord(body)) return response(400, "Invalid payload");
  const keys = Object.keys(body).sort();
  if (keys.length !== 2 || keys[0] !== "event" || keys[1] !== "slug") {
    return response(400, "Only event and slug are accepted");
  }
  if (typeof body.event !== "string" || !ALLOWED_EVENTS.has(body.event)) {
    return response(400, "Unknown event");
  }
  if (typeof body.slug !== "string" || !FACILITY_SLUGS.has(body.slug)) {
    return response(400, "Unknown facility slug");
  }
  if (!env.ANALYTICS) return response(503, "Analytics binding is unavailable");

  try {
    env.ANALYTICS.writeDataPoint({
      indexes: [],
      blobs: [body.event, body.slug],
      doubles: [],
    });
  } catch {
    return response(503, "Analytics write failed");
  }

  return response(204);
}
