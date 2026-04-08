# Cinematic UI

<p align="center">
  <img src="./docs/banner.svg" alt="Cinematic UI Banner" width="100%" />
</p>

<p align="center">
  A cross-agent skill for designing websites using a director-and-film research workflow.
</p>

<p align="center">
  <a href="./README.zh-TW.md">繁體中文</a> ·
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
  <em>No references provided. No instructions given. Director and film picked at random. Single-pass output.</em>
</p>

---

## What It Is

`cinematic-ui` is a skill package for AI coding agents (Claude Code, Codex, Cursor, Windsurf, Gemini, Copilot). It guides the agent through a structured workflow for building websites:

1. Pick a director and a specific film
2. Research that film's visual language (cinematography, lighting, rhythm, material)
3. Translate the research into web artifacts: `decisions.md`, `storyboard.md`, `compiled-spec.md`
4. Implement HTML / CSS / JS from the spec

The film is research input, not a spec sheet. The agent's job is to extract structural patterns from cinema and translate them into layout, composition, motion, and typography.

---

## Workflow

| Phase | Work | Output |
|-------|------|--------|
| Phase 1 | Start questionnaire, choose director + film, uniqueness audit, research | `decisions.md` |
| Phase 2 | Site-wide cinematic grammar, per-page scene thesis, signature composition | `storyboard.md` |
| Phase 3 | Camera, interaction, composition, texture, typography per storyboard | `compiled-spec.md` |
| Phase 4 | Implement, add reduced-motion + responsive, run anti-garbage checks | HTML / CSS / JS |

Phase 2 internal order is fixed: site-wide grammar → per-page thesis → per-page composition → shared system.

---

## Supported Tools

| Tool | Entry File | Install Path |
|------|-----------|--------------|
| Claude Code | [`CLAUDE.md`](./CLAUDE.md) | `~/.claude/skills/cinematic-ui` |
| Codex / ChatGPT | [`CODEX.md`](./CODEX.md) | `$CODEX_HOME/skills/cinematic-ui` |
| Cursor | [`.cursor/rules/cinematic-ui.mdc`](./.cursor/rules/cinematic-ui.mdc) | Auto-loaded on clone |
| Windsurf | [`.windsurf/rules/cinematic-ui.md`](./.windsurf/rules/cinematic-ui.md) | Auto-loaded on clone |
| GitHub Copilot | [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) | Auto-loaded on clone |
| Gemini / Antigravity | [`GEMINI.md`](./GEMINI.md) | Read at project startup |
| Cross-tool | [`AGENTS.md`](./AGENTS.md) | Universal reference |

---

## Installation

### Claude Code

**Windows:**
```powershell
git clone https://github.com/akseolabs-seo/cinematic-ui "$env:USERPROFILE\.claude\skills\cinematic-ui"
```

**macOS / Linux:**
```bash
git clone https://github.com/akseolabs-seo/cinematic-ui ~/.claude/skills/cinematic-ui
```

Invoke with `/cinematic-ui` inside Claude Code.

### Codex / ChatGPT

```bash
git clone https://github.com/akseolabs-seo/cinematic-ui $CODEX_HOME/skills/cinematic-ui
```

### Cursor / Windsurf / GitHub Copilot

```bash
git clone https://github.com/akseolabs-seo/cinematic-ui
```

The relevant rule files are already in place. No additional config needed.

---

## Suggested Prompt

```text
Use cinematic-ui to build a homepage.
Pick the director and film yourself.
Research the director and film first if web access is available.
Run the Demo Uniqueness Protocol.
Do not reuse shells from previous demos.
```

---

## References Library

All reference data lives in `references/`, organized by phase. Load only what the current phase needs.

### Core Rule Files

| File | Purpose |
|------|---------|
| [`references/library-index.md`](./references/library-index.md) | Which files to read per phase |
| [`references/premium-calibration.md`](./references/premium-calibration.md) | Self-check after director brief |
| [`references/anti-garbage.md`](./references/anti-garbage.md) | Common AI design degradation patterns |
| [`references/anti-convergence.md`](./references/anti-convergence.md) | Hash-based selection to prevent repeated shells |
| [`references/implementation-guardrails.md`](./references/implementation-guardrails.md) | Phase 3–4 build rules |
| [`references/reference-protocol.md`](./references/reference-protocol.md) | How to decompose a reference site without copying |
| [`references/output-templates.md`](./references/output-templates.md) | Standard format templates per phase |

### Data Libraries

| File | Contents |
|------|---------|
| `references/data/directors-200.md` | 200+ directors with films and visual style |
| `references/data/hero-archetypes.md` | 30 hero skeletons |
| `references/data/narrative-beats.md` | 25 narrative beats + 18 director arc templates |
| `references/data/section-functions.md` | 50 functional section types |
| `references/data/section-archetypes.md` | 91+ section skeletons |
| `references/data/dna-index.tsv` | Design DNA index of 1,486 sites |
| `references/data/design-dna-db.txt` | Site-level DNA data |
| `references/data/camera-shots-50.md` | 55 entrance and reveal behaviors |
| `references/data/interaction-effects-50.md` | 55+ hover / click / scroll interactions |
| `references/data/compositions.md` | 80 layout compositions |
| `references/data/visual-elements.md` | 40 visual decoration elements |
| `references/data/background-techniques.md` | 50+ hero background techniques |
| `references/data/typography-cinema.md` | 40+ text treatments |
| `references/data/color-grades.md` | 40+ film palette to UI token translations |
| `references/data/font-moods.md` | 30+ font pairings by tone |
| `references/data/textures.md` | 30+ surface techniques |

---

## Repository Structure

```text
cinematic-ui/
├── SKILL.md                        ← main skill logic
├── skill.json                      ← universal skill manifest
├── CLAUDE.md                       ← Claude Code
├── AGENTS.md                       ← cross-tool shared reference
├── CODEX.md                        ← Codex / ChatGPT
├── GEMINI.md                       ← Gemini / Antigravity
├── .cursor/rules/                  ← Cursor rules (auto-loaded)
├── .windsurf/rules/                ← Windsurf rules (auto-loaded)
├── .github/copilot-instructions.md ← GitHub Copilot (auto-loaded)
├── agents/openai.yaml              ← OpenAI skill metadata
├── docs/                           ← banner, demo assets
└── references/
    ├── library-index.md
    ├── premium-calibration.md
    ├── anti-garbage.md
    ├── anti-convergence.md
    ├── implementation-guardrails.md
    ├── reference-protocol.md
    ├── output-templates.md
    └── data/                       ← 18 design data libraries
```

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT. See [LICENSE](./LICENSE).
