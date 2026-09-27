// platform_search 冒烟测试：对每个平台发一次真实请求，打印结果条数和第一条标题。
// 用法：node scripts/platform-smoke.mjs [关键词] [平台,平台,...]
// GitHub Actions 里由 .github/workflows/platform-smoke.yml 手动触发（运行器有正常外网）。
import { PLATFORMS, searchPlatform } from "../lib/index.js";

const query = process.argv[2] || "deepseek";
const only = process.argv[3] ? process.argv[3].split(",") : Object.keys(PLATFORMS);
let failed = 0;
for (const platform of only) {
  const started = Date.now();
  try {
    const result = await searchPlatform(platform, query, 3, AbortSignal.timeout(20000), "zh");
    const n = result.sources.length;
    if (n === 0) failed++;
    console.log(`${n > 0 ? "OK  " : "EMPTY"} ${platform.padEnd(14)} ${String(Date.now() - started).padStart(5)}ms  ${n} results  ${n ? JSON.stringify(result.sources[0].title) + " " + result.sources[0].url : ""}`);
  } catch (error) {
    failed++;
    console.log(`FAIL  ${platform.padEnd(14)} ${String(Date.now() - started).padStart(5)}ms  ${error instanceof Error ? error.message : String(error)}`);
  }
}
console.log(`\n${only.length - failed}/${only.length} platforms returned results for "${query}"`);
