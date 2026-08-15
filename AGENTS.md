# AGENTS.md

이 저장소에서 작업하는 AI 에이전트를 위한 안내입니다. 사람이 읽어도 무방합니다.

## 이 저장소는 무엇인가

**미쁨Edu ONLINE** (`md.mippum.com`) — MkDocs Material 기반 정적 사이트입니다.
마크다운 문서를 셸로 쓰고, 그 안에 React UMD 번들을 `<script>`로 주입해 웹 서비스를
구동하는 것이 이 프로젝트의 핵심 구조입니다.

- 문서 소스: `docs/`
- 빌드 산출물: `site/` (git 추적 안 함)
- 배포: `mkdocs gh-deploy` → `gh-pages` 브랜치 → GitHub Pages
- 커스텀 도메인: `docs/CNAME` (`md.mippum.com`)

## 디렉터리 구조

```
docs/
├─ index.md                      # 홈. 콘텐츠 바로가기 카드 그리드
├─ index.en.md                   # (미완성) i18n 미사용 상태라 독립 페이지로 빌드됨
├─ CNAME                         # 배포에 실제로 쓰이는 CNAME
├─ service/
│  ├─ listening-trainer/index.md # 듣기 트레이너 (UMD 마운트 페이지)
│  └─ quiz/index.md              # 퀴즈 (UMD 마운트 페이지)
├─ epub/
│  ├─ self-affirmation.md        # 전자책 소개 (정적 HTML 페이지)
│  └─ preposition.md
└─ assets/webs/
   ├─ libs/                      # 벤더 UMD (react, react-dom, tailwind, emotion)
   ├─ umds/<app>/dist/index.umd.js  # 각 서비스 앱 번들 (외부 빌드 결과물)
   ├─ content/                   # 서비스가 런타임에 로드하는 JSON 데이터
   ├─ images/                    # 페이지 이미지
   └─ admin/                     # 별개 SPA. 어디에서도 링크되지 않음 (TODO.md 참고)
```

## 서비스 페이지가 동작하는 방식

`docs/service/*/index.md` 는 일반 마크다운 파일이지만 내용은 사실상 마운트 코드입니다.

```html
<div id="root"></div>
<script src="/assets/webs/libs/react.umd.js"></script>
<script src="/assets/webs/libs/react-dom.umd.js"></script>
<script src="/assets/webs/umds/quiz/dist/index.umd.js"></script>
<script>
  const { QuizPage } = window.Quiz;
  ReactDOM.createRoot(document.getElementById("root")).render(
    React.createElement(QuizPage)
  );
</script>
```

알아야 할 점:

- **번들 소스는 이 저장소에 없습니다.** `umds/*/dist/index.umd.js` 는 다른 프로젝트에서
  빌드된 결과물을 복사해 넣은 것입니다. 여기서 앱 로직을 고치려 하지 마세요.
  UI 동작 문제를 발견하면 수정 대신 `TODO.md`에 기록하세요.
- 각 번들은 전역(`window.Quiz`, `window.ListeningTrainer`)에 컴포넌트를 노출합니다.
  스크립트 로드 순서(vendor → app → 마운트)를 반드시 지켜야 합니다.
- 자산 경로는 **루트 절대경로**(`/assets/...`)를 씁니다. 상대경로로 바꾸지 마세요.
  `mkdocs serve`와 커스텀 도메인 배포 양쪽에서 루트가 동일하기 때문에 성립합니다.

## 콘텐츠 전달 방식

서비스는 쿼리 파라미터로 데이터를 받습니다.

| 서비스 | 파라미터 | 예시 |
|---|---|---|
| 퀴즈 | `?fileUrl=` | `/service/quiz/?fileUrl=/assets/webs/content/service/quiz/samples/korean-spelling.mpqz.json` |
| 듣기 트레이너 | `?fileUrl=` 또는 `?contentDetail=` + `?voiceLang=` | `contentDetail` 은 압축·인코딩된 본문 문자열 |

`docs/index.md` 의 듣기 카드는 현재 `contentDetail` 에 수천 자짜리 인코딩 문자열을
직접 박아 두었습니다. 손으로 편집할 수 없는 값이므로 **건드리지 마세요.**
내용 변경이 필요하면 `fileUrl` 방식으로 바꾸는 편이 낫습니다(`TODO.md` 참고).

## 작업 규칙

**해도 되는 것**

- `docs/**/*.md` 문서 편집
- `docs/assets/webs/content/**/*.json` 콘텐츠 데이터 추가·수정
- `mkdocs.yml` 의 `nav` 갱신 — **문서를 추가하면 `nav`에도 반드시 추가하세요.**
  누락하면 페이지는 빌드되지만 메뉴에 나타나지 않습니다.

**하기 전에 물어볼 것**

- `docs/assets/webs/umds/`, `docs/assets/webs/libs/` 의 파일 교체·삭제
- `docs/assets/webs/admin/`, `docs/assets/webs/content/tmp/` 관련 변경
  (공개 의도가 확정되지 않은 영역입니다)
- `mkdocs.yml` 의 `theme`, `plugins`, 도메인·배포 설정 변경
- 배포 실행(`gh-deploy`). **에이전트가 임의로 배포하지 마세요.**

**하지 말 것**

- `site/` 편집 (빌드 시 덮어써집니다)
- UMD 번들 내부 수정
- `docs/` 하위 자산 경로를 상대경로로 변경

## 문서 작성 컨벤션

- 언어는 한국어. `mkdocs.yml` 의 `theme.language: ko`.
- 목차를 숨기려면 front matter 에 `hide: [toc]`.
- 마크다운 안에 HTML 을 섞어 쓰는 것이 이 저장소의 관행입니다(카드 그리드, 이미지 배치 등).
  단, 인라인 `style` 반복은 지양하고 가능하면 공통 CSS 로 빼세요.
- 들여쓰기 2칸 (`.vscode/settings.json`).
- 새 고유명사가 lint 에 걸리면 `.cspell.json` 의 `words` 에 추가.

## 명령어

```bash
make serve          # 로컬 미리보기 (http://127.0.0.1:8000)
make build          # site/ 로 정적 빌드
make lint           # markdownlint + cspell
make install-env    # .venv 생성 후 requirements.min.txt 설치
make deploy-window  # gh-pages 배포 (Windows, .venv 사용) — 사람이 직접 실행
```

Windows 에서는 `.venv/Scripts` 를 쓰는 `*-window` 타깃을 사용합니다.

## 변경 후 확인

1. `make build` 가 경고 없이 통과하는지 (특히 깨진 링크 경고)
2. `make lint` 통과
3. 서비스 페이지를 건드렸다면 `make serve` 로 실제 렌더링 확인 —
   빌드는 성공해도 스크립트 로드 순서가 틀리면 빈 화면이 됩니다
4. 콘솔 에러 없는지

CI 가 없으므로 위 검증은 전부 로컬에서 이뤄집니다.

## 알려진 이슈

미해결 항목은 [TODO.md](TODO.md) 에 정리되어 있습니다. 관련 영역을 건드리게 되면
먼저 읽어보세요.
