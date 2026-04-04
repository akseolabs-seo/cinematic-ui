# Contributing

The default language of this repo is **English**. Multilingual docs are welcome as supplements.

Core constraints that must be preserved in all contributions:

- `SKILL.md` stays lean — push details into `references/`
- Do not turn this into a generic premium web prompt
- Director + film must remain the emotional source
- New rules that affect multi-demo output must be checked against the `Demo Uniqueness Protocol`

## Pull Request Guidelines

### 1. Protect the core chain

Do not remove:

```
director + film → decisions → storyboard → compiled-spec → build
```

### 2. Keep SKILL.md lean

Push the following into `references/`, not into `SKILL.md`:

- large examples
- detailed checklists
- variant rules
- large data sets

### 3. Sync templates when changing workflow rules

If you change a workflow rule, also check:

- `references/output-templates.md`
- `references/premium-calibration.md`
- `references/anti-garbage.md`

Avoid mismatches between the main entry and the reference files.

### 4. Preserve Demo Uniqueness Protocol

If you adjust demo quality or homepage output rules, verify you have not broken:

- `Previous-work audit`
- `Shell-ban list`
- `Primary composition family`
- `Wireframe-level uniqueness test`

### 5. Sync agent config files

If the purpose or description of `SKILL.md` changes meaningfully, also update:

- `CLAUDE.md`
- `CODEX.md`
- `GEMINI.md`
- `AGENTS.md`
- `agents/openai.yaml`
- `.cursor/rules/cinematic-ui.mdc`
- `.windsurf/rules/cinematic-ui.md`
- `.github/copilot-instructions.md`

All agent files should stay aligned in intent even if wording differs slightly by platform.

## Suggested Contributions

Good PR types:

- Improve cross-page consistency without sacrificing page-level unique composition
- Strengthen anti-template / anti-grid fallback rules
- Add or improve multilingual documentation
- Fix installation, documentation, structure, or metadata issues
- Add support for new agent platforms

Discouraged PR types:

- Turning this into a generic luxury landing page skill
- Stuffing all variants back into `SKILL.md`
- Changing surface wording without syncing templates and rule files

## Documentation Languages

- `README.md` — English (default)
- `README.zh-TW.md` — Traditional Chinese
- `README.zh-CN.md` — Simplified Chinese
- `README.ja.md` — Japanese
- Other repo files — English preferred; multilingual supplements welcome
