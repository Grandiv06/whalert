/**
 * Central env/config. Use these instead of process.env in app code.
 * NEXT_PUBLIC_* are inlined at build time and available on client.
 */

function getEnv(key: string): string {
  if (typeof process === "undefined" || process.env === undefined) return "";
  return process.env[key] ?? "";
}

/** Base URL for the backend API (no trailing slash). Used by generated API client. */
export function getApiBaseUrl(): string {
  return getEnv("NEXT_PUBLIC_API_BASE_URL") || "https://core.whalert.net";
}

/** OpenAPI spec URL for codegen (optional; defaults to API_BASE_URL + /swagger/v1/swagger.json). */
export function getOpenApiSpecUrl(): string {
  const custom = getEnv("OPENAPI_SPEC_URL");
  if (custom) return custom;
  return `${getApiBaseUrl()}/swagger/v1/swagger.json`;
}

export const env = {
  apiBaseUrl: getApiBaseUrl(),
  openApiSpecUrl: getOpenApiSpecUrl(),
} as const;
