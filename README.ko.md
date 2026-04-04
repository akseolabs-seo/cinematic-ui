# Cinematic UI

<p align="center">
  <img src="./docs/banner.svg" alt="Cinematic UI Banner" width="100%" />
</p>

<p align="center">
  <strong>감독과 영화 리서치를 프리미엄 웹사이트의 리듬, 공간, 빛, 구성으로 전환하세요.</strong>
</p>

<p align="center">
  <a href="./README.md">English</a> ·
  <a href="./README.zh-TW.md">繁體中文</a> ·
  <a href="./README.zh-CN.md">简体中文</a> ·
  <a href="./README.ja.md">日本語</a> ·
  <a href="./README.es.md">Español</a> ·
  <a href="./README.fr.md">Français</a> ·
  <a href="./README.de.md">Deutsch</a> ·
  <strong>한국어</strong> ·
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

## 이것이 다른 이유

대부분의 AI 디자인 스킬은 **참조 테이블**입니다.

AI에게 67개의 스타일, 161개의 색상 팔레트, 50개의 컴포넌트 패턴으로 이루어진 데이터베이스를 제공하고 — AI는 메뉴에서 선택합니다. 결과물은 기술적으로는 깔끔하고, 간혹 세련되며, 그리고 언제나 기억에 남지 않습니다. AI는 생각하지 않습니다. AI는 쇼핑을 하고 있을 뿐입니다.

**Cinematic UI는 소재 라이브러리가 아닌 사고 프레임워크입니다.**

AI에게 메뉴를 건네는 대신, 이 스킬은 AI가 실제 영화감독처럼 작업하도록 강제합니다:

1. 특정 감독과 특정 영화를 리서치한다 — 조명 논리, 프레이밍 규율, 장면 리듬, 소재 감각
2. 그 영화의 시각 언어가 구조적 수준에서 작동하는 이유를 추출한다
3. 사이트를 위한 독창적인 시각적 테제를 개발한다: 이 페이지는 어떤 장면인가? 여기서 대체 불가능한 구성은 무엇인가?
4. 모든 레이아웃 결정을 그 영화 언어에 근거해 정당화한다
5. 그런 다음에야 CSS, 모션, 구현을 공식화한다

결과물의 차이는 정도의 문제가 아닙니다. 완전히 다른 범주의 결과입니다.

참조 테이블은 사이트처럼 보이는 사이트를 만들어냅니다. 감독의 워크플로우는 뚜렷한 관점을 가진 누군가가 만든 것처럼 느껴지는 사이트를 만들어냅니다.

> AI는 선반에서 물건을 집는 상점 주인이 아닙니다.
> AI가 감독입니다. 영화가 브리프입니다. 웹사이트가 제작물입니다.

---

## 무엇인가

`cinematic-layout`은 하나의 고정된 메커니즘을 중심으로 구축된 에이전트 간 추론 스킬입니다:

1. **감독 + 특정 영화**를 선택한다
2. 웹 접근이 가능한 경우, 해당 감독과 영화를 리서치한다 — 촬영, 조명, 리듬, 소재, 장면 통제
3. 그 영화 언어를 **웹에서 실행 가능한 내러티브 및 레이아웃 시스템**으로 번역한다
4. 주요 페이지 역할마다 하나의 독특한 장면과 하나의 대체 불가능한 구성을 정의한다
5. 그런 다음에야 HTML / CSS / JS 구현을 공식화한다

> 영화는 사양서가 아닙니다. 영화는 리서치 입력입니다.
> 컴퓨터로 운용 가능한 워크플로우는 그 관찰들이 `decisions.md`, `storyboard.md`, `compiled-spec.md`, 그리고 구현으로 번역될 때 시작됩니다.

---

## 해결하는 문제들

| 문제 | 어떻게 보이는가 | 이 스킬이 해결하는 방법 |
|------|----------------|------------------------|
| **페이싱** | 섹션들이 기술적으로는 유효하지만 감독된 사이트가 아닌 슬라이드 덱처럼 느껴진다 | 감독 내러티브 템플릿이 기본 Hero → Features → Stats → CTA 흐름을 대체한다 |
| **공간** | 컴포넌트는 존재하지만 시각적 무게, 거리, 계층, 긴장감이 약하다 | 페이지당 시그니처 구성을 강제한다 — 기본 그리드로 돌아가는 것을 허용하지 않는다 |
| **빛** | 표면 빛나기만 있을 뿐 — 실제 조명 논리, 그림자 동작, 소재 제어가 없다 | 실제 영화 장면에서 색상을 가져오고, 배경 기법 라이브러리와 짝을 맞춘다 |
| **프리미엄 느낌** | 깔끔하지만 고급스럽지 않고, 절제되지 않고, 충분히 감독되지 않았다 | 프리미엄 캘리브레이션 체크리스트가 "우리가 하지 않을 것" 결정을 명시적으로 강제한다 |
| **독창성** | 여러 데모 이후 히어로 자세, 섹션 리듬, 기하학이 반복되기 시작한다 | 데모 고유성 프로토콜: 모든 새 프로젝트 전에 이력 감사 + Shell 금지 목록 |

---

## 핵심 기능

| 기능 | 설명 |
|------|------|
| **추론 우선** | AI는 독창적인 시각적 테제를 개발해야 한다 — 사전 설정 라이브러리에서 선택하는 것이 아니다 |
| **감독 우선** | 감정적 방향은 일반적인 럭셔리 브랜딩이 아닌 실제 영화에서 나온다 |
| **리서치 우선** | 웹 접근이 가능한 경우, Phase 1을 확정하기 전에 감독과 영화를 리서치한다 |
| **시작 설문지 게이트** | 모든 호출은 Phase 1이 시작되기 전에 시작 설문지를 완료해야 한다 |
| **스토리보드 우선** | 프론트엔드 코드 전에 `decisions.md`, `storyboard.md`, `compiled-spec.md`를 작성한다 |
| **데모 고유성 프로토콜** | 이전 출력물을 감사하고 프로젝트 간에 반복되는 Shell을 방지하기 위한 Shell 금지 목록을 강제한다 |
| **안티 그리드 폴백** | 그리드는 보이지 않는 정렬 인프라로만 허용된다 — 가시적인 기본 구성으로는 절대 사용하지 않는다 |
| **서브 에이전트 친화적** | 영화 리서치, 틈새 리서치, 페이지 장면, 스펙 슬라이스, 검증을 위임할 수 있으며 하나의 리드 에이전트가 최종 일관성을 유지한다 |

---

## 워크플로우

| 단계 | 주요 작업 | 출력 아티팩트 |
|------|-----------|--------------|
| **Phase 1 — 결정** | 시작 설문지 완료, 감독 + 영화 선택, 고유성 감사 실행, 웹 접근 가능 시 리서치 | `decisions.md` |
| **Phase 2 — 스토리보드** | 사이트 전체 영화적 문법 정의, 페이지 역할별 장면 테제 작성, 페이지별 시그니처 구성 확정 | `storyboard.md` |
| **Phase 3 — 컴파일된 스펙** | 스토리보드별 카메라 / 인터랙션 / 구성 / 텍스처 / 타이포그래피 추출 — 공유 시스템은 마지막 | `compiled-spec.md` |
| **Phase 4 — 빌드 & 검증** | 스펙에서 구현, 모션 감소 + 반응형 추가, 안티 가비지 규칙에 대해 검증 | HTML / CSS / JS |

> **Phase 2 내부 순서 (협상 불가):**
> 사이트 전체 영화적 문법 → 페이지별 장면 테제 → 페이지별 시그니처 구성 → 공유 시스템

---

## 지원 플랫폼

Claude Code와 OpenAI Codex가 두 개의 주요 플랫폼입니다. 다른 모든 플랫폼도 완전히 지원됩니다.

| 도구 / 플랫폼 | 진입 파일 | 설치 / 구성 |
|--------------|-----------|------------|
| **Claude Code** *(주요)* | [`CLAUDE.md`](./CLAUDE.md) | `~/.claude/skills/cinematic-ui` |
| **Codex / ChatGPT** *(주요)* | [`CODEX.md`](./CODEX.md) | `$CODEX_HOME/skills/cinematic-ui` |
| **Cursor** | [`.cursor/rules/cinematic-ui.mdc`](./.cursor/rules/cinematic-ui.mdc) | 이미 `.cursor/rules/`에 있음 — 클론 후 바로 작동 |
| **Windsurf** | [`.windsurf/rules/cinematic-ui.md`](./.windsurf/rules/cinematic-ui.md) | 이미 `.windsurf/rules/`에 있음 — 클론 후 바로 작동 |
| **GitHub Copilot** | [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) | 이미 `.github/`에 있음 — 클론 후 바로 작동 |
| **Gemini / Antigravity** | [`GEMINI.md`](./GEMINI.md) | 프로젝트 시작 시 읽기 |
| **크로스 도구 공유** | [`AGENTS.md`](./AGENTS.md) | 모든 에이전트를 위한 범용 참조 |

---

## 설치

### Claude Code

**Windows:**
```powershell
git clone https://github.com/akseolabs-seo/cinematic-ui "$env:USERPROFILE\.claude\skills\cinematic-layout"
```

**macOS / Linux:**
```bash
git clone https://github.com/akseolabs-seo/cinematic-ui ~/.claude/skills/cinematic-ui
```

그런 다음 Claude Code 내에서 `/cinematic-ui`로 호출합니다.

### Codex / ChatGPT

```bash
git clone https://github.com/akseolabs-seo/cinematic-ui $CODEX_HOME/skills/cinematic-ui
```

### Cursor / Windsurf / GitHub Copilot

```bash
git clone https://github.com/akseolabs-seo/cinematic-ui
```

`.cursor/rules/`, `.windsurf/rules/`, `.github/copilot-instructions.md` 파일이 이미 준비되어 있습니다. 추가 구성이 필요 없습니다 — 저장소가 프로젝트에 존재하는 즉시 규칙이 활성화됩니다.

### 다른 도구

도구를 이 저장소로 지정하거나 관련 진입 파일을 복사하세요. 위의 플랫폼 표를 참고하세요.

---

## 권장 프롬프트 패턴

```text
Use cinematic-layout to build a homepage.
Pick the director and film yourself.
If web access is available, research the director and film first.
Run the Demo Uniqueness Protocol.
Do not reuse shells from previous demos.
Optimize for a great single-page result before building a shared system.
```

---

## 참조 라이브러리

모든 참조 데이터는 `references/`에 단계별로 정리되어 있습니다. 현재 단계에 필요한 것만 로드하세요 — 전체 라이브러리를 한 번에 읽지 마세요.

### 핵심 규칙 파일

| 파일 | 목적 |
|------|------|
| [`references/library-index.md`](./references/library-index.md) | 단계별로 읽어야 할 파일 — 여기서 시작 |
| [`references/premium-calibration.md`](./references/premium-calibration.md) | 감독 브리프 후 자체 점검: 절제와 프리미엄 품질 |
| [`references/anti-garbage.md`](./references/anti-garbage.md) | 일반적인 AI 디자인 저하 패턴 — Phase 3과 Phase 4에서 실행 |
| [`references/anti-convergence.md`](./references/anti-convergence.md) | 데모 또는 페이지 간 반복 Shell 방지를 위한 해시 기반 선택 |
| [`references/implementation-guardrails.md`](./references/implementation-guardrails.md) | Phase 3–4 규칙: JS 효과 목록, Entrance Map, Phase 3 체크리스트, Punch Up / Pull Back |
| [`references/reference-protocol.md`](./references/reference-protocol.md) | 참조 사이트를 복사하지 않고 분해하는 방법 |
| [`references/output-templates.md`](./references/output-templates.md) | 각 단계 아티팩트를 위한 표준 형식 템플릿 |

### 데이터 라이브러리 (Phase 1–3)

| 파일 | 내용 |
|------|------|
| `references/data/directors-200.md` | 장르별 200명 이상의 감독, 시그니처 영화와 시각적 스타일 설명 포함 |
| `references/data/hero-archetypes.md` | 30가지 히어로 골격 옵션 |
| `references/data/narrative-beats.md` | 25개의 내러티브 비트 + 18개의 감독 아크 템플릿 |
| `references/data/section-functions.md` | 50가지 기능적 섹션 유형 |
| `references/data/section-archetypes.md` | 91개 이상의 섹션 골격 옵션 |
| `references/data/dna-index.tsv` | 1,486개 사이트의 디자인 DNA 인덱스 — 분위기, 유형, 모션으로 검색 가능 |
| `references/data/design-dna-db.txt` | 심층 사이트 수준 DNA 데이터 (인덱스 히트 시에만 로드) |
| `references/data/camera-shots-50.md` | CSS를 포함한 55가지 진입 및 리빌 동작 |
| `references/data/interaction-effects-50.md` | 55개 이상의 호버 / 클릭 / 스크롤 인터랙션 (JS 필요 변형 포함) |
| `references/data/compositions.md` | 80가지 레이아웃 구성 및 그리드 논리 |
| `references/data/visual-elements.md` | 40가지 시각적 장식 요소 |
| `references/data/background-techniques.md` | 50개 이상의 히어로 배경 및 분위기 레이어 기법 |
| `references/data/typography-cinema.md` | 40개 이상의 텍스트 퍼포먼스 및 계층 처리 |
| `references/data/color-grades.md` | 40개 이상의 영화 팔레트에서 UI 토큰으로의 번역 |
| `references/data/font-moods.md` | 톤별 30개 이상의 폰트 페어링 |
| `references/data/textures.md` | 30개 이상의 그레인 / 그리드 / 먼지 / 스캔 라인 표면 기법 |

---

## 저장소 구조

```text
cinematic-layout/
├── SKILL.md                              ← 메인 스킬 로직 (모든 에이전트의 주요 진입점)
├── skill.json                            ← 범용 스킬 매니페스트
├── directors-library.md                  ← 레거시 호환성 파일
│
├── CLAUDE.md                             ← Claude Code
├── AGENTS.md                             ← 크로스 도구 공유 참조
├── CODEX.md                              ← Codex / ChatGPT
├── GEMINI.md                             ← Gemini / Antigravity
│
├── .cursor/
│   └── rules/
│       └── cinematic-ui.mdc          ← Cursor 규칙 (자동 로드)
│
├── .windsurf/
│   └── rules/
│       └── cinematic-ui.md           ← Windsurf 규칙 (자동 로드)
│
├── .github/
│   ├── copilot-instructions.md           ← GitHub Copilot (자동 로드)
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
│
├── agents/
│   └── openai.yaml                       ← OpenAI 스킬 메타데이터
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
    └── data/                             ← 18개의 디자인 데이터 라이브러리 (총 ~600KB)
```

---

## 팔로우

업데이트 및 더 많은 AI / 디자인 워크플로우 콘텐츠를 위해:

- [Threads: @darkseoking](https://www.threads.com/@darkseoking)

---

## 기여

PR을 열기 전에 [CONTRIBUTING.md](./CONTRIBUTING.md)를 읽어주세요.

## 라이선스

MIT. [LICENSE](./LICENSE)를 참고하세요.
