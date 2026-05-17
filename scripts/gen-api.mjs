#!/usr/bin/env node
/**
 * Generate API client from OpenAPI spec.
 * Uses OPENAPI_SPEC_URL or NEXT_PUBLIC_API_BASE_URL + /swagger/v1/swagger.json from .env.local / .env
 */
import { spawnSync } from "child_process";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "fs";
import { tmpdir } from "os";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Load .env then .env.local so local overrides win.
function loadEnv() {
  const vars = {};
  for (const name of [".env", ".env.local"]) {
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
const apiBase = env.NEXT_PUBLIC_API_BASE_URL || "http://api.whalert.net";
const specUrl = env.OPENAPI_SPEC_URL || `${apiBase}/swagger/v1/swagger.json`;
const output = join(root, "lib", "api");

console.log("OpenAPI spec:", specUrl);
console.log("Output:", output);

const response = await fetch(specUrl, {
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});

if (!response.ok) {
  console.error(`gen-api: failed to download OpenAPI spec (${response.status} ${response.statusText})`);
  process.exit(1);
}

const spec = await response.json();
const specPath = mkdtempSync(join(tmpdir(), "whalert-openapi-"));
const specFile = join(specPath, "swagger.json");
writeFileSync(specFile, JSON.stringify(spec, null, 2));

const result = spawnSync(
  "npx",
  [
    "openapi-typescript-codegen",
    "--input",
    specFile,
    "--output",
    output,
    "--client",
    "axios",
  ],
  {
    stdio: "inherit",
    cwd: root,
  }
);

if (result.status !== 0) {
  rmSync(specPath, { recursive: true, force: true });
  process.exit(result.status ?? 1);
}

const expectedOps = [];
for (const [url, pathItem] of Object.entries(spec.paths || {})) {
  for (const method of ["get", "post", "put", "delete", "patch", "head", "options"]) {
    if (pathItem?.[method]) expectedOps.push(`${method.toUpperCase()} ${url}`);
  }
}

const serviceDir = join(output, "services");
const generatedOps = new Set();
for (const fileName of readdirSync(serviceDir).filter((name) => name.endsWith(".ts"))) {
  const serviceContent = readFileSync(join(serviceDir, fileName), "utf-8");
  for (const match of serviceContent.matchAll(/method:\s*'([^']+)'[\s\S]*?url:\s*'([^']+)'/g)) {
    generatedOps.add(`${match[1].toUpperCase()} ${match[2]}`);
  }
}

const missingOps = expectedOps.filter((operation) => !generatedOps.has(operation));
rmSync(specPath, { recursive: true, force: true });

if (missingOps.length > 0) {
  console.error(`gen-api: generated client is missing ${missingOps.length} OpenAPI operations:`);
  for (const operation of missingOps) console.error(`- ${operation}`);
  process.exit(1);
}

console.log(`gen-api: verified ${generatedOps.size}/${expectedOps.length} OpenAPI operations.`);
console.log("gen-api: done. Run node scripts/patch-openapi.mjs to apply patches.");
process.exit(0);
