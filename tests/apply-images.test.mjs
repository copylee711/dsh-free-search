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
assert.ok(prompt.includes("falls back to the user's order (openverse > wikimedia > pexels"), prompt);
assert.ok(prompt.includes("  - pexels: high-quality photos"));
assert.match(tools.get("image_search").description, /Choose the source\(s\)/);
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

// --- image_search: Bing Images returns unrelated pictures -> Bing web search -> extract from the pages found
{
  const tools2 = new Map();
  const sctx2 = { ...sctx, tools: { register(t) { tools2.set(t.name, t); return () => tools2.delete(t.name); } }, on() {} };
  m.apply({ ...ctx, inject: (d, cb) => cb(sctx2) }, { provider: "bing", legacyYamlMigrated: true, imageProviderOrder: ["bing-images"] });
  const seen = [];
  globalThis.fetch = async (url) => {
    const u = String(url);
    seen.push(u.split("?")[0]);
    if (u.startsWith("https://www.bing.com/images/")) {
      return new Response(`<a class="iusc" m="{&quot;murl&quot;:&quot;https://cdn.britannica.com/Jeff-Bezos.jpg&quot;,&quot;t&quot;:&quot;Jeff Bezos&quot;}"></a>`, { headers: { "content-type": "text/html" } });
    }
    if (u.startsWith("https://www.bing.com/search")) {
      // 真实结果页很大；插件把过短的响应当作空页，这里补足长度
      return new Response(`<html><body>${"<div></div>".repeat(300)}<ol><li class="b_algo"><h2><a href="https://zh.wikipedia.org/wiki/%E9%B2%81%E8%BF%85">鲁迅 - 维基百科</a></h2><p>鲁迅，中国作家</p></li></ol></body></html>`, { headers: { "content-type": "text/html" } });
    }
    if (u.startsWith("https://zh.wikipedia.org/w/api.php")) {
      const params = new URL(u).searchParams;
      if (params.get("prop") === "pageimages|images|info") return new Response(JSON.stringify({ query: { pages: { "1": { title: "鲁迅", pageimage: "Lu_Xun_1930.jpg", images: [{ title: "File:Lu Xun 1930.jpg" }] } } } }));
      return new Response(JSON.stringify({ query: { pages: { a: { title: "File:Lu Xun 1930.jpg", imageinfo: [{ url: "https://upload.wikimedia.org/lx.jpg", width: 900, height: 1200, mime: "image/jpeg" }] } } } }));
    }
    return new Response("", { status: 404 });
  };
  const out2 = await tools2.get("image_search").execute({ query: "鲁迅" }, {});
  assert.equal(out2.provider, "bing-images");
  assert.deepEqual(out2.images.map((i) => i.url), ["https://upload.wikimedia.org/lx.jpg"]);
  assert.match(out2.note, /unrelated results.*extracted from 1 page/);
  assert.ok(seen.includes("https://www.bing.com/search"), seen.join(" "));
  console.log("bing images fallback ok");
}

// --- the page search for that fallback follows the web search settings (preferred engine, order, disabled)
{
  const tools3 = new Map();
  const sctx3 = { ...sctx, tools: { register(t) { tools3.set(t.name, t); return () => tools3.delete(t.name); } }, on() {} };
  m.apply({ ...ctx, inject: (d, cb) => cb(sctx3) }, { provider: "ddg-lite", disabledEngines: ["bing"], legacyYamlMigrated: true, imageProviderOrder: ["bing-images"] });
  const seen = [];
  globalThis.fetch = async (url) => {
    const u = String(url);
    seen.push(u.split("?")[0]);
    if (u.startsWith("https://www.bing.com/images/")) {
      return new Response(`<a class="iusc" m="{&quot;murl&quot;:&quot;https://cdn.britannica.com/Jeff-Bezos.jpg&quot;,&quot;t&quot;:&quot;Jeff Bezos&quot;}"></a>`, { headers: { "content-type": "text/html" } });
    }
    return new Response("", { status: 404 });
  };
  await tools3.get("image_search").execute({ query: "鲁迅" }, {}).catch(() => {});
  const searches = seen.filter((u) => !u.startsWith("https://www.bing.com/images/"));
  assert.ok(searches.length > 0, seen.join(" "));
  assert.ok(searches[0].startsWith("https://lite.duckduckgo.com/"), searches.join(" "));
  assert.ok(!seen.includes("https://www.bing.com/search"), "disabled Bing web search must not be used");
  console.log("fallback follows web search settings ok");
}
