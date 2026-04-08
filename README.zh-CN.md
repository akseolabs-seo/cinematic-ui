# Cinematic UI

<p align="center">
  <img src="./docs/banner.svg" alt="Cinematic UI Banner" width="100%" />
</p>

<p align="center">
  以「导演 + 电影」研究流程设计网站的跨 agent skill。
</p>

<p align="center">
  <a href="./README.md">English</a> ·
  <a href="./README.zh-TW.md">繁體中文</a>
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
  <em>没有给任何参考、没有给任何指令。导演与电影随机挑选，单次输出结果。</em>
</p>

---

## 这是什么

`cinematic-ui` 是一个给 AI coding agent（Claude Code、Codex、Cursor、Windsurf、Gemini、Copilot）使用的 skill 包。它引导 agent 用一套固定流程做网站：

1. 挑一位导演与一部电影
2. 研究这部电影的视觉语言（摄影、灯光、节奏、材质）
3. 把研究成果转成网页工件：`decisions.md`、`storyboard.md`、`compiled-spec.md`
4. 从 spec 出发实作 HTML / CSS / JS

电影是研究素材，不是规格表。Agent 的任务是从电影里抽出结构性的模式，再翻译成版面、构图、动态与字体。

---

## 流程

| 阶段 | 工作 | 产出 |
|------|------|------|
| Phase 1 | 开场问卷、选择导演与电影、唯一性检查、研究 | `decisions.md` |
| Phase 2 | 全站 cinematic grammar、各页 scene thesis、signature composition | `storyboard.md` |
| Phase 3 | 分页拆解 camera、interaction、composition、texture、typography | `compiled-spec.md` |
| Phase 4 | 实作、加 reduced-motion 与 RWD、跑 anti-garbage 检查 | HTML / CSS / JS |

Phase 2 的内部顺序固定：全站语法 → 各页 thesis → 各页构图 → 共用系统。

---

## 支援工具

| 工具 | 入口文件 | 安装路径 |
|------|---------|----------|
| Claude Code | [`CLAUDE.md`](./CLAUDE.md) | `~/.claude/skills/cinematic-ui` |
| Codex / ChatGPT | [`CODEX.md`](./CODEX.md) | `$CODEX_HOME/skills/cinematic-ui` |
| Cursor | [`.cursor/rules/cinematic-ui.mdc`](./.cursor/rules/cinematic-ui.mdc) | clone 后自动加载 |
| Windsurf | [`.windsurf/rules/cinematic-ui.md`](./.windsurf/rules/cinematic-ui.md) | clone 后自动加载 |
| GitHub Copilot | [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) | clone 后自动加载 |
| Gemini / Antigravity | [`GEMINI.md`](./GEMINI.md) | 项目启动时读取 |
| 跨工具 | [`AGENTS.md`](./AGENTS.md) | 通用参考 |

---

## 安装

### Claude Code

**Windows：**
```powershell
git clone https://github.com/akseolabs-seo/cinematic-ui "$env:USERPROFILE\.claude\skills\cinematic-ui"
```

**macOS / Linux：**
```bash
git clone https://github.com/akseolabs-seo/cinematic-ui ~/.claude/skills/cinematic-ui
```

安装后在 Claude Code 内输入 `/cinematic-ui`。

### Codex / ChatGPT

```bash
git clone https://github.com/akseolabs-seo/cinematic-ui $CODEX_HOME/skills/cinematic-ui
```

### Cursor / Windsurf / GitHub Copilot

```bash
git clone https://github.com/akseolabs-seo/cinematic-ui
```

对应的 rule 文件已就位，无需额外配置。

---

## 建议 Prompt

```text
用 cinematic-ui 做一个首页。
导演跟电影你自己选。
有网络的话先研究导演跟电影。
跑 Demo Uniqueness Protocol。
不要重用之前 demo 的版型。
```

---

## References 资料库

所有参考资料放在 `references/`，按 phase 分类。每个 phase 只加载需要的文件。

### 核心规则

| 文件 | 用途 |
|------|------|
| [`references/library-index.md`](./references/library-index.md) | 各 phase 该读哪些文件 |
| [`references/premium-calibration.md`](./references/premium-calibration.md) | 导演 brief 后的自我检查 |
| [`references/anti-garbage.md`](./references/anti-garbage.md) | AI 常见的设计劣化模式 |
| [`references/anti-convergence.md`](./references/anti-convergence.md) | 用 hash 防止跨 demo 重复版型 |
| [`references/implementation-guardrails.md`](./references/implementation-guardrails.md) | Phase 3–4 实作规则 |
| [`references/reference-protocol.md`](./references/reference-protocol.md) | 如何拆解参考站而不抄袭 |
| [`references/output-templates.md`](./references/output-templates.md) | 各 phase 工件的标准格式 |

### 数据库

| 文件 | 内容 |
|------|------|
| `references/data/directors-200.md` | 200+ 位导演与作品视觉风格 |
| `references/data/hero-archetypes.md` | 30 种 hero 骨架 |
| `references/data/narrative-beats.md` | 25 个叙事节奏 + 18 种导演 arc 模板 |
| `references/data/section-functions.md` | 50 种功能性 section 类型 |
| `references/data/section-archetypes.md` | 91+ 种 section 骨架 |
| `references/data/dna-index.tsv` | 1,486 个网站的 Design DNA 索引 |
| `references/data/design-dna-db.txt` | 站台层级的 DNA 数据 |
| `references/data/camera-shots-50.md` | 55 种入场与揭露行为 |
| `references/data/interaction-effects-50.md` | 55+ 种 hover / click / scroll 交互 |
| `references/data/compositions.md` | 80 种版面构图 |
| `references/data/visual-elements.md` | 40 种视觉装饰元素 |
| `references/data/background-techniques.md` | 50+ 种 hero 背景与氛围层 |
| `references/data/typography-cinema.md` | 40+ 种文字处理 |
| `references/data/color-grades.md` | 40+ 种电影调色到 UI token 的转译 |
| `references/data/font-moods.md` | 30+ 种字体配对 |
| `references/data/textures.md` | 30+ 种表面材质 |

---

## 目录结构

```text
cinematic-ui/
├── SKILL.md                        ← 主要 skill 逻辑
├── skill.json                      ← 通用 skill manifest
├── CLAUDE.md                       ← Claude Code
├── AGENTS.md                       ← 跨工具共用参考
├── CODEX.md                        ← Codex / ChatGPT
├── GEMINI.md                       ← Gemini / Antigravity
├── .cursor/rules/                  ← Cursor rules（自动加载）
├── .windsurf/rules/                ← Windsurf rules（自动加载）
├── .github/copilot-instructions.md ← GitHub Copilot（自动加载）
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
    └── data/                       ← 18 个设计数据库
```

---

## 贡献

请见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 授权

MIT。见 [LICENSE](./LICENSE)。
