import assert from "node:assert/strict";
import fs from "node:fs"; import os from "node:os"; import path from "node:path";
import * as m from "../lib/index.js";
const tools = new Map(); let onUpdated; let prompt = "";
const cfg = { provider: "bing", legacyYamlMigrated: true, imageProviderOrder: ["openverse", "wikimedia"] };
const sctx = {
  effect(fn) { fn(); }, on(ev, h) { if (ev === "settings/document-updated") onUpdated = h; }, get: () => undefined,
  settings: { configure() { return () => {}; }, describe() { return []; }, async mutate() {} },
  tools: { register(t) { tools.set(t.name, t); return () => tools.delete(t.name); } },
  webServer: { register() { return () => {}; } },
  systemPrompt: { section(s) { prompt = s.text; return () => {}; } },
};
const ctx = { logger: { info() {}, warn(x) { console.log("WARN", x); }, error() {} }, inject: (d, cb) => cb(sctx), get: () => undefined, web: { searchProviderId: "ddg", registerSearchProvider() { return () => {}; } }, fiber: {} };
process.env.DSH_HOME = "/nonexistent";
m.apply(ctx, cfg);
for (const n of ["image_search", "page_images", "save_images"]) assert.ok(tools.has(n), n);
assert.ok(prompt.includes("image_search: image libraries, tried in this order: openverse > wikimedia > pexels"));
// toggle off / on live
cfg.pageImagesEnabled = false; onUpdated("web-search-free");
assert.ok(!tools.has("page_images") && tools.has("image_search"));
assert.ok(!prompt.includes("page_images:"));
cfg.pageImagesEnabled = true; onUpdated("web-search-free");
assert.ok(tools.has("page_images"));
// image_search executes (openverse mocked)
globalThis.fetch = async (url) => new Response(JSON.stringify({ result_count: 1, results: [{ url: "https://93.184.216.34/cat.jpg", thumbnail: "https://93.184.216.34/t.jpg", width: 800, height: 600, title: "Cat", foreign_landing_url: "https://93.184.216.34/page" }] }), { headers: { "content-type": "application/json" } });
const tool = tools.get("image_search");
const out = await tool.execute({ query: "cat" }, { signal: undefined });
assert.equal(out.provider, "openverse"); assert.equal(out.images.length, 1);
const text = tool.output.render({ query: "cat" }, out)[0].text;
assert.match(text, /untrusted-web-content[\s\S]*\[img_[0-9a-f]{8}\] Cat — 800×600/);
assert.deepEqual(tool.output.presentationMeta({}, out), out);
// save_images into the session workspace
const ws = fs.mkdtempSync(path.join(os.tmpdir(), "ws-"));
const png = Buffer.alloc(33); Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]).copy(png); png.writeUInt32BE(800, 16); png.writeUInt32BE(600, 20);
globalThis.fetch = async () => new Response(png, { headers: { "content-type": "image/png" } });
const saved = await tools.get("save_images").execute({ items: [out.images[0].id], folder: "猫" }, { agent: { session: { header: { cwd: ws } } } });
assert.equal(saved.dir, path.join(ws, "images", "猫"));
assert.equal(saved.saved.length, 1); assert.ok(fs.existsSync(saved.saved[0].file)); assert.equal(saved.saved[0].width, 800);

console.log("apply images ok");
