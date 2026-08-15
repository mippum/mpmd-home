# mpmd-home

**미쁨Edu ONLINE** — <https://md.mippum.com>

마크다운 문서로 만든 미쁨 홈. MkDocs Material 기반 정적 사이트이며,
문서 페이지에 React UMD 번들을 주입해 듣기 트레이너·퀴즈 서비스를 함께 제공합니다.

## 요구 사항

- Python 3
- Node.js (lint 도구용, 선택)

## 시작하기

```bash
make install-env    # .venv 생성 + requirements.min.txt 설치
make serve          # http://127.0.0.1:8000
```

Windows 에서 `.venv` 의 실행 파일을 직접 쓰려면 `*-window` 타깃을 사용합니다.

```bash
make mkdoc-window-serve
```

## 명령어

| 명령 | 설명 |
|---|---|
| `make serve` | 로컬 서버 실행 (실시간 미리보기) |
| `make build` | `site/` 로 정적 빌드 |
| `make lint` | markdownlint + cspell 검사 |
| `make clean` | `site/` 삭제 |
| `make install-env` | 가상환경 생성 및 의존성 설치 |
| `make deploy-window` | `gh-pages` 브랜치로 배포 (Windows) |

lint 도구 설치:

```bash
npm install -g markdownlint-cli cspell
```

## 구조

```
docs/                     # 문서 소스 (사이트의 전부)
├─ index.md               # 홈 — 콘텐츠 바로가기 카드
├─ service/               # 듣기 트레이너, 퀴즈 (UMD 마운트 페이지)
├─ epub/                  # 전자책 소개
├─ assets/webs/           # 벤더 라이브러리, 앱 번들, 콘텐츠 JSON, 이미지
└─ CNAME                  # 커스텀 도메인
mkdocs.yml                # 사이트 설정 및 nav
site/                     # 빌드 산출물 (git 추적 안 함)
```

서비스 페이지(`docs/service/*/index.md`)는 일반 마크다운이 아니라
`docs/assets/webs/umds/<app>/dist/index.umd.js` 를 로드해 React 앱을 마운트하는
셸입니다. **해당 번들은 외부 프로젝트의 빌드 산출물이므로 이 저장소에서 수정하지 않습니다.**

문서를 추가하면 `mkdocs.yml` 의 `nav` 에도 등록해야 메뉴에 나타납니다.

## 배포

`gh-pages` 브랜치를 통한 GitHub Pages 배포입니다. CI 가 없으므로 수동 실행합니다.

```bash
mkdocs gh-deploy --remote-name origin
```

배포 전 `make build` 와 `make lint` 를 통과시키고,
서비스 페이지를 수정했다면 `make serve` 로 실제 렌더링까지 확인하세요.
빌드가 성공해도 스크립트 로드 순서가 틀리면 화면이 비어 있을 수 있습니다.

## 의존성 파일

- `requirements.min.txt` — 직접 의존성. `make install-env` 가 사용합니다.
- `requirements.txt` — 전체 `pip freeze` 결과 (버전 고정 참고용).

## 문서

- [AGENTS.md](AGENTS.md) — 저장소 구조·작업 규칙 (AI 에이전트 및 신규 기여자용)
- [CLAUDE.md](CLAUDE.md) — Claude Code 용 지침
- [TODO.md](TODO.md) — 미해결 이슈 및 개선 항목

## 참고

VS Code 권장 확장은 `.vscode/extensions.json` 에 정의되어 있습니다
(markdownlint, Code Spell Checker, Prettier).
설치된 확장 목록 확인: `code --list-extensions`
