#!/usr/bin/env node
/**
 * Generate API client from OpenAPI spec.
 * Uses OPENAPI_SPEC_URL or NEXT_PUBLIC_API_BASE_URL + /swagger/v1/swagger.json from .env.local / .env
 */
import { spawnSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Load .env.local then .env (Next.js order)
function loadEnv() {
  const vars = {};
  for (const name of [".env.local", ".env"]) {
    const path = join(root, name);
    if (!existsSync(path)) continue;
    const content = readFileSync(path, "utf-8");
    for (const line of content.split("\n")) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (m) vars[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
    }
  }
  return vars;
}

const env = loadEnv();
const apiBase = env.NEXT_PUBLIC_API_BASE_URL || "https://core.whalert.net";
const specUrl = env.OPENAPI_SPEC_URL || `${apiBase}/swagger/v1/swagger.json`;
const output = join(root, "lib", "api");

console.log("OpenAPI spec:", specUrl);
console.log("Output:", output);

const result = spawnSync(
  "npx",
  [
    "openapi-typescript-codegen",
    "--input",
    specUrl,
    "--output",
    output,
    "--client",
    "axios",
  ],
  {
    stdio: "inherit",
    cwd: root,
    shell: true,
  }
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log("gen-api: done. Run node scripts/patch-openapi.mjs to apply patches.");
process.exit(0);
