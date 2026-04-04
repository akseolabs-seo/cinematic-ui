# Cinematic UI

<p align="center">
  <img src="./docs/banner.svg" alt="Cinematic UI Banner" width="100%" />
</p>

<p align="center">
  <strong>Transformez la recherche sur les réalisateurs et les films en rythme, espace, lumière et composition premium pour les sites web.</strong>
</p>

<p align="center">
  <a href="./README.md">English</a> ·
  <a href="./README.zh-TW.md">繁體中文</a> ·
  <a href="./README.zh-CN.md">简体中文</a> ·
  <a href="./README.ja.md">日本語</a> ·
  <a href="./README.es.md">Español</a> ·
  <strong>Français</strong> ·
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

## Pourquoi C'est Différent

La plupart des compétences de design par IA sont des **tables de correspondance**.

Elles donnent à l'IA une base de données de 67 styles, 161 palettes de couleurs, 50 patterns de composants — et l'IA choisit dans le menu. Le résultat est techniquement propre, parfois soigné, et invariablement oubliable. L'IA ne réfléchit pas. Elle fait ses courses.

**Cinematic UI est un cadre de raisonnement, pas une bibliothèque de matériaux.**

Au lieu de donner un menu à l'IA, cette compétence la force à travailler comme un vrai réalisateur de cinéma :

1. Rechercher un réalisateur précis et un film précis — logique d'éclairage, discipline de cadrage, rythme des scènes, sens des matières
2. Extraire ce qui fait fonctionner le langage visuel de ce film à un niveau structurel
3. Développer une thèse visuelle originale pour le site : quel type de scène est cette page ? quelle composition est irremplaçable ici ?
4. Justifier chaque décision de mise en page face à ce langage filmique
5. Seulement alors formaliser le CSS, le mouvement et l'implémentation

La différence de résultat n'est pas une question de degré. C'est une catégorie de résultat différente.

Une table de correspondance produit un site qui ressemble à un site. Le flux de travail d'un réalisateur produit un site qui donne l'impression d'avoir été créé par quelqu'un qui avait un point de vue.

> L'IA n'est pas un épicier qui choisit des articles sur des étagères.
> L'IA est le réalisateur. Le film est le brief. Le site web est la production.

---

## Ce Que C'est

`cinematic-layout` est une compétence de raisonnement multi-agent construite autour d'un mécanisme fixe unique :

1. Choisir un **réalisateur + film spécifique**
2. Si l'accès web est disponible, rechercher ce réalisateur et ce film — cinématographie, éclairage, rythme, matière, contrôle des scènes
3. Traduire ce langage filmique en un **système narratif et de mise en page exécutable sur le web**
4. Définir une scène distincte et une composition irremplaçable par rôle de page principal
5. Seulement alors formaliser l'implémentation HTML / CSS / JS

> Le film n'est pas un cahier des charges. Le film est une source de recherche.
> Le flux de travail opérable par ordinateur commence lorsque ces observations sont traduites en `decisions.md`, `storyboard.md`, `compiled-spec.md` et en implémentation.

---

## Problèmes Qu'il Résout

| Problème | À Quoi Ça Ressemble | Comment Cette Compétence Le Résout |
|---------|-------------------|--------------------------|
| **Rythme** | Les sections sont techniquement valides mais donnent l'impression d'être un diaporama, pas un site dirigé | Les modèles narratifs de réalisateur remplacent le flux par défaut Hero → Fonctionnalités → Stats → CTA |
| **Espace** | Les composants existent mais le poids visuel, la distance, la hiérarchie et la tension sont faibles | Force une Composition Signature par page — pas de repli sur la grille par défaut |
| **Lumière** | Seulement un éclat de surface — pas de logique d'éclairage réelle, ni de comportement des ombres, ni de contrôle des matières | Couleurs extraites de vraies scènes de films, associées à la bibliothèque de techniques de fond |
| **Sensation premium** | Propre mais pas coûteux, pas sobre, pas assez dirigé | La liste de contrôle de Calibrage Premium force des décisions explicites sur "ce que nous NE ferons PAS" |
| **Unicité** | Après plusieurs démos, la posture du héros, le rythme des sections et la géométrie commencent à se répéter | Protocole d'Unicité de Démo : audit de l'historique + liste d'interdiction de Shell avant chaque nouveau projet |

---

## Fonctionnalités Principales

| Fonctionnalité | Description |
|---------|-------------|
| **Raisonnement d'abord** | L'IA doit développer une thèse visuelle originale — sans sélectionner dans une bibliothèque préétablie |
| **Réalisateur d'abord** | La direction émotionnelle provient d'un vrai film, pas d'une marque de luxe générique |
| **Recherche d'abord** | Lorsque l'accès web est disponible, rechercher le réalisateur et le film avant de valider la Phase 1 |
| **Questionnaire de démarrage** | Chaque invocation doit compléter le questionnaire initial avant que la Phase 1 commence |
| **Storyboard d'abord** | Écrire `decisions.md`, `storyboard.md`, `compiled-spec.md` avant tout code frontend |
| **Protocole d'Unicité de Démo** | Audite les résultats précédents et applique une liste d'interdiction de Shell pour éviter les shells répétés entre les projets |
| **Anti-grille par défaut** | La grille est autorisée comme infrastructure d'alignement invisible — jamais comme composition visible par défaut |
| **Compatible sous-agents** | La recherche filmique, de niche, les scènes de page, les tranches de spec et la vérification peuvent être déléguées pendant qu'un agent principal maintient la cohérence finale |

---

## Flux de Travail

| Phase | Travail Principal | Artefact de Sortie |
|-------|-----------|----------------|
| **Phase 1 — Décisions** | Compléter le questionnaire de démarrage, choisir réalisateur + film, lancer l'audit d'unicité, rechercher si l'accès web est disponible | `decisions.md` |
| **Phase 2 — Storyboard** | Définir la grammaire cinématique du site entier, écrire la thèse de scène par rôle de page, fixer la composition signature par page | `storyboard.md` |
| **Phase 3 — Spec Compilée** | Extraire caméra / interaction / composition / texture / typographie par storyboard — système partagé en dernier | `compiled-spec.md` |
| **Phase 4 — Construction et Vérification** | Implémenter depuis la spec, ajouter mouvement réduit + responsive, valider contre les règles anti-déchet | HTML / CSS / JS |

> **Ordre interne de la Phase 2 (non négociable) :**
> Grammaire cinématique du site → thèse de scène par page → composition signature par page → système partagé

---

## Plateformes Supportées

Claude Code et OpenAI Codex sont les deux plateformes principales. Toutes les autres sont entièrement supportées.

| Outil / Plateforme | Fichier d'Entrée | Installation / Config |
|----------------|-----------|-----------------|
| **Claude Code** *(primary)* | [`CLAUDE.md`](./CLAUDE.md) | `~/.claude/skills/cinematic-ui` |
| **Codex / ChatGPT** *(primary)* | [`CODEX.md`](./CODEX.md) | `$CODEX_HOME/skills/cinematic-ui` |
| **Cursor** | [`.cursor/rules/cinematic-ui.mdc`](./.cursor/rules/cinematic-ui.mdc) | Déjà dans `.cursor/rules/` — fonctionne au clonage |
| **Windsurf** | [`.windsurf/rules/cinematic-ui.md`](./.windsurf/rules/cinematic-ui.md) | Déjà dans `.windsurf/rules/` — fonctionne au clonage |
| **GitHub Copilot** | [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) | Déjà dans `.github/` — fonctionne au clonage |
| **Gemini / Antigravity** | [`GEMINI.md`](./GEMINI.md) | Lire au démarrage du projet |
| **Partagé entre outils** | [`AGENTS.md`](./AGENTS.md) | Référence universelle pour tout agent |

---

## Installation

### Claude Code

**Windows :**
```powershell
git clone https://github.com/akseolabs-seo/cinematic-ui "$env:USERPROFILE\.claude\skills\cinematic-layout"
```

**macOS / Linux :**
```bash
git clone https://github.com/akseolabs-seo/cinematic-ui ~/.claude/skills/cinematic-ui
```

Puis invoquer avec `/cinematic-ui` dans Claude Code.

### Codex / ChatGPT

```bash
git clone https://github.com/akseolabs-seo/cinematic-ui $CODEX_HOME/skills/cinematic-ui
```

### Cursor / Windsurf / GitHub Copilot

```bash
git clone https://github.com/akseolabs-seo/cinematic-ui
```

Les fichiers `.cursor/rules/`, `.windsurf/rules/` et `.github/copilot-instructions.md` sont déjà en place. Aucune configuration supplémentaire n'est nécessaire — les règles s'activent dès que le dépôt est présent dans votre projet.

### Tout autre outil

Pointez l'outil vers ce dépôt ou copiez le fichier d'entrée pertinent. Consultez le tableau des plateformes ci-dessus.

---

## Modèle de Prompt Suggéré

```text
Use cinematic-layout to build a homepage.
Pick the director and film yourself.
If web access is available, research the director and film first.
Run the Demo Uniqueness Protocol.
Do not reuse shells from previous demos.
Optimize for a great single-page result before building a shared system.
```

---

## Bibliothèque de Références

Toutes les données de référence se trouvent dans `references/`, organisées par phase. Ne chargez que ce dont la phase actuelle a besoin — ne lisez pas toute la bibliothèque d'un coup.

### Fichiers de Règles Principaux

| Fichier | Rôle |
|------|---------|
| [`references/library-index.md`](./references/library-index.md) | Quels fichiers lire par phase — commencer ici |
| [`references/premium-calibration.md`](./references/premium-calibration.md) | Auto-vérification après le brief du réalisateur : sobriété et qualité premium |
| [`references/anti-garbage.md`](./references/anti-garbage.md) | Patterns courants de dégradation du design par IA — exécuter en Phase 3 et Phase 4 |
| [`references/anti-convergence.md`](./references/anti-convergence.md) | Sélection par hash pour éviter les shells répétés entre démos ou pages |
| [`references/implementation-guardrails.md`](./references/implementation-guardrails.md) | Règles des Phases 3–4 : liste d'effets JS, Carte d'Entrée, liste de contrôle Phase 3, Punch Up / Pull Back |
| [`references/reference-protocol.md`](./references/reference-protocol.md) | Comment décomposer un site de référence sans le copier |
| [`references/output-templates.md`](./references/output-templates.md) | Modèles de format standard pour chaque artefact de phase |

### Bibliothèques de Données (Phases 1–3)

| Fichier | Contenu |
|------|---------|
| `references/data/directors-200.md` | Plus de 200 réalisateurs par genre, avec films phares et descriptions de style visuel |
| `references/data/hero-archetypes.md` | 30 options de squelette pour le héros |
| `references/data/narrative-beats.md` | 25 beats narratifs + 18 modèles d'arc de réalisateur |
| `references/data/section-functions.md` | 50 types de sections fonctionnelles |
| `references/data/section-archetypes.md` | Plus de 91 options de squelette de section |
| `references/data/dna-index.tsv` | Index ADN de design de 1 486 sites — consultable par ambiance, type, mouvement |
| `references/data/design-dna-db.txt` | Données ADN profondes au niveau du site (charger uniquement sur correspondance d'index) |
| `references/data/camera-shots-50.md` | 55 comportements d'entrée et de révélation avec CSS |
| `references/data/interaction-effects-50.md` | Plus de 55 interactions hover / clic / scroll (inclut les variantes nécessitant JS) |
| `references/data/compositions.md` | 80 compositions de mise en page et logiques de grille |
| `references/data/visual-elements.md` | 40 éléments de décoration visuelle |
| `references/data/background-techniques.md` | Plus de 50 techniques de fond pour héros et couches d'atmosphère |
| `references/data/typography-cinema.md` | Plus de 40 traitements de performance textuelle et de hiérarchie |
| `references/data/color-grades.md` | Plus de 40 traductions de palette filmique en tokens d'UI |
| `references/data/font-moods.md` | Plus de 30 associations de polices par tonalité |
| `references/data/textures.md` | Plus de 30 techniques de surface grain / grille / poussière / ligne de balayage |

---

## Structure du Dépôt

```text
cinematic-layout/
├── SKILL.md                              ← logique principale de la compétence (entrée primaire pour tous les agents)
├── skill.json                            ← manifeste universel de la compétence
├── directors-library.md                  ← fichier de compatibilité hérité
│
├── CLAUDE.md                             ← Claude Code
├── AGENTS.md                             ← référence partagée entre outils
├── CODEX.md                              ← Codex / ChatGPT
├── GEMINI.md                             ← Gemini / Antigravity
│
├── .cursor/
│   └── rules/
│       └── cinematic-ui.mdc          ← Règles Cursor (chargement automatique)
│
├── .windsurf/
│   └── rules/
│       └── cinematic-ui.md           ← Règles Windsurf (chargement automatique)
│
├── .github/
│   ├── copilot-instructions.md           ← GitHub Copilot (chargement automatique)
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
│
├── agents/
│   └── openai.yaml                       ← Métadonnées de compétence OpenAI
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
    └── data/                             ← 18 bibliothèques de données de design (~600 Ko au total)
```

---

## Suivre

Pour les mises à jour et plus de contenu sur les flux de travail IA / design :

- [Threads : @darkseoking](https://www.threads.com/@darkseoking)

---

## Contribuer

Veuillez lire [CONTRIBUTING.md](./CONTRIBUTING.md) avant d'ouvrir une PR.

## Licence

MIT. Voir [LICENSE](./LICENSE).
