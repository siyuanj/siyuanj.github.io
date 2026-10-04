/* Small, event-driven enhancements; navigation and reading also work without JS. */
(function () {
  'use strict';
  var modes = ['auto', 'light', 'dark'];
  var button = document.getElementById('theme-toggle');
  var mode = 'auto';
  function normalize(value) { return modes.indexOf(value) < 0 ? 'auto' : value; }
  function apply(value) {
    mode = normalize(value);
    if (mode === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', mode);
    if (button) {
      var label = mode[0].toUpperCase() + mode.slice(1);
      button.textContent = label;
      button.dataset.mode = mode;
      button.setAttribute('aria-label', 'Theme mode: ' + label);
      button.title = 'Theme: ' + label + ' (click to switch)';
    }
  }
  if (button) {
    try { mode = normalize(localStorage.getItem('theme-preference')); } catch (error) { /* Storage is optional. */ }
    apply(mode);
    button.addEventListener('click', function () {
      apply(modes[(modes.indexOf(mode) + 1) % modes.length]);
      try { localStorage.setItem('theme-preference', mode); } catch (error) { /* Storage is optional. */ }
    });
    window.addEventListener('storage', function (event) {
      if (event.key === 'theme-preference') apply(event.newValue);
    });
  }
  var connection = navigator.connection;
  var prefetched = new Set();
  if (!connection || (!connection.saveData && !/2g/.test(connection.effectiveType || ''))) {
    document.querySelectorAll('.top-nav a:not([aria-current])').forEach(function (link) {
      function prefetch() {
        if (prefetched.has(link.href)) return;
        prefetched.add(link.href);
        var hint = document.createElement('link');
        hint.rel = 'prefetch';
        hint.href = link.href;
        document.head.appendChild(hint);
      }
      link.addEventListener('pointerenter', prefetch, { once: true });
      link.addEventListener('focus', prefetch, { once: true });
    });
  }
  var map = document.querySelector('.visitor-map-widget iframe[data-src]');
  if (map) {
    function initializeMap() { map.src = map.dataset.src; }
    function scheduleMap() {
      if ('requestIdleCallback' in window) window.requestIdleCallback(initializeMap, { timeout: 1500 });
      else window.setTimeout(initializeMap, 100);
    }
    if (document.readyState === 'complete') scheduleMap();
    else window.addEventListener('load', scheduleMap, { once: true });
  }
})();
