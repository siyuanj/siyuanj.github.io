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
- Investigated the ClustrMaps visitor widget outage. Git history shows the original embed was added on 2026-03-02 in commit `26cd410` and was not changed until the temporary troubleshooting commits on 2026-06-02. DNS checks through local DNS, Cloudflare, and Google currently fail for `clustrmaps.com`, `www.clustrmaps.com`, and `cdn.clustrmaps.com` because ClustrMaps authoritative nameservers refuse queries / have lame delegation. The original ClustrMaps widget has been restored so existing ClustrMaps history and IP/geographic records remain tied to the same site token.

## Open Issues

- `README.md` still mostly documents the upstream Minimal Light theme rather than this personalized site.
- Some older comments in `_config.yml` and `_sass/minimal-light.scss` appear mojibake-encoded; avoid broad rewrites unless intentionally cleaning documentation/comments.
- The ClustrMaps widget may remain invisible until ClustrMaps fixes its DNS/service-side issue. The local site and GitHub Pages build are healthy.

## Next Recommended Step

- Recheck DNS for `clustrmaps.com` and then preview the deployed GitHub Pages site. If DNS still fails, contact ClustrMaps support or log in to the ClustrMaps dashboard to see whether they changed the embed domain/code for existing counters.
