# Repository Workflow

This repository is Siyuan Jiang's academic homepage, built with Jekyll and the Minimal Light theme for GitHub Pages.

## Read Before Substantial Work

Before making non-trivial changes, read these files when present:

- `AGENTS.md`
- `README.md`
- `docs/STATUS.md`

Use `docs/STATUS.md` for cross-session handoff notes and keep `README.md` focused on stable project context.

## Site Structure

- `index.md` contains the homepage biography, education, research, awards, skills, and hobbies.
- `_config.yml` contains profile metadata, links, theme settings, and collection configuration.
- `assets/files/CV_public.pdf` is the CV linked from the sidebar CV icon.
- `_blogs/` and `_notes/` contain blog and note collection entries.
- `assets/css/style.scss` imports `_sass/minimal-light.scss`, where most custom styling lives.

## Local Checks

Use Bundler/Jekyll from the repository root:

```bash
bundle exec jekyll build
bundle exec jekyll serve
```

The local site is served at `http://127.0.0.1:4000/` or `http://localhost:4000/` by default.

## Documentation Updates

After meaningful changes, update `docs/STATUS.md` with:

- what changed
- why it changed
- current state
- recommended next step

Update `README.md` only when stable project context, setup, architecture, or the main implementation approach changes.
