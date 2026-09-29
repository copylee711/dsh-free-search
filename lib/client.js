window.__ModuleLoader__.load({
  id: "@copylee/dsh-free-search",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;

    let react = require("react");
    let react_jsx_runtime = require("react/jsx-runtime");

    //#region css
    const css = [
      ".dshfs-card{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:8px;min-width:0;list-style:none;transition:border-color .16s,background .16s;overflow:hidden;margin-bottom:8px}",
      ".dshfs-cardOpen{background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-label-dimmed)}",
      ".dshfs-header{width:100%;color:inherit;cursor:pointer;text-align:left;font:inherit;background:0 0;border:0;align-items:center;gap:8px;padding:10px 14px;display:flex}",
      ".dshfs-header:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}",
      // 插件页 page 模式：页面自带标题，卡片固定展开、表头不可折叠
      ".dshfs-pageMode>.dshfs-header{cursor:default}",
      ".dshfs-pageMode>.dshfs-header:hover{background:0 0}",
      ".dshfs-pageMode .dshfs-chevron{display:none}",
      ".dshfs-headText{flex-direction:column;flex:1;gap:2px;min-width:0;display:flex;overflow:hidden}",
      ".dshfs-name{color:var(--dsw-alias-label-primary);white-space:nowrap;text-overflow:ellipsis;font-weight:600;overflow:hidden}",
      ".dshfs-description{color:var(--dsw-alias-label-tertiary);white-space:nowrap;text-overflow:ellipsis;font-size:12px;overflow:hidden}",
      ".dshfs-pending{color:var(--dsw-alias-state-warn-primary);white-space:nowrap;flex:none;font-size:12px}",
      ".dshfs-chevron{color:var(--dsw-alias-label-tertiary);flex:none;font-size:13px;transition:transform .12s}",
      ".dshfs-chevronOpen{transform:rotate(180deg)}",
      ".dshfs-body{flex-direction:column;gap:14px;padding:0 14px 14px;display:flex}",
      ".dshfs-footer{justify-content:space-between;align-items:center;gap:8px;display:flex;flex-wrap:wrap}",
      ".dshfs-footerLeft{display:flex;align-items:center;gap:8px;flex-wrap:wrap;min-width:0}",
      ".dshfs-footerRight{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
      ".dshfs-failed{color:var(--dsw-alias-state-error-primary);font-size:12px}",
      ".dshfs-testOk{color:#7ddb9c;font-size:12px;line-height:1.5}",
      ".dshfs-resultRow{display:flex;flex-direction:column;align-items:flex-start;gap:4px;min-width:0;margin-top:2px}",
      ".dshfs-field{flex-direction:column;gap:4px;min-width:0;display:flex}",
      ".dshfs-label{color:var(--dsw-alias-label-primary);font-size:13px;font-weight:500}",
      ".dshfs-select{border:1px solid var(--dsw-alias-border-l2);font:inherit;font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-primary);background:var(--dsw-specific-input-major);border-radius:6px;padding:6px 8px;font-size:13px;transition:border-color .13s,box-shadow .13s;width:100%;box-sizing:border-box}",
      ".dshfs-select:hover:not(:disabled){border-color:var(--dsw-alias-label-dimmed)}",
      // 下拉选项列表配色锁死：不随皮肤变量变化（皮肤只影响 select 框体本身）
      // color-scheme 让浏览器原生下拉按主题渲染；option 显式固定底色/文字色兜底
      ".dshfs-select{color-scheme:light dark}",
      ".dshfs-select option,.dshfs-select optgroup{background-color:#ffffff;color:#1f2328}",
      "@media (prefers-color-scheme:dark){.dshfs-select{color-scheme:dark}.dshfs-select option,.dshfs-select optgroup{background-color:#1e1f24;color:#e8e8ea}}",
      ".dshfs-input{border:1px solid var(--dsw-alias-border-l2);font:inherit;font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-primary);background:var(--dsw-specific-input-major);border-radius:6px;padding:6px 8px;font-size:13px;transition:border-color .13s,box-shadow .13s;width:100%;box-sizing:border-box}",
      ".dshfs-ttl{width:88px}",
      ".dshfs-fieldRow{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
      ".dshfs-keyStorage{width:auto;min-width:180px}",
      ".dshfs-input:hover:not(:disabled){border-color:var(--dsw-alias-label-dimmed)}",
      ".dshfs-input:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:1px}",
      ".dshfs-input:disabled{opacity:.6;cursor:default}",
      ".dshfs-hint{color:var(--dsw-alias-label-secondary);margin:0;font-size:12px}",
      ".dshfs-platforms{display:flex;gap:10px;flex-wrap:wrap}",
      ".dshfs-platform{display:flex;align-items:center;gap:5px;color:var(--dsw-alias-label-primary);font-size:13px;cursor:pointer}",
      ".dshfs-platform input{accent-color:var(--dsw-alias-state-business-primary)}",
      ".dshfs-link{color:var(--dsw-alias-state-business-primary);font-size:12px;text-decoration:none;align-self:flex-start;padding:2px 0}",
      ".dshfs-link:hover{text-decoration:underline}",
      // 官方「网页搜索」页底部的接管提示
      ".dshfs-takeover{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:8px;padding:12px 14px;margin-top:16px;display:flex;align-items:center;gap:12px;flex-wrap:wrap}",
      ".dshfs-takeoverText{flex:1;min-width:220px;display:flex;flex-direction:column;gap:2px}",
      ".dshfs-takeoverTitle{color:var(--dsw-alias-label-primary);font-weight:600;font-size:13px}",
      ".dshfs-takeoverHint{color:var(--dsw-alias-label-tertiary);font-size:12px}",
      ".dshfs-webSearchSection{margin-top:24px;display:flex;flex-direction:column;gap:10px}",
      ".dshfs-sectionLead{padding:0 2px}",
      // 次要按钮（测试引擎 / 恢复 Bing 默认 / 撤销）：显式给边框、底色、文字色，
      // 不然会落回浏览器默认的立体按钮样式；保存按钮由 .dshfs-save 覆盖为主按钮。
      ".dshfs-btn{font:inherit;cursor:pointer;border-radius:6px;padding:5px 12px;font-size:13px;line-height:18px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2,transparent);color:var(--dsw-alias-label-primary);box-shadow:none;appearance:none;-webkit-appearance:none;transition:background-color .13s,border-color .13s,color .13s}",
      ".dshfs-btn:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);border-color:var(--dsw-alias-label-dimmed)}",
      ".dshfs-btn:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:1px}",
      ".dshfs-btn:disabled{opacity:.5;cursor:default}",
      ".dshfs-save{border:1px solid var(--dsw-alias-button-info-fill);background:var(--dsw-alias-button-info-fill);color:var(--dsw-alias-label-primary-foreground)}",
      ".dshfs-save:hover:not(:disabled){border-color:var(--dsw-alias-button-info-hover);background:var(--dsw-alias-button-info-hover)}",
      ".dshfs-save:disabled{opacity:.5;cursor:default}",
      ".dshfs-upgrade{border:1px solid rgba(80,200,120,.4);background:rgba(80,200,120,.15);color:#7ddb9c}",
      ".dshfs-upgrade:hover:not(:disabled){background:rgba(80,200,120,.28)}",
      ".dshfs-upgrade:disabled{opacity:.5;cursor:default}",
      ".dshfs-badge{background:var(--dsw-alias-interactive-bg-hover-accent);color:var(--dsw-alias-state-business-primary);white-space:nowrap;border-radius:999px;flex:none;padding:1px 6px;font-size:11px}",
      ".dshfs-badgeFree{background:rgba(80,200,120,.15);color:#7ddb9c;border:1px solid rgba(80,200,120,.3);white-space:nowrap;border-radius:999px;flex:none;padding:1px 6px;font-size:11px}",
      ".dshfs-badgeKey{background:rgba(240,170,80,.15);color:#f0b060;border:1px solid rgba(240,170,80,.3);white-space:nowrap;border-radius:999px;flex:none;padding:1px 6px;font-size:11px}",
      ".dshfs-langToggle{border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);background:transparent;flex:none;padding:2px 8px;font-size:11px;border-radius:6px}",
      ".dshfs-update{color:var(--dsw-alias-state-warn-primary);flex:none;font-size:11px;white-space:nowrap;border:1px solid rgba(240,170,80,.3);background:rgba(240,170,80,.12);border-radius:999px;padding:1px 6px}",
      ".dshfs-updateOk{color:#7ddb9c;flex:none;font-size:11px;white-space:nowrap;border:1px solid rgba(80,200,120,.3);background:rgba(80,200,120,.12);border-radius:999px;padding:1px 6px}",
      ".dshfs-updateLine{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
      ".dshfs-updatePill{display:inline-flex;align-items:center;gap:5px;border:1px solid rgba(76,110,245,.35);background:rgba(76,110,245,.10);color:var(--dsw-alias-state-business-primary);font:inherit;font-size:12px;font-weight:600;line-height:1;cursor:pointer;padding:4px 10px;border-radius:999px;text-decoration:none;white-space:nowrap;transition:background-color .13s,border-color .13s}",
      ".dshfs-updatePill:hover:not(:disabled){background:rgba(76,110,245,.20);border-color:rgba(76,110,245,.55)}",
      ".dshfs-updatePill:disabled{opacity:.6;cursor:default}",
      ".dshfs-updateIcon{flex:none;display:block}",
      ".dshfs-version{color:var(--dsw-alias-label-tertiary);font-size:11px;font-variant-numeric:tabular-nums;white-space:nowrap}",
    ].join("");
    const tagId = "dsh-free-search/card.css";
    if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
      const tag = document.createElement("style");
      tag.dataset.plugin = "@copylee/dsh-free-search";
      tag.dataset.pluginCss = tagId;
      tag.textContent = css;
      document.head.appendChild(tag);
    }
    //#endregion

    const BRIDGE_PREFIX = "/api/dsh-free-search-settings";
    // 插件页 slot key 用到的包名：必须与 package.json 的 name 一致（换包名发布时要一起改）。
    const PACKAGE_NAME = "@copylee/dsh-free-search";
    // rc.1: the settings namespace is the profile composition entry id (the
    // `web-search-free` row declared by cordis.patch.yml), not the old `free-search`
    // section name. Keep in sync with FREE_SEARCH_NS in lib/index.js.
    const NS = "web-search-free";
    // API key 字段：id → 显示名 / 环境变量名（与 lib/index.js 的 KEY_REF_MAP 对应）
    const KEY_IDS = ["anysearch", "exa", "tavily", "keenable", "firecrawl", "parallel", "perplexity", "serpbase", "deepseek"];
    const KEY_META = {
      anysearch: { label: "AnySearch", env: "ANYSEARCH_API_KEY" },
      exa: { label: "Exa", env: "EXA_API_KEY" },
      tavily: { label: "Tavily", env: "TAVILY_API_KEY" },
      keenable: { label: "Keenable", env: "KEENABLE_API_KEY" },
      firecrawl: { label: "Firecrawl", env: "FIRECRAWL_API_KEY" },
      parallel: { label: "Parallel", env: "PARALLEL_API_KEY" },
      perplexity: { label: "Perplexity", env: "PERPLEXITY_API_KEY" },
      serpbase: { label: "SerpBase", env: "SERPBASE_API_KEY" },
      deepseek: { label: "DeepSeek", env: "DEEPSEEK_API_KEY" },
    };
    // 凭据来源的显示名（DSH 本地凭据服务：env / file / user-env / project-env）
    function sourceLabel(lang, source) {
      const zh = { env: "环境变量", file: "凭据中心", "user-env": ".env 文件", "project-env": "项目 .env 文件" };
      const en = { env: "environment variable", file: "credential center", "user-env": ".env file", "project-env": "project .env file" };
      return (lang === "en" ? en : zh)[source] || source;
    }
    // 被环境变量 / .env 覆盖的 key：凭据中心写不进去，这里填了也不生效
    const isEnvSource = (info) => !!info && (info.source === "env" || info.source === "user-env" || info.source === "project-env");

    const I18N = {
      zh: {
        description: "免费搜索 —— 无需 API key（Bing / DuckDuckGo / AnySearch / Exa / Tavily / Keenable / Firecrawl / Parallel）",
        unsaved: "未保存",
        searchEngine: "搜索引擎",
        visit: "访问官网 →",
        getKey: "获取 API Key →",
        engineHint: "Bing 是最稳定的免费引擎。DuckDuckGo 在共享 IP 上可能限流。API KEY 引擎需在下方填写凭据。",
        apiKeys: "API 密钥（可选）",
        anysearchPh: (c) => c ? "AnySearch API 密钥（已配置）" : "AnySearch API 密钥（可选，不填免费匿名，填了提额）",
        exaPh: (c) => c ? "Exa API 密钥（已配置）" : "Exa API 密钥（可选，不填也可免费使用）",
        tavilyPh: (c) => c ? "Tavily API 密钥（已配置）" : "Tavily API 密钥（可选，不填也可免费使用）",
        keenablePh: (c) => c ? "Keenable API 密钥（已配置）" : "Keenable API 密钥（可选，不填也可免费使用）",
        firecrawlPh: (c) => c ? "Firecrawl API 密钥（已配置）" : "Firecrawl API 密钥（可选，不填也可免费使用）",
        parallelPh: (c) => c ? "Parallel API 密钥（已配置）" : "Parallel API 密钥（可选，不填走 MCP 免 key）",
        perplexityPh: (c) => c ? "Perplexity API 密钥（已配置）" : "Perplexity API 密钥（pplx-...）",
        deepseekPh: (c) => c ? "DeepSeek API 密钥（已配置）" : "DeepSeek API 密钥（sk-...）",
        serpbasePh: (c) => c ? "SerpBase API 密钥（已配置）" : "SerpBase API 密钥（serpbase.dev 获取）",
        keysHint: "密钥读取优先级：启动 dsh 时的环境变量 > 凭据中心（~/.dsh/.credentials.yaml）> 这里保存的配置。推荐把 key 写进凭据中心（与官方 LLM 一致，一处管理）；已由环境变量提供的 key 会显示为只读。",
        keyStorage: "Key 存储位置",
        keyStorageCred: "凭据中心（推荐）",
        keyStorageSettings: "设置页（兼容）",
        keyStorageCredHint: (c, src) => `保存后写入 ~/.dsh/.credentials.yaml。当前已配置：${KEY_IDS.filter((k) => c[k]).map((k) => k.toUpperCase() + (src && src[k] ? `（${sourceLabel("zh", src[k].source)}）` : "")).join("、") || "无"}`,
        keyFromEnv: (label, env) => `${label} API 密钥：已从环境变量 ${env} 读取（环境变量优先，这里填写不会生效）`,
        keyFromEnvFile: (label, env) => `${label} API 密钥：已从 .env 文件的 ${env} 读取（这里填写不会生效）`,
        keyFromCred: (label) => `${label} API 密钥（已保存在凭据中心，留空保持不变）`,
        keyStorageSettingsHint: "保存后写入当前 profile 的插件条目 config（cordis.patch.yml，优先级低于凭据中心）。",
        platformSearch: "平台搜索（platform_search 工具）",
        platformHint: "为 agent 的 platform_search 工具启用平台。禁用的平台会被跳过。",
        proxy: "搜索引擎代理",
        proxyOff: "不使用代理（直连）",
        proxySystem: "系统代理（自动检测）",
        proxyCustom: "自定义代理地址",
        proxyUrlPlaceholder: "http://127.0.0.1:7897",
        proxyEngines: "走代理的引擎",
        proxyHint: "只对勾选的引擎生效，其余引擎直连；无需再给 dsh 设置 HTTPS_PROXY 环境变量。仅支持 HTTP/HTTPS 代理（Clash / v2rayN 等填 HTTP 或混合端口）。",
        proxyDetecting: "正在检测系统代理…",
        proxyDetected: (url, source) => `检测到系统代理：${url}（${source}）`,
        proxyDetectError: (msg) => `系统代理不可用：${msg}`,
        proxyNotFound: "未检测到系统代理：请在系统设置里开启代理，或改用「自定义代理地址」。",
        cacheTtl: "结果缓存时长（分钟）",
        cacheTtlHint: "0 关闭缓存，最长 5 分钟。缩短可加快时效，延长可防限流、省额度。",
        unavailable: "设置不可用 —— free-search 桥接未暴露。",
        saveFailed: "保存失败",
        saveFailedDetail: (d) => `保存失败：${d}`,
        testing: "测试中…",
        testEngine: "测试引擎",
        useBing: "恢复 Bing 默认",
        discard: "撤销",
        saving: "保存中…",
        save: "保存",
        testOk: (r) => `✓ ${r.count} 条结果（引擎: ${r.engine}）${r.content ? ` — ${r.content}` : ""}${r.sample ? ` · 例如 "${r.sample.slice(0, 40)}"` : ""}`,
        testFail: (e) => `✗ ${e}`,
        toggleLang: "EN",
        checkUpdate: "检查更新",
        checkingUpdate: "检查中…",
        updateAvailable: (c, l) => `发现新版本 v${l}（当前 v${c}）`,
        updateLatest: (c) => `已是最新版本 v${c}`,
        updateCheckFailed: "检查更新失败（无法访问 npm registry）",
        updateView: "查看 →",
        hasUpdate: "有更新",
        upgrade: "升级",
        upgrading: "升级中…",
        upgradeLinkMode: "（本地开发模式，升级请用 git pull）",
        upgradeDone: (l) => `升级到 v${l} 完成，重启 dsh 后生效`,
        upgradeDoneReload: (l) => `已升级到 v${l}，刷新页面即可看到新版`,
        upgradeFailed: (m) => `升级失败：${m}`,
        safeSearchLabel: "安全搜索过滤 (adlt)",
        safeSearchOff: "关闭 —— 引擎默认（不加参数）",
        safeSearchModerate: "中等 —— Bing 默认",
        safeSearchStrict: "严格",
        safeSearchHint: "作用于 Bing（adlt）、DuckDuckGo HTML / Lite（adlt 等级）。如遇引擎自带过滤可在此调整。",
        bingMarketLabel: "Bing 市场（本地化结果）",
        bingMarketHint: "Bing 的 mkt + Accept-Language 跟随此设置。例如 ru-RU 会让西里尔查询返回俄语结果。",
        marketZhCN: "zh-CN —— 中国大陆（默认）",
        marketZhTW: "zh-TW —— 台湾",
        marketEnUS: "en-US —— 美国",
        marketEnGB: "en-GB —— 英国",
        marketRuRU: "ru-RU —— 俄罗斯",
        marketJaJP: "ja-JP —— 日本",
        marketDeDE: "de-DE —— 德国",
        marketFrFR: "fr-FR —— 法国",
        marketEsES: "es-ES —— 西班牙",
        marketKoKR: "ko-KR —— 韩国",
      },
      en: {
        description: "Free web search — no API key needed (Bing / DuckDuckGo / AnySearch / Exa / Tavily / Keenable / Firecrawl / Parallel)",
        unsaved: "unsaved",
        searchEngine: "Search engine",
        visit: "Visit website →",
        getKey: "Get API Key →",
        engineHint: "Bing is the most stable FREE engine. DuckDuckGo may rate-limit on shared IPs. API KEY engines need credentials below.",
        apiKeys: "API keys (optional)",
        anysearchPh: (c) => c ? "AnySearch API key (configured)" : "AnySearch API key (optional, free anonymous without; key raises quota)",
        exaPh: (c) => c ? "Exa API key (configured)" : "Exa API key (optional, free without)",
        tavilyPh: (c) => c ? "Tavily API key (configured)" : "Tavily API key (optional, free without)",
        keenablePh: (c) => c ? "Keenable API key (configured)" : "Keenable API key (optional, free without)",
        firecrawlPh: (c) => c ? "Firecrawl API key (configured)" : "Firecrawl API key (optional, free without)",
        parallelPh: (c) => c ? "Parallel API key (configured)" : "Parallel API key (optional, free without)",
        perplexityPh: (c) => c ? "Perplexity API key (configured)" : "Perplexity API key (pplx-...)",
        deepseekPh: (c) => c ? "DeepSeek API key (configured)" : "DeepSeek API key (sk-...)",
        serpbasePh: (c) => c ? "SerpBase API key (configured)" : "SerpBase API key (from serpbase.dev)",
        keysHint: "Key resolution: environment variables dsh was started with > credential center (~/.dsh/.credentials.yaml) > values saved here. Recommended: store keys in the credential center (same as official LLM providers, one place for all); keys supplied by an environment variable show as read-only.",
        keyStorage: "Key storage",
        keyStorageCred: "Credential center (recommended)",
        keyStorageSettings: "Settings page (legacy)",
        keyStorageCredHint: (c, src) => `Saved to ~/.dsh/.credentials.yaml. Currently configured: ${KEY_IDS.filter((k) => c[k]).map((k) => k.toUpperCase() + (src && src[k] ? ` (${sourceLabel("en", src[k].source)})` : "")).join(", ") || "none"}`,
        keyFromEnv: (label, env) => `${label} API key: read from environment variable ${env} (the environment wins; a value here has no effect)`,
        keyFromEnvFile: (label, env) => `${label} API key: read from ${env} in a .env file (a value here has no effect)`,
        keyFromCred: (label) => `${label} API key (saved in the credential center; leave blank to keep it)`,
        keyStorageSettingsHint: "Saved to the active profile plugin entry config (cordis.patch.yml; lower priority than the credential center).",
        platformSearch: "Platform search (platform_search tool)",
        platformHint: "Enable platforms for the agent's platform_search tool. Disabled platforms are skipped.",
        proxy: "Search engine proxy",
        proxyOff: "No proxy (direct)",
        proxySystem: "System proxy (auto-detect)",
        proxyCustom: "Custom proxy address",
        proxyUrlPlaceholder: "http://127.0.0.1:7897",
        proxyEngines: "Engines that use the proxy",
        proxyHint: "Applies only to the checked engines; the rest connect directly. No need to set HTTPS_PROXY for dsh anymore. HTTP/HTTPS proxies only (use the HTTP or mixed port of Clash / v2rayN etc.).",
        proxyDetecting: "Detecting system proxy…",
        proxyDetected: (url, source) => `System proxy detected: ${url} (${source})`,
        proxyDetectError: (msg) => `System proxy unusable: ${msg}`,
        proxyNotFound: "No system proxy detected: turn on the proxy in your OS settings, or use a custom proxy address.",
        cacheTtl: "Result cache TTL (minutes)",
        cacheTtlHint: "0 disables caching, max 5 minutes. Lower = fresher results, higher = less rate-limiting / fewer credits used.",
        unavailable: "Settings unavailable — the free-search bridge is not exposed.",
        saveFailed: "save failed",
        saveFailedDetail: (d) => `save failed: ${d}`,
        testing: "Testing…",
        testEngine: "Test engine",
        useBing: "Use Bing default",
        discard: "Discard",
        saving: "Saving…",
        save: "Save",
        testOk: (r) => `✓ ${r.count} results (engine: ${r.engine})${r.content ? ` — ${r.content}` : ""}${r.sample ? ` · e.g. "${r.sample.slice(0, 40)}"` : ""}`,
        testFail: (e) => `✗ ${e}`,
        toggleLang: "中文",
        checkUpdate: "Check update",
        checkingUpdate: "Checking…",
        updateAvailable: (c, l) => `New version v${l} available (current v${c})`,
        updateLatest: (c) => `You're on the latest version v${c}`,
        updateCheckFailed: "Update check failed (cannot reach npm registry)",
        updateView: "View →",
        hasUpdate: "Update available",
        upgrade: "Upgrade",
        upgrading: "Upgrading…",
        upgradeLinkMode: "(local dev install - use git pull to update)",
        upgradeDone: (l) => `Upgraded to v${l} - restart dsh to apply`,
        upgradeDoneReload: (l) => `Upgraded to v${l} - reload the page to see it`,
        upgradeFailed: (m) => `Upgrade failed: ${m}`,
        safeSearchLabel: "Safe search filter (adlt)",
        safeSearchOff: "Off - engine default (no filtering)",
        safeSearchModerate: "Moderate - Bing default",
        safeSearchStrict: "Strict",
        safeSearchHint: "Applies to bing (adlt), ddg, ddg-lite (adlt degree). If you see the engine's own filtering, adjust here.",
        bingMarketLabel: "Bing market (localized results)",
        bingMarketHint: "Bing's mkt + Accept-Language follow this. e.g. ru-RU returns Russian results for Cyrillic queries.",
        marketZhCN: "zh-CN - China (default)",
        marketZhTW: "zh-TW - Taiwan",
        marketEnUS: "en-US - United States",
        marketEnGB: "en-GB - United Kingdom",
        marketRuRU: "ru-RU - Russia",
        marketJaJP: "ja-JP - Japan",
        marketDeDE: "de-DE - Germany",
        marketFrFR: "fr-FR - France",
        marketEsES: "es-ES - Spain",
        marketKoKR: "ko-KR - Korea",
      },
    };
    const tt = (lang) => I18N[lang === "en" ? "en" : "zh"];
    // 当前插件版本（与 lib/index.js 的 PLUGIN_VERSION 保持一致）
    const PLUGIN_VERSION = "0.4.47";
    const ENGINES = [
      { id: "ddg", label: "DuckDuckGo · HTML", badge: "FREE", link: "https://duckduckgo.com" },
      { id: "ddg-lite", label: "DuckDuckGo · Lite", badge: "FREE", link: "https://duckduckgo.com" },
      { id: "bing", label: "Bing", badge: "FREE", link: "https://www.bing.com" },
      { id: "anysearch", label: "AnySearch · AI", badge: "FREE", link: "https://anysearch.com" },
      { id: "searxng", label: "SearXNG · 元搜索", badge: "FREE", link: "https://github.com/searxng/searxng" },
      { id: "exa", label: "Exa", badge: "FREE", link: "https://dashboard.exa.ai/api-keys" },
      { id: "tavily", label: "Tavily", badge: "FREE", link: "https://app.tavily.com/home" },
      { id: "keenable", label: "Keenable", badge: "FREE", link: "https://keenable.ai/login" },
      { id: "firecrawl", label: "Firecrawl", badge: "FREE", link: "https://www.firecrawl.dev" },
      { id: "parallel", label: "Parallel", badge: "FREE", link: "https://platform.parallel.ai" },
      { id: "perplexity", label: "Perplexity", badge: "API KEY", link: "https://www.perplexity.ai/settings/api" },
      { id: "serpbase", label: "SerpBase · Google", badge: "API KEY", link: "https://serpbase.dev" },
      { id: "deepseek-official", label: "DeepSeek Official", badge: "API KEY", link: "https://platform.deepseek.com/api_keys" },
    ];

    async function bridgeDescribe() {
      const response = await fetch(`${BRIDGE_PREFIX}/describe`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
      });
      return response.json();
    }

    async function bridgeMutate(payload) {
      const response = await fetch(`${BRIDGE_PREFIX}/mutate`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      return response.json();
    }

    async function bridgeRawSearch(payload) {
      const response = await fetch(`${BRIDGE_PREFIX}/raw-search`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      return response.json();
    }

    async function bridgeCheckUpdate() {
      const response = await fetch(`${BRIDGE_PREFIX}/check-update`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
      });
      return response.json();
    }

    async function bridgeProxyStatus() {
      const response = await fetch(`${BRIDGE_PREFIX}/proxy-status`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
      });
      return response.json();
    }

    async function bridgeCredentialsStatus() {
      const response = await fetch(`${BRIDGE_PREFIX}/credentials-status`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
      });
      return response.json();
    }

    async function bridgeCredentialsSet(key, value) {
      const response = await fetch(`${BRIDGE_PREFIX}/credentials-set`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      return response.json();
    }

    async function bridgeCredentialsUnset(key) {
      const response = await fetch(`${BRIDGE_PREFIX}/credentials-unset`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ key }),
      });
      return response.json();
    }

    // 缓存时长（分钟）归一到 0-5；空值/非数字回落到默认 5（Number(x) ?? 5 永远不会回落，NaN 会一路传下去）
    function clampCacheTtl(value) {
      const n = value === undefined || value === null || value === "" ? NaN : Number(value);
      return Number.isFinite(n) ? Math.min(Math.max(n, 0), 5) : 5;
    }

    function FreeSearchCard(props) {
      // 检测应用主题深浅（读 body 的 --dsw-alias-bg-base 变量亮度），用于锁定原生下拉配色
      const isDarkScheme = react.useMemo(() => {
        try {
          const root = document.body || document.documentElement;
          const bg = getComputedStyle(root).getPropertyValue("--dsw-alias-bg-base").trim();
          const m = bg.match(/(\d+)\s*[, ]\s*(\d+)\s*[, ]\s*(\d+)/);
          if (m) {
            const l = 0.299 * Number(m[1]) + 0.587 * Number(m[2]) + 0.114 * Number(m[3]);
            return l < 128;
          }
          if (/^#([0-9a-f]{3,8})/i.test(bg)) {
            const hex = bg.slice(1);
            const h = hex.length <= 4 ? hex.replace(/./g, (c) => c + c) : hex;
            const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
            return 0.299 * r + 0.587 * g + 0.114 * b < 128;
          }
        } catch {}
        return typeof matchMedia === "function" ? matchMedia("(prefers-color-scheme: dark)").matches : false;
      }, []);
      const selectColorScheme = isDarkScheme ? "dark" : "light";
      // 官方「网页搜索」页 / 插件详情页以 page 模式渲染本卡片：
      // 页面自带标题/面包屑，卡片固定展开、表头不再可折叠。
      const pageMode = !!(props && props.page);
      const [open, setOpen] = react.useState(pageMode);
      const [state, setState] = react.useState({ status: "loading" });
      const [provider, setProvider] = react.useState("bing");
      const [safeSearch, setSafeSearch] = react.useState("off");
      const [bingMarket, setBingMarket] = react.useState("zh-CN");
      const [anysearchKey, setAnysearchKey] = react.useState("");
      const [exaKey, setExaKey] = react.useState("");
      const [tavilyKey, setTavilyKey] = react.useState("");
      const [keenableKey, setKeenableKey] = react.useState("");
      const [firecrawlKey, setFirecrawlKey] = react.useState("");
      const [parallelKey, setParallelKey] = react.useState("");
      const [perplexityKey, setPerplexityKey] = react.useState("");
      const [deepseekKey, setDeepseekKey] = react.useState("");
      const [serpbaseKey, setSerpbaseKey] = react.useState("");
      const [platforms, setPlatforms] = react.useState(["github", "v2ex", "bilibili", "reddit", "hn", "stackoverflow", "wikipedia", "npm"]);
      const [cacheTtl, setCacheTtl] = react.useState(5);
      // 按引擎走代理：off | system | custom
      const [proxyMode, setProxyMode] = react.useState("off");
      const [proxyUrl, setProxyUrl] = react.useState("");
      const [proxyEngines, setProxyEngines] = react.useState(["ddg", "ddg-lite"]);
      // 系统代理检测结果：null=未检测 | { loading } | { system }
      const [systemProxy, setSystemProxy] = react.useState(null);
      const [keysConfigured, setKeysConfigured] = react.useState({});
      // key 存储位置：credentials（凭据中心，默认）| settings（设置页，兼容旧行为）
      const [keyStorage, setKeyStorage] = react.useState("credentials");
      // 凭据中心里已配置的 key（describe 不返回，需单独查）
      const [credConfigured, setCredConfigured] = react.useState({});
      // 凭据中心报告的每个 key 的来源（{ exa: { source: "env", writable: false } }）
      const [credSources, setCredSources] = react.useState({});
      // key 输入框的占位文字：按来源说明（环境变量 / .env / 凭据中心），否则用原来的提示
      const keyPlaceholder = (id, fallback) => {
        const info = credSources[id];
        const meta = KEY_META[id];
        if (!info || !meta) return fallback;
        if (info.source === "env") return t.keyFromEnv(meta.label, meta.env);
        if (info.source === "user-env" || info.source === "project-env") return t.keyFromEnvFile(meta.label, meta.env);
        if (info.source === "file") return t.keyFromCred(meta.label);
        return fallback;
      };
      const [lang, setLang] = react.useState("zh");
      const [dirty, setDirty] = react.useState(false);
      const [saving, setSaving] = react.useState(false);
      const [failed, setFailed] = react.useState(false);
      // 保存失败明细（credentials-set / mutate 的 code+message），成功或改表单时清空
      const [saveError, setSaveError] = react.useState("");
      const [testing, setTesting] = react.useState(false);
      const [testResult, setTestResult] = react.useState(null);
      const [checkingUpdate, setCheckingUpdate] = react.useState(false);
      const [upgrading, setUpgrading] = react.useState(false);
      const [updateInfo, setUpdateInfo] = react.useState(null);

      const load = react.useCallback(async () => {
        try {
          const result = await bridgeDescribe();
          if (result.ok) {
            const view = result.value.namespaces.find((n) => n.ns === NS);
            if (view) {
              const v = view.value ?? {};
              setProvider(v.provider ?? "bing");
              setSafeSearch(v.safeSearch === "strict" || v.safeSearch === "moderate" ? v.safeSearch : "off");
              setBingMarket(v.bingMarket === undefined ? "zh-CN" : v.bingMarket);
              setLang(v.lang === "en" ? "en" : "zh");
              setAnysearchKey(v.anysearchApiKey ?? "");
              setExaKey(v.exaApiKey ?? "");
              setTavilyKey(v.tavilyApiKey ?? "");
              setKeenableKey(v.keenableApiKey ?? "");
              setFirecrawlKey(v.firecrawlApiKey ?? "");
              setParallelKey(v.parallelApiKey ?? "");
              setPerplexityKey(v.perplexityApiKey ?? "");
              setDeepseekKey(v.deepseekApiKey ?? "");
              setSerpbaseKey(v.serpbaseApiKey ?? "");
              setPlatforms(Array.isArray(v.platforms) && v.platforms.length > 0 ? v.platforms : ["github", "v2ex", "bilibili", "reddit", "hn", "stackoverflow", "wikipedia", "npm"]);
              setCacheTtl(clampCacheTtl(v.cacheTtl));
              setProxyMode(v.proxyMode === "system" || v.proxyMode === "custom" ? v.proxyMode : "off");
              setProxyUrl(typeof v.proxyUrl === "string" ? v.proxyUrl : "");
              setProxyEngines(Array.isArray(v.proxyEngines) ? v.proxyEngines : ["ddg", "ddg-lite"]);
              // secrets 字段标记哪些 key 已配置（值被脱敏，仅显示"已配置"）
              const configured = {};
              for (const secret of view.secrets ?? []) {
                if (secret.set) {
                  const path = secret.path.join(".");
                  if (path === "anysearchApiKey") configured.anysearch = true;
                  if (path === "exaApiKey") configured.exa = true;
                  if (path === "tavilyApiKey") configured.tavily = true;
                  if (path === "keenableApiKey") configured.keenable = true;
                  if (path === "firecrawlApiKey") configured.firecrawl = true;
                  if (path === "parallelApiKey") configured.parallel = true;
                  if (path === "perplexityApiKey") configured.perplexity = true;
                  if (path === "deepseekApiKey") configured.deepseek = true;
                  if (path === "serpbaseApiKey") configured.serpbase = true;
                }
              }
              setKeysConfigured(configured);
              // key 存储位置（默认凭据中心）
              setKeyStorage(v.keyStorage === "settings" ? "settings" : "credentials");
              setState({ status: "ready", writable: result.value.writable });
              // 查询凭据中心里各 key 的配置状态
              try {
                const cred = await bridgeCredentialsStatus();
                if (cred.ok) {
                  const cc = {};
                  const map = { anysearchApiKey: "anysearch", exaApiKey: "exa", tavilyApiKey: "tavily", keenableApiKey: "keenable", firecrawlApiKey: "firecrawl", parallelApiKey: "parallel", perplexityApiKey: "perplexity", deepseekApiKey: "deepseek", serpbaseApiKey: "serpbase" };
                  const srcs = {};
                  for (const [k, v] of Object.entries(cred.value.configured ?? {})) {
                    if (map[k]) cc[map[k]] = v;
                  }
                  for (const [k, info] of Object.entries(cred.value.sources ?? {})) {
                    if (map[k]) srcs[map[k]] = info;
                  }
                  setCredConfigured(cc);
                  setCredSources(srcs);
                }
              } catch {}
            } else {
              setState({ status: "unavailable" });
            }
          } else {
            setState({ status: "unavailable" });
          }
        } catch {
          setState({ status: "unavailable" });
        }
      }, []);

      react.useEffect(() => {
        load();
      }, [load]);

      const select = (value) => {
        setProvider(value);
        setDirty(true);
        setFailed(false);
        setSaveError("");
      };

      const save = async () => {
        setSaving(true);
        setFailed(false);
        setSaveError("");
        const errors = [];
        try {
          // key 存储分流：凭据中心（默认）走 credentials-set；设置页走 settings mutate（兼容）
          const keyFields = [
            ["anysearchApiKey", anysearchKey],
            ["exaApiKey", exaKey],
            ["tavilyApiKey", tavilyKey],
            ["keenableApiKey", keenableKey],
            ["firecrawlApiKey", firecrawlKey],
            ["parallelApiKey", parallelKey],
            ["perplexityApiKey", perplexityKey],
            ["deepseekApiKey", deepseekKey],
            ["serpbaseApiKey", serpbaseKey],
          ];
          if (keyStorage === "credentials") {
            for (const [field, value] of keyFields) {
              if (!value.trim()) continue;
              const r = await bridgeCredentialsSet(field, value.trim());
              if (!r || !r.ok) {
                const code = (r && r.code) || "error";
                const msg = (r && r.message) || "";
                errors.push(`credentials-set ${field}: ${code}${msg ? " — " + msg : ""}`);
              }
            }
          }
          const ops = [{ op: "set", path: ["provider"], value: provider }];
          ops.push({ op: "set", path: ["lang"], value: lang });
          ops.push({ op: "set", path: ["keyStorage"], value: keyStorage });
          ops.push({ op: "set", path: ["safeSearch"], value: safeSearch });
          ops.push({ op: "set", path: ["bingMarket"], value: bingMarket });
          if (keyStorage !== "credentials") {
            // settings 模式：key 写入当前 profile 的插件条目 config（cordis.patch.yml）
            for (const [field, value] of keyFields) {
              if (value.trim()) ops.push({ op: "set", path: [field], value: value.trim() });
            }
          }
          ops.push({ op: "set", path: ["platforms"], value: platforms });
          ops.push({ op: "set", path: ["cacheTtl"], value: clampCacheTtl(cacheTtl) });
          ops.push({ op: "set", path: ["proxyMode"], value: proxyMode });
          ops.push({ op: "set", path: ["proxyUrl"], value: proxyUrl.trim() });
          ops.push({ op: "set", path: ["proxyEngines"], value: proxyEngines });
          const result = await bridgeMutate({ ns: NS, ops });
          if (!result || !result.ok) {
            const code = (result && result.code) || "error";
            const msg = (result && result.message) || "";
            errors.push(`mutate: ${code}${msg ? " — " + msg : ""}`);
          }
          if (errors.length === 0) {
            setDirty(false);
            setProvider(result.value.value.provider ?? provider);
            setFailed(false);
            setSaveError("");
            load();
          } else {
            const detail = errors.join("; ");
            setFailed(true);
            setSaveError(detail);
            console.error("[dsh-free-search] save failed:", detail);
          }
        } catch (e) {
          const msg = e && e.message ? e.message : String(e);
          setFailed(true);
          setSaveError(`exception: ${msg}`);
          console.error("[dsh-free-search] save exception:", e);
        } finally {
          setSaving(false);
        }
      };

      // 选「系统代理」时查询一次检测结果，显示在下拉框下方
      react.useEffect(() => {
        if (proxyMode !== "system") return;
        let cancelled = false;
        setSystemProxy({ loading: true });
        bridgeProxyStatus()
          .then((r) => {
            if (!cancelled) setSystemProxy({ system: r && r.ok ? r.value.system : null });
          })
          .catch(() => {
            if (!cancelled) setSystemProxy({ system: null });
          });
        return () => {
          cancelled = true;
        };
      }, [proxyMode]);

      const discard = () => {
        load();
        setDirty(false);
        setFailed(false);
        setSaveError("");
      };

      const runTest = async () => {
        setTesting(true);
        setTestResult(null);
        setFailed(false);
        setSaveError("");
        try {
          const result = await bridgeRawSearch({
            query: "DeepSeek Harness",
            maxResults: 2,
            engine: provider,
          });
          if (result.ok) {
            const sources = result.value.sources ?? [];
            setTestResult({
              ok: true,
              count: sources.length,
              engine: result.value.provider ?? provider,
              content: result.value.content ?? "",
              sample: sources[0]?.title ?? "",
            });
          } else {
            setTestResult({ ok: false, error: result.message ?? "unknown error" });
          }
        } catch {
          setTestResult({ ok: false, error: "request failed" });
        } finally {
          setTesting(false);
        }
      };

      const runCheckUpdate = async () => {
        setCheckingUpdate(true);
        setUpdateInfo(null);
        setFailed(false);
        setSaveError("");
        try {
          const result = await bridgeCheckUpdate();
          if (result.ok) {
            setUpdateInfo({ ok: true, ...result.value });
          } else {
            setUpdateInfo({ ok: false });
          }
        } catch {
          setUpdateInfo({ ok: false });
        } finally {
          setCheckingUpdate(false);
        }
      };

      const runUpdate = async () => {
        setUpgrading(true);
        setUpdateInfo(null);
        setFailed(false);
        setSaveError("");
        try {
          let result = null;
          try {
            const response = await fetch(`${BRIDGE_PREFIX}/update`, {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: "{}",
            });
            result = await response.json();
          } catch {
            // DSH 升级后会热重载本插件，旧版本的请求可能收不到响应：稍等后问新版本自己是哪个版本
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const check = await bridgeCheckUpdate().catch(() => null);
            if (check && check.ok && !check.value.hasUpdate && check.value.current !== PLUGIN_VERSION) {
              result = { ok: true, value: { latest: check.value.current, reloaded: true } };
            }
          }
          if (result && result.ok) {
            setUpdateInfo({ ok: true, hasUpdate: false, upgraded: true, reloaded: !!result.value.reloaded, message: result.value.message, latest: result.value.latest });
          } else {
            setUpdateInfo({ ok: false, upgradeFailed: (result && result.message) || "request failed" });
          }
        } catch {
          setUpdateInfo({ ok: false, upgradeFailed: "request failed" });
        } finally {
          setUpgrading(false);
        }
      };

      if (state.status === "loading") return null;
      const ready = state.status === "ready";
      const t = tt(lang);
      const title = "Free Search";
      const description = t.description;
      const currentEngine = ENGINES.find((e) => e.id === provider) ?? ENGINES[0];
      const badgeClass =
        currentEngine.badge === "FREE" ? "dshfs-badge dshfs-badgeFree" : "dshfs-badge dshfs-badgeKey";

      const toggleLang = () => {
        setLang((prev) => (prev === "en" ? "zh" : "en"));
        setDirty(true);
        setFailed(false);
        setSaveError("");
      };

      return react_jsx_runtime.jsx("li", {
        className: (open ? "dshfs-card dshfs-cardOpen" : "dshfs-card") + (pageMode ? " dshfs-pageMode" : ""),
        children: [
          react_jsx_runtime.jsx("button", {
            type: "button",
            className: "dshfs-header",
            "aria-expanded": pageMode ? void 0 : open,
            onClick: pageMode ? void 0 : () => setOpen(!open),
            children: [
                      react_jsx_runtime.jsx("span", { className: "dshfs-headText", children: [
                  react_jsx_runtime.jsx("span", { className: "dshfs-name", children: title }),
                  react_jsx_runtime.jsx("span", { className: "dshfs-description", children: description }),
                ] }),
                react_jsx_runtime.jsx("span", { className: badgeClass, children: currentEngine.badge }),
              dirty ? react_jsx_runtime.jsx("span", { className: "dshfs-pending", children: t.unsaved }) : null,
              react_jsx_runtime.jsx("button", {
                type: "button",
                className: "dshfs-btn dshfs-langToggle",
                onClick: (e) => {
                  e.stopPropagation();
                  toggleLang();
                },
                children: t.toggleLang,
              }),
              react_jsx_runtime.jsx("span", {
                className: open ? "dshfs-chevron dshfs-chevronOpen" : "dshfs-chevron",
                children: "▾",
              }),
            ],
          }),
          open
            ? react_jsx_runtime.jsx("div", {
                className: "dshfs-body",
                children: [
                  react_jsx_runtime.jsx("div", {
                    className: "dshfs-field",
                    children: [
react_jsx_runtime.jsx("div", {
                        className: "dshfs-label",
                        children: [
                          t.searchEngine,
                          react_jsx_runtime.jsx("span", { className: badgeClass, children: currentEngine.badge }),
                        ],
                      }),
                      react_jsx_runtime.jsx("select", {
                        className: "dshfs-select",
                        value: provider,
                        style: { colorScheme: selectColorScheme },
                        disabled: !ready || saving,
                        onChange: (e) => select(e.target.value),
                        children: ENGINES.map((engine) =>
                          react_jsx_runtime.jsx("option", { value: engine.id, children: `${engine.label} (${engine.badge})` }, engine.id)
                        ),
                      }),
                      currentEngine.link
                        ? react_jsx_runtime.jsx("a", {
                            className: "dshfs-link",
                            href: currentEngine.link,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            children:
                              currentEngine.badge === "FREE"
                                ? t.visit
                                : t.getKey,
                          })
                        : null,
                      react_jsx_runtime.jsx("p", {
                        className: "dshfs-hint",
                        children: t.engineHint,
                      }),
                    ],
                  }),
                  react_jsx_runtime.jsx("div", {
                    className: "dshfs-field",
                    children: [
                      react_jsx_runtime.jsx("div", {
                        className: "dshfs-label",
                        children: t.safeSearchLabel,
                      }),
                      react_jsx_runtime.jsx("select", {
                        className: "dshfs-select",
                        value: safeSearch,
                        style: { colorScheme: selectColorScheme },
                        disabled: !ready || saving,
                        onChange: (e) => setSafeSearch(e.target.value),
                        children: [
                          react_jsx_runtime.jsx("option", { value: "off", children: t.safeSearchOff }, "off"),
                          react_jsx_runtime.jsx("option", { value: "moderate", children: t.safeSearchModerate }, "moderate"),
                          react_jsx_runtime.jsx("option", { value: "strict", children: t.safeSearchStrict }, "strict"),
                        ],
                      }),
                      react_jsx_runtime.jsx("p", {
                        className: "dshfs-hint",
                        children: t.safeSearchHint,
                      }),
                    ],
                  }),
                  react_jsx_runtime.jsx("div", {
                    className: "dshfs-field",
                    children: [
                      react_jsx_runtime.jsx("div", {
                        className: "dshfs-label",
                        children: t.bingMarketLabel,
                      }),
                      react_jsx_runtime.jsx("select", {
                        className: "dshfs-select",
                        value: bingMarket,
                        style: { colorScheme: selectColorScheme },
                        disabled: !ready || saving,
                        onChange: (e) => setBingMarket(e.target.value),
                        children: [
                          react_jsx_runtime.jsx("option", { value: "zh-CN", children: t.marketZhCN }, "zh-CN"),
                          react_jsx_runtime.jsx("option", { value: "zh-TW", children: t.marketZhTW }, "zh-TW"),
                          react_jsx_runtime.jsx("option", { value: "en-US", children: t.marketEnUS }, "en-US"),
                          react_jsx_runtime.jsx("option", { value: "en-GB", children: t.marketEnGB }, "en-GB"),
                          react_jsx_runtime.jsx("option", { value: "ru-RU", children: t.marketRuRU }, "ru-RU"),
                          react_jsx_runtime.jsx("option", { value: "ja-JP", children: t.marketJaJP }, "ja-JP"),
                          react_jsx_runtime.jsx("option", { value: "de-DE", children: t.marketDeDE }, "de-DE"),
                          react_jsx_runtime.jsx("option", { value: "fr-FR", children: t.marketFrFR }, "fr-FR"),
                          react_jsx_runtime.jsx("option", { value: "es-ES", children: t.marketEsES }, "es-ES"),
                          react_jsx_runtime.jsx("option", { value: "ko-KR", children: t.marketKoKR }, "ko-KR"),
                        ],
                      }),
                      react_jsx_runtime.jsx("p", {
                        className: "dshfs-hint",
                        children: t.bingMarketHint,
                      }),
                    ],
                  }),
                  react_jsx_runtime.jsx("div", {
                    className: "dshfs-field",
                    children: [
                      react_jsx_runtime.jsx("div", {
                        className: "dshfs-label",
                        children: t.apiKeys,
                      }),
                      react_jsx_runtime.jsx("input", {
                        className: "dshfs-input",
                        type: "password",
                        placeholder: keyPlaceholder("anysearch", t.anysearchPh(keysConfigured.anysearch || credConfigured.anysearch)),
                        title: isEnvSource(credSources.anysearch) ? keyPlaceholder("anysearch", "") : undefined,
                        value: isEnvSource(credSources.anysearch) ? "" : anysearchKey,
                        disabled: !ready || saving || isEnvSource(credSources.anysearch),
                        onChange: (e) => {
                          setAnysearchKey(e.target.value);
                          setDirty(true);
                          setFailed(false);
                          setSaveError("");
                        },
                      }),
                      react_jsx_runtime.jsx("input", {
                        className: "dshfs-input",
                        type: "password",
                        placeholder: keyPlaceholder("exa", t.exaPh(keysConfigured.exa || credConfigured.exa)),
                        title: isEnvSource(credSources.exa) ? keyPlaceholder("exa", "") : undefined,
                        value: isEnvSource(credSources.exa) ? "" : exaKey,
                        disabled: !ready || saving || isEnvSource(credSources.exa),
                        onChange: (e) => {
                          setExaKey(e.target.value);
                          setDirty(true);
                          setFailed(false);
                          setSaveError("");
                        },
                      }),
                      react_jsx_runtime.jsx("input", {
                        className: "dshfs-input",
                        type: "password",
                        placeholder: keyPlaceholder("tavily", t.tavilyPh(keysConfigured.tavily || credConfigured.tavily)),
                        title: isEnvSource(credSources.tavily) ? keyPlaceholder("tavily", "") : undefined,
                        value: isEnvSource(credSources.tavily) ? "" : tavilyKey,
                        disabled: !ready || saving || isEnvSource(credSources.tavily),
                        onChange: (e) => {
                          setTavilyKey(e.target.value);
                          setDirty(true);
                          setFailed(false);
                          setSaveError("");
                        },
                      }),
                      react_jsx_runtime.jsx("input", {
                        className: "dshfs-input",
                        type: "password",
                        placeholder: keyPlaceholder("keenable", t.keenablePh(keysConfigured.keenable || credConfigured.keenable)),
                        title: isEnvSource(credSources.keenable) ? keyPlaceholder("keenable", "") : undefined,
                        value: isEnvSource(credSources.keenable) ? "" : keenableKey,
                        disabled: !ready || saving || isEnvSource(credSources.keenable),
                        onChange: (e) => {
                          setKeenableKey(e.target.value);
                          setDirty(true);
                          setFailed(false);
                          setSaveError("");
                        },
                      }),
                      react_jsx_runtime.jsx("input", {
                        className: "dshfs-input",
                        type: "password",
                        placeholder: keyPlaceholder("firecrawl", t.firecrawlPh(keysConfigured.firecrawl || credConfigured.firecrawl)),
                        title: isEnvSource(credSources.firecrawl) ? keyPlaceholder("firecrawl", "") : undefined,
                        value: isEnvSource(credSources.firecrawl) ? "" : firecrawlKey,
                        disabled: !ready || saving || isEnvSource(credSources.firecrawl),
                        onChange: (e) => {
                          setFirecrawlKey(e.target.value);
                          setDirty(true);
                          setFailed(false);
                          setSaveError("");
                        },
                      }),
                      react_jsx_runtime.jsx("input", {
                        className: "dshfs-input",
                        type: "password",
                        placeholder: keyPlaceholder("parallel", t.parallelPh(keysConfigured.parallel || credConfigured.parallel)),
                        title: isEnvSource(credSources.parallel) ? keyPlaceholder("parallel", "") : undefined,
                        value: isEnvSource(credSources.parallel) ? "" : parallelKey,
                        disabled: !ready || saving || isEnvSource(credSources.parallel),
                        onChange: (e) => {
                          setParallelKey(e.target.value);
                          setDirty(true);
                          setFailed(false);
                          setSaveError("");
                        },
                      }),
                      react_jsx_runtime.jsx("input", {
                        className: "dshfs-input",
                        type: "password",
                        placeholder: keyPlaceholder("perplexity", t.perplexityPh(keysConfigured.perplexity || credConfigured.perplexity)),
                        title: isEnvSource(credSources.perplexity) ? keyPlaceholder("perplexity", "") : undefined,
                        value: isEnvSource(credSources.perplexity) ? "" : perplexityKey,
                        disabled: !ready || saving || isEnvSource(credSources.perplexity),
                        onChange: (e) => {
                          setPerplexityKey(e.target.value);
                          setDirty(true);
                          setFailed(false);
                          setSaveError("");
                        },
                      }),
                      react_jsx_runtime.jsx("input", {
                        className: "dshfs-input",
                        type: "password",
                        placeholder: keyPlaceholder("serpbase", t.serpbasePh(keysConfigured.serpbase || credConfigured.serpbase)),
                        title: isEnvSource(credSources.serpbase) ? keyPlaceholder("serpbase", "") : undefined,
                        value: isEnvSource(credSources.serpbase) ? "" : serpbaseKey,
                        disabled: !ready || saving || isEnvSource(credSources.serpbase),
                        onChange: (e) => {
                          setSerpbaseKey(e.target.value);
                          setDirty(true);
                          setFailed(false);
                          setSaveError("");
                        },
                      }),
                      react_jsx_runtime.jsx("input", {
                        className: "dshfs-input",
                        type: "password",
                        placeholder: keyPlaceholder("deepseek", t.deepseekPh(keysConfigured.deepseek || credConfigured.deepseek)),
                        title: isEnvSource(credSources.deepseek) ? keyPlaceholder("deepseek", "") : undefined,
                        value: isEnvSource(credSources.deepseek) ? "" : deepseekKey,
                        disabled: !ready || saving || isEnvSource(credSources.deepseek),
                        onChange: (e) => {
                          setDeepseekKey(e.target.value);
                          setDirty(true);
                          setFailed(false);
                          setSaveError("");
                        },
                      }),
                      react_jsx_runtime.jsx("p", {
                        className: "dshfs-hint",
                        children: t.keysHint,
                      }),
                      react_jsx_runtime.jsx("div", {
                        className: "dshfs-fieldRow",
                        children: [
                          react_jsx_runtime.jsx("label", {
                            className: "dshfs-label",
                            children: t.keyStorage,
                          }),
                          react_jsx_runtime.jsx("select", {
                            className: "dshfs-select dshfs-keyStorage",
                            value: keyStorage,
                            style: { colorScheme: selectColorScheme },
                            disabled: !ready || saving,
                            onChange: (e) => {
                              setKeyStorage(e.target.value);
                              setDirty(true);
                              setFailed(false);
                              setSaveError("");
                            },
                            children: [
                              react_jsx_runtime.jsx("option", { value: "credentials", children: t.keyStorageCred }),
                              react_jsx_runtime.jsx("option", { value: "settings", children: t.keyStorageSettings }),
                            ],
                          }),
                        ],
                      }),
                      react_jsx_runtime.jsx("p", {
                        className: "dshfs-hint",
                        children: keyStorage === "credentials" ? t.keyStorageCredHint(credConfigured, credSources) : t.keyStorageSettingsHint,
                      }),
                    ],
                  }),
                  react_jsx_runtime.jsx("div", {
                    className: "dshfs-field",
                    children: [
                      react_jsx_runtime.jsx("div", {
                        className: "dshfs-label",
                        children: t.platformSearch,
                      }),
                      react_jsx_runtime.jsx("div", {
                        className: "dshfs-platforms",
                        children: [
                          ["github", "GitHub"], ["v2ex", "V2EX"], ["bilibili", "Bilibili"], ["reddit", "Reddit"],
                          ["hn", "Hacker News"], ["stackoverflow", "Stack Overflow"], ["wikipedia", "Wikipedia"], ["npm", "npm"],
                        ].map(([id, label]) =>
                          react_jsx_runtime.jsx("label", {
                            className: "dshfs-platform",
                            children: [
                              react_jsx_runtime.jsx("input", {
                                type: "checkbox",
                                checked: platforms.includes(id),
                                disabled: !ready || saving,
                                onChange: (e) => {
                                  setPlatforms((prev) =>
                                    e.target.checked ? [...prev, id] : prev.filter((p) => p !== id)
                                  );
                                  setDirty(true);
                                  setFailed(false);
                                  setSaveError("");
                                },
                              }),
                              label,
                            ],
                          }, id)
                        ),
                      }),
                      react_jsx_runtime.jsx("p", {
                        className: "dshfs-hint",
                        children: t.platformHint,
                      }),
                    ],
                  }),
                  react_jsx_runtime.jsx("div", {
                    className: "dshfs-field",
                    children: [
                      react_jsx_runtime.jsx("div", {
                        className: "dshfs-label",
                        children: t.proxy,
                      }),
                      react_jsx_runtime.jsx("select", {
                        className: "dshfs-select",
                        value: proxyMode,
                        style: { colorScheme: selectColorScheme },
                        disabled: !ready || saving,
                        onChange: (e) => {
                          setProxyMode(e.target.value);
                          setDirty(true);
                          setFailed(false);
                          setSaveError("");
                        },
                        children: [
                          react_jsx_runtime.jsx("option", { value: "off", children: t.proxyOff }),
                          react_jsx_runtime.jsx("option", { value: "system", children: t.proxySystem }),
                          react_jsx_runtime.jsx("option", { value: "custom", children: t.proxyCustom }),
                        ],
                      }),
                      proxyMode === "custom"
                        ? react_jsx_runtime.jsx("input", {
                            className: "dshfs-input",
                            type: "text",
                            spellCheck: false,
                            placeholder: t.proxyUrlPlaceholder,
                            value: proxyUrl,
                            disabled: !ready || saving,
                            onChange: (e) => {
                              setProxyUrl(e.target.value);
                              setDirty(true);
                              setFailed(false);
                              setSaveError("");
                            },
                          })
                        : null,
                      proxyMode === "system" && systemProxy
                        ? react_jsx_runtime.jsx("p", {
                            className: "dshfs-hint",
                            children: systemProxy.loading
                              ? t.proxyDetecting
                              : systemProxy.system && systemProxy.system.error
                                ? t.proxyDetectError(systemProxy.system.error)
                                : systemProxy.system
                                  ? t.proxyDetected(systemProxy.system.url, systemProxy.system.source)
                                  : t.proxyNotFound,
                          })
                        : null,
                      proxyMode !== "off"
                        ? react_jsx_runtime.jsxs(react_jsx_runtime.Fragment, {
                            children: [
                              react_jsx_runtime.jsx("div", {
                                className: "dshfs-label",
                                children: t.proxyEngines,
                              }),
                              react_jsx_runtime.jsx("div", {
                                className: "dshfs-platforms",
                                children: ENGINES.map((engine) =>
                                  react_jsx_runtime.jsxs("label", {
                                    className: "dshfs-platform",
                                    children: [
                                      react_jsx_runtime.jsx("input", {
                                        type: "checkbox",
                                        checked: proxyEngines.includes(engine.id),
                                        disabled: !ready || saving,
                                        onChange: (e) => {
                                          const checked = e.target.checked;
                                          setProxyEngines((prev) =>
                                            checked ? [...prev.filter((id) => id !== engine.id), engine.id] : prev.filter((id) => id !== engine.id)
                                          );
                                          setDirty(true);
                                          setFailed(false);
                                          setSaveError("");
                                        },
                                      }),
                                      engine.label,
                                    ],
                                  }, engine.id)
                                ),
                              }),
                            ],
                          })
                        : null,
                      react_jsx_runtime.jsx("p", {
                        className: "dshfs-hint",
                        children: t.proxyHint,
                      }),
                    ],
                  }),
                  react_jsx_runtime.jsx("div", {
                    className: "dshfs-field",
                    children: [
                      react_jsx_runtime.jsx("div", {
                        className: "dshfs-label",
                        children: t.cacheTtl,
                      }),
                      react_jsx_runtime.jsx("input", {
                        className: "dshfs-input dshfs-ttl",
                        type: "number",
                        min: 0,
                        max: 5,
                        step: 1,
                        value: cacheTtl,
                        disabled: !ready || saving,
                        onChange: (e) => {
                          setCacheTtl(Number(e.target.value));
                          setDirty(true);
                          setFailed(false);
                          setSaveError("");
                        },
                      }),
                      react_jsx_runtime.jsx("p", {
                        className: "dshfs-hint",
                        children: t.cacheTtlHint,
                      }),
                    ],
                  }),
                  react_jsx_runtime.jsx("div", {
                    className: "dshfs-resultRow",
                    children: [
                      failed
                        ? react_jsx_runtime.jsx("span", {
                            className: "dshfs-failed",
                            children: saveError ? t.saveFailedDetail(saveError) : t.saveFailed,
                          })
                        : null,
                      testResult
                        ? react_jsx_runtime.jsx("span", {
                            className: testResult.ok ? "dshfs-testOk" : "dshfs-failed",
                            children: testResult.ok
                              ? t.testOk(testResult)
                              : t.testFail(testResult.error),
                          })
                        : null,
                    ],
                  }),
                  !ready
                    ? react_jsx_runtime.jsx("p", {
                        className: "dshfs-hint",
                        children: t.unavailable,
                      })
                    : null,
                  react_jsx_runtime.jsx("div", {
                    className: "dshfs-footer",
                    children: [
                      react_jsx_runtime.jsx("div", {
                        className: "dshfs-footerLeft",
                        children: [
                          react_jsx_runtime.jsx("span", { className: "dshfs-version", children: "v" + PLUGIN_VERSION }),
                          updateInfo && updateInfo.ok && updateInfo.hasUpdate && !updateInfo.installable
                            ? react_jsx_runtime.jsx("a", {
                                className: "dshfs-updatePill",
                                href: updateInfo.updateUrl,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                title: t.updateAvailable(updateInfo.current, updateInfo.latest),
                                children: [
                                  react_jsx_runtime.jsx("svg", {
                                    className: "dshfs-updateIcon",
                                    viewBox: "0 0 16 16",
                                    width: 14,
                                    height: 14,
                                    "aria-hidden": "true",
                                    children: react_jsx_runtime.jsx("path", {
                                      d: "M8 2.2v6.4M5.2 6.4 8 9.2l2.8-2.8M3 10.8v1.4c0 .9.7 1.6 1.6 1.6h6.8c.9 0 1.6-.7 1.6-1.6v-1.4",
                                      fill: "none",
                                      stroke: "currentColor",
                                      strokeWidth: 1.6,
                                      strokeLinecap: "round",
                                      strokeLinejoin: "round",
                                    }),
                                  }),
                                  t.hasUpdate,
                                ],
                              })
                            : react_jsx_runtime.jsx("button", {
                                className: "dshfs-updatePill",
                                type: "button",
                                title: updateInfo && updateInfo.ok && updateInfo.hasUpdate ? t.updateAvailable(updateInfo.current, updateInfo.latest) : undefined,
                                onClick: updateInfo && updateInfo.ok && updateInfo.hasUpdate ? runUpdate : runCheckUpdate,
                                disabled: upgrading || checkingUpdate || saving || !ready,
                                children: [
                                  react_jsx_runtime.jsx("svg", {
                                    className: "dshfs-updateIcon",
                                    viewBox: "0 0 16 16",
                                    width: 14,
                                    height: 14,
                                    "aria-hidden": "true",
                                    children: react_jsx_runtime.jsx("path", {
                                      d: "M8 2.2v6.4M5.2 6.4 8 9.2l2.8-2.8M3 10.8v1.4c0 .9.7 1.6 1.6 1.6h6.8c.9 0 1.6-.7 1.6-1.6v-1.4",
                                      fill: "none",
                                      stroke: "currentColor",
                                      strokeWidth: 1.6,
                                      strokeLinecap: "round",
                                      strokeLinejoin: "round",
                                    }),
                                  }),
                                  upgrading
                                    ? t.upgrading
                                    : checkingUpdate
                                      ? t.checkingUpdate
                                      : updateInfo && updateInfo.ok && updateInfo.hasUpdate
                                        ? t.hasUpdate
                                        : t.checkUpdate,
                                ],
                              }),
                          updateInfo && updateInfo.ok
                            ? updateInfo.upgraded
                              ? react_jsx_runtime.jsx("span", {
                                  className: "dshfs-updateOk",
                                  children: updateInfo.reloaded ? t.upgradeDoneReload(updateInfo.latest) : t.upgradeDone(updateInfo.latest),
                                })
                              : updateInfo.hasUpdate
                                ? updateInfo.installable
                                  ? null
                                  : react_jsx_runtime.jsx("span", {
                                      className: "dshfs-version",
                                      children: t.upgradeLinkMode,
                                    })
                                : react_jsx_runtime.jsx("span", {
                                    className: "dshfs-updateOk",
                                    children: t.updateLatest(updateInfo.current),
                                  })
                            : updateInfo && !updateInfo.ok
                              ? react_jsx_runtime.jsx("span", {
                                  className: "dshfs-failed",
                                  children: updateInfo.upgradeFailed ? t.upgradeFailed(updateInfo.upgradeFailed) : t.updateCheckFailed,
                                })
                              : null,
                        ],
                      }),
                      react_jsx_runtime.jsx("div", {
                        className: "dshfs-footerRight",
                        children: [
                      react_jsx_runtime.jsx("button", {
                        className: "dshfs-btn",
                        type: "button",
                        onClick: runTest,
                        disabled: testing || saving || !ready,
                        children: testing ? t.testing : t.testEngine,
                      }),
                      react_jsx_runtime.jsx("button", {
                        className: "dshfs-btn",
                        type: "button",
                        onClick: () => {
                          setProvider("bing");
                          setDirty(true);
                          setFailed(false);
                          setSaveError("");
                        },
                        disabled: saving || !ready || provider === "bing",
                        children: t.useBing,
                      }),
                      react_jsx_runtime.jsx("button", {
                        className: "dshfs-btn",
                        type: "button",
                        onClick: discard,
                        disabled: saving || !dirty,
                        children: t.discard,
                      }),
                      react_jsx_runtime.jsx("button", {
                        className: "dshfs-btn dshfs-save",
                        type: "button",
                        onClick: save,
                        disabled: saving || !dirty || !ready,
                        children: saving ? t.saving : t.save,
                      }),
                    ],
                  }),
                  ],
                })
              ],
            })
          : null,
        ],
      });
    }

    // 官方「网页搜索」页（plugins.item id=web-search）下方的配置区：本插件接管了网页搜索，
    // 引擎 / API Key / 代理直接在这里配置；上面官方的 DeepSeek 表单原样保留。
    function WebSearchPageSection() {
      const en = summaryIsEnglish();
      return react_jsx_runtime.jsxs("div", {
        className: "dshfs-webSearchSection",
        children: [
          react_jsx_runtime.jsxs("div", {
            className: "dshfs-takeoverText dshfs-sectionLead",
            children: [
              react_jsx_runtime.jsx("span", {
                className: "dshfs-takeoverTitle",
                children: en ? "Web search is provided by the Free Search plugin" : "网页搜索由「免费搜索」插件提供",
              }),
              react_jsx_runtime.jsx("span", {
                className: "dshfs-takeoverHint",
                children: en
                  ? "Engines, API keys and the proxy are set below. The form above is the official DeepSeek search provider's own settings."
                  : "搜索引擎、API Key、代理都在下面配置；上面是 DeepSeek 官方搜索提供方自己的设置，保持不变。",
              }),
            ],
          }),
          react_jsx_runtime.jsx(FreeSearchCard, { page: true }),
        ],
      });
    }

    // 插件详情页：配置已移到官方「网页搜索」页时只放一行指引，避免同一张卡片出现两次
    function BundlePointer() {
      const en = summaryIsEnglish();
      return react_jsx_runtime.jsx("div", {
        className: "dshfs-takeover",
        children: react_jsx_runtime.jsxs("div", {
          className: "dshfs-takeoverText",
          children: [
            react_jsx_runtime.jsx("span", {
              className: "dshfs-takeoverTitle",
              children: en ? "Settings live on the Web search page" : "配置在「网页搜索」页面",
            }),
            react_jsx_runtime.jsx("span", {
              className: "dshfs-takeoverHint",
              children: en
                ? "Open Plugins → Official → Web search: engines, API keys and the proxy are configured below the DeepSeek form there."
                : "打开 插件 → 官方 → 网页搜索：搜索引擎、API Key、代理都在那个页面 DeepSeek 设置的下方配置。",
            }),
          ],
        }),
      });
    }

    function summaryIsEnglish() {
      const primary = typeof navigator === "undefined" ? "zh" : String((navigator.languages && navigator.languages[0]) || navigator.language || "zh").toLowerCase();
      return primary.startsWith("en");
    }

    // 顶层只依赖 slots：commandUi 走嵌套 inject，命令插件缺席也不影响配置页挂载
    // （旧版把 commandUi 放在顶层 inject，命令插件缺席时整个 apply 不运行，配置页一起消失）。
    const inject = ["slots"];

    function apply(ctx) {
      // 配置卡片挂在官方「网页搜索」页（plugins.item id=web-search）的下方：本插件接管了网页搜索，
      // 用户找搜索设置自然会去那里；官方的 DeepSeek 表单原样保留在上面。
      // 官方页只在 DeepSeek 搜索提供方运行时才存在，所以插件详情页（plugins.bundle.config）按情况渲染：
      // 官方页在 → 一行指引；官方页不在 → 完整卡片，保证配置始终有入口。
      // 配置读写走自建 bridge（/api/dsh-free-search-settings），不依赖 dsh-web-ui。
      const hasOfficialWebSearchPage = () => {
        try {
          return ctx.slots.entries("plugins.item").some((entry) => entry.options && entry.options.id === "web-search");
        } catch {
          return false;
        }
      };
      ctx.slots.inject("plugins.bundle.config", () =>
        ctx.slots.register(
          {
            name: "plugins.bundle.config",
            key: PACKAGE_NAME,
          },
          () =>
            hasOfficialWebSearchPage()
              ? react_jsx_runtime.jsx(BundlePointer, {})
              : react_jsx_runtime.jsx(FreeSearchCard, { page: true })
        )
      );
      ctx.slots.inject("plugins.detail.section", () =>
        ctx.slots.register(
          {
            name: "plugins.detail.section",
            id: "free-search-config",
            order: 10,
          },
          (slotProps) => {
            const subject = slotProps && slotProps.subject;
            if (!subject || subject.kind !== "item" || subject.id !== "web-search") return null;
            return react_jsx_runtime.jsx(WebSearchPageSection, {});
          }
        )
      );
      // /free-search-engine 弹出式命令：输入 "/" 选中后弹出引擎列表，点选即切换。
      // 等效于设置页切换引擎+保存；命令只改 provider 配置，搜索仍走回退链。
      // description 必须传函数：ui-commands 读回的是 contribution.description()，
      // 传字符串会抛 TypeError: contribution.description is not a function；该异常
      // 会让整份 "/" 候选列表一起失败，菜单空白、其他命令也一起点不到。
      ctx.inject(["commandUi"], (sctx) => {
        const command = sctx.get("commandUi");
        sctx.effect(() => {
          const dispose = command.register({
            name: "free-search-engine",
            description: () => "切换搜索引擎 / Switch web search engine",
            available: () => true,
            ui: {
              kind: "popupSelect",
              options: async () => {
                const result = await bridgeDescribe();
                const view = result.ok ? result.value.namespaces.find((n) => n.ns === NS) : undefined;
                const current = view?.value?.provider ?? "bing";
                return ENGINES.map((e) => ({
                  id: e.id,
                  label: `${e.label}${e.badge === "FREE" ? " · 免费" : " · API Key"}`,
                  detail: e.id === current ? (view?.value?.lang === "en" ? "current" : "当前") : undefined,
                  active: e.id === current,
                }));
              },
              onSelect: async (option) => {
                await bridgeMutate({ ns: NS, ops: [{ op: "set", path: ["provider"], value: option.id }] });
              },
            },
          });
          return dispose;
        }, "free-search: /free-search-engine command");
      });
    }

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  },
});
