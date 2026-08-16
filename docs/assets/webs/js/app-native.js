/*
 * 네이티브 앱(WebView) 브릿지 공용 헬퍼.
 *
 * overrides/main.html 이 <head> 에서 동기 로드한다 — <body> 파싱 전에 <html> 클래스를
 * 확정해야 앱 전용 메뉴가 웹에서 보였다 사라지는 깜빡임이 없다.
 *
 * 웹 → 네이티브 메시지 규약은 mp-webapp 의
 * src/util/webview-message-handler/IWebviewMessage.tsx 에 정의돼 있다.
 * 형식: window.ReactNativeWebView.postMessage(JSON.stringify({type, message}))
 */
(function () {
  'use strict';

  /**
   * 앱설정 메뉴를 지원하는 최소 앱 버전.
   *
   * 1.0.3 이하 앱에는 'app-setting.version-open' 핸들러가 없어 눌러도 아무 일이 없다.
   * runtimeVersion.policy 가 appVersion 이라 1.0.3 사용자는 OTA 로도 핸들러를 받을 수 없고
   * 스토어 업데이트가 필요하다 — 그래서 버전으로 가른다.
   */
  var APP_SETTING_MIN_VERSION = [1, 0, 4];

  /** 네이티브 앱에서만 노출할 페이지 */
  var APP_ONLY_PATHS = ['/app-setting/'];

  /**
   * device 주입이 늦을 때를 위한 재확인 시점(ms).
   *
   * 앱은 injectedJavaScript 로 localStorage['device'] 를 심는데 그 스크립트는 페이지 로드
   * "후" 실행된다. localStorage 는 유지되므로 보통 두 번째 페이지부터는 이미 있지만,
   * 앱 최초 실행의 첫 페이지에서는 비어 있을 수 있다.
   */
  var RECHECK_DELAYS = [100, 300, 800, 1500, 3000];

  var root = document.documentElement;
  var isInApp = !!window.ReactNativeWebView;

  /**
   * 앱 버전을 [major, minor, patch] 로 읽는다. 알 수 없으면 null.
   *
   * 앱이 심는 IDeviceStored 의 'app-version' 은 PUSH_CODED_VERSION 형식이다 —
   * 'A1.0.4AJ' = 플랫폼(A/I) + 앱 버전 + 2글자 카운터.
   */
  function readAppVersion() {
    var raw;
    try {
      raw = window.localStorage.getItem('device');
    } catch (e) {
      return null; // 사생활 보호 모드 등에서 접근이 막힐 수 있다
    }
    if (!raw) return null;

    var device;
    try {
      device = JSON.parse(raw);
    } catch (e) {
      return null;
    }
    if (!device || typeof device['app-version'] !== 'string') return null;

    var matched = device['app-version'].match(/(\d+)\.(\d+)\.(\d+)/);
    if (!matched) return null;
    return [Number(matched[1]), Number(matched[2]), Number(matched[3])];
  }

  /** version >= minimum 인지 자리별로 비교한다. 문자열 비교는 '10' < '9' 가 되어 쓸 수 없다. */
  function isAtLeast(version, minimum) {
    if (!version) return false;
    for (var i = 0; i < minimum.length; i++) {
      if (version[i] > minimum[i]) return true;
      if (version[i] < minimum[i]) return false;
    }
    return true;
  }

  /**
   * <html> 에 상태 클래스를 붙인다.
   *   .mp-in-app      네이티브 앱 안 (버전 무관)
   *   .mp-app-setting 앱설정을 지원하는 앱 (1.0.4+)
   * @returns {boolean} 앱설정 지원 여부가 확정됐으면 true
   */
  function applyStateClasses() {
    if (!isInApp) return false;
    root.classList.add('mp-in-app');

    if (!isAtLeast(readAppVersion(), APP_SETTING_MIN_VERSION)) return false;
    root.classList.add('mp-app-setting');
    return true;
  }

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

  var isAppSettingReady = applyStateClasses();

  // device 주입이 늦은 경우를 대비해 잠시 동안 다시 확인한다.
  if (isInApp && !isAppSettingReady) {
    for (var i = 0; i < RECHECK_DELAYS.length; i++) {
      window.setTimeout(function () {
        if (root.classList.contains('mp-app-setting')) return;
        applyStateClasses();
      }, RECHECK_DELAYS[i]);
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

    /** 앱 버전 [major, minor, patch]. 앱이 아니거나 아직 모르면 null */
    appVersion: function () {
      return readAppVersion();
    },

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
