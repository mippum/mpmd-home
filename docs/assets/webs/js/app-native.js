/*
 * 네이티브 앱(WebView) 브릿지 공용 헬퍼.
 *
 * 웹 → 네이티브 메시지 규약은 mp-webapp 의
 * src/util/webview-message-handler/IWebviewMessage.tsx 에 정의돼 있다.
 * 형식: window.ReactNativeWebView.postMessage(JSON.stringify({type, message}))
 */
(function () {
  'use strict';

  var isInApp = !!window.ReactNativeWebView;

  // overrides/main.html 이 이미 붙였지만, 테마 오버라이드가 빠진 경우를 대비해 한 번 더 보장한다.
  if (isInApp) {
    document.documentElement.classList.add('mp-in-app');
  }

  /** 네이티브 앱에서만 노출할 페이지들 */
  var APP_ONLY_PATHS = ['/app-setting/'];

  /**
   * 앱 전용 링크에 .mp-app-only 를 붙인다.
   *
   * CSS 의 :has() 규칙이 깜빡임 없이 먼저 처리하지만, 두 가지를 여기서 보완한다.
   *   1. :has() 미지원 구형 브라우저
   *   2. 현재 페이지의 활성 nav 링크 — Material 이 href="./" 로 렌더해서
   *      [href*="app-setting"] 속성 선택자에 걸리지 않는다
   * a.href 는 브라우저가 절대경로로 해석해주므로 상대 href 도 그대로 잡힌다.
   */
  function tagAppOnlyLinks() {
    var links = document.querySelectorAll('.md-nav__link, .md-footer__link');
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var path;
      try {
        path = new URL(link.href).pathname;
      } catch (e) {
        continue;
      }
      if (APP_ONLY_PATHS.indexOf(path) === -1) continue;

      var target = link.closest('.md-nav__item') || link;
      target.classList.add('mp-app-only');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tagAppOnlyLinks);
  } else {
    tagAppOnlyLinks();
  }

  window.mpApp = {
    /** 네이티브 앱의 WebView 안에서 열렸는지 여부 */
    isInApp: isInApp,

    /**
     * 네이티브로 메시지를 보낸다.
     * @returns {boolean} 앱이 아니어서 보내지 못했으면 false
     */
    post: function (type, message) {
      if (!window.ReactNativeWebView) return false;
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: type,
        message: message || {}
      }));
      return true;
    }
  };
})();
