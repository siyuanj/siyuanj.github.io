---
layout: post
title: "Nat Comput Sci 2026 | AlignIF: Designing functional RNA with multiple structure alignment, two aptamers outshine the wild type"
date: 2026-10-04
description: "AlignIF inverts the idea of multiple sequence alignment into multiple structure alignment for RNA inverse folding, reaching 0.595 sequence recovery and 30 experimentally functional designs."
tags: [rna design, inverse folding, structure alignment, graph neural networks, aptamers]
lang: en
translation_key: cross_graph_rna_design
---

# Structure-alignment-driven cross-graph modeling for functional RNA design

### Link: [full article](https://doi.org/10.1038/s43588-026-01029-2)

Authors: Shengfan Wang, Jun Wang, Xiaojian Liu, ..., Xiaoyong Pan

Nature Computational Science, August 2026

---
RNA function depends heavily on three-dimensional structure: aptamers bind small molecules through specific folds, and ribozymes rely on precise catalytic centers to self-cleave. RNA inverse folding is the task of designing, for a given target 3D structure, a sequence that folds into it. Most existing methods look at only a single target structure and, limited by the scarcity of RNA structural data, generalize poorly.

A team led by Xiaoyong Pan, Hong-Bin Shen, Junchi Yan and Jie Song at Shanghai Jiao Tong University proposes **AlignIF**, which inverts the idea of 'multiple sequence alignment' from structure prediction and applies it to sequence design: it retrieves similar RNA structures through multiple structure alignment (MStA), learns the conserved geometric rules of a structural family with cross-graph attention, and then generates sequences with a random-order decoder.

The scorecard: a sequence recovery rate of **0.595**, 34% higher than the previous best method gRNAde (0.444); all 23 synthesized fluorescent aptamers were active, and two of the Mango-I designs reached **1.6x and 1.4x** the fluorescence of the wild type; all 7 pistol ribozymes showed detectable self-cleavage activity.

*This article first explains how AlignIF borrows the idea of structure alignment for RNA sequence design, then covers the key computational benchmarks and wet-lab validation results, and finally discusses the boundaries of the method.*

## Part 1: Research Question

RNA inverse folding can be formalized as follows: given a target 3D structure, estimate the probability that each position should be A, U, C or G. The task matters a great deal in RNA engineering, since designing aptamers with specific fluorescence properties, ribozymes with catalytic activity, or riboswitches that act as genetic switches to regulate expression all require inferring sequence from a target structure.

Existing methods such as RDesign, RiboDiffusion, RhoDesign and gRNAde mostly generate sequences from a single target structure. The multistate version of gRNAde can handle multiple conformations, but it usually requires different states of the same RNA as input, and the vast majority of RNAs have no multiple known conformations available.

Another fundamental limitation is the scarcity of RNA 3D structural data. RNA is dynamic and flexible and difficult to solve experimentally, so far fewer 3D structures are available than for proteins. Insufficient data makes deep-learning models prone to overfitting and limits their generalization to RNA folds not seen during training.

**Core idea**

Protein and RNA structure prediction commonly use multiple sequence alignments (MSAs) to extract evolutionary rules from homologous sequences. AlignIF inverts this idea: **it extracts conserved geometric rules from multiple similar 3D structures and uses them to guide sequence design**. Structure prediction infers structure from multiple sequences; AlignIF infers feasible sequences from multiple structures.

## Part 2: Methodology: Inverting multiple sequence alignment into multiple structure alignment

*Figure 1. (a) Dataset construction and splits. (b) Overall workflow: target structure → US-align retrieval of similar structures → MStA feature extraction → cross-graph encoding → sequence generation. (c) The MStA backbone encoder: intra-graph message passing alternates with cross-structure attention. (d–e) Random-order decoding and motif-guided generation.*

The AlignIF workflow has three steps: retrieving and aligning similar structures, cross-graph encoding, and sequence generation.

**Multiple structure alignment (MStA)**: for a given target RNA structure, US-align is used to retrieve similar RNAs with TM-score > 0.45 from a structure library. These structures need not be highly similar in sequence, only close in 3D fold. Their geometric commonalities and differences reveal which local conformations must be conserved, which positions tolerate variation, and which long-range interactions are critical for folding.

**Cross-graph encoding**: each RNA structure is represented as a geometric graph in which nodes are nucleotides, positioned at their C4' atoms, with edges connecting nucleotide pairs within 20 Å. To avoid the influence of global translation and rotation, the authors build a local coordinate system for each nucleotide and extract 6 backbone dihedral angles, a base-orientation angle and 2 sugar-ring conformation angles as node features; edge features include the distances between the P, C4' and base nitrogen atoms as well as the relative rotation between local coordinate systems. Ablation studies show that the newly added sugar-ring angles do help in modeling conformational changes of the RNA sugar ring.

Within each module, the encoder alternates between two operations: **intra-graph message passing** aggregates spatial neighbor information within a single RNA structure, learning local and long-range spatial relationships; **cross-structure attention** exchanges information between corresponding positions aligned by MStA, covering both nodes and edges. This mechanism differs from simply averaging multiple structures: the model can assign different weights to different reference structures. The paper finds that the distribution of attention weights corresponds clearly to the TM-scores of the reference structures, with the model tending to draw more on references that are genuinely similar in structure.

**Random-order decoding**: rather than generating from left to right in a fixed order, AlignIF randomly chooses the nucleotide generation order during training, which reduces reliance on a fixed direction and mitigates overfitting. In practice it supports motif-guided generation: known functional sites (such as the core bases of a G-quadruplex, conserved nucleotides of a catalytic center, or substrate-binding arms) are fixed first, and the model then completes the rest of the sequence under those constraints. This is especially important for designing ribozymes and aptamers.

## Part 3: Key Figure Analysis

### Figure 1: The overall architecture of AlignIF

**What this figure asks:** How does AlignIF use structurally similar RNA templates and cross-graph encoding to guide sequence design?

![Figure 1: Architecture](pic/cross_graph_rna_design/page_2.png){: width="1070" height="670" loading="lazy" decoding="async"}

*Figure 1. The AlignIF architecture. (a) Dataset construction and splits. (b) Target structure → US-align retrieval of similar structures → MStA feature extraction → cross-graph encoding → sequence generation. (c) Intra-graph message passing alternating with cross-structure attention. (d–e) Random-order decoding and motif-guided generation.*

The core idea is to run the 'multiple sequence alignment' of structure prediction in reverse: **extract conserved geometric rules from multiple similar 3D structures and use them to infer sequence** (MStA, multiple structure alignment). For the target structure, US-align retrieves similar RNAs with TM-score > 0.45; these structures need not be similar in sequence, only close in fold.

Each RNA is represented as a geometric graph (nodes are nucleotides, edges connect pairs within 20 Å). The encoder alternates between two things: intra-graph message passing aggregates spatial neighbors, and **cross-structure attention exchanges information between MStA-aligned positions**, assigning larger weights to more similar references (higher TM-score) rather than simply averaging over multiple structures. Decoding uses a random order and supports fixing functional sites first (G-quadruplex core, catalytic center) before completing the rest.

### Figure 2: A large lead in sequence recovery

**What this figure asks:** By how much does AlignIF beat existing methods on sequence recovery and perplexity?

![Figure 2: Recovery rate](pic/cross_graph_rna_design/page_4.png){: width="1070" height="256" loading="lazy" decoding="async"}

*Figure 2. Performance in recovering native sequences. (a) Sequence recovery rate for each method (higher is better). (b) Perplexity (lower is better). AlignIF is best on both the benchmark set and the independent test set.*

The data come from the BGSU RNA 3D Hub, split by clustering at a TM-score of 0.45, plus a strictly separated independent test set. On the benchmark set, AlignIF reaches a **recovery rate of 0.595 and a perplexity of 2.221**, far ahead of gRNAde multistate (0.444/2.692), RDesign (0.364) and RhoDesign (0.263). The version without MStA still reaches 0.574, showing that the gain comes from two sources: the stronger geometric features plus random-order decoding on their own, and the additional boost from MStA (the more similar structures are available, the larger the boost). Macro-F1 is also the highest, indicating balanced prediction across all four bases.

### Figure 3: Designed sequences fold back into the target structure

**What this figure asks:** When the designed sequences are refolded with AlphaFold3, do they fold back into the original target structure?

![Figure 3: Foldability](pic/cross_graph_rna_design/page_5.png){: width="1044" height="1106" loading="lazy" decoding="async"}

*Figure 3. Foldability of designed sequences assessed with AlphaFold3. (a–d) Self-consistency metrics such as scTM, scRMSD, scGDT_TS and scMCC. (e–f) Examples superimposing refolded designed sequences on native structures.*

The designed sequences are fed back into AlphaFold3 for re-prediction and then compared with the original target using self-consistency metrics such as TM-score (scTM). AlignIF has the highest scTM overall. **One key control**: on the riboswitch 8SA3, the AlignIF design has a recovery rate of 0.64 relative to the native sequence and an scTM of 0.76, whereas randomly mutated sequences with the same recovery rate of 0.64 reach an scTM of only 0.25–0.26. This shows that what AlignIF learns is **which combinations of mutations are mutually compatible and can jointly maintain the fold**, rather than merely hitting a recovery number.

### Figure 4: Learning the evolutionary rules of RNA families

**What this figure asks:** Is the model merely copying native sequences, or does it genuinely distinguish conserved sites from variable ones?

![Figure 4: Evolutionary fidelity](pic/cross_graph_rna_design/page_6.png){: width="996" height="1176" loading="lazy" decoding="async"}

*Figure 4. Analysis of evolutionary fidelity. (a–b) Diversity vs recovery rate. (c–d) KL divergence and absolute entropy difference between generated sequences and native homolog distributions. (e) Position-wise comparison of the MSA profile and the AlignIF profile. (f–g) Conserved and variable sites colored on the structure.*

A single target structure usually corresponds to many feasible sequences. Comparing the position-wise base distribution of generated sequences with the MSA distribution of real homologous sequences, AlignIF has **the lowest KL divergence and absolute entropy difference** (panels c/d), and in the profile comparison (panel e) both conserved and variable positions line up. On RNase P and the hammerhead ribozyme, the conserved sites it identifies from 3D structure alone agree with the catalytic sites reported in the literature. Ablations show that removing cross-structure attention on both nodes and edges gives the largest KL divergence: what truly works is passing information between aligned positions, not simple averaging.

### Figure 5: Ablations: every component contributes

**What this figure asks:** How much do cross-structure alignment, random-order decoding and MStA depth each contribute?

![Figure 5: Ablation](pic/cross_graph_rna_design/page_7.png){: width="1000" height="792" loading="lazy" decoding="async"}

*Figure 5. Ablation study. (a) Comparison of variants on perplexity, recovery rate and Macro-F1. (b–e) Per-sample comparisons and individual metrics. (f) Effect of MStA depth. (g–h) Correspondence between attention maps and TM-score.*

Removing the alignment (without alignment) makes all three metrics clearly worse (rightmost in panel a); fixed-order decoding and removing node or edge alignment each cause declines as well. **Panel f**: **the greater the MStA depth, the higher the recovery rate and the lower the perplexity**. **Panels g/h**: attention weights correspond clearly to the TM-scores of the reference structures, so the model does draw more on genuinely similar references. Replacing the real MStA with randomly Gaussian-perturbed structures does not reproduce the same gains, proving that the benefit comes from physically plausible conformational variation within real structural families.

### Figure 6: Wet-lab validation: fluorescent aptamers brighter than the wild type

**What this figure asks:** Can the designed Mango-I aptamer variants fluoresce more brightly than the wild type in experiments? Are the ribozymes active?

![Figure 6: Experimental validation](pic/cross_graph_rna_design/page_8.png){: width="1070" height="400" loading="lazy" decoding="async"}

*Figure 6. Experimental validation of AlignIF-generated fluorescent light-up RNA aptamers and pistol ribozymes. (a–b) Aptamer sequence logos. (c–e) Sequence logo, relative fluorescence and fluorescence imaging for the Mango-I designs. (f) Ribozyme self-cleavage activity.*

**Aptamers**: all 13 iMango-III designs (sequence identity 30%–73%) were fluorescently active, including the one with only 30% identity, showing that the model learned structural constraints rather than copying sequences. All 10 Mango-I designs were active, with **aptamer 1 reaching about 1.6x and aptamer 2 about 1.4x the fluorescence of the wild type** (panels d/e). The two brightest designs actually have higher Kd values, but their maximum fluorescence capacity Bmax is about 2x that of the wild type, and circular dichroism shows their G-quadruplex folds are more stable.

**Ribozymes**: for the pistol ribozyme, motif-guided design fixed the substrate-binding arms and G40/G42 and produced 7 sequences (no pistol ribozyme appears in the training set); **all 7 showed detectable self-cleavage activity**, with the best one, pistol 1, reaching a kobs about 11% that of the wild type. Across all three experimental groups, all 30 synthesized sequences showed the expected function without any post-design filtering.

## Part 4: Key Contributions

The contributions of this work can be summarized in three points.

**Turning 'multiple sequence alignment' into 'multiple structure alignment'.** Structure prediction infers structure from multiple homologous sequences; AlignIF infers feasible sequences from multiple similar 3D structures (MStA), which neatly sidesteps the bottleneck of scarce RNA 3D structural data and the tendency of single-structure methods to overfit. Cross-structure attention, which passes information between aligned positions and weights references by TM-score, is the key source of performance.

**A clean sweep of the computational metrics.** The sequence recovery rate of **0.595 is about 34% higher than the previous best, gRNAde (0.444)**, and perplexity, Macro-F1, self-consistent refolding and distributional agreement with native MSAs are all best in class; what the model learns is 'which combinations of mutations can jointly maintain the fold', not how to inflate a recovery number.

**Strong wet-lab validation.** Without any post-design filtering, **all 30 synthesized candidates showed the expected function**: 13 iMango-III and 10 Mango-I aptamers were all fluorescent (two of them 1.4–1.6x brighter than the wild type), and all 7 pistol ribozymes self-cleaved. This is far more convincing than validation based on computational metrics alone.

## Part 5: Limitations and Outlook

**No general way to rank candidates.** AlignIF generates a high proportion of functional sequences but cannot reliably tell which one will be the most active. The authors retrospectively examined metrics such as average log probability, AlphaFold3 scTM, secondary-structure scMCC and RibonanzaNet scMCC, and found that their relationship with experimental activity varies by target, so no ranking criterion general across RNA types has been found yet. For now AlignIF is better at answering 'which sequences are structurally plausible' than at reliably answering 'which sequence will definitely have the highest activity'.

**Mainly dependent on static structures.** RNA function often depends on conformational transitions, state changes before and after ligand binding, and catalytic intermediates, whereas AlignIF currently takes only static 3D structures as input. This may be why aptamer design works well while the ribozymes retain function but remain weaker than the wild type.

**MStA brings memory overhead.** The memory required by cross-graph attention grows with the number of reference structures. The authors suggest mitigating this by dropping low-TM-score references or distilling the encoder.

**Structural similarity does not equal functional similarity.** MStA screens structures by TM-score, and a similar overall fold is usually valuable, but small differences at a local active center may matter more than the global TM-score. In the future, additional information such as sequence MSAs, SHAPE chemical probing data, ligand and ion environments, cryo-EM density and even dynamic conformational ensembles could be incorporated to further improve design quality.

## About the Corresponding Authors

**Xiaoyong Pan** is a professor in the School of Electronic Information and Electrical Engineering at Shanghai Jiao Tong University; he received his bachelor's degree from Central South University and his PhD from City University of Hong Kong, and works mainly on bioinformatics and applications of deep learning in RNA biology. **Hong-Bin Shen** is a professor in the Department of Automation at Shanghai Jiao Tong University, working on bioinformatics and pattern recognition. **Junchi Yan** is a professor in the Department of Computer Science and Engineering at Shanghai Jiao Tong University, with research spanning graph learning and combinatorial optimization. **Jie Song** is a professor in the College of Computer Science and Technology at Zhejiang University, with research interests including machine learning and multimedia intelligence. The four corresponding authors support AlignIF's interdisciplinary method design from the four angles of bioinformatics, pattern recognition, graph learning and machine learning.

## Citation

Wang, S., Wang, J., Liu, X., Zhu, W., Huang, J., Xue, Y., ... & Pan, X. (2026). Structure-alignment-driven cross-graph modeling for functional RNA design. Nature Computational Science, 6(8), 826-841. https://doi.org/10.1038/s43588-026-01029-2
