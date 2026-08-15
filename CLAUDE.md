# CLAUDE.md

이 저장소의 에이전트 지침은 [AGENTS.md](AGENTS.md) 에 있습니다. 작업 전에 먼저 읽으세요.

미해결 이슈 목록은 [TODO.md](TODO.md) 입니다.

## 요약

**미쁨Edu ONLINE** (`md.mippum.com`) — MkDocs Material 정적 사이트.
마크다운 페이지에 React UMD 번들을 `<script>` 로 주입해 서비스를 구동합니다.

- 소스는 `docs/`, 빌드 산출물 `site/` 는 추적하지 않음
- 배포: `mkdocs gh-deploy` → `gh-pages` 브랜치
- `docs/assets/webs/umds/*/dist/index.umd.js` 는 **외부 빌드 산출물** — 수정 대상이 아님

## Claude Code 작업 시

- 플랫폼은 Windows 이고 `mkdocs` 는 **PATH 에 없습니다.** `.venv/Scripts` 안에만 있으므로
  반드시 `-window` 접미사 타깃을 쓰세요. 접미사 없는 `make build` / `make serve` 는
  `CreateProcess ... failed` 로 실패합니다.
- `make clean` 은 `rm -rf` 를 쓰므로 PowerShell 이 아닌 Bash 에서 실행하세요.
- 문서를 새로 추가하면 `mkdocs.yml` 의 `nav` 갱신을 잊지 마세요.
- **배포 명령(`gh-deploy`)은 요청받았을 때만 실행합니다.** 사용자가 명시적으로 요구하지
  않았다면 빌드까지만 하고 멈추세요.
- 커밋 메시지는 Conventional Commits (`feat:`, `refactor:`, `chore:`) + 한국어 본문이
  이 저장소의 관행입니다.
- 자산 경로는 루트 절대경로(`/assets/...`)를 유지하세요.

## 검증

```bash
make build-window        # 링크 경고 확인
make lint                # markdownlint + cspell
make mkdoc-window-serve  # 서비스 페이지 변경 시 실제 렌더링 확인 필수
```

CI 가 없으므로 검증은 전부 로컬입니다. 빌드 성공이 페이지 정상 동작을 보장하지 않습니다 —
UMD 스크립트 로드 순서가 틀리면 빌드는 통과하고 화면만 비어 있습니다.
