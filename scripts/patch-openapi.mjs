#!/usr/bin/env node
/**
 * Patch generated OpenAPI client after gen:api:
 * - TOKEN: use async resolver for localStorage accessToken
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const openApiPath = join(__dirname, "../lib/api/core/OpenAPI.ts");

if (!existsSync(openApiPath)) {
  console.warn("patch-openapi: OpenAPI.ts not found, run gen:api first.");
  process.exit(0);
}

let content = readFileSync(openApiPath, "utf-8");

const tokenPatched = content.replace(
  "TOKEN: undefined,",
  "TOKEN: async () => (typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null) || '',"
);

if (content !== tokenPatched) {
  content = tokenPatched;
  writeFileSync(openApiPath, content);
  console.log("patch-openapi: Patched TOKEN in OpenAPI.ts");
} else {
  console.log("patch-openapi: TOKEN already patched or pattern not found");
}

process.exit(0);
