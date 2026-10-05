# Project Status

## 2026-10-05 04:30 EDT (America/New_York) - 网站优化、照片精简、主题切换重做、About Me研究经历

- **这次做了什么 / 用户要求**：照片只保留金门大桥、NVIDIA、Griffith（`_data/photos.yml`，Google/UCLA图片文件保留未删）；右上角Auto文字按钮改为系统/亮/暗三段图标切换（`_layouts/site.html`、`_sass/site-base.scss`、`assets/js/site.js`）；About Me新增研究经历：iGEM（Tsinghua-M 2024，RNAssay）→ 廖学斌组短期 → 施一公组（单独一段写主要工作：gamma-secretase时空演化、PS1溯源、约1,500个AF3预测、关键残基与AD）→ 2026暑期Le Cong组visit → 2026年9月UF Xuefeng Liu组visit，均加超链接；用户要求弱化廖组、突出施组。Selected coursework加入 **Gene Editing (A+)**；Honors里iGEM加队伍wiki链接；Research Experience中Le Cong与施一公导师名加链接。博客中英切换保留阅读位置（用户反馈切换后回到顶部）。
- **我的判断**：(1) 右上角工具保持fixed，便于阅读中途切换语言；导航滚出视口后由IntersectionObserver加浮动阴影（无scroll handler）。(2) 语言切换按“标题+图片”地标之间的比例映射位置，地标数不一致时退回整页比例；本地构建中48对中英文章地标数全部一致，正文图片均带width/height。(3) 首页`<title>`和og:title改为仅姓名（Pages的titles-from-headings会生成“About Me”）。(4) 新增OG/Twitter摘要卡、hreflang、按页`lang`、首页Person JSON-LD；512px分享图`assets/img/icons/siyuan-anime-share-512.jpg`由favicon母图用sips缩放（107326字节）。(5) 新增无插件`sitemap.xml`、`robots.txt`、Atom `feed.xml`（最新30篇英文博客）和自定义`404.md`（noindex）。(6) 三个占位测试条目（`_blogs/2025-01-20-test.md`、`_notes/2025-01-20-note_test.md`、`_notes/test.md`）设`published: false`，未删除；导航自动隐藏没有已发布条目的集合，因此Notes暂不显示，有新笔记后自动恢复。(7) 导航下边框改用`var(--line)`，删掉三条硬编码颜色覆盖。
- **链接来源（2026-10-05查证）**：iGEM <https://2024.igem.wiki/tsinghua-m/>（team页成员列表含Siyuan Jiang）；廖学斌 <https://www.sps.tsinghua.edu.cn/info/1011/1423.htm>；施一公 <https://ygshi.org/>（页面含清华地址；ygshi.life.tsinghua.edu.cn从本机访问超时，未采用）；Le Cong <https://conglab.com/>（其Google Scholar主页链接）；Xuefeng Liu <https://xuefeng11.github.io/>（UF College of Medicine与AI for Health Institute助理教授）。以上链接本机curl均返回HTTP 200。
- **现在真实状态 / 本次验证**：本地`/Volumes/Work/8-28 公众号/tools/build_blog_site.sh`（Jekyll 3.8.7）构建成功；sitemap（3个页面+已发布博客）和feed（30条）均可被XML解析；Blog列表49条（占位测试已移除）；导航3项。内置浏览器（scratchpad静态副本，localhost:4000）核验：三种状态均正确设置`data-theme`、localStorage和`aria-pressed`；轮播为3张原始slide+6个clone，中央金门大桥图注正确；430px窄屏下导航3列、工具栏高34px；Odin-Multi英文Part 3切到中文落在“三、看图说话”，中文Part 4下方120px切回英文落在Part 4下方173px，顶部切换仍为0；控制台无错误。`git diff --check`通过。提交号与Pages部署结果在本条后续补记。
- **卡在哪 / 下一步**：push后核对Pages构建，以及线上首页/博客/404/sitemap/feed；在GitHub Pages环境确认首页og:title为姓名。
- **还没验证的**：写入本条时尚未确认GitHub Pages（Jekyll 3.10及默认插件）线上渲染；未测真实手机触摸、Safari/Firefox；OG卡片未经各平台抓取器实测；`Gene Editing`是我对课程英文名的译法；公开CV PDF尚未加入该课程和About Me新增经历，需要与CV源文件同步。
- **要用户定的**：课程英文名是否用“Gene Editing”；是否同步更新`assets/files/CV_public.pdf`。本次STATUS为前插，备份于`/Volumes/Work/10-5 website/status-backups/STATUS-20261005-0430-EDT.md`。


## 2026-10-05 12:45 CST (Asia/Shanghai) - 自然动漫旅行照片上线验收

- **这次做了什么 / 用户决定**：Google、Griffith天文台和UCLA三张已按用户最新要求重新转换为自然动漫插画；采用原照的表情、脸型、人体比例和实际场景，撤销旧夸张/透视畸变提示词。NVIDIA使用用户明确选定的PNG，Golden Gate保留既有图。五张当前展示统一1448×1086、4:3，大图与缩略图均为插画。README已记录此默认；轮播代码、间距、中央图注与圆形箭头不变。
- **现在真实状态 / 本次验证**：图片代码8918fb4f5ae87544ea5c8f9524fd53a9fca31c83已push。真实Pages37264601350 completed/success，build/deploy/report-build-status三job均success。verify_online.py四组检查通过：五slides及尺寸/lazy/async属性；三项新PNG和两档预览引用一致；Golden Gate和选定NVIDIA入口保留；九个新资源HTTP200且SHA256与本地逐字节一致。三张PNG保留生成字节，六张quality90 WebP合计1218564字节。
- **Chrome实际观察**：第二张Google、第四张Griffith、第五张UCLA的新图和对应日期/地点中央图注逐张核验；相邻照片同尺寸、原有NVIDIA选中版本仍显示。实际点击中央UCLA链接，打开natural-illustrated PNG，Chrome标题确认1448×1086，图像载入后返回轮播。Light、用户原有标签保留，DevTools和设备仿真未开启。本轮仅图片和数据变动，没有重复旧版布局/手机检查。
- **来源 / 自审 / 证据**：共3次内置imagegen，以原照为主体/场景，以选定NVIDIA仅为渲染参考，无CLI/API备用生成。逐张视觉审查后替换，未声称脸部精确几何复制或身份识别分数；新文件名避免旧资源缓存。data/helper/README及提交diff自行review，diff --check通过。私有10-5 照片自然动漫化保存prompts.md、selection.json、preview-manifest.json、backup-manifest.json、九资源线上核验、deployed-homepage.html、deployment-8918fb4.json、四张Chrome截图及chrome-acceptance.json。12个旧文件备份且旧插画历史链接保留。
- **前一步NVIDIA验收**：用户选图ab9fc92099c52fc1e8f008e10d0267628e291f5a已push；Pages37263667703全success。独立HTTP四组/三个资源字节匹配；Chrome第三张中央图注及实际点击1448×1086大图已验证，证据保存在10-5 NVIDIA照片替换。本轮没有重做用户选定图。
- **卡在哪 / 下一步**：无发布或素材阻塞。本条为已完成验收的文档补充，提交push后只确认最终Pages；已通过的图片/页面检查不因纯文档提交重复。
- **还没验证的**：未测真实手机触摸、其他浏览器及新性能基准；本次采用真实Pages构建，没有本地Jekyll。人脸/场景相似度为视觉判断，原照日期地点沿用用户提供的信息。
- **要用户定的**：无。STATUS按时间增量前插、保存备份，历史正文逐字节保持。


## 2026-10-05 12:38 CST (Asia/Shanghai) - 按最新决定重做三张自然动漫照片

- **这次做了什么 / 用户决定**：用户否决此前强调夸张比例、强情绪和透视畸变的金门大桥提示词，要求其他同期照片直接转成动漫。以原始Google、Griffith、UCLA照片为主体/场景参考，以用户选定的NVIDIA插画仅作自然渲染参考，内置imagegen分别重做3张；保留原脸型、闭嘴/微笑表情、普通身体比例、服装与日夜场景。UCLA竖图通过横向环境扩展改为4:3。README记录最新默认，旧夸张要求已被用户新决定替代。
- **现在真实状态 / 本次实测**：三张实际输出1448×1086、4:3，PNG与生成文件逐字节一致；交付六张640×480及1280×960、quality90 WebP，合计1218564字节，原PNG未重绘。photos.yml三项全部改用natural-illustrated新文件名，大图与两档缩略图匹配；日期/图注/位置、Golden Gate及选定NVIDIA保留。预览helper来源同步，CSS/JS缓存键不变。12个既有文件已备份，自审与diff --check通过。
- **前一步NVIDIA验收**：ab9fc92099c52fc1e8f008e10d0267628e291f5a已push；Pages37263667703 build/deploy/report success。其4组线上检查通过，新3资源HTTP200且哈希匹配。Chrome第三张、中央2026.9.24夜游NVIDIA说明、实际点击选定1448×1086 PNG大图并返回已观察；证据在10-5 NVIDIA照片替换。此用户选定图片不随本轮重做。
- **来源 / 真实限制**：自然版共3次内置imagegen，无CLI/API备用调用；人物相似度与场景采用逐张和原照的视觉审查，未声称精确几何复制或身份识别分数。prompts.md包含实际三条提示词和输入角色；selection.json、preview-manifest.json、backup-manifest.json及复用导出/核验helper在10-5 照片自然动漫化。当前原始照片仍为私有备份；历史插画保留旧链接，但轮播不再引用。
- **卡在哪 / 下一步**：无素材阻塞。准备commit/push，等待本轮真实Pages，核验五条当前入口及九个新资源字节，再Chrome逐张观察新图/中央图注和大图入口。
- **还没验证的 / 要用户定的**：本轮Pages发布、线上资源和Chrome新三图尚未验收；未跑本地Jekyll或新性能基准。无用户待定项。STATUS前插并备份，旧正文保持。


## 2026-10-05 12:27 CST (Asia/Shanghai) - 按用户选择替换NVIDIA夜游插画

- **这次做了什么 / 用户决定**：用户选择exec-aaaa321e-fc24-4f66-92b2-8cd078fd188a.png作为更好的NVIDIA夜游插画。直接采用该PNG，不再次生成或改变画面；新增nvidia-2026-09-24-selected-illustrated.png及640/1280px WebP，把photos.yml中第三项的大图和两档预览统一指向新文件名。日期、图注、1448×1086尺寸和顺序保留。预览helper的NVIDIA来源也改为选定版。
- **现在真实状态 / 本次核验**：选中原图1448×1086、4:3，与附件逐字节一致。交付helper完成1原图/2预览并确认原图源未变、两预览尺寸640×480和1280×960且为WebP，quality90；两档预览合计412792字节。现有五文件已按哈希备份；代码自审及diff --check通过，Git工作线无远端分叉。
- **来源 / 自审**：用户的具体选择优先于此前自动选图，保留此前生成版本资源供历史链接使用；当前轮播仅引用新选择。复用既有encode-previews.cjs，Sharp仅做交付缩放/编码。任务目录10-5 NVIDIA照片替换保存selection.json、preview-manifest.json、backup-manifest.json和备份。CSS/JS、其他照片及favicon不涉及此次改动。
- **卡在哪 / 下一步**：无素材阻塞。准备commit/push，等待真实Pages，核对新三资源的线上哈希和当前第三张大图/预览入口，再在Chrome实际观察NVIDIA图片和图注。
- **还没验证的 / 要用户定的**：本轮Pages上线及Chrome显示尚待核验；未跑本地Jekyll或新性能基准。无用户待定项。STATUS前插、备份并保持旧正文。


## 2026-10-05 12:22 CST (Asia/Shanghai) - 动漫favicon上线与Chrome标签验收完成

- **这次做了什么 / 用户要求**：金门大桥动漫头像生成的新favicon已替换全站毕业帽图标，保留笑脸、眼镜、发型和蓝色背景。一次内置imagegen、母版1254×1254，16/32/48/180 PNG及多帧ICO交付；当前共享head统一所有页面，源码与提示词/导出脚本已保存。
- **现在真实状态 / 本次验证**：代码aeeeb73c4c438c7c63a602613e8396391c0de0d4已push；真实Pages37262639294的build/deploy/report-build-status均success。verify_icons.py：本地17项检查通过，线上26项（包含17本地项）通过，三个页面icon/touch声明精确匹配、六个资源HTTP200且与本地SHA256一致；首页三个CSS资源也HTTP200。16/32标签PNG分别873/2840字节，ICO9688字节；母版未改变。
- **Chrome实际验收 / 证据**：首页与2025-01-20-note_test笔记的页面内容和动漫头像标签图标均已实际观察并保存截图。初次首页导航已有新favicon但内容空白，不计为完整页面验收；正式首页地址重载后内容显示，通过最终截图确认。关闭本次额外笔记核验标签，保留用户原有标签、Light主题与首页核验标签。私有Chrome-favicon-home.png、Chrome-favicon-note.png、chrome-acceptance.json、online-check.json和deployment-aeeeb73.json记录实际证据。
- **卡在哪 / 下一步**：无实现或发布阻塞。此为验收文档补充，准备单独commit/push并确认最终Pages；网站代码和图标资源不变。验收记录的首次shell内嵌Python因输入编码失败，改为直接写入UTF-8文件；失败时STATUS正文未改变。
- **还没验证的 / 要用户定的**：未跑本地Jekyll，采用真实Pages构建。其他浏览器及iOS添加到桌面未实测，无性能基准。旧的未刷新标签可能仍保留缓存图标。无用户待定项。STATUS原章节已备份并逐字节保留。


## 2026-10-05 12:13 CST (Asia/Shanghai) - 动漫头像favicon生成与全站入口更新

- **这次做了什么 / 用户要求**：使用内置imagegen，以金门大桥插画中的人物和风格生成个人网站浏览器头像图标。采用笑脸、黑框眼镜、深色蓬松头发和蓝底；生成一次，实际输出1254×1254，未将提示词要求的1024冒充实际尺寸。头像母版保存assets/img/icons/siyuan-anime.png，16/32/48/180px为标准交付缩放；全站共享head声明16/32px PNG和180px touch图标，根favicon.ico含16/32/48px帧。新PNG路径避开旧favicon缓存。
- **现在真实状态 / 本次实测**：母版与imagegen原始PNG逐字节一致；16px873字节、32px2840字节、ICO9688字节。17项本地素材核查通过：PNG尺寸/哈希、母版保留、ICO目录/偏移/三帧精确匹配/长度。16/32px已查看，眼镜和笑脸可辨认；配置与共享head diff自审及diff --check通过。README记录实际入口、交付尺寸和私有重跑文件。CSS/JS、头像侧栏和照片轮播未改。
- **自审 / 来源**：所有造型由内置imagegen生成，Node Sharp仅缩小交付尺寸，未使用CLI/API备用生成模式。输入、最终提示词favicon-prompt.md、selected-icon.png、export-favicon.cjs、icon-manifest.json、local-review.json和STATUS备份在试验工作区10-5 网页头像图标。所有当前布局继承site-head；旧主题favicon脚本不由当前布局加载。
- **卡在哪 / 下一步**：无素材或实现阻塞。准备commit/push，再等待真实Pages构建、核对首页/Publications/笔记三个入口和六个资源线上字节，Chrome实际检查标签图标。
- **还没验证的 / 要用户定的**：本轮线上部署及Chrome标签尚未验收；未跑本地Jekyll，不声称浏览器性能基准或真实iOS添加到桌面已测。无用户待定项。STATUS增量前插，原章节保留。


## 2026-10-05 12:04 CST (Asia/Shanghai) - 旅行插画上线与Chrome验收完成

- **这次做了什么 / 用户决定**：近期照片另外四张已通过内置imagegen转换成与金门大桥参考一致的动漫旅行插画；用户原始提示词保存在私有final-prompt-set.json，NVIDIA/Griffith面部经过针对性修正。五张完整画幅统一1448×1086、4:3；当前缩略图与大图链接均为插画，保留日期地点、8px间距、中央图注、局部边缘模糊和圆形箭头。旧真人JPEG/预览已哈希备份并从当前发布树移除，历史Git版本仍保留。
- **现在真实状态 / 本次验证**：代码c8343602ca5d36ba4fcf017de676f67faa4cf0f5已push，真实Pages37261417651的build/deploy/report-build-status均success。verify_online.py四组检查通过：线上五slides及1448×1086/lazy/async/PNG大图入口；12新资源HTTP200且与本地逐字节一致；12旧真人资源HTTP404。首次核查遇到一个Griffith PNG HTTP503，加入仅对暂时性HTTP/network错误的最多3次重试后全部通过。四张640预览合计489930字节，比旧1442018字节少66.0%；未声称相同幅度的网页性能提升。
- **Chrome实际验收 / 证据**：桌面金门大桥/UCLA/Google三个同尺寸插画及中央图注已观察；圆点选NVIDIA，NVIDIA/Google/Griffith三个最终插画及图注正确。实际点击NVIDIA中央链接打开1448×1086 illustrated PNG，再返回。400px仿真观察完整三图、箭头、中央说明，Next从第一张到Google第二张匹配。已关闭仿真及DevTools，保留Light和用户标签。私有任务目录10-5 照片插画统一保存五张Chrome截图、chrome-acceptance.json、online-check.json、部署JSON、提示词、原始备份、选中PNG及预览清单；8项本地素材审查通过。
- **卡在哪 / 下一步**：无实现或上线阻塞。本条是最终验收文档补充，提交push后核对最终Pages状态；图片和已验收页面代码不变。
- **还没验证的 / 要用户定的**：未测真手机触摸、无JS回退、受控性能基准，未跑本地Jekyll；采用真实Pages构建和Chrome。原图拍摄日期地点采用用户提供的信息。无用户待定项。STATUS增量前插、时间戳备份，原章节保留。


## 2026-10-05 11:55 CST (Asia/Shanghai) - 旅行照片统一为动漫插画

- **这次做了什么 / 用户要求**：使用内置imagegen把Google、NVIDIA、Griffith、UCLA四张旅行照转换成金门大桥图的动漫风格，人物全部插画化；统一五张1448×1086、4:3画幅。原始四次生成后，按用户补充的金门大桥原始提示词再次修正NVIDIA/Griffith偏写实面部，共6次内置调用；其余两张经参考图/提示词视觉核对接受。日期和地点保留用户标注。全图PNG和缩略图路径均换为illustrated命名，点击大图也展示插画。
- **现在真实状态 / 实测**：4张最终PNG已保存项目与私有任务目录，8张预览640×480及1280×960；预览quality90，完整PNG与imagegen输出逐字节一致。四张640预览合计489930字节，原有四张1442018字节，减少66.0%；这仅是资源体积比较，不是浏览器性能基准。12个旧JPEG/预览已按SHA256备份在试验工作区10-5 照片插画统一/原始照片，并移出当前发布树；历史Git版本仍保留。金门大桥PNG与6b14db2版本逐字节一致。私有prompt-set.json、revision-prompts.json、selected-images.json、preview-manifest.json及local-review.json保存来源/实际提示词/尺寸/哈希。
- **自审 / 验证**：核对人物非写实、眼镜/发型、实际场景与日夜、横向扩展、全图链接、五图相同比例、日期与alt，以及无JPEG入口。素材核查8项通过；预览helper静态语法、diff检查通过。首次手工抄录Golden Gate旧哈希的检查失败，改为读取此前Git blob直接比较后通过，不计作图像改动。现有Splide、导航、论文图、CSS/JS及版本键不变。Sharp仅生成交付缩略图，所有风格转换均由内置imagegen完成，未用CLI/API备用模式。
- **卡在哪 / 下一步**：无素材阻塞。准备commit/push，等待真实Pages并逐字节核验线上12个新资源，再在Chrome核对五图、中央图注、切换和大图入口。
- **还没验证的 / 要用户定的**：本次Pages发布和Chrome实际显示尚未验证；未跑本地Jekyll、真手机触摸或受控性能基准。场景采用原照，不重新认证用户提供的地点/日期。无用户待定事项。STATUS旧正文已备份并保留。


## 2026-10-05 11:38 CST (Asia/Shanghai) - Splide 照片轮播和清晰圆形箭头上线验收

- **这次做了什么 / 用户决定**：采用现成照片排列示例而非仅引用模糊算法：Splide autoWidth.php 的 splide02，实际引入Splide4.1.4。全文宽轨道、自然比例slide、8px间距、200px高度上限及容器缩放；中央与紧邻两张完整显示，宽屏最外侧仍可露出更远照片的预览。只有中央图注可见、最外端渐进模糊。用户最新指定箭头改为白色圆形+轻阴影+深色chevron，44px点击区。原图和照片数据未改。
- **现在真实状态**：b5dc4cc布局、56f740b箭头，合并远端博客/语言图标后16db8f28e7ac0296fa271004e73af6a664db4411已push，Pages37259766719 build/deploy/report均success；本次8URL均200、20/20线上检查通过。合并仅版本JSON冲突，以两边源码重新生成CSS键dba42cc81651，JS键10c470e9f226；334个远端新增/修改文件及后续语言图标保留。自审、JS语法和diff检查通过；SplideJS/CSS分别29803/1964字节，线上与官方包文件逐字节一致，仅首页加载。
- **Chrome实际验收 / 证据**：桌面完整横图/竖图、相邻图8px、中央图注、窄端模糊与白圆箭头已观察；圆点切到UCLA第五张后Next循环回金门大桥第一张，图片/图注/圆点/状态匹配。400px响应式完整主图及紧邻图、中央说明和箭头已观察并截图。已关闭仿真与DevTools，保留Light、网站核验标签和用户原标签，清理本次额外空白标签。Chrome早期桥接超时/并发取消不计为成功；重置连接并从新状态读取后完成验收。私有splide-online-check.json、vendor清单及Chrome-Splide-desktop.png/Chrome-Splide-400.png在试验工作区10-5 照片样式调整。
- **卡在哪 / 下一步**：无实现或发布阻塞。此条是验收文档补充，提交push后确认最终Pages；资源和已验收代码不变。
- **还没验证 / 用户待定**：真实手机触摸拖动、无JS回退和受控性能基准未测试；未运行本地Jekyll，采用真实Pages。没有承诺消除扩展/网络卡顿。无用户待定事项。STATUS旧正文已时间戳备份并保留。

## 2026-10-05 11:27 CST (Asia/Shanghai) - 采用 Splide 现有照片轮播示例

- **用户要求 / 本次改动**：用户进一步明确要找照片排列方式的现成仓库，并要求邻图靠近、横向铺满正文、不要把邻图截掉一半。读取 Splide 实际照片示例 autoWidth.php 的 splide02（上游8d040f626a0cc21e74254ad03e7d1df4f752fc45），采用 loop / autoWidth / focus:center / drag:free，并启用snap。换用官方npm Splide4.1.4核心，移除Swiper运行时；容器100%正文宽、按原图比例分配slide宽度、图片间距8px，去掉侧图scale造成的空隙。高度上限200px，窄容器预留16px间距后按四分之一宽度缩小，保证中央与最近邻图完整；仅中央图注可见，继续保留外侧8%/48px的局部渐进模糊。
- **我的判断 / 自审**：沿用成熟组件负责拖动、循环克隆与resize，本站只适配比例、图注和既有控件；不开自动播放。原图及photos.yml未变。检查事件索引与原图链接、克隆不进入Tab序列、无JS原生横向行、方向遮罩与箭头位置。包的SHA512 integrity通过，JS29803字节、核心CSS1964字节，保持上游字节及MIT；来源清单和源码在试验工作区10-5 照片样式调整。JS语法检查通过。
- **现在真实状态**：上一轮边缘模糊与中央图注3da0a58、窄化59e6d76均已push，Pages37258551198、37258697098 success；Chrome已观察3da0a58仅中央图注与两端局部模糊。旧线上核验有一条不通过，是检查器未允许CSS自定义属性冒号后的空格，不能写成全部通过。本轮Splide代码与资源待commit/push及真实Pages/线上/Chrome验收。
- **卡在哪 / 下一步**：没有发布阻塞。提交push，等待Pages；核对首页和非照片页的依赖范围、线上资源字节、Chrome桌面及400px的完整邻图、图注、首尾循环和拖动。README已改为实际照片示例，旧STATUS正文已备份保留。
- **未验证 / 用户待定**：本轮Splide布局尚未在浏览器验收，真实手机触控与受控性能基准未测试；不声称消除所有卡顿。无用户待定事项。

## 2026-10-05 11:12 CST (Asia/Shanghai) - 仅外侧边缘模糊、中央照片保留图注

- **用户决定 / 本次改动**：左侧照片只在左边模糊，右侧照片只在右边模糊；中央图保留日期地点图注，侧图不显示图注。读取 motion-primitives ProgressiveBlur 源码，固定上游 120f64f6ca60348e251f929e9c81f11ccbe45eda，按四段梯度蒙版及 270°/90°方向适配静态 CSS。去掉整张侧图 blur/opacity，两端最多12%/72px窄区各3层 backdrop-filter（1/2/3px），pointer-events:none；箭头位于上层。figcaption 仅 swiper-slide-active 可见。保留200/150px、2.2张居中轮播。上游MIT和来源NOTICE保留；没有引入React/Motion运行时。
- **真实状态**：三图初版42d048a已push，Pages37258070743 success；7URL全部200、16线上检查通过，Chrome桌面三图/无图注/Next到Google/圆点到UCLA最终位置已观察。局部边缘模糊14751ae首次push被远端新增3篇博客拒绝；fetch确认博客与本次文件不重叠，将合并保留后重试。中央图注及最新CSS键0f453ca5dc56待提交，JS678a2aca2419不变。
- **自审 / 证据**：遮罩小于侧图可见区，不覆盖中央图；镜像角度正确，无整图模糊/调低透明度；层数固定且不增加JS轮询，初始化前不启用覆盖层。图注visibility随Swiper active class，侧图仍有可访问日期地点。原图和photos.yml不改。源码、许可、哈希清单及备份在试验工作区10-5 照片样式调整；diff检查通过。
- **阻塞 / 下一步**：无内容阻塞。提交图注、合并远端博客、push后真实Pages部署，核对线上边缘样式与Chrome桌面/400px显示和交互。上一条记录的整张侧图模糊与无图注已被用户澄清替代。
- **尚未验证 / 用户待定**：最新边缘模糊和中央图注的线上/浏览器效果待新部署；真手机触摸、无JS回退、性能基准未测试。无用户待定事项。STATUS旧正文已备份，增量前插。

## 2026-10-05 11:04 CST (Asia/Shanghai) - 用户追加三张居中、侧边模糊、移除图注

- **用户要求 / 这次做了什么**：进一步缩小照片，同时显示三张，左右各显示大半张，边缘模糊，下方不放图注；沿用用户要求的GitHub现有实现。实际引入Swiper14.3.0核心JS/CSS（MIT，保持上游字节及LICENSE），按官方demos/130-centered.html配置centeredSlides与2.2 slidesPerView、loop；Swiper核心负责手势/尺寸/循环。样式适配为200/150px高度、600px外宽、侧图blur1.5px/scale.92及左右mask淡出，移除figcaption；日期地点留在数据和可访问名称。点击侧图居中、中央图打开原图，保留箭头/圆点和轨道焦点键盘。仅首页uses_photos加载本地核心，defer顺序明确。
- **真实状态**：上一版无外框3e998f19996b301381cc2920b2534b2619f71321已push，Pages37257357109 success；4URL/15检查通过、Chrome桌面无外框及箭头/照片实际显示已观察。它尚未作为最终交付，此条记录的是用户追加要求后的新改动，待commit/push及验收。
- **自审与源文件证据**：官方npm包14.3.0的SHA512 integrity通过；核心JS66997字节、CSS4369字节，保留MIT许可，vendor清单和参考源码在试验工作区10-5 照片样式调整。自审检查五张照片满足centered loop数量约束、realIndex圆点映射、侧图阻止原图跳转、仅中央链接可Tab访问、reduced-motion速度/样式、无图页面、备用横向滚动行以及200/150px对应100/75px箭头中心。共享JS语法及diff --check通过。原图和photos.yml未改动。
- **卡在哪 / 下一步**：无实现阻塞，准备push、Pages构建、线上HTML/CSS/JS/vendor字节检查和Chrome三图/侧边模糊/无图注/侧图点击/窄屏拖动验收。Chrome中存在并发标签操作和桥接超时，读取新状态后已恢复原生页面操作；失败动作不计为验收。
- **未验证 / 用户待定**：本轮三图版本的浏览器显示和实际拖动尚未验证；未运行本地Jekyll或受控性能基准。没有自动播放或额外全局轮询。无用户待定项；旧STATUS正文已备份并逐字节保留。


## 2026-10-05 10:56 CST (Asia/Shanghai) - 参考现有仓库调整照片展示

- **这次做了什么 / 用户要求**：用户否决照片的大外框，要求查看GitHub已有实现再调整。读取knightnemo/knightnemo.github.io的simple-slider.css/simple-gallery.js、alshedivat/al-folio的项目图片示例和图库示例，以及nolimits4web/swiper的navigation/pagination CSS。我的判断：采用al-folio示例的开放式图片+图注布局、Swiper透明导航和44px点击区域/8px圆点做法，适配当前原生滚动轨道与主题色；去掉照片区域外边框、圆角底板和箭头圆圈，缩短图注空白。桌面300px、手机220px、五张照片和原图链接保留。
- **现在真实状态**：改_sass/site-layout.scss及README参考说明，内容缓存键d300bc9d5d2a；JS仍0dabd5ddf045。参考源码与来源/哈希清单在试验工作区10-5 照片样式调整/参考源码；没有执行下载的示例脚本。自审确认箭头top=150/110对应300/220px图片框，44px点击区与两侧留白匹配；原有focus-visible和切换逻辑保留。diff --check通过，工作区仅本轮CSS/版本/README/STATUS更改。
- **卡在哪 / 下一步**：无实现阻塞。准备commit/push、真实Pages构建及线上CSS/Chrome桌面和窄屏验收。al-folio示例已在Chrome观察到无外层面板的图片排列；本轮页面尚未部署。
- **还没验证的**：实际手机触屏手势、无JS回退和新性能基准未验证；不将参考仓库全部导入或其运行时说成当前网站依赖。只有样式做法沿用，其余交互使用既有轨道。
- **要用户定的**：无。旧STATUS正文已时间戳备份并逐字节保留。


## 2026-10-05 10:51 CST (Asia/Shanghai) - 紧凑照片轮播上线验收完成

- **完成内容 / 用户要求**：移除首页 Education/Research/Publications/Projects/Photos 小导航行；五张照片改为单张横向轮播，左右箭头、位置圆点、键盘左右/Home/End。按用户追加反馈缩小：桌面图片框300px、手机220px、外框最大680px居中；完整比例、日期说明、原图链接保留。照片文件与数据未改动。
- **当前真实状态**：代码4df582b6a78bfb66f84cdb12bd11b4a3a623e29d已push，Pages37256583775 completed/success；初版a2675a5及Pages37256351316也成功。缩小后的3URL均HTTP200，线上五slides/五dots、小导航移除、CSS内容键24fa74aff089与300/220/680几何、JS字节一致性通过。核验JSON与截图在试验工作区10-5 照片横向轮播。
- **Chrome实际验收**：桌面Light观察到完整横图/竖图、对应日期、箭头和圆点；Next到Google第二张、圆点定位UCLA第五张、Previous从第一张循环到第五张均确认。400px仿真观察到完整NVIDIA竖图和说明、第三圆点；轨道键盘焦点已确认，End到第五张，Right从第五张循环到第一张，最终状态和图片匹配。已关闭设备仿真与DevTools，保留用户Light主题和原有标签。
- **自审 / 限制**：源码几何、可访问标签、滚动吸附、循环、按需观察器及无自动播放已自审；JS语法与diff检查通过。跨多张的smooth滚动经过中间照片，验收采用停止后的最终状态。原生UI的横向wheel尝试未触发可观察的换片，不计为手势验收；实际触屏滑动、无JS浏览器回退、性能基准及本地Jekyll未验证。采用真实Pages构建和线上/Chrome检查；不保证所有设备的网络或扩展卡顿消失。
- **卡在哪 / 下一步 / 用户待定**：无发布阻塞、无用户待定项。此条为验收文档补充，页面代码和资源不变；准备单独提交push。STATUS更新已时间戳备份，旧正文逐字节保留。


## 2026-10-05 10:44 CST (Asia/Shanghai) - 按用户反馈缩小照片轮播

- **用户追加要求**：photo区域小一些。我的判断：桌面图片框420→300px，手机300→220px；轮播外框最大680px并居中，箭头随图片中心缩移。保留完整比例、日期说明、五张照片与左右/圆点/手势交互。CSS内容键24fa74aff089，JS保持0dabd5ddf045。
- **当前实测**：初版a2675a5已push，Pages37256351316全部success；4URL/五slides/五dots/两箭头/五caption/小导航移除/CSS/JS字节检查通过。Chrome点击Next实际切到Google第二张、第二圆点高亮，Light桌面完整图与说明已观察。其余交互和缩小后视觉验收待新部署。
- **自审/未验证/下一步**：缩小仅改CSS几何和缓存键，箭头中心与300/220px框匹配，max-width可缩窄。diff --check通过。准备commit/push，然后Chrome核对缩小后桌面/390px、圆点、首尾循环、键盘及滑动。未运行本地Jekyll或性能基准；无用户待定内容。旧STATUS正文已备份并保留。


## 2026-10-05 10:40 CST (Asia/Shanghai) - 首页小导航移除与照片横向轮播

- **这次做了什么**：用户要求删除 Education/Research/Publications/Projects/Photos 小导航行，照片改为参考图所示的横向滑动方式。移除index.md中的section-nav，近期照片改为原生scroll-snap横向轨道，左右箭头、5个位置圆点、轨道键盘左右/Home/End及触屏/触控板滑动；保留日期说明和原图链接。我的判断：完整图片包含在桌面420px、手机300px高的稳定框内，不裁剪；不自动播放、不增加轮播库/计时器/global scroll handler。
- **现在真实状态**：5张照片数据及原图/缩略图未改变；改动仅模板、CSS、JS和首页行。IntersectionObserver跟随滑动同步圆点；无JS时仍可横向滚动。更新CSS/JS内容键16676a3b199c、0dabd5ddf045。自审涵盖水平offset、循环边界、隐藏控件、缩窄布局、reduced-motion、无图页面、可访问标签和保留原图。Node --check与diff --check通过；准备提交push和真实Pages/Chrome验收。
- **卡在哪**：当前Chrome已解锁可访问，上一轮锁屏限制已解除。
- **还没验证的**：真实构建、在线资源与Chrome桌面/390px箭头/圆点/滑动交互尚待确认；未运行本地Jekyll或性能基准。此次没有重新认证日期地点和学术信息。
- **要用户定的**：无。私有证据与备份在试验工作区10-5 照片横向轮播。


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
