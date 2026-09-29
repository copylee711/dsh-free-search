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
      "https://www.britannica.com/biography/Lu-Xun",
    ];
const keys = { pexels: process.env.PEXELS_API_KEY, unsplash: process.env.UNSPLASH_ACCESS_KEY, pixabay: process.env.PIXABAY_API_KEY };
const deps = { fetchFn: fetch, resolveKey: async (p) => keys[p] ?? "", runProxied: (_p, fn) => fn() };
let failed = 0;
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
    line(Boolean(first), `image_search ${provider}`, Date.now() - started, `${r.images.length} images${first ? `  ${first.width}x${first.height} ${JSON.stringify(first.title ?? "")} ${first.url}` : ""}`);
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
    line(Boolean(first), `page_images ${new URL(url).hostname}`, Date.now() - started, `${r.images.length} images via ${r.via} (${JSON.stringify(r.pageTitle)})${first ? `  ${first.width}x${first.height} ${first.url}` : ""}`);
    // 再真实下载一张，验证 Referer / 防盗链 / 类型校验
    if (first) {
      const img = await images.fetchImage(first.url, { referer: first.pageUrl }, { fetchFn: fetch });
      const size = images.imageSize(img.buffer);
      console.log(`     download ${img.contentType} ${img.buffer.length} bytes ${size ? `${size.width}x${size.height}` : ""}`);
    }
  } catch (error) {
    failed++;
    line(false, `page_images ${new URL(url).hostname}`, Date.now() - started, error instanceof Error ? error.message : String(error));
  }
}
console.log(`\n${total - failed}/${total} checks returned images for "${query}"`);
process.exitCode = failed > 0 ? 1 : 0;
