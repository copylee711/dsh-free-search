import assert from "node:assert/strict";
import * as m from "../lib/index.js";
const tools = {}; let provider; const logs = []; let prompt = "";
const cfgRaw = { provider: "auto", disabledEngines: ["openai"], legacyYamlMigrated: true };
const settings = { configure() { return () => {}; }, describe() { return []; }, async mutate() {}, writable: true };
const sctx = {
  effect(fn) { fn(); }, on() {}, get: () => undefined, settings,
  tools: { register(t) { tools[t.name] = t; return () => {}; } },
  webServer: { register() { return () => {}; } },
  systemPrompt: { section(s) { prompt = s.text; return () => {}; } },
};
const web = { searchProviderId: "deepseek-official", registerSearchProvider(p) { provider = p; return () => {}; } };
const ctx = { logger: { info: (x) => logs.push(x), warn: (x) => logs.push("W " + x), error() {} }, inject: (d, cb) => cb(sctx), get: () => undefined, web, fiber: {} };
process.env.DSH_HOME = "/nonexistent";
m.apply(ctx, cfgRaw);
assert.equal(web.searchProviderId, "ddg"); assert.ok(logs.some((l) => /taking over from the default provider "deepseek-official"/.test(l)));
assert.ok(["free_search_test", "platform_search", "advanced_search", "multi_search"].every((n) => tools[n]), Object.keys(tools).join());
assert.ok(prompt.includes("auto (smart routing") && prompt.includes("- doubao") && prompt.includes("multi_search"));
// web_search via auto: CJK query -> bing first; mock bing HTML empty so it falls back; baidu/aliyun have no key -> skipped; anysearch mocked
const calls = [];
globalThis.fetch = async (url) => {
  calls.push(String(url).split("?")[0]);
  if (String(url).includes("anysearch")) return new Response(JSON.stringify({ data: { results: [{ url: "https://a.cn", title: "A", content: "内容" }] } }), { headers: { "content-type": "application/json" } });
  return new Response("<html></html>", { status: 200 });
};
let res;
try { res = await provider.search({ query: "今天的新闻", maxResults: 3 }); } catch (e) { res = { error: e.message }; }


// multi_search executes and merges
globalThis.fetch = async (url) => new Response(JSON.stringify({ data: { results: [{ url: "https://x.com/", title: "X" }] }, results: [{ url: "https://x.com", title: "X" }] }), { headers: { "content-type": "application/json" } });
const ms = await tools.multi_search.execute({ query: "hello", engines: ["anysearch", "tavily", "baidu"] });

assert.ok(ms.content.includes("skipped (no key): [baidu]"));
console.log("apply ok");
