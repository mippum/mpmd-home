---
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

</div>

<script>
  (function () {
    var button = document.getElementById('mp-setting-version');
    if (!button) return;

    button.addEventListener('click', function () {
      // 앱 버전과 EAS 업데이트 시각은 네이티브만 알고 있으므로 앱이 팝업으로 띄운다.
      // 듣기 트레이너의 재생 화면과 같은 방식이다 (브릿지 메시지 → 네이티브 모달).
      var sent = window.mpApp && window.mpApp.post('app-setting.version-open', {});
      if (!sent) {
        window.alert('앱에서만 확인할 수 있습니다.');
      }
    });
  })();
</script>
