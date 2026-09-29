# dsh-free-search

[![npm](https://img.shields.io/npm/v/@copylee/dsh-free-search)](https://www.npmjs.com/package/@copylee/dsh-free-search)

中文 · [English](README.en.md)

**DeepSeek Harness 免费搜索插件 —— 无需 API key，零成本，多引擎可切换。** 一个给 DeepSeek Harness (dsh) 添加多引擎搜索 provider 的插件，注册进 `ctx.web` seam。内置 `web_search` 工具自动选用，支持网页设置页切换引擎、配置 API key、一键测试所有引擎、弹出式命令切换引擎。


<div align="center">
  <a href="https://raw.githubusercontent.com/copylee711/dsh-free-search/master/assets/settings-overview.png">
    <img src="https://raw.githubusercontent.com/copylee711/dsh-free-search/master/assets/settings-overview.png" alt="设置页：搜索引擎与优先级" width="820" />
  </a>
  <br>
  <sub>▲ 设置页（与 DSH 设置页同一套样式，跟随深浅色主题）</sub>
</div>

## 为什么需要它

dsh 默认的搜索 provider 依赖 DeepSeek 官方 API key（`DEEPSEEK_API_KEY`）。如果你：
- 没有（或不想用）DeepSeek 官方 key，
- 用的是 opencode-go 这类网关（其 OpenAI 兼容端点不支持 `web_search` 工具），

……那么内置搜索必然失败，agent 会告诉你"无法联网"。

这个插件提供多个免费引擎 + 自动回退，彻底摆脱 DeepSeek 官方 key 的依赖。

## 特性

- **零成本** —— 多个免费引擎，无需 key、无需注册
- **多引擎可选**：DuckDuckGo（html/lite）、Bing、SearXNG（元搜索，支持自定义实例）、AnySearch、Exa、Tavily、Keenable、Firecrawl、Parallel、Perplexity、SerpBase、DeepSeek 官方、You.com、百度千帆、Kimi、阿里云百炼、豆包搜索，以及 **OpenAI 模型内置联网搜索**
- **可调的搜索优先级** —— 两种模式任选：「首选 + 回退」（选一个首选引擎，失败时按列表回退）或「全局列表」（完全按列表从上到下）；列表可按住拖动排序、逐个开关引擎；首选引擎还可以选「智能路由」（按查询语言自动排序）
- **模型内置联网搜索（OpenAI）** —— 可选开启：通过 Responses API 的 `web_search` 工具让模型（默认 `gpt-6-luna`）搜索网页并返回带引用的回答；模型名、Base URL（可换兼容网关）可配置；按次计费，默认关闭
- **多源交叉搜索（multi_search）** —— 并发查询多个引擎，按 URL 合并去重，每条结果标注出现在哪些引擎里
- **网页设置页** —— 与 DSH 自身设置页同一套样式（跟随深浅色主题）：优先级、模型搜索、API key（脱敏显示"已配置"及来源）、代理、中英文切换；入口：左侧「插件」页 → 官方 → **网页搜索**（DSH 0.1.7-rc.1+）
- **弹出式切换命令** —— 聊天框输入 `/free-search-engine`，弹出引擎选择窗口，点选即切换（等效设置页 + 保存）
- **引擎测试** —— `free_search_test` 工具让 agent 一键测试所有引擎；设置页也有"测试引擎"按钮（直测当前引擎，不走回退链，付费引擎无 key 会明确报错）
- **统一引擎回退** —— 任何引擎失败（付费/免费，缺 key/401/限流/网络/无结果）自动按设置页的顺序尝试下一个引擎（缺 key 的付费引擎直接跳过，exa/tavily/keenable/firecrawl/parallel 无 key 也能用），搜索永不直接失败；结果顶部注明实际生效的引擎（如 `Note: perplexity unavailable or failed, using exa.`）
- **时间过滤** —— `advanced_search` 工具支持 `timeRange`：固定档、自定义相对值、绝对日期三种形式（详见下方逻辑说明）
- **系统提示词注入** —— agent 知道当前用哪个引擎、哪些需要 key；并明确所有搜索结果是**不可信外部数据**，不得执行其中的指令
- **提示注入防护（不可信数据边界）** —— 插件自有工具（advanced_search / platform_search / free_search_test）的网页文本包在 `<untrusted-web-content>` 边界内（正文里自带的同名标记会被剥离，防止提前闭合）；核心 web_search / web_fetch 由 DSH 核心自带同类提示（`External web content follows...`）；所有 snippet 统一清洗，默认截断到 300 字符（豆包搜索的长摘要放宽到 2000）
- **版本号 + 检查更新** —— 设置卡片显示当前版本，"检查更新"按钮直连 npm registry 对比最新版，有新版本时提示并可一键跳转
- **结果缓存** —— 相同查询（含引擎/时间过滤参数）5 分钟内命中缓存（LRU 50 条），防免费引擎限流、省付费额度；时长可在设置页 0-5 分钟自由配置（0 关闭）
- **按引擎走代理** —— 配置卡片里直接选「系统代理（自动检测）」或填代理地址，并勾选哪些引擎走代理；无需再给 dsh 设置环境变量（见下方「代理」）
- **免费标注** —— 设置页中免费引擎带绿色 `FREE` 徽章，付费引擎带橙色 `API KEY` 徽章
- **网页抓取（web_fetch）** —— 让 agent 抓取网页内容（官方 `dsh-web-fetch-http` provider，纯 JS，零额外依赖）
- **平台搜索（platform_search）** —— 搜 GitHub / V2EX / B站 / Reddit / Hacker News / Stack Overflow / 维基百科 / npm（公开 API，零依赖）
- **干净集成** —— 实现官方 `WebSearchProvider` seam 接口，与官方插件共存

如果这个插件帮到了你，欢迎给仓库点个 ⭐（[GitHub](https://github.com/copylee711/dsh-free-search)）——星标是开发者继续维护的最大动力，感谢支持！

## 引擎列表

| id | 引擎 | 费用 | 说明 |
|---|---|---|---|
| `ddg` | DuckDuckGo HTML | 免费 | 偶发限流（反爬），解封自动恢复 |
| `ddg-lite` | DuckDuckGo Lite | 免费 | 轻量版，同上 |
| `bing` | Bing | 免费 | **默认引擎**，最稳定，中文优化（zh-CN） |
| `anysearch` | AnySearch AI | 免费 | AI 搜索，无 key（匿名额度） |
| `searxng` | SearXNG 元搜索 | 免费 | 多实例自动切换，支持自定义实例 |
| `exa` | Exa | 免费 | **无 key 也可用**（MCP 匿名），配 key 提升额度 |
| `tavily` | Tavily | 免费 | **无 key 也可用**（keyless 匿名），配 key 提升额度 |
| `keenable` | Keenable | 免费 | **无 key 也可用**（MCP 匿名），配 key 提升额度 |
| `firecrawl` | Firecrawl | 免费 | **无 key 也可用**（官方免 key 匿名额度），配 key 提升限额 |
| `parallel` | Parallel | 免费 | **无 key 也可用**（官方 MCP 匿名额度），配 key 提升额度并支持精确时间过滤 |
| `perplexity` | Perplexity | 付费 | 需 `PERPLEXITY_API_KEY` |
| `serpbase` | SerpBase | 付费 | 需 `SERPBASE_API_KEY`（serpbase.dev，注册送 100 次免费额度） |
| `deepseek-official` | DeepSeek 官方 | 付费 | 需 `DEEPSEEK_API_KEY` |
| `you` | You.com | 付费 | 需 `YOUCOM_API_KEY` |
| `baidu` | 百度千帆 AI 搜索 | 付费 | 需 `BAIDU_API_KEY`，支持时间过滤 |
| `kimi` | Kimi（Moonshot）联网搜索 | 付费 | 需 `MOONSHOT_API_KEY` |
| `aliyun` | 阿里云百炼 EnhancedSearch | 付费 | 需 `DASHSCOPE_API_KEY` |
| `doubao` | 豆包搜索（火山引擎联网搜索） | 付费 | 需 `DOUBAO_SEARCH_API_KEY`（每月 500 次免费额度），支持时间过滤，返回长摘要 |
| `openai` | OpenAI 模型内置联网搜索 | 付费 | 需 `OPENAI_API_KEY`，**默认关闭**，在设置页「模型内置联网搜索」开启；约 $10 / 千次搜索（另计 token），返回带引用的回答，不支持时间过滤 |

首选引擎还可以设为 `auto`（智能路由）：中日韩文查询先试 Bing / 百度 / 阿里云 / AnySearch，其他语言先试 Bing / Exa / Tavily，之后按回退顺序继续。

- **默认引擎为 `bing`**（免费且最稳定），安装后开箱即用。
- **自动回退**：任何引擎失败（免费限流/反爬，付费缺 key/无效/网络错误）都会自动按设置页的顺序尝试下一个引擎，并在结果中附带回退提示——搜索不会因引擎问题直接失败。默认顺序：免费引擎在前（Bing → Exa → AnySearch → Tavily → Keenable → Firecrawl → Parallel → DuckDuckGo → SearXNG），需要 key 的引擎在后（没配 key 的自动跳过），可在设置页拖动调整。
- **设置页有官网链接**：免费引擎显示"访问官网 →"，付费引擎显示"获取 API Key →"（新标签页打开）：
  - Exa：<https://dashboard.exa.ai/api-keys>
  - Tavily：<https://app.tavily.com/home>
  - Keenable：<https://keenable.ai/login>
  - Parallel：<https://platform.parallel.ai>
  - Perplexity：<https://www.perplexity.ai/settings/api>
  - SerpBase：<https://serpbase.dev>
  - DeepSeek：<https://platform.deepseek.com/api_keys>
  - You.com：<https://you.com/platform/api-keys>
  - 百度千帆：<https://console.bce.baidu.com/qianfan>
  - Kimi：<https://platform.moonshot.cn>
  - 阿里云百炼：<https://bailian.console.aliyun.com>
  - 豆包搜索：<https://console.volcengine.com/search-infinity/web-search>
  - OpenAI：<https://platform.openai.com/api-keys>

### 为什么免费引擎不需要 key？

- **AnySearch**：其 `v1/search` REST 接口提供匿名的公共搜索额度，无需注册或 API key。额度有限流（适合日常搜索），但作为免费引擎之一，与其他免费引擎互相回退，体验稳定。
- **Exa**：公开 MCP 端点（`mcp.exa.ai/mcp`）支持匿名调用，不配 key 也能用；配置 `EXA_API_KEY` 后可获得更高额度。
- **Tavily**：通过 `x-tavily-access-mode: keyless` 头走 keyless 匿名额度，不配 key 即可用；配置 `TAVILY_API_KEY` 后走账号档，额度更高、结果质量更稳定。
- **Keenable**：无 key 时走其公开 MCP 端点（`api.keenable.ai/mcp`）匿名调用；配置 `KEENABLE_API_KEY` 后走 REST API（`api.keenable.ai/v1/search`），额度更高、按组织限流。
- **Firecrawl**：其 `/v2/search` 端点**无需 key** 即可使用（官方文档明确说明，有匿名限流）；配置 `FIRECRAWL_API_KEY` 后可提高限额。支持 `tbs` 时间过滤（`qdr:h/d/w/m/y` 与自定义日期区间）。

## 安装

```sh
dsh plugin --profile web add @copylee/dsh-free-search
```

或从源码安装：

```sh
git clone https://github.com/copylee711/dsh-free-search.git
dsh plugin --profile web add /path/to/dsh-free-search
```

> 本包 fork 自 [DDDMUC/dsh-free-search](https://github.com/DDDMUC/dsh-free-search)（npm `dsh-free-search`）。两者声明了同一个条目 id `web-search-free`，**不要同时安装**；从原版迁移时先卸载 `dsh-free-search` 再安装本包。上游 v0.6.0 的新引擎（You.com / 百度 / Kimi / 阿里云 / 豆包）、智能路由、`multi_search`、默认搜索接管与旧配置迁移已合并进本包；原版的 `provider: auto` 等配置可以直接沿用。

然后重启：

```sh
dsh web
```

### 依赖说明

插件对 `@deepseek-ai/dsh-settings` 和 `@deepseek-ai/dsh-tools` 使用 `peerDependencies`，这是刻意的：DSH 运行时必须使用安装树中的唯一实例。请通过 `dsh plugin --profile <profile> add ...` 安装插件，不要把 DSH 核心包复制进 profile 的本地 `node_modules`；重复副本会导致工具调度器失效。

## 使用

### 网页设置（推荐）

安装后打开配置页（DSH 0.1.7-rc.1+）：

- 左侧 **插件** 页 → **官方** 分组 → **网页搜索**：上面是 DeepSeek 官方搜索提供方自己的设置（原样保留），下面就是本插件的配置卡片
- 如果关掉了官方的 DeepSeek 搜索提供方（「网页搜索」页随之消失），配置卡片会改为显示在 **已安装** → `@copylee/dsh-free-search` 详情页

配置页提供：

- **搜索引擎**：
  - **优先级模式**：「首选 + 回退」——选一个首选引擎（或「智能路由」），失败时按下面的列表回退；「全局列表」——不设首选，完全按列表从上到下尝试
  - **回退顺序 / 搜索顺序**：按住一行拖动（或用 ↑ ↓）调整顺序，右侧开关启用/跳过某个引擎，没配 key 的引擎会标出「未配置 key」；「恢复默认」一键还原
- **模型内置联网搜索**：开关 OpenAI 内置搜索（默认关闭），设置模型（默认 `gpt-6-luna`）、Base URL（可换成兼容 Responses API 的网关）和 `OPENAI_API_KEY`；开启后它出现在上面的顺序里，可以放到任意位置
- **搜索结果**：安全搜索过滤、Bing 市场、结果缓存时长
- **API 密钥**：为各引擎填写 key（密码框，保存后只显示"已配置"，并标出 key 来自环境变量 / 凭据中心；Exa / Tavily / Keenable / Firecrawl / Parallel 不填也可免 key 使用）
  - **推荐**：付费引擎 key 建议写入 harness 凭据中心 `~/.dsh/.credentials.yaml`（如 `DEEPSEEK_API_KEY: sk-...`，与官方 LLM provider 一致，一处管理所有 key）。插件读取优先级：启动 dsh 时的环境变量 > 凭据中心 > 设置页，设置页填的 key 仅作为遗留兼容。已由环境变量提供的 key 在配置卡片里显示为只读（例如「已从环境变量 EXA_API_KEY 读取」），要改就去改环境变量。
- **测试引擎**：直测当前第一个尝试的引擎（不走回退链，付费引擎无 key 会明确报错）；「撤销」只撤销尚未保存的编辑
- **平台搜索**：勾选启用 GitHub / V2EX / Bilibili / Reddit / HN / Stack Overflow / 维基百科 / npm 平台搜索（`platform_search` 工具按此过滤）
- **网络代理**：见下方「代理」
- **EN / 中文**：切换界面语言（默认中文）

<table align="center" style="border: none; border-collapse: collapse;">
  <tr style="border: none;">
    <td align="center" width="50%" style="border: none; padding: 6px;">
      <a href="https://raw.githubusercontent.com/copylee711/dsh-free-search/master/assets/settings-model-search.png">
        <img src="https://raw.githubusercontent.com/copylee711/dsh-free-search/master/assets/settings-model-search.png" alt="全局列表 + 模型内置联网搜索" width="100%" />
      </a>
      <br>
      <sub>▲ <b>全局列表模式</b> + 开启 OpenAI 模型内置联网搜索</sub>
    </td>
    <td align="center" width="50%" style="border: none; padding: 6px;">
      <a href="https://raw.githubusercontent.com/copylee711/dsh-free-search/master/assets/settings-dark.png">
        <img src="https://raw.githubusercontent.com/copylee711/dsh-free-search/master/assets/settings-dark.png" alt="深色主题下的 API 密钥与代理设置" width="100%" />
      </a>
      <br>
      <sub>▲ <b>深色主题</b>：API 密钥（标注来源）与网络代理</sub>
    </td>
  </tr>
</table>

### 聊天框切换引擎（/free-search-engine）

不用进设置页也能切换引擎：在聊天框输入 `/free-search-engine`，**弹出引擎选择窗口**（和 `/model` 选模型一样的交互），点选即切换，当前引擎会标记出来。「首选 + 回退」模式下设为首选引擎（也可选「智能路由」），「全局列表」模式下把它移到列表最前；两种模式都会顺带启用该引擎。

命令只改优先级配置，搜索仍走 `web_search` + 统一回退链：即使首选引擎挂了也会自动换其他引擎，永不直接失败。系统提示词同步刷新。

### 配置文件

DSH 0.1.7-rc.1 起，配置跟随 profile 的插件条目保存：设置页与 `/free-search-engine` 都会写入当前 profile 的 `cordis.patch.yml` 中 `web-search-free`（`@copylee/dsh-free-search`）条目的 `config`。

旧版 `~/.dsh/settings.yaml` 的 `free-search:` 段**不会被 DSH 核心自动导入**（核心只为 `ui-developer-tools` / `ui-onboarding` / `shell` 三个段做了映射），原文件会被改名为 `settings.yaml.imported`，该段的值只留在那里。插件启动时会检测 `settings.yaml.imported`（或仍存在的 `settings.yaml`）里的 `free-search:` 段，把能识别的字段**一次性补种**进当前 profile 的条目 `config`（只写一次，启动日志里能看到 `free-search: migrated N field(s)…`）。

```yaml
# profiles/<profile>/cordis.patch.yml 中该条目的 config：
provider: bing              # 首选引擎：任一引擎 id，或 auto（智能路由）
priorityMode: preferred     # preferred（首选 + 回退）/ list（全局列表）
engineOrder:                # 回退顺序 / 全局列表（缺失的引擎会自动补在末尾）
  - exa
  - tavily
  - bing
disabledEngines:            # 跳过的引擎（默认 [openai]）
  - openai
openaiModel: gpt-6-luna     # OpenAI 模型内置搜索用的模型
openaiBaseUrl: https://api.openai.com/v1   # 可换成兼容 Responses API 的网关
lang: zh                    # 设置页界面语言（zh / en）
bingMarket: zh-CN           # Bing 市场
region: cn-zh               # DuckDuckGo 区域（可选）
searxngInstances:           # 自定义 SearXNG 实例（可选）
  - https://your-instance.example
exaApiKey: ...              # 或通过设置页填写
tavilyApiKey: ...           # 或通过设置页填写
keenableApiKey: ...         # 或通过设置页填写
firecrawlApiKey: ...        # 或通过设置页填写
parallelApiKey: ...         # 或通过设置页填写
perplexityApiKey: ...
serpbaseApiKey: ...         # 或通过设置页填写
deepseekApiKey: ...
# youcomApiKey / baiduApiKey / kimiApiKey / aliyunApiKey / doubaoApiKey / openaiApiKey 同理（推荐放凭据中心）
proxyMode: system          # 代理：off（直连）/ system（自动检测系统代理）/ custom（用 proxyUrl）
proxyUrl: http://127.0.0.1:7897   # proxyMode 为 custom 时使用
proxyEngines:               # 走代理的引擎
  - ddg
  - ddg-lite
```

### 让 agent 测试所有引擎

对 agent 说"测试一下所有搜索引擎"，它会调用 `free_search_test` 工具，逐个测试并报告：

```
Search engine test:
- ddg: FAIL - DuckDuckGo is rate-limited right now (anti-bot challenge, usually temporary) - Bing works
- bing: OK (2 results, e.g. "DeepSeek Harness developer preview...")
- exa: FAIL - EXA_API_KEY not configured
```

### 时间过滤（advanced_search）

让 agent 搜"最近一周的新闻"、"这个月的发布"、"最近 3 天的消息"、"7 月以来的更新"，它会调用 `advanced_search` 工具，带 `timeRange` 参数。该工具同样走统一回退链，且可显式指定 `engine`，返回结构同 `web_search`。

**timeRange 支持三种形式：**

| 形式 | 示例 | 含义 |
|---|---|---|
| 固定档 | `day` / `week` / `month` / `year` | 分别 = 1 / 7 / 30 / 365 天 |
| 自定义相对值 | `12h`、`3d`、`2mo`、`1y` | 最近 12 小时 / 3 天 / 2 个月 / 1 年 |
| 绝对日期 | `2026-07-01` | 该日期（含）之后发布的结果 |

**各引擎对 timeRange 的处理逻辑：**

| 引擎 | 参数 | 是否精确 | 说明 |
|---|---|---|---|
| Exa | `startPublishedDate` | ✅ 精确 | 自定义天数转成 ISO 日期（N 天前），绝对日期原样传入 |
| Keenable | `published_after` | ✅ 精确 | 相对值原样传（`12h/3d/2mo/1y`），绝对日期原样传 |
| Tavily | `time_range` | ⚠️ 近似 | 只认固定档，自定义天数自动映射到最近似档位 |
| Firecrawl | `tbs` | ⚠️ 近似 | 固定档映射到 `qdr:d/w/m/y`；绝对日期用 `cdr:1,cd_min:M/D/YYYY`（精确） |
| Parallel | `source_policy.after_date`（有 key 时精确）；无 key 走 MCP，无日期参数，改为把窗口写进 objective 作为新鲜度提示（软过滤） | ✅ 精确 / ⚠️ 软过滤 | 自定义天数转成 ISO 日期（N 天前），绝对日期原样传入 |
| SearXNG | `time_range` | ⚠️ 近似 | 同上 |
| DuckDuckGo / Lite | `df` | ⚠️ 近似 | 同上 |
| 百度千帆 | `search_filter.range.page_time` | ✅ 精确 | 换算成起止日期 |
| 豆包搜索 | `TimeRange` | ⚠️ 近似 / ✅ 精确 | 相对值映射到 OneDay/OneWeek/OneMonth/OneYear，绝对日期用 `起始..今天` 区间 |
| Bing / AnySearch / OpenAI 等 | — | ❌ 忽略 | 无对应参数 |

**"最近似档位"映射规则**：`≤2 天 → day`，`≤14 天 → week`，`≤90 天 → month`，否则 `year`。例如 `3d` 在 Tavily 上按 `day` 处理，`2mo` 按 `month` 处理。

**引擎链优先级**：当带 timeRange 搜索时，支持时间过滤的引擎（tavily / exa / keenable / firecrawl / parallel / searxng / ddg / ddg-lite / baidu / doubao）会排到引擎链前面，确保过滤真正生效——即使首选引擎是 bing（不支持过滤），也会先尝试支持过滤的引擎。

示例对话：*"帮我搜最近 3 天关于 DSH 的新闻"* → agent 调用 `advanced_search`，`timeRange: "3d"`。

### 抓取网页内容（web_fetch）

搜索到 URL 后，可以让 agent **读取网页全文**（如"打开第一个链接看看内容"）。`web_fetch` 工具已启用（官方 `dsh-web-fetch-http` provider）：

- 自动跟随重定向、解码正文（HTML 转文本）
- 支持超时和大小限制
- ⚠️ 注意：`web_fetch` 无 SSRF 防护，agent 理论上可访问内网地址——按需使用

### 平台搜索（platform_search）

让 agent 搜特定平台，如"在 GitHub 上搜 deepseek harness"、"看看 B站有什么相关视频"、"V2EX 上关于 dsh 的讨论"。`platform_search` 工具支持：

| 平台 | 用途 |
|---|---|
| `github` | GitHub 仓库搜索（API，免费无 key） |
| `v2ex` | V2EX 主题全文搜索（经 SOV2EX；不可用时退回热门主题匹配） |
| `bilibili` | B站视频搜索（自动带设备 cookie 和 WBI 签名，避免 -352 风控）；关键词为「热门 / 热榜 / 排行榜」时返回 B站综合热门 |
| `reddit` | Reddit 帖子/讨论搜索（依次尝试公开 JSON 和 RSS；Reddit 常拦截机房 / 代理 IP，全部被拦时会明确报错） |
| `hn` | Hacker News 技术社区讨论（Algolia 官方 API） |
| `stackoverflow` | Stack Overflow 技术问答（Stack Exchange 官方公开 API） |
| `wikipedia` | 维基百科词条（中文环境用 zh.wikipedia.org，`lang: en` 时切换 en.wikipedia.org） |
| `npm` | npm 包搜索（registry 官方 API） |

全部走公开 API，零外部依赖、无需任何 key，开箱即用。

### 多源交叉搜索（multi_search）

需要交叉验证或多个视角时（"多找几个来源确认一下"），agent 可以调用 `multi_search`：并发查询多个引擎（默认取智能路由的前 3 个已启用引擎，也可以指定 `engines`），按 URL 规范化去重合并，每条结果标注 `seen in: bing, baidu`，被越多引擎命中的排越前。会消耗更多引擎额度，按需使用。

### 接管默认搜索

DSH 的 base bundle 出厂就把 `web.searchProvider` 设为官方的 `deepseek-official`（需要 DeepSeek 余额）。插件启动时：未设置 searchProvider，或仍是出厂默认的 `deepseek-official` → 自动接管为本插件；已被显式指向其他 provider → 不抢占，只在日志里警告并给出切换用的 YAML。

## 代理（国内用户）

DuckDuckGo、OpenAI 等在国内通常要走代理，而 Node.js 的 `fetch` 默认不走系统代理。现在不用再给 dsh 进程设环境变量，直接在插件配置卡片的 **网络代理** 里设置：

- **系统代理（自动检测）**：依次读取 `HTTPS_PROXY` / `HTTP_PROXY` / `ALL_PROXY` 环境变量、Windows「Internet 选项」里的系统代理、macOS 网络设置里的 HTTP(S) 代理。检测结果会显示在下拉框下方。
- **自定义代理地址**：手动填写，如 `http://127.0.0.1:7897`（可省略 `http://`）。
- **走代理的引擎**：只有勾选的引擎走代理，其余直连（默认勾选 DuckDuckGo HTML / Lite）。

说明：

- 只支持 HTTP/HTTPS 代理。Clash、v2rayN 等客户端请填 HTTP 端口或混合（mixed）端口；填 `socks5://` 会直接报错提示。
- 选了代理却拿不到地址（比如系统代理没开）时，该引擎本次失败，自动回退到下一个引擎。
- 「测试引擎」按钮同样按这里的代理设置发请求，可以直接用它验证代理是否可用。
- 如果你之前按旧文档给 dsh 设置了 `NODE_USE_ENV_PROXY=1` + `HTTPS_PROXY`，那会让 dsh 的所有请求都走代理；改用本设置后可以去掉这些环境变量。
- 和 [dsh-proxy](https://github.com/copylee711/dsh-proxy)（DSH 全局 / 模型提供商代理插件）可以同时装，互不冲突：这里勾选的引擎走这里设的代理；没勾选的引擎和普通请求一样，dsh-proxy 开了全局代理就走全局代理，没开就直连。如果 dsh-proxy 已经开了全局代理，这里保持「不使用代理」即可。

## safeSearch 安全搜索过滤

- 配置项 `safeSearch`：`off`（引擎默认，不加参数）/ `moderate` / `strict`
- 作用于 Bing（adlt）、DuckDuckGo HTML（adlt）、DuckDuckGo Lite（adlt）
- 默认 `off`：不额外过滤，保持引擎自身默认行为；需要时在插件配置卡片的「安全搜索过滤」切换

## 工作原理

- `lib/index.js`：host 端。实现 `WebSearchProvider`（`id` / `available()` / `search()`），统一引擎路由 + 自动回退（顺序与启用状态来自设置页，支持智能路由）；解析 `timeRange`（固定档/相对值/绝对日期）并透传给各引擎；在 `web-search-free` 条目上声明可编辑配置（`.volatile()`）并自带设置页；提供 `/api/dsh-free-search-settings` 读写桥 + `raw-search` 调试接口；注册 `free_search_test`、`platform_search`、`advanced_search`、`multi_search` 工具；动态注入引擎清单到系统提示词（设置变更时自动刷新）。
- `lib/client.js`：浏览器端。React 配置卡片（优先级列表 + 模型搜索 + key 输入 + 连通测试 + 中英切换，样式沿用 DSH 设置页的设计变量），挂载到官方「网页搜索」页下方（`plugins.detail.section`），官方页不在时退回插件详情页（`plugins.bundle.config`）；注册 `/free-search-engine` 弹出式切换命令（`commandUi` popupSelect，与 `/model` 同机制）。
- `cordis.patch.yml`：插件 loader 配置。

## 许可证

MIT
