/* Recent Photos easter egg. Hold still on a photo to charge; releasing a full charge spins the strip
   and shows a flickering pixel "YOU FOUND THE EGG" screen with a doge, then returns to the photos.
   Ordinary clicks, drags and flings are untouched: moving the pointer turns a press into a drag. */
(function () {
  'use strict';
  var HOLD_MS = 500;     // a still press longer than this starts charging
  var CHARGE_MS = 1200;  // time from first charge to full
  var MOVE_LIMIT = 8;    // pointer travel (px) that turns a press into an ordinary drag
  var SHOW_MS = 4400;    // how long the egg screen stays, including its dissolve
  var LEAVE_MS = 700;

  // 5x7 pixel font, rows top to bottom.
  var FONT = {};
  ('A.###.|#...#|#...#|#####|#...#|#...#|#...# B####.|#...#|#...#|####.|#...#|#...#|####. ' +
   'C.###.|#...#|#....|#....|#....|#...#|.###. D####.|#...#|#...#|#...#|#...#|#...#|####. ' +
   'E#####|#....|#....|####.|#....|#....|##### F#####|#....|#....|####.|#....|#....|#.... ' +
   'G.###.|#...#|#....|#.###|#...#|#...#|.#### H#...#|#...#|#...#|#####|#...#|#...#|#...# ' +
   'I.###.|..#..|..#..|..#..|..#..|..#..|.###. J..###|...#.|...#.|...#.|...#.|#..#.|.##.. ' +
   'K#...#|#..#.|#.#..|##...|#.#..|#..#.|#...# L#....|#....|#....|#....|#....|#....|##### ' +
   'M#...#|##.##|#.#.#|#.#.#|#...#|#...#|#...# N#...#|#...#|##..#|#.#.#|#..##|#...#|#...# ' +
   'O.###.|#...#|#...#|#...#|#...#|#...#|.###. P####.|#...#|#...#|####.|#....|#....|#.... ' +
   'Q.###.|#...#|#...#|#...#|#.#.#|#..#.|.##.# R####.|#...#|#...#|####.|#.#..|#..#.|#...# ' +
   'S.####|#....|#....|.###.|....#|....#|####. T#####|..#..|..#..|..#..|..#..|..#..|..#.. ' +
   'U#...#|#...#|#...#|#...#|#...#|#...#|.###. V#...#|#...#|#...#|#...#|#...#|.#.#.|..#.. ' +
   'W#...#|#...#|#...#|#.#.#|#.#.#|#.#.#|.#.#. X#...#|#...#|.#.#.|..#..|.#.#.|#...#|#...# ' +
   'Y#...#|#...#|.#.#.|..#..|..#..|..#..|..#.. Z#####|....#|...#.|..#..|.#...|#....|##### ' +
   '0.###.|#...#|#..##|#.#.#|##..#|#...#|.###. 1..#..|.##..|..#..|..#..|..#..|..#..|.###. ' +
   '!..#..|..#..|..#..|..#..|..#..|.....|..#..').split(' ').forEach(function (entry) {
    FONT[entry.charAt(0)] = entry.slice(1).split('|');
  });
  var NOISE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01';

  // 16x15 pixel doge: o outline, f fur, c cream, w eye white, e pupil, n nose, m mouth.
  var DOGE = [
    '...o........o...', '..oco......oco..', '..ocfo....ofco..', '.offffooooffffo.',
    '.offffffffffffo.', 'offcffffffffcffo', 'offffffffffffffo', 'offwefffffwefffo',
    'ofcccffffffcccfo', 'occcccnnnnccccco', 'occccccnncccccco', 'occccmccccmcccco',
    '.occccmmmmcccco.', '..occcccccccco..', '...oooooooooo...'
  ];
  var DOGE_COLORS = { o: '#4a2e14', f: '#d99a3e', c: '#f6e2b3', w: '#ffffff', e: '#141414', n: '#141414', m: '#6b3f1d' };
  var WORDS = ['WOW', 'SUCH EGG', 'VERY SPIN', 'MUCH FAST', 'SO PIXEL', 'AMAZE'];
  var LINES = ['YOU FOUND', 'THE EGG!'];

  function calmMotion() { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function darkTheme() {
    var theme = document.documentElement.getAttribute('data-theme');
    if (theme) return theme === 'dark';
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  // Cheap deterministic noise so flicker changes per time bucket rather than per frame.
  function noise(a, b, c) {
    var h = Math.imul(a | 0, 374761393) ^ Math.imul(b | 0, 668265263) ^ Math.imul(c | 0, 2147483647);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }

  window.attachPhotoEgg = function (options) {
    var carousel = options.carousel;
    var gallery = options.gallery;
    var slider = options.slider;
    var count = options.count;
    var press = null;
    var busy = false;
    var swallowClick = false;
    var spin = null;

    var ring = document.createElement('span');
    ring.className = 'photo-charge';
    ring.setAttribute('aria-hidden', 'true');
    carousel.appendChild(ring);

    function setBusy(value) {
      busy = value;
      carousel.classList.toggle('is-egg-busy', value);
      if (options.onBusy) options.onBusy(value);
    }

    function stopPress() {
      if (!press) return;
      window.clearTimeout(press.timer);
      window.cancelAnimationFrame(press.frame);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', stopPress);
      carousel.classList.remove('is-charging', 'is-charged');
      gallery.style.transform = '';
      press = null;
    }
    function charge(now) {
      var level = Math.min(1, (now - press.since) / CHARGE_MS);
      press.level = level;
      ring.style.setProperty('--charge', level.toFixed(3));
      carousel.classList.toggle('is-charged', level >= 1);
      if (!press.calm) {
        var shake = 3 * level;
        gallery.style.transform = 'translate(' + ((Math.random() * 2 - 1) * shake).toFixed(1) + 'px,' +
          ((Math.random() * 2 - 1) * shake * 0.5).toFixed(1) + 'px)';
      }
      press.frame = window.requestAnimationFrame(charge);
    }
    function onMove(event) {
      if (event.pointerId === press.id && Math.hypot(event.clientX - press.x, event.clientY - press.y) > MOVE_LIMIT) stopPress();
    }
    function onUp(event) {
      if (event.pointerId !== press.id) return;
      var full = press.level >= 1;
      stopPress();
      if (!full) return;
      swallowClick = true;
      window.setTimeout(function () { swallowClick = false; }, 500);
      launch();
    }

    gallery.addEventListener('pointerdown', function (event) {
      if (busy || press || !event.isPrimary || event.button !== 0) return;
      var box = carousel.getBoundingClientRect();
      press = { id: event.pointerId, x: event.clientX, y: event.clientY, level: 0, since: 0, frame: 0, calm: calmMotion() };
      ring.style.left = (event.clientX - box.left) + 'px';
      ring.style.top = (event.clientY - box.top) + 'px';
      ring.style.setProperty('--charge', '0');
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', stopPress);
      press.timer = window.setTimeout(function () {
        press.since = performance.now();
        carousel.classList.add('is-charging');
        press.frame = window.requestAnimationFrame(charge);
      }, HOLD_MS);
    });
    // The release that ends a full charge must not open or center a photo.
    carousel.addEventListener('click', function (event) {
      if (!swallowClick && !busy) return;
      event.preventDefault();
      event.stopPropagation();
      swallowClick = false;
    }, true);
    carousel.addEventListener('contextmenu', function (event) { if (press || busy) event.preventDefault(); });
    slider.on('moved', function () { if (spin) spin(); });

    function launch() {
      setBusy(true);
      if (calmMotion() || count < 2) { showEgg(); return; }
      var speed = slider.options.speed;
      var steps = count * 4 - (slider.index % count);  // several laps, ending on the first photo
      var step = 0;
      var watchdog = 0;
      spin = function () {
        window.clearTimeout(watchdog);
        if (step >= steps) {
          spin = null;
          slider.options.speed = speed;
          carousel.classList.remove('is-egg-spinning');
          showEgg();
          return;
        }
        var t = steps > 1 ? step / (steps - 1) : 1;
        var stepSpeed = Math.round(45 + 360 * Math.pow(t, 2.4));  // fast first, easing out
        slider.options.speed = stepSpeed;
        carousel.classList.toggle('is-egg-spinning', t < 0.75);
        step += 1;
        var expected = step;
        // Splide emits "moved" after each transition; continue anyway if one never arrives.
        watchdog = window.setTimeout(function () { if (spin && step === expected) spin(); }, stepSpeed + 400);
        slider.go('>');
      };
      spin();
    }

    function showEgg() {
      var calm = calmMotion();
      var dark = darkTheme();
      var width = gallery.offsetWidth;
      var height = gallery.offsetHeight;
      var ratio = Math.min(window.devicePixelRatio || 1, 2);
      var canvas = document.createElement('canvas');
      canvas.className = 'photo-egg';
      canvas.setAttribute('aria-hidden', 'true');
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      carousel.appendChild(canvas);
      if (options.announce) options.announce('You found the egg! Such wow.');
      var ctx = canvas.getContext('2d');

      // Layout in cells: doge (16x15) beside two text lines (53 x 17) in a 79 x 21 framed panel, centered,
      // leaving bands above and below for the floating words.
      var cell = Math.max(3, Math.floor(Math.min(width / 100, height / 30)));
      var unit = cell * ratio;
      var cols = Math.floor(width / cell);
      var rows = Math.floor(height / cell);
      var bx = Math.floor((cols - 73) / 2);
      var by = Math.floor((rows - 17) / 2);
      var bg = dark ? '#06070c' : '#f6f7fb';
      var tone = dark ? 62 : 42;
      var drops = [];
      for (var c = 0; c < cols; c++) {
        drops.push({ offset: Math.random() * rows * 2, speed: 0.008 + Math.random() * 0.02, len: 4 + Math.floor(Math.random() * 9), hue: (c * 13) % 360 });
      }
      // Doge-speak words float in the free space above and below the panel.
      var words = [];
      var small = Math.max(1, Math.floor(cell / 2)) / cell;
      var wordHeight = 7 * small;
      var bands = [[0, by - 2], [by + 19, rows]].filter(function (band) { return band[1] - band[0] >= wordHeight + 1; });
      var first = Math.floor(Math.random() * WORDS.length);
      for (var w = 0; bands.length && w < 4; w++) {
        var text = WORDS[(first + w) % WORDS.length];
        var wordWidth = (text.length * 6 - 1) * small;
        var band = bands[w % bands.length];
        words.push({
          text: text, start: 500 + w * 700, x: 1 + Math.random() * Math.max(0, cols - wordWidth - 2),
          y: band[0] + (band[1] - band[0] - wordHeight) / 2, hue: (w * 90 + 30) % 360
        });
      }

      function hsl(h, s, l, a) { return 'hsla(' + Math.round(((h % 360) + 360) % 360) + ',' + s + '%,' + l + '%,' + a + ')'; }
      function rect(x, y, w, h, color) {
        ctx.fillStyle = color;
        ctx.fillRect(Math.round(x * unit), Math.round(y * unit), Math.ceil(w * unit), Math.ceil(h * unit));
      }
      function glyph(ch, x, y, scale, color) {
        var rowsOf = FONT[ch];
        if (!rowsOf) return;
        for (var r = 0; r < 7; r++) {
          for (var k = 0; k < 5; k++) if (rowsOf[r].charAt(k) === '#') rect(x + k * scale, y + r * scale, scale, scale, color);
        }
      }
      function doge(x, y, upTo, ghost) {
        for (var r = 0; r < Math.min(upTo, DOGE.length); r++) {
          for (var k = 0; k < 16; k++) {
            var key = DOGE[r].charAt(k);
            if (key !== '.') rect(x + k, y + r, 1, 1, ghost || DOGE_COLORS[key]);
          }
        }
      }

      function draw(t) {
        var tick = Math.floor(t / 80);
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Colourful pixel rain with flickering bits.
        for (var c = 0; c < cols; c++) {
          var d = drops[c];
          var head = calm ? d.offset % (rows + d.len) : (d.offset + t * d.speed) % (rows + d.len + 6);
          for (var i = 0; i < d.len; i++) {
            var y = Math.floor(head) - i;
            if (y < 0 || y >= rows || noise(c, y, tick) < 0.22) continue;
            var fade = 1 - i / d.len;
            rect(c, y, 1, 1, hsl(d.hue + t * 0.06 + y * 3, 90, i === 0 ? tone + 12 : tone, (dark ? 0.55 : 0.32) * fade));
          }
        }
        // Panel with a marching rainbow frame.
        rect(bx - 3, by - 2, 79, 21, dark ? 'rgba(6,7,12,0.88)' : 'rgba(246,247,251,0.9)');
        for (var p = 0; p < 79; p++) {
          rect(bx - 3 + p, by - 2, 1, 1, hsl(p * 9 - t * 0.3, 95, tone, 0.9));
          rect(bx - 3 + p, by + 18, 1, 1, hsl(p * 9 + t * 0.3, 95, tone, 0.9));
        }
        for (var q = 0; q < 21; q++) {
          rect(bx - 3, by - 2 + q, 1, 1, hsl(q * 9 + t * 0.3, 95, tone, 0.9));
          rect(bx + 75, by - 2 + q, 1, 1, hsl(q * 9 - t * 0.3, 95, tone, 0.9));
        }
        // Doge, revealed top-down, with an occasional RGB-split glitch.
        var dogeRows = calm ? 15 : Math.floor(Math.max(0, t - 120) / 30);
        var glitch = !calm && t > 600 && noise(7, Math.floor(t / 650), 1) < 0.55 && t % 650 < 70;
        if (glitch) {
          doge(bx - 1, by + 1, dogeRows, dark ? 'rgba(0,229,255,0.7)' : 'rgba(0,150,200,0.55)');
          doge(bx + 1, by + 1, dogeRows, dark ? 'rgba(255,0,170,0.7)' : 'rgba(220,0,120,0.5)');
        }
        doge(bx, by + 1, dogeRows);
        // Text decodes from random characters, then keeps a light flicker.
        var index = 0;
        for (var line = 0; line < LINES.length; line++) {
          for (var n = 0; n < LINES[line].length; n++) {
            var ch = LINES[line].charAt(n);
            var x = bx + 20 + n * 6;
            var yLine = by + line * 10;
            if (ch !== ' ') {
              var settled = calm || t > 260 + index * 55;
              var shown = settled ? ch : NOISE.charAt(Math.floor(noise(index, Math.floor(t / 50), 3) * NOISE.length));
              var hue = index * 26 + (calm ? 0 : t * 0.15);
              // Settled letters mostly flash bright; dropping out is rare so the words stay readable.
              var flicker = !calm && settled ? noise(index, Math.floor(t / 90), 5) : 1;
              if (flicker >= 0.012) {
                var face = flicker < 0.06 ? (dark ? '#ffffff' : '#10131c') : settled ? hsl(hue, 95, tone + (dark ? 4 : 0), 1) : hsl(hue, 60, tone, 0.6);
                glyph(shown, x + 1, yLine + 1, 1, dark ? hsl(hue, 90, 22, 1) : 'rgba(20,24,40,0.16)');
                glyph(shown, x, yLine, 1, face);
              }
              index += 1;
            }
          }
        }
        // Blinking block cursor after the last line.
        if (calm || Math.floor(t / 420) % 2 === 0) rect(bx + 20 + LINES[1].length * 6, by + 10, 5, 7, hsl(t * 0.2, 95, tone, 0.85));
        // Floating doge-speak.
        words.forEach(function (word) {
          var age = t - word.start;
          if (!calm && (age < 0 || age > 1100)) return;
          if (!calm && noise(word.start, Math.floor(t / 70), 9) < 0.2) return;
          for (var i = 0; i < word.text.length; i++) {
            glyph(word.text.charAt(i), word.x + i * 6 * small, word.y, small, hsl(word.hue + i * 20 + t * 0.1, 90, tone, 0.95));
          }
        });
        // Glitch slice: shift a horizontal band for a moment.
        if (!calm && t % 900 < 60) {
          var band = Math.floor(noise(Math.floor(t / 900), 2, 4) * canvas.height * 0.8);
          var bandHeight = Math.max(unit * 2, canvas.height * 0.08);
          ctx.drawImage(canvas, 0, band, canvas.width, bandHeight, Math.round((noise(band, 3, 3) * 6 - 3) * unit), band, canvas.width, bandHeight);
        }
        // Scanlines.
        ctx.fillStyle = dark ? 'rgba(0,0,0,0.28)' : 'rgba(255,255,255,0.35)';
        for (var s = 0; s < canvas.height; s += 3 * ratio) ctx.fillRect(0, s, canvas.width, Math.max(1, ratio));
        // Intro noise and outro dissolve.
        var density = !calm && t < 160 ? 1 - t / 160 : Math.max(0, (t - (SHOW_MS - LEAVE_MS)) / LEAVE_MS);
        if (density > 0) {
          for (var gy = 0; gy < rows; gy++) {
            for (var gx = 0; gx < cols; gx++) {
              if (noise(gx, gy, 11) < density) rect(gx, gy, 1, 1, t < 160 ? hsl(gx * 7 + gy * 11, 90, tone, 0.85) : bg);
            }
          }
        }
      }

      function finish() {
        canvas.remove();
        setBusy(false);
        if (options.onDone) options.onDone();
      }
      var started = performance.now();
      if (calm) {
        draw(SHOW_MS / 2);
        window.setTimeout(function () { canvas.classList.add('is-leaving'); }, SHOW_MS - 600);
        window.setTimeout(finish, SHOW_MS);
        return;
      }
      window.setTimeout(function () { canvas.classList.add('is-leaving'); }, SHOW_MS - 300);
      (function frame(now) {
        var t = now - started;
        if (t >= SHOW_MS) { finish(); return; }
        draw(t);
        window.requestAnimationFrame(frame);
      })(started);
    }
  };
})();
