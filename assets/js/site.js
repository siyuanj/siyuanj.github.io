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
    if (!slides.length || typeof window.Splide !== 'function') return;
    function select(index) {
      current = index;
      carousel.querySelectorAll('.recent-photo').forEach(function (slide) {
        var activeOriginal = Number(slide.dataset.photoIndex) === current && !slide.classList.contains('splide__slide--clone');
        slide.querySelector('a').tabIndex = activeOriginal ? 0 : -1;
      });
      dots.forEach(function (dot, position) {
        if (position === current) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
      status.textContent = slides[current].getAttribute('aria-label');
    }
    // Follow Splide's existing autoWidth photo example (splide02).
    var slider = new window.Splide(carousel, {
      type: slides.length > 1 ? 'loop' : 'slide',
      autoWidth: true,
      focus: 'center',
      trimSpace: false,
      gap: 8,
      drag: 'free',
      snap: true,
      perMove: 1,
      speed: 380,
      arrows: false,
      pagination: false,
      keyboard: false,
      live: false,
      focusableNodes: '',
      reducedMotion: { speed: 0 }
    });
    slider.on('mounted moved scrolled', function () { select(slider.index); });
    slider.mount();
    function show(index) {
      index = (index + slides.length) % slides.length;
      slider.go(index);
    }
    carousel.querySelector('.photo-previous').addEventListener('click', function () { slider.go('<'); });
    carousel.querySelector('.photo-next').addEventListener('click', function () { slider.go('>'); });
    dots.forEach(function (dot, index) { dot.addEventListener('click', function () { show(index); }); });
    track.addEventListener('keydown', function (event) {
      if (event.target !== track) return;
      var keys = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: slides.length - 1 };
      if (!Object.prototype.hasOwnProperty.call(keys, event.key)) return;
      event.preventDefault();
      show(keys[event.key]);
    });
    track.addEventListener('click', function (event) {
      var slide = event.target.closest('.recent-photo');
      if (slide && Number(slide.dataset.photoIndex) !== current) {
        event.preventDefault();
        show(Number(slide.dataset.photoIndex));
      }
    });
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
