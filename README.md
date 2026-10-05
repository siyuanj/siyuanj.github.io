# Siyuan Jiang Academic Homepage

This repository contains Siyuan Jiang's personal academic website, built with Jekyll and the Minimal Light theme for GitHub Pages.

## Project Notes

- Homepage content lives in `index.md`.
- Recent Photos is a homepage section maintained in `_data/photos.yml` and `_includes/recent-photos.html`. Keep supplied originals in `assets/img/photos/`; generate proportional 640/1280px lossless WebP previews with `scripts/generate_previews.py --only golden-gate-2026-09-26 --report <private-report-path>`. Photo dates/captions come from the owner; display images load lazily and link to the unchanged original.
- Photos follow the existing photo-based `splide02` example in [Splide's autoWidth.php](https://github.com/Splidejs/splide/blob/8d040f626a0cc21e74254ad03e7d1df4f752fc45/src/js/test/php/examples/autoWidth.php): loop, autoWidth, center focus and free dragging, with snap enabled. The track occupies the full content width; each slide follows the photo's original aspect ratio with an 8px gap. Image height is at most 200px and shrinks to one quarter of the content width after reserving two gaps, allowing the active photo and nearest neighbors to fit without cropping. Only the active photo shows its date/location caption. Clicking a side photo centers it; the active photo links to the unchanged original. Arrows, position dots and focused keyboard navigation are retained.
- Only the far left/right viewport edges use the layered gradient-mask technique adapted from [motion-primitives ProgressiveBlur](https://github.com/ibelick/motion-primitives/blob/main/components/core/progressive-blur.tsx). These static, non-interactive overlays cover at most 8% (48px) per edge; there is no full-image blur or outer panel. The upstream MIT license and pinned-source notice remain under `assets/vendor/motion-primitives/`; no React/Motion runtime is added.
- Splide 4.1.4 core JS/CSS is vendored unchanged under `assets/vendor/splide-4.1.4/` with its MIT license, obtained from the official npm package and checked against its SHA-512 integrity. Only pages with `uses_photos: true` load these local files; defer order loads the library before site.js. Splide handles resizing, drag and loop clones. No autoplay or carousel timer is configured. Without the library, the CSS leaves a native horizontal image row. The homepage section shortcut row is intentionally removed.
- Profile metadata and sidebar links live in `_config.yml`.
- The public CV linked from the sidebar is `assets/files/CV_public.pdf`.
- Keep academic content and the public CV aligned with the current academic CV; replace the PDF at the existing link when syncing updates.
- Publication entries are maintained in `_data/publications.yml` and rendered by `_includes/publications.md` on both the homepage and the Publications page.
- Publication cards use `assets/css/publication-cards.css` and the paper's framework figures in `assets/img/publications/`. Set figure dimensions and alternative text in the publication data; keep the complete original accessible from the figure link. Only supplied public resource URLs are rendered. Use actual paper figures rather than typographic title covers.
- Generate display previews with `python3 scripts/generate_previews.py --report preview-manifest.json` (requires Pillow); keep that report outside the public site. The script makes uncropped, proportional 600/1200px paper previews and 320/480px profile previews, losslessly encodes each resized preview as WebP and verifies the original files remain byte-identical. Publication `preview`/`preview_large` paths feed native `srcset`; `image` still links to the full original. Update these paths/dimensions when replacing an original source. Use `--only avatar` or a paper's key to regenerate a subset.
- Main navigation uses four aligned columns on medium screens and two equal columns at 520px or narrower. Profile email inherits the surrounding system font and paragraph size, with a natural break opportunity after @.
- The shared shell is `_layouts/site.html`; `homepage` and `post` remain compatible entry layouts. Head metadata, profile and navigation are separate includes; navigation labels/routes live in `_data/navigation.yml`. Collection posts highlight their parent navigation and provide a return link.
- `assets/css/site.scss` compiles local `_sass/site-base.scss` and `_sass/site-layout.scss` into one compressed stylesheet. Desktop uses a constrained two-column layout; screens at 760px or narrower use a compact profile header. System fonts and inline SVG icons avoid external font/style requests. Paper styling is loaded only by pages with `uses_publications: true`. Legacy theme files are retained for old cached pages but are not loaded by the current shell.
- `assets/js/site.js` provides deferred, event-driven theme switching, navigation prefetch on pointer/keyboard intent (disabled on data-saving/2G connections), and visitor-frame initialization after page load. A tiny head include restores the saved theme before paint. Native page links, section links, skip link and return-to-top work without JavaScript. No site-owned polling or scroll handlers.
- The visitor map UI lives in `_includes/visitor-map.html`; its provider script lives in `assets/visitor-map.html`, in a separate frame, initialized after the main page has loaded. Keep the website's own dashboard token, asynchronous script and `w=a` responsive width. Initialization is not tied to scrolling to the map, so ordinary homepage visits are still recorded once the widget initializes. Public visitor statistics: <https://mapmyvisitors.com/web/1c8n8>.
- Run `python3 scripts/update_asset_versions.py` after changing shared styles or scripts. It updates content-based cache keys in `_data/asset_versions.json`; documentation-only deployments do not invalidate unchanged resources. Source helpers and handoff documents are excluded from the generated site.
- Cross-session handoff notes live in `docs/STATUS.md`.

## Local Preview

```bash
bundle install
bundle exec jekyll build
bundle exec jekyll serve
```

Then open <http://127.0.0.1:4000/>.

# The Minimal Light Theme

[![LICENSE](https://img.shields.io/github/license/yaoyao-liu/homepage?style=flat-square&logo=creative-commons&color=EF9421)](https://github.com/yaoyao-liu/minimal-light/blob/main/LICENSE)

\[[Demo the theme](https://minimal-light-theme.yliu.me/)\]  \[[简体中文](https://github.com/yaoyao-liu/minimal-light/blob/master/README_zh_Hans.md) | [繁體中文](https://github.com/yaoyao-liu/minimal-light/blob/master/README_zh_Hant.md) | [Deutsche](https://github.com/yaoyao-liu/minimal-light/blob/master/README_de.md)\]
 
*This is the source code of my homepage. I build this website based on [minimal](https://github.com/orderedlist/minimal).*
<br>
*Feel free to use and share the source code anywhere you like.*

An improved vision from [@Xiao-Chenguang](https://github.com/Xiao-Chenguang): [[link](https://github.com/Xiao-Chenguang/minimal-light)]

**The latest version of my homepage is available here: <br><https://github.com/yaoyao-liu/homepage>**

## Features

- Simple and elegant personal homepage theme
- Jekyll theme, automatically deployed by GitHub Pages
- Basic search engine optimization
- Mobile friendly
- Supporting Markdown 
- Supporting dark mode

## Project Architecture

```
.
├── _data                    
|   └── publications.yml                      # the YAML file for publications
├── _includes                    
|   ├── publications.md                       # the Markdown file for publications
|   └── services.md                           # the Markdown file for services
├── _layouts                  
|   └── homepage.html                         #  the html template for the homepage 
├── _sass
|   ├── minimal-light.scss                    #  this file will be compiled into a CSS file to control the style of the page              
|   └── minimal-light-no-dark-mode.scss       #  this file is similar to minimal-light.scss with the dark mode disabled
├── assets                                    #  some files
├── html_source_file                          #  compiled HTML files
├── .gitignore                                #  this file specifies intentionally untracked files that Git should ignore
├── CNAME                                     #  the custom domain, will be used by GitHub page sevice
├── Gemfile                                   #  a RubyGems related file
├── LICENSE                                   #  the license file
├── README.md                                 #  the readme file (English)
├── README_de.md                              #  the readme file (German)
├── README_zh_Hans.md                         #  the readme file (Simplified Chinese)
├── README_zh_Hant.md                         #  the readme file (Traditional Chinese)
├── _config.yml                               #  the Jekyll configuration file, including some options of the page  
└── index.md                                  #  the content of the index page, using Markdown
```

## Getting Started

This template can be used in the following two ways: 
- **Using with the GitHub Pages Service.** GitHub will provide you with a server to generate and host web pages.
- **Using locally with Jekyll.** You may install Jekyll on your own computer and generate static web pages (i.e., HTML files) with this template. After that, you may upload the HTML files to your server.

The detailed instructions are available below.


### Using with the GitHub Pages Service

There are two ways to use this template on GitHub:

#### Fork this repository
- Fork this repository (or [use this repository as a template](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template)) and change the name to `your-username.github.io`.

- Enable the GitHub pages for that repository following the steps [here](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site).

#### Using this repository as a remote theme
To use this theme, add the following to your repository's `_config.yml`:

```yaml
remote_theme: yaoyao-liu/minimal-light
```

Please note that adding the above line will directly apply all the default settings in this repository to yours.

If you hope to edit any files (e.g., `index.md`), you still need to copy them to your repository.

### Using Locally with Jekyll

First, install [Ruby](https://www.ruby-lang.org/en/) and [Jekyll](https://jekyllrb.com/). The install instructions can be found here: <https://jekyllrb.com/docs/installation/#guides>

Then, clone this repository:

```bash
git clone https://github.com/yaoyao-liu/minimal-light.git
cd minimal-light
```
Install and run:

```bash
bundle install
bundle add webrick
bundle exec jekyll server
```
View the live page using `localhost`:
<http://localhost:4000>. You can get the HTML files in `_site` folder.

### Using the HTML version

The compiled HTML files are available in the `html_source_file` folder. If you don't like Jekyll, you may directly edit and use the HTML version.

## Customizing

### Configuration variables

The Minimal Light theme will respect the following variables, if set in your site's `_config.yml`:

  ```yaml
# Basic Information 
title: Your Name
position: Ph.D. Student
affiliation: Your Affiliation
email: yourname (at) example.edu

# Search Engine Optimization (SEO)
# The following information is used to improve the website traffic from search engines, e.g., Google.
keywords: minimal light
description: The Minimal Light is a simple and elegant jekyll theme for academic personal homepage.
canonical: https://minimal-light-theme.yliu.me/

# Links 
# If you don't need one of them, you may delete the corresponding line.
google_scholar: https://scholar.google.com/
cv_link: assets/files/curriculum_vitae.pdf
github_link: https://github.com/
linkedin: https://www.linkedin.com/
twitter: https://twitter.com/

# Images (e.g., your profile picture and your website's favicon) 
# "favicon" and "favicon_dark" are used for the light and dark modes, respectively. 
avatar: ./assets/img/avatar.png
favicon: ./assets/img/favicon.png
favicon_dark: ./assets/img/favicon-dark.png

# Footnote
# You may use the option to disable the footnote, "Powered by Jekyll and Minimal Light theme."
enable_footnote: true

# Auto Dark Mode
# You may use the option to disable the automatic dark theme
auto_dark_mode: true

# Font
# You can use this option to choose between Serif or Sans Serif fonts.
font: "Serif" # or "Sans Serif"

# Google Analytics ID
# Please remove this if you don't use Google Analytics
google_analytics: UA-111540567-4
  ```
### Edit `index.md`

Create `index.md` and add your personal information. It supports **Markdown** and **HTML** syntax.

### Edit included files

There are two markdown files included in `index.md`. They are `_includes/publications.md` and `_includes/service.md`, respectively. These two files also support **Markdown** and **HTML** syntax. If you don't hope to include these two files, you may remove the following lines in `index.md`:
https://github.com/yaoyao-liu/minimal-light/blob/b38070cd0b6bce45d8a885f3828549af8f82b7cb/index.md?plain=1#L21-L23

If you hope to edit the publication list without changing the format, you may edit `_data/publications.yml`:
https://github.com/yaoyao-liu/minimal-light/blob/77b1b3b31d4561091bcd739f37a2e1880e8b5ca5/_data/publications.yml#L3-L11


### Stylesheet

If you'd like to add your own custom styles, you may edit `_sass/minimal-light.scss`.

### Layouts

If you'd like to change the theme's HTML layout, you may edit `_layout/homepage.html`.

## License

This work is licensed under a [Creative Commons Zero v1.0 Universal](https://github.com/yaoyao-liu/minimal-light/blob/master/LICENSE) License.

## Acknowledgements

Our project uses the source code from the following repositories:

* [pages-themes/minimal](https://github.com/pages-themes/minimal)

* [orderedlist/minimal](https://github.com/orderedlist/minimal)

* [al-folio](https://github.com/alshedivat/al-folio)
