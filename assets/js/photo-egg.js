/* Recent Photos easter egg. Hold still on a photo to charge; releasing a full charge spins the strip
   and opens a flickering pixel "YOU FOUND THE EGG" screen with a doge over a background that scrolls sideways. It stays
   until clicked (or Escape), then dissolves back to the photos. Ordinary clicks, drags and flings are
   untouched: moving the pointer turns a press into a drag. */
(function () {
  'use strict';
  var HOLD_MS = 500;     // a still press longer than this starts charging
  var CHARGE_MS = 1200;  // time from first charge to full
  var MOVE_LIMIT = 8;    // pointer travel (px) that turns a press into an ordinary drag
  var LEAVE_MS = 650;    // dissolve back to the photos
  var EMERGE_MS = 1600;  // the spinning photos dissolve into scrolling pixels over this time
  var CONTENT_MS = 1150; // then the panel, doge and text fade in

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

  // 22x20 pixel doge after the WeChat [Doge] sticker: o outline, f fur, y highlight, p inner ear, c cream,
  // l eyelid, w eye white, e pupil (a smug glance to the right), n nose, m mouth.
  var DOGE = [
    '....oo..........oo....', '...offo........offo...', '..offpfo......ofpffo..', '..ofpppfoooooofpppfo..',
    '.offpppffffffffpppffo.', '.offfffyyyyyyyyfffffo.', 'offffffyyyyyyyyffffffo', 'offffffffffffffffffffo',
    'offffffffffffffffffffo', 'offllllffffffffllllffo', 'offwweeffffffffwweeffo', 'ofcccccffffffffcccccfo',
    'occcccccffffffccccccco', 'occccccccnnnncccccccco', 'occcccccccnnccccccccco', '.occcccccccmccccmccco.',
    '.occccccmmmmmmmmcccco.', '..occcccccccccccccco..', '...occcccccccccccco...', '....oooooooooooooo....'
  ];
  var DOGE_COLORS = { o: '#a2581b', f: '#f5a623', y: '#ffc94a', p: '#ffd98a', c: '#fff3dc', l: '#5b3413', w: '#ffffff', e: '#2e1a0b', n: '#2e1a0b', m: '#9a5520' };
  var WORDS = ['WOW', 'SUCH EGG', 'VERY SPIN', 'MUCH FAST', 'SO PIXEL', 'AMAZE', 'VERY HACK', 'MANY BITS'];
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
    var egg = null;  // the open egg screen

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
      // Judge the charge by elapsed time, not the last drawn frame, so slow frames cannot lose a full charge.
      var full = press.since > 0 && performance.now() - press.since >= CHARGE_MS;
      stopPress();
      if (!full) return;
      swallowClick = true;
      window.setTimeout(function () { swallowClick = false; }, 500);
      launch(event.pointerType);
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
    // The release that ends a full charge must not open or center a photo; while the egg runs, a click
    // on its screen closes it and every other click is ignored.
    carousel.addEventListener('click', function (event) {
      if (swallowClick) {
        event.preventDefault();
        event.stopPropagation();
        swallowClick = false;
        return;
      }
      if (!busy) return;
      event.preventDefault();
      event.stopPropagation();
      if (egg && event.target === egg.canvas) egg.close();
    }, true);
    carousel.addEventListener('contextmenu', function (event) { if (press || busy) event.preventDefault(); });
    slider.on('moved', function () { if (spin) spin(); });

    function launch(pointerType) {
      setBusy(true);
      if (calmMotion() || count < 2) { showEgg(pointerType); return; }
      var speed = slider.options.speed;
      var laps = Math.max(2, Math.ceil(10 / count));
      var steps = count * laps - (slider.index % count);  // about ten slides, ending on the first photo
      var emergeAt = Math.floor(steps * 0.55);           // the egg grows out of the strip while it slows down
      var emerged = false;
      var step = 0;
      var watchdog = 0;
      spin = function () {
        window.clearTimeout(watchdog);
        if (step >= steps) {
          spin = null;
          slider.options.speed = speed;
          carousel.classList.remove('is-egg-spinning');
          if (!emerged) showEgg(pointerType);
          return;
        }
        if (step === emergeAt && !emerged) {
          emerged = true;
          showEgg(pointerType);
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

    function showEgg(pointerType) {
      var calm = calmMotion();
      var width = gallery.offsetWidth;
      var height = gallery.offsetHeight;
      var ratio = Math.min(window.devicePixelRatio || 1, 2);
      var hint = pointerType === 'touch' ? 'TAP TO RETURN' : 'CLICK TO RETURN';
      var canvas = document.createElement('canvas');
      canvas.className = 'photo-egg';
      canvas.tabIndex = 0;
      canvas.setAttribute('role', 'button');
      canvas.setAttribute('aria-label', 'You found the egg! Activate to return to the photos.');
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      carousel.appendChild(canvas);
      carousel.classList.add('is-egg-emerging');
      var ctx = canvas.getContext('2d');
      if (options.announce) options.announce('You found the egg! Such wow.');

      // Layout in cells: the doge beside two text lines inside a framed panel, centred, with a band above
      // for floating doge-speak and one below for the hint.
      var dogeWidth = DOGE[0].length;
      var dogeHeight = DOGE.length;
      var panelWidth = dogeWidth + 4 + 53 + 6;
      var panelHeight = Math.max(dogeHeight, 17) + 4;
      var cell = Math.max(3, Math.floor(Math.min(width / (panelWidth + 14), height / (panelHeight + 12))));
      var unit = cell * ratio;
      var cols = Math.ceil(width / cell);
      var rows = Math.ceil(height / cell);
      var px = Math.floor((cols - panelWidth) / 2);
      var py = Math.floor((rows - panelHeight) / 2);
      var dogeX = px + 3;
      var dogeY = py + 2;
      var textX = dogeX + dogeWidth + 4;
      var textY = py + 2 + Math.floor((dogeHeight - 17) / 2);
      var small = Math.max(1, Math.floor(cell / 2)) / cell;
      var wordHeight = 7 * small;
      var topBand = [0, py];
      var bottomBand = [py + panelHeight, rows];
      // Two horizontal pixel streams per row, racing left; speeds in cells per millisecond.
      var streams = [];
      for (var sy = 0; sy < rows; sy++) {
        for (var k = 0; k < 2; k++) {
          streams.push({ y: sy, offset: Math.random() * cols * 3, speed: 0.025 + Math.random() * 0.035, len: 6 + Math.floor(Math.random() * 12), hue: (sy * 23 + k * 140) % 360 });
        }
      }

      function hsl(h, s, l, a) { return 'hsla(' + Math.round(((h % 360) + 360) % 360) + ',' + s + '%,' + l + '%,' + a + ')'; }
      // The full-screen mosaic is thousands of cells per frame, so its colours come from a small cache.
      var mosaicColors = {};
      function mosaicColor(hue, light, alpha) {
        var key = (Math.round(((hue % 360) + 360) % 360 / 8) * 8) + '|' + Math.round(light) + '|' + alpha;
        return mosaicColors[key] || (mosaicColors[key] = hsl(Math.round(((hue % 360) + 360) % 360 / 8) * 8, 70, Math.round(light), alpha));
      }
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
      function text(str, x, y, scale, colorAt) {
        for (var i = 0; i < str.length; i++) if (str.charAt(i) !== ' ') glyph(str.charAt(i), x + i * 6 * scale, y, scale, colorAt(i));
      }
      function doge(x, y, upTo, ghost) {
        for (var r = 0; r < Math.min(upTo, dogeHeight); r++) {
          for (var k = 0; k < dogeWidth; k++) {
            var key = DOGE[r].charAt(k);
            if (key !== '.') rect(x + k, y + r, 1, 1, ghost || DOGE_COLORS[key]);
          }
        }
      }

      function draw(t, leaving) {
        // Read the theme every frame so switching light/dark while the egg is open repaints it.
        var dark = darkTheme();
        var bg = dark ? '#06070c' : '#f6f7fb';
        var tone = dark ? 62 : 42;
        var pace = calm ? 0.3 : 1;          // reduced motion keeps a slow scroll, without flashing
        var tick = Math.floor(t / 80);
        // Emerging: pixels appear at random on the moving sheet until they cover the photos underneath.
        var grow = Math.min(1, t / (calm ? 900 : EMERGE_MS));
        grow = grow * grow * (3 - 2 * grow);
        var rt = t - (calm ? 600 : CONTENT_MS);  // clock for the panel, doge and text
        if (grow < 1) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
          ctx.fillStyle = bg;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        // Distance travelled: the normal scroll plus a burst that starts at the spinning strip's speed and
        // decays, so the photos' motion carries straight into the pixels.
        function travel(base, burst) { return t * base * pace + (calm ? 0 : burst * 600 * (1 - Math.exp(-t / 600))); }
        // The whole background scrolls left in three layers. Positions are fractional, so the pixel blocks
        // glide smoothly instead of jumping a whole cell at a time.
        // 1. A full mosaic of colour moving as one sheet.
        var sheet = travel(0.006, 0.05);
        var sheetCol = Math.floor(sheet);
        var sheetFrac = sheet - sheetCol;
        for (var y = 0; y < rows; y++) {
          for (var x = 0; x <= cols; x++) {
            var u = x + sheetCol;
            var shade = noise(u, y, 21);
            if (grow < 1 && noise(u, y, 41) >= grow * 1.08) continue;
            rect(x - sheetFrac, y, 1, 1, mosaicColor(u * 4 + y * 6 + t * 0.01 * pace, dark ? 9 + shade * 16 : 92 - shade * 14, 1));
          }
        }
        // 2. Brighter sparse pixels moving faster, for depth.
        var sparks = travel(0.016, 0.07);
        var sparkCol = Math.floor(sparks);
        var sparkFrac = sparks - sparkCol;
        for (var y2 = 0; y2 < rows; y2++) {
          for (var x2 = 0; x2 <= cols; x2++) {
            if (noise(x2 + sparkCol, y2, 22) < 0.05) rect(x2 - sparkFrac, y2, 1, 1, hsl((x2 + sparkCol) * 9 + y2 * 5, 90, tone + 6, (dark ? 0.75 : 0.5) * grow));
          }
        }
        // 3. Streams racing left with a bright head and a fading trail behind it.
        streams.forEach(function (d) {
          var head = cols + 2 - ((d.offset + travel(d.speed, 0.06)) % (cols + d.len + 10));
          for (var i = 0; i < d.len; i++) {
            var x = head + i;
            if (x < -1 || x > cols || (!calm && noise(Math.floor(x), d.y, tick) < 0.18)) continue;
            var fade = 1 - i / d.len;
            rect(x, d.y, 1, 1, hsl(d.hue + x * 3 + t * 0.05 * pace, 95, i === 0 ? tone + 16 : tone + 4, (dark ? 0.85 : 0.6) * fade * grow));
          }
        });
        if (rt >= 0) {
          // Translucent panel fading in over the moving background, framed by a marching rainbow.
          var show = Math.min(1, rt / 350);
          rect(px, py, panelWidth, panelHeight, dark ? 'rgba(6,7,12,' + (0.74 * show) + ')' : 'rgba(246,247,251,' + (0.76 * show) + ')');
          var march = t * 0.3 * pace;
          for (var e = 0; e < panelWidth; e++) {
            rect(px + e, py, 1, 1, hsl(e * 9 - march, 95, tone, 0.95 * show));
            rect(px + e, py + panelHeight - 1, 1, 1, hsl(e * 9 + march, 95, tone, 0.95 * show));
          }
          for (var q = 1; q < panelHeight - 1; q++) {
            rect(px, py + q, 1, 1, hsl(q * 9 + march, 95, tone, 0.95 * show));
            rect(px + panelWidth - 1, py + q, 1, 1, hsl(q * 9 - march, 95, tone, 0.95 * show));
          }
          // Doge, revealed top-down, with an occasional RGB-split glitch.
          var dogeRows = calm ? dogeHeight : Math.floor(Math.max(0, rt - 60) / 28);
          if (!calm && rt > 800 && t % 1300 < 70) {
            doge(dogeX - 1, dogeY, dogeRows, dark ? 'rgba(0,229,255,0.7)' : 'rgba(0,150,200,0.5)');
            doge(dogeX + 1, dogeY, dogeRows, dark ? 'rgba(255,0,170,0.7)' : 'rgba(220,0,120,0.45)');
          }
          doge(dogeX, dogeY, dogeRows);
          // Text decodes from random characters, then keeps a light flicker with cycling rainbow hues.
          var index = 0;
          LINES.forEach(function (line, lineNumber) {
            for (var n = 0; n < line.length; n++) {
              var ch = line.charAt(n);
              if (ch === ' ') continue;
              var x = textX + n * 6;
              var y = textY + lineNumber * 10;
              var settled = calm || rt > 200 + index * 55;
              var shown = settled ? ch : NOISE.charAt(Math.floor(noise(index, Math.floor(t / 50), 3) * NOISE.length));
              var hue = index * 26 + t * 0.15 * pace;
              var flicker = !calm && settled ? noise(index, Math.floor(t / 90), 5) : 1;
              if (flicker >= 0.004) {  // a rare drop-out; most flicker is a bright flash
                glyph(shown, x + 1, y + 1, 1, dark ? hsl(hue, 90, 22, show) : 'rgba(20,24,40,' + (0.16 * show) + ')');
                glyph(shown, x, y, 1, flicker < 0.06 ? (dark ? '#ffffff' : '#10131c') : settled ? hsl(hue, 95, tone + (dark ? 4 : 0), show) : hsl(hue, 60, tone, 0.6 * show));
              }
              index += 1;
            }
          });
          if (calm || Math.floor(t / 420) % 2 === 0) rect(textX + LINES[1].length * 6, textY + 10, 5, 7, hsl(t * 0.2 * pace, 95, tone, 0.85 * show));
          // Doge-speak keeps popping up in the top band: two slots, each showing a new word every cycle.
          if (rt > 400 && topBand[1] - topBand[0] >= wordHeight + 1) {
            for (var slot = 0; slot < 2; slot++) {
              var cycle = Math.floor((rt + slot * 1300) / 2600);
              if ((rt + slot * 1300) % 2600 > 1800 || (!calm && noise(slot, Math.floor(t / 70), 9) < 0.15)) continue;
              var word = WORDS[Math.floor(noise(cycle, slot, 31) * WORDS.length)];
              var wordWidth = (word.length * 6 - 1) * small;
              var half = cols / 2;
              var wx = slot * half + 1 + noise(cycle, slot, 37) * Math.max(0, half - wordWidth - 2);
              var wy = topBand[0] + (topBand[1] - topBand[0] - wordHeight) / 2;
              text(word, wx, wy, small, function (i) { return hsl(cycle * 70 + slot * 150 + i * 22, 90, tone, 0.95); });
            }
          }
          // How to get back, once the text has settled.
          if (rt > 1200 && bottomBand[1] - bottomBand[0] >= wordHeight + 1 && (calm || t % 1400 < 1050)) {
            var hintWidth = (hint.length * 6 - 1) * small;
            text(hint, (cols - hintWidth) / 2, bottomBand[0] + (bottomBand[1] - bottomBand[0] - wordHeight) / 2, small,
              function (i) { return hsl(i * 18 + t * 0.1 * pace, 70, dark ? 72 : 36, 0.9); });
          }
          // Glitch slice: shift a horizontal band for a moment.
          if (!calm && rt > 800 && t % 900 < 60) {
            var band = Math.floor(noise(Math.floor(t / 900), 2, 4) * canvas.height * 0.8);
            var bandHeight = Math.max(unit * 2, canvas.height * 0.08);
            ctx.drawImage(canvas, 0, band, canvas.width, bandHeight, Math.round((noise(band, 3, 3) * 6 - 3) * unit), band, canvas.width, bandHeight);
          }
        }
        // Scanlines.
        ctx.fillStyle = dark ? 'rgba(0,0,0,' + (0.26 * grow) + ')' : 'rgba(255,255,255,' + (0.32 * grow) + ')';
        for (var s = 0; s < canvas.height; s += 3 * ratio) ctx.fillRect(0, s, canvas.width, Math.max(1, ratio));
        // Dissolve when leaving.
        var density = leaving != null ? Math.min(1, leaving / LEAVE_MS) : 0;
        if (density > 0) {
          for (var gy = 0; gy < rows; gy++) {
            for (var gx = 0; gx < cols; gx++) {
              if (noise(gx, gy, 11) < density) rect(gx, gy, 1, 1, bg);
            }
          }
        }
      }

      var started = performance.now();
      var closingAt = null;
      var frame = 0;
      var onScreen = true;
      function loop(now) {
        frame = 0;
        var t = now - started;
        var leaving = closingAt == null ? null : now - closingAt;
        if (leaving != null && leaving >= LEAVE_MS) { finish(); return; }
        draw(t, leaving);
        if (onScreen || leaving != null) frame = window.requestAnimationFrame(loop);
      }
      // Stop drawing while the egg is scrolled out of view; resume where it left off.
      var watcher = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
        onScreen = entries[0].isIntersecting;
        if (onScreen && !frame) frame = window.requestAnimationFrame(loop);
      }) : null;
      if (watcher) watcher.observe(canvas);
      function onKey(event) {
        if (event.key === 'Escape' || (event.target === canvas && (event.key === 'Enter' || event.key === ' '))) {
          event.preventDefault();
          close();
        }
      }
      document.addEventListener('keydown', onKey);
      function close() {
        if (closingAt != null || performance.now() - started < (calm ? 900 : CONTENT_MS + 300)) return;
        closingAt = performance.now();
        canvas.classList.add('is-leaving');
        if (!frame) frame = window.requestAnimationFrame(loop);
      }
      function finish() {
        var hadFocus = document.activeElement === canvas;
        if (watcher) watcher.disconnect();
        document.removeEventListener('keydown', onKey);
        canvas.remove();
        carousel.classList.remove('is-egg-emerging');
        egg = null;
        setBusy(false);
        if (hadFocus) gallery.focus({ preventScroll: true });
        if (options.onDone) options.onDone();
      }
      egg = { canvas: canvas, close: close };
      canvas.focus({ preventScroll: true });
      frame = window.requestAnimationFrame(loop);
    }
  };
})();
