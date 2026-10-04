# Project Status

## 2026-10-05 02:15 CST (Asia/Shanghai) - Visitor map replacement and deployed layout acceptance

- **User authorization**: User requested repairing the visitor map, explicitly required Chrome, and then authorized retrieving the backend code directly. Normal Google sign-in completed in Chrome; no password was created or reset and no registration form was submitted. The authenticated dashboard had zero websites. Added the user's public homepage URL and retrieved its own Map widget code, site 1c8n8.
- **Diagnosis / decision**: Old ClustrMaps domain resolves to 127.0.0.1 in local and Google DNS checks; old HTTPS script fails. The replacement provider's old-token data request returns HTML rather than JSONP, while the official demo works. Original site 1c9ch and its history were not recovered. My choice: start a new map for the user's site in the authenticated account; preserve the original code in the timestamped backup and earlier Git history.
- **Implementation / review**: Updated visitor-map.html to the exact dashboard token and MapMyVisitors map.js endpoint, async loading, responsive w=a, corresponding noscript image and own statistics link. Added a consistent Visitors heading and a 320px maximum map width that fits narrow screens. Reviewed provider ID, source URL encoding, parent width, dark/light surrounding layout and independent loading. No demo token or invented visit counts.
- **Current verified layout**: Commit 8111b0f and async follow-up d54eed5 are live; Pages runs 37222275336 and 37222468411 succeeded. Nine online URLs returned 200 and 41 structure/content/hash checks passed on d54eed5, including the latest CV's exact 154904 bytes and SHA-256 acbde3e1ecce94c3217bd402117f076344887b074c1f9aa74b2ee521f88b9a33. Chrome desktop and 390px homepage/paper visuals checked. A failed transient screen capture is marked invalid, not counted as StrucTrace mobile acceptance. Chrome's temporary capture problem was resolved using the exact application identifier; device emulation/DevTools were closed. Earlier desktop Light/Dark checks preceded the user's Chrome-only instruction.
- **Checkpoint / next**: New map code is ready for commit/push and a real Pages build; confirm that the live homepage shows the map and its statistics page names siyuanj.github.io and records the new visit. Historical data migration remains unverified. No local Jekyll build was run. No further user decision is needed for the authorized repair. Private diagnostic snapshots and account UI remain outside this public repository.


## 2026-10-05 01:57 CST (Asia/Shanghai) - Sidebar layout and heading hierarchy

- **User decisions**: Optimize the site proportions and subtitles, keep the avatar/profile on the left for most window sizes like the supplied academic homepage, then push. Earlier user decisions still apply: real paper framework images, GPCR-Turbo has no public PDF/code/project yet.
- **Changes / my choices**: Added site-layout.css after the legacy theme; replaced the 1400px stacking breakpoint with a 760px compact-header breakpoint, constrained the full page to 1160px, and used a 240px sticky sidebar (220px on smaller desktop windows). Unified body/section/project type sizes at 16/22/17px. Converted education and research/project labels to h3, separated advisor/date metadata, reduced navigation spacing, added the active-page state and an accessible main region. Paper images retain natural aspect ratios and full-size links; badges no longer overlap diagram labels.
- **CV synchronization**: Re-read the latest English CV source and exported PDF. Synced the user's Oct 2026 food-peptide end date and first-author GPCR-Turbo-first order. Updated CV_public.pdf to the current two-page export: 154904 bytes, SHA-256 acbde3e1ecce94c3217bd402117f076344887b074c1f9aa74b2ee521f88b9a33. CV source was not edited here.
- **Review / real checkpoint**: Reviewed layout specificity, 761–1000px sidebar/card interaction, narrow navigation/email wrapping, heading hierarchy, preserved academic statements and public resource conditionals. Earlier actual-figure commit 23ba2f8 is live via successful Pages run 37221627204; 23 HTTP/content/hash checks passed, 390px Chrome and desktop Safari Light/Dark visuals were checked. The new shared-layout changes require commit/push, Pages build and repeat rendered acceptance. No local Jekyll build was run.
- **Limits / next step**: Confirm new homepage, Publications, Notes/Blog shared layout and latest CV bytes after deploy, including desktop and narrow viewport. StrucTrace's exact original PNG is 33.97 MB; no pixel editing was done. Formal publication DOI/pages remain unconfirmed. No user decisions pending. Private source emails and manuscript material remain outside this public repository.



## 2026-10-05 01:43 CST (Asia/Shanghai) - Framework image sizing and stylesheet refresh

- **Review finding / my fix**: The first 390px Chrome preview exposed an overly tall image frame. Moved the 16:9 ratio to the image-link container and explicitly fit the image to that frame (width/height 100%, object-fit: contain). Added a build-time version query to the card stylesheet so fresh HTML cannot reuse the old cover stylesheet from browser cache. Figure content and original asset hashes stay unchanged.
- **Current evidence**: Main-figure commit 5eb9413 deployed via Pages run 37221441968; HTTP verification downloaded both pages, both BibTeX files, CSS and both PNGs. All 23 content/file checks passed after excluding HTML comments in homepage counts. Browser sizing fix requires a new build and repeat visual acceptance.
- **Next / limit**: Verify 390px and desktop frames after deploy, then restore the browser's initial Auto theme and normal viewport. No local Jekyll build was run. No user decisions required.


## 2026-10-05 01:40 CST (Asia/Shanghai) - Actual paper framework figures

- **User decision**: Replace the gradient title covers with the actual paper's main/framework figure. Removed the cover template and styles. StrucTrace uses the public project's Figure 1; GPCR-Turbo uses the manuscript's Figure 1 overview (v27/v30 assets have the same SHA-256). Exact original PNG bytes are copied into assets/img/publications/. Cards show the whole figure without distortion and allow opening it at full resolution. My choice: a 16:9 frame suits the overview diagrams.
- **Review / current state**: Figure pixels and manuscript figure reference reviewed; both assets match their source hashes. StrucTrace is 33966686 bytes (13120 x 7622), GPCR-Turbo is 592995 bytes (3400 x 931). Source data/image alternatives/dimensions align, object-fit: contain keeps diagram labels intact, loading is lazy with async decoding. No pixel editing, redrawing or generated figure content. No local Jekyll build was run.
- **Prior deployment**: StrucTrace metadata commit 335959b and Pages run 37220915783 succeeded; online Publications lists both entries with Code/BibTeX resources. Initial homepage count check included an existing commented-out duplicate include; visible content is still two cards. Final checks will exclude HTML comments.
- **Checkpoint / next step**: Framework sources ready for commit/push; new Pages build, image downloads and desktop/mobile visual acceptance pending. Original StrucTrace image is large; a smaller supplied paper image can replace it if needed. Sidebar PDF still uses the previously verified CV export.
- **User decisions needed**: None.


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
