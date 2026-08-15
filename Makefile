ifeq ($(OS),Windows_NT)
	SCRIPTS := .venv/Scripts
	ORIGIN_PYTHON := python
else
	SCRIPTS := .venv/bin
	ORIGIN_PYTHON := python3
endif

# 가상환경(.venv) 안의 mkdocs 를 사용합니다.
# 시스템 PATH 의 mkdocs 를 쓰려면 MKDOCS=mkdocs 를 넘기세요. (예: make build MKDOCS=mkdocs)
MKDOCS ?= $(SCRIPTS)/mkdocs

.PHONY: serve build deploy deploy-force lint clean install-env

# 로컬 서버 실행 (실시간 미리보기)
serve:
	$(MKDOCS) serve

# 배포 전 build 검증 (strict: 경고가 있으면 실패, deploy 전 build 불필요)
build:
	$(MKDOCS) build --strict

# gh-pages 브랜치로 배포
deploy:
	$(MKDOCS) gh-deploy --strict

# 강제 배포 (기존 gh-pages 브랜치 덮어쓰기)
deploy-force:
	$(MKDOCS) gh-deploy --force

# 문서 검사 (lint 설치 명령: "npm install -g markdownlint-cli", "npm install -g cspell")
lint:
	markdownlint docs/**/*.md
	cspell "docs/**/*.md"

# site/ 삭제 (rm 을 쓰므로 Bash 에서 실행)
clean:
	rm -rf site/

# 가상환경 생성 및 의존성 설치
install-env:
	$(ORIGIN_PYTHON) -m venv .venv
	$(SCRIPTS)/pip install -r requirements.min.txt
