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

## 검색 노출 (SEO)

검색엔진 노출 점검(2026-08-16)에서 나온 항목입니다. 빌드 산출물을 직접 측정한 결과입니다.

**측정된 현재 상태**

| 항목 | 현재 |
|---|---|
| `site/sitemap.xml` | **URL 0개** (`<urlset></urlset>` 빈 파일) |
| canonical 태그 | 없음 |
| `robots.txt` | 없음 |
| OG 태그 (공유 미리보기) | 없음 |
| meta description | 전 페이지 동일 — `Mippum's Home from MD Files` |

크롤러가 읽는 본문 텍스트량 (`<article>` 안, 스크립트 제외):

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

### 2순위 — 기술적 기반

- [ ] **`mkdocs.yml` 에 `site_url` 추가** (`https://md.mippum.com/`) —
      sitemap 이 비어 있는 원인입니다. 실제로 넣고 빌드해 확인한 결과
      **URL 0개 → 7개, canonical 태그 생성**. 한 줄로 해결됩니다.
- [ ] **`robots.txt` 추가** — 네이버 `Yeti` 크롤러 명시 허용 + 사이트맵 위치 지정.
      `docs/robots.txt` 로 두면 그대로 배포됩니다.
- [ ] **페이지별 meta description** — 지금은 전 페이지가 같은 영어 문장이라
      검색결과 스니펫이 전부 동일합니다. front matter 의 `description` 으로 지정.
- [ ] **OG 태그 추가** — 카톡·네이버 공유 시 미리보기가 뜨지 않습니다.
      Material 이 기본으로 넣지 않는 것을 확인했습니다(`site_url` 을 넣어도 생성 안 됨).
      `overrides/main.html` 의 `extrahead` 에 추가하면 됩니다.
- [ ] **색인 제외 처리** — sitemap 에 `/index.en/`("preparing" 페이지)와
      `/app-setting/`(앱 전용)이 함께 들어갑니다. 둘 다 검색에 노출될 이유가 없습니다.
      `noindex` meta 또는 sitemap 제외. 위 «정리» 의 `index.en.md` 항목과 함께 처리.

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
