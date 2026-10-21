import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import net from "node:net";
import { fileURLToPath } from "node:url";

const SERVER = fileURLToPath(
  new URL("../claudeville/server.js", import.meta.url),
);

async function freePort() {
  const srv = net.createServer().listen(0, "127.0.0.1");
  await once(srv, "listening");
  const { port } = srv.address();
  srv.close();
  return port;
}

async function startServer(env) {
  const child = spawn(process.execPath, [SERVER], {
    env: { ...process.env, ...env },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let out = "";
  child.stdout.on("data", (d) => {
    out += d;
  });
  child.stderr.on("data", (d) => {
    out += d;
  });
  const deadline = Date.now() + 5000;
  while (!out.includes("서버 실행 중") && Date.now() < deadline) {
    if (child.exitCode !== null) break;
    await new Promise((r) => setTimeout(r, 50));
  }
  return { child, output: () => out };
}

function listensOn(host, port) {
  return new Promise((resolve) => {
    const sock = net.connect({ host, port }, () => {
      sock.destroy();
      resolve(true);
    });
    sock.on("error", () => resolve(false));
  });
}

test("PORT 로 포트를 바꾸고 기본으로 127.0.0.1 에만 연다", async (t) => {
  const port = await freePort();
  const { child, output } = await startServer({ PORT: String(port), HOST: "" });
  t.after(() => child.kill());
  assert.ok(output().includes(`127.0.0.1:${port}`), output());
  assert.equal(await listensOn("127.0.0.1", port), true);
  const external = (await import("node:os")).networkInterfaces();
  const addr = Object.values(external)
    .flat()
    .find((a) => a && a.family === "IPv4" && !a.internal);
  if (addr) assert.equal(await listensOn(addr.address, port), false);
});
