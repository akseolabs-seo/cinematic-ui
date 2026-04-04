# AGENTS.md

This repository contains a reusable Skill for AI coding/design agents.

## What This Project Is

`cinematic-layout` helps agents generate websites with:

- stronger high-end visual direction
- better control of pacing, space, light, and composition
- less template drift across repeated demos
- a director + film based research-and-translation workflow instead of generic luxury UI prompting

## Primary Goal

The main pain point this project solves is:

> AI often produces websites that are technically clean but visually average, weak in rhythm, weak in spatial control, and too dependent on generic hero/feature/CTA patterns.

This skill pushes agents to solve those problems through a computer-operable workflow:

0. complete the start questionnaire for this invocation
1. research a director + film with external sources when available
2. extract cinematic grammar from that research
3. define page scenes
4. lock signature compositions
5. derive shared system last
6. implement and verify

Important boundary:

> The film is not the computer workflow. The film is the research substrate. The computer-operable workflow starts when the agent translates those observations into decisions, storyboard, spec, and implementation.

## Read Order

When working on this repo or using this skill, read in this order:

1. [README.md](./README.md)
2. [SKILL.md](./SKILL.md)
3. [references/output-templates.md](./references/output-templates.md)
4. [references/premium-calibration.md](./references/premium-calibration.md)
5. [references/anti-garbage.md](./references/anti-garbage.md)

## Rules For Agents

- Do not turn this into a generic premium-brand website skill.
- Keep the director + film mechanism as the emotional source.
- Every invocation must complete the start questionnaire before Phase 1.
- Research the chosen director and film before locking the phase when web access is available.
- Preserve the `decisions -> storyboard -> compiled-spec -> build` workflow.
- Maintain the `Demo Uniqueness Protocol`.
- If you change workflow rules, also check:
  - `references/output-templates.md`
  - `references/premium-calibration.md`
  - `references/anti-garbage.md`
- Prefer progressive disclosure:
  - keep `SKILL.md` lean
  - move details into `references/`

## Cross-Agent Compatibility

This repo is intentionally structured so multiple agent tools can use the same project context:

- `AGENTS.md` — cross-tool / agent-standard workflows (this file)
- `CLAUDE.md` — Claude Code (primary platform)
- `CODEX.md` — OpenAI Codex / ChatGPT
- `GEMINI.md` — Gemini / Antigravity-style workflows
- `.github/copilot-instructions.md` — GitHub Copilot repository instructions
- `.cursor/rules/cinematic-ui.mdc` — Cursor (auto-loaded on clone)
- `.windsurf/rules/cinematic-ui.md` — Windsurf (auto-loaded on clone)

These files should stay aligned in meaning, even if wording differs slightly by tool.
