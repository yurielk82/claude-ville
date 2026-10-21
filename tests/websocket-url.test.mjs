import { test } from "node:test";
import assert from "node:assert/strict";

async function urlFor(protocol, host) {
  globalThis.window = { location: { protocol, host } };
  const { WebSocketClient } = await import(
    `../claudeville/src/infrastructure/WebSocketClient.js?${protocol}${host}`
  );
  return new WebSocketClient().url;
}

test("https 페이지는 wss 로 연결한다", async () => {
  assert.equal(
    await urlFor("https:", "cv.dvsharp.com"),
    "wss://cv.dvsharp.com",
  );
});

test("http 페이지는 ws 로 연결한다", async () => {
  assert.equal(await urlFor("http:", "localhost:4000"), "ws://localhost:4000");
});
