## What does this PR do?

<!-- One-sentence summary. -->

## Which area does it affect?

- [ ] SKILL.md / workflow logic
- [ ] Data libraries (`references/data/`)
- [ ] Rule files (`references/*.md`)
- [ ] Cross-agent files (AGENTS.md, CLAUDE.md, GEMINI.md, copilot-instructions.md, openai.yaml)
- [ ] Documentation / README
- [ ] Other

## Checklist

- [ ] `SKILL.md` stays lean — details pushed to `references/`
- [ ] If workflow rules changed → `references/output-templates.md`, `references/premium-calibration.md`, and `references/anti-garbage.md` are still consistent
- [ ] If demo output rules changed → Demo Uniqueness Protocol still works (shell-ban list, composition family, wireframe uniqueness)
- [ ] Core chain preserved: `director + film → decisions → storyboard → compiled-spec → build`
- [ ] Not turning this into a generic premium web prompt
- [ ] Multilingual READMEs updated if user-facing text changed (zh-TW, en, zh-CN, ja)
