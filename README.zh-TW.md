# Cinematic UI

<p align="center">
  <img src="./docs/banner.svg" alt="Cinematic UI Banner" width="100%" />
</p>

<p align="center">
  以「導演 + 電影」研究流程設計網站的跨 agent skill。
</p>

<p align="center">
  <a href="./README.md">English</a> ·
  <a href="./README.zh-CN.md">简体中文</a>
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-cb9b6b?style=for-the-badge&labelColor=17120f" alt="MIT License"></a>
  <a href="./CLAUDE.md"><img src="https://img.shields.io/badge/Claude%20Code-Supported-a9784b?style=for-the-badge&labelColor=17120f" alt="Claude Code"></a>
  <a href="./CODEX.md"><img src="https://img.shields.io/badge/Codex-Supported-9b8a6e?style=for-the-badge&labelColor=17120f" alt="Codex"></a>
</p>

---

## Demo

<p align="center">
  <video src="https://github.com/user-attachments/assets/43343d78-9697-4d29-9387-2da72694f2fc" autoplay loop muted playsinline width="100%"></video>
</p>

<p align="center">
  <em>沒有給任何參考、沒有給任何指令。導演與電影隨機挑選，單次輸出結果。</em>
</p>

---

## 這是什麼

`cinematic-ui` 是一個給 AI coding agent（Claude Code、Codex、Cursor、Windsurf、Gemini、Copilot）使用的 skill 包。它引導 agent 用一套固定流程做網站：

1. 挑一位導演與一部電影
2. 研究這部電影的視覺語言（攝影、燈光、節奏、材質）
3. 把研究成果轉成網頁工件：`decisions.md`、`storyboard.md`、`compiled-spec.md`
4. 從 spec 出發實作 HTML / CSS / JS

電影是研究素材，不是規格表。Agent 的任務是從電影裡抽出結構性的模式，再翻譯成版面、構圖、動態與字體。

---

## 流程

| 階段 | 工作 | 產出 |
|------|------|------|
| Phase 1 | 開場問卷、選擇導演與電影、唯一性檢查、研究 | `decisions.md` |
| Phase 2 | 全站 cinematic grammar、各頁 scene thesis、signature composition | `storyboard.md` |
| Phase 3 | 分頁拆解 camera、interaction、composition、texture、typography | `compiled-spec.md` |
| Phase 4 | 實作、加 reduced-motion 與 RWD、跑 anti-garbage 檢查 | HTML / CSS / JS |

Phase 2 的內部順序固定：全站語法 → 各頁 thesis → 各頁構圖 → 共用系統。

---

## 支援工具

| 工具 | 入口檔案 | 安裝路徑 |
|------|---------|----------|
| Claude Code | [`CLAUDE.md`](./CLAUDE.md) | `~/.claude/skills/cinematic-ui` |
| Codex / ChatGPT | [`CODEX.md`](./CODEX.md) | `$CODEX_HOME/skills/cinematic-ui` |
| Cursor | [`.cursor/rules/cinematic-ui.mdc`](./.cursor/rules/cinematic-ui.mdc) | clone 後自動載入 |
| Windsurf | [`.windsurf/rules/cinematic-ui.md`](./.windsurf/rules/cinematic-ui.md) | clone 後自動載入 |
| GitHub Copilot | [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) | clone 後自動載入 |
| Gemini / Antigravity | [`GEMINI.md`](./GEMINI.md) | 專案啟動時讀取 |
| 跨工具 | [`AGENTS.md`](./AGENTS.md) | 通用參考 |

---

## 安裝

### Claude Code

**Windows：**
```powershell
git clone https://github.com/akseolabs-seo/cinematic-ui "$env:USERPROFILE\.claude\skills\cinematic-ui"
```

**macOS / Linux：**
```bash
git clone https://github.com/akseolabs-seo/cinematic-ui ~/.claude/skills/cinematic-ui
```

安裝後在 Claude Code 內輸入 `/cinematic-ui`。

### Codex / ChatGPT

```bash
git clone https://github.com/akseolabs-seo/cinematic-ui $CODEX_HOME/skills/cinematic-ui
```

### Cursor / Windsurf / GitHub Copilot

```bash
git clone https://github.com/akseolabs-seo/cinematic-ui
```

對應的 rule 檔案已就位，不需額外設定。

---

## 建議 Prompt

```text
用 cinematic-ui 做一個首頁。
導演跟電影你自己選。
有網路的話先研究導演跟電影。
跑 Demo Uniqueness Protocol。
不要重用之前 demo 的版型。
```

---

## References 資料庫

所有參考資料放在 `references/`，依 phase 分類。每個 phase 只載入需要的檔案。

### 核心規則

| 檔案 | 用途 |
|------|------|
| [`references/library-index.md`](./references/library-index.md) | 各 phase 該讀哪些檔案 |
| [`references/premium-calibration.md`](./references/premium-calibration.md) | 導演 brief 後的自我檢查 |
| [`references/anti-garbage.md`](./references/anti-garbage.md) | AI 常見的設計劣化模式 |
| [`references/anti-convergence.md`](./references/anti-convergence.md) | 用 hash 防止跨 demo 重複版型 |
| [`references/implementation-guardrails.md`](./references/implementation-guardrails.md) | Phase 3–4 實作規則 |
| [`references/reference-protocol.md`](./references/reference-protocol.md) | 如何拆解參考站而不抄襲 |
| [`references/output-templates.md`](./references/output-templates.md) | 各 phase 工件的標準格式 |

### 資料庫

| 檔案 | 內容 |
|------|------|
| `references/data/directors-200.md` | 200+ 位導演與作品視覺風格 |
| `references/data/hero-archetypes.md` | 30 種 hero 骨架 |
| `references/data/narrative-beats.md` | 25 個敘事節奏 + 18 種導演 arc 模板 |
| `references/data/section-functions.md` | 50 種功能性 section 類型 |
| `references/data/section-archetypes.md` | 91+ 種 section 骨架 |
| `references/data/dna-index.tsv` | 1,486 個網站的 Design DNA 索引 |
| `references/data/design-dna-db.txt` | 站台層級的 DNA 資料 |
| `references/data/camera-shots-50.md` | 55 種進場與揭露行為 |
| `references/data/interaction-effects-50.md` | 55+ 種 hover / click / scroll 互動 |
| `references/data/compositions.md` | 80 種版面構圖 |
| `references/data/visual-elements.md` | 40 種視覺裝飾元素 |
| `references/data/background-techniques.md` | 50+ 種 hero 背景與氛圍層 |
| `references/data/typography-cinema.md` | 40+ 種文字處理 |
| `references/data/color-grades.md` | 40+ 種電影調色到 UI token 的轉譯 |
| `references/data/font-moods.md` | 30+ 種字體配對 |
| `references/data/textures.md` | 30+ 種表面材質 |

---

## 目錄結構

```text
cinematic-ui/
├── SKILL.md                        ← 主要 skill 邏輯
├── skill.json                      ← 通用 skill manifest
├── CLAUDE.md                       ← Claude Code
├── AGENTS.md                       ← 跨工具共用參考
├── CODEX.md                        ← Codex / ChatGPT
├── GEMINI.md                       ← Gemini / Antigravity
├── .cursor/rules/                  ← Cursor rules（自動載入）
├── .windsurf/rules/                ← Windsurf rules（自動載入）
├── .github/copilot-instructions.md ← GitHub Copilot（自動載入）
├── agents/openai.yaml              ← OpenAI skill metadata
├── docs/                           ← banner、demo 素材
└── references/
    ├── library-index.md
    ├── premium-calibration.md
    ├── anti-garbage.md
    ├── anti-convergence.md
    ├── implementation-guardrails.md
    ├── reference-protocol.md
    ├── output-templates.md
    └── data/                       ← 18 個設計資料庫
```

---

## 貢獻

請見 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 授權

MIT。見 [LICENSE](./LICENSE)。
