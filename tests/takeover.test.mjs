// DSH 0.2.1-rc.2+: provider selection is a config ref written through settings.mutate.
import assert from "node:assert/strict";
import * as m from "../lib/index.js";

const ref = (value) => ({ get: () => value });
const run = (searchProvider, fetchProvider) => {
  const mutations = [];
  const settings = {
    configure() { return () => {}; }, describe() { return []; },
    async mutate(ns, ops) { mutations.push({ ns, ops }); }, writable: true,
  };
  const sctx = {
    effect(fn) { fn(); }, on() {}, get: () => undefined, settings,
    tools: { register() { return () => {}; } },
    webServer: { register() { return () => {}; } },
    systemPrompt: { section() { return () => {}; } },
  };
  let provider;
  const web = {
    config: { searchProvider: ref(searchProvider), fetchProvider: ref(fetchProvider) },
    registerSearchProvider(p) { provider = p; return () => {}; },
  };
  const ctx = { logger: { info() {}, warn() {}, error() {} }, inject: (d, cb) => cb(sctx), get: () => undefined, web, fiber: {} };
  m.apply(ctx, { provider: "bing", legacyYamlMigrated: true });
  return { mutations, provider };
};
process.env.DSH_HOME = "/nonexistent";
const flag = Symbol.for("copylee.dsh-free-search.searchTakeover");

// The official Search API switch (fetch -> deepseek-fetch-api) is an explicit choice: left alone.
delete globalThis[flag];
assert.deepEqual(run("deepseek-search-api", "deepseek-fetch-api").mutations, []);

// Factory default on 0.2.2: taken over once through settings.mutate.
delete globalThis[flag];
const first = run("deepseek-search-api", "http");
assert.deepEqual(first.mutations, [{ ns: "web", ops: [{ op: "set", path: ["searchProvider"], value: "ddg" }] }]);
assert.equal(first.provider.title, "免费搜索 · Free Search");
assert.equal(typeof first.provider.description.en, "string");

// A web rebuild re-applies the plugin; a later pick of the official provider is respected.
assert.deepEqual(run("deepseek-search-api", "http").mutations, []);

// Another explicit provider is never touched.
delete globalThis[flag];
assert.deepEqual(run("exa", "http").mutations, []);
console.log("takeover ok");
