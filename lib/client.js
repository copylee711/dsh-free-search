window.__ModuleLoader__.load({
  id: "@copylee/dsh-free-search",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;

    let react = require("react");
    let react_jsx_runtime = require("react/jsx-runtime");

    //#region css
    // 样式对齐 DSH 设置页（dsh-client-ui-primitives 的 settings-form / Switch / SegmentedControl / Tag / Button），
    // 只用 DSH 的 --dsw-* 设计变量，跟随应用的深浅色主题。
    const css = [
      // 卡片：折叠模式是一张带边框的卡；page 模式（官方网页搜索页 / 插件详情页）去掉外框，与页面融为一体
      ".dshfs-card{list-style:none;min-width:0;margin:0 0 8px;border:.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-lg,12px);background:var(--dsw-alias-bg-layer-3);overflow:hidden}",
      ".dshfs-pageMode{border:0;border-radius:0;background:transparent;overflow:visible;margin:0}",
      ".dshfs-header{width:100%;display:flex;align-items:center;gap:8px;padding:12px 16px;border:0;background:0 0;color:inherit;font:inherit;text-align:left;cursor:pointer}",
      ".dshfs-header:hover{background:var(--dsw-alias-interactive-bg-hover)}",
      ".dshfs-header:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:-2px}",
      ".dshfs-pageMode>.dshfs-header{cursor:default;padding:0 0 4px;justify-content:flex-end}",
      ".dshfs-pageMode>.dshfs-header:hover{background:0 0}",
      ".dshfs-pageMode .dshfs-headText{display:none}",
      ".dshfs-headText{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;overflow:hidden}",
      ".dshfs-name{color:var(--dsw-alias-label-primary);font-size:14px;font-weight:500;line-height:20px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
      ".dshfs-description{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
      ".dshfs-pending{color:var(--dsw-alias-state-warn-primary);font-size:12px;line-height:18px;white-space:nowrap;flex:none}",
      ".dshfs-chevron{color:var(--dsw-alias-label-tertiary);flex:none;font-size:12px;transition:transform .12s}",
      ".dshfs-chevronOpen{transform:rotate(180deg)}",
      ".dshfs-langToggle{flex:none;height:24px;display:inline-flex;align-items:center;padding:0 8px;border:.5px solid var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-sm,6px);color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px;cursor:pointer;user-select:none}",
      ".dshfs-langToggle:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}",
      // 分区：14px/500 标题，分区之间 32px（同插件详情页 detailSection）
      ".dshfs-body{display:flex;flex-direction:column;gap:32px;padding:4px 16px 16px}",
      ".dshfs-pageMode .dshfs-body{padding:0}",
      ".dshfs-section{display:flex;flex-direction:column;gap:4px;min-width:0}",
      ".dshfs-sectionHead{display:flex;align-items:center;gap:8px}",
      ".dshfs-sectionTitle{margin:0;color:var(--dsw-alias-label-primary);font-size:14px;font-weight:500;line-height:20px}",
      ".dshfs-sectionAside{display:inline-flex}",
      // 设置项：细分隔线分开，标签 13px/500，说明 12px 三级文字（同 settings-form）
      ".dshfs-fields{display:flex;flex-direction:column}",
      ".dshfs-field{display:flex;flex-direction:column;gap:8px;padding:12px 0;min-width:0}",
      ".dshfs-field+.dshfs-field{border-top:.5px solid var(--dsw-alias-border-l2)}",
      ".dshfs-fieldHead{display:flex;align-items:center;gap:12px;min-width:0}",
      ".dshfs-label{flex:1;min-width:0;display:inline-flex;align-items:center;gap:6px;color:var(--dsw-alias-label-primary);font-size:13px;font-weight:500;line-height:1.5}",
      ".dshfs-hint{margin:0;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:1.5}",
      ".dshfs-inline{display:flex;align-items:center;gap:12px;flex-wrap:wrap}",
      ".dshfs-inline>.dshfs-selectWrap{flex:1;min-width:220px}",
      // 输入框 / 下拉框：34px、.5px 描边、layer-3 底（同 settings-form .input）
      ".dshfs-input,.dshfs-select{box-sizing:border-box;width:100%;height:34px;padding:0 12px;border:.5px solid var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-md,8px);background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:1.5;outline:none;transition:border-color .13s}",
      ".dshfs-input::placeholder{color:var(--dsw-alias-label-dimmed)}",
      ".dshfs-input:hover:not(:disabled),.dshfs-select:hover:not(:disabled){border-color:var(--dsw-alias-border-l3)}",
      ".dshfs-input:focus-visible,.dshfs-select:focus-visible{border-color:var(--dsw-alias-state-business-primary)}",
      ".dshfs-input:disabled,.dshfs-select:disabled{color:var(--dsw-alias-label-tertiary);cursor:default}",
      ".dshfs-ttl{width:96px}",
      // 下拉框：触发按钮沿用输入框样式；弹出菜单照搬 DSH Menu（浮层卡片、34px 行、选中项尾部打勾）
      ".dshfs-selectWrap{position:relative;display:flex;min-width:0}",
      ".dshfs-selectCompact{width:auto;min-width:200px;flex:none}",
      ".dshfs-select{display:flex;align-items:center;gap:8px;text-align:left;cursor:pointer;padding-right:10px}",
      ".dshfs-selectOpen{border-color:var(--dsw-alias-state-business-primary)}",
      ".dshfs-selectValue{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshfs-selectChevron{flex:none;color:var(--dsw-alias-label-tertiary);transition:transform .15s ease}",
      ".dshfs-selectOpen .dshfs-selectChevron{transform:rotate(180deg)}",
      ".dshfs-menu{position:fixed;z-index:1100;box-sizing:border-box;min-width:160px;padding:4px;overflow-y:auto;overscroll-behavior:contain;border-radius:var(--dsw-radius-lg,12px);background:var(--dsw-menu-surface-fill,var(--dsw-alias-bg-layer-1));backdrop-filter:var(--dsw-menu-backdrop-filter,none);-webkit-backdrop-filter:var(--dsw-menu-backdrop-filter,none);box-shadow:var(--dsw-elevation-prominent,0 10px 32px rgba(0,0,0,.16),0 0 0 .5px rgba(0,0,0,.1));animation:dshfs-menu-in .12s ease-out}",
      "@keyframes dshfs-menu-in{from{opacity:0;transform:translateY(-2px)}to{opacity:1;transform:none}}",
      ".dshfs-menuLabel{padding:6px 8px 2px;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;font-weight:500;user-select:none}",
      ".dshfs-menuLabel:not(:first-child){margin-top:4px;padding-top:8px;border-top:.5px solid var(--dsw-alias-border-l2)}",
      ".dshfs-menuItem{display:flex;align-items:center;gap:8px;min-height:34px;box-sizing:border-box;padding:6px 8px;border-radius:var(--dsw-radius-md,8px);color:var(--dsw-alias-label-primary);font-size:13px;line-height:20px;cursor:pointer;user-select:none}",
      ".dshfs-menuItemActive{background:var(--dsw-alias-interactive-bg-hover)}",
      ".dshfs-menuItemLabel{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshfs-menuDetail{flex:none;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}",
      ".dshfs-menuCheckSlot{flex:none;display:inline-flex;width:14px;height:14px;color:var(--dsw-alias-label-primary)}",
      "@media (prefers-reduced-motion:reduce){.dshfs-menu{animation:none}.dshfs-selectChevron{transition:none}}",
      // 开关（同 primitives Switch）
      ".dshfs-switch{box-sizing:border-box;position:relative;flex:none;width:36px;height:20px;padding:2px;border:0;border-radius:999px;background:var(--dsw-alias-border-l3);cursor:pointer;transition:background-color .12s}",
      ".dshfs-switch[aria-checked=true]{background:var(--dsw-alias-brand-primary,var(--dsw-alias-state-business-primary))}",
      ".dshfs-switch:disabled{opacity:.5;cursor:default}",
      ".dshfs-switch:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:2px}",
      ".dshfs-switchThumb{display:block;width:16px;height:16px;border-radius:50%;background:var(--dsw-alias-label-primary-foreground,#fff);transition:transform .12s ease}",
      ".dshfs-switch[aria-checked=false] .dshfs-switchThumb{background:var(--dsw-alias-switch-thumb,#fff)}",
      ".dshfs-switch[aria-checked=true] .dshfs-switchThumb{transform:translateX(16px)}",
      // 分段控件（同 primitives SegmentedControl）
      ".dshfs-segmented{position:relative;display:inline-grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:2px;padding:4px;align-self:flex-start;border-radius:var(--dsw-radius-md,8px);background:var(--dsw-alias-interactive-bg-hover)}",
      ".dshfs-segIndicator{position:absolute;top:4px;left:4px;width:calc((100% - 8px - 2px * (var(--dshfs-seg-count) - 1)) / var(--dshfs-seg-count));height:calc(100% - 8px);border-radius:var(--dsw-radius-sm,6px);background:var(--dsw-alias-bg-layer-1);box-shadow:var(--dsw-elevation-soft,0 1px 2px rgba(0,0,0,.12));transform:translateX(calc(var(--dshfs-seg-index) * (100% + 2px)));transition:transform .16s ease;pointer-events:none}",
      ".dshfs-segTab{position:relative;z-index:1;box-sizing:border-box;height:28px;padding:0 16px;border:0;border-radius:var(--dsw-radius-sm,6px);background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:13px;line-height:20px;font-weight:500;white-space:nowrap;cursor:pointer;transition:color .12s}",
      ".dshfs-segTab:hover:not(:disabled),.dshfs-segTab[aria-selected=true]{color:var(--dsw-alias-label-primary)}",
      ".dshfs-segTab:disabled{opacity:.4;cursor:default}",
      "@media (prefers-reduced-motion:reduce){.dshfs-segIndicator,.dshfs-segTab,.dshfs-switchThumb{transition:none}}",
      // 标签（同 primitives Tag）
      ".dshfs-tag{display:inline-flex;align-items:center;flex:none;padding:1px 8px;border-radius:999px;font-size:11px;line-height:17px;font-weight:500;white-space:nowrap}",
      ".dshfs-tag[data-tone=neutral]{background:var(--dsw-alias-bg-module-platform,var(--dsw-alias-interactive-bg-hover));color:var(--dsw-alias-label-secondary)}",
      ".dshfs-tag[data-tone=outline]{border:.5px solid var(--dsw-alias-border-l4);color:var(--dsw-alias-label-tertiary)}",
      ".dshfs-tag[data-tone=success]{background:color-mix(in srgb,var(--dsw-alias-state-success-primary,#2f9e5b) 10%,transparent);color:var(--dsw-alias-state-success-primary,#2f9e5b)}",
      ".dshfs-tag[data-tone=info]{background:color-mix(in srgb,var(--dsw-alias-state-business-primary) 10%,transparent);color:var(--dsw-alias-state-business-primary)}",
      ".dshfs-tag[data-tone=warning]{background:color-mix(in srgb,var(--dsw-alias-state-warn-primary) 12%,transparent);color:var(--dsw-alias-state-warn-primary)}",
      // 引擎顺序列表：带边框的列表，行之间细分隔线（同插件列表 rows）
      ".dshfs-order{list-style:none;margin:0;padding:0;border:.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-md,8px)}",
      ".dshfs-orderRow{position:relative;display:flex;align-items:center;gap:10px;min-height:44px;padding:0 8px 0 6px;background:var(--dsw-alias-bg-layer-3);cursor:grab;user-select:none;-webkit-user-select:none;transition:transform .16s ease}",
      ".dshfs-orderRow:first-child{border-top-left-radius:var(--dsw-radius-md,8px);border-top-right-radius:var(--dsw-radius-md,8px)}",
      ".dshfs-orderRow:last-child{border-bottom-left-radius:var(--dsw-radius-md,8px);border-bottom-right-radius:var(--dsw-radius-md,8px)}",
      ".dshfs-orderGrip{flex:none;display:inline-flex;color:var(--dsw-alias-label-dimmed);transition:color .12s}",
      ".dshfs-orderRow:hover .dshfs-orderGrip{color:var(--dsw-alias-label-secondary)}",
      ".dshfs-orderNote{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}",
      // 拖动中：被拖的行浮起跟随指针，其余行让位滑动；松手那一帧关闭过渡避免回弹
      ".dshfs-orderDragging,.dshfs-orderDragging .dshfs-orderRow{cursor:grabbing}",
      ".dshfs-orderDragging .dshfs-orderRow:hover{background:var(--dsw-alias-bg-layer-3)}",
      ".dshfs-orderRow.dshfs-orderRowDragged{z-index:2;transition:none;border-radius:var(--dsw-radius-md,8px);background:var(--dsw-alias-bg-layer-1);box-shadow:var(--dsw-elevation-prominent,0 8px 24px rgba(0,0,0,.16),0 0 0 .5px rgba(0,0,0,.1))}",
      ".dshfs-orderRowDragged .dshfs-orderGrip{color:var(--dsw-alias-label-primary)}",
      ".dshfs-orderSettling .dshfs-orderRow{transition:none}",
      "@media (prefers-reduced-motion:reduce){.dshfs-orderRow{transition:none}}",
      ".dshfs-orderRow+.dshfs-orderRow{border-top:.5px solid var(--dsw-alias-border-l2)}",
      ".dshfs-orderRow:hover{background:var(--dsw-alias-interactive-bg-hover)}",
      ".dshfs-orderIndex{flex:none;width:18px;color:var(--dsw-alias-label-tertiary);font-size:12px;font-variant-numeric:tabular-nums;text-align:right}",
      ".dshfs-orderName{flex:1;min-width:0;display:flex;align-items:center;gap:6px;flex-wrap:wrap}",
      ".dshfs-orderLabel{color:var(--dsw-alias-label-primary);font-size:13px;line-height:20px}",
      ".dshfs-orderOff .dshfs-orderLabel,.dshfs-orderOff .dshfs-orderIndex{color:var(--dsw-alias-label-dimmed)}",
      ".dshfs-orderOff .dshfs-tag{opacity:.55}",
      ".dshfs-orderActions{flex:none;display:inline-flex;align-items:center;gap:2px}",
      ".dshfs-orderActions .dshfs-switch{margin-left:8px}",
      ".dshfs-iconBtn{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;padding:0;border:0;border-radius:var(--dsw-radius-sm,6px);background:0 0;color:var(--dsw-alias-label-tertiary);cursor:pointer}",
      ".dshfs-iconBtn:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}",
      ".dshfs-iconBtn:disabled{opacity:.35;cursor:default}",
      ".dshfs-iconBtn:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:-2px}",
      // API 密钥：左列名称 + 来源标签，右列输入框
      ".dshfs-keys{display:flex;flex-direction:column;gap:8px}",
      ".dshfs-keyRow{display:grid;grid-template-columns:minmax(120px,180px) minmax(0,1fr);align-items:center;gap:12px}",
      ".dshfs-keyName{display:flex;align-items:center;gap:6px;min-width:0;color:var(--dsw-alias-label-primary);font-size:13px;line-height:20px}",
      ".dshfs-field>.dshfs-keyRow{grid-template-columns:minmax(0,1fr)}",
      ".dshfs-field>.dshfs-keyRow>.dshfs-keyName{display:none}",
      "@media (max-width:560px){.dshfs-keyRow{grid-template-columns:minmax(0,1fr);gap:4px}}",
      // 复选框（同 primitives Checkbox）
      ".dshfs-checks{display:flex;flex-wrap:wrap;gap:8px 20px}",
      ".dshfs-check{display:inline-flex;align-items:center;gap:6px;color:var(--dsw-alias-label-primary);font-size:13px;line-height:20px;cursor:pointer}",
      ".dshfs-check input{flex:none;width:16px;height:16px;margin:0;accent-color:var(--dsw-alias-brand-primary,var(--dsw-alias-state-business-primary));cursor:inherit}",
      ".dshfs-check:has(input:disabled){opacity:.5;cursor:default}",
      ".dshfs-link{flex:none;color:var(--dsw-alias-state-business-primary);font-size:12px;line-height:18px;text-decoration:none}",
      ".dshfs-link:hover{text-decoration:underline}",
      ".dshfs-textBtn{flex:none;padding:0;border:0;background:0 0;font:inherit;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary);cursor:pointer}",
      ".dshfs-textBtn:hover:not(:disabled){color:var(--dsw-alias-label-primary)}",
      ".dshfs-textBtn:disabled{opacity:.4;cursor:default}",
      // 提示 / 结果
      ".dshfs-banner{margin:0;padding:8px 12px;border-radius:var(--dsw-radius-md,8px);background:color-mix(in srgb,var(--dsw-alias-state-warn-primary) 10%,transparent);color:var(--dsw-alias-state-warn-primary);font-size:12px;line-height:1.5}",
      ".dshfs-results{display:flex;flex-direction:column;gap:4px;margin-top:-16px}",
      ".dshfs-note{margin:0;font-size:12px;line-height:1.5;overflow-wrap:anywhere}",
      ".dshfs-noteOk{color:var(--dsw-alias-state-success-primary,#2f9e5b)}",
      ".dshfs-noteError{color:var(--dsw-alias-state-error-primary)}",
      // 底栏：左侧版本/更新，右侧 测试 · 撤销 · 保存；保存按钮同 settings-form（深色主按钮）
      ".dshfs-footer{display:flex;align-items:center;justify-content:space-between;gap:8px 12px;flex-wrap:wrap;margin-top:-16px;padding-top:16px;border-top:.5px solid var(--dsw-alias-border-l2)}",
      ".dshfs-footerLeft,.dshfs-footerRight{display:flex;align-items:center;gap:8px;flex-wrap:wrap;min-width:0}",
      ".dshfs-btn{box-sizing:border-box;height:32px;display:inline-flex;align-items:center;justify-content:center;padding:0 14px;border:.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-md,8px);background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;cursor:pointer;appearance:none;-webkit-appearance:none;transition:background-color .13s}",
      ".dshfs-btn:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}",
      ".dshfs-btn:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:1px}",
      ".dshfs-btn:disabled{opacity:.4;cursor:default}",
      ".dshfs-save{border-color:transparent;background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-layer-3)}",
      ".dshfs-save:hover:not(:disabled){background:var(--dsw-alias-label-primary);opacity:.88}",
      ".dshfs-version{color:var(--dsw-alias-label-tertiary);font-size:12px;font-variant-numeric:tabular-nums;white-space:nowrap}",
      ".dshfs-updatePill{display:inline-flex;align-items:center;gap:4px;height:24px;padding:0 8px;border:.5px solid var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-sm,6px);background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;line-height:18px;text-decoration:none;white-space:nowrap;cursor:pointer}",
      ".dshfs-updatePill:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}",
      ".dshfs-updatePill:disabled{opacity:.5;cursor:default}",
      "a.dshfs-updatePill{border-color:color-mix(in srgb,var(--dsw-alias-state-business-primary) 40%,transparent);color:var(--dsw-alias-state-business-primary)}",
      ".dshfs-updateIcon{flex:none;display:block}",
      // 顶部「网页搜索 / 图片搜索」切换：占满卡片宽度，两段等宽
      ".dshfs-viewSwitch{display:flex;margin-bottom:-12px}",
      ".dshfs-viewSwitch .dshfs-segmented{flex:1;align-self:stretch}",
      ".dshfs-viewSwitch .dshfs-segTab{height:32px;font-size:13.5px}",
      ".dshfs-inlineLabel{color:var(--dsw-alias-label-secondary);font-size:13px;line-height:20px}",
      // 对话内图片墙：CSS columns 瀑布流；悬停浮出标题/尺寸；点击打开大图
      ".dshfs-wall{display:flex;flex-direction:column;gap:10px;min-width:0;padding:10px 12px 12px;border:.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-lg,12px);background:var(--dsw-alias-bg-layer-3)}",
      ".dshfs-wallHead{display:flex;align-items:baseline;gap:10px;min-width:0;flex-wrap:wrap}",
      ".dshfs-wallSummary{color:var(--dsw-alias-label-primary);font-size:13px;font-weight:500;line-height:20px}",
      ".dshfs-wallNote{flex:1;min-width:0;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
      ".dshfs-wallGroup{display:flex;flex-direction:column;gap:6px;min-width:0}",
      ".dshfs-wallPage{display:flex;align-items:center;gap:8px;min-width:0;font-size:12.5px;line-height:18px}",
      ".dshfs-wallPage a{min-width:0;color:var(--dsw-alias-label-secondary);text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
      ".dshfs-wallPage a:hover{color:var(--dsw-alias-label-primary);text-decoration:underline}",
      ".dshfs-wallCount{flex:none;color:var(--dsw-alias-label-tertiary);font-size:12px}",
      ".dshfs-masonry{column-width:168px;column-gap:8px}",
      ".dshfs-tile{position:relative;display:block;width:100%;margin:0 0 8px;padding:0;border:0;border-radius:var(--dsw-radius-md,8px);overflow:hidden;background:var(--dsw-alias-interactive-bg-hover);cursor:zoom-in;break-inside:avoid;min-height:60px}",
      ".dshfs-tile img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .2s ease}",
      ".dshfs-tile:hover img{transform:scale(1.03)}",
      ".dshfs-tile:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:2px}",
      ".dshfs-tileInfo{position:absolute;left:0;right:0;bottom:0;display:flex;flex-direction:column;gap:1px;padding:18px 8px 6px;background:linear-gradient(transparent,rgba(0,0,0,.62));color:#fff;text-align:left;opacity:0;transition:opacity .15s}",
      ".dshfs-tile:hover .dshfs-tileInfo,.dshfs-tile:focus-visible .dshfs-tileInfo{opacity:1}",
      ".dshfs-tileTitle{font-size:12px;line-height:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
      ".dshfs-tileSize{font-size:11px;line-height:14px;opacity:.8;font-variant-numeric:tabular-nums}",
      ".dshfs-tileBroken{cursor:default;aspect-ratio:auto!important}",
      ".dshfs-tileFallback{display:block;padding:12px 8px;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:16px;word-break:break-all;text-align:left}",
      ".dshfs-wallMore{align-self:center}",
      ".dshfs-wallText{margin:0;white-space:pre-wrap;word-break:break-word;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12.5px;line-height:1.5;max-height:240px;overflow:auto}",
      ".dshfs-wallError .dshfs-wallText{color:var(--dsw-alias-state-error-primary)}",
      ".dshfs-skeleton{column-width:168px;column-gap:8px}",
      ".dshfs-skeletonTile{display:block;margin:0 0 8px;border-radius:var(--dsw-radius-md,8px);background:var(--dsw-alias-interactive-bg-hover);animation:dshfs-pulse 1.2s ease-in-out infinite;break-inside:avoid}",
      "@keyframes dshfs-pulse{0%,100%{opacity:.55}50%{opacity:1}}",
      // 大图浮层（portal 到 body）
      ".dshfs-lightbox{position:fixed;inset:0;z-index:1200;display:flex;align-items:center;justify-content:center;padding:48px 64px;background:rgba(0,0,0,.82);animation:dshfs-menu-in .12s ease-out}",
      ".dshfs-lbFigure{margin:0;display:flex;flex-direction:column;align-items:center;gap:12px;max-width:100%;max-height:100%;min-width:0}",
      ".dshfs-lbImage{display:block;max-width:100%;max-height:calc(100vh - 190px);object-fit:contain;border-radius:var(--dsw-radius-md,8px);background:rgba(255,255,255,.04)}",
      ".dshfs-lbCaption{display:flex;align-items:center;justify-content:space-between;gap:12px 20px;flex-wrap:wrap;width:min(960px,100%);color:#fff}",
      ".dshfs-lbText{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}",
      ".dshfs-lbTitle{font-size:14px;font-weight:500;line-height:20px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dshfs-lbMeta{font-size:12px;line-height:18px;color:rgba(255,255,255,.66)}",
      ".dshfs-lbActions{display:flex;gap:8px;flex-wrap:wrap}",
      ".dshfs-lbActions .dshfs-btn{color:#fff;border-color:rgba(255,255,255,.28);background:rgba(255,255,255,.08);text-decoration:none}",
      ".dshfs-lbActions .dshfs-btn:hover:not(:disabled){background:rgba(255,255,255,.18)}",
      ".dshfs-lbClose,.dshfs-lbNav{position:absolute;display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:999px;background:rgba(255,255,255,.1);color:#fff;cursor:pointer;font:inherit;line-height:1}",
      ".dshfs-lbClose:hover,.dshfs-lbNav:hover{background:rgba(255,255,255,.22)}",
      ".dshfs-lbClose{top:16px;right:16px;width:36px;height:36px;font-size:22px}",
      ".dshfs-lbNav{top:50%;width:44px;height:44px;margin-top:-22px;font-size:28px}",
      ".dshfs-lbPrev{left:12px}",
      ".dshfs-lbNext{right:12px}",
      "@media (max-width:640px){.dshfs-lightbox{padding:48px 12px}.dshfs-lbNav{display:none}}",
      "@media (prefers-reduced-motion:reduce){.dshfs-tile img,.dshfs-skeletonTile{transition:none;animation:none}}",
      // 官方「网页搜索」页里的引导文字 / 插件详情页的指引卡
      ".dshfs-takeover{margin-top:16px;padding:12px 16px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;border:.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-md,8px);background:var(--dsw-alias-bg-layer-3)}",
      ".dshfs-takeoverText{flex:1;min-width:220px;display:flex;flex-direction:column;gap:2px}",
      ".dshfs-takeoverTitle{color:var(--dsw-alias-label-primary);font-size:14px;font-weight:500;line-height:20px}",
      ".dshfs-takeoverHint{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:1.5}",
      ".dshfs-webSearchSection{margin-top:32px;padding-top:24px;border-top:.5px solid var(--dsw-alias-border-l2);display:flex;flex-direction:column;gap:16px}",
      ".dshfs-sectionLead{padding:0}",
    ].join("");
    const tagId = "dsh-free-search/card.css";
    // 已有同名 style（插件热更新后旧版留下的）时覆盖内容，保证新版样式生效
    if (typeof document !== "undefined") {
      let tag = document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]");
      if (tag === null) {
        tag = document.createElement("style");
        tag.dataset.plugin = "@copylee/dsh-free-search";
        tag.dataset.pluginCss = tagId;
        document.head.appendChild(tag);
      }
      if (tag.textContent !== css) tag.textContent = css;
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
    const KEY_IDS = ["anysearch", "exa", "tavily", "keenable", "firecrawl", "parallel", "perplexity", "serpbase", "deepseek", "youcom", "baidu", "kimi", "aliyun", "doubao", "openai", "pexels", "unsplash", "pixabay"];
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
      youcom: { label: "You.com", env: "YOUCOM_API_KEY" },
      baidu: { label: "百度千帆", env: "BAIDU_API_KEY" },
      kimi: { label: "Kimi", env: "MOONSHOT_API_KEY" },
      aliyun: { label: "阿里云百炼", env: "DASHSCOPE_API_KEY" },
      doubao: { label: "豆包搜索", env: "DOUBAO_SEARCH_API_KEY" },
      openai: { label: "OpenAI", env: "OPENAI_API_KEY" },
      pexels: { label: "Pexels", env: "PEXELS_API_KEY" },
      unsplash: { label: "Unsplash", env: "UNSPLASH_ACCESS_KEY" },
      pixabay: { label: "Pixabay", env: "PIXABAY_API_KEY" },
    };
    // 图片来源（与 lib/images.js 的 IMAGE_PROVIDERS / DEFAULT_IMAGE_PROVIDER_ORDER 一致）
    const IMAGE_SOURCES = [
      { id: "wikimedia", label: "Wikimedia Commons", badge: "FREE", link: "https://commons.wikimedia.org" },
      { id: "openverse", label: "Openverse", badge: "FREE", link: "https://openverse.org" },
      { id: "pexels", label: "Pexels", badge: "API KEY", link: "https://www.pexels.com/api/" },
      { id: "unsplash", label: "Unsplash", badge: "API KEY", link: "https://unsplash.com/developers" },
      { id: "pixabay", label: "Pixabay", badge: "API KEY", link: "https://pixabay.com/api/docs/" },
      { id: "bing-images", label: "Bing 图片", badge: "FREE", link: "https://www.bing.com/images" },
    ];
    const DEFAULT_IMAGE_ORDER = IMAGE_SOURCES.map((s) => s.id);
    // 图片图源用的 key：只在「图片搜索」页显示
    const IMAGE_KEY_IDS = ["pexels", "unsplash", "pixabay"];
    // 配置卡片当前显示哪一页（网页搜索 / 图片搜索），记在本机浏览器里，读写失败就用默认
    const VIEW_STORAGE_KEY = "dsh-free-search:settings-view";
    function readStoredView() {
      try {
        return localStorage.getItem(VIEW_STORAGE_KEY) === "images" ? "images" : "web";
      } catch {
        return "web";
      }
    }
    function normalizeImageOrder(order) {
      const out = [];
      for (const id of Array.isArray(order) ? order : []) if (DEFAULT_IMAGE_ORDER.includes(id) && !out.includes(id)) out.push(id);
      for (const id of DEFAULT_IMAGE_ORDER) if (!out.includes(id)) out.push(id);
      return out;
    }
    // 「走代理的引擎」里额外列出的图片相关条目（id 与服务端 runWithEngineProxy 用的一致）
    const IMAGE_PROXY_ENTRIES = [{ id: "page-images", label: "网页取图 / 图片下载" }, ...IMAGE_SOURCES.map((s) => ({ id: s.id, label: s.label }))];
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
        secEngines: "搜索引擎",
        priorityMode: "优先级模式",
        modePreferred: "首选 + 回退",
        modeList: "全局列表",
        modePreferredHint: "先用首选引擎；失败（缺 key / 限流 / 无结果 / 网络错误）时按下面的顺序依次回退。",
        modeListHint: "不单独设首选，完全按下面的列表从上到下尝试，第一个成功的结果即返回。",
        preferredEngine: "首选引擎",
        fallbackOrder: "回退顺序",
        searchOrder: "搜索顺序",
        orderHint: "按住一行拖动（或用 ↑ ↓）调整顺序，关闭开关的引擎会被跳过；需要 key 但还没配置的引擎也会自动跳过。带时间范围的搜索会先用支持时间过滤的引擎。",
        dragHint: "按住拖动排序",
        resetDefault: "恢复默认",
        modelTag: "模型搜索",
        moveUp: "上移",
        moveDown: "下移",
        secModelSearch: "模型内置联网搜索",
        paidTag: "按次计费",
        modelSearchEnable: "启用 OpenAI 内置联网搜索",
        modelSearchHint: "通过 OpenAI Responses API 的 web_search 工具，由模型搜索网页并返回带引用的回答。每次搜索按次计费（约 $10 / 千次，另计 token），单次约 3–15 秒，不支持时间过滤。开启后可在上面的顺序里调整它的位置。",
        openaiModel: "模型",
        openaiModelHint: "默认 gpt-6-luna（快且便宜）。需填支持 web_search 工具的模型；用网关时按网关的写法填（如 openai/gpt-6-luna）。",
        openaiBaseUrl: "Base URL",
        openaiBaseUrlHint: "默认 https://api.openai.com/v1，也可以填兼容 Responses API 的网关。国内网络请在下方「网络代理」里勾选 OpenAI。",
        openaiKey: "API 密钥",
        openaiKeyHint: "读取 OPENAI_API_KEY；保存位置跟随下方「API 密钥」里的 Key 存储位置。",
        openaiPh: (c) => c ? "OpenAI API 密钥（已配置）" : "OpenAI API 密钥（sk-...）",
        youcomPh: (c) => c ? "You.com API 密钥（已配置）" : "You.com API 密钥（you.com/platform/api-keys 获取）",
        baiduPh: (c) => c ? "百度千帆 API 密钥（已配置）" : "百度千帆 API 密钥（BAIDU_API_KEY）",
        kimiPh: (c) => c ? "Kimi API 密钥（已配置）" : "Kimi API 密钥（MOONSHOT_API_KEY）",
        aliyunPh: (c) => c ? "阿里云百炼密钥（已配置）" : "阿里云 DashScope 密钥（DASHSCOPE_API_KEY）",
        doubaoPh: (c) => c ? "豆包搜索密钥（已配置）" : "豆包 / 火山联网搜索密钥（DOUBAO_SEARCH_API_KEY，每月 500 次免费）",
        secImages: "图片搜索",
        viewWeb: "网页搜索",
        viewImages: "图片搜索",
        imgSearchOn: "图库搜图（image_search）",
        imgSearchHint: "按下面的顺序从图库找图，结果在对话里显示为图片墙。适合配图、背景、插画、氛围图。",
        pageImagesOn: "网页取图（page_images）",
        pageImagesHint: "从网页（维基百科、百度百科、新闻、官网……）里把图片提取出来，适合收集人物、事件、产品的素材。",
        saveImagesOn: "保存到本地（save_images）",
        saveImagesHint: "模型可以把选中的图片下载到工作区，做 PPT、文档时直接插入本地图片。",
        imageOrder: "图源顺序",
        imageOrderHint: "按住拖动（或用 ↑ ↓）调整顺序，关闭开关的图源会被跳过，需要 key 但没配置的图源也会跳过。Bing 图片覆盖面最广，但图片版权归原作者；它没有可信结果时，会改用 Bing 网页搜索找页面，再从页面里提取图片（需开启网页取图）。",
        imageMinSize: "最小尺寸（px）",
        imageMinSizeHint: "网页取图时，长边小于这个尺寸的图片（图标、头像、缩略图）会被丢弃。",
        imageMaxPerPage: "每个页面最多",
        imageIncludeSvg: "包含 SVG 图片",
        imageSaveDir: "保存目录",
        imageSaveDirPh: "留空 = 当前会话工作区的 images 文件夹",
        imageSaveDirHint: "可以填绝对路径，或相对工作区的路径（如 素材/图片）；~ 表示用户主目录。",
        webImageTag: "网页图",
        pexelsPh: (c) => c ? "Pexels API 密钥（已配置）" : "Pexels API 密钥（pexels.com/api 免费申请）",
        unsplashPh: (c) => c ? "Unsplash Access Key（已配置）" : "Unsplash Access Key（unsplash.com/developers 免费申请）",
        pixabayPh: (c) => c ? "Pixabay API 密钥（已配置）" : "Pixabay API 密钥（pixabay.com/api/docs 免费申请）",
        groupSmart: "智能路由",
        groupFree: "免费引擎（无需 key）",
        groupKey: "需要 API Key",
        groupModel: "模型内置搜索",
        autoDetail: "按查询语言自动选择",
        keyReadyDetail: "key 已配置",
        keyMissingDetail: "未配置 key",
        autoHint: "智能路由：中日韩文查询先试 Bing / 百度 / 阿里云 / AnySearch，其他语言先试 Bing / Exa / Tavily，之后按下面的顺序回退。",
        keyConfigured: "已配置",
        secResults: "搜索结果",
        proxyModeLabel: "代理方式",
        testEngineHint: (name) => `用「${name}」搜一次 "DeepSeek Harness"`,
        visit: "访问官网 →",
        getKey: "获取 API Key →",
        engineHint: "Bing 是最稳定的免费引擎；DuckDuckGo 在共享 IP 上可能限流；API KEY 引擎需在下方填写密钥。",
        apiKeys: "API 密钥",
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
        platformSearch: "平台搜索",
        platformHint: "agent 的 platform_search 工具可搜索的平台，未勾选的会被跳过。",
        proxy: "网络代理",
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
        discard: "撤销",
        saving: "保存中…",
        save: "保存",
        testOk: (r) => `✓ ${r.count} 条结果（引擎: ${r.engine}）${r.content ? ` — ${r.content.length > 120 ? r.content.slice(0, 120) + "…" : r.content}` : ""}${r.sample ? ` · 例如 "${r.sample.slice(0, 40)}"` : ""}`,
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
        upgradeDoneReload: (l) => `已升级到 v${l}：请完全退出并重新打开 DSH（包括托盘图标），新版本才会完全生效`,
        hostStale: (host, ui) => `DSH 后台还在运行${host ? ` v${host}` : "旧版"}插件，界面已是 v${ui}。请完全退出并重新打开 DSH（包括托盘图标）：否则新增的设置保存不了，新功能（如图片搜索）也不可用。`,
        staleSaveError: "DSH 后台还在运行旧版插件，不认识新版的设置项。请完全退出并重新打开 DSH 后再保存。",
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
        secEngines: "Search engines",
        priorityMode: "Priority mode",
        modePreferred: "Preferred + fallback",
        modeList: "Priority list",
        modePreferredHint: "Use the preferred engine first; if it fails (missing key / rate limit / no results / network error), fall back through the order below.",
        modeListHint: "No separate preferred engine: engines are tried strictly top to bottom and the first successful result is returned.",
        preferredEngine: "Preferred engine",
        fallbackOrder: "Fallback order",
        searchOrder: "Search order",
        orderHint: "Press and drag a row (or use ↑ ↓) to reorder; switched-off engines are skipped, and so are engines that need a key you haven't set. Searches with a time range try engines that support time filtering first.",
        dragHint: "Press and drag to reorder",
        resetDefault: "Reset to default",
        modelTag: "Model search",
        moveUp: "Move up",
        moveDown: "Move down",
        secModelSearch: "Model built-in web search",
        paidTag: "Billed per search",
        modelSearchEnable: "Enable OpenAI built-in web search",
        modelSearchHint: "Uses the web_search tool of the OpenAI Responses API: the model searches the web and returns an answer with cited sources. Billed per search (about $10 per 1K searches, plus tokens), roughly 3-15 s per call, no time filtering. Once on, place it anywhere in the order above.",
        openaiModel: "Model",
        openaiModelHint: "Defaults to gpt-6-luna (fast and cheap). Use a model that supports the web_search tool; behind a gateway use its naming (e.g. openai/gpt-6-luna).",
        openaiBaseUrl: "Base URL",
        openaiBaseUrlHint: "Defaults to https://api.openai.com/v1; any gateway compatible with the Responses API works. If OpenAI is blocked on your network, tick OpenAI under Network proxy below.",
        openaiKey: "API key",
        openaiKeyHint: "Reads OPENAI_API_KEY; saved wherever Key storage under API keys points.",
        openaiPh: (c) => c ? "OpenAI API key (configured)" : "OpenAI API key (sk-...)",
        youcomPh: (c) => c ? "You.com API key (configured)" : "You.com API key (from you.com/platform/api-keys)",
        baiduPh: (c) => c ? "Baidu Qianfan API key (configured)" : "Baidu Qianfan API key (BAIDU_API_KEY)",
        kimiPh: (c) => c ? "Kimi API key (configured)" : "Kimi API key (MOONSHOT_API_KEY)",
        aliyunPh: (c) => c ? "Aliyun Bailian key (configured)" : "Aliyun DashScope key (DASHSCOPE_API_KEY)",
        doubaoPh: (c) => c ? "Doubao search key (configured)" : "Doubao / Volcano Web Search key (DOUBAO_SEARCH_API_KEY, 500 free/month)",
        secImages: "Image search",
        viewWeb: "Web search",
        viewImages: "Image search",
        imgSearchOn: "Image libraries (image_search)",
        imgSearchHint: "Finds pictures in the libraries below, in this order; results show up as an image wall in the chat. Good for illustrations, backgrounds and mood pictures.",
        pageImagesOn: "Images from web pages (page_images)",
        pageImagesHint: "Pulls the pictures out of web pages (Wikipedia, Baidu Baike, news, official sites…) - for collecting material about people, events and products.",
        saveImagesOn: "Save to disk (save_images)",
        saveImagesHint: "Lets the model download chosen pictures into the workspace, ready to insert into slides and documents.",
        imageOrder: "Source order",
        imageOrderHint: "Press and drag (or use ↑ ↓) to reorder; switched-off sources are skipped, and so are sources that need a key you haven't set. Bing Images covers the most, but the pictures belong to their owners; when it has no usable results it falls back to extracting pictures from pages found by a Bing web search (needs page images on).",
        imageMinSize: "Minimum size (px)",
        imageMinSizeHint: "When extracting from pages, pictures whose longer side is below this (icons, avatars, thumbnails) are dropped.",
        imageMaxPerPage: "Max per page",
        imageIncludeSvg: "Include SVG images",
        imageSaveDir: "Save folder",
        imageSaveDirPh: "Empty = the images folder in the session workspace",
        imageSaveDirHint: "An absolute path, or a path relative to the workspace (e.g. assets/images); ~ is your home folder.",
        webImageTag: "web images",
        pexelsPh: (c) => c ? "Pexels API key (configured)" : "Pexels API key (free at pexels.com/api)",
        unsplashPh: (c) => c ? "Unsplash access key (configured)" : "Unsplash access key (free at unsplash.com/developers)",
        pixabayPh: (c) => c ? "Pixabay API key (configured)" : "Pixabay API key (free at pixabay.com/api/docs)",
        groupSmart: "Smart routing",
        groupFree: "Free engines (no key)",
        groupKey: "Needs an API key",
        groupModel: "Model built-in search",
        autoDetail: "picked by query language",
        keyReadyDetail: "key set",
        keyMissingDetail: "no key",
        autoHint: "Smart routing: Chinese/Japanese/Korean queries try Bing / Baidu / Aliyun / AnySearch first, other languages Bing / Exa / Tavily, then the fallback order below.",
        keyConfigured: "configured",
        secResults: "Search results",
        proxyModeLabel: "Proxy mode",
        testEngineHint: (name) => `Search "DeepSeek Harness" with ${name}`,
        visit: "Visit website →",
        getKey: "Get API Key →",
        engineHint: "Bing is the most stable FREE engine. DuckDuckGo may rate-limit on shared IPs. API KEY engines need credentials below.",
        apiKeys: "API keys",
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
        platformSearch: "Platform search",
        platformHint: "Platforms the agent's platform_search tool may search; unchecked ones are skipped.",
        proxy: "Network proxy",
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
        discard: "Discard",
        saving: "Saving…",
        save: "Save",
        testOk: (r) => `✓ ${r.count} results (engine: ${r.engine})${r.content ? ` — ${r.content.length > 120 ? r.content.slice(0, 120) + "…" : r.content}` : ""}${r.sample ? ` · e.g. "${r.sample.slice(0, 40)}"` : ""}`,
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
        upgradeDoneReload: (l) => `Upgraded to v${l} - fully quit and reopen DSH (including the tray icon) for it to take full effect`,
        hostStale: (host, ui) => `DSH is still running ${host ? `v${host} of` : "an older version of"} the plugin in the background while this page is v${ui}. Fully quit and reopen DSH (including the tray icon); until then new settings cannot be saved and new features such as image search are unavailable.`,
        staleSaveError: "DSH is still running an older version of the plugin that does not know the new settings. Fully quit and reopen DSH, then save again.",
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
    const PLUGIN_VERSION = "0.6.3";
    // 顺序与 DEFAULT_ENGINE_ORDER 一致：免费在前，需要 key 的在后
    const ENGINES = [
      { id: "bing", label: "Bing", badge: "FREE", link: "https://www.bing.com" },
      { id: "exa", label: "Exa", badge: "FREE", link: "https://dashboard.exa.ai/api-keys" },
      { id: "anysearch", label: "AnySearch · AI", badge: "FREE", link: "https://anysearch.com" },
      { id: "tavily", label: "Tavily", badge: "FREE", link: "https://app.tavily.com/home" },
      { id: "keenable", label: "Keenable", badge: "FREE", link: "https://keenable.ai/login" },
      { id: "firecrawl", label: "Firecrawl", badge: "FREE", link: "https://www.firecrawl.dev" },
      { id: "parallel", label: "Parallel", badge: "FREE", link: "https://platform.parallel.ai" },
      { id: "ddg", label: "DuckDuckGo · HTML", badge: "FREE", link: "https://duckduckgo.com" },
      { id: "ddg-lite", label: "DuckDuckGo · Lite", badge: "FREE", link: "https://duckduckgo.com" },
      { id: "searxng", label: "SearXNG · 元搜索", badge: "FREE", link: "https://github.com/searxng/searxng" },
      { id: "perplexity", label: "Perplexity", badge: "API KEY", link: "https://www.perplexity.ai/settings/api" },
      { id: "serpbase", label: "SerpBase · Google", badge: "API KEY", link: "https://serpbase.dev" },
      { id: "deepseek-official", label: "DeepSeek Official", badge: "API KEY", link: "https://platform.deepseek.com/api_keys" },
      { id: "you", label: "You.com", badge: "API KEY", link: "https://you.com/platform/api-keys" },
      { id: "baidu", label: "Baidu · 百度千帆", badge: "API KEY", link: "https://console.bce.baidu.com/qianfan" },
      { id: "kimi", label: "Kimi · Moonshot", badge: "API KEY", link: "https://platform.moonshot.cn" },
      { id: "aliyun", label: "Aliyun · 百炼", badge: "API KEY", link: "https://bailian.console.aliyun.com" },
      { id: "doubao", label: "Doubao · 豆包搜索", badge: "API KEY", link: "https://console.volcengine.com/search-infinity/web-search" },
      { id: "openai", label: "OpenAI · Web Search", badge: "API KEY", link: "https://platform.openai.com/api-keys" },
    ];
    // 首选引擎可选「智能路由」：不是具体引擎，按查询语言排序（移植自上游）
    const AUTO_ENGINE = { id: "auto", label: "Auto · 智能路由", badge: "AUTO", link: null };

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

    // 引擎优先级（与 lib/index.js 的 DEFAULT_ENGINE_ORDER / DEFAULT_DISABLED_ENGINES / normalizeEngineOrder 保持一致）
    const DEFAULT_ENGINE_ORDER = ["bing", "exa", "anysearch", "tavily", "keenable", "firecrawl", "parallel", "ddg", "ddg-lite", "searxng", "perplexity", "serpbase", "deepseek-official", "you", "baidu", "kimi", "aliyun", "doubao", "openai"];
    const DEFAULT_ENGINE_ORDER_050 = ["exa", "tavily", "keenable", "firecrawl", "parallel", "perplexity", "serpbase", "deepseek-official", "you", "baidu", "kimi", "aliyun", "doubao", "openai", "bing", "anysearch", "ddg", "ddg-lite", "searxng"];
    const DEFAULT_DISABLED_ENGINES = ["openai"];
    const OPENAI_DEFAULT_MODEL = "gpt-6-luna";
    const OPENAI_DEFAULT_BASE_URL = "https://api.openai.com/v1";
    function normalizeEngineOrder(order) {
      if (Array.isArray(order) && sameList(order, DEFAULT_ENGINE_ORDER_050)) return DEFAULT_ENGINE_ORDER.slice();
      const known = ENGINES.map((e) => e.id);
      const out = [];
      for (const id of Array.isArray(order) ? order : []) {
        if (known.includes(id) && !out.includes(id)) out.push(id);
      }
      for (const id of DEFAULT_ENGINE_ORDER) {
        if (!out.includes(id)) out.push(id);
      }
      return out;
    }
    function normalizeDisabledEngines(disabled) {
      return Array.isArray(disabled) ? disabled.filter((id, i) => disabled.indexOf(id) === i) : DEFAULT_DISABLED_ENGINES.slice();
    }
    // 当前实际第一个尝试的引擎：首选模式 = provider；列表模式 = 列表里第一个启用的
    function leadEngine(mode, provider, order, disabled) {
      if (mode !== "list") return provider;
      return order.find((id) => !disabled.includes(id)) ?? "bing";
    }
    const sameList = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
    const DEFAULT_PLATFORMS = ["github", "v2ex", "bilibili", "reddit", "hn", "stackoverflow", "wikipedia", "npm"];
    const PLATFORM_LABELS = [
      ["github", "GitHub"], ["v2ex", "V2EX"], ["bilibili", "Bilibili"], ["reddit", "Reddit"],
      ["hn", "Hacker News"], ["stackoverflow", "Stack Overflow"], ["wikipedia", "Wikipedia"], ["npm", "npm"],
    ];

    // ---- 与 DSH 设置页一致的基础控件（样式照搬 dsh-client-ui-primitives，用同一套 --dsw-* 变量）----
    const h = react.createElement;

    function Section(props) {
      return h("section", { className: "dshfs-section" },
        h("div", { className: "dshfs-sectionHead" },
          h("h3", { className: "dshfs-sectionTitle" }, props.title),
          props.aside ? h("span", { className: "dshfs-sectionAside" }, props.aside) : null
        ),
        h("div", { className: "dshfs-fields" }, props.children)
      );
    }

    // 一个设置项：标签（可带右侧控件，如开关）+ 内容 + 说明
    function Field(props) {
      return h("div", { className: "dshfs-field" },
        props.label || props.control
          ? h("div", { className: "dshfs-fieldHead" },
              h("span", { className: "dshfs-label" }, props.label, props.badge ?? null),
              props.control ?? null
            )
          : null,
        props.children ?? null,
        props.hint ? h("p", { className: "dshfs-hint" }, props.hint) : null
      );
    }

    function Switch(props) {
      return h("button", {
        type: "button",
        role: "switch",
        className: "dshfs-switch",
        "aria-checked": props.checked ? "true" : "false",
        "aria-label": props.label,
        title: props.title,
        disabled: props.disabled,
        onClick: () => props.onChange(!props.checked),
      }, h("span", { className: "dshfs-switchThumb" }));
    }

    function Segmented(props) {
      const index = Math.max(0, props.options.findIndex((o) => o.value === props.value));
      return h("div", {
        className: "dshfs-segmented",
        role: "tablist",
        style: { "--dshfs-seg-count": props.options.length, "--dshfs-seg-index": index },
      },
        h("span", { className: "dshfs-segIndicator", "aria-hidden": "true" }),
        props.options.map((o) =>
          h("button", {
            key: o.value,
            type: "button",
            role: "tab",
            className: "dshfs-segTab",
            "aria-selected": o.value === props.value ? "true" : "false",
            disabled: props.disabled,
            onClick: () => props.onChange(o.value),
          }, o.label)
        )
      );
    }

    // 下拉框：DSH 菜单样式（dsh-client-ui-primitives Menu：浮层卡片、34px 行、选中项尾部打勾），
    // 取代系统原生下拉。options: [{ value, label, group?, detail?, tag?: { text, tone } }]
    // 浮层用 fixed 定位（不被卡片 overflow 裁掉），下方放不下时向上展开；支持方向键 / Enter / Esc。
    const CheckIcon = () =>
      h("svg", { className: "dshfs-menuCheck", viewBox: "0 0 16 16", width: 14, height: 14, "aria-hidden": "true" },
        h("path", { d: "M3.5 8.5 6.5 11.5 12.5 4.5", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" })
      );
    const ChevronIcon = () =>
      h("svg", { className: "dshfs-selectChevron", viewBox: "0 0 16 16", width: 14, height: 14, "aria-hidden": "true" },
        h("path", { d: "M4 6l4 4 4-4", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" })
      );
    let selectSeq = 0;

    function Select(props) {
      const { options, value, disabled } = props;
      const [open, setOpen] = react.useState(false);
      const [active, setActive] = react.useState(-1);
      const [pos, setPos] = react.useState(null);
      const triggerRef = react.useRef(null);
      const listRef = react.useRef(null);
      const idRef = react.useRef(null);
      if (idRef.current === null) idRef.current = `dshfs-select-${++selectSeq}`;
      const selectedIndex = options.findIndex((o) => o.value === value);
      const selected = options[selectedIndex];

      const place = react.useCallback(() => {
        const el = triggerRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const margin = 12;
        const below = window.innerHeight - r.bottom - margin;
        const above = r.top - margin;
        const want = Math.min(360, options.length * 34 + 40);
        const up = below < Math.min(want, 220) && above > below;
        const maxHeight = Math.max(120, Math.min(360, up ? above - 4 : below - 4));
        // 与 DSH 菜单一致：宽度跟随触发框，但不超过 440px（宽页面上不铺满整行）
        const width = Math.max(Math.min(r.width, 440), props.compact ? 200 : 0);
        const left = Math.min(r.left, window.innerWidth - width - 8);
        setPos(up ? { left, width, bottom: window.innerHeight - r.top + 4, maxHeight } : { left, width, top: r.bottom + 4, maxHeight });
      }, [options.length, props.compact]);

      const close = (refocus) => {
        setOpen(false);
        if (refocus && triggerRef.current) triggerRef.current.focus();
      };
      const openMenu = () => {
        if (disabled) return;
        place();
        setActive(selectedIndex >= 0 ? selectedIndex : 0);
        setOpen(true);
      };
      const choose = (i) => {
        const o = options[i];
        close(true);
        if (o && o.value !== value) props.onChange(o.value);
      };

      react.useEffect(() => {
        if (!open) return;
        const onPointer = (e) => {
          if (listRef.current?.contains(e.target) || triggerRef.current?.contains(e.target)) return;
          close(false);
        };
        const onScroll = (e) => {
          if (listRef.current && listRef.current.contains(e.target)) return;
          place();
        };
        document.addEventListener("pointerdown", onPointer, true);
        window.addEventListener("scroll", onScroll, true);
        window.addEventListener("resize", place);
        return () => {
          document.removeEventListener("pointerdown", onPointer, true);
          window.removeEventListener("scroll", onScroll, true);
          window.removeEventListener("resize", place);
        };
      }, [open, place]);

      // 键盘高亮的行滚动到可见
      react.useEffect(() => {
        if (!open || active < 0 || !listRef.current) return;
        const row = listRef.current.querySelector(`[data-index="${active}"]`);
        if (row && typeof row.scrollIntoView === "function") row.scrollIntoView({ block: "nearest" });
      }, [open, active]);

      const onKeyDown = (e) => {
        if (disabled) return;
        if (!open) {
          if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openMenu();
          }
          return;
        }
        if (e.key === "Escape") {
          e.preventDefault();
          close(true);
        } else if (e.key === "Tab") {
          close(false);
        } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          const step = e.key === "ArrowDown" ? 1 : -1;
          setActive((i) => (i + step + options.length) % options.length);
        } else if (e.key === "Home" || e.key === "End") {
          e.preventDefault();
          setActive(e.key === "Home" ? 0 : options.length - 1);
        } else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (active >= 0) choose(active);
        }
      };

      const items = [];
      let lastGroup;
      options.forEach((o, i) => {
        if (o.group && o.group !== lastGroup) {
          items.push(h("div", { key: `g-${o.group}`, className: "dshfs-menuLabel", role: "presentation" }, o.group));
        }
        lastGroup = o.group;
        const isSelected = i === selectedIndex;
        items.push(
          h("div", {
            key: o.value,
            id: `${idRef.current}-${i}`,
            role: "option",
            "aria-selected": isSelected ? "true" : "false",
            "data-index": i,
            className: "dshfs-menuItem" + (i === active ? " dshfs-menuItemActive" : ""),
            onPointerMove: () => setActive(i),
            onPointerDown: (e) => e.preventDefault(),
            onClick: () => choose(i),
          },
            h("span", { className: "dshfs-menuItemLabel" }, o.label),
            o.tag ? h(Tag, { tone: o.tag.tone }, o.tag.text) : null,
            o.detail ? h("span", { className: "dshfs-menuDetail" }, o.detail) : null,
            h("span", { className: "dshfs-menuCheckSlot" }, isSelected ? CheckIcon() : null)
          )
        );
      });

      return h("div", { className: "dshfs-selectWrap" + (props.compact ? " dshfs-selectCompact" : "") },
        h("button", {
          ref: triggerRef,
          type: "button",
          className: "dshfs-select" + (open ? " dshfs-selectOpen" : ""),
          disabled,
          "aria-haspopup": "listbox",
          "aria-expanded": open ? "true" : "false",
          "aria-controls": open ? `${idRef.current}-list` : undefined,
          "aria-activedescendant": open && active >= 0 ? `${idRef.current}-${active}` : undefined,
          onClick: () => (open ? close(false) : openMenu()),
          onKeyDown,
        },
          h("span", { className: "dshfs-selectValue" }, selected ? selected.label : ""),
          selected && selected.tag ? h(Tag, { tone: selected.tag.tone }, selected.tag.text) : null,
          ChevronIcon()
        ),
        open && pos
          ? h("div", {
              ref: listRef,
              id: `${idRef.current}-list`,
              role: "listbox",
              className: "dshfs-menu",
              style: { left: pos.left, width: pos.width, maxHeight: pos.maxHeight, ...(pos.top !== undefined ? { top: pos.top } : { bottom: pos.bottom }) },
            }, items)
          : null
      );
    }

    function Check(props) {
      return h("label", { className: "dshfs-check" },
        h("input", { type: "checkbox", checked: props.checked, disabled: props.disabled, onChange: (e) => props.onChange(e.target.checked) }),
        props.label
      );
    }

    function Tag(props) {
      return h("span", { className: "dshfs-tag", "data-tone": props.tone || "neutral", title: props.title }, props.children);
    }

    const ArrowIcon = (up) =>
      h("svg", { viewBox: "0 0 16 16", width: 14, height: 14, "aria-hidden": "true" },
        h("path", { d: up ? "M8 12.5V3.5M4.5 7 8 3.5 11.5 7" : "M8 3.5v9M4.5 9 8 12.5 11.5 9", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" })
      );
    const UpdateIcon = () =>
      h("svg", { className: "dshfs-updateIcon", viewBox: "0 0 16 16", width: 14, height: 14, "aria-hidden": "true" },
        h("path", { d: "M8 2.2v6.4M5.2 6.4 8 9.2l2.8-2.8M3 10.8v1.4c0 .9.7 1.6 1.6 1.6h6.8c.9 0 1.6-.7 1.6-1.6v-1.4", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" })
      );

    // 可拖动排序的列表：按住一行（鼠标 180ms / 触屏 300ms）或按下后直接拖动即可拖起，
    // 其余行让位滑动，松手提交 onMove(from, to)；靠近滚动容器边缘时自动滚动。
    // 行内的按钮 / 开关 / 链接不触发拖动；键盘用户仍可用每行的 ↑ ↓ 按钮。
    const GripIcon = () =>
      h("svg", { viewBox: "0 0 16 16", width: 14, height: 14, "aria-hidden": "true" },
        [[6, 4], [10, 4], [6, 8], [10, 8], [6, 12], [10, 12]].map(([cx, cy]) => h("circle", { key: `${cx}-${cy}`, cx, cy, r: 1.2, fill: "currentColor" }))
      );

    function scrollParentOf(el) {
      for (let node = el && el.parentElement; node; node = node.parentElement) {
        const style = getComputedStyle(node);
        if (/(auto|scroll|overlay)/.test(style.overflowY) && node.scrollHeight > node.clientHeight) return node;
      }
      return document.scrollingElement || document.documentElement;
    }

    function SortableList(props) {
      const { ids, renderRow, onMove, disabled } = props;
      const listRef = react.useRef(null);
      const press = react.useRef(null);
      const [drag, setDrag] = react.useState(null);
      const [settling, setSettling] = react.useState(false);
      const dragRef = react.useRef(null);
      dragRef.current = drag;

      const endPress = () => {
        if (press.current && press.current.timer) clearTimeout(press.current.timer);
        if (press.current && press.current.raf) cancelAnimationFrame(press.current.raf);
        press.current = null;
      };

      // 按拖动中心点落在哪些行的中线之后，算出目标位置
      const update = (clientY) => {
        const p = press.current;
        const list = listRef.current;
        if (!p || !p.started || !list) return;
        p.lastY = clientY;
        const y = clientY - list.getBoundingClientRect().top;
        const dy = y - p.startOffsetY;
        const center = p.offsets[p.from] + p.heights[p.from] / 2 + dy;
        let to = 0;
        for (let i = 0; i < p.offsets.length; i++) {
          if (i !== p.from && p.offsets[i] + p.heights[i] / 2 < center) to++;
        }
        setDrag({ from: p.from, to, dy });
      };

      const begin = () => {
        const p = press.current;
        const list = listRef.current;
        if (!p || !list) return;
        const listTop = list.getBoundingClientRect().top;
        const rows = Array.from(list.children);
        p.offsets = rows.map((r) => r.getBoundingClientRect().top - listTop);
        p.heights = rows.map((r) => r.getBoundingClientRect().height);
        p.startOffsetY = p.startY - listTop;
        p.started = true;
        p.scroller = scrollParentOf(list);
        try {
          p.el.setPointerCapture(p.pointerId);
        } catch {}
        setDrag({ from: p.from, to: p.from, dy: 0 });
        // 自动滚动：指针靠近滚动容器上下 48px 时按距离加速滚动
        const tick = () => {
          const cur = press.current;
          if (!cur || !cur.started) return;
          const sc = cur.scroller;
          const rect = sc === document.scrollingElement || sc === document.documentElement ? { top: 0, bottom: window.innerHeight } : sc.getBoundingClientRect();
          const edge = 48;
          let delta = 0;
          if (cur.lastY < rect.top + edge) delta = -Math.ceil((rect.top + edge - cur.lastY) / 4);
          else if (cur.lastY > rect.bottom - edge) delta = Math.ceil((cur.lastY - (rect.bottom - edge)) / 4);
          if (delta !== 0) {
            sc.scrollTop += delta;
            update(cur.lastY);
          }
          cur.raf = requestAnimationFrame(tick);
        };
        p.raf = requestAnimationFrame(tick);
      };

      const finish = (commit) => {
        const p = press.current;
        const d = dragRef.current;
        endPress();
        if (!p || !p.started) return;
        // 提交后这一帧关闭过渡动画，避免各行从位移状态"弹回"
        setSettling(true);
        setDrag(null);
        requestAnimationFrame(() => requestAnimationFrame(() => setSettling(false)));
        if (commit && d && d.to !== d.from) onMove(d.from, d.to);
      };

      react.useEffect(() => () => endPress(), []);

      const rowHandlers = (index) => ({
        onPointerDown: (e) => {
          if (disabled || e.button !== 0 || press.current) return;
          if (e.target.closest("button, input, a, select, [role=switch]")) return;
          const touch = e.pointerType === "touch" || e.pointerType === "pen";
          press.current = { from: index, startY: e.clientY, startX: e.clientX, lastY: e.clientY, pointerId: e.pointerId, el: e.currentTarget, touch, started: false };
          press.current.timer = setTimeout(() => {
            if (press.current && !press.current.started) begin();
          }, touch ? 300 : 180);
        },
        onPointerMove: (e) => {
          const p = press.current;
          if (!p || p.pointerId !== e.pointerId) return;
          if (!p.started) {
            const moved = Math.hypot(e.clientX - p.startX, e.clientY - p.startY);
            // 触屏：长按之前移动 = 滚动页面，放弃拖动；鼠标：按下后移动超过 4px 直接开始拖
            if (p.touch) {
              if (moved > 8) endPress();
            } else if (moved > 4) {
              begin();
            }
            if (!press.current || !press.current.started) return;
          }
          e.preventDefault();
          update(e.clientY);
        },
        onPointerUp: () => finish(true),
        onPointerCancel: () => finish(false),
        onLostPointerCapture: () => {
          if (press.current && press.current.started) finish(true);
        },
        onContextMenu: (e) => {
          if (press.current) e.preventDefault();
        },
      });

      const draggedHeight = drag && press.current ? press.current.heights[drag.from] : 0;
      return h("ol", {
        ref: listRef,
        className: "dshfs-order" + (drag ? " dshfs-orderDragging" : "") + (settling ? " dshfs-orderSettling" : ""),
      },
        ids.map((id, i) => {
          let transform;
          if (drag) {
            if (i === drag.from) transform = `translateY(${drag.dy}px)`;
            else if (drag.from < drag.to && i > drag.from && i <= drag.to) transform = `translateY(${-draggedHeight}px)`;
            else if (drag.to < drag.from && i >= drag.to && i < drag.from) transform = `translateY(${draggedHeight}px)`;
          }
          const isDragged = !!drag && i === drag.from;
          return h("li", {
            key: id,
            className: "dshfs-orderRow" + (isDragged ? " dshfs-orderRowDragged" : "") + (props.rowClass ? ` ${props.rowClass(id)}` : ""),
            style: transform ? { transform } : undefined,
            "aria-grabbed": isDragged ? "true" : undefined,
            ...rowHandlers(i),
          }, renderRow(id, drag ? (isDragged ? drag.to : i) : i));
        })
      );
    }

    // ---- 对话内图片墙（image_search / page_images 的 keyed tool.call.toolview 条目）----
    // 数据来自结果块的 block.meta（服务端 output.presentationMeta）；缩略图和大图都经宿主 /image 路由取，
    // 带 Referer 绕过防盗链。任何解析失败都退回纯文本，不会弄坏聊天行。
    let reactDom = null;
    try {
      reactDom = require("react-dom");
    } catch {}

    const imageProxyUrl = (url, ref) =>
      `${BRIDGE_PREFIX}/image?url=${encodeURIComponent(url)}${ref ? `&ref=${encodeURIComponent(ref)}` : ""}`;
    const imageDownloadUrl = (image) =>
      `${BRIDGE_PREFIX}/image-download?url=${encodeURIComponent(image.url)}&ref=${encodeURIComponent(image.pageUrl || image.sourceUrl || "")}&name=${encodeURIComponent(image.title || "image")}`;

    const WALL_COPY = {
      zh: {
        searching: "正在搜图…",
        extracting: "正在从网页提取图片…",
        images: (n) => `${n} 张`,
        pages: (n) => `${n} 个页面`,
        empty: "没有找到图片。",
        failedPage: "提取失败",
        download: "下载",
        source: "原站",
        copyLink: "复制链接",
        copyId: "复制编号",
        copied: "已复制",
        close: "关闭",
        prev: "上一张",
        next: "下一张",
        showAll: (n) => `展开全部 ${n} 张`,
        collapse: "收起",
        idHint: "让模型用 save_images 保存时可以引用这个编号",
        by: "作者",
      },
      en: {
        searching: "Searching images…",
        extracting: "Extracting images from pages…",
        images: (n) => `${n} image${n === 1 ? "" : "s"}`,
        pages: (n) => `${n} page${n === 1 ? "" : "s"}`,
        empty: "No images found.",
        failedPage: "failed",
        download: "Download",
        source: "Source",
        copyLink: "Copy link",
        copyId: "Copy id",
        copied: "Copied",
        close: "Close",
        prev: "Previous",
        next: "Next",
        showAll: (n) => `Show all ${n}`,
        collapse: "Collapse",
        idHint: "Refer to this id when asking the model to save it with save_images",
        by: "by",
      },
    };
    const PROVIDER_LABELS = { wikimedia: "Wikimedia Commons", openverse: "Openverse", pexels: "Pexels", unsplash: "Unsplash", pixabay: "Pixabay", "bing-images": "Bing 图片", page: "网页" };

    function parseArgs(raw) {
      try {
        const v = JSON.parse(raw || "{}");
        return v && typeof v === "object" ? v : {};
      } catch {
        return {};
      }
    }
    function narrowOutcome(meta) {
      if (!meta || typeof meta !== "object" || !Array.isArray(meta.images)) return null;
      const images = meta.images.filter((i) => i && typeof i.url === "string" && /^https?:\/\//i.test(i.url) && typeof i.id === "string");
      return { ...meta, images, pages: Array.isArray(meta.pages) ? meta.pages : [] };
    }
    function textOfBlock(block) {
      return (Array.isArray(block.content) ? block.content : [])
        .filter((c) => c && c.type === "text" && typeof c.text === "string")
        .map((c) => c.text.replace(/<\/?untrusted-web-content>/g, "").trim())
        .join("\n");
    }
    const sizeText = (image) => (image.width && image.height ? `${image.width} × ${image.height}` : "");

    function WallTile(props) {
      const { image, onOpen } = props;
      const [src, setSrc] = react.useState(() => imageProxyUrl(image.thumbUrl || image.url, image.pageUrl || image.sourceUrl));
      const [broken, setBroken] = react.useState(false);
      const ratio = image.width && image.height ? `${image.width} / ${image.height}` : undefined;
      return h("button", {
        type: "button",
        className: "dshfs-tile" + (broken ? " dshfs-tileBroken" : ""),
        style: ratio ? { aspectRatio: ratio } : undefined,
        title: [image.title, sizeText(image)].filter(Boolean).join(" · "),
        onClick: onOpen,
      },
        broken
          ? h("span", { className: "dshfs-tileFallback" }, image.title || image.url)
          : h("img", {
              src,
              alt: image.title || "",
              loading: "lazy",
              decoding: "async",
              referrerPolicy: "no-referrer",
              onError: () => {
                // 代理失败时直接连原图再试一次，还不行就显示标题
                const direct = image.thumbUrl || image.url;
                if (src !== direct) setSrc(direct);
                else setBroken(true);
              },
            }),
        h("span", { className: "dshfs-tileInfo" },
          image.title ? h("span", { className: "dshfs-tileTitle" }, image.title) : null,
          sizeText(image) ? h("span", { className: "dshfs-tileSize" }, sizeText(image)) : null
        )
      );
    }

    function Lightbox(props) {
      const { list, index, onIndex, onClose, copy } = props;
      const image = list[index];
      const [copied, setCopied] = react.useState("");
      react.useEffect(() => {
        const onKey = (e) => {
          if (e.key === "Escape") onClose();
          else if (e.key === "ArrowLeft") onIndex((index - 1 + list.length) % list.length);
          else if (e.key === "ArrowRight") onIndex((index + 1) % list.length);
          else return;
          e.preventDefault();
          e.stopPropagation();
        };
        window.addEventListener("keydown", onKey, true);
        return () => window.removeEventListener("keydown", onKey, true);
      }, [index, list.length, onClose, onIndex]);
      react.useEffect(() => setCopied(""), [index]);
      if (!image) return null;
      const copyText = async (text, which) => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(which);
          setTimeout(() => setCopied(""), 1500);
        } catch {}
      };
      const credit = [image.author ? `${copy.by} ${image.author}` : "", image.license || ""].filter(Boolean).join(" · ");
      const overlay = h("div", {
        className: "dshfs-lightbox",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": image.title || "image",
        onClick: (e) => {
          if (e.target === e.currentTarget) onClose();
        },
      },
        h("button", { type: "button", className: "dshfs-lbClose", "aria-label": copy.close, title: copy.close, onClick: onClose }, "×"),
        list.length > 1 ? h("button", { type: "button", className: "dshfs-lbNav dshfs-lbPrev", "aria-label": copy.prev, onClick: () => onIndex((index - 1 + list.length) % list.length) }, "‹") : null,
        list.length > 1 ? h("button", { type: "button", className: "dshfs-lbNav dshfs-lbNext", "aria-label": copy.next, onClick: () => onIndex((index + 1) % list.length) }, "›") : null,
        h("figure", { className: "dshfs-lbFigure" },
          h("img", { key: image.id, className: "dshfs-lbImage", src: imageProxyUrl(image.url, image.pageUrl || image.sourceUrl), alt: image.title || "", referrerPolicy: "no-referrer" }),
          h("figcaption", { className: "dshfs-lbCaption" },
            h("div", { className: "dshfs-lbText" },
              h("span", { className: "dshfs-lbTitle" }, image.title || image.url),
              h("span", { className: "dshfs-lbMeta" }, [sizeText(image), PROVIDER_LABELS[image.provider] || image.provider, credit, `${index + 1} / ${list.length}`].filter(Boolean).join(" · "))
            ),
            h("div", { className: "dshfs-lbActions" },
              h("a", { className: "dshfs-btn", href: imageDownloadUrl(image), download: "" }, copy.download),
              image.sourceUrl ? h("a", { className: "dshfs-btn", href: image.sourceUrl, target: "_blank", rel: "noopener noreferrer" }, copy.source) : null,
              h("button", { type: "button", className: "dshfs-btn", onClick: () => copyText(image.url, "link") }, copied === "link" ? copy.copied : copy.copyLink),
              h("button", { type: "button", className: "dshfs-btn", title: copy.idHint, onClick: () => copyText(image.id, "id") }, copied === "id" ? copy.copied : `${copy.copyId} ${image.id}`)
            )
          )
        )
      );
      // 渲染到 body，避免聊天列表里的 transform / overflow 影响全屏浮层
      return reactDom && typeof reactDom.createPortal === "function" && typeof document !== "undefined" ? reactDom.createPortal(overlay, document.body) : overlay;
    }

    function ImageWall(props) {
      const { outcome, copy } = props;
      const [open, setOpen] = react.useState(-1);
      const [expanded, setExpanded] = react.useState(false);
      const all = outcome.images;
      const limit = 12;
      const groups = outcome.kind === "pages" && outcome.pages.length > 0
        ? outcome.pages.map((page) => ({ page, images: all.filter((i) => i.pageUrl === page.pageUrl) }))
        : [{ page: null, images: all }];
      let shown = 0;
      const visibleGroups = groups.map((g) => {
        const room = expanded ? g.images.length : Math.max(0, limit - shown);
        const imgs = g.images.slice(0, room);
        shown += imgs.length;
        return { ...g, images: imgs };
      });
      const hidden = all.length - shown;
      const summary = outcome.kind === "pages"
        ? [copy.pages(outcome.pages.length), copy.images(all.length), outcome.query ? `“${outcome.query}”` : ""]
        : [PROVIDER_LABELS[outcome.provider] || outcome.provider, copy.images(all.length), outcome.query ? `“${outcome.query}”` : ""];
      return h("div", { className: "dshfs-wall" },
        h("div", { className: "dshfs-wallHead" },
          h("span", { className: "dshfs-wallSummary" }, summary.filter(Boolean).join(" · ")),
          outcome.note ? h("span", { className: "dshfs-wallNote", title: outcome.note }, outcome.note) : null
        ),
        all.length === 0 ? h("p", { className: "dshfs-hint" }, copy.empty) : null,
        visibleGroups.map((g, gi) =>
          h("section", { key: g.page ? g.page.pageUrl : `g${gi}`, className: "dshfs-wallGroup" },
            g.page
              ? h("div", { className: "dshfs-wallPage" },
                  h("a", { href: g.page.pageUrl, target: "_blank", rel: "noopener noreferrer", title: g.page.pageUrl }, g.page.pageTitle || g.page.pageUrl),
                  g.page.error ? h(Tag, { tone: "warning", title: g.page.error }, copy.failedPage) : h("span", { className: "dshfs-wallCount" }, copy.images(g.page.count ?? 0))
                )
              : null,
            g.images.length
              ? h("div", { className: "dshfs-masonry" },
                  g.images.map((image) => h(WallTile, { key: image.id, image, onOpen: () => setOpen(all.indexOf(image)) }))
                )
              : null
          )
        ),
        hidden > 0 || expanded
          ? h("button", { type: "button", className: "dshfs-textBtn dshfs-wallMore", onClick: () => setExpanded(!expanded) }, expanded ? copy.collapse : copy.showAll(all.length))
          : null,
        open >= 0 ? h(Lightbox, { list: all, index: open, onIndex: setOpen, onClose: () => setOpen(-1), copy }) : null
      );
    }

    function ImageToolView(props) {
      const copy = WALL_COPY[summaryIsEnglish() ? "en" : "zh"];
      const block = props.block || {};
      const isPages = props.toolName === "page_images";
      if (props.phase !== "result") {
        const args = parseArgs(block.argsRaw);
        const label = args.query || (Array.isArray(args.urls) ? args.urls.join(", ") : "");
        return h("div", { className: "dshfs-wall dshfs-wallLoading" },
          h("div", { className: "dshfs-wallHead" },
            h("span", { className: "dshfs-wallSummary" }, (isPages ? copy.extracting : copy.searching) + (label ? ` “${label}”` : ""))
          ),
          h("div", { className: "dshfs-skeleton" }, [0, 1, 2, 3, 4, 5].map((i) => h("span", { key: i, className: "dshfs-skeletonTile", style: { height: 90 + ((i * 37) % 70) } })))
        );
      }
      const outcome = block.isError ? null : narrowOutcome(block.meta);
      if (!outcome) {
        const text = textOfBlock(block);
        return h("div", { className: "dshfs-wall" + (block.isError ? " dshfs-wallError" : "") }, h("pre", { className: "dshfs-wallText" }, text || copy.empty));
      }
      return h(ImageWall, { outcome, copy });
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
            const hh = hex.length <= 4 ? hex.replace(/./g, (c) => c + c) : hex;
            const r = parseInt(hh.slice(0, 2), 16), g = parseInt(hh.slice(2, 4), 16), b = parseInt(hh.slice(4, 6), 16);
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
      // 搜索优先级：preferred（首选 + 回退）| list（全局列表）
      const [priorityMode, setPriorityMode] = react.useState("preferred");
      const [engineOrder, setEngineOrder] = react.useState(DEFAULT_ENGINE_ORDER);
      const [disabledEngines, setDisabledEngines] = react.useState(DEFAULT_DISABLED_ENGINES);
      const [openaiModel, setOpenaiModel] = react.useState(OPENAI_DEFAULT_MODEL);
      const [openaiBaseUrl, setOpenaiBaseUrl] = react.useState(OPENAI_DEFAULT_BASE_URL);
      // 图片搜索
      const [imageSearchOn, setImageSearchOn] = react.useState(true);
      const [pageImagesOn, setPageImagesOn] = react.useState(true);
      const [saveImagesOn, setSaveImagesOn] = react.useState(true);
      const [imageOrder, setImageOrder] = react.useState(DEFAULT_IMAGE_ORDER);
      const [disabledImages, setDisabledImages] = react.useState([]);
      const [imageMinSize, setImageMinSize] = react.useState(200);
      const [imageMaxPerPage, setImageMaxPerPage] = react.useState(30);
      const [imageIncludeSvg, setImageIncludeSvg] = react.useState(false);
      const [imageSaveDir, setImageSaveDir] = react.useState("");
      const [view, setViewState] = react.useState(readStoredView);
      // DSH 后台实际运行的插件版本（describe 返回；0.6.2 之前的版本不返回）
      const [hostVersion, setHostVersion] = react.useState(PLUGIN_VERSION);
      const setView = (next) => {
        setViewState(next);
        try {
          localStorage.setItem(VIEW_STORAGE_KEY, next);
        } catch {}
      };
      const [safeSearch, setSafeSearch] = react.useState("off");
      const [bingMarket, setBingMarket] = react.useState("zh-CN");
      // 各引擎 API key 的输入值：{ exaApiKey: "...", ... }（只存用户新输入的，已保存的值脱敏不回显）
      const [keys, setKeys] = react.useState({});
      const [platforms, setPlatforms] = react.useState(DEFAULT_PLATFORMS);
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

      // 任何表单改动：标记未保存并清掉上次的失败提示
      const touch = () => {
        setDirty(true);
        setFailed(false);
        setSaveError("");
      };
      const edit = (setter) => (value) => {
        setter(value);
        touch();
      };

      const load = react.useCallback(async () => {
        try {
          const result = await bridgeDescribe();
          const view = result.ok ? result.value.namespaces.find((n) => n.ns === NS) : undefined;
          if (!view) {
            setState({ status: "unavailable" });
            return;
          }
          const v = view.value ?? {};
          setHostVersion(typeof result.value.version === "string" ? result.value.version : "");
          setProvider(v.provider ?? "bing");
          setPriorityMode(v.priorityMode === "list" ? "list" : "preferred");
          setEngineOrder(normalizeEngineOrder(v.engineOrder));
          setDisabledEngines(normalizeDisabledEngines(v.disabledEngines));
          setOpenaiModel(typeof v.openaiModel === "string" && v.openaiModel ? v.openaiModel : OPENAI_DEFAULT_MODEL);
          setOpenaiBaseUrl(typeof v.openaiBaseUrl === "string" && v.openaiBaseUrl ? v.openaiBaseUrl : OPENAI_DEFAULT_BASE_URL);
          setImageSearchOn(v.imageSearchEnabled !== false);
          setPageImagesOn(v.pageImagesEnabled !== false);
          setSaveImagesOn(v.saveImagesEnabled !== false);
          setImageOrder(normalizeImageOrder(v.imageProviderOrder));
          setDisabledImages(Array.isArray(v.disabledImageProviders) ? v.disabledImageProviders : []);
          setImageMinSize(Number.isFinite(Number(v.imageMinSize)) ? Number(v.imageMinSize) : 200);
          setImageMaxPerPage(Number.isFinite(Number(v.imageMaxPerPage)) ? Number(v.imageMaxPerPage) : 30);
          setImageIncludeSvg(v.imageIncludeSvg === true);
          setImageSaveDir(typeof v.imageSaveDir === "string" ? v.imageSaveDir : "");
          setSafeSearch(v.safeSearch === "strict" || v.safeSearch === "moderate" ? v.safeSearch : "off");
          setBingMarket(v.bingMarket === undefined ? "zh-CN" : v.bingMarket);
          setLang(v.lang === "en" ? "en" : "zh");
          const loadedKeys = {};
          for (const id of KEY_IDS) loadedKeys[`${id}ApiKey`] = v[`${id}ApiKey`] ?? "";
          setKeys(loadedKeys);
          setPlatforms(Array.isArray(v.platforms) && v.platforms.length > 0 ? v.platforms : DEFAULT_PLATFORMS);
          setCacheTtl(clampCacheTtl(v.cacheTtl));
          setProxyMode(v.proxyMode === "system" || v.proxyMode === "custom" ? v.proxyMode : "off");
          setProxyUrl(typeof v.proxyUrl === "string" ? v.proxyUrl : "");
          setProxyEngines(Array.isArray(v.proxyEngines) ? v.proxyEngines : ["ddg", "ddg-lite"]);
          // secrets 字段标记哪些 key 已配置（值被脱敏，仅显示"已配置"）
          const configured = {};
          for (const secret of view.secrets ?? []) {
            const path = secret.path.join(".");
            if (secret.set && path.endsWith("ApiKey")) configured[path.slice(0, -"ApiKey".length)] = true;
          }
          setKeysConfigured(configured);
          // key 存储位置（默认凭据中心）
          setKeyStorage(v.keyStorage === "settings" ? "settings" : "credentials");
          setState({ status: "ready", writable: result.value.writable });
          // 查询凭据中心里各 key 的配置状态与来源
          try {
            const cred = await bridgeCredentialsStatus();
            if (cred.ok) {
              const cc = {};
              const srcs = {};
              const idOf = (field) => (field.endsWith("ApiKey") ? field.slice(0, -"ApiKey".length) : null);
              for (const [k, val] of Object.entries(cred.value.configured ?? {})) {
                if (KEY_IDS.includes(idOf(k))) cc[idOf(k)] = val;
              }
              for (const [k, info] of Object.entries(cred.value.sources ?? {})) {
                if (KEY_IDS.includes(idOf(k))) srcs[idOf(k)] = info;
              }
              setCredConfigured(cc);
              setCredSources(srcs);
            }
          } catch {}
        } catch {
          setState({ status: "unavailable" });
        }
      }, []);

      react.useEffect(() => {
        load();
      }, [load]);

      const save = async () => {
        setSaving(true);
        setFailed(false);
        setSaveError("");
        const errors = [];
        try {
          // key 存储分流：凭据中心（默认）走 credentials-set；设置页走 settings mutate（兼容）
          const keyFields = KEY_IDS.map((id) => [`${id}ApiKey`, keys[`${id}ApiKey`] ?? ""]);
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
          const ops = [
            { op: "set", path: ["provider"], value: provider },
            { op: "set", path: ["priorityMode"], value: priorityMode },
            { op: "set", path: ["engineOrder"], value: engineOrder },
            { op: "set", path: ["disabledEngines"], value: disabledEngines },
            { op: "set", path: ["openaiModel"], value: openaiModel.trim() || OPENAI_DEFAULT_MODEL },
            { op: "set", path: ["openaiBaseUrl"], value: openaiBaseUrl.trim() || OPENAI_DEFAULT_BASE_URL },
            { op: "set", path: ["imageSearchEnabled"], value: imageSearchOn },
            { op: "set", path: ["pageImagesEnabled"], value: pageImagesOn },
            { op: "set", path: ["saveImagesEnabled"], value: saveImagesOn },
            { op: "set", path: ["imageProviderOrder"], value: imageOrder },
            { op: "set", path: ["disabledImageProviders"], value: disabledImages },
            { op: "set", path: ["imageMinSize"], value: Math.min(Math.max(Math.round(Number(imageMinSize) || 0), 0), 4000) },
            { op: "set", path: ["imageMaxPerPage"], value: Math.min(Math.max(Math.round(Number(imageMaxPerPage) || 30), 1), 60) },
            { op: "set", path: ["imageIncludeSvg"], value: imageIncludeSvg },
            { op: "set", path: ["imageSaveDir"], value: imageSaveDir.trim() },
            { op: "set", path: ["lang"], value: lang },
            { op: "set", path: ["keyStorage"], value: keyStorage },
            { op: "set", path: ["safeSearch"], value: safeSearch },
            { op: "set", path: ["bingMarket"], value: bingMarket },
          ];
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
            setFailed(false);
            setSaveError("");
            load();
          } else {
            // 旧后台不认识新字段时 DSH 报 "is not volatile"：换成能看懂的原因
            const detail = errors.some((e) => /is not volatile/.test(e)) ? t.staleSaveError : errors.join("; ");
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

      const lead = leadEngine(priorityMode, provider, engineOrder, disabledEngines);

      const runTest = async () => {
        setTesting(true);
        setTestResult(null);
        setFailed(false);
        setSaveError("");
        try {
          const result = await bridgeRawSearch({ query: "DeepSeek Harness", maxResults: 2, engine: lead });
          if (result.ok) {
            const sources = result.value.sources ?? [];
            setTestResult({
              ok: true,
              count: sources.length,
              engine: result.value.provider ?? lead,
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
          setUpdateInfo(result.ok ? { ok: true, ...result.value } : { ok: false });
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
      const busy = !ready || saving;
      const t = tt(lang);
      const engineById = (id) => (id === "auto" ? AUTO_ENGINE : ENGINES.find((e) => e.id === id) ?? ENGINES[0]);
      const leadInfo = engineById(lead);
      const badgeTone = (engine) => (engine.badge === "FREE" ? "success" : engine.badge === "AUTO" ? "info" : "warning");

      // ---- 优先级 / 启用状态的改动 ----
      const setEngineEnabled = (id, enabled) => {
        setDisabledEngines((prev) => (enabled ? prev.filter((x) => x !== id) : prev.includes(id) ? prev : [...prev, id]));
        // 关掉的是当前首选：首选退回 Bing，免得"关了还在用"
        if (!enabled && provider === id) setProvider("bing");
        touch();
      };
      // 首选模式下首选引擎总是第一个尝试，不出现在回退列表里；上下移动只和列表里可见的相邻项交换
      const visibleOrder = priorityMode === "preferred" ? engineOrder.filter((id) => id !== provider) : engineOrder;
      // 在可见列表里把 from 移到 to，再合并回完整顺序（首选模式下隐藏的首选引擎保持原位置）
      const moveVisible = (from, to) => {
        if (from === to || from < 0 || to < 0 || from >= visibleOrder.length || to >= visibleOrder.length) return;
        const vis = visibleOrder.slice();
        const [moved] = vis.splice(from, 1);
        vis.splice(to, 0, moved);
        setEngineOrder((prev) => {
          const queue = vis.slice();
          return prev.map((id) => (vis.includes(id) ? queue.shift() : id));
        });
        touch();
      };
      const moveEngine = (id, delta) => {
        const k = visibleOrder.indexOf(id);
        moveVisible(k, k + delta);
      };
      const choosePreferred = (id) => {
        setProvider(id);
        // 选为首选即视为启用（openai 默认关闭，选它时一并打开）
        setDisabledEngines((prev) => prev.filter((x) => x !== id));
        touch();
      };
      const isDefaultPriority =
        provider === "bing" && priorityMode === "preferred" && sameList(engineOrder, DEFAULT_ENGINE_ORDER) && sameList([...disabledEngines].sort(), [...DEFAULT_DISABLED_ENGINES].sort());
      const resetPriority = () => {
        setProvider("bing");
        setPriorityMode("preferred");
        setEngineOrder(DEFAULT_ENGINE_ORDER);
        setDisabledEngines(DEFAULT_DISABLED_ENGINES);
        touch();
      };
      const openaiOn = !disabledEngines.includes("openai");
      // 引擎 id → key 字段 id（KEY_IDS 用的名字）
      const keyIdOf = (id) => (id === "deepseek-official" ? "deepseek" : id === "you" ? "youcom" : id);
      const keyReady = (id) => !!(keysConfigured[keyIdOf(id)] || credConfigured[keyIdOf(id)]);
      // 首选引擎下拉：智能路由 / 免费 / 需要 API Key / 模型搜索 分组；需 key 的引擎标出 key 是否已配置
      const preferredOptions = [
        { value: "auto", label: AUTO_ENGINE.label, group: t.groupSmart, detail: t.autoDetail },
        ...ENGINES.filter((e) => e.badge === "FREE").map((e) => ({ value: e.id, label: e.label, group: t.groupFree })),
        ...ENGINES.filter((e) => e.badge !== "FREE" && e.id !== "openai").map((e) => ({
          value: e.id,
          label: e.label,
          group: t.groupKey,
          detail: keyReady(e.id) ? t.keyReadyDetail : t.keyMissingDetail,
        })),
        { value: "openai", label: engineById("openai").label, group: t.groupModel, detail: keyReady("openai") ? t.keyReadyDetail : t.keyMissingDetail },
      ];

      // ---- API key 输入框 ----
      const keyRow = (id) => {
        const meta = KEY_META[id];
        const info = credSources[id];
        const envLocked = isEnvSource(info);
        const configured = !!(keysConfigured[id] || credConfigured[id]);
        let placeholder = t[`${id}Ph`] ? t[`${id}Ph`](configured) : meta.label;
        if (info && info.source === "env") placeholder = t.keyFromEnv(meta.label, meta.env);
        else if (info && (info.source === "user-env" || info.source === "project-env")) placeholder = t.keyFromEnvFile(meta.label, meta.env);
        else if (info && info.source === "file") placeholder = t.keyFromCred(meta.label);
        const field = `${id}ApiKey`;
        return h("div", { key: id, className: "dshfs-keyRow" },
          h("div", { className: "dshfs-keyName" },
            h("span", null, meta.label),
            info ? h(Tag, { tone: envLocked ? "warning" : "success" }, sourceLabel(lang, info.source)) : configured ? h(Tag, { tone: "success" }, t.keyConfigured) : null
          ),
          h("input", {
            className: "dshfs-input",
            type: "password",
            autoComplete: "off",
            spellCheck: false,
            placeholder,
            title: envLocked ? placeholder : meta.env,
            value: envLocked ? "" : keys[field] ?? "",
            disabled: busy || envLocked,
            onChange: (e) => {
              const value = e.target.value;
              setKeys((prev) => ({ ...prev, [field]: value }));
              touch();
            },
          })
        );
      };

      // ---- 引擎顺序列表 ----
      const orderList = h(SortableList, {
        ids: visibleOrder,
        disabled: busy,
        onMove: moveVisible,
        rowClass: (id) => (disabledEngines.includes(id) ? "dshfs-orderOff" : ""),
        renderRow: (id, i) => {
          const engine = engineById(id);
          const enabled = !disabledEngines.includes(id);
          return [
            h("span", { key: "grip", className: "dshfs-orderGrip", title: t.dragHint }, GripIcon()),
            h("span", { key: "idx", className: "dshfs-orderIndex" }, String(i + 1)),
            h("span", { key: "name", className: "dshfs-orderName" },
              h("span", { className: "dshfs-orderLabel" }, engine.label),
              h(Tag, { tone: badgeTone(engine) }, engine.badge),
              id === "openai" ? h(Tag, { tone: "outline" }, t.modelTag) : null,
              engine.badge !== "FREE" && !keyReady(id) ? h("span", { className: "dshfs-orderNote" }, t.keyMissingDetail) : null
            ),
            h("span", { key: "act", className: "dshfs-orderActions" },
              h("button", { type: "button", className: "dshfs-iconBtn", title: t.moveUp, "aria-label": t.moveUp, disabled: busy || i === 0, onClick: () => moveEngine(id, -1) }, ArrowIcon(true)),
              h("button", { type: "button", className: "dshfs-iconBtn", title: t.moveDown, "aria-label": t.moveDown, disabled: busy || i === visibleOrder.length - 1, onClick: () => moveEngine(id, 1) }, ArrowIcon(false)),
              h(Switch, { checked: enabled, label: engine.label, disabled: busy, onChange: (on) => setEngineEnabled(id, on) })
            ),
          ];
        },
      });

      const header = h("button", {
        type: "button",
        className: "dshfs-header",
        "aria-expanded": pageMode ? void 0 : open,
        onClick: pageMode ? void 0 : () => setOpen(!open),
      },
        h("span", { className: "dshfs-headText" },
          h("span", { className: "dshfs-name" }, "Free Search"),
          h("span", { className: "dshfs-description" }, t.description)
        ),
        h(Tag, { tone: badgeTone(leadInfo), title: leadInfo.label }, leadInfo.label),
        dirty ? h("span", { className: "dshfs-pending" }, t.unsaved) : null,
        h("span", {
          role: "button",
          tabIndex: 0,
          className: "dshfs-langToggle",
          onClick: (e) => {
            e.stopPropagation();
            setLang((prev) => (prev === "en" ? "zh" : "en"));
            touch();
          },
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              setLang((prev) => (prev === "en" ? "zh" : "en"));
              touch();
            }
          },
        }, t.toggleLang),
        pageMode ? null : h("span", { className: open ? "dshfs-chevron dshfs-chevronOpen" : "dshfs-chevron" }, "▾")
      );

      const updateControls = [
        h("span", { key: "v", className: "dshfs-version" }, "v" + PLUGIN_VERSION),
        updateInfo && updateInfo.ok && updateInfo.hasUpdate && !updateInfo.installable
          ? h("a", { key: "u", className: "dshfs-updatePill", href: updateInfo.updateUrl, target: "_blank", rel: "noopener noreferrer", title: t.updateAvailable(updateInfo.current, updateInfo.latest) }, UpdateIcon(), t.hasUpdate)
          : h("button", {
              key: "u",
              className: "dshfs-updatePill",
              type: "button",
              title: updateInfo && updateInfo.ok && updateInfo.hasUpdate ? t.updateAvailable(updateInfo.current, updateInfo.latest) : undefined,
              onClick: updateInfo && updateInfo.ok && updateInfo.hasUpdate ? runUpdate : runCheckUpdate,
              disabled: upgrading || checkingUpdate || busy,
            },
              UpdateIcon(),
              upgrading ? t.upgrading : checkingUpdate ? t.checkingUpdate : updateInfo && updateInfo.ok && updateInfo.hasUpdate ? t.hasUpdate : t.checkUpdate
            ),
        updateInfo && updateInfo.ok
          ? updateInfo.upgraded
            ? h("span", { key: "s", className: "dshfs-note dshfs-noteOk" }, updateInfo.reloaded ? t.upgradeDoneReload(updateInfo.latest) : t.upgradeDone(updateInfo.latest))
            : updateInfo.hasUpdate
              ? updateInfo.installable ? null : h("span", { key: "s", className: "dshfs-version" }, t.upgradeLinkMode)
              : h("span", { key: "s", className: "dshfs-note dshfs-noteOk" }, t.updateLatest(updateInfo.current))
          : updateInfo && !updateInfo.ok
            ? h("span", { key: "s", className: "dshfs-note dshfs-noteError" }, updateInfo.upgradeFailed ? t.upgradeFailed(updateInfo.upgradeFailed) : t.updateCheckFailed)
            : null,
      ];

      const body = h("div", { className: "dshfs-body" },
        !ready ? h("p", { className: "dshfs-banner" }, t.unavailable) : null,
        // 界面已是新版、后台还在跑旧版（升级后没有重启 DSH）：新设置存不进去，新工具也没加载
        ready && hostVersion !== PLUGIN_VERSION ? h("p", { className: "dshfs-banner" }, t.hostStale(hostVersion, PLUGIN_VERSION)) : null,
        h("div", { className: "dshfs-viewSwitch" },
          h(Segmented, {
            value: view,
            onChange: setView,
            options: [
              { value: "web", label: t.viewWeb },
              { value: "images", label: t.viewImages },
            ],
          })
        ),

        view === "web" && h(Section, { title: t.secEngines },
          h(Field, { label: t.priorityMode, hint: priorityMode === "list" ? t.modeListHint : t.modePreferredHint },
            h(Segmented, {
              value: priorityMode,
              disabled: busy,
              onChange: edit(setPriorityMode),
              options: [
                { value: "preferred", label: t.modePreferred },
                { value: "list", label: t.modeList },
              ],
            })
          ),
          priorityMode === "preferred"
            ? h(Field, { label: t.preferredEngine, hint: provider === "auto" ? t.autoHint : t.engineHint },
                h("div", { className: "dshfs-inline" },
                  h(Select, {
                    value: provider,
                    colorScheme: selectColorScheme,
                    disabled: busy,
                    onChange: choosePreferred,
                    options: preferredOptions,
                  }),
                  engineById(provider).link
                    ? h("a", { className: "dshfs-link", href: engineById(provider).link, target: "_blank", rel: "noopener noreferrer" }, engineById(provider).badge === "FREE" ? t.visit : t.getKey)
                    : null
                )
              )
            : null,
          h(Field, {
            label: priorityMode === "list" ? t.searchOrder : t.fallbackOrder,
            control: h("button", { type: "button", className: "dshfs-textBtn", disabled: busy || isDefaultPriority, onClick: resetPriority }, t.resetDefault),
            hint: t.orderHint,
          }, orderList)
        ),

        view === "web" && h(Section, { title: t.secModelSearch, aside: h(Tag, { tone: "warning" }, t.paidTag) },
          h(Field, {
            label: t.modelSearchEnable,
            control: h(Switch, { checked: openaiOn, label: t.modelSearchEnable, disabled: busy, onChange: (on) => setEngineEnabled("openai", on) }),
            hint: t.modelSearchHint,
          }),
          openaiOn
            ? [
                h(Field, { key: "model", label: t.openaiModel, hint: t.openaiModelHint },
                  h("input", { className: "dshfs-input", type: "text", spellCheck: false, placeholder: OPENAI_DEFAULT_MODEL, value: openaiModel, disabled: busy, onChange: (e) => edit(setOpenaiModel)(e.target.value) })
                ),
                h(Field, { key: "base", label: t.openaiBaseUrl, hint: t.openaiBaseUrlHint },
                  h("input", { className: "dshfs-input", type: "text", spellCheck: false, placeholder: OPENAI_DEFAULT_BASE_URL, value: openaiBaseUrl, disabled: busy, onChange: (e) => edit(setOpenaiBaseUrl)(e.target.value) })
                ),
                h(Field, { key: "key", label: t.openaiKey, hint: t.openaiKeyHint }, keyRow("openai")),
              ]
            : null
        ),

        view === "images" && h(Section, { title: t.secImages },
          h(Field, { label: t.imgSearchOn, control: h(Switch, { checked: imageSearchOn, label: t.imgSearchOn, disabled: busy, onChange: edit(setImageSearchOn) }), hint: t.imgSearchHint }),
          imageSearchOn
            ? h(Field, { label: t.imageOrder, hint: t.imageOrderHint },
                h(SortableList, {
                  ids: imageOrder,
                  disabled: busy,
                  onMove: (from, to) => {
                    setImageOrder((prev) => {
                      const next = prev.slice();
                      const [moved] = next.splice(from, 1);
                      next.splice(to, 0, moved);
                      return next;
                    });
                    touch();
                  },
                  rowClass: (id) => (disabledImages.includes(id) ? "dshfs-orderOff" : ""),
                  renderRow: (id, i) => {
                    const src = IMAGE_SOURCES.find((x) => x.id === id);
                    const on = !disabledImages.includes(id);
                    const move = (delta) => {
                      const j = i + delta;
                      if (j < 0 || j >= imageOrder.length) return;
                      setImageOrder((prev) => {
                        const next = prev.slice();
                        [next[i], next[j]] = [next[j], next[i]];
                        return next;
                      });
                      touch();
                    };
                    return [
                      h("span", { key: "grip", className: "dshfs-orderGrip", title: t.dragHint }, GripIcon()),
                      h("span", { key: "idx", className: "dshfs-orderIndex" }, String(i + 1)),
                      h("span", { key: "name", className: "dshfs-orderName" },
                        h("span", { className: "dshfs-orderLabel" }, src.label),
                        h(Tag, { tone: src.badge === "FREE" ? "success" : "warning" }, src.badge),
                        id === "bing-images" ? h(Tag, { tone: "outline" }, t.webImageTag) : null,
                        src.badge !== "FREE" && !keyReady(id) ? h("span", { className: "dshfs-orderNote" }, t.keyMissingDetail) : null
                      ),
                      h("span", { key: "act", className: "dshfs-orderActions" },
                        h("button", { type: "button", className: "dshfs-iconBtn", title: t.moveUp, "aria-label": t.moveUp, disabled: busy || i === 0, onClick: () => move(-1) }, ArrowIcon(true)),
                        h("button", { type: "button", className: "dshfs-iconBtn", title: t.moveDown, "aria-label": t.moveDown, disabled: busy || i === imageOrder.length - 1, onClick: () => move(1) }, ArrowIcon(false)),
                        h(Switch, {
                          checked: on,
                          label: src.label,
                          disabled: busy,
                          onChange: (value) => {
                            setDisabledImages((prev) => (value ? prev.filter((x) => x !== id) : [...prev.filter((x) => x !== id), id]));
                            touch();
                          },
                        })
                      ),
                    ];
                  },
                })
              )
            : null,
          h(Field, { label: t.pageImagesOn, control: h(Switch, { checked: pageImagesOn, label: t.pageImagesOn, disabled: busy, onChange: edit(setPageImagesOn) }), hint: t.pageImagesHint }),
          pageImagesOn
            ? h(Field, { label: t.imageMinSize, hint: t.imageMinSizeHint },
                h("div", { className: "dshfs-inline" },
                  h("input", { className: "dshfs-input dshfs-ttl", type: "number", min: 0, max: 4000, step: 50, value: imageMinSize, disabled: busy, onChange: (e) => edit(setImageMinSize)(e.target.value) }),
                  h("span", { className: "dshfs-inlineLabel" }, t.imageMaxPerPage),
                  h("input", { className: "dshfs-input dshfs-ttl", type: "number", min: 1, max: 60, step: 1, value: imageMaxPerPage, disabled: busy, onChange: (e) => edit(setImageMaxPerPage)(e.target.value) }),
                  h(Check, { label: t.imageIncludeSvg, checked: imageIncludeSvg, disabled: busy, onChange: edit(setImageIncludeSvg) })
                )
              )
            : null,
          h(Field, { label: t.saveImagesOn, control: h(Switch, { checked: saveImagesOn, label: t.saveImagesOn, disabled: busy, onChange: edit(setSaveImagesOn) }), hint: t.saveImagesHint }),
          saveImagesOn
            ? h(Field, { label: t.imageSaveDir, hint: t.imageSaveDirHint },
                h("input", { className: "dshfs-input", type: "text", spellCheck: false, placeholder: t.imageSaveDirPh, value: imageSaveDir, disabled: busy, onChange: (e) => edit(setImageSaveDir)(e.target.value) })
              )
            : null
        ),

        view === "web" && h(Section, { title: t.secResults },
          h(Field, { label: t.safeSearchLabel, hint: t.safeSearchHint },
            h(Select, {
              value: safeSearch,
              colorScheme: selectColorScheme,
              disabled: busy,
              onChange: edit(setSafeSearch),
              options: [
                { value: "off", label: t.safeSearchOff },
                { value: "moderate", label: t.safeSearchModerate },
                { value: "strict", label: t.safeSearchStrict },
              ],
            })
          ),
          h(Field, { label: t.bingMarketLabel, hint: t.bingMarketHint },
            h(Select, {
              value: bingMarket,
              colorScheme: selectColorScheme,
              disabled: busy,
              onChange: edit(setBingMarket),
              options: [
                ["zh-CN", t.marketZhCN], ["zh-TW", t.marketZhTW], ["en-US", t.marketEnUS], ["en-GB", t.marketEnGB], ["ru-RU", t.marketRuRU],
                ["ja-JP", t.marketJaJP], ["de-DE", t.marketDeDE], ["fr-FR", t.marketFrFR], ["es-ES", t.marketEsES], ["ko-KR", t.marketKoKR],
              ].map(([value, label]) => ({ value, label })),
            })
          ),
          h(Field, { label: t.cacheTtl, hint: t.cacheTtlHint },
            h("input", {
              className: "dshfs-input dshfs-ttl",
              type: "number",
              min: 0,
              max: 5,
              step: 1,
              value: cacheTtl,
              disabled: busy,
              onChange: (e) => edit(setCacheTtl)(Number(e.target.value)),
            })
          )
        ),

        h(Section, { title: t.apiKeys },
          h(Field, { hint: t.keysHint },
            h("div", { className: "dshfs-keys" }, KEY_IDS.filter((id) => id !== "openai" && (view === "images") === IMAGE_KEY_IDS.includes(id)).map(keyRow))
          ),
          h(Field, {
            label: t.keyStorage,
            control: h(Select, {
              compact: true,
              value: keyStorage,
              colorScheme: selectColorScheme,
              disabled: busy,
              onChange: edit(setKeyStorage),
              options: [
                { value: "credentials", label: t.keyStorageCred },
                { value: "settings", label: t.keyStorageSettings },
              ],
            }),
            hint: keyStorage === "credentials" ? t.keyStorageCredHint(credConfigured, credSources) : t.keyStorageSettingsHint,
          })
        ),

        view === "web" && h(Section, { title: t.platformSearch },
          h(Field, { hint: t.platformHint },
            h("div", { className: "dshfs-checks" },
              PLATFORM_LABELS.map(([id, label]) =>
                h(Check, {
                  key: id,
                  label,
                  checked: platforms.includes(id),
                  disabled: busy,
                  onChange: (checked) => {
                    setPlatforms((prev) => (checked ? [...prev.filter((p) => p !== id), id] : prev.filter((p) => p !== id)));
                    touch();
                  },
                })
              )
            )
          )
        ),

        h(Section, { title: t.proxy },
          h(Field, {
            label: t.proxyModeLabel,
            hint: proxyMode === "system" && systemProxy
              ? systemProxy.loading
                ? t.proxyDetecting
                : systemProxy.system && systemProxy.system.error
                  ? t.proxyDetectError(systemProxy.system.error)
                  : systemProxy.system
                    ? t.proxyDetected(systemProxy.system.url, systemProxy.system.source)
                    : t.proxyNotFound
              : null,
          },
            h(Select, {
              value: proxyMode,
              colorScheme: selectColorScheme,
              disabled: busy,
              onChange: edit(setProxyMode),
              options: [
                { value: "off", label: t.proxyOff },
                { value: "system", label: t.proxySystem },
                { value: "custom", label: t.proxyCustom },
              ],
            }),
            proxyMode === "custom"
              ? h("input", { className: "dshfs-input", type: "text", spellCheck: false, placeholder: t.proxyUrlPlaceholder, value: proxyUrl, disabled: busy, onChange: (e) => edit(setProxyUrl)(e.target.value) })
              : null
          ),
          proxyMode !== "off"
            ? h(Field, { label: t.proxyEngines, hint: t.proxyHint },
                h("div", { className: "dshfs-checks" },
                  [...ENGINES, ...IMAGE_PROXY_ENTRIES.filter((e) => !ENGINES.some((x) => x.id === e.id))].map((engine) =>
                    h(Check, {
                      key: engine.id,
                      label: engine.label,
                      checked: proxyEngines.includes(engine.id),
                      disabled: busy,
                      onChange: (checked) => {
                        setProxyEngines((prev) => (checked ? [...prev.filter((id) => id !== engine.id), engine.id] : prev.filter((id) => id !== engine.id)));
                        touch();
                      },
                    })
                  )
                )
              )
            : null
        ),

        failed || testResult
          ? h("div", { className: "dshfs-results" },
              failed ? h("p", { className: "dshfs-note dshfs-noteError" }, saveError ? t.saveFailedDetail(saveError) : t.saveFailed) : null,
              testResult ? h("p", { className: testResult.ok ? "dshfs-note dshfs-noteOk" : "dshfs-note dshfs-noteError" }, testResult.ok ? t.testOk(testResult) : t.testFail(testResult.error)) : null
            )
          : null,

        h("div", { className: "dshfs-footer" },
          h("div", { className: "dshfs-footerLeft" }, updateControls),
          h("div", { className: "dshfs-footerRight" },
            h("button", { className: "dshfs-btn", type: "button", onClick: runTest, disabled: testing || busy, title: t.testEngineHint(leadInfo.label) }, testing ? t.testing : t.testEngine),
            h("button", { className: "dshfs-btn", type: "button", onClick: discard, disabled: saving || !dirty }, t.discard),
            h("button", { className: "dshfs-btn dshfs-save", type: "button", onClick: save, disabled: saving || !dirty || !ready }, saving ? t.saving : t.save)
          )
        )
      );

      return h("li", { className: "dshfs-card" + (open ? " dshfs-cardOpen" : "") + (pageMode ? " dshfs-pageMode" : "") },
        header,
        open ? body : null
      );
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
      // 搜图结果在对话里渲染成图片墙：tool.call.toolview 的 keyed 条目（写法参考 dsh-refpics）
      for (const toolName of ["image_search", "page_images"]) {
        ctx.slots.inject("tool.call.toolview", () =>
          ctx.slots.register(
            { name: "tool.call.toolview", key: toolName, priority: 0, registrant: PACKAGE_NAME },
            ImageToolView
          )
        );
      }
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
                const v = view?.value ?? {};
                const current = leadEngine(v.priorityMode, v.provider ?? "bing", normalizeEngineOrder(v.engineOrder), normalizeDisabledEngines(v.disabledEngines));
                return (v.priorityMode === "list" ? ENGINES : [AUTO_ENGINE, ...ENGINES]).map((e) => ({
                  id: e.id,
                  label: `${e.label}${e.badge === "FREE" ? " · 免费" : e.badge === "AUTO" ? "" : " · API Key"}`,
                  detail: e.id === current ? (v.lang === "en" ? "current" : "当前") : undefined,
                  active: e.id === current,
                }));
              },
              // 首选模式：设为首选；列表模式：移到列表最前。两种模式都顺带启用该引擎
              onSelect: async (option) => {
                const result = await bridgeDescribe();
                const view = result.ok ? result.value.namespaces.find((n) => n.ns === NS) : undefined;
                const v = view?.value ?? {};
                const disabled = normalizeDisabledEngines(v.disabledEngines).filter((id) => id !== option.id);
                const ops = [{ op: "set", path: ["disabledEngines"], value: disabled }];
                if (v.priorityMode === "list") {
                  const order = normalizeEngineOrder(v.engineOrder).filter((id) => id !== option.id);
                  ops.push({ op: "set", path: ["engineOrder"], value: [option.id, ...order] });
                } else {
                  ops.push({ op: "set", path: ["provider"], value: option.id });
                }
                await bridgeMutate({ ns: NS, ops });
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
