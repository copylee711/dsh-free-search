import assert from "node:assert/strict";
import * as m from "../lib/index.js";
const { buildEngineChain: b, parseOpenAIWebSearch: p, openaiResponsesUrl: u, Config } = m;
// defaults = old behaviour, openai skipped
let r = b({ provider: "bing" });
assert.deepEqual(r.chain, ["bing","exa","anysearch","tavily","keenable","firecrawl","parallel","ddg","ddg-lite","searxng","perplexity","serpbase","deepseek-official","you","baidu","kimi","aliyun","doubao"]);
// 0.5.0's saved default is treated as "default" and becomes free-first
const old050 = ["exa","tavily","keenable","firecrawl","parallel","perplexity","serpbase","deepseek-official","you","baidu","kimi","aliyun","doubao","openai","bing","anysearch","ddg","ddg-lite","searxng"];
assert.deepEqual(m.normalizeEngineOrder(old050), m.DEFAULT_ENGINE_ORDER);
const custom = old050.slice().reverse();
assert.deepEqual(m.normalizeEngineOrder(custom), custom);
// preferred openai still tried first even though disabled
assert.equal(b({ provider: "openai" }).chain[0], "openai");
// list mode, custom order, disabled
r = b({ priorityMode: "list", engineOrder: ["openai","bing","ddg"], disabledEngines: ["ddg"] });
assert.deepEqual(r.chain.slice(0,3), ["openai","bing","exa"]); assert.ok(!r.chain.includes("ddg")); assert.equal(r.preferred, "openai");
// explicit engine beats list
assert.equal(b({ priorityMode: "list" }, { engine: "ddg" }).chain[0], "ddg");
// time range: non-time preferred skipped
r = b({ provider: "bing" }, { timeRange: { days: 7 } });
assert.equal(r.preferredSkippedReason, "time-filter"); assert.ok(!r.chain.includes("bing")); assert.equal(r.chain[0], "exa");
r = b({ provider: "tavily" }, { timeRange: { days: 7 } }); assert.equal(r.chain[0], "tavily"); assert.equal(r.preferredSkippedReason, null);
// all disabled -> free fallback
assert.ok(b({ priorityMode: "list", disabledEngines: m.ALL_ENGINES }).chain.length > 0);
// url
assert.equal(u(""), "https://api.openai.com/v1/responses");
assert.equal(u("https://openrouter.ai/api/v1/"), "https://openrouter.ai/api/v1/responses");
assert.equal(u("https://x.com/v1/responses"), "https://x.com/v1/responses");
assert.throws(() => u("ftp://x"));
// parser
const text = "- DeepSeek released V4 in 2026 ([deepseek.com](https://deepseek.com/?utm_source=openai)).\n- It is fast ([a.com](https://a.com/x?utm_source=openai)).";
const s1 = text.indexOf("(["), e1 = text.indexOf(")).")+2; const s2 = text.lastIndexOf("(["), e2 = text.length-1;
const out = p({ output: [
  { type: "web_search_call", action: { type: "search", sources: [{ type: "url", url: "https://b.com/?utm_source=openai" }, { type:"url", url: "https://deepseek.com/" }] } },
  { type: "message", content: [{ type: "output_text", text, annotations: [
    { type: "url_citation", url: "https://a.com/x?utm_source=openai", title: "A", start_index: s2, end_index: e2 },
    { type: "url_citation", url: "https://deepseek.com/?utm_source=openai", title: "DeepSeek", start_index: s1, end_index: e1 },
  ] }] } ] }, 5);
console.log(JSON.stringify(out.sources, null, 1));
assert.deepEqual(out.sources.map(x=>x.url), ["https://deepseek.com/","https://a.com/x","https://b.com/"]);
assert.equal(out.sources[0].snippet, "DeepSeek released V4 in 2026");
assert.equal(out.sources[1].snippet, "It is fast");
assert.equal(out.content, text);
// config defaults
const raw = Config({}); const cfg = Object.fromEntries(Object.entries(raw).map(([k,v]) => [k, v && typeof v.get === "function" ? v.get() : v]));
assert.equal(cfg.openaiModel, "gpt-6-luna"); assert.equal(cfg.priorityMode, "preferred"); assert.deepEqual(cfg.disabledEngines, ["openai"]);
// auto routing
r = b({ provider: "auto" }, { query: "今天的新闻" });
assert.deepEqual(r.chain.slice(0, 4), ["bing","baidu","aliyun","anysearch"]); assert.equal(r.preferred, "auto");
r = b({ provider: "auto", disabledEngines: ["openai","exa"] }, { query: "news today" });
assert.deepEqual(r.chain.slice(0, 3), ["bing","tavily","anysearch"]);
r = b({ provider: "auto" }, { query: "新闻", timeRange: { days: 7 } });
assert.ok(r.chain.slice(0,10).every((e) => ["tavily","exa","keenable","firecrawl","parallel","searxng","ddg","ddg-lite","baidu","doubao"].includes(e)));
assert.equal(b({}, { engine: "auto", query: "x" }).preferred, "auto");
// legacy yaml
const leg = m.parseLegacyFreeSearchSection(["shell:", "  x: 1", "free-search:", "  provider: tavily  # c", "  cacheTtl: 3", "  platforms: [github, npm]", '  exaApiKey: "abc"', "other: 1"].join("\n"));
assert.deepEqual(leg, { provider: "tavily", cacheTtl: 3, platforms: ["github","npm"], exaApiKey: "abc" });
// keyed engine parsers via mocked fetch
const orig = globalThis.fetch;
const reply = (body) => async () => new Response(JSON.stringify(body), { headers: { "content-type": "application/json" } });
globalThis.fetch = reply({ results: { web: [{ url: "https://y.com", title: "Y", snippets: ["a", "b"] }] } });
assert.deepEqual((await m.KEYED_ENGINES.you.run("q", 5, "k")).sources, [{ url: "https://y.com", title: "Y", snippet: "a b" }]);
globalThis.fetch = reply({ references: [{ url: "https://b.com", title: "B", content: "c", date: "2026-09-01" }] });
assert.equal((await m.KEYED_ENGINES.baidu.run("q", 5, "k", { days: 7 })).sources[0].publishedAt, "2026-09-01");
globalThis.fetch = reply({ search_results: [{ url: "https://k.com", chunks: [{ text: "x" }, { text: "y" }] }] });
assert.equal((await m.KEYED_ENGINES.kimi.run("q", 5, "k")).sources[0].snippet, "x y");
globalThis.fetch = async () => new Response("data: " + JSON.stringify({ result: { content: [{ type: "text", text: JSON.stringify({ pages: [{ url: "https://a.com", title: "A" }] }) }] } }));
assert.equal((await m.KEYED_ENGINES.aliyun.run("q", 5, "k")).sources[0].url, "https://a.com");
globalThis.fetch = reply({ ResponseMetadata: { Error: { CodeN: 10406, Message: "quota" } } });
await assert.rejects(m.KEYED_ENGINES.doubao.run("q", 5, "k"), /free quota exhausted/);
globalThis.fetch = reply({ Result: { WebResults: [{ Url: "https://d.com", Title: "<em>D</em>", Summary: "s".repeat(1500) }] } });
const d = await m.KEYED_ENGINES.doubao.run("q", 5, "k", { days: 3 });
assert.equal(d.sources[0].title, "D"); assert.equal(d.sources[0].snippet.length, 1500);
globalThis.fetch = orig;
console.log("ok");
