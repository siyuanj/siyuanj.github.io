---
layout: post
title: "ICML 2026 | SwitchCraft：用可编程约束设计多状态蛋白开关"
date: 2026-09-05
description: "天然蛋白的核心魅力不在于\"能折成一个结构\"，而在于能在不同条件下切换状态——配体结合后打开活性位点、不同信号分子引发不同构象、酶在催化循环中经历多个中间态。"
tags: [protein design, multistate design, allostery, biosensors, differentiable optimization]
lang: zh
translation_key: switchcraft_state_switching
---

# SwitchCraft: A Programmatic Framework for Designing State-Switching Proteins

### 原文链接：[全文](https://doi.org/10.48550/arXiv.2605.31236)

作者：Bowen Jing, Mihir Bafna, Anisha Parsan, ..., Bonnie Berger

ICML 2026，2026 年

---
**导读**

天然蛋白的核心魅力不在于"能折成一个结构"，而在于**能在不同条件下切换状态**——配体结合后打开活性位点、不同信号分子引发不同构象、酶在催化循环中经历多个中间态。然而，主流蛋白设计方法几乎全部面向单一静态结构，无法指定这种多状态切换行为。

MIT Bonnie Berger 团队提出 **SwitchCraft**，首个面向多状态蛋白设计的通用可编程框架。它将功能需求写成"状态 + 约束"的可组合程序，通过对结构预测模型 Boltz-1 反向传播来优化序列，使同一条蛋白在不同分子环境下满足不同的结构与功能要求。论文在六类功能原语上验证了框架的通用性，并展示了 de novo 荧光生物传感器设计流程。

## 一、研究问题

当前蛋白设计有两条主流路线：

**蛋白语言模型（PLMs）**能生成新序列并继承天然蛋白家族功能，但条件控制粗糙——通常只能靠 family label 或 GO term，很难指定"在 A 条件下是状态 1，在 B 条件下切换到状态 2"这种细粒度功能机制。

**结构生成方法**（diffusion、flow matching、或通过结构预测模型反向优化序列）擅长设计 binder 和 motif scaffold，但本质上面向单一静态结构，难以表达配体依赖构象变化、状态依赖结合、变构开关等天然蛋白中常见的多状态行为。

SwitchCraft 要回答的核心问题是：**能否构建一个通用框架，把"多状态蛋白功能"直接写成程序化约束，然后自动设计出满足这些约束的蛋白序列？**

## 二、方法核心：把蛋白功能设计变成"写程序"

SwitchCraft 的核心思想可以这样理解：

像训练神经网络一样优化蛋白序列——只不过这里的**"参数"**是待设计蛋白的序列 logits，**"数据"**是多状态设计规范，**"损失函数"**是你希望蛋白在各状态满足的结构与结合要求。

**这张图想回答：**SwitchCraft 如何让同一条蛋白序列在多个状态下同时折叠和优化？

![](pic/switchcraft_state_switching/page_2.png){: width="1104" height="540" loading="lazy" decoding="async"}

*Figure 1｜SwitchCraft 框架总览：同一序列在多个 state 下共折叠，计算各 state 的 loss 后联合优化*

具体地，一个多状态设计任务由以下元素定义：

**多个状态（states）：**每个状态对应一个 folding context，即该状态下固定存在的分子环境。例如：状态 A 为蛋白单独存在，状态 B 为蛋白 + 小分子 OQO，状态 C 为蛋白 + Ca²⁺。

**可组合的损失函数：**论文定义了四种核心 loss，每种都可以取"正"或"反"方向：

**Motif Loss**：让蛋白在某状态下准确 scaffold 一个功能 motif，基于 Boltz-1 distogram 输出计算 motif 残基对的距离误差。**Anti-Motif Loss = −0.5 × Motif Loss**，反向鼓励 motif 被破坏。

**Binding Loss**：让蛋白在某状态下结合配体，评价蛋白-配体接触的置信度和概率。**Anti-Binding Loss** 则要求不结合。

**Conformational Change Loss**：用 Jensen-Shannon divergence 衡量两个状态间 distogram 差异，**要求同一序列在不同状态下内部几何关系显著不同**——这是实现状态切换的关键。

**Contact Loss**：保证每个状态的结构本身紧致可信，作为所有设计任务的默认正则项。

序列优化采用 straight-through estimator（STE）处理 argmax 不可导的问题，并通过四阶段 schedule（共 240 步）从连续探索逐步收敛到离散序列：前 30 步 soft 优化快速探索，中间 200 步分两段：先以 τ=0.5 保持 100 步，再把温度从 0.5 逐渐降到 0.005，使分布尖锐化，最后 10 步用 hard 序列收尾。

## 三、看图说话

SwitchCraft 最重要的不是某个单一任务，而是**组合性**——不同任务都可以写成 loss 的程序组合。Figure 2 展示了六种功能原语：

**这张图想回答：**SwitchCraft 支持的六种功能原语分别描述了什么样的状态切换行为？

![](pic/switchcraft_state_switching/page_5.png){: width="1104" height="860" loading="lazy" decoding="async"}

*Figure 2｜SwitchCraft 支持的六种功能原语，每种都由"状态 + loss 组合"定义*

**① 正向变构（Positive Allostery）：**无配体时 motif 被破坏，配体结合后 motif 恢复正确几何——经典的变构激活。

**② 负向变构（Negative Allostery）：**反过来，无配体时功能 motif 正常，配体结合后 motif 被扰乱——变构抑制。

**③ Motif Switching：**配体使蛋白从 motif A 切到 motif B。需要同时满足四个条件（两个 motif 各有 on/off），比普通变构更难。

**④ Induced Binding：**只有在 effector 存在时，蛋白才与目标分子结合——条件性相互作用。

**⑤ Ligand Modification：**感知同一配体的不同化学状态（如 heme vs oxygenated heme），让化学修饰驱动构象变化。

**⑥ Ligand Discrimination：**三态开关——不同配体（OQO vs Ca²⁺）对应不同构象，实现多输入多状态响应。

这六种任务的关键在于**正约束 + 负约束 + 跨状态约束的组合**。只有正约束容易得到"两个状态都行"的非特异解；加入负约束（Anti-Motif / Anti-Binding）才真正产生"状态切换"；再加 ConfChangeLoss 防止模型找到"结构几乎相同但都满足约束"的偷懒解。

## 四、核心贡献总结

**正/负变构（最系统的 benchmark）：**

作者对 24 个 RFDiffusion benchmark motifs × 5 种配体（OQO、FAD、Zn²⁺、Mg²⁺、dsDNA）做系统性设计，每组生成 100 条序列。成功标准要求目标状态 motif RMSD ≤ 1 Å、非目标状态 motif RMSD > 1 Å、同一状态内 5 次预测一致（标准差 ≤ 0.5 Å）。最终 24 个 motif 中有 **11 个至少出现一个成功设计**，部分案例的状态切换导致 motif RMSD 从 0.5 Å 变到 6–8 Å 以上。

**这张图想回答：**正向和负向变构设计中，motif 区域在不同配体状态下的开/关切换幅度有多大？

![](pic/switchcraft_state_switching/page_6.png){: width="1104" height="740" loading="lazy" decoding="async"}

*Figure 3｜正向/负向变构设计示例：motif（青色）在不同配体状态下的开/关切换*

**更复杂的功能原语：**

**这张图想回答：**Motif switching、配体修饰和诱导结合这几种高级功能的设计成功率如何？

![](pic/switchcraft_state_switching/page_7.png){: width="1104" height="750" loading="lazy" decoding="async"}

*Figure 4｜Motif switching、ligand modification、induced binding 和 ligand discrimination 的代表案例*

**Motif Switching：**100 个设计中 3 个实现了两种 motif 的完整互换切换。

**Ligand Modification：**558 个设计中 10 个成功，代表案例中氧分子进入后诱导 3.8 Å 构象变化，类似血红蛋白的氧结合协同效应。

**Induced Binding：**940 个设计中 8 个成功。展示案例中，无 Ca²⁺ 时 ipTM = 0.12（不结合），有 Ca²⁺ 时 ipTM = 0.88（强结合），构象变化达 **12.5 Å**。

**Ligand Discrimination：**465 个设计中 12 个实现三态区分。代表案例中关键 loop 在三个状态分别形成盐桥（unbound）、疏水口袋（OQO-bound）和钙配位位点（Ca²⁺-bound），任意两态 RMSD > 1.4 Å，各态内部预测一致。

### 从原语到应用：De novo 荧光生物传感器设计

论文最"应用导向"的部分是 cpGFP-based 荧光生物传感器设计流程。思路是：先用 SwitchCraft 设计一个对任意小分子响应的**构象开关蛋白（confswitcher）**，再插入 circularly-permuted GFP。配体结合引起构象变化，改变 chromophore 周围环境，从而调控荧光信号。

**这张图想回答：**De novo 荧光生物传感器的设计验证——计算预测的开/关比与实验值一致吗？

![](pic/switchcraft_state_switching/page_8.png){: width="1104" height="710" loading="lazy" decoding="async"}

*Figure 5｜生物传感器设计流程：(A) 原理示意，(B) 已知 nicotine biosensor 的真实机制，(C) SwitchCraft 设计的 SAM biosensor*

作者为 SAM、cGMP、ATP 三种小分子设计 confswitcher，共生成 **13,858** 个序列（长度 150–200 aa）。经过严格筛选（effector iPTM > 0.8、intraRMSD ≤ 1.5 Å、pLDDT > 0.8、crossRMSD > 3 Å、回旋半径 ≤ 22 Å），**89 个**通过。

在这些 confswitcher 的构象变化最大位点插入 cpGFP 后，**44 个**通过 chromophore 调控筛选。其中一个 SAM biosensor 展现出与已知 nicotine biosensor 非常类似的"去淬灭"机制：**apo 态中 Glu74 接触 chromophore 抑制荧光，配体结合后 Glu74 移开约 14.7 Å，理论上可恢复荧光。**

### 验证与对照

论文的验证体系值得关注，采用了四层证据：

**与 RFD3 + TiedMPNN 基线对比：**作者构造了一个由 RFDiffusion3 生成结构 + TiedMPNN 进行多状态序列设计的 baseline。SwitchCraft 成功数显著更高，例如 FAD + 6e6r_med 组合中 SwitchCraft 成功 17 个，baseline 为 0。核心原因是不同状态结构不兼容时，tied inverse folding logits 会互相污染。

**消融实验：**去掉 AntiMotifLoss 后成功率明显下降（如 OQO + 3IXT 从 5 降到 1），证明**状态切换不是自然顺带出现的，必须用负约束显式监督**。

**交叉筛查：**用 positive allostery 目标设计的序列中正变构出现 259 次、负变构仅 22 次（fold change 3.01×，p = 2.9×10⁻²¹），反过来也成立，说明 loss 目标确实在驱动期望行为。

**初步湿实验验证：**附录报告了锌诱导的 PD-L1 binders——无 Zn²⁺ 时不结合，加 Zn²⁺ 后检测到结合，部分 Kd 达亚微摩尔级（746 nM）。虽然样本量小，但说明至少部分设计在真实体系中表现出了条件性结合。

## 五、局限与展望

**几乎全部核心结论仍是 in silico：**论文证明的是"在 Boltz-1 的预测世界里，这些多状态设计可以实现"。真实蛋白能否稳定表达、正确折叠、可逆切换、具有合适的热力学/动力学平衡，尚未系统验证。

**动力学与路径可达性未被约束：**两态都低能/可预测，不代表蛋白能从状态 A 自然切到状态 B。部分设计可能需要先完全解折叠再重新结合，作者在 ligand modification 部分也承认存在"看起来需要解离再重绑"的不现实路径。

**绝对成功率仍较低：**motif switching 3/100、induced binding 8/940、ligand discrimination 12/465。框架已证明可行性，但距离高通量可靠工程化还有距离。

**对结构预测模型高度依赖：**整个框架优化的是"让 Boltz-1 相信这个机制成立"，而 Boltz-1 在某些 ligand、离子、DNA 界面上的建模偏差可能误导设计。

总体而言，SwitchCraft 是一篇**开创范式的 framework paper**。它最重要的贡献是提出了一种新的问题表述——蛋白功能设计可以通过"多状态 + 可组合约束 + 可微优化"来实现，把蛋白设计从"画一个静态结构"推进到"编写一个分子机制"。未来最值得关注的方向包括：引入能量景观/动力学约束、扩展到原子级功能位点约束、以及实现 AND/OR/NOT 分子逻辑门等更复杂逻辑。

## 通讯作者介绍

本文通讯作者为 Bowen Jing、Mihir Bafna 和 Bonnie Berger，均来自麻省理工学院（MIT）。Bonnie Berger 是 MIT 数学系 Simons Professor，同时在 CSAIL（计算机科学与人工智能实验室）领导 Computation and Biology 研究组。她在计算生物学和生物信息学领域有超过三十年的研究经验，长期关注序列分析、基因组隐私、单细胞数据分析等方向，是计算生物学领域最具影响力的学者之一。Bowen Jing 是 MIT CSAIL 博士生，研究方向为几何深度学习与蛋白质设计，此前在蛋白结构预测与生成模型方面有多项代表性工作（如 ProDiT）。Mihir Bafna 同为 MIT CSAIL 博士生，与 Jing 并列第一作者。本文的合作者还包括 UT Austin 计算机系的 Adam Klivans 教授和 MIT 生物工程系的 Bryan Bryson 教授。

## 引用

Jing, B., Bafna, M., Parsan, A., Ni, H. M., Kwabi-Addo, D., Bryson, B., ... & Berger, B. (2026). SwitchCraft: A Programmatic Framework for Designing State-Switching Proteins. ICML 2026. https://doi.org/10.48550/arXiv.2605.31236
