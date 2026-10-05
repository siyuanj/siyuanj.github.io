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
  document.querySelectorAll('[data-photo-carousel]').forEach(function (carousel) {
    var track = carousel.querySelector('.photo-gallery');
    var slides = Array.from(track.querySelectorAll('.recent-photo'));
    var dots = Array.from(carousel.querySelectorAll('.photo-dot'));
    var status = carousel.querySelector('.photo-status');
    var current = 0;
    if (!slides.length) return;
    function select(index) {
      current = index;
      dots.forEach(function (dot, position) {
        if (position === current) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
      status.textContent = 'Photo ' + (current + 1) + ' of ' + slides.length + ': ' + slides[current].querySelector('figcaption').textContent.trim();
    }
    function show(index) {
      index = (index + slides.length) % slides.length;
      select(index);
      track.scrollTo({ left: slides[index].offsetLeft, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
    carousel.querySelector('.photo-previous').addEventListener('click', function () { show(current - 1); });
    carousel.querySelector('.photo-next').addEventListener('click', function () { show(current + 1); });
    dots.forEach(function (dot, index) { dot.addEventListener('click', function () { show(index); }); });
    track.addEventListener('keydown', function (event) {
      if (event.target !== track) return;
      var keys = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: slides.length - 1 };
      if (!Object.prototype.hasOwnProperty.call(keys, event.key)) return;
      event.preventDefault();
      show(keys[event.key]);
    });
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) select(slides.indexOf(entry.target));
        });
      }, { root: track, threshold: 0.6 });
      slides.forEach(function (slide) { observer.observe(slide); });
    }
    select(0);
    carousel.querySelector('.photo-controls').hidden = slides.length < 2;
    carousel.querySelector('.photo-dots').hidden = slides.length < 2;
  });
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
