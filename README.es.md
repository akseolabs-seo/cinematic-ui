# Cinematic UI

<p align="center">
  <img src="./docs/banner.svg" alt="Cinematic UI Banner" width="100%" />
</p>

<p align="center">
  <strong>Transforma la investigación de directores y películas en ritmo, espacio, luz y composición premium para sitios web.</strong>
</p>

<p align="center">
  <a href="./README.md">English</a> ·
  <a href="./README.zh-TW.md">繁體中文</a> ·
  <a href="./README.zh-CN.md">简体中文</a> ·
  <a href="./README.ja.md">日本語</a> ·
  <strong>Español</strong> ·
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

## Por Qué Es Diferente

La mayoría de las habilidades de diseño con IA son **tablas de búsqueda**.

Le dan a la IA una base de datos de 67 estilos, 161 paletas de colores, 50 patrones de componentes — y la IA elige del menú. El resultado es técnicamente limpio, ocasionalmente pulido y confiablemente olvidable. La IA no está pensando. Está comprando.

**Cinematic UI es un marco de razonamiento, no una biblioteca de materiales.**

En lugar de darle a la IA un menú, esta habilidad la obliga a trabajar como lo hace un director de cine real:

1. Investigar un director específico y una película específica — lógica de iluminación, disciplina de encuadre, ritmo de escena, sentido del material
2. Extraer qué hace que el lenguaje visual de esa película funcione a nivel estructural
3. Desarrollar una tesis visual original para el sitio: ¿qué tipo de escena es esta página? ¿qué composición es irremplazable aquí?
4. Justificar cada decisión de maquetación frente a ese lenguaje cinematográfico
5. Solo entonces formalizar CSS, movimiento e implementación

La diferencia en el resultado no es una cuestión de grado. Es una categoría diferente de resultado.

Una tabla de búsqueda produce un sitio que parece un sitio. El flujo de trabajo de un director produce un sitio que se siente como si lo hubiera hecho alguien con un punto de vista.

> La IA no es un tendero que elige artículos de los estantes.
> La IA es el director. La película es el encargo. El sitio web es la producción.

---

## Qué Es

`cinematic-layout` es una habilidad de razonamiento multi-agente construida alrededor de un mecanismo fijo único:

1. Elegir un **director + película específica**
2. Si hay acceso web disponible, investigar ese director y esa película — cinematografía, iluminación, ritmo, material, control de escena
3. Traducir ese lenguaje cinematográfico en un **sistema narrativo y de maquetación ejecutable en la web**
4. Definir una escena distinta y una composición irremplazable por rol de página principal
5. Solo entonces formalizar la implementación en HTML / CSS / JS

> La película no es una hoja de especificaciones. La película es input de investigación.
> El flujo de trabajo operable por computadora comienza cuando esas observaciones se traducen en `decisions.md`, `storyboard.md`, `compiled-spec.md` e implementación.

---

## Problemas Que Resuelve

| Problema | Cómo Se Ve | Cómo Lo Resuelve Esta Habilidad |
|---------|-------------------|--------------------------|
| **Ritmo** | Las secciones son técnicamente válidas pero se sienten como una presentación de diapositivas, no un sitio dirigido | Las plantillas narrativas de director reemplazan el flujo predeterminado Hero → Características → Estadísticas → CTA |
| **Espacio** | Los componentes existen pero el peso visual, la distancia, la jerarquía y la presión son débiles | Fuerza una Composición Distintiva por página — sin recurso a la cuadrícula predeterminada |
| **Luz** | Solo brillo de superficie — sin lógica de iluminación real, comportamiento de sombras ni control de material | Colores extraídos de escenas cinematográficas reales, combinados con la biblioteca de técnicas de fondo |
| **Sensación premium** | Limpio pero no costoso, no contenido, no suficientemente dirigido | La lista de verificación de Calibración Premium fuerza decisiones explícitas sobre "lo que NO haremos" |
| **Unicidad** | Después de múltiples demos, la postura del héroe, el ritmo de las secciones y la geometría empiezan a repetirse | Protocolo de Unicidad de Demo: auditoría de historial + lista de exclusión de Shell antes de cada nuevo proyecto |

---

## Características Principales

| Característica | Descripción |
|---------|-------------|
| **Razonamiento primero** | La IA debe desarrollar una tesis visual original — no seleccionar de una biblioteca predefinida |
| **Director primero** | La dirección emocional proviene de una película real, no de una marca de lujo genérica |
| **Investigación primero** | Cuando hay acceso web disponible, investigar al director y la película antes de cerrar la Fase 1 |
| **Cuestionario de inicio** | Cada invocación debe completar el cuestionario inicial antes de que comience la Fase 1 |
| **Storyboard primero** | Escribir `decisions.md`, `storyboard.md`, `compiled-spec.md` antes de cualquier código frontend |
| **Protocolo de Unicidad de Demo** | Audita los resultados anteriores y aplica una lista de exclusión de Shell para evitar shells repetidos entre proyectos |
| **Anti-cuadrícula por defecto** | La cuadrícula está permitida como infraestructura de alineación invisible — nunca como composición visible predeterminada |
| **Amigable con sub-agentes** | La investigación cinematográfica, de nicho, de escenas de página, fragmentos de especificaciones y verificación pueden delegarse mientras un agente principal mantiene la coherencia final |

---

## Flujo de Trabajo

| Fase | Trabajo Principal | Artefacto de Salida |
|-------|-----------|----------------|
| **Fase 1 — Decisiones** | Completar cuestionario de inicio, elegir director + película, ejecutar auditoría de unicidad, investigar si hay acceso web disponible | `decisions.md` |
| **Fase 2 — Storyboard** | Definir gramática cinematográfica del sitio completo, escribir tesis de escena por rol de página, fijar composición distintiva por página | `storyboard.md` |
| **Fase 3 — Especificación Compilada** | Extraer cámara / interacción / composición / textura / tipografía por storyboard — sistema compartido al final | `compiled-spec.md` |
| **Fase 4 — Construcción y Verificación** | Implementar desde la especificación, añadir movimiento reducido + responsivo, validar contra las reglas anti-basura | HTML / CSS / JS |

> **Orden interno de la Fase 2 (no negociable):**
> Gramática cinematográfica del sitio → tesis de escena por página → composición distintiva por página → sistema compartido

---

## Plataformas Compatibles

Claude Code y OpenAI Codex son las dos plataformas principales. Todas las demás están completamente soportadas.

| Herramienta / Plataforma | Archivo de Entrada | Instalación / Configuración |
|----------------|-----------|-----------------|
| **Claude Code** *(primary)* | [`CLAUDE.md`](./CLAUDE.md) | `~/.claude/skills/cinematic-ui` |
| **Codex / ChatGPT** *(primary)* | [`CODEX.md`](./CODEX.md) | `$CODEX_HOME/skills/cinematic-ui` |
| **Cursor** | [`.cursor/rules/cinematic-ui.mdc`](./.cursor/rules/cinematic-ui.mdc) | Ya en `.cursor/rules/` — funciona al clonar |
| **Windsurf** | [`.windsurf/rules/cinematic-ui.md`](./.windsurf/rules/cinematic-ui.md) | Ya en `.windsurf/rules/` — funciona al clonar |
| **GitHub Copilot** | [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) | Ya en `.github/` — funciona al clonar |
| **Gemini / Antigravity** | [`GEMINI.md`](./GEMINI.md) | Leer al inicio del proyecto |
| **Compartido entre herramientas** | [`AGENTS.md`](./AGENTS.md) | Referencia universal para cualquier agente |

---

## Instalación

### Claude Code

**Windows:**
```powershell
git clone https://github.com/akseolabs-seo/cinematic-ui "$env:USERPROFILE\.claude\skills\cinematic-layout"
```

**macOS / Linux:**
```bash
git clone https://github.com/akseolabs-seo/cinematic-ui ~/.claude/skills/cinematic-ui
```

Luego invocar con `/cinematic-ui` dentro de Claude Code.

### Codex / ChatGPT

```bash
git clone https://github.com/akseolabs-seo/cinematic-ui $CODEX_HOME/skills/cinematic-ui
```

### Cursor / Windsurf / GitHub Copilot

```bash
git clone https://github.com/akseolabs-seo/cinematic-ui
```

Los archivos `.cursor/rules/`, `.windsurf/rules/` y `.github/copilot-instructions.md` ya están en su lugar. No se necesita configuración adicional — las reglas se activan en cuanto el repositorio está presente en tu proyecto.

### Cualquier otra herramienta

Apunta la herramienta a este repositorio o copia el archivo de entrada relevante. Consulta la tabla de plataformas arriba.

---

## Patrón de Prompt Sugerido

```text
Use cinematic-layout to build a homepage.
Pick the director and film yourself.
If web access is available, research the director and film first.
Run the Demo Uniqueness Protocol.
Do not reuse shells from previous demos.
Optimize for a great single-page result before building a shared system.
```

---

## Biblioteca de Referencias

Todos los datos de referencia viven en `references/`, organizados por fase. Carga solo lo que la fase actual necesite — no leas toda la biblioteca de una vez.

### Archivos de Reglas Principales

| Archivo | Propósito |
|------|---------|
| [`references/library-index.md`](./references/library-index.md) | Qué archivos leer por fase — empieza aquí |
| [`references/premium-calibration.md`](./references/premium-calibration.md) | Autocorrección tras el encargo del director: contención y calidad premium |
| [`references/anti-garbage.md`](./references/anti-garbage.md) | Patrones comunes de degradación en diseño por IA — ejecutar en Fase 3 y Fase 4 |
| [`references/anti-convergence.md`](./references/anti-convergence.md) | Selección basada en hash para evitar shells repetidos entre demos o páginas |
| [`references/implementation-guardrails.md`](./references/implementation-guardrails.md) | Reglas de Fase 3–4: lista de efectos JS, Mapa de Entrada, lista de verificación Fase 3, Punch Up / Pull Back |
| [`references/reference-protocol.md`](./references/reference-protocol.md) | Cómo descomponer un sitio de referencia sin copiarlo |
| [`references/output-templates.md`](./references/output-templates.md) | Plantillas de formato estándar para cada artefacto de fase |

### Bibliotecas de Datos (Fases 1–3)

| Archivo | Contenido |
|------|---------|
| `references/data/directors-200.md` | Más de 200 directores por género, con películas destacadas y descripciones de estilo visual |
| `references/data/hero-archetypes.md` | 30 opciones de esqueleto para héroe |
| `references/data/narrative-beats.md` | 25 beats narrativos + 18 plantillas de arco de director |
| `references/data/section-functions.md` | 50 tipos de sección funcional |
| `references/data/section-archetypes.md` | Más de 91 opciones de esqueleto de sección |
| `references/data/dna-index.tsv` | Índice de ADN de diseño de 1.486 sitios — buscable por estado de ánimo, tipo, movimiento |
| `references/data/design-dna-db.txt` | Datos de ADN profundo a nivel de sitio (cargar solo en coincidencia de índice) |
| `references/data/camera-shots-50.md` | 55 comportamientos de entrada y revelación con CSS |
| `references/data/interaction-effects-50.md` | Más de 55 interacciones de hover / clic / scroll (incluye variantes que requieren JS) |
| `references/data/compositions.md` | 80 composiciones de maquetación y lógicas de cuadrícula |
| `references/data/visual-elements.md` | 40 elementos de decoración visual |
| `references/data/background-techniques.md` | Más de 50 técnicas de fondo para héroe y capas de atmósfera |
| `references/data/typography-cinema.md` | Más de 40 tratamientos de rendimiento textual y jerarquía |
| `references/data/color-grades.md` | Más de 40 traducciones de paleta cinematográfica a tokens de UI |
| `references/data/font-moods.md` | Más de 30 combinaciones de fuentes por tono |
| `references/data/textures.md` | Más de 30 técnicas de superficie de grano / cuadrícula / polvo / línea de escaneo |

---

## Estructura del Repositorio

```text
cinematic-layout/
├── SKILL.md                              ← lógica principal de la habilidad (entrada primaria para todos los agentes)
├── skill.json                            ← manifiesto universal de la habilidad
├── directors-library.md                  ← archivo de compatibilidad heredado
│
├── CLAUDE.md                             ← Claude Code
├── AGENTS.md                             ← referencia compartida entre herramientas
├── CODEX.md                              ← Codex / ChatGPT
├── GEMINI.md                             ← Gemini / Antigravity
│
├── .cursor/
│   └── rules/
│       └── cinematic-ui.mdc          ← Reglas de Cursor (carga automática)
│
├── .windsurf/
│   └── rules/
│       └── cinematic-ui.md           ← Reglas de Windsurf (carga automática)
│
├── .github/
│   ├── copilot-instructions.md           ← GitHub Copilot (carga automática)
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
│
├── agents/
│   └── openai.yaml                       ← Metadatos de habilidad OpenAI
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
    └── data/                             ← 18 bibliotecas de datos de diseño (~600KB en total)
```

---

## Seguir

Para actualizaciones y más contenido sobre IA y flujos de trabajo de diseño:

- [Threads: @darkseoking](https://www.threads.com/@darkseoking)

---

## Contribuciones

Por favor lee [CONTRIBUTING.md](./CONTRIBUTING.md) antes de abrir un PR.

## Licencia

MIT. Consulta [LICENSE](./LICENSE).
