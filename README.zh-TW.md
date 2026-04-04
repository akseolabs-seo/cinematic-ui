# Cinematic UI

<p align="center">
  <img src="./docs/banner.svg" alt="Cinematic UI Banner" width="100%" />
</p>

<p align="center">
  <strong>把導演與電影研究，轉成高端網站的節奏、空間、燈光與主構圖。</strong>
</p>

<p align="center">
  <a href="./README.md">English</a> ·
  <a href="./README.zh-CN.md">简体中文</a> ·
  <a href="./README.ja.md">日本語</a> ·
  <a href="./README.es.md">Español</a> ·
  <a href="./README.fr.md">Français</a> ·
  <a href="./README.de.md">Deutsch</a> ·
  <a href="./README.ko.md">한국어</a> ·
  <a href="./README.pt.md">Português</a> ·
  <a href="./README.vi.md">Tiếng Việt</a>
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-cb9b6b?style=for-the-badge&labelColor=17120f" alt="MIT License"></a>
  <a href="./AGENTS.md"><img src="https://img.shields.io/badge/AGENTS-Compatible-b78757?style=for-the-badge&labelColor=17120f" alt="AGENTS Compatible"></a>
  <a href="./CLAUDE.md"><img src="https://img.shields.io/badge/Claude%20Code-Primary-a9784b?style=for-the-badge&labelColor=17120f" alt="Claude Code Primary"></a>
  <a href="./CODEX.md"><img src="https://img.shields.io/badge/Codex%20%2F%20ChatGPT-Ready-9b8a6e?style=for-the-badge&labelColor=17120f" alt="Codex and ChatGPT Ready"></a>
  <a href="./GEMINI.md"><img src="https://img.shields.io/badge/Gemini%20%2F%20Antigravity-Ready-9b6d42?style=for-the-badge&labelColor=17120f" alt="Gemini and Antigravity Ready"></a>
  <a href="./.github/copilot-instructions.md"><img src="https://img.shields.io/badge/GitHub%20Copilot-Ready-8b623d?style=for-the-badge&labelColor=17120f" alt="GitHub Copilot Ready"></a>
  <a href="./.cursor/rules/cinematic-ui.mdc"><img src="https://img.shields.io/badge/Cursor-Ready-7a5c3a?style=for-the-badge&labelColor=17120f" alt="Cursor Ready"></a>
  <a href="./.windsurf/rules/cinematic-ui.md"><img src="https://img.shields.io/badge/Windsurf-Ready-6b5235?style=for-the-badge&labelColor=17120f" alt="Windsurf Ready"></a>
</p>

<p align="center">
  <a href="https://www.threads.com/@darkseoking"><img src="https://img.shields.io/badge/Follow%20on%20Threads-%40darkseoking-f1e2cf?style=for-the-badge&logo=threads&logoColor=111111&labelColor=f1e2cf" alt="Follow @darkseoking on Threads"></a>
  <a href="https://xhslink.com/m/3fZJnT4jDHe"><img src="https://img.shields.io/badge/Follow%20on%20RED-%40AK-ff2442?style=for-the-badge&labelColor=ff2442&logoColor=ffffff" alt="Follow @AK on 小紅書"></a>
</p>

---

## 為什麼跟別人不一樣

大多數 AI 設計 skill，本質上是**查找表**。

它們給 AI 一個資料庫——67 種風格、161 種配色方案、50 種元件模式——然後讓 AI 從菜單上挑選。結果技術上乾淨，偶爾精緻，但可靠地令人遺忘。AI 不是在思考，它是在購物。

**Cinematic UI 是思考框架，不是素材庫。**

這個 skill 不是遞給 AI 一份菜單，而是強迫它用真實電影導演的方式工作：

1. 研究特定導演與特定電影——燈光邏輯、構圖紀律、場景節奏、材質感
2. 提取那部電影的視覺語言在結構層面上為何有效
3. 為網站發展一個原創視覺主題：這個頁面是什麼類型的場景？哪個構圖在這裡是不可替代的？
4. 用電影語言來為每一個版型決策做出辯護
5. 最後才進入 CSS、動態效果與實作的規格化

輸出的差異，不是程度上的差別，而是類別上的不同。

查找表產出的是「看起來像網站」的網站。導演工作流產出的是「感覺像某個有觀點的人做的」網站。

> AI 不是從貨架上挑商品的店員。
> AI 是導演。電影是創作簡報。網站是這部作品的製作。

---

## 這是什麼

`cinematic-layout` 不是單純的「高級網站 prompt」，也不是只給某個工具用的 skill。

它是一套**跨工具可用的電影語言網站工作流**，核心邏輯：

1. 先選定 **導演 + 具體電影**
2. 若環境可上網，先研究導演與電影，補足鏡頭、燈光、節奏、材質與場景控制
3. 把電影語言轉譯成**網站可執行的敘事與版型系統**
4. 為每個主要頁面角色定義獨立場景與不可替代的主構圖
5. 最後才進入 HTML / CSS / JS 的規格化與實作

> 電影不是規格書；電影是研究輸入。
> 真正被電腦化的是後面的網站轉譯流程——也就是把研究整理成 `decisions.md`、`storyboard.md`、`compiled-spec.md` 與前端實作。

---

## 主要解決的痛點

這個 skill 不是在解決「AI 不會寫 HTML」，而是在解決 AI 很常做不好的**高階設計問題**：

| 痛點 | 具體表現 | Skill 的解法 |
|------|---------|-------------|
| **節奏** | 區塊順序合理，但看起來像簡報，不像被導演過的網站 | 用導演敘事模板取代預設的 Hero → Features → Stats → CTA |
| **空間** | 元件都在，但視線、距離、層級、壓力感不足 | 強制定義每頁的 Signature Composition，不允許退化為預設 grid |
| **燈光** | 只有表面 glow，沒有真正的光感、遮光、材質與空間照度 | 從具體電影場景取色，搭配 background-techniques 資料庫 |
| **高端感** | 頁面乾淨，但不夠貴、不夠準、不夠克制 | Premium Calibration 自問清單，強制做「刻意不做什麼」的決策 |
| **獨特性** | 做多個網站後，hero 姿態、section 節奏越來越像 | Demo Uniqueness Protocol：做歷史比對、列出 Shell-ban list |

---

## 核心特色

| 特色 | 說明 |
|------|------|
| **思考優先** | AI 必須發展原創視覺主題——不從預設庫中挑選 |
| **Director-first** | 感覺來源先來自導演與電影，不是 generic premium branding |
| **Research-first** | 若工具支援網路，先研究導演與電影，再鎖定 decisions phase |
| **Start questionnaire gate** | 每次 invocation 都要先完成起手問卷，再進 Phase 1 |
| **Storyboard-first** | 先寫 `decisions.md`、`storyboard.md`、`compiled-spec.md`，再寫前端 |
| **Demo Uniqueness Protocol** | 同一位使用者多次做不同網站時，先做歷史比對、列出 Shell-ban list，避免每個 demo 越來越像 |
| **Anti-grid fallback** | Grid 只能當對齊基礎，不能直接退化成可見的預設主構圖 |
| **Sub-agent friendly** | 環境支援時，可把電影 research、niche research、頁面場景、分頁規格拆給 sub-agents，但仍由主代理統一總導演與最終審美 |

---

## 工作流程

| Phase | 主要工作 | 輸出 Artifact |
|-------|---------|--------------|
| **Phase 1 — Decisions** | 完成起手問卷、選導演 + 電影、做 uniqueness audit、若可上網先研究電影 | `decisions.md` |
| **Phase 2 — Storyboard** | 先定全站電影語法、替每個頁面角色定義 scene thesis、鎖定每頁 signature composition | `storyboard.md` |
| **Phase 3 — Compiled Spec** | 按 storyboard 抽取 camera / interaction / composition / texture / typography，共享系統最後才推導 | `compiled-spec.md` |
| **Phase 4 — Build & Verify** | 依 spec 實作，補上 reduced-motion / responsive，用 anti-garbage rules 回頭檢查 | HTML / CSS / JS |

> **Phase 2 內部順序（不可跳過）：**
> 全站電影語法 → 各頁 scene thesis → 各頁 signature composition → 共用系統

---

## 支援哪些 AI / Agent 工具

這個 repo 的定位是「跨 agent skill package」。**Claude Code 與 OpenAI Codex 是兩個主要平台。**

| 工具 | 入口文件 | 安裝 / 設定 |
|------|---------|------------|
| **Claude Code**（主要） | [`CLAUDE.md`](./CLAUDE.md) | `~/.claude/skills/cinematic-ui` |
| **Codex / ChatGPT**（主要） | [`CODEX.md`](./CODEX.md) | `$CODEX_HOME/skills/cinematic-ui` |
| **Cursor** | [`.cursor/rules/cinematic-ui.mdc`](./.cursor/rules/cinematic-ui.mdc) | 已在 `.cursor/rules/` 內——clone 即可使用 |
| **Windsurf** | [`.windsurf/rules/cinematic-ui.md`](./.windsurf/rules/cinematic-ui.md) | 已在 `.windsurf/rules/` 內——clone 即可使用 |
| **GitHub Copilot** | [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) | 已在 `.github/` 內——clone 即可使用 |
| **Gemini / Antigravity** | [`GEMINI.md`](./GEMINI.md) | 於專案啟動時讀取 |
| **跨工具共用** | [`AGENTS.md`](./AGENTS.md) | 任何 agent 的通用參考基準 |

---

## References 資料庫索引

所有參考資料放在 `references/` 目錄下，按 phase 分工：

### 核心規則文件

| 文件 | 用途 |
|------|------|
| [`references/premium-calibration.md`](./references/premium-calibration.md) | Director brief 完成後，用來自問「這個設計夠不夠貴、夠不夠克制」 |
| [`references/anti-garbage.md`](./references/anti-garbage.md) | 列出 AI 常見的設計劣化模式，Phase 3 + Phase 4 都要過一遍 |
| [`references/anti-convergence.md`](./references/anti-convergence.md) | Hash-based 選取系統，防止多個 demo 或多個頁面版型越做越像 |
| [`references/implementation-guardrails.md`](./references/implementation-guardrails.md) | Phase 3–4 的具體防偷懶規則：JS 效果清單、Entrance Map 規範、Phase 3 checklist |
| [`references/reference-protocol.md`](./references/reference-protocol.md) | 使用者提供參考網站時，如何分解借鑑而不抄襲 |
| [`references/output-templates.md`](./references/output-templates.md) | 每個 phase artifact 的標準格式模板 |
| [`references/library-index.md`](./references/library-index.md) | 告訴 AI 每個 phase 該讀哪些文件、不該讀哪些 |

### Phase 1

| 文件 | 內容 |
|------|------|
| `references/data/directors-200.md` | 200+ 位導演，依類型分類，含代表作與視覺風格描述 |

### Phase 2

| 文件 | 內容 |
|------|------|
| `references/data/hero-archetypes.md` | 30 種 hero 骨架選項 |
| `references/data/narrative-beats.md` | 25 個敘事節拍 + 18 位導演的敘事弧線模板 |
| `references/data/section-functions.md` | 50 種功能性 section 類型 |
| `references/data/section-archetypes.md` | 91+ 種 section 骨架選項 |
| `references/data/dna-index.tsv` | 1486 個網站的 Design DNA 索引，可按 mood / 字型 / 動態風格搜尋 |
| `references/data/design-dna-db.txt` | DNA 索引命中後的深度站點資料 |

### Phase 3

| 文件 | 內容 |
|------|------|
| `references/data/camera-shots-50.md` | 55 種入場 / reveal 行為的 CSS |
| `references/data/interaction-effects-50.md` | 55+ 種 hover / click / scroll 互動效果（含需要 JS 的版本） |
| `references/data/compositions.md` | 80 種版型構圖與 grid 邏輯 |
| `references/data/visual-elements.md` | 40 種視覺裝飾元素（frame、badge、glow、halo、separator…） |
| `references/data/background-techniques.md` | 50+ 種 hero 背景與氛圍層技法 |
| `references/data/typography-cinema.md` | 40+ 種文字表演與層級處理 |
| `references/data/color-grades.md` | 40+ 種電影調色板轉 UI token |
| `references/data/font-moods.md` | 30+ 種字型配對，依氣質分類 |
| `references/data/textures.md` | 30+ 種 grain / grid / dust / scan line 材質 |
| `references/data/image-direction.md` | 有圖片佔位符時使用 |
| `references/data/visual-styles.md` | 風格交叉比對，不作為主要版型來源 |

---

## 安裝與使用

### 方法 1：Claude Code（推薦）

**Windows：**
```powershell
git clone https://github.com/akseolabs-seo/cinematic-ui "$env:USERPROFILE\.claude\skills\cinematic-layout"
```

**macOS / Linux：**
```bash
git clone https://github.com/akseolabs-seo/cinematic-ui ~/.claude/skills/cinematic-ui
```

安裝後在 Claude Code 內輸入 `/cinematic-ui` 即可呼叫。

### 方法 2：其他工具的 skills 目錄

如果你的工具支援本機 skills 目錄，把整個 `cinematic-layout` 資料夾放進對應路徑即可。

**Codex 類工具：**
```bash
git clone https://github.com/akseolabs-seo/cinematic-ui $CODEX_HOME/skills/cinematic-ui
```

### Cursor / Windsurf / GitHub Copilot

Clone 這個 repo——`.cursor/rules/`、`.windsurf/rules/` 以及 `.github/copilot-instructions.md` 已經就位。Rules 會自動啟用。

### 方法 3：當成跨工具 repo 指令包使用

直接把這個 repo 放進你的專案或知識庫，讓工具讀取對應的入口文件（見上方工具表格）。

---

## 適合怎麼餵需求

```text
用 cinematic-layout 做一個首頁。
導演 / 電影請你選。
如果可以上網，先研究導演與電影。
先執行 Demo Uniqueness Protocol。
不要參考我以前的 demo 外殼。
先追求單頁完成度，不先做共用系統。
```

---

## 追蹤更新

更多 AI / 設計工作流內容：

- [Threads: @darkseoking](https://www.threads.com/@darkseoking)

---

## 目錄結構

```text
cinematic-layout/
├── SKILL.md                          ← 主要 skill 邏輯入口（Claude Code 主要平台）
├── skill.json                        ← Skill 元數據與版本資訊
├── directors-library.md              ← 原版相容檔，供舊工作流直接讀取
├── AGENTS.md                         ← 跨工具 agent 指令
├── CLAUDE.md                         ← Claude Code 專用
├── CODEX.md                          ← Codex / ChatGPT 專用
├── GEMINI.md                         ← Gemini / Antigravity 專用
├── CHANGELOG.md                      ← 版本歷史
├── LICENSE
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── docs/
│   └── banner.svg
├── .cursor/
│   └── rules/
│       └── cinematic-ui.mdc      ← Cursor 專用
├── .windsurf/
│   └── rules/
│       └── cinematic-ui.md       ← Windsurf 專用
├── .github/
│   ├── copilot-instructions.md       ← GitHub Copilot 專用
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
├── agents/                           ← 跨工具 agent 配置
└── references/
    ├── anti-garbage.md
    ├── anti-convergence.md
    ├── implementation-guardrails.md
    ├── library-index.md
    ├── output-templates.md
    ├── premium-calibration.md
    ├── reference-protocol.md
    └── data/                         ← 18 個設計資料庫（共約 600KB）
```

---

## 貢獻

歡迎 issue / PR，但請先看 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 授權

本 repo 採用 [MIT License](./LICENSE)。
