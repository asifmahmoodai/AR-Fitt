import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { File } from "node:buffer";
import { Hono } from "hono";
import { LocalApkReleaseStore, MAX_APK_SIZE } from "../infra/storage/LocalApkReleaseStore.js";
import { AppReleaseController } from "../adapters/express/controllers/AppReleaseController.js";
import { AdminAuthMiddleware } from "../middleware/admin_auth/AdminAuthMiddleware.js";
import { AdminAuthService } from "../middleware/admin_auth/AdminAuthService.js";
import { InMemoryKV } from "../infra/kv/InMemoryKV.js";
import { apkFixture } from "./fixtures/apkFixture.js";

async function setup(t) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "arfitt-apk-test-"));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const config = { SIGN_ACCESS_TOKEN_PRIVATE_KEY: "isolated-test-secret" };
  const store = new LocalApkReleaseStore(directory);
  const prisma = { user: { findFirst: async ({ where }) => where.id === "test-admin" ? { id: "test-admin", role: "admin", email: "test@example.com" } : null } };
  const auth = new AdminAuthMiddleware(config, new InMemoryKV(), prisma);
  const tokens = await new AdminAuthService(config).generateAdminToken("test-admin", "test@example.com");
  const app = new Hono();
  AppReleaseController.registerRoutes(app, () => new AppReleaseController(store, auth));
  const upload = (file, version = "1.0.0", token = tokens.accessToken) => {
    const form = new FormData(); form.append("apk", file); form.append("version", version);
    return app.request("/admin/app-release", { method: "POST", body: form, headers: token ? { "x-admin-auth-token": `Bearer ${token}` } : {} });
  };
  return { app, store, upload, directory, tokens, config };
}

test("empty download state is public; reading or uploading in admin requires admin authentication", async (t) => {
  const { app, upload, config } = await setup(t);
  assert.equal((await app.request("/app-release")).status, 200);
  assert.equal((await (await app.request("/app-release")).json()).data, null);
  assert.equal((await app.request("/downloads/ARFitt.apk")).status, 404);
  assert.equal((await app.request("/admin/app-release")).status, 401);
  assert.equal((await upload(new File([apkFixture()], "app.apk"), "1.0", null)).status, 401);
  const nonAdmin = await new AdminAuthService(config).generateAdminToken("non-admin", "member@example.com");
  assert.equal((await upload(new File([apkFixture()], "app.apk"), "1.0", nonAdmin.accessToken)).status, 403);
});

test("published APK survives a store restart and downloads unchanged with Android attachment headers", async (t) => {
  const { app, upload, directory } = await setup(t);
  const bytes = apkFixture();
  const response = await upload(new File([bytes], "app-release.apk"), "2.1.0");
  assert.equal(response.status, 201);
  const release = (await response.json()).data;
  assert.equal(release.version, "2.1.0");
  assert.equal(release.size, bytes.length);
  assert.equal((await new LocalApkReleaseStore(directory).getRelease()).id, release.id);
  const download = await app.request(release.downloadPath);
  assert.equal(download.status, 200);
  assert.equal(download.headers.get("content-type"), "application/vnd.android.package-archive");
  assert.equal(download.headers.get("content-disposition"), 'attachment; filename="ARFitt.apk"');
  assert.deepEqual(Buffer.from(await download.arrayBuffer()), bytes);
  const head = await app.request(release.downloadPath, { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal(head.headers.get("content-length"), String(bytes.length));
  assert.equal((await head.arrayBuffer()).byteLength, 0);
});

test("bad archives, non-APK files, missing versions and oversized requests cannot replace the published release", async (t) => {
  const { app, store, upload, tokens } = await setup(t);
  assert.equal((await upload(new File([apkFixture()], "good.apk"))).status, 201);
  const original = await store.getRelease();
  for (const [bytes, name, version] of [
    [Buffer.from("fake apk"), "fake.apk", "2.0"],
    [apkFixture("readme.txt"), "archive.apk", "2.0"],
    [apkFixture(), "archive.zip", "2.0"],
    [apkFixture(), "app.apk", ""],
    [Buffer.alloc(0), "empty.apk", "2.0"],
  ]) assert.equal((await upload(new File([bytes], name), version)).status, 400);
  const oversized = await app.request("/admin/app-release", { method: "POST", body: "x", headers: {
    "content-length": String(MAX_APK_SIZE + 1024 * 1024 + 1), "x-admin-auth-token": `Bearer ${tokens.accessToken}`,
  } });
  assert.equal(oversized.status, 413);
  await assert.rejects(store.publish({ name: "large.apk", size: MAX_APK_SIZE + 1, stream() {} }, "2.0"), { status: 413 });
  assert.equal((await store.getRelease()).id, original.id);
});

test("a new release leaves existing downloads stable; byte ranges support mobile resume", async (t) => {
  const { app, upload } = await setup(t);
  const oldBytes = apkFixture();
  const oldRelease = (await (await upload(new File([oldBytes], "old.apk"))).json()).data;
  const nextBytes = apkFixture("AndroidManifest.xml", Buffer.from("new test manifest"));
  const nextRelease = (await (await upload(new File([nextBytes], "new.apk"), "2.0")).json()).data;
  assert.equal((await (await app.request("/app-release")).json()).data.id, nextRelease.id);
  assert.deepEqual(Buffer.from(await (await app.request(oldRelease.downloadPath)).arrayBuffer()), oldBytes);
  const range = await app.request(nextRelease.downloadPath, { headers: { Range: "bytes=0-9" } });
  assert.equal(range.status, 206);
  assert.equal(range.headers.get("content-range"), `bytes 0-9/${nextBytes.length}`);
  assert.deepEqual(Buffer.from(await range.arrayBuffer()), nextBytes.subarray(0, 10));
  const suffix = await app.request(nextRelease.downloadPath, { headers: { Range: "bytes=-5" } });
  assert.deepEqual(Buffer.from(await suffix.arrayBuffer()), nextBytes.subarray(-5));
  assert.equal((await app.request(nextRelease.downloadPath, { headers: { Range: "bytes=999999-" } })).status, 416);
  assert.equal((await app.request("/downloads/ARFitt.apk?release=../../.env")).status, 404);
});
