# Project Status

## Current State

- The homepage is a Jekyll academic personal website using the Minimal Light remote theme.
- The sidebar CV link points to `assets/files/CV_public.pdf`.
- Homepage content in `index.md` is synced with the latest CV file `Jiang_Siyuan_CV_May19.pdf`.

## Recent Progress

- Updated the homepage from the latest local CV PDF dated May 19, 2026.
- Synced the homepage and public CV asset again from `Jiang_Siyuan_CV_May19.pdf`, including GPA 3.81, revised selected coursework, expanded T-cell CRISPR details, the protein-peptide interaction prediction course project, Java, and TOEFL 94.
- Added an Education section with GPA and selected coursework.
- Refined Research Interests around computational protein engineering, protein design models, virtual screening, and functional engineering.
- Expanded Research Experience entries with dates, advisors, and updated project descriptions.
- Added the selected small-RNA machine learning cancer diagnosis project.
- Added Skills and refreshed Honors, Awards, and Hobbies.
- Updated SEO keywords and description in `_config.yml` to match the latest research focus.
- Replaced `assets/files/CV_public.pdf` with the latest CV PDF.
- Added `AGENTS.md` to document repository-specific workflow and handoff conventions.
- Added a project-specific overview to the top of `README.md` while preserving the upstream theme documentation below it.
- Improved homepage readability by increasing body text size, darkening light-mode text color, strengthening body and emphasis weights, and aligning light/dark theme text colors.
- Fixed responsive avatar styling so the profile image remains rectangular instead of becoming circular or elliptical at narrower widths or browser zoom levels.
- Removed the final lab/discussion sentence from the About Me paragraph for now.
- Added the publishing convention to `AGENTS.md`: commit and push website changes by default unless the user explicitly says not to push.
- Replaced the broken ClustrMaps visitor widget with a lightweight hits.sh visit counter badge that renders reliably in local preview and on GitHub Pages.

## Open Issues

- `README.md` still mostly documents the upstream Minimal Light theme rather than this personalized site.
- Some older comments in `_config.yml` and `_sass/minimal-light.scss` appear mojibake-encoded; avoid broad rewrites unless intentionally cleaning documentation/comments.
- The visitor counter now tracks visits as a badge rather than a geographic map; restore a map only if a reliable provider is chosen.

## Next Recommended Step

- Preview the deployed GitHub Pages site after pushing and confirm the hits.sh visit badge appears.
