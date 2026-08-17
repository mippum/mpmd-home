# TODO

저장소 분석(2026-08-15)에서 나온 항목들입니다. 처리하면 체크하고, 판단이 필요한 항목은
결정 내용을 함께 적어두세요.

## 확인 필요 (공개 의도 미확정)

이 두 항목은 `docs/` 아래에 있어 **빌드에 포함되고 공개 도메인에서 접근 가능**합니다.
의도한 배포인지 먼저 판단해야 나머지 정리를 진행할 수 있습니다.

- [ ] **`docs/assets/webs/admin/`** — `admin-pangaea` SPA(약 1.09MB). nav 에도 없고
      어떤 md 에서도 참조하지 않는데 `md.mippum.com/assets/webs/admin/` 로 접근됩니다.
      의도한 것이 아니면 저장소에서 제거.
- [ ] **`docs/assets/webs/content/tmp/chrome_shortcut/`** — 네이버 홈 PWA 바로가기
      설치 페이지. 디렉터리명은 `tmp` 인데 실제로는 프로덕션에 배포됩니다.
      네이버 로고·브랜드 색상을 사용하고 아이콘을 네이버 CDN 에서 직접 링크합니다.
      유지한다면 `tmp` 가 아닌 정식 경로로 옮기고, 아니면 제거.

## 정리

- [ ] **미사용 dev 번들 삭제** — `docs/assets/webs/libs/react-dom.umd.dev.js`(1.1MB),
      `react.umd.dev.js`(113KB). 참조하는 곳이 한 곳도 없습니다.
      `docs/` 전체 8.3MB 중 상당 부분이 이 파일들입니다.
- [ ] **`docs/index.en.md` 처리** — 내용이 `preparing` 한 줄뿐입니다.
      i18n 플러그인이 `mkdocs.yml` 에서 주석 처리된 상태라 번역본이 아니라
      **독립 페이지 `/index.en/` 로 빌드·공개되고 검색에도 노출**됩니다.
      영문 지원 계획이 없으면 삭제, 있으면 i18n 플러그인 활성화.
- [ ] **`mkdocs-static-i18n` 의존성 정리** — 위 항목과 연동. 현재 미사용인데
      `requirements.txt` / `requirements.min.txt` 양쪽에 들어 있습니다.
- [ ] **루트 `CNAME` 삭제** — 배포에 실제로 쓰이는 것은 `docs/CNAME` 입니다.
      루트 파일은 중복이며 두 값이 어긋나면 혼란만 남습니다.
- [ ] **미사용 샘플 데이터 정리** —
      `content/service/listening-trainer/samples/{hamlet,lincoln}.json` 은
      어디에서도 참조되지 않습니다(홈 카드가 인코딩 문자열을 직접 사용).
      퀴즈 샘플 5개 중에도 2개만 링크되어 있습니다. 아래 `fileUrl` 전환 항목과 함께 처리.

## 개선

- [ ] **듣기 트레이너 카드를 `fileUrl` 방식으로 전환** — `docs/index.md:34`, `:52` 의
      `contentDetail=` 값이 수천 자짜리 인코딩 문자열이라 대사 한 글자도 손으로 못 고칩니다.
      퀴즈는 이미 `fileUrl` 로 JSON 을 참조하고, 듣기용 샘플 JSON 도 이미 존재하므로
      방식을 통일하면 유지보수와 미사용 샘플 문제가 동시에 해결됩니다.
- [ ] **홈 카드 스타일 공통화** — `docs/index.md` 의 카드 4개가 동일한 인라인 `style`
      블록을 그대로 반복합니다. `extra_css` 에 `.card` 클래스 하나로 빼면
      파일이 1/3 수준으로 줄어듭니다.
- [ ] **링크 형식 통일** — 카드 4만 `/service/quiz?fileUrl=` (뒤 슬래시 없음),
      나머지는 `/service/quiz/`. 디렉터리 URL 리다이렉트를 한 번 더 타게 됩니다.
- [ ] **홈 하단 "바로가기 요약" 과 nav 중복** — 서비스가 늘어나면 두 곳을 모두
      갱신해야 합니다. 유지 여부 결정.

## 앱설정 화면 확장

현재 «버전» 하나뿐입니다. 아래는 앱이 이미 가진 것 중 꺼내 쓸 수 있는 항목들입니다.

**판단 기준은 «앱 배포가 필요한가»입니다.** 앱을 건드리는 항목은 버전 게이트
(`app-native.js` 의 최소 버전 상수)가 하나씩 늘지만, 웹 전용 항목은 `make deploy` 한 번으로
1.0.4 이상 전 사용자에게 즉시 나갑니다. **웹 전용부터 처리하는 편이 유리합니다.**

### 심사 종료 후 되돌릴 것

- [ ] **«소개» 버튼과 팝업 삭제** — 스토어 심사자가 앱의 목적을 바로 확인할 수 있도록
      한시적으로 넣었습니다. 설정 탭의 성격과는 맞지 않으니 **심사가 끝나면 지우세요.**
      네이티브 브릿지를 타지 않고 웹이 직접 띄우므로 앱 변경 없이 지울 수 있습니다.
      지울 곳은 세 군데이고 모두 `임시` 주석으로 범위를 표시해뒀습니다.

      - `docs/app-setting/index.md` — `#mp-setting-about` 버튼, `#mp-about-modal`, 스크립트 블록
      - `docs/assets/webs/css/app-native.css` — `.mp-modal*`, `.mp-about-meta` 규칙
- [ ] **소개 블록의 빈칸 채우기** — 문의 이메일, 사업자등록번호가 비어 있습니다.
      **심사 제출 전에 채우세요.**

### 웹만으로 가능 (앱 배포 불필요)

- [ ] **기기 ID 표시** — `localStorage['device']['mp-device-id']` 에 이미 있어 웹이 바로
      그릴 수 있습니다. 이 값은 모든 API 호출과 원격 로깅에 `mp-device-id` 헤더로 실려
      있어 **문의가 들어왔을 때 서버 로그를 특정할 수 있는 유일한 키**입니다.
      복사 버튼까지 붙이면 실효성이 있습니다. 버전 정보와 성격도 맞습니다.
- [ ] **저장된 설정 초기화** — 목소리 선택이 꼬여 재생이 안 될 때 복구 수단이 없습니다.
      웹이 쓰는 localStorage 키는 `device`(앱이 심는 기기 정보)와
      `service.listening-trainer`(반복 횟수·선택 목소리) 둘뿐입니다.
      **`service.listening-trainer` 만 지우고 `device` 는 건드리지 마세요.**
- [ ] **이용약관 / 개인정보처리방침** — 스토어 심사에서 통상 요구되는데 앱 어디에도
      없습니다. mkdocs 페이지로 만들고 링크만 걸면 됩니다.

### 앱 변경 필요

- [ ] **업데이트 확인 버튼** — 지금은 `checkAutomatically: ON_LOAD` 라 앱을 껐다 켜야만
      OTA 를 받습니다. 수동 확인(`checkForUpdateAsync` → `fetchUpdateAsync` → `reloadAsync`)이
      있으면 «최신 업데이트» 시각을 보여주는 버전 화면과 짝이 맞습니다.
- [ ] **TTS 음성 설정 열기** — 안드로이드 시스템 TTS 설정으로 보내는 항목.
      전자책 문서에 `android_tts_setting.png`, `galaxy_tts_setting.png` 안내 이미지를
      따로 넣어둘 만큼 실제로 걸리는 부분인데 앱에서 바로 갈 방법이 없습니다.
- [ ] **알람(로컬 알림) 설정** — 시각을 정하면 매일 그 시각에 알림.
      기본값은 알람 없음. **시각 선택 UI 는 웹의 `<input type="time">` 으로 만드세요** —
      네이티브 시간 선택 라이브러리를 새로 넣으면 스토어 빌드가 강제되어
      OTA 배포 이점이 사라집니다. 웹은 화면, 네이티브는 예약 — 듣기 트레이너와 같은 구조.
      상세 검토는 mp-webapp `TODO.md` 의 «로컬 알림(알람)» 항목에 있습니다.

### 넣지 말 것

- **푸시 알림 on/off 설정** — `expo-notifications` 가 `package.json` 에 있지만 원격 푸시는
  자격증명·서버가 전혀 없습니다(mp-webapp TODO 의 🔵 섹션 참고). 설정 화면을 만들 실체가
  아직 없습니다. **로컬 알람과는 다른 이야기입니다** — 위 알람 항목은 FCM 없이 가능합니다.

### 구조 개선 제안

- [ ] **`device` 에 지원 기능 목록 심기** — 지금은 웹이 `app-version` 문자열을 파싱해
      `1.0.4` 이상인지 따집니다. 기능이 늘 때마다 최소 버전 상수가 하나씩 늘어납니다.

      ```json
      { "app-version": "A1.0.5AK",
        "features": ["app-setting.version", "app-setting.alarm"] }
      ```

      이러면 버전과 무관하게 `features.includes(...)` 로 판별해 게이트가 쌓이지 않습니다.
      앱을 다음에 손볼 때 함께 넣으면 좋습니다.

## 검색 노출 (SEO)

검색엔진 노출 점검(2026-08-16). 아래 수치는 빌드 산출물을 직접 측정한 값입니다.

**점검 당시 상태**

| 항목 | 당시 | 현재 |
|---|---|---|
| `site/sitemap.xml` | **URL 0개** (빈 파일) | URL 5개 |
| canonical 태그 | 없음 | 페이지별 생성 |
| `robots.txt` | 없음 | 있음 |
| OG 태그 | 없음 | 페이지별 생성 |
| meta description | 전 페이지 동일(영어) | 페이지별 |

크롤러가 읽는 본문 텍스트량 (`<article>` 안, 스크립트 제외) — **이건 그대로입니다**:

```
전자책 1문1답 영문전치사   2112자
전자책 자기긍정확언        1929자
홈                          539자
퀴즈                        227자
듣기 트레이너                14자
```

### 1순위 — 검색엔진 사이트 등록

**이게 없으면 아래 작업이 대부분 무의미합니다.** 소유확인 절차가 필요해 사람이 직접 해야 합니다.

- [ ] 구글 [Search Console](https://search.google.com/search-console) 등록 → 사이트맵 제출
- [ ] 네이버 [서치어드바이저](https://searchadvisor.naver.com) 등록 → 소유확인 →
      사이트맵·robots.txt 제출. **네이버는 등록하지 않으면 거의 노출되지 않습니다.**

### 2순위 — 기술적 기반 *(2026-08-16 완료 · 배포 필요)*

- [x] **`mkdocs.yml` 에 `site_url` 추가** (`https://md.mippum.com/`) —
      sitemap 이 비어 있던 원인. **URL 0개 → 5개**, canonical 태그 생성됨.
- [x] **`robots.txt` 추가** (`docs/robots.txt`) — 네이버 `Yeti` 명시 허용 +
      사이트맵 위치 지정. 색인 제외를 `Disallow` 로 하지 않은 이유는 파일 안에 적어뒀습니다
      (크롤링을 막으면 로봇이 `noindex` 를 못 읽어 URL 만 검색결과에 남을 수 있음).
- [x] **페이지별 meta description** — 각 페이지 front matter 의 `description`.
      홈·듣기 트레이너·퀴즈·전자책 2종에 서로 다른 설명. `site_description` 도 한국어로 교체.
- [x] **OG 태그 추가** — `overrides/main.html` 의 `extrahead` 에
      og:type/site_name/locale/title/description/url/image + 트위터 카드.
      전자책 페이지는 front matter 의 `image` 로 각자 표지를 씁니다.
- [x] **색인 제외 처리** — `/index.en/` 과 `/app-setting/` 에 `noindex: true`.
      `overrides/sitemap.xml` 이 같은 값을 보고 사이트맵에서도 제외합니다.
      *(`index.en.md` 파일 자체 처리는 위 «정리» 항목에 그대로 남아 있습니다)*

> **아직 배포되지 않았습니다.** `make deploy` 후 1순위의 사이트 등록·사이트맵 제출을
> 해야 실제 노출로 이어집니다.

- [ ] **공개 자산의 robots 처리 판단** — 위 «확인 필요» 의 `admin/`, `chrome_shortcut/`
      공개 의도가 정해지면 `robots.txt` 반영 여부를 결정. 현재는 어디에서도 링크되지 않아
      사이트맵에는 없습니다.

### 3순위 — 콘텐츠

- [ ] **서비스 페이지에 정적 설명 텍스트 추가** — 효과가 가장 크지만 손이 많이 갑니다.
      듣기 트레이너 14자, 퀴즈 227자로 크롤러가 읽을 내용이 사실상 없습니다.
      React UMD 로 그려지기 때문인데, **네이버 Yeti 는 JS 를 실행하지 않는 것으로
      알려져 있어** 현재 구조로는 네이버 색인이 어렵습니다.
      "무엇인지 / 어떻게 쓰는지" 를 마크다운으로 300~500자 적어두면 됩니다 —
      UMD 번들 수정 없이 마크다운만으로 가능합니다.
- [ ] **네이버 유입 전략 검토** — 네이버는 자체 서비스(블로그·카페) 문서를 우선
      노출하는 경향이 강해 웹사이트 SEO 만으로는 한계가 있습니다.
      블로그를 병행하고 사이트로 링크하는 편이 현실적입니다.

## 빌드 / 배포

- [ ] **CI 없음** — `.github/` 자체가 없어 배포가 전적으로 로컬 수동
      `mkdocs gh-deploy` 입니다. `make lint` 도 강제되지 않습니다.
      GitHub Actions 로 빌드·lint 검증 + `gh-pages` 자동 배포 구성 검토.
- [ ] **`make lint` 글로브 수정** — `markdownlint docs/**/*.md` 는 셸에 따라
      하위 디렉터리를 재귀 탐색하지 못합니다. `markdownlint "docs/**/*.md"` 로
      따옴표를 씌우거나 `--glob` 사용.
- [ ] **`requirements.txt` vs `requirements.min.txt` 역할 문서화** —
      전자는 전체 freeze, 후자는 직접 의존성이며 `make install-env` 가 쓰는 것은
      후자입니다. README 에 한 줄 명시. *(README 에 반영 완료 시 체크)*
- [x] **Makefile 타깃 이중화 정리** — `*-window` 접미사 타깃을 없애고 모든 타깃이
      `$(MKDOCS)`(기본값 `$(SCRIPTS)/mkdocs`)를 쓰도록 통합. 타깃 10개 → 7개.
      `.vscode/tasks.json`, `launch.json` 의 참조도 함께 갱신.
- [ ] **`make clean` 이식성** — `rm -rf site/` 라 Windows 기본 셸에서는 실패합니다.
      Bash 에서 실행하거나 OS 분기 추가.
