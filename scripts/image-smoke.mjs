// 搜图 / 页面取图冒烟测试：对免 key 图源和几个典型页面发真实请求，打印条数和第一张图。
// 用法：node scripts/image-smoke.mjs [关键词] [页面URL,页面URL,...]
// GitHub Actions 里由 .github/workflows/image-smoke.yml 手动触发（运行器有正常外网）。
// 配了 PEXELS_API_KEY / UNSPLASH_ACCESS_KEY / PIXABAY_API_KEY 环境变量时顺带测这三个图库。
import * as images from "../lib/images.js";

const query = process.argv[2] || "Lu Xun";
const pages = process.argv[3]
  ? process.argv[3].split(",").filter(Boolean)
  : [
      "https://zh.wikipedia.org/wiki/%E9%B2%81%E8%BF%85",
      "https://en.wikipedia.org/wiki/Lu_Xun",
      "https://baike.baidu.com/item/%E9%B2%81%E8%BF%85",
      "https://www.newworldencyclopedia.org/entry/Lu_Xun",
    ];
const keys = { pexels: process.env.PEXELS_API_KEY, unsplash: process.env.UNSPLASH_ACCESS_KEY, pixabay: process.env.PIXABAY_API_KEY };
const deps = { fetchFn: fetch, resolveKey: async (p) => keys[p] ?? "", runProxied: (_p, fn) => fn() };
let failed = 0;
// 失败时打印对方实际返回了什么（状态码、服务器头、正文开头），方便判断是反爬还是解析问题
async function diagnose(url, headers = {}) {
  try {
    const r = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36", "accept-language": "zh-CN,zh;q=0.9,en;q=0.8", ...headers }, redirect: "follow", signal: AbortSignal.timeout(20000) });
    const text = await r.text();
    const pick = ["server", "content-type", "cf-ray", "x-cache", "set-cookie"].map((h) => r.headers.get(h) ? `${h}=${String(r.headers.get(h)).slice(0, 80)}` : "").filter(Boolean).join(" ");
    console.log(`     diag ${r.status} ${r.url.slice(0, 120)} len=${text.length} iusc=${(text.match(/iusc/g) ?? []).length} bkimg=${(text.match(/bkimg\.cdn\.bcebos\.com/g) ?? []).length} ${pick}`);
    console.log(`     body: ${text.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 300)}`);
  } catch (error) {
    console.log(`     diag failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
let total = 0;
const line = (ok, name, ms, detail) => console.log(`${ok ? "OK  " : "FAIL"} ${name.padEnd(48)} ${String(ms).padStart(6)}ms  ${detail}`);

for (const provider of images.IMAGE_PROVIDERS) {
  if (images.IMAGE_PROVIDER_KEYS[provider] && !keys[provider]) {
    console.log(`SKIP ${provider.padEnd(48)} (no ${images.IMAGE_PROVIDER_KEYS[provider].env})`);
    continue;
  }
  total++;
  const started = Date.now();
  try {
    const r = await images.searchImages({ query, provider, count: 6 }, { order: [] }, { ...deps, signal: AbortSignal.timeout(30000) });
    const first = r.images[0];
    if (!first) failed++;
    line(Boolean(first), `image_search ${provider}`, Date.now() - started, `${r.images.length} images${first ? `  ${first.width}x${first.height} ${JSON.stringify(first.title ?? "")} ${first.url}` : ""}${r.note ? `  note: ${r.note}` : ""}`);
    if (!first && provider === "bing-images") {
      // 对比几种请求方式，找出 Bing 在哪种情况下返回图片
      const home = await fetch("https://www.bing.com/images", { headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36" } });
      const cookie = (home.headers.getSetCookie?.() ?? []).map((c) => c.split(";")[0]).join("; ");
      console.log(`     primed cookies: ${cookie.replace(/=[^;]+/g, "=…")}`);
      const q = encodeURIComponent(query);
      for (const [label, url, extra] of [
        ["search zh-CN", `https://www.bing.com/images/search?q=${q}&form=HDRSC3&mkt=zh-CN`, {}],
        ["search zh-CN +cookie", `https://www.bing.com/images/search?q=${q}&form=HDRSC3&mkt=zh-CN`, { cookie }],
        ["search en-US +cookie", `https://www.bing.com/images/search?q=${q}&form=HDRSC3&mkt=en-US`, { cookie }],
        ["search no-mkt +cookie", `https://www.bing.com/images/search?q=${q}&form=HDRSC3`, { cookie }],
        ["async +cookie", `https://www.bing.com/images/async?q=${q}&first=0&count=35&mmasync=1`, { cookie, referer: "https://www.bing.com/images/search?q=" + q }],
        ["cn.bing search", `https://cn.bing.com/images/search?q=${q}&form=HDRSC3`, {}],
      ]) {
        console.log(`   ${label}`);
        await diagnose(url, extra);
      }
    }
  } catch (error) {
    failed++;
    line(false, `image_search ${provider}`, Date.now() - started, error instanceof Error ? error.message : String(error));
  }
}

for (const url of pages) {
  total++;
  const started = Date.now();
  try {
    const r = await images.extractPageImages(url, { minSize: 200, maxPerPage: 10 }, { fetchFn: fetch, signal: AbortSignal.timeout(60000) });
    const first = r.images[0];
    if (!first) failed++;
    line(Boolean(first), `page_images ${new URL(url).hostname}`, Date.now() - started, `${r.images.length} images via ${r.via} (${JSON.stringify(r.pageTitle)})${first ? `  ${first.width}x${first.height} ${first.url}` : ""}${r.note ? `  note: ${r.note}` : ""}`);
    // 再真实下载一张，验证 Referer / 防盗链 / 类型校验
    if (first) {
      const img = await images.fetchImage(first.url, { referer: first.pageUrl }, { fetchFn: fetch });
      const size = images.imageSize(img.buffer);
      console.log(`     download ${img.contentType} ${img.buffer.length} bytes ${size ? `${size.width}x${size.height}` : ""}`);
    }
  } catch (error) {
    failed++;
    line(false, `page_images ${new URL(url).hostname}`, Date.now() - started, error instanceof Error ? error.message : String(error));
    await diagnose(url);
  }
}
// save_images 连续保存 Wikimedia 原图：验证可识别 UA + 限流重试 + 缩略图回退后不再大量 429
{
  total++;
  const started = Date.now();
  try {
    const { mkdtempSync } = await import("node:fs");
    const { join } = await import("node:path");
    const { tmpdir } = await import("node:os");
    const r = await images.searchImages({ query: "Albert Einstein portrait", count: 6, provider: "wikimedia" }, { order: ["wikimedia"] }, deps);
    images.rememberImages(r.images);
    const ids = r.images.slice(0, 5).map((i) => i.id);
    const out = await images.saveImages(ids, mkdtempSync(join(tmpdir(), "smoke-save-")), { fetchFn: fetch, signal: AbortSignal.timeout(120000) });
    const ok = ids.length >= 3 && out.failed.length === 0;
    if (!ok) failed++;
    line(ok, "save_images wikimedia originals", Date.now() - started, `${out.saved.length}/${ids.length} saved${out.failed.length ? `  failed: ${out.failed.map((f) => f.error).join("; ")}` : ""}`);
    for (const s of out.saved) console.log(`     ${s.width}x${s.height} ${s.bytes} bytes ${s.note ?? ""} ${s.file}`);
  } catch (error) {
    failed++;
    line(false, "save_images wikimedia originals", Date.now() - started, error instanceof Error ? error.message : String(error));
  }
}
// save_images 保存 Bing 图片（来源页 URL 常带未编码中文，曾导致 ByteString 报错）；Pexels 有 key 时验证存成 .jpg
{
  const { mkdtempSync } = await import("node:fs");
  const { join, extname } = await import("node:path");
  const { tmpdir } = await import("node:os");
  const cases = [["bing-images", "钱学森", () => true]];
  if (keys.pexels) cases.push(["pexels", "grassland landscape", (s) => extname(s.file) === ".jpg"]);
  for (const [provider, q, extOk] of cases) {
    total++;
    const started = Date.now();
    try {
      const r = await images.searchImages({ query: q, count: 6, provider }, { order: [provider] }, deps);
      images.rememberImages(r.images);
      const ids = r.images.slice(0, 3).map((i) => i.id);
      if (ids.length === 0) {
        // 搜索本身没结果（Bing 对运行器 IP 时好时坏，上面的 image_search 行已记录），这里不重复算失败
        total--;
        console.log(`SKIP save_images ${provider}`.padEnd(54) + "(search returned no images)");
        continue;
      }
      const out = await images.saveImages(ids, mkdtempSync(join(tmpdir(), "smoke-save-")), { fetchFn: fetch, signal: AbortSignal.timeout(120000) });
      const ok = out.saved.length >= 2 && !out.failed.some((f) => /ByteString/.test(f.error)) && out.saved.every(extOk);
      if (!ok) failed++;
      line(ok, `save_images ${provider}`, Date.now() - started, `${out.saved.length}/${ids.length} saved${out.failed.length ? `  failed: ${out.failed.map((f) => f.error).join("; ")}` : ""}`);
      for (const s of out.saved) console.log(`     ${s.width}x${s.height} ${s.bytes} bytes ${s.file}`);
    } catch (error) {
      failed++;
      line(false, `save_images ${provider}`, Date.now() - started, error instanceof Error ? error.message : String(error));
    }
  }
}
// 端到端：加载插件本身（最小 DSH 替身），真实调用工具 —— 覆盖 Bing 图片回退（Bing 网页搜索 → 页面取图）和 page_images 的 query 模式
{
  const plugin = await import("../lib/index.js");
  const tools = new Map();
  const sctx = {
    effect(fn) { fn(); }, on() {}, get: () => undefined,
    settings: { configure() { return () => {}; }, describe() { return []; }, async mutate() {} },
    tools: { register(t) { tools.set(t.name, t); return () => tools.delete(t.name); } },
    webServer: { register() { return () => {}; } },
    systemPrompt: { section() { return () => {}; } },
  };
  process.env.DSH_HOME = "/nonexistent";
  plugin.apply(
    { logger: { info() {}, warn() {}, error() {} }, inject: (_d, cb) => cb(sctx), get: () => undefined, web: { searchProviderId: "ddg", registerSearchProvider() {} }, fiber: {} },
    { provider: "bing", legacyYamlMigrated: true, bingMarket: "zh-CN" }
  );
  for (const [name, args] of [
    ["image_search", { query: "鲁迅", provider: "bing-images", count: 8 }],
    ["page_images", { query: "鲁迅", count: 12, pages: 3 }],
  ]) {
    total++;
    const started = Date.now();
    try {
      const out = await tools.get(name).execute(args, { signal: AbortSignal.timeout(90000) });
      const first = out.images[0];
      if (!first) failed++;
      const pagesInfo = out.pages ? `  pages: ${out.pages.map((p) => `${new URL(p.pageUrl).hostname}=${p.count}${p.error ? "(" + p.error + ")" : ""}`).join(" ")}` : "";
      line(Boolean(first), `tool ${name} ${JSON.stringify(args.query)}`, Date.now() - started, `${out.images.length} images${first ? `  ${JSON.stringify(first.title ?? "")} ${first.url}` : ""}${out.note ? `  note: ${out.note}` : ""}${pagesInfo}`);
    } catch (error) {
      failed++;
      line(false, `tool ${name}`, Date.now() - started, error instanceof Error ? error.message : String(error));
    }
  }
}

console.log(`\n${total - failed}/${total} checks returned images for "${query}"`);
process.exitCode = failed > 0 ? 1 : 0;
