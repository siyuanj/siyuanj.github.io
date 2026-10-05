---
layout: post
title: "bioRxiv 2026 | FlashBind: A Virtual Screening Model 50x Faster than Boltz-2"
date: 2026-08-30
description: "FlashBind decouples virtual screening into fast docking plus lightweight E(3)-equivariant geometric scoring, achieving 50x speedup over Boltz-2 with comparable enrichment and prospective wet-lab validation."
tags: [virtual screening, molecular docking, equivariant neural networks, drug discovery, antibiotic discovery]
lang: en
translation_key: flashbind_virtual_screening
---

# FlashBind: Towards Accurate and Efficient Structure-based Virtual Screening

### Link: [full article](https://doi.org/10.64898/2025.12.22.695983)

Authors: Songlin Jiang, Yifan Chen, Aarti Krishnan, Yu Zhang, Wengong Jin

bioRxiv, April 8, 2026

---
Foundation models like Boltz-2 achieve high accuracy in protein-ligand binding prediction, but processing a single complex takes approximately **35 seconds** — for industrial-scale virtual screening against compound libraries of millions or even billions of molecules, this speed is entirely impractical.

Wengong Jin's team at Northeastern University proposed **FlashBind**: replacing expensive diffusion sampling with the fast docking model FABind+ and substituting PairFormer with a lightweight E(3)-equivariant graph neural network (EGNN), **boosting inference speed by 50x (0.7s/complex)** while achieving early enrichment performance close to Boltz-2 on standard virtual screening benchmarks. More importantly, they used this model for a real prospective antibiotic screening campaign, **experimentally validating 10 active molecules in wet-lab assays**.

## Part 1: Research Question

The core task of structure-based virtual screening (SBVS) is: given a protein target and a compound library, predict which small molecules can bind the target, thereby prioritizing true hits from a vast pool of candidates. This field faces a **classic dilemma**:

**Traditional docking methods: fast but insufficiently accurate**

Methods like AutoDock Vina, GNINA, and Glide are physics-based and structure-driven, but their scoring functions have limited accuracy and poor cross-target generalizability. Facing the reality of a chemical space exceeding 10<sup>60</sup> drug-like molecules, their screening efficiency still falls short.

**Foundation models: accurate but too slow**

Boltz-2 has set a new accuracy benchmark for binding affinity prediction, but it relies on expensive diffusion sampling (~20s), deep PairFormer representations (~13s), and final scoring (~2s), **taking approximately 35 seconds to process a single complex**. Screening a million-compound library would require hundreds of GPU-days, and a billion-scale library would be astronomically costly.

The core question posed by the authors: **Can we retain the prediction accuracy of foundation models while accelerating inference to levels suitable for industrial-scale screening?**

## Part 2: Methodology

FlashBind's core strategy is straightforward: **replace every expensive module in Boltz-2 with a lighter counterpart** while maintaining prediction quality. Specifically, it decouples the virtual screening pipeline into two stages:

**Stage 1: Fast structure generation (~670ms)**

**FABind+** (a regression-based fast docking model) replaces the 20-second diffusion sampling in Boltz-2. FABind+ directly predicts the ligand's 3D coordinates within the pocket, generating a **'good enough' structural prior**.

Protein structures are sourced by priority: PDB experimental structures → AlphaFold DB predicted structures → Boltz-2x de novo prediction. The authors found that over 60% of targets can be sourced directly from the first two.

**Stage 2: Lightweight geometric scoring (~25ms)**

A **5-layer EGNN (E(3)-equivariant graph neural network)** replaces the trunk + PairFormer module in Boltz-2, which takes 15 seconds. EGNN directly processes 3D geometric structures, inherently satisfying rotation and translation invariance, and focuses on capturing local physical interactions within the binding pocket.

Docked structures first undergo **pocket cropping** (20 Å around the ligand, up to 2048 atoms / 512 residues), then a multi-relational geometric graph is constructed: internal edges (covalent bonds, sequential connections), external edges (protein-ligand contacts &lt;10 Å), and auxiliary edges (global virtual nodes), followed by mean pooling + MLP to output binding probability.

**Data curation: more important than blindly scaling up**

Starting from PubChem BioAssays high-throughput screening data, the authors designed a rigorous multi-stage filtering pipeline: assay consistency checks (>100 compounds, hit rate &lt;10%) → merging and deduplication by UniProt ID → **secondary confirmation mechanism** (retaining only active labels supported by quantitative evidence such as Ki/Kd/IC50) → PAINS compound removal → 1:9 positive-to-negative sample balancing.

The final training set contains **approximately 2.2 million** protein-ligand pairs, covering 451 protein targets and 368,812 ligands.

In summary, FlashBind's formula is: **fast docking provides structural priors → lightweight EGNN performs geometric scoring → rigorous data curation ensures training quality**.

## Part 3: Key Figure Analysis

### Figure 1: Efficiency-Accuracy Pareto Frontier

**What this figure asks:** Where does FlashBind sit on the efficiency-accuracy tradeoff?

![Figure 1: Efficiency vs. Accuracy Pareto Frontier](pic/flashbind_virtual_screening/page_2.png){: width="1110" height="452" loading="lazy" decoding="async"}

*Figure 1. (a) Efficiency-accuracy scatter plot on the MF-PCBA virtual screening benchmark. (b) Efficiency-accuracy scatter plot on the antibiotic screening benchmark. Star markers indicate FlashBind.*

**How to read this figure**

* **Panel a** (MF-PCBA): The x-axis is inference time (log scale), and the y-axis is EF@1% (enrichment factor at the top 1%). FlashBind (star) sits in the **optimal region of the Pareto frontier** — achieving EF@1% = 14.13 at 0.7 seconds, nearly matching Boltz-2's 13.95 while being 50x faster. Traditional methods (Vina, GNINA, Chemgauss4) cluster in the lower-right low-performance region.
* **Panel b** (antibiotic benchmark): FlashBind is not only fast but also far surpasses all baselines in AUROC. Notably, Boltz-2 drops to around 0.45 on this task (near random), while FlashBind achieves **0.710**.

**Takeaway:** FlashBind is currently the only method that **simultaneously pushes beyond the Pareto frontier** — achieving both faster speed and higher accuracy than all baselines across both benchmarks.

### Figure 2: FlashBind Framework Overview

**What this figure asks:** What do FlashBind's data pipeline and model architecture look like?

![Figure 2: FlashBind framework](pic/flashbind_virtual_screening/page_3.png){: width="1154" height="1036" loading="lazy" decoding="async"}

*Figure 2. (a) Training data curation pipeline: starting from PubChem HTS data, passing through assay filtering, secondary confirmation, and PAINS removal, yielding approximately 2.2 million high-quality protein-ligand training pairs. (b) Model architecture: input undergoes structure preprocessing → pocket cropping → multi-relational graph construction → 5-layer EGNN → task-specific prediction heads.*

**How to read this figure**

* **Panel a** (data curation): The complete data filtering pipeline is shown from left to right. Note the 'Secondary Confirmation' step in the middle — it requires that active labels be supported by quantitative evidence (Ki/Kd/IC50), and **conflicting data without quantitative support are directly discarded**. The final positive-to-negative sample ratio is 1:9, totaling approximately 2.2 million pairs.
* **Panel b** (model architecture): The left side shows input processing — if no pre-existing complex structure is available, FABind+ generates a docked conformation. The middle shows graph construction — protein features come from the ESM-3 language model, ligand features from torchdrug/RDKit, plus multiple edge types (internal/external/auxiliary). The right side shows the core encoder — a 5-layer EGNN with hidden dim 192, followed by mean pooling and then either a classification head (binary) or a regression head (affinity prediction).

**Takeaway:** FlashBind's design philosophy is **'data quality + structural decoupling + lightweight encoding.'** Rather than pursuing the ultimate accuracy of end-to-end modeling, it ensures reliable training signals through rigorous data curation, inference efficiency through the decoupled design of fast docking + lightweight scoring, and physical plausibility through E(3) equivariance.

### Figure 3: Virtual Screening Performance and Inference Time Breakdown

**What this figure asks:** How good is FlashBind's screening accuracy? How much does each design decision contribute? Where do the speed gains come from?

![Figure 3: MF-PCBA results and ablation](pic/flashbind_virtual_screening/page_5.png){: width="1136" height="530" loading="lazy" decoding="async"}

*Figure 3. (a) EF curves on the full MF-PCBA set. (b) Ablation study. (c) Comparison with traditional docking methods. (d) Per-module inference time breakdown.*

**How to read this figure**

* **Panel a** (main results): FlashBind closely matches Boltz-2 across the entire EF@0.5%–5% range, significantly outperforming BACPI, GAT, Chemgauss4, and Boltz-2 iptm. At the most critical metric, **EF@1% = 14.13**, it slightly exceeds Boltz-2's 13.95.
* **Panel b** (ablation study): Three key findings — (1) Replacing Boltz-2's diffusion sampling with FABind+ structures causes almost no performance drop (EF@1%: 11.12 vs 10.45), indicating that **high-precision conformational sampling is not necessary for hit identification**; (2) Replacing PairFormer with EGNN actually improves performance (12.05 vs 11.12); (3) Using general-purpose ESM-3 features instead of Boltz-2 trunk representations further boosts performance (12.85 vs 12.05), **completely eliminating dependence on the foundation model**.
* **Panel d** (time breakdown): Boltz-2's 35 seconds are dominated by three components — diffusion 20s, trunk 13s, PairFormer 2s. FlashBind replaces diffusion with FABind+ (670ms), trunk with ESM-3/torchdrug (~2ms), and PairFormer with EGNN (25ms), for a **total of approximately 0.7 seconds — a 50x speedup**. If the pose is already available, scoring alone takes just 25ms, enabling evaluation of 140,000+ complexes per GPU-hour.

**Takeaway:** The ablation study is the most compelling part of this paper. It systematically demonstrates the authors' core argument — **for early hit identification in virtual screening, neither expensive diffusion-based structure generation nor heavy attention modules are necessary**. A well-designed lightweight EGNN coupled with fast docking priors is sufficient.

### Figure 4: Enzyme-Substrate Specificity Prediction

**What this figure asks:** Can the geometric representations learned by FlashBind generalize to tasks beyond virtual screening?

![Figure 4: ESIBank enzyme-substrate specificity](pic/flashbind_virtual_screening/page_6.png){: width="1136" height="476" loading="lazy" decoding="async"}

*Figure 4. (a) Overall AUROC under the 'unknown enzyme + unknown substrate' setting in ESIBank. (b) Performance across different enzyme families (radar plot).*

**How to read this figure**

* **Panel a**: Under the most challenging 'unknown enzyme & substrate' setting (4-fold CV), FlashBind achieves **AUROC = 0.7229**, essentially matching EZSpecificity (0.7198), a SOTA model specifically designed for this task, and significantly outperforming the sequence baseline ESP (0.6523).
* **Panel b** (radar plot): Across five enzyme families — DUF (domains of unknown function), Glycosyltransferase, Thiolase, Phosphatase, and Esterase — FlashBind consistently outperforms Boltz-2 and matches EZSpecificity. It is particularly strong on the **data-scarce DUF family**, suggesting that geometric features transfer better to unseen enzymes.

**Takeaway:** A general-purpose geometric encoder matches a purpose-built architecture on the fine-grained functional prediction task of enzyme-substrate specificity — indicating that FlashBind's learned geometric representations **possess cross-task transferability**. It should be noted that for this task the authors additionally incorporated UniMol embeddings and Morgan fingerprints, rather than relying entirely on the native framework.

### Figure 5: Antibiotic Discovery Benchmark

**What this figure asks:** How does FlashBind perform on real-world antibiotic target screening tasks?

![Figure 5: Antibiotic discovery benchmark](pic/flashbind_virtual_screening/page_7.png){: width="1136" height="1168" loading="lazy" decoding="async"}

*Figure 5. (a) Mean AUROC across 12 essential E. coli targets. (b) ROC curves for each target, with FlashBind's AUROC shown in parentheses.*

**How to read this figure**

* **Panel a** (overall AUROC): **FlashBind leads all methods by a wide margin at 0.710**. The most striking comparison is that Boltz-2 achieves only 0.45–0.46 on this benchmark (near random guessing), and AutoDock Vina only 0.48. Traditional rescoring methods (Vina + RF-Score/RF-Score-VS) reach 0.62–0.63 but remain well below FlashBind.
* **Panel b** (per-target ROC): FlashBind's ROC curves are significantly above those of Boltz-2 and the random baseline for 11 out of 12 targets. The best-performing targets include **glmU (0.90)**, murF (0.84), dnaG (0.81), and gmk (0.80). gyrAB is the only target with weak performance (0.46), possibly related to its unusual binding mechanism.

**Takeaway:** These results reveal a blind spot of foundation models — **Boltz-2 may suffer from negative transfer**: its training distribution is biased toward common targets and stable complexes, and when transferred to bacterial targets, the learned statistical patterns actually become counterproductive. FlashBind relies on universal physical-geometric features, making it more robust on out-of-distribution targets.

### Figure 6: Prospective Wet-Lab Validation

**What this figure asks:** Can FlashBind's predictions actually identify active molecules in real experiments?

![Figure 6: Prospective wet-lab validation](pic/flashbind_virtual_screening/page_9.png){: width="1136" height="800" loading="lazy" decoding="async"}

*Figure 6. (a) FlashBind prediction score ranking for 136 candidate compounds and experimental validation results. (b) Inhibitory activity details for the 10 confirmed hits. (c) Chemical structures of the 10 hits.*

**How to read this figure**

* **Panel a** (screening ranking plot): The authors scored 9,289 molecules from the Broad Institute compound library using FlashBind, then selected 136 diverse candidates after removing PAINS and redundant scaffolds (Tanimoto similarity &lt;0.5). Two independent replicates were tested at 100 μM, with >50% DnaG inhibition considered active. Green dots mark the **10 confirmed hits**, for a hit rate of 7.4% — these hits are clearly concentrated in the high-ranking region, demonstrating that FlashBind provides effective enrichment.
* **Panel b** (activity details): The 10 hits each show three metrics: EC inhibition (compound alone), EC+PMB inhibition (with membrane permeabilizer), and DnaG inhibition. Among them, **4 compounds also demonstrated strong antibacterial activity in whole-cell assays** (EC+PMB inhibition ≥ 50%), indicating that they can penetrate the cell membrane and inhibit E. coli growth.
* **Panel c** (chemical structures): The 10 hits span diverse chemical scaffolds — including heterocyclic, aromatic amine, and amide classes among others — indicating that FlashBind captures genuine binding signals and **has not overfit to any particular scaffold type**.

**Takeaway:** This is the most impactful evidence in the entire paper. Many virtual screening papers stop at benchmark scoring, but FlashBind achieves a **complete prospective experimental closed loop** — from computational screening to target inhibition to whole-cell antibacterial activity. A 7.4% hit rate is quite respectable for prospective screening, and the 4 molecules with whole-cell activity further demonstrate that the model has truly learned signals of drug discovery value.

## Part 4: Key Contributions

### Cross-task Benchmark Summary

| Task | Metric | FlashBind | Boltz-2 | Speed |
|---|---|---|---|---|
| Virtual screening (MF-PCBA) | EF@1% | **14.13** | 13.95 | **50x speedup** |
| Virtual screening (MF-PCBA) | AUROC | 0.7826 | 0.8056 | - |
| Enzyme-substrate specificity (ESIBank) | AUROC | **0.7229** | ~0.69\* | - |
| Antibiotic screening (E. coli) | Mean AUROC | **0.710** | 0.45 | - |
| Affinity prediction (CASP16) | Kendall τ | **0.51** | 0.45 | - |
| Prospective validation (DnaG) | Hit rate | **10/136 (7.4%)** | - | - |

*\* Boltz-2's exact value on ESIBank was visually estimated from the radar plot.*

### Most Noteworthy Findings

**1\. High-precision conformational sampling is not necessary for hit identification**

Ablation experiments show that replacing Boltz-2's diffusion sampling with FABind+ fast docking causes almost no drop in virtual screening performance. Boltzina (replacing diffusion with Vina) reaches a similar conclusion. **This challenges the prevailing assumption that accurate complex structures are required for effective virtual screening** — a reasonably good docking prior is sufficient.

**2\. Lightweight equivariant networks can replace heavy attention modules**

A 5-layer EGNN matches PairFormer under equivalent input conditions while reducing inference time from seconds to milliseconds. This indicates that **for local physical interactions within binding pockets, equivariant geometric constraints are more efficient than global attention**.

**3\. Foundation models may suffer from negative transfer on out-of-distribution targets**

On the antibiotic benchmark, Boltz-2 performs at near-random levels (AUROC 0.45), while FlashBind achieves 0.710. A likely explanation is that the foundation model's training distribution is biased toward common eukaryotic targets, and **the learned statistical patterns become counterproductive when transferred to bacterial targets**. The local geometric constraints that FlashBind relies on are more universally applicable.

**4\. Data curation is a core prerequisite for model success**

The authors repeatedly emphasize: HTS data are rife with false positives, and PAINS compounds and assay artifacts can severely mislead models. **The secondary confirmation mechanism (requiring quantitative evidence to support active labels)** is the most critical step in FlashBind's data strategy — it essentially lets data quality rather than data scale drive model learning.

### Innovations and Limitations

**Innovations**

1\. Proposes the **'fast docking + lightweight geometric scoring'** two-stage decoupled paradigm, a workflow-level innovation

2\. Systematically demonstrates that **high-precision conformational sampling is not a prerequisite for virtual screening**, with methodological significance

3\. Occupies the optimal position on the efficiency-accuracy Pareto frontier, **achieving 50x speedup with no appreciable accuracy cost**

4\. Validates generalization across three tasks: virtual screening, enzyme specificity, and antibiotic discovery

5\. Completes a full prospective wet-lab validation loop — **from benchmark to target inhibition to whole-cell antibacterial activity**

**Limitations**

**Limitation 1:** The system's performance ceiling is **constrained by upstream docking quality**. When FABind+ produces incorrect poses (e.g., induced fit, cryptic pockets, metal-ion-mediated binding), the downstream EGNN cannot compensate.

**Limitation 2:** The global AUROC on MF-PCBA (0.7826) is still **slightly below Boltz-2 (0.8056)**. FlashBind functions more as an excellent early ranker suited for front-end coarse screening, with a gap remaining for scenarios requiring globally precise scoring.

**Limitation 3:** The antibiotic benchmark is limited in scale (218 active / 100 inactive / 12 targets), **sufficient as a proof-of-concept but requiring larger-scale validation before drawing general conclusions**.

**Limitation 4:** Performance comparisons with Boltz-2 may be confounded by **differences in training data** — Boltz-2 uses a larger proprietary dataset, so 'architecture wins' and 'data wins' have not been fully disentangled.

### Questions Worth Following Up

1\. **How sensitive is it to pose quality?** If FABind+'s docking accuracy degrades (e.g., facing flexible targets or induced fit), how much does FlashBind's performance drop?

2\. **Can lightweight flexible docking be integrated?** Incorporating backbone flexibility while maintaining high speed could further expand the applicability.

3\. **What is the real throughput on billion-scale compound libraries?** The paper demonstrates single-complex speed, but wall-clock performance under large-scale distributed deployment still needs benchmarking.

4\. **Can it be extended to peptide screening?** FlashBind's 'decoupling + lightweight geometric scoring' approach could theoretically transfer to short peptide scenarios, but would require adapting pose generation and graph representations.

**In one sentence:** FlashBind's core insight is that for early hit identification in virtual screening, **'a good enough docking prior + lightweight geometric scoring' is sufficient** — expensive end-to-end foundation models are not necessary. This seemingly simple idea matches Boltz-2 on MF-PCBA, dramatically outperforms it on antibiotic tasks, and passes wet-lab validation on DnaG — providing a practical route for academic labs and small-to-medium pharma companies to perform high-quality virtual screening with limited computational resources.

**Paper:** FlashBind: Towards Accurate and Efficient Structure-based Virtual Screening

**Authors:** Songlin Jiang, Yifan Chen, Aarti Krishnan, Yu Zhang, Wengong Jin

**Institutions:** Northeastern University, Broad Institute of MIT and Harvard, MIT, Wyss Institute, Whitehead Institute

**DOI:** 10.64898/2025.12.22.695983

### About the Corresponding Author

**Wengong Jin**, Assistant Professor at Northeastern University's Khoury College of Computer Sciences and Visiting Researcher at the Eric and Wendy Schmidt Center at the Broad Institute of MIT and Harvard. He received his B.Eng. from Shanghai Jiao Tong University (2016) and subsequently earned his M.S. (2018) and Ph.D. in Computer Science from MIT CSAIL, advised by Professor Regina Barzilay and Professor Tommi Jaakkola. His doctoral thesis focused on deep generative models for small molecules and proteins and received the MIT EECS Outstanding Thesis Award. After his Ph.D., he conducted postdoctoral research at the Broad Institute, where he pioneered geometric and generative AI methods for molecular and protein design, earning the BroadIgnite Award and the Dimitris N. Chorafas Prize. His research spans AI and the life sciences, encompassing AI-driven drug discovery, protein folding and design, AI agents for scientific discovery, and molecular generative models, with publications in top journals and conferences including Nature, Science, Cell, ICML, NeurIPS, and ICLR.

## Citation

Jiang, S., Chen, Y., Krishnan, A., Zhang, Y., & Jin, W. (2026). FlashBind: Towards Accurate and Efficient Structure-based Virtual Screening. bioRxiv. https://doi.org/10.64898/2025.12.22.695983
