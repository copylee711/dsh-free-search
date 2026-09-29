import assert from "node:assert/strict";
import fs from "node:fs"; import os from "node:os"; import path from "node:path";
import * as I from "../lib/images.js";
const json = (body, init = {}) => new Response(JSON.stringify(body), { status: init.status ?? 200, headers: { "content-type": "application/json", ...(init.headers ?? {}) } });
const html = (body, headers = {}) => new Response(body, { headers: { "content-type": "text/html; charset=utf-8", ...headers } });
const publicLookup = async () => [{ address: "93.184.216.34", family: 4 }];
// PNG header 800x600
const png = (w, h) => { const b = Buffer.alloc(33); Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]).copy(b); b.writeUInt32BE(13, 8); b.write("IHDR", 12); b.writeUInt32BE(w, 16); b.writeUInt32BE(h, 20); return b; };
const jpeg = (w, h) => Buffer.from([0xff,0xd8,0xff,0xe0,0x00,0x10,...Buffer.alloc(14),0xff,0xc0,0x00,0x11,0x08,(h>>8)&255,h&255,(w>>8)&255,w&255,0x03,...Buffer.alloc(9)]);
const imgResp = (buf, type = "image/png") => new Response(buf, { headers: { "content-type": type } });

// --- imageSize
assert.deepEqual(I.imageSize(png(800, 600)), { width: 800, height: 600, type: "png" });
assert.deepEqual(I.imageSize(jpeg(1024, 768)), { width: 1024, height: 768, type: "jpeg" });
const gif = Buffer.alloc(24); gif.write("GIF89a"); gif.writeUInt16LE(320, 6); gif.writeUInt16LE(200, 8);
assert.deepEqual(I.imageSize(gif), { width: 320, height: 200, type: "gif" });
const webp = Buffer.alloc(30); webp.write("RIFF"); webp.write("WEBP", 8); webp.write("VP8X", 12); webp.writeUIntLE(1919, 24, 3); webp.writeUIntLE(1079, 27, 3);
assert.deepEqual(I.imageSize(webp), { width: 1920, height: 1080, type: "webp" });

// --- SSRF
for (const a of ["127.0.0.1", "10.1.2.3", "172.20.0.1", "192.168.1.1", "169.254.169.254", "100.64.0.1", "0.0.0.0", "::1", "fd00::1", "fe80::1", "::ffff:127.0.0.1"]) assert.ok(I.isPrivateAddress(a), a);
for (const a of ["93.184.216.34", "2606:4700::1111", "8.8.8.8"]) assert.ok(!I.isPrivateAddress(a), a);
await assert.rejects(I.assertPublicUrl("http://localhost:8080/x", publicLookup), /local/);
await assert.rejects(I.assertPublicUrl("http://169.254.169.254/latest", publicLookup), /private/);
await assert.rejects(I.assertPublicUrl("file:///etc/passwd", publicLookup), /http/);
await assert.rejects(I.assertPublicUrl("https://evil.example/", async () => [{ address: "10.0.0.5" }]), /private/);
await I.assertPublicUrl("https://example.com/a.png", publicLookup);
// redirect to private is refused
let hops = 0;
const redirFetch = async (url) => { hops++; return new Response(null, { status: 302, headers: { location: "http://127.0.0.1/secret" } }); };
await assert.rejects(I.guardedFetch("https://example.com/a", {}, { fetchFn: redirFetch, lookup: publicLookup }), /local|private/);
assert.equal(hops, 1);
// non-image refused, size cap
await assert.rejects(I.fetchImage("https://example.com/a", {}, { fetchFn: async () => html("<html>"), lookup: publicLookup }), /not an image/);
await assert.rejects(I.fetchImage("https://example.com/a", { maxBytes: 10 }, { fetchFn: async () => imgResp(png(1, 1)), lookup: publicLookup }), /too large/);

// --- providers
const calls = [];
const deps = (responder) => ({ fetchFn: async (url, init) => { calls.push(String(url)); return responder(String(url), init); }, resolveKey: async (p) => (p === "pexels" ? "PK" : ""), runProxied: (p, fn) => fn() });
let r = await I.searchImages({ query: "Lu Xun" }, { order: ["wikimedia"], disabled: [] }, deps(() => json({ query: { searchinfo: { totalhits: 7 }, pages: {
  "2": { index: 2, title: "File:Lu_Xun_1930.jpg", imageinfo: [{ url: "https://upload.wikimedia.org/a/Lu_Xun_1930.jpg", thumburl: "https://upload.wikimedia.org/thumb/480px-Lu.jpg", width: 1200, height: 1600, mime: "image/jpeg", descriptionurl: "https://commons.wikimedia.org/wiki/File:Lu_Xun_1930.jpg", extmetadata: { Artist: { value: "<a href='x'>Unknown</a>" }, LicenseShortName: { value: "Public domain" } } }] },
  "1": { index: 1, title: "File:Doc.pdf", imageinfo: [{ url: "https://upload.wikimedia.org/a/Doc.pdf", mime: "application/pdf" }] } } } })));
assert.equal(r.provider, "wikimedia"); assert.equal(r.images.length, 1);
assert.equal(r.images[0].title, "Lu Xun 1930"); assert.equal(r.images[0].author, "Unknown"); assert.equal(r.images[0].license, "Public domain"); assert.equal(r.total, 7);
assert.match(r.images[0].id, /^img_[0-9a-f]{8}$/);
// fallback: openverse empty -> unsplash no key skipped -> pexels works
r = await I.searchImages({ query: "minimal living room", orientation: "landscape" }, { order: ["openverse", "unsplash", "pexels"], disabled: [] }, deps((url) =>
  url.includes("openverse") ? json({ result_count: 0, results: [] }) : json({ total_results: 1, photos: [{ id: 1, width: 4000, height: 3000, url: "https://pexels.com/p/1", photographer: "Ann", src: { large2x: "https://images.pexels.com/1.jpg", medium: "https://images.pexels.com/1m.jpg" }, alt: "room" }] })));
assert.equal(r.provider, "pexels"); assert.match(r.note, /openverse returned 0.*unsplash skipped/);
assert.ok(calls.some((u) => u.includes("aspect_ratio=wide")));
// strict keyed provider without key -> clear error
await assert.rejects(I.searchImages({ query: "x", provider: "unsplash", strict: true }, { order: [] }, deps(() => json({}))), /UNSPLASH_ACCESS_KEY/);
// agent picks a keyed source without key -> falls back through the user's order
{
  const ov = () => json({ result_count: 1, results: [{ url: "https://o.org/f.jpg", thumbnail: "https://o.org/ft.jpg", width: 800, height: 600, title: "field" }] });
  r = await I.searchImages({ query: "grassland", providers: ["unsplash"] }, { order: ["openverse"], disabled: [] }, deps(ov));
  assert.equal(r.provider, "openverse"); assert.match(r.note, /unsplash skipped.*fell back to openverse/);
  // several sources at once: searched together, merged in turns, English keywords go to the stock libraries only
  const seenQ = [];
  r = await I.searchImages({ query: "草原", englishQuery: "grassland", providers: ["pexels", "openverse", "unsplash"], count: 8 }, { order: [], disabled: [] }, deps((url) => {
    const u = new URL(url); seenQ.push(`${u.hostname}:${u.searchParams.get("query") ?? u.searchParams.get("q")}`);
    if (url.includes("openverse")) return json({ result_count: 2, results: [1, 2].map((i) => ({ url: `https://o.org/${i}.jpg`, thumbnail: `https://o.org/t${i}.jpg`, width: 800, height: 600, title: `o${i}` })) });
    return json({ total_results: 2, photos: [1, 2].map((i) => ({ id: i, width: 4000, height: 3000, url: `https://pexels.com/p/${i}`, photographer: "Ann", src: { large2x: `https://images.pexels.com/${i}.jpg`, medium: `https://images.pexels.com/${i}m.jpg` }, alt: `p${i}` })) });
  }));
  assert.equal(r.provider, "pexels+openverse");
  assert.deepEqual(r.images.map((i) => i.provider), ["pexels", "openverse", "pexels", "openverse"]);
  assert.match(r.note, /unsplash skipped/);
  assert.ok(seenQ.every((q) => q.endsWith(":grassland")), seenQ.join());
  // a source the user turned off is not used even when the agent asks for it
  r = await I.searchImages({ query: "cat", providers: ["pexels"] }, { order: ["openverse"], disabled: ["pexels"] }, deps(ov));
  assert.equal(r.provider, "openverse"); assert.match(r.note, /pexels is turned off by the user/);
  // "fixed order" setting ignores the agent's choice
  r = await I.searchImages({ query: "cat", providers: ["pexels"] }, { order: ["openverse"], disabled: [], agentChoice: false }, deps(ov));
  assert.equal(r.provider, "openverse"); assert.match(r.note, /own order/);
  assert.ok(Object.keys(I.IMAGE_PROVIDER_GUIDE).length === I.IMAGE_PROVIDERS.length);
}
// disabled provider skipped
r = await I.searchImages({ query: "cat" }, { order: ["wikimedia", "openverse"], disabled: ["wikimedia"] }, deps(() => json({ result_count: 1, results: [{ url: "https://o.org/c.jpg", thumbnail: "https://o.org/t.jpg", width: 10, height: 10, license: "by", license_version: "4.0" }] })));
assert.equal(r.provider, "openverse"); assert.equal(r.images[0].license, "CC BY 4.0");
// bing images parsing
const bingHtml = `<div><a class="iusc" style="" m="{&quot;murl&quot;:&quot;https://cdn.example.com/luxun.jpg&quot;,&quot;turl&quot;:&quot;https://tse1.mm.bing.net/th?id=1&quot;,&quot;purl&quot;:&quot;https://news.example.com/a&quot;,&quot;t&quot;:&quot;鲁迅 &lt;b&gt;照片&lt;/b&gt;&quot;}" href="/images/x"></a><a m="{&quot;murl&quot;:&quot;https://x.com/2.png&quot;}" class="iusc"></a></div>`;
const b = I.parseBingImages(bingHtml);
assert.equal(b.length, 2); assert.equal(b[0].title, "鲁迅 照片"); assert.equal(b[0].pageUrl, "https://news.example.com/a"); assert.equal(b[0].thumbUrl, "https://tse1.mm.bing.net/th?id=1");

// --- page extraction: generic
const page = `<html><head><title>Some Article</title><meta property="og:image" content="/img/cover.jpg">
<script type="application/ld+json">{"@type":"Article","image":{"url":"https://cdn.site.com/ld.jpg"}}</script></head><body>
<img src="/static/logo.png"><img src="https://t.co/pixel.gif" width="1" height="1"><img class="avatar" src="/u/1.jpg">
<figure><img data-src="/img/lazy.jpg" src="data:image/gif;base64,xx" alt="alt text"><figcaption>A <b>caption</b></figcaption></figure>
<picture><source srcset="/img/p-400.webp 400w, /img/p-1600.webp 1600w"><img src="/img/p-400.webp"></picture>
<img src="/img/small.jpg" alt="tiny"><img src="/icons/i.svg"></body></html>`;
const g = I.extractGenericImages(page, "https://site.com/post/1");
const urls = g.candidates.map((c) => c.url);
assert.ok(urls.includes("https://site.com/img/cover.jpg") && urls.includes("https://cdn.site.com/ld.jpg") && urls.includes("https://site.com/img/lazy.jpg") && urls.includes("https://site.com/img/p-1600.webp"), urls.join());
assert.ok(!urls.some((u) => /logo|pixel|avatar|\/u\/1|\.svg|data:/.test(u)), urls.join());
assert.equal(g.candidates.find((c) => c.url.endsWith("lazy.jpg")).title, "A caption");
// full extract with probing: small.jpg is 100x80 -> dropped
const sizes = { "cover.jpg": png(1200, 630), "ld.jpg": jpeg(800, 800), "lazy.jpg": png(640, 480), "p-1600.webp": png(1600, 900), "p-400.webp": png(400, 225), "small.jpg": png(100, 80) };
const pageDeps = { lookup: publicLookup, fetchFn: async (url) => {
  if (url === "https://site.com/post/1") return html(page);
  const name = url.split("/").pop(); return sizes[name] ? imgResp(sizes[name]) : new Response("", { status: 404 });
} };
const ex = await I.extractPageImages("https://site.com/post/1", { minSize: 200, maxPerPage: 10 }, pageDeps);
assert.equal(ex.pageTitle, "Some Article");
assert.ok(!ex.images.some((i) => i.url.endsWith("small.jpg")));
assert.equal(ex.images[0].url.includes("cover.jpg") || ex.images[0].url.includes("ld.jpg"), true);
assert.ok(ex.images.every((i) => i.pageUrl === "https://site.com/post/1" && i.provider === "page"));
assert.equal(ex.images.find((i) => i.url.endsWith("lazy.jpg")).width, 640);
// baike
const baike = `<title>鲁迅_百度百科</title><img src="https://bkimg.cdn.bcebos.com/pic/abc123?x-bce-process=image/resize,m_lfit,w_536"> <script>{"src":"https:\\u002F\\u002Fbkimg.cdn.bcebos.com\\u002Fpic\\u002Fdef456?x-bce-process=image\\u002Fformat"}</script><img src="//bkimg.cdn.bcebos.com/pic/abc123?x-bce-process=other">`;
const bk = I.extractBaikeImages(baike);
assert.deepEqual(bk.candidates.map((c) => c.url), ["https://bkimg.cdn.bcebos.com/pic/abc123", "https://bkimg.cdn.bcebos.com/pic/def456"]);
assert.equal(bk.pageTitle, "鲁迅");
// wikipedia via API
const wikiDeps = { lookup: publicLookup, fetchFn: async (url) => {
  const u = new URL(url);
  if (u.searchParams.get("prop") === "pageimages|images|info") return json({ query: { pages: { "1": { title: "鲁迅", pageimage: "Lu_Xun_1930.jpg", images: [{ title: "File:Flag of China.svg" }, { title: "File:Lu Xun grave.jpg" }, { title: "File:Commons-logo.svg" }, { title: "File:Tiny.png" }] } } } });
  return json({ query: { pages: {
    "a": { title: "File:Lu Xun 1930.jpg", imageinfo: [{ url: "https://upload.wikimedia.org/lx.jpg", thumburl: "https://upload.wikimedia.org/480.jpg", width: 900, height: 1200, mime: "image/jpeg", descriptionurl: "https://zh.wikipedia.org/wiki/File:Lu_Xun_1930.jpg", extmetadata: { LicenseShortName: { value: "Public domain" } } }] },
    "b": { title: "File:Lu Xun grave.jpg", imageinfo: [{ url: "https://upload.wikimedia.org/grave.jpg", width: 2000, height: 1500, mime: "image/jpeg", extmetadata: { ImageDescription: { value: "鲁迅墓" } } }] },
    "c": { title: "File:Tiny.png", imageinfo: [{ url: "https://upload.wikimedia.org/tiny.png", width: 50, height: 40, mime: "image/png" }] } } } });
} };
const wk = await I.extractPageImages("https://zh.wikipedia.org/wiki/%E9%B2%81%E8%BF%85", { minSize: 200, maxPerPage: 10 }, wikiDeps);
assert.equal(wk.via, "wikipedia-api");
assert.deepEqual(wk.images.map((i) => i.url), ["https://upload.wikimedia.org/lx.jpg", "https://upload.wikimedia.org/grave.jpg"]);
assert.equal(wk.images[1].title, "鲁迅墓");
// page selection
const picked = I.pickPagesForImages([{ url: "https://www.zhihu.com/q/1" }, { url: "https://news.site.com/a" }, { url: "https://baike.baidu.com/item/鲁迅" }, { url: "https://zh.wikipedia.org/wiki/鲁迅" }, { url: "https://news.site.com/b" }], 3);
assert.deepEqual(picked.map((p) => new URL(p.url).hostname), ["zh.wikipedia.org", "baike.baidu.com", "news.site.com"]);

// --- save
I.rememberImages(ex.images);
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "imgs-"));
const cover = ex.images.find((i) => i.url.endsWith("cover.jpg"));
const seenRef = [];
const saveDeps = { lookup: publicLookup, fetchFn: async (url, init) => { seenRef.push(init.headers.referer); return imgResp(png(1200, 630), "image/png"); } };
const s1 = await I.saveImages([cover.id, cover.id, "img_deadbeef", "https://other.com/x.png"], dir, saveDeps);
assert.equal(s1.saved.length, 3); assert.equal(s1.failed.length, 1);
const names = s1.saved.map((s) => path.basename(s.file)).sort();
assert.ok(names.includes("Some Article - site.com.png") && names.includes("Some Article - site.com-2.png"), names.join());
assert.ok(seenRef.includes("https://site.com/post/1"));
assert.equal(I.resolveSaveDir("", "/work/proj"), "/work/proj/images");
assert.equal(I.resolveSaveDir("", undefined), path.join(os.homedir(), "Downloads", "dsh-images"));
assert.equal(I.resolveSaveDir("", "/w", "鲁迅/照片"), "/w/images/鲁迅 照片");
assert.match(I.renderPagesText({ query: "q", pages: [{ pageUrl: ex.pageUrl, pageTitle: ex.pageTitle }], images: ex.images }), /\[img_[0-9a-f]{8}\]/);

// --- Wikimedia: identifiable UA, no referer; 429 retry; thumbnail fallback; per-host serial
{
  const h1 = I.imageRequestHeaders("https://commons.wikimedia.org/wiki/File:X.jpg", "https://upload.wikimedia.org/a/b/X.jpg");
  assert.match(h1["user-agent"], /dsh-free-search/); assert.equal(h1.referer, undefined);
  const h2 = I.imageRequestHeaders("https://site.com/p", "https://cdn.site.com/x.jpg");
  assert.match(h2["user-agent"], /Mozilla/); assert.equal(h2.referer, "https://site.com/p");
  assert.equal(I.cleanWikiTitle('Albert Einstein sticking out the tongue label QS:Len,"Albert Einstein sticking out the tongue" label QS:Lde,"Albert Eins'), "Albert Einstein sticking out the tongue");
  assert.equal(I.cleanWikiTitle("Plain title"), "Plain title");
  const wdir = fs.mkdtempSync(path.join(os.tmpdir(), "wimgs-"));
  const mk = (n, w) => I.makeImage({ url: `https://upload.wikimedia.org/wikipedia/commons/a/ab/E${n}.jpg`, thumbUrl: `https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/E${n}.jpg/480px-E${n}.jpg`, width: w, height: w, title: `Portrait of Albert Einstein and Others (1879-1955), Physicist - Restoration ${n}`, sourceUrl: `https://commons.wikimedia.org/wiki/File:E${n}.jpg`, provider: "wikimedia" });
  const a = mk(1, 5000), b = mk(2, 5000), c = mk(3, 5000);
  I.rememberImages([a, b, c]);
  let inflight = 0, maxInflight = 0;
  const hits = new Map();
  const fetchFn = async (url) => {
    inflight++; maxInflight = Math.max(maxInflight, inflight);
    await new Promise((r) => setTimeout(r, 5));
    inflight--;
    hits.set(url, (hits.get(url) ?? 0) + 1);
    if (url.endsWith("/E1.jpg") && hits.get(url) === 1) return new Response("slow down", { status: 429 });
    if (url.endsWith("/E2.jpg")) return new Response("slow down", { status: 429 });
    return imgResp(png(url.includes("1920px") ? 1920 : 5000, 100), "image/png");
  };
  const out = await I.saveImages([a.id, b.id, c.id], wdir, { fetchFn, lookup: publicLookup, retryDelayMs: 1 });
  assert.equal(out.failed.length, 0, JSON.stringify(out.failed));
  assert.equal(maxInflight, 1);
  assert.equal(hits.get(a.url), 2);
  assert.equal(hits.get(b.url), 3);
  assert.equal(out.saved[1].width, 1920); assert.match(out.saved[1].note, /downscaled to 1920px.*429/);
  assert.equal(out.saved[0].note, undefined);
  for (const s of out.saved) assert.match(path.basename(s.file), / - commons\.wikimedia\.org(-\d+)?\.png$/);
}


// --- 0.6.4: non-ASCII referer, no AVIF when saving, Pexels fm=jpg, AVIF size, page relevance, zero-width, network errors
{
  const h = I.imageRequestHeaders("https://baike.baidu.com/item/钱学森", "https://bkimg.cdn.bcebos.com/pic/x", { forSave: true });
  assert.equal(h.referer, "https://baike.baidu.com/item/%E9%92%B1%E5%AD%A6%E6%A3%AE");
  assert.ok(!/avif/.test(h.accept));
  assert.match(I.imageRequestHeaders("", "https://x.com/a.jpg").accept, /avif/);
  assert.equal(I.saveableUrl("https://images.pexels.com/photos/1/p.jpeg?auto=compress&cs=tinysrgb&h=650"), "https://images.pexels.com/photos/1/p.jpeg?auto=compress&cs=tinysrgb&h=650&fm=jpg");
  assert.equal(I.saveableUrl("https://x.com/a.jpg?auto=compress"), "https://x.com/a.jpg?auto=compress");
  // minimal AVIF header: ftyp avif + ispe 1880x1256
  const ftyp = Buffer.concat([Buffer.from([0, 0, 0, 20]), Buffer.from("ftypavif"), Buffer.alloc(8)]);
  const ispe = Buffer.concat([Buffer.from([0, 0, 0, 20]), Buffer.from("ispe"), Buffer.alloc(4), Buffer.from([0, 0, 0x07, 0x58, 0, 0, 0x04, 0xe8])]);
  assert.deepEqual(I.imageSize(Buffer.concat([ftyp, ispe])), { width: 1880, height: 1256, type: "avif" });
  const picked = I.pickPagesForImages([
    { title: "钱（汉语汉字）_百度百科", url: "https://baike.baidu.com/item/钱/34224" },
    { title: "钱学森 - 维基百科", url: "https://zh.wikipedia.org/wiki/钱学森" },
    { title: "钱学森生平", url: "https://news.example.com/a" },
  ], 3, "钱学森 维基百科");
  assert.deepEqual(picked.map((p) => new URL(p.url).hostname), ["zh.wikipedia.org", "news.example.com"]);
  // nothing relevant → keep the old site-score behaviour
  assert.equal(I.pickPagesForImages([{ title: "a", url: "https://baike.baidu.com/item/x" }], 3, "钱学森").length, 1);
  const zw = I.makeImage({ url: "https://x.com/a.png", title: "\u200b錢學森的肖像", provider: "page" });
  assert.equal(zw.title, "錢學森的肖像");
  assert.equal(I.safeFileName("\u200bA\ufeffB"), "AB");
  // Bing result with a raw-Chinese page URL saves fine
  const bingImg = I.makeImage({ url: "https://bkimg.cdn.bcebos.com/pic/abc", title: "钱学森", pageUrl: "https://baike.baidu.com/item/钱学森", provider: "bing-images" });
  I.rememberImages([bingImg]);
  const sdir = fs.mkdtempSync(path.join(os.tmpdir(), "zimgs-"));
  const got = await I.saveImages([bingImg.id], sdir, { lookup: publicLookup, fetchFn: async (url, init) => {
    for (const v of Object.values(init.headers)) assert.match(v, /^[\x20-\x7e]*$/);
    return imgResp(png(800, 600), "image/png");
  } });
  assert.equal(got.saved.length, 1, JSON.stringify(got.failed));
  // network failure names the source and suggests the proxy
  const netErr = Object.assign(new TypeError("fetch failed"), { cause: { code: "ETIMEDOUT" } });
  await assert.rejects(
    I.searchImages({ query: "Doraemon", provider: "openverse", strict: true }, { order: ["openverse"] }, { fetchFn: async () => { throw netErr; }, resolveKey: async () => "", runProxied: (_p, fn) => fn() }),
    /openverse: could not reach api\.openverse\.org \(ETIMEDOUT\).*Proxy/
  );
}

// --- Bing Images relevance + web-page fallback
assert.equal(I.imagesLookRelevant("Lu Xun", [{ title: "Jeff Bezos | Biography", url: "https://cdn.britannica.com/Jeff-Bezos.jpg" }, { title: "Amazon HQ", url: "https://x.com/a.jpg" }]), false);
assert.equal(I.imagesLookRelevant("Lu Xun", [{ title: "Lu Xun in 1930", url: "https://x.com/a.jpg" }, { title: "other", url: "https://x.com/b.jpg" }, { title: "portrait", url: "https://x.com/lu_xun.jpg" }]), true);
assert.equal(I.imagesLookRelevant("鲁迅照片", [{ title: "鲁迅先生", url: "https://x.com/a.jpg" }, { title: "杂图", url: "https://x.com/b.jpg" }]), true);
const unrelatedBing = `<a class="iusc" m="{&quot;murl&quot;:&quot;https://cdn.britannica.com/Jeff-Bezos-2017.jpg&quot;,&quot;t&quot;:&quot;Jeff Bezos | Britannica&quot;}"></a><a class="iusc" m="{&quot;murl&quot;:&quot;https://x.com/amazon.jpg&quot;,&quot;t&quot;:&quot;Amazon&quot;}"></a>`;
let webCalled = 0;
const fallbackImg = I.makeImage({ url: "https://zh.wikipedia.org/luxun.jpg", title: "鲁迅", provider: "page", pageUrl: "https://zh.wikipedia.org/wiki/鲁迅" });
r = await I.searchImages({ query: "Lu Xun" }, { order: ["bing-images"] }, {
  fetchFn: async () => new Response(unrelatedBing, { headers: { "content-type": "text/html" } }),
  resolveKey: async () => "", runProxied: (p, fn) => fn(),
  webImages: async (q, n) => { webCalled++; return { images: [{ ...fallbackImg, provider: "bing-images" }], pages: 1 }; },
});
assert.equal(webCalled, 1); assert.equal(r.provider, "bing-images"); assert.equal(r.images[0].url, "https://zh.wikipedia.org/luxun.jpg");
assert.match(r.note, /unrelated results.*extracted from 1 page/);
// without a fallback the unrelated set is not returned
r = await I.searchImages({ query: "Lu Xun" }, { order: ["bing-images"] }, { fetchFn: async () => new Response(unrelatedBing), resolveKey: async () => "", runProxied: (p, fn) => fn() });
assert.equal(r.images.length, 0); assert.match(r.note, /unrelated/);
// Baike page blocked at the network level -> lemma card API fallback
const bkDeps = { lookup: publicLookup, fetchFn: async (url) => {
  if (String(url).includes("/api/openapi/BaikeLemmaCardApi")) return json({ title: "鲁迅", url: "https://baike.baidu.com/item/鲁迅/1", image: "https://bkimg.cdn.bcebos.com/pic/card123?x-bce-process=image/resize" });
  throw new TypeError("fetch failed");
} };
const bkOut = await I.extractPageImages("https://baike.baidu.com/item/%E9%B2%81%E8%BF%85", { minSize: 200 }, bkDeps);
assert.equal(bkOut.via, "baike-api"); assert.equal(bkOut.images[0].url, "https://bkimg.cdn.bcebos.com/pic/card123");
console.log("images ok");
