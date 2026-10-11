# Siyuan Jiang · Academic Homepage

Source for <https://siyuanj.github.io/>, the personal academic website of Siyuan Jiang (Tanwei College, Tsinghua University). It is a Jekyll site published by GitHub Pages from the `main` branch.

## Pages

| URL | Source | Content |
|---|---|---|
| `/` | `index.md` | About Me, education, research interests and experience, publications, projects, awards, skills, hobbies, Recent Photos, visitor map |
| `/publications/` | `publications.md` | Publication cards |
| `/blog/` | `blog.md`, `_blogs/` | Paper-reading posts in English, each linked to its Chinese version |
| `/note/` | `note.md`, `_notes/` | Notes |
| `/feed.xml`, `/sitemap.xml`, `/robots.txt`, `/404.html` | same-named files, `404.md` | Atom feed, sitemap, crawler rules, custom not-found page |

## Repository Layout

```
_config.yml              profile metadata, sidebar links, collections, build excludes
_data/                   navigation, publications, photos, inline logos, asset cache keys
_includes/               head, profile, navigation, publications, photos, visitor map, inline logo
_layouts/                site.html (shared shell); homepage and post entry layouts
_sass/                   site-base.scss, site-layout.scss (plus unused legacy theme files)
_blogs/, _notes/         collection entries; blog figures live in _blogs/pic/
assets/css/              site.scss entry, publication-cards.css
assets/js/site.js        all site behaviour (theme, page tools, carousel, prefetch, visitor map)
assets/img/              avatar previews, favicons, photos, publication figures, logos
assets/files/            public CV and BibTeX files
assets/vendor/           Splide 4.1.4 and the motion-primitives notice
scripts/                 preview generation and asset cache keys
docs/STATUS.md           cross-session handoff notes (excluded from the site)
html_source_file/        legacy compiled template HTML (excluded from the site)
```

## Common Updates

- **Homepage text**: edit `index.md`. Add an inline logo before a link with `{% include inline-logo.html name="tsinghua" %}` (keys in `_data/logos.yml`).
- **Profile and sidebar links**: `_config.yml`.
- **Publications**: `_data/publications.yml`, figures in `assets/img/publications/`, then regenerate previews (see below).
- **Photos**: `_data/photos.yml` and `assets/img/photos/`.
- **Blog posts**: generated, together with `_blogs/pic/`, by the owner's separate export tool (`tools/blog_export.py` in the `8-28 公众号` workspace). Edit the source there instead of the generated files.
- **Notes**: add a Markdown file to `_notes/` with front matter (at least `title`; `date` controls ordering and is shown in the list, undated notes show no date).
- **CV**: replace `assets/files/CV_public.pdf` at the same path.
- **Shared CSS/JS**: after editing, run `python3 scripts/update_asset_versions.py`.

## Local Preview and Publishing

```bash
bundle install
bundle exec jekyll serve
```

Then open <http://127.0.0.1:4000/>. On macOS system Ruby 2.6 the gems need `ffi < 1.17`; the owner's `8-28 公众号/tools/build_blog_site.sh` builds with a separate Gemfile that adds this pin. Its gems live in `10-5 website/.jekyll-gems/` on the SSD (not `$TMPDIR`, which macOS purges); the script test-loads Jekyll and reinstalls the pinned versions if any gem is damaged. `_site/` is gitignored.

Pushing to `main` triggers GitHub Pages' `pages-build-deployment` workflow. GitHub Pages runs Jekyll 3.x with its default plugins (for example titles-from-headings), so check the deployed page when behaviour depends on page titles.

## Implementation Notes

### Layout and styles

- The shared shell is `_layouts/site.html`; `homepage` and `post` remain compatible entry layouts. Head metadata, profile and navigation are separate includes; navigation labels and routes live in `_data/navigation.yml`. Collection posts highlight their parent navigation tab and provide a return link.
- `assets/css/site.scss` compiles `_sass/site-base.scss` and `_sass/site-layout.scss` into one compressed stylesheet. Desktop uses a constrained two-column layout; at 760px or narrower the profile becomes a compact header. System fonts and inline SVG icons avoid external font and style requests. Publication styling is loaded only by pages with `uses_publications: true`. Legacy theme files are kept for old cached pages but are not loaded.
- Light-mode link colour is `#1b74a6` (5.1:1 on white) and publication card titles `#136fa2` (4.9:1 on the card), both meeting WCAG AA; the earlier `#3399cc` was 3.2:1. Dark-mode colours were already above 6:1.
- Main navigation always shows all four tabs (owner decision 2026-10-05: keep Notes even while empty), in four aligned columns on medium screens and two equal columns at 520px or narrower. Profile email inherits the surrounding font and size, with a break opportunity after @. The homepage section shortcut row is intentionally removed.

### Typography

- Body text is 17px with 1.65 line height (16px at 520px or narrower); Chinese pages use 1.75. The font stack is system UI fonts followed by PingFang SC, Hiragino Sans GB, Microsoft YaHei and Noto Sans CJK SC, so no web fonts are loaded. The page is at most 1060px wide, giving a ~764px content column (about 90 Latin characters per line).
- Blog posts and notes use `_sass/site-prose.scss`: a 60ch reading column (~75 Latin or ~38 Chinese characters), 1.25em paragraph spacing, unruled section headings with a 2em lead-in, underlined body links and centered figures. The rhythm follows [@tailwindcss/typography](https://github.com/tailwindlabs/tailwindcss-typography/blob/main/src/styles.js); size and measure were checked against OpenAI article pages on 2026-10-05 (17px/28px text, 556-596px columns, about 65 Latin or 35 Chinese characters).
- `site.js` marks a paragraph that is entirely emphasis as `.post-caption` (all italic paragraphs in the generated posts are figure captions or notes) and mutes its colour only, so the layout does not move. Chinese pages keep emphasis upright because CJK fonts have no true italics.

### Theme switch and page tools

- `assets/js/site.js` provides deferred, event-driven theme switching, page tools, the photo carousel, navigation prefetch on pointer/keyboard intent (disabled on data-saving/2G connections), and visitor-frame initialization after page load. A tiny head include restores the saved theme before paint. Native links, section links, skip link and return-to-top work without JavaScript. There is no site-owned polling or scroll handler.
- Top-right page tools stay fixed: the language link on translated posts and a System/Light/Dark segmented theme switch. The sliding thumb and active icon are styled from `html[data-theme]`, so they are correct before the deferred script runs. An IntersectionObserver on the main navigation adds a floating shadow once it scrolls away.
- Switching language on a post keeps the reading position. The click stores the position in sessionStorage as a fraction between heading/figure landmarks (both language versions share the same sequence), and the target page restores it, falling back to a whole-page ratio if the landmark counts differ.

### Head metadata and SEO

- The shared head sets the page language, canonical URL, hreflang alternates for translated posts, Open Graph/Twitter summary tags and, on the homepage, Person structured data. `share_image` is a 512px JPEG resized from the favicon master.
- The homepage title is the name alone, because GitHub Pages' titles-from-headings plugin would otherwise use "About Me".
- Plugin-free Liquid templates generate `/sitemap.xml` (pages and published collection entries; `sitemap: false` opts out and empty collection index pages are skipped), `/robots.txt`, an Atom `/feed.xml` (latest 30 English blog posts, matching the Blog page) and a custom no-index `/404.html`.

### Recent Photos

- Maintained in `_data/photos.yml` and `_includes/recent-photos.html`. The carousel shows five 1448×1086 (4:3) anime illustrations: a Tsinghua research poster presentation, Baker on screen at RosettaCon Asia, Golden Gate, NVIDIA and Griffith Observatory. The Google and UCLA artwork files remain in the repository but are no longer listed. Dates are optional when the owner has not supplied them; captions support a `[doge]` token rendered by `_includes/photo-caption.html` using the site's existing pixel doge artwork. Long captions wrap within the carousel width.
- Golden Gate keeps the owner's existing artwork; NVIDIA uses the owner's explicitly selected illustration. The owner's standing decision for converted photos is a faithful, natural anime style: keep face shape, original expression, ordinary human proportions and the actual scene, without caricature or perspective distortion. Griffith (and the unlisted Google and UCLA images) were regenerated with built-in imagegen using the approved NVIDIA image as the rendering reference and each original photograph as the identity/scene reference. Prompts and source records live in the private `test20260820/10-5 照片自然动漫化/` folder.
- Source photographs and their old previews are backed up outside the public repository in the owner's `test20260820/10-5 照片插画统一/原始照片` folder; they are removed from the published tree, with historical Git versions still retained. Do not restore photographic faces through thumbnails or full-size links. Photo dates and captions come from the owner; captions are in English (owner decision 2026-10-10). Full-size links open the current illustrations.
- The carousel follows the photo-based `splide02` example in [Splide's autoWidth.php](https://github.com/Splidejs/splide/blob/8d040f626a0cc21e74254ad03e7d1df4f752fc45/src/js/test/php/examples/autoWidth.php): loop, autoWidth, center focus and free dragging with snap. The track spans the content width; slides keep the 4:3 ratio with an 8px gap. Image height is at most 200px and shrinks to a quarter of the content width after reserving two gaps, so the active image and its neighbours fit without cropping. Only the active image shows its date/location caption. Clicking a side image centers it; the active image links to the full-size illustration. Arrows, position dots and focused keyboard navigation are kept; there is no autoplay or timer. Without the library, the CSS leaves a native horizontal image row.
- Only the far left/right edges use the layered gradient-mask technique adapted from [motion-primitives ProgressiveBlur](https://github.com/ibelick/motion-primitives/blob/main/components/core/progressive-blur.tsx). These static overlays cover at most 8% (48px) per edge. Arrows are white 44px circular buttons with dark chevrons and a small shadow, following the owner's reference. The upstream MIT license and pinned-source notice are under `assets/vendor/motion-primitives/`; no React/Motion runtime is added.
- Splide 4.1.4 core JS/CSS is vendored unchanged under `assets/vendor/splide-4.1.4/` with its MIT license, obtained from the official npm package and checked against its SHA-512 integrity. Only pages with `uses_photos: true` load it; defer order loads the library before `site.js`.
- When replacing artwork, use a new image basename so cached previews do not mask the update, and keep the selected full-size PNG unchanged.
- Easter egg (`assets/js/photo-egg.js`, loaded only with `uses_photos`; owner requests 2026-10-09/10): holding still on a photo for 0.5 s starts charging (a ring at the pointer, a slight shake); after 1.2 s more it is full (rainbow ring). Releasing a full charge spins the strip (about ten slides, fast then easing out, ending on the first photo). Partway through the slowdown the egg grows out of it: the photos blur harder while pixels pop in at random on a moving mosaic over 1.6 s, the background starting at the strip's speed and easing to its normal scroll, and the panel, doge and text then fade in. The canvas pixel screen stays until it is clicked or tapped (or Escape/Enter/Space while focused), then dissolves back to the photos. The screen shows "YOU FOUND THE EGG!" decoding from random letters, a 22x20 pixel doge drawn after the WeChat [Doge] sticker (yellow-orange fur, cream face, half-closed eyes glancing right, smirk), a background that scrolls left as a whole (a full colour mosaic gliding at sub-cell positions, faster sparse pixels for parallax, and streams racing left with fading trails) behind a translucent panel, a marching rainbow frame, flicker, glitch slices and scanlines, doge-speak words cycling in the top band, and "CLICK/TAP TO RETURN" below. It re-reads the light/dark theme every frame and stops drawing while scrolled out of view. Moving more than 8 px turns the press into an ordinary drag; a short press, a drag or a fling behaves as before, and the release after a full charge never opens or centres a photo. With reduced motion there is no shake, spin, decode or flashing, and the background scrolls at 30% speed. Slide announcements pause while it runs; the live region says "You found the egg!", and focus returns to the photos when it closes.

### Publications and previews

- Entries live in `_data/publications.yml` and are rendered by `_includes/publications.md` on both the homepage and the Publications page. Cards use `assets/css/publication-cards.css` and each paper's framework figure in `assets/img/publications/`. Set figure dimensions and alternative text in the data; keep the complete original reachable from the figure link. Only supplied public resource URLs are rendered. Use actual paper figures rather than typographic title covers.
- Generate display previews with `python3 scripts/generate_previews.py --report preview-manifest.json` (requires Pillow); keep the report outside the public site. The script makes uncropped, proportional 600/1200px paper previews and 320/480px profile previews, losslessly encodes them as WebP and verifies the originals stay byte-identical. Travel illustrations use quality-90 640/1280px WebP previews (for example `--only google-2026-09-24-natural-illustrated --report <private-report-path>`). Publication `preview`/`preview_large` paths feed `srcset`; `image` still links to the full original. Use `--only avatar` or a paper key to regenerate a subset.

### Favicon and inline logos

- The favicon is an anime face icon generated with built-in imagegen from the Golden Gate illustration. Its unchanged 1254px master is `assets/img/icons/siyuan-anime.png`; 16/32px PNGs are declared in the shared head, a 180px PNG is the touch icon, and `/favicon.ico` holds 16/32/48px frames. The same artwork serves light and dark browser chrome. Use a new basename when replacing it to avoid stale favicon caches. The prompt, export helper and manifests are in the owner's private `test20260820/10-5 网页头像图标/` folder.
- Inline institution logos are decorative (empty alt), sized to 1.15em and given a white backing in dark mode; keys, paths and pixel sizes live in `_data/logos.yml`, PNGs in `assets/img/logos/`. Original downloads (Wikimedia Tsinghua logo, stanford.edu and ufl.edu favicons, the Tsinghua-M iGEM 2024 team logo with its tagline cropped out) and checksums are kept outside the repo in `10-5 website/logo-sources/`.

### Blog, notes and CV

- The Blog page lists English posts newest first, grouped by year, each with its front-matter `description` (clamped to two lines) and a link to its Chinese version; Chinese posts are not listed separately.
- Post dates come from the exporter's `_post_dates` (in the `8-28 公众号` workspace, `tools/blog_meta_overrides.json`). On 2026-10-09 the 26 posts exported together on 2026-10-04 and the 4 from 2026-10-03 were spread over 2026-08-29..2026-10-02 at the owner's request, one per day and each after its paper's publication date (`tools/spread_post_dates.py`, seed 20261009); the only shared days left are the four original writing dates of the 18 earlier posts. Post URLs contain the date, so `/404.html` forwards an old dated blog URL to the post with the same name and language.
- Lists, previous/next links and the feed sort by file path rather than `date`: filenames start with the date, and Jekyll's date sort orders same-day posts arbitrarily (and differently per language), while undated notes have no date yet when other pages render.
- Posts with at least three `##` sections get a table of contents built at build time from the rendered `<h2 id>` headings (`_includes/post-toc.html`): in the sticky sidebar on desktop, with the current section highlighted by an IntersectionObserver (the last section once the footer is visible), and as a collapsed box after the first divider on screens 760px or narrower. Each post ends with previous/next links within the same collection and language.
- The two test notes are published at the owner's request (2026-10-05); the undated one has a front-matter title matching its heading, because Jekyll otherwise names collection items after the filename. The placeholder blog post `_blogs/2025-01-20-test.md` stays `published: false`.
- The public CV is `assets/files/CV_public.pdf`, linked from the sidebar. The homepage may contain details that the PDF does not (the owner decided on 2026-10-05 not to sync the Gene Editing course and research-journey paragraph into it).

### Visitor map

- The UI is in `_includes/visitor-map.html`; the provider script runs in a separate frame, `assets/visitor-map.html`, initialized after the main page has loaded. Keep the site's own dashboard token, asynchronous script and `w=a` responsive width. Initialization is not tied to scrolling, so ordinary homepage visits are still recorded. Public statistics: <https://mapmyvisitors.com/web/1c8n8>.

### Asset caching

- `python3 scripts/update_asset_versions.py` writes content-based cache keys to `_data/asset_versions.json`, so documentation-only deployments do not invalidate unchanged CSS/JS. Source helpers and handoff documents are excluded from the generated site.

## Project Documents

- `AGENTS.md` / `CLAUDE.md`: repository rules for coding agents (kept identical).
- `docs/STATUS.md`: cross-session handoff notes.

## Credits

The layout was originally derived from the [Minimal Light](https://github.com/yaoyao-liu/minimal-light) theme by Yaoyao Liu (CC0-1.0, see `LICENSE`), itself based on [pages-themes/minimal](https://github.com/pages-themes/minimal). Splide (MIT) and the motion-primitives ProgressiveBlur technique (MIT) are credited under `assets/vendor/`.
