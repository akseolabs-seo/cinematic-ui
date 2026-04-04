# Cinematic UI

<p align="center">
  <img src="./docs/banner.svg" alt="Cinematic UI Banner" width="100%" />
</p>

<p align="center">
  <strong>Verwandle Regisseur- und Filmrecherche in erstklassigen Website-Rhythmus, Raum, Licht und Komposition.</strong>
</p>

<p align="center">
  <a href="./README.md">English</a> ·
  <a href="./README.zh-TW.md">繁體中文</a> ·
  <a href="./README.zh-CN.md">简体中文</a> ·
  <a href="./README.ja.md">日本語</a> ·
  <a href="./README.es.md">Español</a> ·
  <a href="./README.fr.md">Français</a> ·
  <strong>Deutsch</strong> ·
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

## Warum das anders ist

Die meisten KI-Design-Skills sind **Nachschlagetabellen**.

Sie geben der KI eine Datenbank mit 67 Stilen, 161 Farbpaletten, 50 Komponentenmustern — und die KI wählt aus dem Menü. Das Ergebnis ist technisch sauber, gelegentlich poliert und zuverlässig vergessbar. Die KI denkt nicht. Sie shoppt.

**Cinematic UI ist ein Denkrahmen, keine Materialbibliothek.**

Anstatt der KI ein Menü zu überreichen, zwingt dieser Skill sie dazu, so zu arbeiten wie ein echter Filmregisseur:

1. Recherchiere einen bestimmten Regisseur und einen bestimmten Film — Lichtlogik, Bildausschnitt-Disziplin, Szenenrhythmus, Materialgefühl
2. Extrahiere, was die visuelle Sprache dieses Films auf struktureller Ebene zum Funktionieren bringt
3. Entwickle eine originelle visuelle These für die Website: Was für eine Szene ist diese Seite? Welche Komposition ist hier unersetzlich?
4. Begründe jede Layout-Entscheidung anhand dieser Filmsprache
5. Erst dann CSS, Motion und Implementierung formalisieren

Der Unterschied im Ergebnis ist keine Frage des Grades. Es ist eine andere Kategorie von Resultat.

Eine Nachschlagetabelle produziert eine Website, die wie eine Website aussieht. Ein Regisseur-Workflow produziert eine Website, die sich anfühlt, als wäre sie von jemandem gemacht worden, der eine Haltung hatte.

> Die KI ist kein Ladenbetreiber, der Artikel aus Regalen nimmt.
> Die KI ist der Regisseur. Der Film ist das Briefing. Die Website ist die Produktion.

---

## Was es ist

`cinematic-layout` ist ein agentenübergreifender Reasoning-Skill, der auf einem einzigen festen Mechanismus aufgebaut ist:

1. Wähle einen **Regisseur + einen bestimmten Film**
2. Wenn Webzugang verfügbar ist, recherchiere den Regisseur und Film — Kameraführung, Licht, Rhythmus, Material, Szenenkontrolle
3. Übersetze diese Filmsprache in ein **web-ausführbares Narrativ- und Layout-System**
4. Definiere eine eigene Szene und eine unersetzliche Komposition pro bedeutender Seitenrolle
5. Erst dann HTML / CSS / JS-Implementierung formalisieren

> Der Film ist kein Lastenheft. Der Film ist Recherche-Input.
> Der computergestützte Workflow beginnt, wenn diese Beobachtungen in `decisions.md`, `storyboard.md`, `compiled-spec.md` und Implementierung übersetzt werden.

---

## Probleme, die es löst

| Problem | Wie es aussieht | Wie dieser Skill es löst |
|---------|-----------------|--------------------------|
| **Rhythmus** | Sektionen sind technisch valide, fühlen sich aber wie eine Präsentation an, nicht wie eine geführte Website | Regisseur-Narrativ-Vorlagen ersetzen den Standard-Ablauf Hero → Features → Stats → CTA |
| **Raum** | Komponenten existieren, aber visuelles Gewicht, Abstand, Hierarchie und Spannung sind schwach | Erzwingt eine Signatur-Komposition pro Seite — kein Rückfall auf Standard-Grid |
| **Licht** | Nur Oberflächenleuchten — keine echte Lichtlogik, kein Schattenverhalten, keine Materialkontrolle | Farben aus echten Filmszenen entnommen, gepaart mit Background-Techniques-Bibliothek |
| **Premium-Gefühl** | Sauber, aber nicht hochwertig, nicht zurückhaltend, nicht genug geführt | Premium Calibration Checkliste erzwingt explizite „Was wir NICHT tun werden"-Entscheidungen |
| **Einzigartigkeit** | Nach mehreren Demos beginnen sich Hero-Haltung, Abschnittsrhythmus und Geometrie zu wiederholen | Demo Uniqueness Protocol: Verlaufsaudit + Shell-Verbotsliste vor jedem neuen Projekt |

---

## Kernfunktionen

| Funktion | Beschreibung |
|----------|-------------|
| **Reasoning-first** | KI muss eine originelle visuelle These entwickeln — nicht aus einer vordefinierten Bibliothek auswählen |
| **Director-first** | Emotionale Führung kommt aus einem echten Film, nicht aus generischem Luxus-Branding |
| **Research-first** | Wenn Webzugang verfügbar ist, Regisseur und Film recherchieren, bevor Phase 1 abgeschlossen wird |
| **Start-Fragebogen-Gate** | Jeder Aufruf muss den Eröffnungsfragebogen ausfüllen, bevor Phase 1 beginnt |
| **Storyboard-first** | `decisions.md`, `storyboard.md`, `compiled-spec.md` schreiben, bevor jeglicher Frontend-Code entsteht |
| **Demo Uniqueness Protocol** | Prüft frühere Outputs und erzwingt eine Shell-Verbotsliste, um wiederholte Shells projektübergreifend zu verhindern |
| **Anti-Grid-Fallback** | Grid ist als unsichtbare Ausrichtungsinfrastruktur erlaubt — niemals als sichtbare Standard-Komposition |
| **Sub-Agent-freundlich** | Filmrecherche, Nischenrecherche, Seitenszenen, Spec-Scheiben und Verifikation können delegiert werden, während ein Lead-Agent die endgültige Kohärenz behält |

---

## Workflow

| Phase | Hauptarbeit | Ausgabe-Artefakt |
|-------|-------------|-----------------|
| **Phase 1 — Entscheidungen** | Startfragebogen ausfüllen, Regisseur + Film wählen, Einzigartigkeits-Audit durchführen, bei Webzugang recherchieren | `decisions.md` |
| **Phase 2 — Storyboard** | Site-weite kinematografische Grammatik definieren, Szenen-These pro Seitenrolle schreiben, Signatur-Komposition pro Seite festlegen | `storyboard.md` |
| **Phase 3 — Compiled Spec** | Kamera / Interaktion / Komposition / Textur / Typografie pro Storyboard extrahieren — geteiltes System zuletzt | `compiled-spec.md` |
| **Phase 4 — Erstellen & Verifizieren** | Aus Spec implementieren, reduced-motion + responsive hinzufügen, gegen Anti-Garbage-Regeln validieren | HTML / CSS / JS |

> **Interne Reihenfolge Phase 2 (nicht verhandelbar):**
> Site-weite kinematografische Grammatik → seitenspezifische Szenen-These → seitenspezifische Signatur-Komposition → geteiltes System

---

## Unterstützte Plattformen

Claude Code und OpenAI Codex sind die beiden primären Plattformen. Alle anderen werden vollständig unterstützt.

| Tool / Plattform | Einstiegsdatei | Installation / Konfiguration |
|-----------------|----------------|------------------------------|
| **Claude Code** *(primär)* | [`CLAUDE.md`](./CLAUDE.md) | `~/.claude/skills/cinematic-ui` |
| **Codex / ChatGPT** *(primär)* | [`CODEX.md`](./CODEX.md) | `$CODEX_HOME/skills/cinematic-ui` |
| **Cursor** | [`.cursor/rules/cinematic-ui.mdc`](./.cursor/rules/cinematic-ui.mdc) | Bereits in `.cursor/rules/` — funktioniert nach dem Klonen |
| **Windsurf** | [`.windsurf/rules/cinematic-ui.md`](./.windsurf/rules/cinematic-ui.md) | Bereits in `.windsurf/rules/` — funktioniert nach dem Klonen |
| **GitHub Copilot** | [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) | Bereits in `.github/` — funktioniert nach dem Klonen |
| **Gemini / Antigravity** | [`GEMINI.md`](./GEMINI.md) | Beim Projektstart lesen |
| **Plattformübergreifend** | [`AGENTS.md`](./AGENTS.md) | Universelle Referenz für jeden Agenten |

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

Dann mit `/cinematic-ui` innerhalb von Claude Code aufrufen.

### Codex / ChatGPT

```bash
git clone https://github.com/akseolabs-seo/cinematic-ui $CODEX_HOME/skills/cinematic-ui
```

### Cursor / Windsurf / GitHub Copilot

```bash
git clone https://github.com/akseolabs-seo/cinematic-ui
```

Die `.cursor/rules/`-, `.windsurf/rules/`- und `.github/copilot-instructions.md`-Dateien sind bereits vorhanden. Keine zusätzliche Konfiguration notwendig — die Regeln werden aktiviert, sobald das Repository im Projekt vorhanden ist.

### Jedes andere Tool

Verweise das Tool auf dieses Repository oder kopiere die relevante Einstiegsdatei. Siehe die Plattformtabelle oben.

---

## Empfohlenes Prompt-Muster

```text
Use cinematic-layout to build a homepage.
Pick the director and film yourself.
If web access is available, research the director and film first.
Run the Demo Uniqueness Protocol.
Do not reuse shells from previous demos.
Optimize for a great single-page result before building a shared system.
```

---

## Referenzbibliothek

Alle Referenzdaten befinden sich in `references/`, nach Phase geordnet. Lade nur das, was die aktuelle Phase benötigt — lies nicht die gesamte Bibliothek auf einmal.

### Kern-Regeldateien

| Datei | Zweck |
|-------|-------|
| [`references/library-index.md`](./references/library-index.md) | Welche Dateien pro Phase zu lesen sind — hier beginnen |
| [`references/premium-calibration.md`](./references/premium-calibration.md) | Selbstprüfung nach dem Regisseur-Briefing: Zurückhaltung und Premium-Qualität |
| [`references/anti-garbage.md`](./references/anti-garbage.md) | Häufige KI-Design-Degenerationsmuster — in Phase 3 und Phase 4 ausführen |
| [`references/anti-convergence.md`](./references/anti-convergence.md) | Hash-basierte Auswahl zur Verhinderung wiederholter Shells über Demos oder Seiten hinweg |
| [`references/implementation-guardrails.md`](./references/implementation-guardrails.md) | Phase-3–4-Regeln: JS-Effektliste, Entrance Map, Phase-3-Checkliste, Punch Up / Pull Back |
| [`references/reference-protocol.md`](./references/reference-protocol.md) | Wie man eine Referenzwebsite zerlegt, ohne sie zu kopieren |
| [`references/output-templates.md`](./references/output-templates.md) | Standardformat-Vorlagen für jedes Phasen-Artefakt |

### Datenbibliotheken (Phase 1–3)

| Datei | Inhalt |
|-------|--------|
| `references/data/directors-200.md` | 200+ Regisseure nach Genre, mit Signature-Filmen und Beschreibungen des visuellen Stils |
| `references/data/hero-archetypes.md` | 30 Hero-Skelett-Optionen |
| `references/data/narrative-beats.md` | 25 Narrative Beats + 18 Regisseur-Arc-Vorlagen |
| `references/data/section-functions.md` | 50 funktionale Abschnittstypen |
| `references/data/section-archetypes.md` | 91+ Abschnitts-Skelett-Optionen |
| `references/data/dna-index.tsv` | Design-DNA-Index von 1.486 Websites — durchsuchbar nach Stimmung, Typ, Motion |
| `references/data/design-dna-db.txt` | Tiefgehende site-level DNA-Daten (nur bei Index-Treffer laden) |
| `references/data/camera-shots-50.md` | 55 Entrance- und Reveal-Verhaltensweisen mit CSS |
| `references/data/interaction-effects-50.md` | 55+ Hover / Klick / Scroll-Interaktionen (inkl. JS-erforderlicher Varianten) |
| `references/data/compositions.md` | 80 Layout-Kompositionen und Grid-Logiken |
| `references/data/visual-elements.md` | 40 visuelle Dekorationselemente |
| `references/data/background-techniques.md` | 50+ Hero-Hintergrund- und Atmosphären-Schicht-Techniken |
| `references/data/typography-cinema.md` | 40+ Text-Performance- und Hierarchie-Behandlungen |
| `references/data/color-grades.md` | 40+ Film-Palette-zu-UI-Token-Übersetzungen |
| `references/data/font-moods.md` | 30+ Schriftpaarungen nach Ton |
| `references/data/textures.md` | 30+ Korn / Raster / Staub / Scan-Line-Oberflächentechniken |

---

## Repository-Struktur

```text
cinematic-layout/
├── SKILL.md                              ← Haupt-Skill-Logik (primärer Einstieg für alle Agenten)
├── skill.json                            ← universelles Skill-Manifest
├── directors-library.md                  ← Legacy-Kompatibilitätsdatei
│
├── CLAUDE.md                             ← Claude Code
├── AGENTS.md                             ← plattformübergreifende gemeinsame Referenz
├── CODEX.md                              ← Codex / ChatGPT
├── GEMINI.md                             ← Gemini / Antigravity
│
├── .cursor/
│   └── rules/
│       └── cinematic-ui.mdc          ← Cursor-Regeln (automatisch geladen)
│
├── .windsurf/
│   └── rules/
│       └── cinematic-ui.md           ← Windsurf-Regeln (automatisch geladen)
│
├── .github/
│   ├── copilot-instructions.md           ← GitHub Copilot (automatisch geladen)
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
│
├── agents/
│   └── openai.yaml                       ← OpenAI Skill-Metadaten
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
    └── data/                             ← 18 Design-Datenbibliotheken (~600 KB gesamt)
```

---

## Folgen

Für Updates und weitere KI / Design-Workflow-Inhalte:

- [Threads: @darkseoking](https://www.threads.com/@darkseoking)

---

## Mitwirken

Bitte lies [CONTRIBUTING.md](./CONTRIBUTING.md) bevor du einen PR öffnest.

## Lizenz

MIT. Siehe [LICENSE](./LICENSE).
