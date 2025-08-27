ifeq ($(OS),Windows_NT)
	SCRIPTS := .venv/Scripts
	ORIGIN_PYTHON := python
else
	SCRIPTS := .venv/bin
	ORIGIN_PYTHON := python3
endif

# 로컬 서버 실행 (실시간 미리보기)
serve:
	mkdocs serve

# 정적 사이트 빌드 (site/ 폴더 생성)
build:
	mkdocs build

# 강제 배포 (기존 gh-pages 브랜치 덮어쓰기)
deploy-force:
	mkdocs gh-deploy --force

# 문서 검사 (lint 설치 명령: "npm install -g markdownlint-cli", "npm install -g cspell")
lint:
	markdownlint docs/**/*.md
	cspell "docs/**/*.md"

clean:
	rm -rf site/

install-env:
	$(ORIGIN_PYTHON) -m venv .venv
	$(SCRIPTS)/pip install -r requirements.min.txt

mkdoc-serve:
	${SCRIPTS}/python -m mkdocs serve

