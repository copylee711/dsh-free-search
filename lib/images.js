// 搜图与页面取图（image_search / page_images / save_images 的核心逻辑）。
//
// 纯逻辑模块：网络请求通过参数注入（index.js 传入走按引擎代理的 netFetch），因此可以离线测试。
//  - 图源：Wikimedia Commons、Openverse（免 key），Pexels、Unsplash、Pixabay（填 key），Bing 图片（免 key，解析网页）
//    适配写法参考 Ghz114514/dsh-refpics 的 src/providers.ts；Wikimedia 直接调官方 API（免 key）。
//  - 页面取图：维基百科走 MediaWiki API；百度百科解析 bkimg 图床链接；其他网页通用解析
//    og:image / JSON-LD / <img> / srcset / 懒加载属性 / figure 标题，并读取图片文件头探测尺寸。
//  - 安全：所有由模型或页面给出的 URL 在请求前做 SSRF 校验（拒绝回环 / 内网 / 链路本地地址，
//    手动跟随重定向并逐跳校验），图片下载限制类型与大小。

import { createHash } from "node:crypto";
import { lookup as dnsLookup } from "node:dns/promises";
import { isIP } from "node:net";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

export const IMAGE_PROVIDERS = ["wikimedia", "openverse", "pexels", "unsplash", "pixabay", "bing-images"];
export const DEFAULT_IMAGE_PROVIDER_ORDER = IMAGE_PROVIDERS.slice();
export const IMAGE_PROVIDER_KEYS = {
  pexels: { env: "PEXELS_API_KEY", field: "pexelsApiKey" },
  unsplash: { env: "UNSPLASH_ACCESS_KEY", field: "unsplashApiKey" },
  pixabay: { env: "PIXABAY_API_KEY", field: "pixabayApiKey" },
};
export const ORIENTATIONS = ["any", "landscape", "portrait", "square"];
export const MAX_IMAGE_BYTES = 30 * 1024 * 1024;
export const MAX_PAGE_BYTES = 4 * 1024 * 1024;

const WIKIMEDIA_UA = "dsh-free-search (https://github.com/copylee711/dsh-free-search) image search";
const BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";
const MOBILE_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1";
// 打开网页时的完整浏览器请求头（只带 UA 的请求常被 WAF 直接 403）
function pageHeaders(ua = BROWSER_UA) {
  return {
    "user-agent": ua,
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "upgrade-insecure-requests": "1",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    ...(ua === BROWSER_UA ? { "sec-ch-ua": '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"', "sec-ch-ua-mobile": "?0", "sec-ch-ua-platform": '"Windows"' } : {}),
  };
}
const REQUEST_TIMEOUT_MS = 20000;

//#region helpers
function decodeEntities(text) {
  return String(text)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}

function stripTags(html) {
  return decodeEntities(String(html ?? "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

const withTimeout = (signal, ms = REQUEST_TIMEOUT_MS) =>
  AbortSignal.any([...(signal !== undefined ? [signal] : []), AbortSignal.timeout(ms)]);

const isHttpUrl = (value) => typeof value === "string" && /^https?:\/\//i.test(value);

function absUrl(value, base) {
  if (typeof value !== "string") return null;
  const v = decodeEntities(value.trim());
  if (!v || v.startsWith("data:") || v.startsWith("blob:") || v.startsWith("javascript:")) return null;
  try {
    const u = new URL(v.startsWith("//") ? `https:${v}` : v, base);
    return u.protocol === "http:" || u.protocol === "https:" ? u.href : null;
  } catch {
    return null;
  }
}

// 结果编号：同一 URL 永远得到同一个编号，save_images 可以用它引用
export function imageId(url) {
  return "img_" + createHash("sha1").update(String(url)).digest("hex").slice(0, 8);
}

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

// 统一图片结构；url 不是 http(s) 时返回 null
const ZERO_WIDTH = /[\u200b-\u200f\u2060\ufeff]/g;

export function makeImage(fields) {
  const url = isHttpUrl(fields.url) ? fields.url : isHttpUrl(fields.thumbUrl) ? fields.thumbUrl : null;
  if (!url) return null;
  const image = {
    id: imageId(url),
    url,
    thumbUrl: isHttpUrl(fields.thumbUrl) ? fields.thumbUrl : url,
    width: Number.isFinite(fields.width) && fields.width > 0 ? Math.round(fields.width) : 0,
    height: Number.isFinite(fields.height) && fields.height > 0 ? Math.round(fields.height) : 0,
    provider: fields.provider,
  };
  for (const key of ["title", "author", "authorUrl", "sourceUrl", "license", "pageUrl", "pageTitle"]) {
    const value = fields[key];
    const text = typeof value === "string" ? (key === "title" || key === "pageTitle" || key === "author" ? value.replace(ZERO_WIDTH, "") : value).trim() : "";
    if (text) image[key] = text.slice(0, key === "title" ? 200 : 500);
  }
  return image;
}

function dedupeImages(images) {
  const seen = new Set();
  const out = [];
  for (const image of images) {
    if (!image) continue;
    const key = normalizeImageKey(image.url);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(image);
  }
  return out;
}

// 去掉常见缩放参数后比较，避免同一张图的不同尺寸重复出现
function normalizeImageKey(url) {
  try {
    const u = new URL(url);
    for (const p of ["w", "h", "width", "height", "resize", "x-bce-process", "imageView2", "imageMogr2", "fit", "q", "quality", "auto"]) u.searchParams.delete(p);
    return (u.host + u.pathname.replace(/\/(\d+)px-([^/]+)$/, "/$2") + u.search).toLowerCase();
  } catch {
    return String(url).toLowerCase();
  }
}
//#endregion

//#region result memory（save_images 用编号引用最近的结果）
const REMEMBERED_MAX = 300;
const remembered = new Map();

export function rememberImages(images) {
  for (const image of images) {
    remembered.delete(image.id);
    remembered.set(image.id, image);
    if (remembered.size > REMEMBERED_MAX) remembered.delete(remembered.keys().next().value);
  }
}

export function lookupImage(id) {
  return remembered.get(String(id).trim()) ?? null;
}
//#endregion

//#region SSRF guard + safe fetch
function isPrivateIPv4(ip) {
  const p = ip.split(".").map(Number);
  if (p.length !== 4 || p.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return true;
  const [a, b] = p;
  return (
    a === 0 || a === 10 || a === 127 || a >= 224 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0 && p[2] === 0) ||
    (a === 198 && (b === 18 || b === 19))
  );
}

export function isPrivateAddress(address) {
  const ip = String(address).replace(/^\[|\]$/g, "").toLowerCase();
  const family = isIP(ip);
  if (family === 4) return isPrivateIPv4(ip);
  if (family === 6) {
    if (ip === "::" || ip === "::1") return true;
    const mapped = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) return isPrivateIPv4(mapped[1]);
    if (/^::ffff:[0-9a-f]{1,4}:[0-9a-f]{1,4}$/.test(ip)) return true;
    return /^f[cd]/.test(ip) || /^fe[89ab]/.test(ip) || /^ff/.test(ip);
  }
  return true;
}

// 校验一个 URL 可以被插件访问：http(s)、非本机/内网地址。lookup 可注入（测试用）
export async function assertPublicUrl(rawUrl, lookup = dnsLookup) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error(`invalid URL: ${String(rawUrl).slice(0, 200)}`);
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("only http(s) URLs are allowed");
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (!host || host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) {
    throw new Error(`refusing to fetch a local address: ${host}`);
  }
  const addresses = isIP(host) ? [{ address: host }] : await lookup(host, { all: true, verbatim: true });
  if (!addresses.length || addresses.some((a) => isPrivateAddress(a.address))) {
    throw new Error(`refusing to fetch a private or local address: ${host}`);
  }
  return url;
}

// 手动跟随重定向（最多 3 跳），每一跳都做 SSRF 校验
export async function guardedFetch(rawUrl, init = {}, deps = {}) {
  const fetchFn = deps.fetchFn ?? fetch;
  let current = rawUrl;
  for (let hop = 0; hop <= 3; hop++) {
    await assertPublicUrl(current, deps.lookup);
    const response = await fetchFn(current, { ...init, redirect: "manual" });
    if (response.status >= 300 && response.status < 400 && response.headers.get("location")) {
      current = new URL(response.headers.get("location"), current).href;
      try {
        await response.body?.cancel();
      } catch {}
      continue;
    }
    return { response, finalUrl: current };
  }
  throw new Error("too many redirects");
}

// 读取响应体到 Buffer，超过 maxBytes 就中止
export async function readCapped(response, maxBytes) {
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) throw new Error(`file too large (${declared} bytes, limit ${maxBytes})`);
  if (!response.body) return Buffer.alloc(0);
  const chunks = [];
  let total = 0;
  const reader = response.body.getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) throw new Error(`file too large (over ${maxBytes} bytes)`);
      chunks.push(Buffer.from(value));
    }
  } finally {
    try {
      reader.releaseLock();
    } catch {}
  }
  return Buffer.concat(chunks);
}

// Wikimedia 的机器人策略要求可识别的 UA：伪装浏览器反而会被严格限流（HTTP 429）
export function isWikimediaHost(url) {
  try {
    return /(^|\.)(wikimedia|wikipedia|wikidata)\.org$/i.test(new URL(url).hostname);
  } catch {
    return false;
  }
}

// 图片请求头：一般站点带 Referer（来源页）和浏览器 UA，绕过常见防盗链；Wikimedia 用可识别 UA、不带 Referer
// 保存到本地时不接受 AVIF：CDN（如 Pexels）会按 Accept 返回 AVIF，PPT 等软件打不开
const ACCEPT_VIEW = "image/avif,image/webp,image/apng,image/*,*/*;q=0.8";
const ACCEPT_SAVE = "image/jpeg,image/png,image/gif,image/webp;q=0.9,image/*;q=0.5";

// 请求头只能是 ASCII：来源页 URL 常带未编码的中文，先规范化（百分号编码），不合法就不带
function asciiReferer(referer) {
  if (!isHttpUrl(referer)) return "";
  try {
    const href = new URL(referer).href;
    return /^[\x20-\x7e]+$/.test(href) ? href : "";
  } catch {
    return "";
  }
}

export function imageRequestHeaders(referer, url, { forSave = false } = {}) {
  const accept = forSave ? ACCEPT_SAVE : ACCEPT_VIEW;
  if (url && isWikimediaHost(url)) return { "user-agent": WIKIMEDIA_UA, accept };
  const ref = asciiReferer(referer);
  return {
    "user-agent": BROWSER_UA,
    accept,
    ...(ref ? { referer: ref } : {}),
  };
}

// Pexels 的 auto=compress 会按 Accept 转格式；保存时明确要 JPG
export function saveableUrl(url) {
  try {
    const u = new URL(url);
    if (u.hostname === "images.pexels.com" && !u.searchParams.has("fm")) {
      u.searchParams.set("fm", "jpg");
      return u.href;
    }
  } catch {}
  return url;
}

function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason ?? new Error("aborted"));
    const timer = setTimeout(done, ms);
    function done() {
      signal?.removeEventListener?.("abort", onAbort);
      resolve();
    }
    function onAbort() {
      clearTimeout(timer);
      reject(signal.reason ?? new Error("aborted"));
    }
    signal?.addEventListener?.("abort", onAbort, { once: true });
  });
}

// 429 / 503 时等多久：优先 Retry-After（秒或日期），上限 8 秒
function retryDelay(response, attempt) {
  const header = response.headers.get("retry-after");
  let ms = NaN;
  if (header) ms = /^\d+$/.test(header.trim()) ? Number(header) * 1000 : Date.parse(header) - Date.now();
  if (!Number.isFinite(ms) || ms < 0) ms = attempt === 0 ? 1500 : 4000;
  return Math.min(ms, 8000);
}

// 下载一张图片（校验类型 + 大小），返回 { buffer, contentType, finalUrl }；被限流时退避重试
export async function fetchImage(url, { referer, maxBytes = MAX_IMAGE_BYTES, signal, retries = 2, forSave = false } = {}, deps = {}) {
  let response;
  let finalUrl;
  for (let attempt = 0; ; attempt++) {
    ({ response, finalUrl } = await guardedFetch(url, { headers: imageRequestHeaders(referer, url, { forSave }), signal: withTimeout(signal, 30000) }, deps));
    if ((response.status !== 429 && response.status !== 503) || attempt >= retries) break;
    try {
      await response.body?.cancel();
    } catch {}
    await sleep(deps.retryDelayMs ?? retryDelay(response, attempt), signal);
  }
  if (!response.ok) {
    try {
      await response.body?.cancel();
    } catch {}
    throw new Error(`image host answered HTTP ${response.status}`);
  }
  const contentType = (response.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  if (!contentType.startsWith("image/")) throw new Error(`not an image (content-type ${contentType || "unknown"})`);
  const buffer = await readCapped(response, maxBytes);
  return { buffer, contentType, finalUrl };
}
//#endregion

//#region image header size probe
// 从图片文件头解析宽高（PNG / GIF / JPEG / WebP / BMP），解析不出来返回 null
export function imageSize(buf) {
  if (!buf || buf.length < 24) return null;
  // PNG
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), type: "png" };
  }
  // GIF
  if (buf.toString("ascii", 0, 3) === "GIF") return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8), type: "gif" };
  // BMP
  if (buf[0] === 0x42 && buf[1] === 0x4d && buf.length >= 26) return { width: buf.readInt32LE(18), height: Math.abs(buf.readInt32LE(22)), type: "bmp" };
  // WebP
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP" && buf.length >= 30) {
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8 ") return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff, type: "webp" };
    if (chunk === "VP8L") {
      const bits = buf.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1, type: "webp" };
    }
    if (chunk === "VP8X") return { width: buf.readUIntLE(24, 3) + 1, height: buf.readUIntLE(27, 3) + 1, type: "webp" };
  }
  // AVIF / HEIF：ftyp 之后在前 64KB 里找 ispe box（宽高各 4 字节）
  if (buf.toString("ascii", 4, 8) === "ftyp" && /^(avif|avis|heic|heix|mif1|msf1)$/.test(buf.toString("ascii", 8, 12))) {
    const at = buf.indexOf("ispe", 12, "ascii");
    if (at > 0 && at + 16 <= buf.length) return { width: buf.readUInt32BE(at + 8), height: buf.readUInt32BE(at + 12), type: buf.toString("ascii", 8, 12) === "avif" ? "avif" : "heif" };
    return null;
  }
  // JPEG：扫描 SOF 段
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) {
        i++;
        continue;
      }
      const marker = buf[i + 1];
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
        i += 2;
        continue;
      }
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5), type: "jpeg" };
      }
      i += 2 + len;
    }
  }
  return null;
}

// 只读前 64KB 探测尺寸；失败返回 null（不影响结果，只是排序靠后）
async function probeSize(image, deps, signal) {
  try {
    const { response } = await guardedFetch(
      image.url,
      { headers: { ...imageRequestHeaders(image.pageUrl, image.url), range: "bytes=0-65535" }, signal: withTimeout(signal, 6000) },
      deps
    );
    if (!response.ok) {
      try {
        await response.body?.cancel();
      } catch {}
      return null;
    }
    const chunks = [];
    let total = 0;
    const reader = response.body.getReader();
    try {
      while (total < 65536) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(Buffer.from(value));
        total += value.byteLength;
      }
    } finally {
      try {
        await reader.cancel();
      } catch {}
    }
    return imageSize(Buffer.concat(chunks));
  } catch {
    return null;
  }
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return out;
}
//#endregion

//#region providers
async function getJson(fetchFn, url, init, label) {
  const response = await fetchFn(url, init);
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    if (response.status === 401 || response.status === 403) throw new Error(`${label} API key is invalid or not allowed (HTTP ${response.status})`);
    throw new Error(`${label} API error (HTTP ${response.status}): ${detail.slice(0, 200)}`);
  }
  return response.json();
}

function pickMeta(ext, key) {
  const value = ext?.[key]?.value;
  return typeof value === "string" ? stripTags(value) : "";
}

// Commons 的 ObjectName 常带 Wikidata QuickStatements 片段（label QS:Lde,"…"），清掉；清完不像样就返回空
export function cleanWikiTitle(title) {
  if (!/\bQS:/.test(title)) return title;
  const cleaned = title
    .replace(/\b(?:label|title|description)\s+QS:[^,\s]+,\s*(?:"[^"]*"?|\S+)/gi, " ")
    .replace(/\bQS:\S*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.length >= 3 && !/["“”]/.test(cleaned) ? cleaned : "";
}

// MediaWiki imageinfo 页 → 统一图片（Commons 搜图和维基百科页面取图共用）
function wikiPageToImage(page, provider, extra = {}) {
  const info = page?.imageinfo?.[0];
  if (!info || !isHttpUrl(info.url)) return null;
  const mime = String(info.mime ?? "");
  if (mime && !mime.startsWith("image/")) return null;
  const ext = info.extmetadata ?? {};
  const fileTitle = String(page.title ?? "").replace(/^[^:]+:/, "").replace(/\.[a-z0-9]+$/i, "").replace(/_/g, " ");
  return makeImage({
    url: info.url,
    thumbUrl: info.thumburl,
    width: info.width,
    height: info.height,
    title: cleanWikiTitle(pickMeta(ext, "ObjectName")) || fileTitle,
    author: pickMeta(ext, "Artist"),
    license: pickMeta(ext, "LicenseShortName"),
    sourceUrl: info.descriptionurl,
    provider,
    ...extra,
    _mime: mime,
  });
}

async function searchWikimedia({ query, page, count }, deps) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: "6",
    gsrlimit: String(count),
    gsroffset: String((page - 1) * count),
    prop: "imageinfo",
    iiprop: "url|size|mime|extmetadata",
    iiurlwidth: "480",
    iiextmetadatafilter: "Artist|LicenseShortName|ObjectName",
  });
  const data = await getJson(deps.fetchFn, `https://commons.wikimedia.org/w/api.php?${params}`, {
    headers: { "user-agent": WIKIMEDIA_UA, accept: "application/json" },
    signal: withTimeout(deps.signal),
  }, "Wikimedia");
  const pages = Object.values(data?.query?.pages ?? {}).sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  const images = pages.map((p) => wikiPageToImage(p, "wikimedia")).filter(Boolean);
  const total = Number(data?.query?.searchinfo?.totalhits) || images.length;
  return { images, total, more: Boolean(data?.continue) };
}

async function searchOpenverse({ query, page, count, orientation }, deps) {
  const url = new URL("https://api.openverse.org/v1/images/");
  url.searchParams.set("q", query);
  url.searchParams.set("page", String(page));
  url.searchParams.set("page_size", String(count));
  if (orientation !== "any") url.searchParams.set("aspect_ratio", orientation === "landscape" ? "wide" : orientation === "portrait" ? "tall" : "square");
  const data = await getJson(deps.fetchFn, url.href, { headers: { accept: "application/json" }, signal: withTimeout(deps.signal) }, "Openverse");
  const images = (data?.results ?? []).map((r) =>
    makeImage({
      url: r.url,
      thumbUrl: r.thumbnail,
      width: r.width,
      height: r.height,
      title: r.title,
      author: r.creator,
      authorUrl: r.creator_url,
      sourceUrl: r.foreign_landing_url,
      license: r.license ? `CC ${String(r.license).toUpperCase()}${r.license_version ? " " + r.license_version : ""}` : "",
      provider: "openverse",
    })
  );
  return { images: images.filter(Boolean), total: Number(data?.result_count) || images.length };
}

async function searchPexels({ query, page, count, orientation, key }, deps) {
  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(count));
  if (orientation !== "any") url.searchParams.set("orientation", orientation);
  const data = await getJson(deps.fetchFn, url.href, { headers: { authorization: key, accept: "application/json" }, signal: withTimeout(deps.signal) }, "Pexels");
  const images = (data?.photos ?? []).map((p) =>
    makeImage({
      url: p.src?.large2x ?? p.src?.large ?? p.src?.original,
      thumbUrl: p.src?.medium,
      width: p.width,
      height: p.height,
      title: p.alt,
      author: p.photographer,
      authorUrl: p.photographer_url,
      sourceUrl: p.url,
      license: "Pexels License",
      provider: "pexels",
    })
  );
  return { images: images.filter(Boolean), total: Number(data?.total_results) || images.length };
}

async function searchUnsplash({ query, page, count, orientation, key }, deps) {
  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(count));
  if (orientation !== "any") url.searchParams.set("orientation", orientation === "square" ? "squarish" : orientation);
  const data = await getJson(deps.fetchFn, url.href, { headers: { authorization: `Client-ID ${key}`, accept: "application/json" }, signal: withTimeout(deps.signal) }, "Unsplash");
  const images = (data?.results ?? []).map((p) =>
    makeImage({
      url: p.urls?.regular ?? p.urls?.full,
      thumbUrl: p.urls?.small,
      width: p.width,
      height: p.height,
      title: p.alt_description ?? p.description,
      author: p.user?.name,
      authorUrl: p.user?.links?.html,
      sourceUrl: p.links?.html,
      license: "Unsplash License",
      provider: "unsplash",
    })
  );
  return { images: images.filter(Boolean), total: Number(data?.total) || images.length };
}

async function searchPixabay({ query, page, count, orientation, key, safeSearch }, deps) {
  const url = new URL("https://pixabay.com/api/");
  url.searchParams.set("key", key);
  url.searchParams.set("q", query.slice(0, 100));
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(Math.max(3, count)));
  url.searchParams.set("image_type", "photo");
  url.searchParams.set("safesearch", safeSearch === "off" ? "false" : "true");
  if (orientation === "landscape") url.searchParams.set("orientation", "horizontal");
  if (orientation === "portrait") url.searchParams.set("orientation", "vertical");
  const data = await getJson(deps.fetchFn, url.href, { headers: { accept: "application/json" }, signal: withTimeout(deps.signal) }, "Pixabay");
  const images = (data?.hits ?? []).map((h) =>
    makeImage({
      url: h.largeImageURL,
      thumbUrl: h.webformatURL,
      width: h.imageWidth,
      height: h.imageHeight,
      title: h.tags,
      author: h.user,
      sourceUrl: h.pageURL,
      license: "Pixabay Content License",
      provider: "pixabay",
    })
  );
  return { images: images.filter(Boolean).slice(0, count), total: Number(data?.totalHits) || images.length };
}

// Bing 图片：解析结果页每张图的 m 属性（HTML 转义的 JSON：murl 原图、turl 缩略图、purl 来源页、t 标题）
export function parseBingImages(html) {
  const images = [];
  const tags = String(html).match(/<a\b[^>]*\bclass=["'][^"']*\biusc\b[^"']*["'][^>]*>/g) ?? [];
  for (const tag of tags) {
    const m = tag.match(/\sm="([^"]+)"/) ?? tag.match(/\sm='([^']+)'/);
    if (!m) continue;
    let meta;
    try {
      meta = JSON.parse(decodeEntities(m[1]));
    } catch {
      continue;
    }
    // 尺寸：部分结果在同一行的 data 属性或 exp 字段里没有，保持 0（前端按图片自然比例显示）
    const image = makeImage({
      url: meta.murl,
      thumbUrl: meta.turl,
      title: stripTags(meta.t ?? meta.desc ?? ""),
      sourceUrl: meta.purl,
      pageUrl: meta.purl,
      license: "版权归原作者 / copyright of the original owner",
      provider: "bing-images",
    });
    if (image) images.push(image);
  }
  return images;
}

async function searchBingImages({ query, page, count, orientation, market, safeSearch }, deps) {
  const params = new URLSearchParams({ q: query, first: String((page - 1) * count + 1), count: String(Math.min(count, 35)), mkt: market || "zh-CN" });
  const filters = [];
  if (orientation === "landscape") filters.push("+filterui:aspect-wide");
  if (orientation === "portrait") filters.push("+filterui:aspect-tall");
  if (orientation === "square") filters.push("+filterui:aspect-square");
  if (filters.length) params.set("qft", filters.join(""));
  if (safeSearch === "strict") params.set("adlt", "strict");
  else if (safeSearch === "moderate") params.set("adlt", "moderate");
  else params.set("adlt", "off");
  // 先用 async 接口（直接返回结果片段，不依赖页面脚本），拿不到再退回完整结果页
  let lastStatus = 0;
  for (const endpoint of [`https://www.bing.com/images/async?${params}&mmasync=1`, `https://www.bing.com/images/search?${params}&form=HDRSC3`]) {
    const response = await deps.fetchFn(endpoint, {
      headers: { ...pageHeaders(), referer: "https://www.bing.com/images" },
      signal: withTimeout(deps.signal),
    });
    lastStatus = response.status;
    if (!response.ok) continue;
    const images = parseBingImages(await response.text()).slice(0, count);
    if (images.length > 0) return { images, total: images.length };
  }
  if (lastStatus && lastStatus !== 200) throw new Error(`Bing Images answered HTTP ${lastStatus}`);
  return { images: [], total: 0 };
}

// 相关性判断（与 index.js 的 looksRelevant 同一思路）：中文取二元组、拉丁取长度 ≥2 的词。
// Bing 图片对疑似机器请求会返回无关的缓存结果（例如搜"Lu Xun"得到 Jeff Bezos），
// 结果里至少三分之一的标题 / 来源页含查询词才算可信。
export function queryTokens(query) {
  const tokens = new Set();
  for (const run of String(query).match(/[\u4e00-\u9fff]+/g) ?? []) {
    if (run.length <= 2) tokens.add(run);
    for (let i = 0; i + 1 < run.length; i++) tokens.add(run.slice(i, i + 2));
  }
  for (const word of String(query).toLowerCase().split(/[^a-z0-9]+/)) if (word.length >= 2) tokens.add(word);
  return [...tokens];
}

export function imagesLookRelevant(query, images) {
  const tokens = queryTokens(query);
  if (tokens.length === 0 || images.length === 0) return images.length > 0;
  const hits = images.filter((image) => {
    let hay = `${image.title ?? ""} ${image.sourceUrl ?? ""} ${image.url ?? ""}`.toLowerCase();
    try {
      hay = decodeURIComponent(hay);
    } catch {}
    return tokens.some((t) => hay.includes(t.toLowerCase()));
  }).length;
  return hits >= Math.max(1, Math.ceil(images.length / 3));
}

const PROVIDER_FNS = {
  wikimedia: searchWikimedia,
  openverse: searchOpenverse,
  pexels: searchPexels,
  unsplash: searchUnsplash,
  pixabay: searchPixabay,
  "bing-images": searchBingImages,
};

export function normalizeImageProviderOrder(order) {
  const out = [];
  for (const id of Array.isArray(order) ? order : []) if (IMAGE_PROVIDERS.includes(id) && !out.includes(id)) out.push(id);
  for (const id of DEFAULT_IMAGE_PROVIDER_ORDER) if (!out.includes(id)) out.push(id);
  return out;
}

/**
 * 按顺序搜图：指定 provider 时只用它；否则按设置顺序跳过禁用 / 缺 key 的图源，第一个有结果的返回。
 * deps: { fetchFn(provider) → fetch, resolveKey(provider) → key, runProxied(provider, fn), signal }
 */
const PROVIDER_HOSTS = {
  wikimedia: "commons.wikimedia.org",
  openverse: "api.openverse.org",
  pexels: "api.pexels.com",
  unsplash: "api.unsplash.com",
  pixabay: "pixabay.com",
  "bing-images": "www.bing.com",
};

// undici 的网络错误只有一句 "fetch failed"：补上图源、主机、错误码和处理建议
export function explainNetworkError(provider, error) {
  if (!(error instanceof Error) || error.name === "AbortError" || !/^fetch failed$|ECONN|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|UND_ERR/i.test(error.message)) {
    return error instanceof Error ? error : new Error(String(error));
  }
  const code = error.cause?.code || error.cause?.name || error.code || "";
  const host = PROVIDER_HOSTS[provider] ?? provider;
  return new Error(
    `${provider}: could not reach ${host}${code ? ` (${code})` : ""} - your network may block it; tick "${provider}" under Proxy in the Free Search settings, or use another source`,
    { cause: error }
  );
}

export async function searchImages(request, settings, deps) {
  const query = String(request.query ?? "").trim();
  if (!query) throw new Error("query is required");
  const count = Math.min(Math.max(Math.floor(Number(request.count) || 12), 1), 30);
  const page = Math.max(1, Math.floor(Number(request.page) || 1));
  const orientation = ORIENTATIONS.includes(request.orientation) ? request.orientation : "any";
  const disabled = new Set(Array.isArray(settings.disabled) ? settings.disabled : []);
  const explicit = IMAGE_PROVIDERS.includes(request.provider) ? request.provider : null;
  const chain = explicit ? [explicit] : normalizeImageProviderOrder(settings.order).filter((p) => !disabled.has(p));
  const notes = [];
  let lastError = null;
  for (const provider of chain) {
    const keySpec = IMAGE_PROVIDER_KEYS[provider];
    const key = keySpec ? await deps.resolveKey(provider) : undefined;
    if (keySpec && !key) {
      notes.push(`${provider} skipped (no ${keySpec.env})`);
      if (explicit) throw new Error(`${provider} needs ${keySpec.env} - set it under Settings > Plugins > Free Search > API keys`);
      continue;
    }
    try {
      const result = await deps.runProxied(provider, () =>
        PROVIDER_FNS[provider](
          { query, page, count, orientation, key, market: settings.market, safeSearch: settings.safeSearch },
          { fetchFn: deps.fetchFn, signal: deps.signal }
        )
      );
      let images = dedupeImages(result.images).map(({ _mime, ...image }) => image);
      if (provider === "bing-images" && images.length > 0 && !imagesLookRelevant(query, images)) {
        notes.push("bing-images returned unrelated results");
        images = [];
      }
      if (images.length > 0) {
        return { kind: "search", query, provider, page, count, total: result.total, images, ...(notes.length ? { note: notes.join("; ") } : {}) };
      }
      if (provider === "bing-images" && typeof deps.webImages === "function") {
        // Bing 图片拿不到可信结果：改用联网搜索（按网页搜索的引擎设置）找页面，再从页面里提取图片
        const fromPages = await deps.webImages(query, count);
        if (fromPages.images.length > 0) {
          notes.push(`bing-images had no usable results; pictures extracted from ${fromPages.pages} page(s) found by web search`);
          return { kind: "search", query, provider, page, count, total: fromPages.images.length, images: fromPages.images, note: notes.join("; ") };
        }
      }
      if (!notes.some((n) => n.startsWith(`${provider} `))) notes.push(`${provider} returned 0 results`);
    } catch (rawError) {
      const error = explainNetworkError(provider, rawError);
      lastError = error;
      notes.push(`${provider} failed (${error.message})`);
      if (explicit) throw error;
    }
  }
  if (lastError && notes.every((n) => /failed|skipped/.test(n))) throw new Error(`all image providers failed: ${notes.join("; ")}`);
  return { kind: "search", query, provider: chain[0] ?? "none", page, count, total: 0, images: [], note: notes.join("; ") || "no enabled image providers" };
}
//#endregion

//#region page extraction
const JUNK_URL = /(^|[\/_.\-])(logo|icon|favicon|avatar|sprite|emoji|emoticon|badge|button|btn|spacer|blank|pixel|tracking|beacon|loading|placeholder|qrcode|qr-code|share|arrow)s?([\/_.\-]|$)|doubleclick|googleads|googlesyndication|\/ads?\/|adservice|analytics|gravatar\.com/i;
const JUNK_CLASS = /\b(logo|icon|avatar|emoji|sprite|badge|ad|ads|advert|qrcode|share)\b/i;
const WIKI_JUNK_FILE = /(flag[_ ]of|icon|logo|symbol|stub|wiki(pedia|data|source|quote|news|voyage|books|versity|species)|commons-logo|edit-|ambox|question[_ ]book|padlock|disambig|oojs|red[_ ]pencil|crystal[_ ]clear|nuvola|increase|decrease|steady|portal|star[_ ]full|symbol_support|folder|information|pictogram|audio|speaker|loudspeaker|map[_ ]marker|blue[_ ]pencil)/i;

function attr(tag, name) {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return m ? decodeEntities(m[2] ?? m[3] ?? m[4] ?? "") : "";
}

// srcset 里挑最大的候选（按 w 描述符或 x 倍率）
export function pickFromSrcset(srcset) {
  let best = null;
  let bestScore = -1;
  for (const part of String(srcset).split(/,\s+(?=\S)/)) {
    const [u, d] = part.trim().split(/\s+/);
    if (!u) continue;
    const score = d ? parseFloat(d) * (d.endsWith("x") ? 1000 : 1) : 1;
    if (score > bestScore) {
      best = u;
      bestScore = score;
    }
  }
  return best;
}

function collectJsonLdImages(html, base) {
  const out = [];
  const blocks = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) ?? [];
  const walk = (node, depth) => {
    if (!node || depth > 6) return;
    if (Array.isArray(node)) return node.forEach((n) => walk(n, depth + 1));
    if (typeof node !== "object") return;
    for (const [k, v] of Object.entries(node)) {
      if (k === "image" || k === "thumbnailUrl" || k === "contentUrl") {
        for (const item of Array.isArray(v) ? v : [v]) {
          const u = typeof item === "string" ? item : item?.url ?? item?.contentUrl;
          const abs = absUrl(u, base);
          if (abs) out.push(abs);
        }
      } else if (typeof v === "object") walk(v, depth + 1);
    }
  };
  for (const block of blocks) {
    try {
      walk(JSON.parse(block.replace(/^<script[^>]*>|<\/script>$/gi, "")), 0);
    } catch {}
  }
  return out;
}

/**
 * 通用网页取图：结构化图片（og:image / twitter:image / JSON-LD）+ 正文 <img>/<picture>，
 * 带 figcaption / alt 作标题，过滤追踪像素、logo、图标等。返回候选（尺寸未探测）。
 */
export function extractGenericImages(html, pageUrl, { includeSvg = false } = {}) {
  const text = String(html);
  const baseTag = text.match(/<base\s[^>]*href=["']([^"']+)["']/i);
  const base = absUrl(baseTag?.[1], pageUrl) ?? pageUrl;
  const pageTitle = stripTags(text.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").slice(0, 120);
  const candidates = [];
  const push = (url, fields) => {
    const abs = absUrl(url, base);
    if (!abs) return;
    if (!includeSvg && /\.svg(\?|#|$)/i.test(abs)) return;
    if (JUNK_URL.test(new URL(abs).pathname + new URL(abs).search)) return;
    candidates.push({ url: abs, ...fields });
  };

  for (const tag of text.match(/<meta\b[^>]*>/gi) ?? []) {
    const prop = (attr(tag, "property") || attr(tag, "name") || attr(tag, "itemprop")).toLowerCase();
    if (/^(og:image(:url|:secure_url)?|twitter:image(:src)?|image|thumbnailurl)$/.test(prop)) {
      push(attr(tag, "content"), { rank: 3, title: pageTitle });
    }
  }
  for (const u of collectJsonLdImages(text, base)) push(u, { rank: 3, title: pageTitle });

  // figure 标题：记下每个 figure 里图片 → figcaption 的对应
  const captions = new Map();
  for (const fig of text.match(/<figure\b[\s\S]*?<\/figure>/gi) ?? []) {
    const cap = stripTags(fig.match(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/i)?.[1] ?? "");
    if (!cap) continue;
    for (const img of fig.match(/<img\b[^>]*>/gi) ?? []) captions.set(img, cap.slice(0, 200));
  }

  for (const tag of text.match(/<(img|source)\b[^>]*>/gi) ?? []) {
    const cls = attr(tag, "class") + " " + attr(tag, "id");
    if (JUNK_CLASS.test(cls)) continue;
    const w = parseInt(attr(tag, "width"), 10);
    const h = parseInt(attr(tag, "height"), 10);
    if ((w > 0 && w < 48) || (h > 0 && h < 48)) continue;
    const srcset = attr(tag, "data-srcset") || attr(tag, "srcset");
    const src =
      attr(tag, "data-original") || attr(tag, "data-src") || attr(tag, "data-lazy-src") || attr(tag, "data-actualsrc") ||
      attr(tag, "data-url") || (srcset ? pickFromSrcset(srcset) : "") || attr(tag, "src");
    const caption = captions.get(tag) ?? "";
    const alt = attr(tag, "alt") || attr(tag, "title");
    push(src, { rank: caption ? 2 : alt ? 1 : 0, title: (caption || alt).slice(0, 200), width: w > 0 ? w : 0, height: h > 0 ? h : 0 });
  }

  // 同一图片保留排名最高的那条
  const byKey = new Map();
  for (const c of candidates) {
    const key = normalizeImageKey(c.url);
    const prev = byKey.get(key);
    if (!prev || c.rank > prev.rank || (c.rank === prev.rank && !prev.title && c.title)) byKey.set(key, { ...prev, ...c });
  }
  return { pageTitle, candidates: [...byKey.values()] };
}

function baikeLemma(pageUrl) {
  try {
    const u = new URL(pageUrl);
    if (!/(^|\.)baike\.baidu\.com$/i.test(u.hostname)) return null;
    const m = u.pathname.match(/^\/item\/([^/]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  } catch {
    return null;
  }
}

async function baikeCardImages(lemma, pageUrl, pageError, deps) {
  const params = new URLSearchParams({ scope: "103", format: "json", appid: "379020", bk_key: lemma, bk_length: "600" });
  const { response } = await guardedFetch(`https://baike.baidu.com/api/openapi/BaikeLemmaCardApi?${params}`, { headers: { "user-agent": BROWSER_UA, accept: "application/json" }, signal: withTimeout(deps.signal) }, deps);
  const data = response.ok ? await response.json().catch(() => null) : null;
  const url = typeof data?.image === "string" ? data.image : "";
  if (!isHttpUrl(url)) throw pageError;
  const image = makeImage({
    url: url.replace(/\?.*$/, ""),
    title: data.title || lemma,
    sourceUrl: data.url || pageUrl,
    pageUrl,
    pageTitle: data.title || lemma,
    license: "版权归原作者 / copyright of the original owner",
    provider: "page",
  });
  return { pageUrl, pageTitle: data.title || lemma, via: "baike-api", images: image ? [image] : [], note: `page blocked (${pageError.message}); lemma card image only` };
}

// 百度百科：图片都在 bkimg.cdn.bcebos.com 图床，去掉 x-bce-process 缩放参数得到原图
export function extractBaikeImages(html) {
  const text = String(html).replace(/\\u002F/gi, "/").replace(/\\\//g, "/");
  const pageTitle = stripTags(text.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").replace(/_百度百科$/, "");
  const found = new Map();
  for (const m of text.matchAll(/(?:https?:)?\/\/bkimg\.cdn\.bcebos\.com\/(?:pic|smart)\/[^"'\s)<>\\]+/g)) {
    const raw = m[0].startsWith("//") ? `https:${m[0]}` : m[0];
    let url;
    try {
      const u = new URL(decodeEntities(raw));
      u.search = "";
      url = u.href;
    } catch {
      continue;
    }
    const key = url.toLowerCase();
    if (!found.has(key)) found.set(key, { url, rank: found.size === 0 ? 3 : 1, title: pageTitle });
  }
  return { pageTitle, candidates: [...found.values()] };
}

function wikipediaTarget(pageUrl) {
  try {
    const u = new URL(pageUrl);
    const m = u.hostname.match(/^([a-z0-9-]+)(?:\.m)?\.wikipedia\.org$/i);
    if (!m) return null;
    let title = null;
    const wiki = u.pathname.match(/^\/(?:wiki|zh(?:-[a-z]+)?)\/(.+)$/i);
    if (wiki) title = decodeURIComponent(wiki[1]);
    else if (u.searchParams.get("title")) title = u.searchParams.get("title");
    if (!title) return null;
    return { lang: m[1].toLowerCase(), title: title.replace(/_/g, " ") };
  } catch {
    return null;
  }
}

async function extractWikipediaImages(target, pageUrl, opts, deps) {
  const api = `https://${target.lang}.wikipedia.org/w/api.php`;
  const headers = { "user-agent": WIKIMEDIA_UA, accept: "application/json" };
  const first = new URLSearchParams({
    action: "query", format: "json", titles: target.title, redirects: "1", prop: "pageimages|images|info",
    piprop: "original|name", imlimit: "100", inprop: "url",
  });
  const data = await getJson(deps.fetchFn, `${api}?${first}`, { headers, signal: withTimeout(deps.signal) }, "Wikipedia");
  const page = Object.values(data?.query?.pages ?? {})[0];
  if (!page || page.missing !== undefined) throw new Error(`Wikipedia page not found: ${target.title}`);
  // pageimage 用下划线，images / imageinfo 的 title 用空格：统一成空格再比较
  const leadName = page.pageimage ? `File:${String(page.pageimage).replace(/_/g, " ")}` : null;
  const files = [...new Set([...(leadName ? [leadName] : []), ...(page.images ?? []).map((i) => i.title)])]
    .filter((t) => !WIKI_JUNK_FILE.test(t))
    .filter((t) => opts.includeSvg || !/\.svg$/i.test(t))
    .filter((t) => /\.(jpe?g|png|gif|webp|tiff?|svg)$/i.test(t))
    .slice(0, 50);
  if (files.length === 0) return { pageTitle: page.title, images: [] };
  const second = new URLSearchParams({
    action: "query", format: "json", titles: files.join("|"), prop: "imageinfo",
    iiprop: "url|size|mime|extmetadata", iiurlwidth: "480", iiextmetadatafilter: "Artist|LicenseShortName|ObjectName|ImageDescription",
  });
  const info = await getJson(deps.fetchFn, `${api}?${second}`, { headers, signal: withTimeout(deps.signal) }, "Wikipedia");
  const pages = Object.values(info?.query?.pages ?? {});
  const images = [];
  for (const p of pages) {
    const image = wikiPageToImage(p, "page", { pageUrl, pageTitle: page.title });
    if (!image) continue;
    const desc = pickMeta(p.imageinfo?.[0]?.extmetadata, "ImageDescription");
    if (desc && desc.length < 200) image.title = desc;
    image._rank = String(p.title).replace(/_/g, " ") === leadName ? 3 : 1;
    images.push(image);
  }
  return { pageTitle: page.title, images };
}

async function fetchPageHtml(pageUrl, deps) {
  const origin = (() => {
    try {
      return new URL(pageUrl).origin + "/";
    } catch {
      return undefined;
    }
  })();
  // 先按桌面浏览器请求；被 403/429 拒绝时再用移动端 UA 试一次（不少站点对移动端放行）
  let { response, finalUrl } = await guardedFetch(pageUrl, { headers: pageHeaders(), signal: withTimeout(deps.signal) }, deps);
  if (response.status === 403 || response.status === 429) {
    try {
      await response.body?.cancel();
    } catch {}
    ({ response, finalUrl } = await guardedFetch(pageUrl, { headers: { ...pageHeaders(MOBILE_UA), ...(origin ? { referer: origin } : {}) }, signal: withTimeout(deps.signal) }, deps));
  }
  if (!response.ok) {
    const error = new Error(`page answered HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  const type = response.headers.get("content-type") ?? "";
  if (type && !/html|xml|text\/plain/i.test(type)) throw new Error(`not an HTML page (content-type ${type.split(";")[0]})`);
  const buffer = await readCapped(response, MAX_PAGE_BYTES);
  const charset = (type.match(/charset=([\w-]+)/i)?.[1] ?? buffer.toString("latin1", 0, 2048).match(/<meta[^>]+charset=["']?([\w-]+)/i)?.[1] ?? "utf-8").toLowerCase();
  let html;
  try {
    html = new TextDecoder(charset).decode(buffer);
  } catch {
    html = buffer.toString("utf8");
  }
  return { html, finalUrl };
}

/**
 * 从一个网页提取图片。opts: { minSize, maxPerPage, includeSvg }
 * deps: { fetchFn, lookup, signal }
 */
export async function extractPageImages(pageUrl, opts, deps) {
  const minSize = Math.max(0, Number(opts.minSize) || 0);
  const maxPerPage = Math.min(Math.max(Number(opts.maxPerPage) || 30, 1), 60);
  await assertPublicUrl(pageUrl, deps.lookup);

  const wiki = wikipediaTarget(pageUrl);
  if (wiki) {
    const { pageTitle, images } = await extractWikipediaImages(wiki, pageUrl, opts, deps);
    const kept = images
      .filter((i) => Math.max(i.width, i.height) >= minSize || (!i.width && !i.height))
      .sort((a, b) => b._rank - a._rank || b.width * b.height - a.width * a.height)
      .slice(0, maxPerPage)
      .map(({ _rank, _mime, ...image }) => image);
    return { pageUrl, pageTitle, via: "wikipedia-api", images: kept };
  }

  let fetched;
  try {
    fetched = await fetchPageHtml(pageUrl, deps);
  } catch (error) {
    // 百度百科页面被拒（403 安全验证、连接被重置等）时，退回百科开放接口拿词条主图（只有一张，但总比没有好）
    const baike = baikeLemma(pageUrl);
    if (baike && !deps.signal?.aborted) return await baikeCardImages(baike, pageUrl, error, deps);
    throw error;
  }
  const { html, finalUrl } = fetched;
  const isBaike = /(^|\.)baike\.baidu\.com$/i.test(hostOf(finalUrl));
  const primary = isBaike ? extractBaikeImages(html) : { pageTitle: "", candidates: [] };
  const generic = extractGenericImages(html, finalUrl, opts);
  const pageTitle = primary.pageTitle || generic.pageTitle;
  const merged = new Map();
  for (const c of [...primary.candidates, ...generic.candidates]) {
    const key = normalizeImageKey(c.url);
    if (!merged.has(key)) merged.set(key, c);
  }
  let candidates = [...merged.values()].sort((a, b) => b.rank - a.rank).slice(0, 60);

  // 探测尺寸（最多 40 张、4 路并发），小于 minSize 的丢弃；探测失败的保留但排在后面
  const probeCount = Math.min(candidates.length, 40);
  const sizes = await mapLimit(candidates.slice(0, probeCount), 4, (c) =>
    c.width && c.height && Math.max(c.width, c.height) >= minSize ? { width: c.width, height: c.height } : probeSize({ url: c.url, pageUrl: finalUrl }, deps, deps.signal)
  );
  candidates = candidates.map((c, i) => (i < probeCount && sizes[i] ? { ...c, width: sizes[i].width, height: sizes[i].height, probed: true } : c));
  const images = candidates
    .filter((c) => !(c.width && c.height) || Math.max(c.width, c.height) >= minSize)
    .filter((c) => !(c.width && c.height) || (c.width / c.height < 8 && c.height / c.width < 8))
    .sort((a, b) => {
      const known = (x) => (x.width && x.height ? 1 : 0);
      return b.rank - a.rank || known(b) - known(a) || b.width * b.height - a.width * a.height;
    })
    .slice(0, maxPerPage)
    .map((c) =>
      makeImage({
        url: c.url,
        width: c.width,
        height: c.height,
        title: c.title || pageTitle,
        sourceUrl: finalUrl,
        pageUrl: finalUrl,
        pageTitle,
        license: isBaike ? "版权归原作者 / copyright of the original owner" : "",
        provider: "page",
      })
    )
    .filter(Boolean);
  return { pageUrl: finalUrl, pageTitle, via: isBaike ? "baike" : "html", images };
}

// query 模式下挑页面：百科 / 维基优先，其次其余结果，去掉明显不含图片的站点
// 选页面时不计入的通用词（"钱学森 维基百科" 只看 "钱学森"）
const GENERIC_PAGE_WORDS = /维基百科|維基百科|百度百科|百科|图片|圖片|照片|素材|高清|壁纸|wikipedia|wiki|baike|encyclopedia|photos?|images?|pictures?|pics?/gi;

function pageRelevance(tokens, source) {
  if (tokens.length === 0) return 1;
  let hay = `${source.title ?? ""} ${source.url ?? ""}`;
  try {
    hay += ` ${decodeURIComponent(source.url ?? "")}`;
  } catch {}
  hay = hay.toLowerCase();
  return tokens.filter((t) => hay.includes(t)).length / tokens.length;
}

export function pickPagesForImages(sources, limit = 4, query = "") {
  const tokens = queryTokens(String(query).replace(GENERIC_PAGE_WORDS, " "));
  const score = (url) => {
    const host = hostOf(url);
    if (/wikipedia\.org$/.test(host)) return 5;
    if (/baike\.baidu\.com$|baike\.sogou\.com$|zh\.wikihow\.com$|britannica\.com$/.test(host)) return 4;
    if (/\.gov(\.[a-z]{2})?$|\.edu(\.[a-z]{2})?$|museum/.test(host)) return 3;
    if (/zhihu\.com$|weibo\.com$|douyin\.com$|bilibili\.com$|youtube\.com$|x\.com$|twitter\.com$|facebook\.com$|reddit\.com$/.test(host)) return 0;
    return 2;
  };
  const seen = new Set();
  return sources
    .filter((s) => isHttpUrl(s?.url))
    .map((s, i) => ({ ...s, _score: score(s.url), _rel: pageRelevance(tokens, s), _i: i }))
    .filter((s) => s._score > 0)
    .filter((s, _, all) => s._rel > 0 || !all.some((o) => o._rel > 0))
    .sort((a, b) => (b._rel > 0) - (a._rel > 0) || b._score - a._score || b._rel - a._rel || a._i - b._i)
    .filter((s) => {
      const host = hostOf(s.url);
      if (seen.has(host)) return false;
      seen.add(host);
      return true;
    })
    .slice(0, limit)
    .map(({ _score, _rel, _i, ...s }) => s);
}
//#endregion

//#region save to disk
export function safeFileName(name, fallback = "image") {
  const cleaned = String(name ?? "")
    .replace(ZERO_WIDTH, "")
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\.+/, "")
    .slice(0, 80)
    .trim();
  return cleaned || fallback;
}

export function extensionFor(url, contentType) {
  const byType = { "image/jpeg": ".jpg", "image/png": ".png", "image/gif": ".gif", "image/webp": ".webp", "image/svg+xml": ".svg", "image/avif": ".avif", "image/bmp": ".bmp", "image/tiff": ".tif" };
  if (byType[contentType]) return byType[contentType];
  const m = String(url).match(/\.(jpe?g|png|gif|webp|svg|avif|bmp|tiff?)(?:$|[?#])/i);
  return m ? `.${m[1].toLowerCase().replace("jpeg", "jpg")}` : ".img";
}

// 同名文件自动加 -2、-3…
export function uniquePath(dir, base, ext, taken = new Set()) {
  for (let i = 1; i < 10000; i++) {
    const name = `${base}${i === 1 ? "" : `-${i}`}${ext}`;
    const full = path.join(dir, name);
    if (!taken.has(full) && !fs.existsSync(full)) {
      taken.add(full);
      return full;
    }
  }
  throw new Error("could not find a free file name");
}

// 保存目录：显式设置 > 会话工作区/images > ~/Downloads/dsh-images
export function resolveSaveDir(configured, sessionCwd, subdir) {
  const expand = (p) => (p.startsWith("~") ? path.join(os.homedir(), p.slice(1)) : p);
  let dir;
  if (typeof configured === "string" && configured.trim()) dir = path.resolve(sessionCwd || os.homedir(), expand(configured.trim()));
  else if (sessionCwd) dir = path.join(sessionCwd, "images");
  else dir = path.join(os.homedir(), "Downloads", "dsh-images");
  if (subdir) {
    const safe = safeFileName(subdir, "");
    if (safe) dir = path.join(dir, safe);
  }
  return dir;
}

// Wikimedia 缩略图 URL（/thumb/…/480px-name）→ 最长 1920px 的标准档位；原图不够大或不是 Wikimedia 时返回 null
export function wikimediaLargeThumb(image) {
  if (!image || !isWikimediaHost(image.url)) return null;
  const m = String(image.thumbUrl ?? "").match(/^(https:\/\/upload\.wikimedia\.org\/.+\/thumb\/.+\/)(\d+)px-([^/]+)$/);
  if (!m) return null;
  const width = Math.min(Number(image.width) || 1920, 1920);
  if (width <= Number(m[2])) return null;
  return { url: `${m[1]}${width}px-${m[3]}`, width };
}

/**
 * 下载并保存图片。items: 结果编号（img_xxxxxxxx）或图片 URL。
 * deps: { fetchFn, lookup, signal }
 */
export async function saveImages(items, dir, deps, { maxItems = 30 } = {}) {
  const list = (Array.isArray(items) ? items : [items]).map((s) => String(s ?? "").trim()).filter(Boolean).slice(0, maxItems);
  if (list.length === 0) throw new Error("items is empty - pass result ids (img_xxxxxxxx) or image URLs");
  fs.mkdirSync(dir, { recursive: true });
  const taken = new Set();
  const saved = [];
  const failed = [];
  const saveOne = async (item) => {
    const known = /^img_[0-9a-f]{8}$/i.test(item) ? lookupImage(item) : null;
    if (/^img_/i.test(item) && !known) {
      failed.push({ item, error: "unknown result id (search again, or pass the image URL)" });
      return;
    }
    const url = known ? known.url : item;
    const referer = known?.pageUrl ?? known?.sourceUrl;
    try {
      let got;
      let note;
      try {
        got = await fetchImage(saveableUrl(url), { referer, signal: deps.signal, forSave: true }, deps);
      } catch (error) {
        // Wikimedia 原图被限流时，退回 1920px 的标准缩略图
        const fallback = deps.signal?.aborted ? null : wikimediaLargeThumb(known);
        if (!fallback) throw error;
        got = await fetchImage(fallback.url, { referer, signal: deps.signal, forSave: true }, deps);
        note = `downscaled to ${fallback.width}px, original failed: ${error instanceof Error ? error.message : String(error)}`;
      }
      const { buffer, contentType } = got;
      const title = known?.title || decodeURIComponent(new URL(url).pathname.split("/").pop() || "").replace(/\.[a-z0-9]+$/i, "");
      const host = hostOf(known?.pageUrl ?? known?.sourceUrl ?? url);
      // 先截标题再拼域名，避免域名被截掉
      const suffix = host ? ` - ${safeFileName(host, "")}` : "";
      const base = `${safeFileName(title).slice(0, Math.max(20, 80 - suffix.length)).trim()}${suffix}`;
      const file = uniquePath(dir, base, extensionFor(url, contentType), taken);
      fs.writeFileSync(file, buffer);
      const size = imageSize(buffer);
      saved.push({ item, file, bytes: buffer.length, ...(size ? { width: size.width, height: size.height } : {}), ...(known?.sourceUrl ? { sourceUrl: known.sourceUrl } : {}), ...(note ? { note } : {}) });
    } catch (error) {
      failed.push({ item, error: error instanceof Error ? error.message : String(error) });
    }
  };
  // 同一主机串行（避免触发限流），不同主机之间并发
  const byHost = new Map();
  for (const item of list) {
    const known = /^img_[0-9a-f]{8}$/i.test(item) ? lookupImage(item) : null;
    const key = hostOf(known ? known.url : item) || item;
    if (!byHost.has(key)) byHost.set(key, []);
    byHost.get(key).push(item);
  }
  await mapLimit([...byHost.values()], 4, async (group) => {
    for (const item of group) await saveOne(item);
  });
  const order = new Map(list.map((item, i) => [item, i]));
  saved.sort((a, b) => order.get(a.item) - order.get(b.item));
  failed.sort((a, b) => order.get(a.item) - order.get(b.item));
  return { dir, saved, failed };
}
//#endregion

//#region model-facing text
function describeImage(image, n) {
  const size = image.width && image.height ? `${image.width}×${image.height}` : "size unknown";
  const bits = [`${n}. [${image.id}] ${image.title ? image.title.slice(0, 120) : "(untitled)"} — ${size}`];
  bits.push(`   image: ${image.url}`);
  if (image.sourceUrl && image.sourceUrl !== image.url) bits.push(`   source: ${image.sourceUrl}`);
  const credit = [image.author ? `by ${image.author.slice(0, 80)}` : "", image.license ? image.license : ""].filter(Boolean).join(", ");
  if (credit) bits.push(`   credit: ${credit}`);
  return bits.join("\n");
}

export function renderSearchText(outcome) {
  const head = `Image search (${outcome.provider}, page ${outcome.page}) for "${outcome.query}": ${outcome.images.length} images.`;
  const lines = outcome.images.map((image, i) => describeImage(image, i + 1));
  const tail = outcome.note ? `\nNote: ${outcome.note}` : "";
  return `${head}\n${lines.join("\n") || "No images found."}${tail}\nThe user sees these as an image wall. Save any of them locally with save_images using the [img_…] ids.`;
}

export function renderPagesText(outcome) {
  const parts = [`Page images${outcome.query ? ` for "${outcome.query}"` : ""}: ${outcome.images.length} images from ${outcome.pages.length} page(s).`];
  let n = 0;
  for (const page of outcome.pages) {
    parts.push(`\n## ${page.pageTitle || page.pageUrl} (${page.pageUrl})${page.error ? ` — failed: ${page.error}` : ""}`);
    for (const image of outcome.images.filter((i) => i.pageUrl === page.pageUrl)) parts.push(describeImage(image, ++n));
  }
  if (outcome.note) parts.push(`\nNote: ${outcome.note}`);
  parts.push("\nImages from web pages are copyrighted by their owners unless a license is shown; use them as reference material. Save any of them locally with save_images using the [img_…] ids.");
  return parts.join("\n");
}
//#endregion
