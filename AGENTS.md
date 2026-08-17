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
overrides/main.html              # 테마 오버라이드. 네이티브 앱 판별 스크립트가 들어있음
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
├─ app-setting/index.md          # 앱설정. 네이티브 앱에서만 노출 (아래 참고)
└─ assets/webs/
   ├─ libs/                      # 벤더 UMD (react, react-dom, tailwind, emotion)
   ├─ umds/<app>/dist/index.umd.js  # 각 서비스 앱 번들 (외부 빌드 결과물)
   ├─ content/                   # 서비스가 런타임에 로드하는 JSON 데이터
   ├─ images/                    # 페이지 이미지
   ├─ css/app-native.css         # 앱 전용 노출 제어 + 앱설정 페이지 스타일
   ├─ js/app-native.js           # 브릿지 헬퍼 (window.mpApp)
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

## 네이티브 앱 전용 노출

`md.mippum.com` 은 브라우저에서도 열리고, Expo WebView 래퍼 앱([mp-webapp](https://github.com/greenyant/mp-webapp))
안에서도 열립니다. 앱설정 메뉴는 **앱에서만** 보여야 합니다.

**앱 판별은 `window.ReactNativeWebView` 로 합니다.** react-native-webview 가 페이지 스크립트보다
먼저 주입하므로 동기적으로 읽을 수 있습니다.

> `localStorage['device']` 의 존재 여부로 판별하면 안 됩니다. 웹 번들의 `getDeviceStored()` 가
> 키가 없으면 userAgent 로 `platform-os` 를 채워 **스스로 만들어 넣기** 때문에
> 일반 모바일 브라우저에도 존재합니다.

`<html>` 에 붙는 상태 클래스는 두 가지입니다.

| 클래스 | 의미 |
|---|---|
| `.mp-in-app` | 네이티브 앱 안 (버전 무관) |
| `.mp-app-setting` | 앱설정을 지원하는 앱 (1.0.4+) |

동작 순서:

1. `overrides/main.html` 이 `<head>` 에서 `app-native.js` 를 **동기 로드**합니다.
   `extra_javascript` 는 문서 끝에 붙어 메뉴가 깜빡이므로 쓰지 않습니다
2. 스크립트가 `<body>` 파싱 전에 위 클래스를 확정합니다
3. `assets/webs/css/app-native.css` 가 `html:not(.mp-app-setting)` 일 때 앱설정을 숨깁니다
   (기본이 숨김이라 웹에서 깜빡이지 않습니다)
4. 같은 스크립트가 `:has()` 미지원 브라우저와 활성 nav 링크를 폴백으로 처리합니다

페이지 안에서는 `.mp-app-only` / `.mp-web-only` 클래스로 노출을 나눕니다.
앱 전용 페이지를 추가하면 `app-native.js` 의 `APP_ONLY_PATHS` 에도 경로를 넣으세요.

### 앱 버전으로 기능 가르기

**웹은 즉시 전체 배포되지만 앱은 스토어를 거칩니다.** 구버전 앱에 핸들러가 없는 기능은
버전으로 걸러야 눌러도 반응 없는 버튼이 생기지 않습니다.

앱 버전은 `localStorage['device']['app-version']` 에서 읽습니다. 값은 앱의
PUSH_CODED_VERSION 형식입니다 — `A1.0.4AJ` = 플랫폼(`A`/`I`) + 앱 버전 + 2글자 카운터.
`app-native.js` 의 `readAppVersion()` 이 여기서 `[1, 0, 4]` 를 뽑고,
`APP_SETTING_MIN_VERSION` 과 자리별 숫자로 비교합니다(문자열 비교는 `'10' < '9'` 라 쓸 수 없음).

주의할 점 두 가지:

- **이 값은 페이지 로드 *후* 주입됩니다.** 앱의 `injectedJavaScript` 가 `onLoadEnd` 시점에
  돌기 때문입니다. localStorage 가 유지되므로 보통 두 번째 페이지부터는 이미 있지만,
  앱 최초 실행의 첫 페이지에서는 비어 있을 수 있어 `RECHECK_DELAYS` 로 잠시 재확인합니다.
- **앱 쪽에서 `.env` 의 PUSH_CODED_VERSION 을 올려야 게이트가 열립니다.**
  스토어 빌드를 새로 냈는데 이 값을 그대로 두면 웹은 여전히 구버전으로 판단합니다.

### 네이티브로 메시지 보내기

```js
window.mpApp.post('app-setting.version-open', {}); // 앱이 아니면 false 반환
```

메시지 타입은 mp-webapp 의 `src/util/webview-message-handler/IWebviewMessage.tsx` 에
정의돼 있습니다. **웹과 앱은 독립 배포되므로 어느 쪽이 먼저 올라가도 동작해야 합니다** —
새 타입을 쓰는 웹이 먼저 배포되면 구버전 앱은 그 메시지를 무시합니다.

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

## 검색 노출 (SEO)

`mkdocs.yml` 의 **`site_url` 을 지우지 마세요.** 이 값이 없으면 sitemap.xml 이 빈 파일이 되고
canonical·OG 태그도 생성되지 않습니다.

`overrides/main.html` 이 페이지 front matter 를 읽어 다음을 처리합니다.

| front matter | 효과 |
|---|---|
| `description:` | `<meta name="description">` 과 OG·트위터 설명. **새 페이지에는 꼭 넣으세요** — 없으면 `site_description` 이 그대로 쓰여 모든 페이지 스니펫이 같아집니다 |
| `image:` | OG 이미지 경로 (`docs/` 기준 상대경로). 없으면 기본 이미지 |
| `noindex: true` | `<meta name="robots" content="noindex, follow">` + **사이트맵에서 제외** |

- 색인 제외는 `robots.txt` 의 `Disallow` 가 아니라 `noindex` 로 합니다. 크롤링을 막으면
  로봇이 `noindex` 태그를 읽지 못해 오히려 URL 만 검색결과에 남을 수 있습니다.
- `overrides/sitemap.xml` 은 mkdocs 기본 템플릿에 `noindex` 제외만 더한 것입니다.
  mkdocs 를 올릴 때 원본이 바뀌었는지 확인하세요.
- 서비스 페이지는 React UMD 로 그려져 HTML 에 텍스트가 거의 없습니다.
  검색 유입을 늘리려면 마크다운에 정적 설명을 덧붙여야 합니다 (TODO.md 3순위).

## 문서 작성 컨벤션

- 언어는 한국어. `mkdocs.yml` 의 `theme.language: ko`.
- 목차를 숨기려면 front matter 에 `hide: [toc]`.
- 마크다운 안에 HTML 을 섞어 쓰는 것이 이 저장소의 관행입니다(카드 그리드, 이미지 배치 등).
  단, 인라인 `style` 반복은 지양하고 가능하면 공통 CSS 로 빼세요.
### 마크다운 안의 raw HTML — 두 가지 함정

둘 다 **빌드는 `--strict` 로도 통과하고** 증상이 엉뚱한 곳에 나타나서 알아채기 어렵습니다.

**1. 블록 요소로 인식되지 않는 태그를 최상위에 두지 마세요.**

`div`, `p`, `ul`, `table`, `dl` 은 Python-Markdown 의 블록 태그 목록에 있지만
`dialog` 같은 나중에 생긴 HTML5 태그는 **없습니다.** 목록에 없는 태그를 최상위에 쓰면
인라인으로 취급되어 여는 태그와 닫는 태그가 각각 문단으로 감싸지고 DOM 이 깨집니다.
**`div` 로 한 겹 감싸면 해결됩니다** — `docs/app-setting/index.md` 의 `.mp-modal-host` 가 그 예입니다.

**2. 여러 줄 `<script>` 블록 안에 빈 줄을 넣지 마세요.**

마크다운 처리기와 IDE 모두 빈 줄에서 raw HTML 블록을 끊습니다. Python-Markdown 은
넘어가지만 **JetBrains IDE 는 거기서 JS 주입을 끊어** 조각이 `})();` 없이 잘립니다.
그러면 실제로는 멀쩡한 코드에 `} 누락`, `표현식 구문이 대입 또는 호출이 아닙니다` 같은
오류가 뜹니다. 구분이 필요하면 빈 줄 대신 `//` 주석 줄을 쓰세요.

**검사 방법** — HTML 이나 스크립트를 새로 넣었다면:

```bash
grep -n "<p><" site/**/*.html     # 1번: 문단으로 감싸졌는지
```

스크립트 안 빈 줄은 파일에서 직접 확인하고, 의심되면 스크립트만 뽑아
`node --check` 로 문법을 확인하세요.
- 들여쓰기 2칸 (`.vscode/settings.json`).
- 새 고유명사가 lint 에 걸리면 `.cspell.json` 의 `words` 에 추가.

## 명령어

```bash
make serve        # 로컬 미리보기 (http://127.0.0.1:8000)
make build        # site/ 로 정적 빌드
make lint         # markdownlint + cspell
make install-env  # .venv 생성 후 requirements.min.txt 설치
make deploy       # gh-pages 배포 — 사람이 직접 실행
```

`mkdocs` 타깃은 모두 `$(MKDOCS)`(기본값 `.venv/Scripts/mkdocs` 또는 `.venv/bin/mkdocs`)를
호출합니다. `mkdocs` 는 시스템 PATH 에 없으므로 가상환경 밖에서 맨 `mkdocs` 를
직접 실행하지 마세요 — `make` 를 거치거나 `MKDOCS=` 로 넘기면 됩니다.

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
