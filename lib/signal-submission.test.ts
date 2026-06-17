import test from "node:test";
import assert from "node:assert/strict";

import {
  buildSignalProviderJsonPayload,
  buildSignalProviderMultipartPayload,
  createSignalSubmissionService,
  normalizeSignalImageBase64,
  validateSignalImageFile,
} from "./signal-submission";
import { SignalSide } from "./api/models/SignalSide";

test("normalizeSignalImageBase64 keeps data URLs intact", () => {
  assert.equal(
    normalizeSignalImageBase64("data:image/png;base64,abc123"),
    "data:image/png;base64,abc123",
  );
});

test("normalizeSignalImageBase64 prefixes raw base64 payloads", () => {
  assert.equal(
    normalizeSignalImageBase64("  abc123  "),
    "data:image/png;base64,abc123",
  );
});

test("buildSignalProviderJsonPayload preserves chart screenshot data URLs", () => {
  const payload = buildSignalProviderJsonPayload({
    direction: "LONG",
    symbol: "XAUUSD",
    entryPoint: 2400,
    stopLoss: 2380,
    takeProfits: [2420],
    description: "manual",
    picture: { kind: "base64", imageBase64: "data:image/png;base64,abc123" },
  });

  assert.deepEqual(payload, {
    direction: "LONG",
    symbol: "XAUUSD",
    entryPoint: 2400,
    stopLoss: 2380,
    takeProfits: [2420],
    description: "manual",
    imageBase64: "data:image/png;base64,abc123",
  });
});

test("buildSignalProviderMultipartPayload maps file uploads to form payloads", () => {
  const file = new File([new Uint8Array([1, 2, 3])], "chart.png", {
    type: "image/png",
  });

  const payload = buildSignalProviderMultipartPayload({
    direction: "SHORT",
    symbol: "MAZAANE",
    entryPoint: 100,
    stopLoss: 110,
    takeProfits: [90, 80],
    description: "file",
    picture: { kind: "file", file },
  });

  assert.equal(payload.Symbol, "MAZAANE");
  assert.equal(payload.EntryPoint, 100);
  assert.equal(payload.Sl, 110);
  assert.equal(payload.TPs, JSON.stringify([90, 80]));
  assert.equal(payload.Description, "file");
  assert.equal(payload.Side, SignalSide._2);
  assert.equal(payload.Picture, file);
});

test("createSignalSubmissionService routes by attachment kind", async () => {
  let jsonPayload: unknown = null;
  let multipartPayload: unknown = null;

  const submitSignal = createSignalSubmissionService({
    submitJson: async (payload) => {
      jsonPayload = payload;
    },
    submitMultipart: async (payload) => {
      multipartPayload = payload;
    },
  });

  await submitSignal({
    direction: "LONG",
    symbol: "XAUUSD",
    entryPoint: 1,
    stopLoss: 2,
    takeProfits: [3],
    picture: { kind: "base64", imageBase64: "abc123" },
  });

  assert.ok(jsonPayload);
  assert.equal(multipartPayload, null);

  const file = new File([new Uint8Array([1])], "chart.png", { type: "image/png" });
  await submitSignal({
    direction: "SHORT",
    symbol: "MAZAANE",
    entryPoint: 1,
    stopLoss: 2,
    takeProfits: [3],
    picture: { kind: "file", file },
  });

  assert.ok(multipartPayload);
});

test("validateSignalImageFile rejects invalid attachments", () => {
  const file = new File([new Uint8Array([1])], "chart.txt", { type: "text/plain" });
  assert.equal(validateSignalImageFile(file), "فقط تصویر JPG، PNG، WebP یا GIF مجاز است.");
});
