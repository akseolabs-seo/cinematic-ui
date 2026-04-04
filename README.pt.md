# Cinematic UI

<p align="center">
  <img src="./docs/banner.svg" alt="Cinematic UI Banner" width="100%" />
</p>

<p align="center">
  <strong>Transforme pesquisa de diretores e filmes em ritmo, espaço, luz e composição premium para websites.</strong>
</p>

<p align="center">
  <a href="./README.md">English</a> ·
  <a href="./README.zh-TW.md">繁體中文</a> ·
  <a href="./README.zh-CN.md">简体中文</a> ·
  <a href="./README.ja.md">日本語</a> ·
  <a href="./README.es.md">Español</a> ·
  <a href="./README.fr.md">Français</a> ·
  <a href="./README.de.md">Deutsch</a> ·
  <a href="./README.ko.md">한국어</a> ·
  **Português** ·
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

## Por Que Isto É Diferente

A maioria das habilidades de design por IA são **tabelas de consulta**.

Elas fornecem à IA um banco de dados com 67 estilos, 161 paletas de cores, 50 padrões de componentes — e a IA escolhe no cardápio. O resultado é tecnicamente limpo, ocasionalmente polido e confiavelmente esquecível. A IA não está pensando. Está fazendo compras.

**Cinematic UI é um framework de raciocínio, não uma biblioteca de materiais.**

Em vez de entregar um cardápio à IA, esta habilidade a força a trabalhar como um diretor de cinema de verdade faz:

1. Pesquisar um diretor específico e um filme específico — lógica de iluminação, disciplina de enquadramento, ritmo de cena, sensação de material
2. Extrair o que faz a linguagem visual daquele filme funcionar em um nível estrutural
3. Desenvolver uma tese visual original para o site: que tipo de cena é esta página? que composição é insubstituível aqui?
4. Justificar cada decisão de layout contra essa linguagem cinematográfica
5. Somente então formalizar CSS, motion e implementação

A diferença no resultado não é uma questão de grau. É uma categoria diferente de resultado.

Uma tabela de consulta produz um site que parece um site. O fluxo de trabalho de um diretor produz um site que parece ter sido feito por alguém com um ponto de vista.

> A IA não é um vendedor tirando itens de prateleiras.
> A IA é o diretor. O filme é o briefing. O website é a produção.

---

## O Que É

`cinematic-layout` é uma habilidade de raciocínio cross-agent construída em torno de um único mecanismo fixo:

1. Escolher um **diretor + filme específico**
2. Se houver acesso à web, pesquisar esse diretor e filme — cinematografia, iluminação, ritmo, material, controle de cena
3. Traduzir essa linguagem cinematográfica em um **sistema narrativo e de layout executável para a web**
4. Definir uma cena distinta e uma composição insubstituível por papel de página principal
5. Somente então formalizar a implementação em HTML / CSS / JS

> O filme não é uma ficha de especificações. O filme é uma entrada de pesquisa.
> O fluxo de trabalho operável pelo computador começa quando essas observações são traduzidas em `decisions.md`, `storyboard.md`, `compiled-spec.md` e implementação.

---

## Problemas Que Resolve

| Problema | Como Aparece | Como Esta Habilidade Resolve |
|---------|-------------------|--------------------------|
| **Ritmo** | As seções são tecnicamente válidas, mas parecem uma apresentação de slides, não um site dirigido | Templates narrativos de diretor substituem o fluxo padrão Hero → Features → Stats → CTA |
| **Espaço** | Os componentes existem, mas peso visual, distância, hierarquia e pressão são fracos | Força uma Composição Assinatura por página — sem fallback para grade padrão |
| **Luz** | Brilho de superfície apenas — sem lógica de iluminação real, comportamento de sombra ou controle de material | Cores extraídas de cenas de filmes reais, combinadas com biblioteca de técnicas de fundo |
| **Sensação premium** | Limpo, mas não caro, não contido, não suficientemente dirigido | Checklist de Calibração Premium força decisões explícitas de "o que NÃO faremos" |
| **Unicidade** | Após múltiplos demos, postura do hero, ritmo de seção e geometria começam a se repetir | Protocolo de Unicidade de Demo: auditoria de histórico + lista de Shell-ban antes de cada novo projeto |

---

## Funcionalidades Principais

| Funcionalidade | Descrição |
|---------|-------------|
| **Raciocínio primeiro** | A IA deve desenvolver uma tese visual original — não selecionar de uma biblioteca predefinida |
| **Diretor primeiro** | A direção emocional vem de um filme real, não de branding genérico de luxo |
| **Pesquisa primeiro** | Quando há acesso à web, pesquisar o diretor e o filme antes de bloquear a Fase 1 |
| **Gate de questionário inicial** | Cada invocação deve completar o questionário de abertura antes que a Fase 1 comece |
| **Storyboard primeiro** | Escrever `decisions.md`, `storyboard.md`, `compiled-spec.md` antes de qualquer código frontend |
| **Protocolo de Unicidade de Demo** | Audita outputs anteriores e impõe uma lista Shell-ban para evitar shells repetidos entre projetos |
| **Anti-fallback de grade** | Grade é permitida como infraestrutura de alinhamento invisível — nunca como a composição visível padrão |
| **Amigável para sub-agentes** | Pesquisa de filme, pesquisa de nicho, cenas de página, fatias de spec e verificação podem ser delegadas enquanto um agente líder mantém a coerência final |

---

## Fluxo de Trabalho

| Fase | Trabalho Principal | Artefato de Saída |
|-------|-----------|----------------|
| **Fase 1 — Decisões** | Completar questionário inicial, escolher diretor + filme, executar auditoria de unicidade, pesquisar se tiver acesso à web | `decisions.md` |
| **Fase 2 — Storyboard** | Definir gramática cinematográfica do site, escrever tese de cena por papel de página, bloquear composição assinatura por página | `storyboard.md` |
| **Fase 3 — Spec Compilada** | Extrair câmera / interação / composição / textura / tipografia por storyboard — sistema compartilhado por último | `compiled-spec.md` |
| **Fase 4 — Construir e Verificar** | Implementar a partir da spec, adicionar reduced-motion + responsivo, validar contra regras anti-garbage | HTML / CSS / JS |

> **Ordem interna da Fase 2 (não negociável):**
> Gramática cinematográfica do site → tese de cena por página → composição assinatura por página → sistema compartilhado

---

## Plataformas Suportadas

Claude Code e OpenAI Codex são as duas plataformas primárias. Todas as outras são totalmente suportadas.

| Ferramenta / Plataforma | Arquivo de Entrada | Instalação / Config |
|----------------|-----------|-----------------|
| **Claude Code** *(primário)* | [`CLAUDE.md`](./CLAUDE.md) | `~/.claude/skills/cinematic-ui` |
| **Codex / ChatGPT** *(primário)* | [`CODEX.md`](./CODEX.md) | `$CODEX_HOME/skills/cinematic-ui` |
| **Cursor** | [`.cursor/rules/cinematic-ui.mdc`](./.cursor/rules/cinematic-ui.mdc) | Já em `.cursor/rules/` — funciona ao clonar |
| **Windsurf** | [`.windsurf/rules/cinematic-ui.md`](./.windsurf/rules/cinematic-ui.md) | Já em `.windsurf/rules/` — funciona ao clonar |
| **GitHub Copilot** | [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) | Já em `.github/` — funciona ao clonar |
| **Gemini / Antigravity** | [`GEMINI.md`](./GEMINI.md) | Leia na inicialização do projeto |
| **Compartilhado cross-tool** | [`AGENTS.md`](./AGENTS.md) | Referência universal para qualquer agente |

---

## Instalação

### Claude Code

**Windows:**
```powershell
git clone https://github.com/akseolabs-seo/cinematic-ui "$env:USERPROFILE\.claude\skills\cinematic-layout"
```

**macOS / Linux:**
```bash
git clone https://github.com/akseolabs-seo/cinematic-ui ~/.claude/skills/cinematic-ui
```

Em seguida, invoque com `/cinematic-ui` dentro do Claude Code.

### Codex / ChatGPT

```bash
git clone https://github.com/akseolabs-seo/cinematic-ui $CODEX_HOME/skills/cinematic-ui
```

### Cursor / Windsurf / GitHub Copilot

```bash
git clone https://github.com/akseolabs-seo/cinematic-ui
```

Os arquivos `.cursor/rules/`, `.windsurf/rules/` e `.github/copilot-instructions.md` já estão no lugar. Nenhuma configuração adicional é necessária — as regras são ativadas assim que o repositório está presente no seu projeto.

### Qualquer outra ferramenta

Aponte a ferramenta para este repositório ou copie o arquivo de entrada relevante. Consulte a tabela de plataformas acima.

---

## Padrão de Prompt Sugerido

```text
Use cinematic-layout to build a homepage.
Pick the director and film yourself.
If web access is available, research the director and film first.
Run the Demo Uniqueness Protocol.
Do not reuse shells from previous demos.
Optimize for a great single-page result before building a shared system.
```

---

## Biblioteca de Referências

Todos os dados de referência ficam em `references/`, organizados por fase. Carregue apenas o que a fase atual precisa — não leia a biblioteca inteira de uma vez.

### Arquivos de Regras Principais

| Arquivo | Propósito |
|------|---------|
| [`references/library-index.md`](./references/library-index.md) | Quais arquivos ler por fase — comece aqui |
| [`references/premium-calibration.md`](./references/premium-calibration.md) | Auto-verificação após o briefing do diretor: contenção e qualidade premium |
| [`references/anti-garbage.md`](./references/anti-garbage.md) | Padrões comuns de degradação de design por IA — executar nas Fases 3 e 4 |
| [`references/anti-convergence.md`](./references/anti-convergence.md) | Seleção baseada em hash para evitar shells repetidos entre demos ou páginas |
| [`references/implementation-guardrails.md`](./references/implementation-guardrails.md) | Regras das Fases 3–4: lista de efeitos JS, Mapa de Entrada, checklist da Fase 3, Punch Up / Pull Back |
| [`references/reference-protocol.md`](./references/reference-protocol.md) | Como decompor um site de referência sem copiá-lo |
| [`references/output-templates.md`](./references/output-templates.md) | Templates de formato padrão para cada artefato de fase |

### Bibliotecas de Dados (Fases 1–3)

| Arquivo | Conteúdo |
|------|---------|
| `references/data/directors-200.md` | 200+ diretores por gênero, com filmes marcantes e descrições de estilo visual |
| `references/data/hero-archetypes.md` | 30 opções de esqueleto de hero |
| `references/data/narrative-beats.md` | 25 batidas narrativas + 18 templates de arco de diretor |
| `references/data/section-functions.md` | 50 tipos funcionais de seção |
| `references/data/section-archetypes.md` | 91+ opções de esqueleto de seção |
| `references/data/dna-index.tsv` | Índice Design DNA de 1.486 sites — pesquisável por humor, tipo, motion |
| `references/data/design-dna-db.txt` | Dados DNA profundos em nível de site (carregar apenas em hit no índice) |
| `references/data/camera-shots-50.md` | 55 comportamentos de entrada e revelação com CSS |
| `references/data/interaction-effects-50.md` | 55+ interações de hover / clique / scroll (inclui variantes que requerem JS) |
| `references/data/compositions.md` | 80 composições de layout e lógicas de grade |
| `references/data/visual-elements.md` | 40 elementos de decoração visual |
| `references/data/background-techniques.md` | 50+ técnicas de fundo do hero e camada de atmosfera |
| `references/data/typography-cinema.md` | 40+ tratamentos de performance de texto e hierarquia |
| `references/data/color-grades.md` | 40+ traduções de paleta de filme para tokens de UI |
| `references/data/font-moods.md` | 30+ combinações de fontes por tom |
| `references/data/textures.md` | 30+ técnicas de superfície com grain / grade / poeira / scan line |

---

## Estrutura do Repositório

```text
cinematic-layout/
├── SKILL.md                              ← lógica principal da habilidade (entrada primária para todos os agentes)
├── skill.json                            ← manifesto universal da habilidade
├── directors-library.md                  ← arquivo de compatibilidade legado
│
├── CLAUDE.md                             ← Claude Code
├── AGENTS.md                             ← referência compartilhada cross-tool
├── CODEX.md                              ← Codex / ChatGPT
├── GEMINI.md                             ← Gemini / Antigravity
│
├── .cursor/
│   └── rules/
│       └── cinematic-ui.mdc          ← Regras do Cursor (carregamento automático)
│
├── .windsurf/
│   └── rules/
│       └── cinematic-ui.md           ← Regras do Windsurf (carregamento automático)
│
├── .github/
│   ├── copilot-instructions.md           ← GitHub Copilot (carregamento automático)
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
│
├── agents/
│   └── openai.yaml                       ← Metadados de habilidade OpenAI
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
    └── data/                             ← 18 bibliotecas de dados de design (~600KB no total)
```

---

## Acompanhe

Para atualizações e mais conteúdo sobre fluxos de trabalho de IA / design:

- [Threads: @darkseoking](https://www.threads.com/@darkseoking)

---

## Contribuindo

Por favor, leia [CONTRIBUTING.md](./CONTRIBUTING.md) antes de abrir um PR.

## Licença

MIT. Veja [LICENSE](./LICENSE).
