# Cinematic UI

<p align="center">
  <img src="./docs/banner.svg" alt="Cinematic UI Banner" width="100%" />
</p>

<p align="center">
  <strong>Turn director and film research into premium website rhythm, space, light, and composition.</strong>
</p>

<p align="center">
  <a href="./README.zh-TW.md">繁體中文</a> ·
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
  <a href="./CODEX.md"><img src="https://img.shields.io/badge/Codex%20%2F%20ChatGPT-Primary-9b8a6e?style=for-the-badge&labelColor=17120f" alt="Codex Primary"></a>
  <a href="./.cursor/rules/cinematic-ui.mdc"><img src="https://img.shields.io/badge/Cursor-Ready-7b9b8a?style=for-the-badge&labelColor=17120f" alt="Cursor Ready"></a>
  <a href="./.windsurf/rules/cinematic-ui.md"><img src="https://img.shields.io/badge/Windsurf-Ready-6b8b7a?style=for-the-badge&labelColor=17120f" alt="Windsurf Ready"></a>
  <a href="./GEMINI.md"><img src="https://img.shields.io/badge/Gemini-Ready-9b6d42?style=for-the-badge&labelColor=17120f" alt="Gemini Ready"></a>
  <a href="./.github/copilot-instructions.md"><img src="https://img.shields.io/badge/GitHub%20Copilot-Ready-8b623d?style=for-the-badge&labelColor=17120f" alt="GitHub Copilot Ready"></a>
</p>

<p align="center">
  <a href="https://www.threads.com/@darkseoking"><img src="https://img.shields.io/badge/Follow%20on%20Threads-%40darkseoking-f1e2cf?style=for-the-badge&logo=threads&logoColor=111111&labelColor=f1e2cf" alt="Follow @darkseoking on Threads"></a>
  <a href="https://xhslink.com/m/3fZJnT4jDHe"><img src="https://img.shields.io/badge/Follow%20on%20RED-%40AK-ff2442?style=for-the-badge&labelColor=ff2442&logoColor=ffffff" alt="Follow @AK on 小紅書"></a>
</p>

---

## Why This Is Different

Most AI design skills are **lookup tables**.

They give the AI a database of 67 styles, 161 color palettes, 50 component patterns — and the AI picks from the menu. The result is technically clean, occasionally polished, and reliably forgettable. The AI is not thinking. It is shopping.

**Cinematic UI is a thinking framework, not a materials library.**

Instead of handing the AI a menu, this skill forces it to work the way a real film director does:

1. Research a specific director and a specific film — lighting logic, framing discipline, scene rhythm, material sense
2. Extract what makes that film's visual language work at a structural level
3. Develop an original visual thesis for the site: what kind of scene is this page? what composition is irreplaceable here?
4. Justify every layout decision against that film language
5. Only then formalize CSS, motion, and implementation

The difference in output is not a matter of degree. It is a different category of result.

A lookup table produces a site that looks like a site. A director's workflow produces a site that feels like it was made by someone who had a point of view.

> The AI is not a shopkeeper picking items off shelves.
> The AI is the director. The film is the brief. The website is the production.

---

## What It Is

`cinematic-layout` is a cross-agent reasoning skill built around a single fixed mechanism:

1. Choose a **director + specific film**
2. If web access is available, research that director and film — cinematography, lighting, rhythm, material, scene control
3. Translate that film language into a **web-executable narrative and layout system**
4. Define one distinct scene and one irreplaceable composition per major page role
5. Only then formalize HTML / CSS / JS implementation

> The film is not a spec sheet. The film is research input.
> The computer-operable workflow starts when those observations are translated into `decisions.md`, `storyboard.md`, `compiled-spec.md`, and implementation.

---

## Problems It Solves

| Problem | What It Looks Like | How This Skill Solves It |
|---------|-------------------|--------------------------|
| **Pacing** | Sections are technically valid but feel like a slide deck, not a directed site | Director narrative templates replace the default Hero → Features → Stats → CTA flow |
| **Space** | Components exist but visual weight, distance, hierarchy, and pressure are weak | Forces a Signature Composition per page — no fallback to default grid |
| **Light** | Surface glow only — no real lighting logic, shadow behavior, or material control | Colors sourced from actual film scenes, paired with background-techniques library |
| **Premium feel** | Clean but not expensive, not restrained, not directed enough | Premium Calibration checklist forces explicit "what we will NOT do" decisions |
| **Uniqueness** | After multiple demos, hero posture, section rhythm, and geometry start repeating | Demo Uniqueness Protocol: history audit + Shell-ban list before every new project |

---

## Core Features

| Feature | Description |
|---------|-------------|
| **Reasoning-first** | AI must develop an original visual thesis — not select from a preset library |
| **Director-first** | Emotional direction comes from a real film, not generic luxury branding |
| **Research-first** | When web access is available, research the director and film before locking Phase 1 |
| **Start questionnaire gate** | Every invocation must complete the opening questionnaire before Phase 1 begins |
| **Storyboard-first** | Write `decisions.md`, `storyboard.md`, `compiled-spec.md` before any frontend code |
| **Demo Uniqueness Protocol** | Audits prior outputs and enforces a Shell-ban list to prevent repeated shells across projects |
| **Anti-grid fallback** | Grid is allowed as invisible alignment infrastructure — never as the visible default composition |
| **Sub-agent friendly** | Film research, niche research, page scenes, spec slices, and verification can be delegated while one lead agent maintains final coherence |

---

## Workflow

| Phase | Main Work | Output Artifact |
|-------|-----------|----------------|
| **Phase 1 — Decisions** | Complete start questionnaire, choose director + film, run uniqueness audit, research if web access available | `decisions.md` |
| **Phase 2 — Storyboard** | Define site-wide cinematic grammar, write scene thesis per page role, lock signature composition per page | `storyboard.md` |
| **Phase 3 — Compiled Spec** | Extract camera / interaction / composition / texture / typography per storyboard — shared system last | `compiled-spec.md` |
| **Phase 4 — Build & Verify** | Implement from spec, add reduced-motion + responsive, validate against anti-garbage rules | HTML / CSS / JS |

> **Phase 2 internal order (non-negotiable):**
> Site-wide cinematic grammar → per-page scene thesis → per-page signature composition → shared system

---

## Supported Platforms

Claude Code and OpenAI Codex are the two primary platforms. All others are fully supported.

| Tool / Platform | Entry File | Install / Config |
|----------------|-----------|-----------------|
| **Claude Code** *(primary)* | [`CLAUDE.md`](./CLAUDE.md) | `~/.claude/skills/cinematic-ui` |
| **Codex / ChatGPT** *(primary)* | [`CODEX.md`](./CODEX.md) | `$CODEX_HOME/skills/cinematic-ui` |
| **Cursor** | [`.cursor/rules/cinematic-ui.mdc`](./.cursor/rules/cinematic-ui.mdc) | Already in `.cursor/rules/` — works on clone |
| **Windsurf** | [`.windsurf/rules/cinematic-ui.md`](./.windsurf/rules/cinematic-ui.md) | Already in `.windsurf/rules/` — works on clone |
| **GitHub Copilot** | [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) | Already in `.github/` — works on clone |
| **Gemini / Antigravity** | [`GEMINI.md`](./GEMINI.md) | Read at project startup |
| **Cross-tool shared** | [`AGENTS.md`](./AGENTS.md) | Universal reference for any agent |

---

## Installation

### Claude Code

**Windows:**
```powershell
git clone https://github.com/akseolabs-seo/cinematic-ui "$env:USERPROFILE\.claude\skills\cinematic-layout"
```

**macOS / Linux:**
```bash
git clone https://github.com/akseolabs-seo/cinematic-ui ~/.claude/skills/cinematic-ui
```

Then invoke with `/cinematic-ui` inside Claude Code.

### Codex / ChatGPT

```bash
git clone https://github.com/akseolabs-seo/cinematic-ui $CODEX_HOME/skills/cinematic-ui
```

### Cursor / Windsurf / GitHub Copilot

```bash
git clone https://github.com/akseolabs-seo/cinematic-ui
```

The `.cursor/rules/`, `.windsurf/rules/`, and `.github/copilot-instructions.md` files are already in place. No additional config needed — the rules activate as soon as the repo is present in your project.

### Any other tool

Point the tool at this repo or copy the relevant entry file. See the platform table above.

---

## Suggested Prompt Pattern

```text
Use cinematic-layout to build a homepage.
Pick the director and film yourself.
If web access is available, research the director and film first.
Run the Demo Uniqueness Protocol.
Do not reuse shells from previous demos.
Optimize for a great single-page result before building a shared system.
```

---

## References Library

All reference data lives in `references/`, organized by phase. Load only what the current phase needs — do not read the entire library at once.

### Core Rule Files

| File | Purpose |
|------|---------|
| [`references/library-index.md`](./references/library-index.md) | Which files to read per phase — start here |
| [`references/premium-calibration.md`](./references/premium-calibration.md) | Self-check after director brief: restraint and premium quality |
| [`references/anti-garbage.md`](./references/anti-garbage.md) | Common AI design degradation patterns — run in Phase 3 and Phase 4 |
| [`references/anti-convergence.md`](./references/anti-convergence.md) | Hash-based selection to prevent repeated shells across demos or pages |
| [`references/implementation-guardrails.md`](./references/implementation-guardrails.md) | Phase 3–4 rules: JS effect list, Entrance Map, Phase 3 checklist, Punch Up / Pull Back |
| [`references/reference-protocol.md`](./references/reference-protocol.md) | How to decompose a reference site without copying it |
| [`references/output-templates.md`](./references/output-templates.md) | Standard format templates for each phase artifact |

### Data Libraries (Phase 1–3)

| File | Contents |
|------|---------|
| `references/data/directors-200.md` | 200+ directors by genre, with signature films and visual style descriptions |
| `references/data/hero-archetypes.md` | 30 hero skeleton options |
| `references/data/narrative-beats.md` | 25 narrative beats + 18 director arc templates |
| `references/data/section-functions.md` | 50 functional section types |
| `references/data/section-archetypes.md` | 91+ section skeleton options |
| `references/data/dna-index.tsv` | Design DNA index of 1,486 sites — searchable by mood, type, motion |
| `references/data/design-dna-db.txt` | Deep site-level DNA data (load only on index hit) |
| `references/data/camera-shots-50.md` | 55 entrance and reveal behaviors with CSS |
| `references/data/interaction-effects-50.md` | 55+ hover / click / scroll interactions (includes JS-required variants) |
| `references/data/compositions.md` | 80 layout compositions and grid logics |
| `references/data/visual-elements.md` | 40 visual decoration elements |
| `references/data/background-techniques.md` | 50+ hero background and atmosphere layer techniques |
| `references/data/typography-cinema.md` | 40+ text performance and hierarchy treatments |
| `references/data/color-grades.md` | 40+ film palette to UI token translations |
| `references/data/font-moods.md` | 30+ font pairings by tone |
| `references/data/textures.md` | 30+ grain / grid / dust / scan line surface techniques |

---

## Repository Structure

```text
cinematic-layout/
├── SKILL.md                              ← main skill logic (primary entry for all agents)
├── skill.json                            ← universal skill manifest
├── directors-library.md                  ← legacy compatibility file
│
├── CLAUDE.md                             ← Claude Code
├── AGENTS.md                             ← cross-tool shared reference
├── CODEX.md                              ← Codex / ChatGPT
├── GEMINI.md                             ← Gemini / Antigravity
│
├── .cursor/
│   └── rules/
│       └── cinematic-ui.mdc          ← Cursor rules (auto-loaded)
│
├── .windsurf/
│   └── rules/
│       └── cinematic-ui.md           ← Windsurf rules (auto-loaded)
│
├── .github/
│   ├── copilot-instructions.md           ← GitHub Copilot (auto-loaded)
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
│
├── agents/
│   └── openai.yaml                       ← OpenAI skill metadata
│
├── docs/
│   └── banner.svg
│
├── CHANGELOG.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── LICENSE
│
└── references/
    ├── library-index.md
    ├── premium-calibration.md
    ├── anti-garbage.md
    ├── anti-convergence.md
    ├── implementation-guardrails.md
    ├── reference-protocol.md
    ├── output-templates.md
    └── data/                             ← 18 design data libraries (~600KB total)
```

---

## Follow

For updates and more AI / design workflow content:

- [Threads: @darkseoking](https://www.threads.com/@darkseoking)

---

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a PR.

## License

MIT. See [LICENSE](./LICENSE).
