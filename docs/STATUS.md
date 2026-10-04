# Project Status


## 2026-10-05 01:32 CST (Asia/Shanghai) - StrucTrace accepted journal paper

- **User request**: Add StrucTrace, accepted by an npj journal, with the original author order. Added it to the shared publication data above GPCR-Turbo, added assets/files/structrace.bib, and made the homepage heading plural. My choice: use the same title-cover card presentation and expose the existing public Code and BibTeX resources.
- **Source verification**: Re-read the original acceptance email archived previously from the user's THU mailbox: accepted by npj Structural Biology on 2026-07-01. This session's public project README/Citation confirms Xu Wang, Chi Wang, Tin-Yeh Huang, Yiquan Wang, Siyuan Jiang, Yafei Yuan; own name remains fifth of six and is bold. Source: https://github.com/JLU-WangXu/Structrace. Email evidence is retained privately in the task workspace, not published in this repository.
- **Review**: Title matches the acceptance email, authors match the public citation, journal/year/status are explicit, no DOI/volume/pages are inferred. BibTeX follows the project's @article citation with an Accepted note. The existing conditional links yield Code + BibTeX for StrucTrace and only BibTeX for GPCR-Turbo. Both pages use the same include.
- **Current checkpoint**: Previous card commit e21a093 is deployed (Pages run 37220577050 succeeded). StrucTrace source changes are ready; commit/push, new Pages build, both online entries, resource downloads and visual acceptance remain pending at this checkpoint. No local Jekyll build was run.
- **Unverified / next step**: Confirm online publication cards, resource links and responsive/light/dark presentation after deploy. Acceptance is confirmed; formal publication details have not been confirmed. The sidebar CV PDF remains the previously verified export; a concurrent CV task has added StrucTrace to the editable CV sources without exporting a replacement PDF.
- **User decisions needed**: None.

## 2026-10-05 01:27 CST (Asia/Shanghai) - Publication card presentation

- **User request / decision**: Match the reference academic paper-card presentation. User confirmed that GPCR-Turbo has no public PDF, code or project links yet.
- **Changes**: Shared card include, publication metadata, an isolated publication-cards.css stylesheet, stylesheet link and a downloadable gpcr-turbo.bib. The card has a title cover, IEEE BIBM badge, highlighted title and author name, venue/year and Accepted badge. My choice: use a typographic cover until a genuine paper teaser is available; render only existing resources. BibTeX uses @unpublished with an acceptance note and no invented DOI/pages.
- **Validation checkpoint**: Source diff reviewed, conditional links and escaping checked, CSS includes desktop grid, narrow-screen stacking and automatic/manual dark-theme tokens. git diff --check passed. Commit/push, Pages build, online HTML/CSS/BibTeX and browser acceptance remain pending for this card checkpoint.
- **Prior CV update**: e3dae0d is already deployed; Pages run 37220167016 succeeded. Six online content checks passed, including GPCR-Turbo on both pages and the live CV PDF's exact SHA-256 6515b07c916cbcffcad4abd4f80f78e4f86a2fc9509996c374be2d978fe1370b (154752 bytes).
- **Limit / next step**: The title cover is not a scientific result figure. Add the actual paper teaser and public links when available; confirm desktop, dark and mobile rendering after publishing. No local Jekyll build was run.
- **User decisions needed**: None.


## 2026-10-05 01:20 CST (Asia/Shanghai) - Academic CV content synchronization

- **User request**: Sync the latest academic CV into the personal website. Updated index.md (GPA 3.83, graded coursework, four current research entries, selected project), _data/publications.yml and the shared _includes/publications.md, publications.md, SEO metadata and assets/files/CV_public.pdf. Kept the site's Hobbies and the iGEM award; removed research/project entries absent from the current CV.
- **Current verified state**: Nine source consistency checks and git diff --check passed. The public CV PDF matches Jiang_Siyuan_CV_20261005.pdf exactly: 154752 bytes, SHA-256 6515b07c916cbcffcad4abd4f80f78e4f86a2fc9509996c374be2d978fe1370b. GPCR-Turbo lists the complete author order and IEEE BIBM 2026, with Accepted status. No DOI or paper download was added.
- **Publishing**: Source ready for commit and push to the existing main-branch GitHub Pages site; deployment and browser acceptance still pending at this checkpoint. No local Jekyll build was run. The shared publication include was reviewed for Markdown/Liquid rendering and avoids empty asset links.
- **Preservation**: Fast-forwarded from the migrated dfbe00d to f2a21cf before editing, retaining the Search Console verification file and earlier Tasks Bridge changes. Affected source files and STATUS were backed up; prior STATUS sections preserved.
- **Next step / unverified**: Confirm Pages build success, homepage and Publications content, the live CV hash, and desktop/mobile rendering. Historical research claims and course official English names are carried from the supplied CV, not independently re-certified.
- **User decisions needed**: None.


## 2026-10-02 09:10 CST - Local Tasks Bridge pages moved to the project site

- The Local Tasks Bridge home page and privacy policy now live in the public
  project repository `siyuanj/local-tasks-bridge` (`site/`) and are published
  by its Pages workflow at the same URLs, `/local-tasks-bridge/` and
  `/local-tasks-bridge/privacy/`. A project site takes precedence over a user
  site path, so the copies here were no longer served.
- Removed `local-tasks-bridge.md` and `local-tasks-bridge-privacy.md`. The
  Google OAuth Branding URLs and the authorized domain `siyuanj.github.io` are
  unchanged and keep working.

## 2026-10-01 08:10 CST - Local Tasks Bridge OAuth pages published

- User explicitly approved publishing the two OAuth information pages.
- Pushed commit `975fe65763b485a6afd006f7d8e36a5a4d259568` to `origin/main`.
  GitHub Pages reported `built` with no build error.
- Verified the rendered pages at `/local-tasks-bridge/` and
  `/local-tasks-bridge/privacy/`; the latter includes the Google API Services
  Limited Use statement. The pages expose no task content, OAuth credential,
  client secret, or local diagnostic log.
- Google OAuth Branding now uses those two URLs and the authorized domain
  `siyuanj.github.io`; the console displayed `Branding changes saved!`.
- Next step is outside this website repository: obtain the user's required
  action-time confirmation before changing OAuth from Testing to In production
  and issuing a fresh authorization.

## 2026-10-01 08:05 CST - Local Tasks Bridge OAuth pages draft

- User request: prepare long-lived Google OAuth for the personal Local Tasks
  Bridge. Google Auth Platform currently blocks Production until Branding is
  complete.
- Drafted `local-tasks-bridge.md` and `local-tasks-bridge-privacy.md`. The pages
  describe the local-only bridge, Tasks and identity scopes, data use, local
  storage, retention, revocation, and Google API Services Limited Use
  requirements. They contain no task content, OAuth token, client secret, or
  private log.
- Current state: the files exist only in this local clone. They have not been
  committed, pushed, published, or entered into Google Cloud. The public site
  is unchanged.
- Validation: `git diff --check` passed. `bundle exec jekyll build` could not
  run because this Mac lacks the repository's Jekyll gems; no dependency was
  installed. GitHub Pages build and both public URLs remain unverified.
- Next step: after review and authorization to publish, commit and push the two
  pages, verify GitHub Pages, then add the homepage and privacy-policy URLs to
  OAuth Branding and re-check the Production button.

## Current State

- The homepage is a Jekyll academic personal website using the Minimal Light remote theme.
- The sidebar CV link points to `assets/files/CV_public.pdf`.
- Homepage academic content in `index.md` is synced with `Jiang_Siyuan_CV_20261005.pdf`; publication data is shared with the Publications page.

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
