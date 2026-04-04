# Cinematic UI

<p align="center">
  <img src="./docs/banner.svg" alt="Cinematic UI Banner" width="100%" />
</p>

<p align="center">
  <strong>Biến nghiên cứu về đạo diễn và phim ảnh thành nhịp điệu, không gian, ánh sáng, và bố cục cao cấp cho website.</strong>
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
  <a href="./README.pt.md">Português</a> ·
  Tiếng Việt
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

## Điểm Khác Biệt

Hầu hết các skill thiết kế AI đều là **bảng tra cứu**.

Chúng cung cấp cho AI một cơ sở dữ liệu gồm 67 phong cách, 161 bảng màu, 50 mẫu component — và AI chọn từ menu đó. Kết quả kỹ thuật thì ổn, đôi khi bóng bẩy, và đáng tin cậy theo cách dễ quên. AI không đang suy nghĩ. Nó đang đi mua sắm.

**Cinematic UI là một khung tư duy, không phải thư viện vật liệu.**

Thay vì đưa cho AI một menu, skill này buộc nó phải làm việc theo cách một đạo diễn phim thực thụ:

1. Nghiên cứu một đạo diễn cụ thể và một bộ phim cụ thể — logic ánh sáng, kỷ luật bố cục, nhịp điệu cảnh quay, cảm quan vật liệu
2. Trích xuất điều gì làm cho ngôn ngữ hình ảnh của bộ phim đó hoạt động ở cấp độ cấu trúc
3. Phát triển luận điểm hình ảnh độc đáo cho trang: trang này là loại cảnh quay nào? bố cục nào là không thể thay thế ở đây?
4. Biện minh cho mọi quyết định bố cục dựa trên ngôn ngữ phim đó
5. Chỉ sau đó mới hình thức hóa CSS, chuyển động, và triển khai

Sự khác biệt trong đầu ra không phải là vấn đề về mức độ. Đó là một loại kết quả hoàn toàn khác.

Một bảng tra cứu tạo ra một trang trông giống một trang web. Quy trình của đạo diễn tạo ra một trang có cảm giác như được tạo bởi người có quan điểm.

> AI không phải là người bán hàng chọn đồ từ kệ.
> AI là đạo diễn. Bộ phim là bản tóm tắt. Website là tác phẩm.

---

## Nó Là Gì

`cinematic-layout` là một skill suy luận đa tác nhân được xây dựng xung quanh một cơ chế cố định duy nhất:

1. Chọn một **đạo diễn + bộ phim cụ thể**
2. Nếu có quyền truy cập web, nghiên cứu đạo diễn và bộ phim đó — quay phim, ánh sáng, nhịp điệu, vật liệu, kiểm soát cảnh quay
3. Chuyển ngôn ngữ phim đó thành **hệ thống narrative và bố cục có thể thực thi trên web**
4. Xác định một cảnh quay riêng biệt và một bố cục không thể thay thế cho mỗi vai trò trang chính
5. Chỉ sau đó mới hình thức hóa triển khai HTML / CSS / JS

> Bộ phim không phải là bản đặc tả. Bộ phim là đầu vào nghiên cứu.
> Quy trình có thể thao tác bằng máy tính bắt đầu khi những quan sát đó được chuyển thành `decisions.md`, `storyboard.md`, `compiled-spec.md`, và triển khai.

---

## Các Vấn Đề Nó Giải Quyết

| Vấn đề | Biểu hiện | Cách Skill Này Giải Quyết |
|--------|-----------|--------------------------|
| **Nhịp điệu** | Các section kỹ thuật hợp lệ nhưng có cảm giác như bộ slide, không phải trang có định hướng | Mẫu narrative đạo diễn thay thế luồng Hero → Features → Stats → CTA mặc định |
| **Không gian** | Các component tồn tại nhưng trọng lượng hình ảnh, khoảng cách, phân cấp, và áp lực còn yếu | Buộc một Bố cục Chữ ký cho mỗi trang — không dự phòng về grid mặc định |
| **Ánh sáng** | Chỉ có ánh sáng bề mặt — không có logic ánh sáng thực, hành vi bóng, hoặc kiểm soát vật liệu | Màu sắc lấy từ cảnh phim thực tế, kết hợp với thư viện background-techniques |
| **Cảm giác cao cấp** | Sạch nhưng không đắt, không kiềm chế, không đủ định hướng | Checklist Hiệu chỉnh Cao cấp buộc các quyết định rõ ràng "điều chúng ta sẽ KHÔNG làm" |
| **Tính độc đáo** | Sau nhiều demo, tư thế hero, nhịp điệu section, và hình học bắt đầu lặp lại | Giao thức Độc đáo Demo: kiểm toán lịch sử + danh sách cấm Shell trước mỗi dự án mới |

---

## Tính Năng Cốt Lõi

| Tính năng | Mô tả |
|-----------|-------|
| **Suy luận trước** | AI phải phát triển luận điểm hình ảnh độc đáo — không chọn từ thư viện preset |
| **Đạo diễn trước** | Định hướng cảm xúc đến từ một bộ phim thực sự, không phải thương hiệu xa xỉ chung chung |
| **Nghiên cứu trước** | Khi có quyền truy cập web, nghiên cứu đạo diễn và bộ phim trước khi khóa Phase 1 |
| **Cổng bảng câu hỏi bắt đầu** | Mỗi lần gọi phải hoàn thành bảng câu hỏi mở trước khi Phase 1 bắt đầu |
| **Storyboard trước** | Viết `decisions.md`, `storyboard.md`, `compiled-spec.md` trước bất kỳ code frontend nào |
| **Giao thức Độc đáo Demo** | Kiểm toán đầu ra trước đó và áp dụng danh sách cấm Shell để ngăn các shell lặp lại giữa các dự án |
| **Chống dự phòng grid** | Grid được phép làm cơ sở hạ tầng căn chỉnh vô hình — không bao giờ là bố cục mặc định hiển thị |
| **Thân thiện với sub-agent** | Nghiên cứu phim, nghiên cứu thị trường ngách, cảnh trang, lát cắt spec, và xác minh có thể được ủy quyền trong khi một tác nhân chính duy trì tính nhất quán cuối cùng |

---

## Quy Trình Làm Việc

| Phase | Công việc chính | Artifact đầu ra |
|-------|----------------|----------------|
| **Phase 1 — Decisions** | Hoàn thành bảng câu hỏi bắt đầu, chọn đạo diễn + phim, chạy kiểm toán độc đáo, nghiên cứu nếu có quyền truy cập web | `decisions.md` |
| **Phase 2 — Storyboard** | Xác định ngữ pháp điện ảnh toàn trang, viết luận điểm cảnh cho mỗi vai trò trang, khóa bố cục chữ ký mỗi trang | `storyboard.md` |
| **Phase 3 — Compiled Spec** | Trích xuất camera / tương tác / bố cục / kết cấu / typography mỗi storyboard — hệ thống chia sẻ sau cùng | `compiled-spec.md` |
| **Phase 4 — Build & Verify** | Triển khai từ spec, thêm reduced-motion + responsive, xác nhận theo quy tắc chống rác | HTML / CSS / JS |

> **Thứ tự nội bộ Phase 2 (không thể thương lượng):**
> Ngữ pháp điện ảnh toàn trang → luận điểm cảnh mỗi trang → bố cục chữ ký mỗi trang → hệ thống chia sẻ

---

## Nền Tảng Được Hỗ Trợ

Claude Code và OpenAI Codex là hai nền tảng chính. Tất cả các nền tảng khác đều được hỗ trợ đầy đủ.

| Công cụ / Nền tảng | File entry | Cài đặt / Cấu hình |
|--------------------|-----------|-------------------|
| **Claude Code** *(chính)* | [`CLAUDE.md`](./CLAUDE.md) | `~/.claude/skills/cinematic-ui` |
| **Codex / ChatGPT** *(chính)* | [`CODEX.md`](./CODEX.md) | `$CODEX_HOME/skills/cinematic-ui` |
| **Cursor** | [`.cursor/rules/cinematic-ui.mdc`](./.cursor/rules/cinematic-ui.mdc) | Đã có trong `.cursor/rules/` — hoạt động khi clone |
| **Windsurf** | [`.windsurf/rules/cinematic-ui.md`](./.windsurf/rules/cinematic-ui.md) | Đã có trong `.windsurf/rules/` — hoạt động khi clone |
| **GitHub Copilot** | [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) | Đã có trong `.github/` — hoạt động khi clone |
| **Gemini / Antigravity** | [`GEMINI.md`](./GEMINI.md) | Đọc khi khởi động dự án |
| **Chia sẻ đa công cụ** | [`AGENTS.md`](./AGENTS.md) | Tham chiếu chung cho mọi agent |

---

## Cài Đặt

### Claude Code

**Windows:**
```powershell
git clone https://github.com/akseolabs-seo/cinematic-ui "$env:USERPROFILE\.claude\skills\cinematic-layout"
```

**macOS / Linux:**
```bash
git clone https://github.com/akseolabs-seo/cinematic-ui ~/.claude/skills/cinematic-ui
```

Sau đó gọi bằng `/cinematic-ui` trong Claude Code.

### Codex / ChatGPT

```bash
git clone https://github.com/akseolabs-seo/cinematic-ui $CODEX_HOME/skills/cinematic-ui
```

### Cursor / Windsurf / GitHub Copilot

```bash
git clone https://github.com/akseolabs-seo/cinematic-ui
```

Các file `.cursor/rules/`, `.windsurf/rules/`, và `.github/copilot-instructions.md` đã có sẵn. Không cần cấu hình thêm — các rule kích hoạt ngay khi repo có mặt trong dự án của bạn.

### Bất kỳ công cụ nào khác

Trỏ công cụ đến repo này hoặc sao chép file entry phù hợp. Xem bảng nền tảng ở trên.

---

## Mẫu Prompt Đề Xuất

```text
Use cinematic-layout to build a homepage.
Pick the director and film yourself.
If web access is available, research the director and film first.
Run the Demo Uniqueness Protocol.
Do not reuse shells from previous demos.
Optimize for a great single-page result before building a shared system.
```

---

## Thư Viện Tham Chiếu

Tất cả dữ liệu tham chiếu nằm trong `references/`, được tổ chức theo phase. Chỉ tải những gì phase hiện tại cần — không đọc toàn bộ thư viện cùng lúc.

### Các File Rule Cốt Lõi

| File | Mục đích |
|------|---------|
| [`references/library-index.md`](./references/library-index.md) | File nào cần đọc theo phase — bắt đầu tại đây |
| [`references/premium-calibration.md`](./references/premium-calibration.md) | Tự kiểm tra sau brief đạo diễn: kiềm chế và chất lượng cao cấp |
| [`references/anti-garbage.md`](./references/anti-garbage.md) | Các mẫu suy thoái thiết kế AI phổ biến — chạy trong Phase 3 và Phase 4 |
| [`references/anti-convergence.md`](./references/anti-convergence.md) | Lựa chọn dựa trên hash để ngăn các shell lặp lại giữa các demo hoặc trang |
| [`references/implementation-guardrails.md`](./references/implementation-guardrails.md) | Quy tắc Phase 3–4: danh sách hiệu ứng JS, Entrance Map, checklist Phase 3, Punch Up / Pull Back |
| [`references/reference-protocol.md`](./references/reference-protocol.md) | Cách phân tích một trang tham chiếu mà không sao chép nó |
| [`references/output-templates.md`](./references/output-templates.md) | Mẫu định dạng chuẩn cho từng artifact phase |

### Thư Viện Dữ Liệu (Phase 1–3)

| File | Nội dung |
|------|---------|
| `references/data/directors-200.md` | 200+ đạo diễn theo thể loại, với phim đặc trưng và mô tả phong cách hình ảnh |
| `references/data/hero-archetypes.md` | 30 tùy chọn skeleton hero |
| `references/data/narrative-beats.md` | 25 nhịp điệu narrative + 18 mẫu arc đạo diễn |
| `references/data/section-functions.md` | 50 loại section chức năng |
| `references/data/section-archetypes.md` | 91+ tùy chọn skeleton section |
| `references/data/dna-index.tsv` | Chỉ mục Design DNA của 1.486 trang — có thể tìm kiếm theo tâm trạng, loại, chuyển động |
| `references/data/design-dna-db.txt` | Dữ liệu DNA cấp trang sâu (chỉ tải khi có kết quả từ index) |
| `references/data/camera-shots-50.md` | 55 hành vi entrance và reveal với CSS |
| `references/data/interaction-effects-50.md` | 55+ tương tác hover / click / scroll (bao gồm biến thể yêu cầu JS) |
| `references/data/compositions.md` | 80 bố cục layout và logic grid |
| `references/data/visual-elements.md` | 40 yếu tố trang trí hình ảnh |
| `references/data/background-techniques.md` | 50+ kỹ thuật hero background và lớp atmosphere |
| `references/data/typography-cinema.md` | 40+ xử lý hiệu suất văn bản và phân cấp |
| `references/data/color-grades.md` | 40+ dịch bảng màu phim sang token UI |
| `references/data/font-moods.md` | 30+ cặp font theo tông màu |
| `references/data/textures.md` | 30+ kỹ thuật bề mặt grain / grid / dust / scan line |

---

## Cấu Trúc Repository

```text
cinematic-layout/
├── SKILL.md                              ← logic skill chính (entry chính cho tất cả agent)
├── skill.json                            ← manifest skill chung
├── directors-library.md                  ← file tương thích legacy
│
├── CLAUDE.md                             ← Claude Code
├── AGENTS.md                             ← tham chiếu chia sẻ đa công cụ
├── CODEX.md                              ← Codex / ChatGPT
├── GEMINI.md                             ← Gemini / Antigravity
│
├── .cursor/
│   └── rules/
│       └── cinematic-ui.mdc          ← Cursor rules (tự động tải)
│
├── .windsurf/
│   └── rules/
│       └── cinematic-ui.md           ← Windsurf rules (tự động tải)
│
├── .github/
│   ├── copilot-instructions.md           ← GitHub Copilot (tự động tải)
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
│
├── agents/
│   └── openai.yaml                       ← metadata skill OpenAI
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
    └── data/                             ← 18 thư viện dữ liệu thiết kế (~600KB tổng)
```

---

## Theo Dõi

Để nhận cập nhật và nội dung quy trình AI / thiết kế:

- [Threads: @darkseoking](https://www.threads.com/@darkseoking)

---

## Đóng Góp

Vui lòng đọc [CONTRIBUTING.md](./CONTRIBUTING.md) trước khi mở PR.

## Giấy Phép

MIT. Xem [LICENSE](./LICENSE).
