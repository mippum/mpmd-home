---
description: 미쁨에듀 온라인 앱의 설정 화면입니다.
# 앱에서만 쓰는 페이지라 검색에 올릴 이유가 없다. 사이트맵에서도 빠진다.
noindex: true
hide:
  - toc
---

# 앱설정

<div class="mp-web-only mp-setting-notice">
  이 페이지는 <strong>미쁨에듀 온라인 앱 1.0.4 이상</strong>에서만 사용할 수 있습니다.
  앱으로 열거나, 앱을 최신 버전으로 업데이트해 주세요.
</div>

<div class="mp-app-only mp-setting-grid">

  <button type="button" class="mp-setting-item" id="mp-setting-version">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2 4 5v6c0 5 3.4 9.1 8 10 4.6-.9 8-5 8-10V5l-8-3Zm0 2.1 6 2.3V11c0 4-2.5 7.3-6 8.1-3.5-.8-6-4.1-6-8.1V6.4l6-2.3Z"/>
      <path d="M11 8h2v5h-2V8Zm0 6h2v2h-2v-2Z"/>
    </svg>
    <span>버전</span>
  </button>

  <!-- 임시 — 스토어 심사가 끝나면 이 버튼과 아래 #mp-about-modal 을 함께 지우세요. -->
  <button type="button" class="mp-setting-item" id="mp-setting-about">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Z"/>
      <path d="M11 10h2v7h-2v-7Zm0-3h2v2h-2V7Z"/>
    </svg>
    <span>소개</span>
  </button>

</div>

<!-- ───────────────────────────────────────────────────────────────
  임시 블록 — 스토어 심사가 끝나면 삭제하세요.
  설정 탭의 성격과는 맞지 않지만, 심사자가 앱의 목적을 바로 확인할 수 있도록
  한시적으로 둡니다. (TODO.md 의 «앱설정 화면 확장» 항목 참고)

  버전과 달리 네이티브 브릿지를 쓰지 않고 웹이 직접 띄웁니다 — 앱 변경이 필요 없습니다.

  바깥 div 로 감싼 이유: Python-Markdown 의 블록 요소 목록에 dialog 가 없어서
  인라인으로 취급하고, 여는 태그와 닫는 태그를 각각 문단으로 감싸버립니다.
  그러면 DOM 이 깨지고 IDE 도 script 범위를 잘못 잡습니다.
  블록으로 인식되는 div 안에 두면 내용이 그대로 통과합니다. 이 래퍼를 벗기지 마세요.
──────────────────────────────────────────────────────────────── -->
<div class="mp-modal-host">
<dialog class="mp-modal" id="mp-about-modal">

  <div class="mp-modal-head">
    <button type="button" class="mp-modal-close" data-mp-close aria-label="닫기">&times;</button>
  </div>

  <div class="mp-modal-body">

    <p>
      <strong>미쁨에듀</strong>는 <strong>반복 학습</strong>으로 익히는 교육 콘텐츠와 서비스를 만듭니다.
      외우고 싶은 문장을 귀로 되풀이해 듣고, 한 문제씩 확인하며 풀어보는 방식입니다.
    </p>

    <ul>
      <li><strong>듣기 트레이너</strong> — 문장을 원하는 횟수만큼 반복해서 읽어줍니다. 한국어와 영어를 구분해 각각 알맞은 목소리로 읽습니다.</li>
      <li><strong>퀴즈</strong> — 한 문제씩 답을 확인하며 풉니다. 맞춤법, 세계 수도, 영어 시제 문법 등을 제공합니다.</li>
      <li><strong>전자책</strong> — 『영어로 하는 미쁨 자기긍정확언』, 『미쁨1문1답 영문 전치사』를 구글 Play북에서 판매합니다. TTS 반복 청취를 전제로 만들었습니다.</li>
    </ul>

    <p>
      이 앱 <strong>미쁨에듀 온라인</strong>은 위 서비스를 모바일에서 쓰기 위한 앱입니다.
      웹(<code>md.mippum.com</code>)의 서비스를 그대로 제공하고, 음성 읽기처럼
      웹에서 하기 어려운 기능을 앱이 맡습니다.
    </p>

    <!-- TODO: 아래 값은 저장소에서 확인할 수 없어 비워둡니다. 심사 제출 전에 채우세요. -->
    <dl class="mp-about-meta">
      <dt>상호</dt><dd>미쁨에듀 (Mippum Edu Corporation)</dd>
      <dt>홈페이지</dt><dd><a href="https://mippum.com">mippum.com</a></dd>
    </dl>

  </div>
</dialog>
</div>
<!-- ── 임시 블록 끝 ──────────────────────────────────────────────── -->

<script>
  // 이 블록 안에는 빈 줄을 넣지 마세요.
  // 마크다운 처리기와 IDE 모두 빈 줄에서 raw HTML 블록을 끊습니다. 그러면 IDE 가
  // 주입하는 JS 조각이 })(); 없이 잘려 "} 누락" 같은 엉뚱한 오류를 냅니다.
  // 구분이 필요하면 빈 줄 대신 주석 줄을 쓰세요.
  (function () {
    var versionButton = document.getElementById('mp-setting-version');
    if (versionButton) {
      versionButton.addEventListener('click', function () {
        // 앱 버전과 EAS 업데이트 시각은 네이티브만 알고 있으므로 앱이 팝업으로 띄운다.
        // 듣기 트레이너의 재생 화면과 같은 방식이다 (브릿지 메시지 → 네이티브 모달).
        var sent = window.mpApp && window.mpApp.post('app-setting.version-open', {});
        if (!sent) {
          window.alert('앱에서만 확인할 수 있습니다.');
        }
      });
    }
    //
    // ── 임시 — 심사 종료 후 이 블록도 함께 지우세요 ──────────────────
    // 소개는 웹이 아는 내용뿐이라 브릿지를 타지 않고 여기서 직접 띄운다.
    var aboutButton = document.getElementById('mp-setting-about');
    var aboutModal = document.getElementById('mp-about-modal');
    if (aboutButton && aboutModal) {
      // showModal 이 없는 구형 웹뷰에서는 open 속성만 세운다.
      // CSS 가 dialog[open] 을 직접 배치하므로 어느 쪽이든 같은 모양으로 보인다.
      var openModal = function () {
        if (typeof aboutModal.showModal === 'function') aboutModal.showModal();
        else aboutModal.setAttribute('open', '');
      };
      var closeModal = function () {
        if (typeof aboutModal.close === 'function') aboutModal.close();
        else aboutModal.removeAttribute('open');
      };
      //
      aboutButton.addEventListener('click', openModal);
      aboutModal.querySelector('[data-mp-close]').addEventListener('click', closeModal);
      aboutModal.addEventListener('click', function (event) {
        // 배경(dialog 자신)을 누르면 닫는다. 내용 영역 클릭은 여기까지 오지 않는다.
        if (event.target === aboutModal) closeModal();
      });
    }
    // ── 임시 블록 끝 ──────────────────────────────────────────────
  })();
</script>
