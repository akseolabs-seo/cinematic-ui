# Cinematic Layout

<p align="center">
  <img src="./docs/banner.svg" alt="Cinematic Layout Banner" width="100%" />
</p>

<p align="center">
  <strong>監督と映画のリサーチを、高品質なウェブサイトのリズム・空間・光・構図に変換する。</strong>
</p>

<p align="center">
  <a href="./README.md">English</a> ·
  <a href="./README.zh-TW.md">繁體中文</a> ·
  <a href="./README.zh-CN.md">简体中文</a> ·
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
</p>

<p align="center">
  <a href="https://www.threads.com/@darkseoking"><img src="https://img.shields.io/badge/Follow%20on%20Threads-%40darkseoking-f1e2cf?style=for-the-badge&logo=threads&logoColor=111111&labelColor=f1e2cf" alt="Follow @darkseoking on Threads"></a>
  <a href="https://xhslink.com/m/3fZJnT4jDHe"><img src="https://img.shields.io/badge/Follow%20on%20RED-%40AK-ff2442?style=for-the-badge&labelColor=ff2442&logoColor=ffffff" alt="Follow @AK on 小紅書"></a>
</p>

---

## なぜ他と違うのか

多くの AI デザイン skill は**ルックアップテーブル**です。

67 種のスタイル、161 色のパレット、50 種のコンポーネントパターンを AI に渡し、AI がメニューから選ぶ。結果は技術的にきれいで、ときに洗練されていて、そして確実に印象に残らない。AI は考えていない。ショッピングをしているだけだ。

**Cinematic UI は思考フレームワークであり、素材ライブラリではない。**

AI にメニューを渡す代わりに、このスキルは本物の映画監督が行う方法で AI を動かします：

1. 特定の監督と特定の映画をリサーチする——照明ロジック、フレーミング規律、シーンリズム、マテリアル感覚
2. その映画のビジュアル言語が構造的に機能する理由を抽出する
3. サイトのオリジナルビジュアルテーゼを開発する：このページはどんなシーンか？ここで代替不可能な構図は何か？
4. すべてのレイアウト決定をその映画言語に照らして正当化する
5. そうして初めて CSS、モーション、実装を形式化する

出力の違いは程度の問題ではない。結果のカテゴリが違う。

ルックアップテーブルはサイトのように見えるサイトを生む。監督のワークフローは、視点を持った誰かが作ったと感じられるサイトを生む。

> AI は棚から商品を選ぶ店員ではない。
> AI は監督だ。映画がブリーフで、ウェブサイトが制作物だ。

---

## これは何か

`cinematic-layout` は単なる「高級ウェブサイト用プロンプト」ではなく、特定のツール専用でもありません。

**クロスツール対応の映画言語ウェブサイトワークフロー**です。コアロジック：

1. **監督 + 具体的な映画作品**を選定する
2. ウェブアクセスが可能なら、まず監督と映画をリサーチ——撮影技法、照明、リズム、質感、シーンコントロール
3. 映画言語を**ウェブで実行可能なナラティブとレイアウトシステム**に変換する
4. 主要なページロールごとに独立したシーンと代替不可能な構図を定義する
5. 最後に HTML / CSS / JS の実装に進む

> 映画は仕様書ではない。映画はリサーチインプットである。
> コンピュータで実行可能なワークフローは、観察結果を `decisions.md`、`storyboard.md`、`compiled-spec.md`、実装に変換するところから始まる。

---

## 解決する課題

この skill は「AI が HTML を書けない」を解決するものではありません。AI が苦手になりやすい**上位のデザイン課題**を対象にしています：

| 課題 | 具体的な症状 | Skill の解決方法 |
|------|-----------|----------------|
| **リズム** | セクション順は妥当だがスライドのように平坦で、演出されたサイトに見えない | 監督のナラティブテンプレートで Hero → Features → Stats → CTA パターンを置換 |
| **空間** | 要素は揃っているが、視線の重み・距離・階層・圧力感が弱い | 各ページに Signature Composition を強制定義、デフォルト grid への退化を禁止 |
| **光** | 表面的な glow のみで、本格的な照明ロジック・影・質感制御がない | 実際の映画シーンから取色し、background-techniques ライブラリと組み合わせ |
| **高級感** | きれいだが、高価・抑制的・意図的には見えない | Premium Calibration チェックリストで「意図的にやらないこと」を明示 |
| **独自性** | デモを重ねるとヒーロー構え・セクションリズム・ジオメトリが繰り返し始める | Demo Uniqueness Protocol：履歴監査 + Shell-ban list を毎回実施 |

---

## コア機能

| 機能 | 説明 |
|------|------|
| **推論優先** | AI はプリセットライブラリから選ぶのではなく、オリジナルのビジュアルテーゼを開発しなければならない |
| **Director-first** | 感情の方向性は映画から。汎用ラグジュアリーブランディングからではない |
| **Research-first** | ウェブアクセスがあれば、Phase 1 を確定する前に監督と映画をリサーチ |
| **Start questionnaire gate** | 毎回のインボケーションで起動アンケートを完了してから Phase 1 に入る |
| **Storyboard-first** | `decisions.md`、`storyboard.md`、`compiled-spec.md` を書いてからフロントエンドコードを書く |
| **Demo Uniqueness Protocol** | 同一ユーザーの過去の成果物を監査し、Shell-ban list でシェルの繰り返しを防止 |
| **Anti-grid fallback** | Grid は見えない整列インフラとしてのみ使用可能——可視的なデフォルト構図としては不可 |
| **Sub-agent friendly** | 映画リサーチ、ニッチリサーチ、ページシーン、スペックスライス、検証をサブエージェントに委任可能。リードエージェントが最終統合を維持 |

---

## ワークフロー

| Phase | 主な作業 | 出力アーティファクト |
|-------|---------|-------------------|
| **Phase 1 — Decisions** | 起動アンケート完了、監督 + 映画選定、uniqueness audit、ウェブアクセス可能なら映画リサーチ | `decisions.md` |
| **Phase 2 — Storyboard** | サイト全体の映画文法定義、各ページロールの scene thesis、各ページの signature composition 確定 | `storyboard.md` |
| **Phase 3 — Compiled Spec** | storyboard に基づき camera / interaction / composition / texture / typography を抽出、共有システムは最後 | `compiled-spec.md` |
| **Phase 4 — Build & Verify** | spec に基づき実装、reduced-motion / responsive 追加、anti-garbage rules で検証 | HTML / CSS / JS |

> **Phase 2 内部順序（スキップ不可）：**
> サイト全体の映画文法 → 各ページの scene thesis → 各ページの signature composition → 共有システム

---

## 対応 AI / Agent ツール

このリポジトリはクロスエージェント skill パッケージとして設計されています。**Claude Code と OpenAI Codex が二つのプライマリプラットフォームです。**

| ツール | エントリファイル | インストール / 設定 |
|--------|--------------|-----------------|
| **Claude Code**（プライマリ） | [`CLAUDE.md`](./CLAUDE.md) | `~/.claude/skills/cinematic-ui` |
| **Codex / ChatGPT**（プライマリ） | [`CODEX.md`](./CODEX.md) | `$CODEX_HOME/skills/cinematic-ui` |
| **Cursor** | `.cursor/rules/cinematic-ui.mdc` | `.cursor/rules/` に配置済み — クローンで動作 |
| **Windsurf** | `.windsurf/rules/cinematic-ui.md` | `.windsurf/rules/` に配置済み — クローンで動作 |
| **GitHub Copilot** | [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) | `.github/` に配置済み — クローンで動作 |
| **Gemini / Antigravity** | [`GEMINI.md`](./GEMINI.md) | プロジェクト起動時に読み込み |
| **クロスツール共通** | [`AGENTS.md`](./AGENTS.md) | すべてのツールの共通リファレンス |

---

## References ライブラリ索引

すべての参考データは `references/` ディレクトリ内に、Phase 別に整理されています：

### コアルールファイル

| ファイル | 用途 |
|---------|------|
| [`references/premium-calibration.md`](./references/premium-calibration.md) | Director brief 完了後、デザインの抑制と品質を自己チェック |
| [`references/anti-garbage.md`](./references/anti-garbage.md) | AI によくあるデザイン劣化パターン、Phase 3 + Phase 4 でチェック |
| [`references/anti-convergence.md`](./references/anti-convergence.md) | Hash-based 選択システム、デモ間・ページ間のシェル収束を防止 |
| [`references/implementation-guardrails.md`](./references/implementation-guardrails.md) | Phase 3–4 の具体的な品質ルール：JS エフェクトリスト、Entrance Map 規範、Phase 3 チェックリスト、Punch Up / Pull Back 調整プロトコル |
| [`references/reference-protocol.md`](./references/reference-protocol.md) | ユーザーが参考サイトを提示した際、コピーせず分解借鑑する方法 |
| [`references/output-templates.md`](./references/output-templates.md) | 各 phase アーティファクトの標準フォーマットテンプレート |
| [`references/library-index.md`](./references/library-index.md) | AI に各 phase で読むべきファイル・読まないべきファイルを指示 |

### Phase 1

| ファイル | 内容 |
|---------|------|
| `references/data/directors-200.md` | 200+ 名の監督、ジャンル別分類、代表作と視覚スタイル記述 |

### Phase 2

| ファイル | 内容 |
|---------|------|
| `references/data/hero-archetypes.md` | 30 種のヒーロースケルトンオプション |
| `references/data/narrative-beats.md` | 25 のナラティブビート + 18 名の監督アークテンプレート |
| `references/data/section-functions.md` | 50 種の機能的セクションタイプ |
| `references/data/section-archetypes.md` | 91+ 種のセクションスケルトンオプション |
| `references/data/dna-index.tsv` | 1,486 サイトの Design DNA インデックス、mood / タイポグラフィ / モーション / radius で検索可能 |
| `references/data/design-dna-db.txt` | DNA インデックスでヒットした後の詳細サイトデータ |

### Phase 3

| ファイル | 内容 |
|---------|------|
| `references/data/camera-shots-50.md` | 55 種の入場 / reveal 動作の CSS |
| `references/data/interaction-effects-50.md` | 55+ 種の hover / click / scroll インタラクション（JS 必要版を含む） |
| `references/data/compositions.md` | 80 種のレイアウト構図と grid ロジック |
| `references/data/visual-elements.md` | 40 種のビジュアル装飾要素（frame、badge、glow、halo、separator…） |
| `references/data/background-techniques.md` | 50+ 種のヒーロー背景と雰囲気レイヤー技法 |
| `references/data/typography-cinema.md` | 40+ 種のテキストパフォーマンスと階層処理 |
| `references/data/color-grades.md` | 40+ 種の映画パレットから UI トークンへの変換 |
| `references/data/font-moods.md` | 30+ 種のフォントペアリング、トーン別 |
| `references/data/textures.md` | 30+ 種の grain / grid / dust / scan line テクスチャ |
| `references/data/image-direction.md` | 画像プレースホルダーを含むデザイン時のみ使用 |
| `references/data/visual-styles.md` | スタイルクロスリファレンス、レイアウトの主要ソースではない |

---

## インストール

### 方法 1：Claude Code（推奨）

**Windows：**
```powershell
git clone https://github.com/akseolabs-seo/cinematic-ui "$env:USERPROFILE\.claude\skills\cinematic-layout"
```

**macOS / Linux：**
```bash
git clone https://github.com/akseolabs-seo/cinematic-ui ~/.claude/skills/cinematic-ui
```

インストール後、Claude Code 内で `/cinematic-ui` を入力して呼び出します。

### 方法 2：Cursor / Windsurf / GitHub Copilot

```bash
git clone https://github.com/akseolabs-seo/cinematic-ui
```

`.cursor/rules/`、`.windsurf/rules/`、`.github/copilot-instructions.md` はすでに配置済みです。クローン後すぐにルールが有効になります。

### 方法 3：他のツールの skills ディレクトリ

**Codex 系ツール：**
```bash
git clone https://github.com/akseolabs-seo/cinematic-ui $CODEX_HOME/skills/cinematic-ui
```

### 方法 4：クロスツール repo 指示パッケージとして使用

このリポジトリを AI ツールが読み取れる場所に配置し、対応するエントリファイルを読ませます（上記ツール表を参照）。

---

## 推奨プロンプトパターン

```text
cinematic-layout でトップページを作ってください。
監督と映画はお任せします。
ウェブアクセスが可能なら、まず監督と映画をリサーチしてください。
Demo Uniqueness Protocol を実行してください。
以前のデモのシェルを再利用しないでください。
共有システムより先に、単一ページの完成度を優先してください。
```

---

## ディレクトリ構造

```text
cinematic-layout/
├── SKILL.md                          ← メイン skill ロジックエントリ（Claude Code プライマリ）
├── skill.json                        ← skill メタデータ
├── directors-library.md              ← レガシー互換ファイル
├── AGENTS.md                         ← クロスツール agent 指示
├── CLAUDE.md                         ← Claude Code 専用
├── CODEX.md                          ← Codex / ChatGPT 専用
├── GEMINI.md                         ← Gemini / Antigravity 専用
├── CHANGELOG.md                      ← バージョン履歴
├── LICENSE
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── agents/                           ← エージェント共通ファイル
├── docs/
│   └── banner.svg
├── .cursor/
│   └── rules/
│       └── cinematic-ui.mdc      ← Cursor 専用（クローンで自動有効）
├── .windsurf/
│   └── rules/
│       └── cinematic-ui.md       ← Windsurf 専用（クローンで自動有効）
├── .github/
│   ├── copilot-instructions.md       ← GitHub Copilot 専用
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
└── references/
    ├── anti-garbage.md
    ├── anti-convergence.md
    ├── implementation-guardrails.md
    ├── library-index.md
    ├── output-templates.md
    ├── premium-calibration.md
    ├── reference-protocol.md
    └── data/                         ← 18 個のデザインデータライブラリ（合計約 600KB）
```

---

## コントリビューション

issue / PR 歓迎。まず [CONTRIBUTING.md](./CONTRIBUTING.md) をお読みください。

## ライセンス

MIT。[LICENSE](./LICENSE) を参照。
