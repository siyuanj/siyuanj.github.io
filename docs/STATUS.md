# Project Status

## 2026-10-05 03:09 CST (Asia/Shanghai) - 四张旅行照片已上线

- **这次做了什么**：用户指定的四张照片及日期说明已加入 Recent Photos，与金门大桥照片一起共五张，按2026.9.26、9.24、9.24、9.23、9.23排列。Google/NVIDIA/Griffith/UCLA名称统一，附件按用户提供的顺序对应；沿用已有样式及原图点击链接。
- **现在真实状态**：aaab46283536637ce3e131c449531a9dc34f7fa7已push；Pages37227070490的build/deploy/report均success。verify_live.py核验13个URL均200，新增12个图片资源与本地逐字节一致；五张卡片数量、四组新增日期/说明、链接、尺寸、srcset和lazy/async属性通过。核验脚本和线上核验.json在试验工作区10-5 旅行照片补充；原始附件和生成预览的哈希清单也在该目录。
- **卡在哪**：Chrome视觉复查受到Mac锁屏限制；CUA返回无法自动解锁，未绕过锁屏。完成了真实构建、线上HTML和所有新增图片文件核验。
- **还没验证的**：本轮未观察Chrome桌面/手机新增照片的实际显示。沿用03:04已验收的模板/CSS，但旧验收不能替代四张新图的视觉复查。下次Mac解锁后在Chrome打开近期照片，检查横竖图及说明；未运行本地Jekyll或新性能基准，日期地点采用用户标注。
- **要用户定的**：无内容决定。此为最终验收文档更新，待单独提交push；页面代码与资源保持已部署版本。


## 2026-10-05 03:07 CST (Asia/Shanghai) - 补充四张旅行照片

- **这次做了什么**：用户要求添加四张照片及日期说明。按附件顺序对应 2026.9.24 拜访 Google、2026.9.24 夜游 NVIDIA、2026.9.23 Griffith 天文台、2026.9.23 和 UCLA 的熊合影；名称拼写统一，其余信息采用用户标注。新增_data/photos.yml四项和12个图片文件，生成脚本新增四个选项；沿用自然比例、原图链接、原生延迟加载，现有金门大桥照片及导航顺序保留。
- **现在真实状态**：四个原始JPEG与附件逐字节一致，尺寸分别6528×4896、4896×6528、4096×3072、4896×6528；新缩略图640/1280px宽，解码与缩放像素相等，原始文件哈希不变。源图/缩略图清单位于试验工作区10-5 旅行照片补充。自审检查了说明与附件顺序、日期倒序、尺寸方向、路径和模板可访问名称；代码待提交push及Pages验收。
- **卡在哪**：无。首轮静态复制检查把EXIF方向0当作异常而中止；核对四张实际像素方向及显示后确认0为未指定，按现有像素方向处理，重新生成完整四组缩略图。
- **还没验证的**：真实Pages构建、线上五张卡片/新增12图片下载和Chrome显示待验收；没有独立认证拍摄地点/日期，没有运行本地Jekyll或新性能基准。本次没有改CSS/JS。
- **要用户定的**：无。


## 2026-10-05 03:04 CST (Asia/Shanghai) - 近期照片已上线并完成显示验收

- **这次做了什么**：用户提供的金门大桥图片已加入 Recent Photos，显示“2026.9.26 · 摄于金门大桥”；Hobbies 后、Visitors 前，Photos 页内入口可跳转。保持 Homepage → Publications → Notes → Blog 顺序。原图不裁剪、不重绘；显示用等比例缩略图与原生延迟加载。
- **现在真实状态**：95ac295d2c875e7a1e93a1b11c8ae0a69c3cc90e 已push；Pages 37226684745 的 build/deploy/report 全部success。5个线上URL返回200；日期、位置、尺寸、延迟加载、CSS缓存键和三张图片逐字节核验通过。原图1448×1086、2404713字节、SHA-256 26654eeeb0f9bcf40efa1ea1082facdd6059f587ef53d9c89b0885f45027c243；640×480 WebP 450446字节，1280×960 WebP 1581318字节。Chrome桌面及390px均观察到完整比例图片与说明；Photos入口跳转正确。私有线上核验.json、preview-manifest.json、Chrome-桌面.png、Chrome-390.png位于试验工作区10-5 近期照片栏目。
- **自审与修正**：检查了共享样式范围、自然比例、Liquid条件/转义、日期/地点来源及原图链接。首次额外静态核验因运行时没有yaml模块未运行，改用标准库读取所需字段及Pillow核对尺寸后通过；未安装新依赖。STATUS更新均保存时间戳备份并核验旧正文完整保留。
- **卡在哪**：无。初次跳转截屏发生在懒加载图片尚未显示时，后续图片加载完成的截图才计入验收。
- **还没验证的**：未运行本地Jekyll或新性能基准；采用真实Pages构建和线上/Chrome验收。未独立考证拍摄日期/地点，采用用户标注。此条为验收文档更新，待单独提交push，不更改已验收页面资源。
- **要用户定的**：无。


## 2026-10-05 03:01 CST (Asia/Shanghai) - 近期照片栏目

- **这次做了什么**：用户要求首页新增近期照片，使用所附图片及日期/地点“2026.9.26 · 摄于金门大桥”。我的判断：放在 Hobbies 后、Visitors 前，并加 Photos 页内入口；数据放 _data/photos.yml，使用独立 include，保留原图点击链接，采用自然比例、640px最大显示宽度和原生延迟加载。上一轮用户要求 Publications 第二位已由 2e8c663 发布；此轮保留该顺序。
- **现在真实状态**：原始PNG已按字节复制至 assets/img/photos/golden-gate-2026-09-26.png；生成640/1280px等比例WebP，重新解码与缩放像素相等且原图SHA不变。脚本新增单图生成选项；共享CSS缓存键更新至 f54db5dc77aa。源码自审检查了HTML/Liquid结构、日期引用、可访问名称、原图链接、尺寸和小屏适配；diff --check通过。代码准备提交push，真实Pages构建与线上/Chrome验收待完成。
- **卡在哪**：无。
- **还没验证的**：尚未确认线上资源及Chrome桌面/手机呈现；没有运行本地Jekyll或重新做性能基准。日期和地点采用用户提供的信息，未从图片推断。
- **要用户定的**：无。私有备份与核验资料位于试验工作区 10-5 近期照片栏目。


## 2026-10-05 02:55 CST (Asia/Shanghai) - 窄屏导航与邮箱字体统一

- **这次做了什么**：用户要求修正截图中 Homepage / Note / Blog / Publications 排列不齐，以及邮箱字体不同。我的判断：导航改为固定网格，520px以下两列两行，521–760px四个等宽列，更宽窗口四项一行；选中下划线跟随文字宽度。移除邮箱的等宽字体和独立缩小字号，继承身份/学校段落的系统字体及字号；在 @ 后添加不改变邮箱文字的 wbr 换行机会。更新内容哈希缓存键 756aca48b5d0。
- **现在真实状态**：221d53da6c607a660e319caccc6de054e37b82d9、a34f4122dfd019d7d3d426fd1af7081f48582207 已push；Pages 37225938676、37226101014 均success。最终四页HTML和主CSS共5个URL返回200，16项定向检查通过；最终CSS 7978字节。Chrome桌面和320/390/500/600px检查：320px邮箱在@后自然换行；390/500px导航两列两行，600px一行，邮箱为正文同族字体；后续小修仅收窄导航下划线，最终390/500/600px再次确认。正常首页仍保留桌面左侧头像。
- **卡在哪**：无实现阻塞。实测普通导航命中了旧页面prefetch cache并加载旧835fd32a793a样式；强制刷新后Network确认加载756aca48b5d0。旧页面的样式不会在不刷新文档时自动替换。一个旧QA标签出现空白截图，验收使用正常的新标签；未将其原因认定为本次CSS问题。
- **还没验证的**：没有运行本地Jekyll或新性能基准；采用真实Pages构建、线上源文件及Chrome视觉验收。此轮不重新认证CV和学术内容，图片与JS未改变。已恢复设备宽400、关闭仿真和DevTools、保留Auto。
- **要用户定的**：无。此记录和README说明还需文档提交push；不改变已验收的页面资源。私有报告和截图位于 /Users/jiangsiyuan/test20260820/10-5 导航字体修正/。



## 2026-10-05 02:47 CST (Asia/Shanghai) - Performance changes deployed and accepted

- **This work / decisions**: User requested overall interaction and architecture optimization and push, with Chrome retained. Shared local layouts/includes and navigation data now serve all pages; only used styles load, system fonts/local SVG replace blocking remote fonts/icons, content-based cache keys retain unchanged assets, and deferred JS provides event-driven theme/navigation/map enhancement. My preview choice retains proportional 600/1200px paper previews with full original links. Added explicit dimensions, async decoding and native lazy loading to five existing blog images; source prose and original figures/CV remain unchanged.
- **Current measured state**: Code f54ffa4e8364d8cc36a700aa2f7acccc9fa6bc24 passed Pages 37224996115; blog follow-up 3a31aff28c65766abcdfaf8062e57484cc3284c9 passed Pages 37225593689 (build/deploy/report all success). Live verification returned HTTP 200 for 18 URLs and passed all 96 HTML/resource/hash checks, including rendered Kramdown image attributes. Five image/render-dependency budgets passed: default display sources 296054 bytes versus baseline 37307215 (99.2% reduction in image bytes); highest srcset candidates total 800832 bytes. Main CSS is 7901 bytes, deferred JS 2468 bytes, paper CSS 3938 bytes and omitted on non-paper pages. CV remains SHA-256 acbde3e1ecce94c3217bd402117f076344887b074c1f9aa74b2ee521f88b9a33.
- **Browser acceptance / review**: Chrome actual Network rows selected avatar-320.webp, gpcr-turbo-600.webp and structrace-600.webp; no original framework PNG, font CDN or Google-font request appeared. Native UI verified Auto/Light/Dark cycle (restored Auto), all four main routes, article return link, section jump and back-to-top. Desktop and 390px paper images retain natural proportions, compact mobile profile fits, and own map iframe displays the complete map/statistics link. Restored width 400, disabled device emulation and closed DevTools; normal homepage remains open. Private screenshots and baseline/after reports are under the separate test workspace's 10-5 网站性能优化 folder.
- **Blockers / limits / unverified**: No implementation or publishing blocker. The first verification predicate incorrectly required all page images to be the avatar; corrected to check the actual profile image, then added a real article-image regression which failed before 3a31aff and passed after deployment. An old QA tab produced a transient blank capture; acceptance uses a fresh Chrome tab with verified content, and that transient cause is unproven. No controlled cold-load before/after timing, local Jekyll build, synthetic performance benchmark or guarantee about all intermittent stalls. Browser extension traffic remains separate from site payload; the provider's frame isolates DOM/styles, not a guaranteed separate CPU thread. Old map history and formal publication DOI/pages remain unconfirmed as before.
- **Next / user decisions**: No required decision. This status-only final record requires its scoped commit/push; code and asset cache keys are unchanged from the verified version. Retain original figures, use the preview/version helpers for later updates, and diagnose any remaining reproducible pause with Chrome Network/Performance evidence.



## 2026-10-05 02:34 CST (Asia/Shanghai) - Static architecture and payload optimization

- **User request / choices**: Optimize overall interactions and architecture because the site sometimes feels slow. Chrome and default commit/push remain required. My implementation choice: preserve original paper figures but serve proportional previews; a preference question was optional and no answer had arrived when the retained-original preview default was chosen. Academic statements, author order, Accepted status and CV are unchanged.
- **Baseline / cause evidence**: The live HTTP payload harness returned a failing budget: avatar 2747534 bytes, GPCR framework 592995 bytes and StrucTrace framework 33966686 bytes, total 37307215. Two external icon stylesheets block rendering, with two more Google font styles discovered by Chrome. Chrome's warm-cache Network view includes the 33.97MB PNG and reports 41.8MB resources including extension traffic; this is not a controlled cold-load timing or proof of every intermittent stall. The old favicon script polls every 300ms and the old iPhone script changes zoom limits on touch.
- **Changes / self-review**: A local shared site layout with separate head/profile/navigation includes, data-driven routes and active collection navigation; one compressed base/layout stylesheet, conditional paper CSS, local SVG icons/system fonts, early stored-theme initialization and one deferred event-driven script. Prefetch only on navigation intent, skipped on data-saving/2G connections. No global polling/scroll handlers; no zoom-lock script. Native skip/section/back-to-top links and post return links work without JS. Remote-theme dependency removed; legacy asset URLs retained for cached HTML. Content-based cache keys survive unrelated deployments. Map provider runs in a separate frame initialized after main load/idle, for ordinary homepage visits rather than only map scrolling.
- **Preview verification**: Resized 600/1200px paper previews and 320/480px profile previews use lossless WebP encoding after proportional scaling, with no cropping/redrawing. Reopened decoded previews equal their resized pixel buffers; source hashes unchanged (GPCR 7e973eb3404095afee4c0815b6121c7bc28c50a6688b41eee59df413b154b49e; StrucTrace 854849abc9f9ef0fd8f7bb7ad74dc39b2495e33b2039f102a42b7e63c1507832). Dimensions and responsive selection reviewed. Full-resolution links retained. Small display sources total 296054 bytes; final live source selection remains pending.
- **Checkpoint / blocked / next**: Static JS parsing and diff whitespace checks passed. Ready for scoped commit/push, real Pages build and deployed payload/HTML/asset checks, Chrome navigation/theme/map verification at desktop and 390px. No local Jekyll build or synthetic browser benchmark was run; no guarantee of all network/extension stalls disappearing. No required user decision remains. Original history below is preserved with a timestamped backup; private baseline/preview reports are outside this public repository.


## 2026-10-05 02:20 CST (Asia/Shanghai) - Visitor map live acceptance complete

- **Completed / user decisions**: Windows website migration, current CV synchronization, real framework publication cards, accepted StrucTrace entry, mostly-left desktop profile and consistent heading hierarchy are complete. User explicitly requested push and Chrome; the visitor map repair was authorized to retrieve the dashboard code directly.
- **Current evidence**: Code commit 7bb7cc1d171f5f963ffd4def600a0653fa77107b is pushed. Pages run 37223710039 completed build, deploy and report successfully. The live homepage, Publications, Notes and Blog plus five resource URLs returned HTTP 200; all 43 content/structure/asset hash checks passed. CV PDF is the exact current 154904-byte English export (SHA-256 acbde3e1ecce94c3217bd402117f076344887b074c1f9aa74b2ee521f88b9a33).
- **Browser acceptance / review**: Chrome desktop shows the map; a 390px viewport shows the full 320px widget within the page without clipping. Its link opens the user's own https://mapmyvisitors.com/web/1c8n8 statistics page, which names siyuanj.github.io and contains a new visitor record. Provider pageview displays are cached/lagged and include verification traffic; no claim of a stable total or distinct human-visitor count. Restored device width 400, turned device emulation off, closed DevTools and left the normal homepage open with Auto theme. Screenshots and private evidence remain outside this public repository.
- **Blocked / remaining limits**: No implementation blocker. The previous site's visitor history was not recovered; the new counter starts with this repair. Formal paper DOI/pages remain unconfirmed. No local Jekyll build was run; actual Pages Jekyll deployment was verified. Original figure files are unchanged, including the large StrucTrace PNG.
- **Next / user decisions needed**: No further user decision required. Keep the authenticated site's dashboard code as the source for future widget maintenance; add public paper resources when supplied. This final status-only update requires its scoped commit/push; no code or content changes after the verified deployment.


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
