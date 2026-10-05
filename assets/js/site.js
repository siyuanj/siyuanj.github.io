/* Small, event-driven enhancements; navigation and reading also work without JS. */
(function () {
  'use strict';
  var modes = ['auto', 'light', 'dark'];
  var options = Array.prototype.slice.call(document.querySelectorAll('[data-theme-option]'));
  function normalize(value) { return modes.indexOf(value) < 0 ? 'auto' : value; }
  // The pressed state is styled from html[data-theme], so it is correct before this deferred script runs.
  function apply(value) {
    var mode = normalize(value);
    if (mode === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', mode);
    options.forEach(function (option) {
      option.setAttribute('aria-pressed', option.dataset.themeOption === mode ? 'true' : 'false');
    });
    return mode;
  }
  if (options.length) {
    var saved = null;
    try { saved = localStorage.getItem('theme-preference'); } catch (error) { /* Storage is optional. */ }
    apply(saved);
    options.forEach(function (option) {
      option.addEventListener('click', function () {
        var mode = apply(option.dataset.themeOption);
        try { localStorage.setItem('theme-preference', mode); } catch (error) { /* Storage is optional. */ }
      });
    });
    window.addEventListener('storage', function (event) {
      if (event.key === 'theme-preference') apply(event.newValue);
    });
  }
  var tools = document.querySelector('.page-tools');
  var navigation = document.querySelector('.top-nav');
  if (tools && navigation && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      tools.classList.toggle('is-floating', !entries[0].isIntersecting);
    }).observe(navigation);
  }
  // Keep the reading position across translated posts. Both versions share the same
  // heading/figure sequence, so the position is stored as a fraction between landmarks.
  var article = document.querySelector('.post-content');
  // A paragraph that is entirely emphasis is a figure caption or note in these posts; mute it.
  if (article) {
    article.querySelectorAll('p').forEach(function (paragraph) {
      var only = paragraph.children.length === 1 ? paragraph.firstElementChild : null;
      if (only && only.tagName === 'EM' && paragraph.textContent.trim() === only.textContent.trim()) paragraph.classList.add('post-caption');
    });
  }
  var languageLink = document.querySelector('.lang-toggle');
  var positionKey = 'translation-position';
  function landmarkEdges() {
    var edges = [0, article.getBoundingClientRect().top + window.scrollY];
    article.querySelectorAll('h1, h2, h3, h4, h5, h6, img').forEach(function (element) {
      edges.push(element.getBoundingClientRect().top + window.scrollY);
    });
    edges.push(document.documentElement.scrollHeight);
    return edges;
  }
  function scrollRange() { return Math.max(1, document.documentElement.scrollHeight - window.innerHeight); }
  if (article && languageLink) {
    languageLink.addEventListener('click', function (event) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      var edges = landmarkEdges();
      var y = window.scrollY;
      var index = 0;
      while (index < edges.length - 2 && y >= edges[index + 1]) index++;
      var span = edges[index + 1] - edges[index];
      var position = {
        path: new URL(languageLink.href).pathname,
        count: edges.length,
        index: index,
        fraction: span > 0 ? Math.min(Math.max((y - edges[index]) / span, 0), 1) : 0,
        ratio: y / scrollRange()
      };
      try { sessionStorage.setItem(positionKey, JSON.stringify(position)); } catch (error) { /* Storage is optional. */ }
    });
  }
  var savedPosition = null;
  try {
    savedPosition = JSON.parse(sessionStorage.getItem(positionKey));
    sessionStorage.removeItem(positionKey);
  } catch (error) { /* Storage is optional. */ }
  if (article && savedPosition && savedPosition.path === location.pathname) {
    var restoredY = null;
    var restorePosition = function () {
      var edges = landmarkEdges();
      var i = savedPosition.index;
      var y = edges.length === savedPosition.count && i + 1 < edges.length
        ? edges[i] + savedPosition.fraction * (edges[i + 1] - edges[i])
        : savedPosition.ratio * scrollRange();
      window.scrollTo(0, Math.round(y));
      restoredY = window.scrollY;
    };
    restorePosition();
    // Images reserve their size, but re-align once after load unless the reader has moved.
    window.addEventListener('load', function () {
      if (window.scrollY === restoredY) restorePosition();
    }, { once: true });
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
