---
layout: post
title: "bioRxiv 2026 | resTrain: Steering AlphaFold with distance priors to guide structure prediction"
date: 2026-09-05
description: "resTrain injects distance restraints into AlphaFold by optimizing a learned bias on the pair representation, boosting antibody-antigen docking success from 44% to 72% with a single coarse contact."
tags: [protein structure prediction, alphafold, distance restraints, conformational sampling, protein-protein docking]
lang: en
translation_key: restrain_distance_injection
---

# A generalisable framework to inject distance information into Alphafold-like structure predictors

### Link: [full article](https://doi.org/10.64898/2026.07.02.736010)

Authors: Claudio Mirabello, Björn Wallner, Vladislav Orekhov, Björn Nystedt, Nicholas Pearce

bioRxiv, July 6, 2026

---
AlphaFold is already remarkably powerful, but sometimes we **already have clues** about a protein's structure — certain residue pairs should be close, an interface is roughly located in a known region, or NMR has provided distance upper bounds. Can we feed this 'extra knowledge' directly into AlphaFold?

A team from Sweden's SciLifeLab offers an elegantly simple solution: **freeze all AlphaFold parameters, and optimize only a bias added to the pair representation (RPB), forcing the distogram to match a target distance distribution, which indirectly imposes constraints on the 3D structure.**

This framework, called **resTrain**, shows significant improvements across multi-conformational sampling, NMR data integration, and antibody–antigen complex prediction — most strikingly, on 25 difficult antibody–antigen complexes, **a single coarse '≤8Å' contact restraint boosted prediction success from 44% to 72%**, even outperforming AlphaFold 3.

## Part 1: Research Question

AlphaFold2/3 already excels at pure sequence-to-structure prediction. But in practice, many research tasks are characterized by the fact that **we are not starting from zero**:

* NMR NOESY provides upper bounds on interatomic distances
* Crosslinking experiments tell us certain sites should be proximal
* The approximate epitope region on an antigen is already known
* Functional experiments suggest a protein adopts both open and closed conformations
* A ligand's binding pocket is known, but the precise pose is not

How can this 'partial' information be communicated to AlphaFold? Existing approaches either require retraining the model (engineering-heavy with poor generalizability), only support soft restraints (no guarantee the model will comply), or are limited to single-chain proteins (no complex support).

The core question the authors aim to answer is: **Can we design a general-purpose, lightweight method that injects distance information into AlphaFold without modifying the model's core parameters, and that works across both AF2 and AF3-like architectures?**

## Part 2: Methodology: Changing the distogram is all it takes to change the structure

The paper's most important observation is this: AlphaFold's **distogram** (the predicted Cβ–Cβ distance probability distribution for each residue pair) and the final 3D structure are both driven by the same internal representation — the **pair representation**. If the pair representation can be 'nudged' in the right direction, the distogram changes, and the structure follows.

Building on this insight, resTrain's approach is surprisingly simple:

**What this figure asks:** How does resTrain switch AlphaFold's prediction to the correct conformation by modifying only the distogram?

![](pic/restrain_distance_injection/page_5.png){: width="1071" height="1574" loading="lazy" decoding="async"}

*Fig 1 \| resTrain method overview and antibody–antigen example. (a) RPB is added to the pair representation at every Evoformer layer; the distogram loss backpropagates to update only the RPB. (b–d) For complex 7N0A, a single 3.74Å distance restraint switches the prediction from an incorrect to the correct conformation within 10–20 steps.*

**Restraint Pair Bias (RPB)**

A learnable tensor of shape (r, r, 128) is introduced (where r is the number of residues) and added to the pair representation at **every Evoformer block**. All original AlphaFold parameters remain frozen — **the RPB is the only thing updated by gradients**.

**Three types of distance restraints**

* **Exact distance**: e.g., 'residues i–j distance ≈ 4Å', using softmax cross-entropy
* **Upper-bound distance**: e.g., 'distance ≤ 8Å', using sigmoid / partial-label cross-entropy
* **Full probability distribution**: e.g., a distribution shape from NMR statistical mapping, using KL divergence

**Optimization procedure**

Initialize RPB = 0 → run the AF trunk to obtain the distogram → compute loss on user-specified residue pairs → backpropagate gradients to update only the RPB → repeat for several steps → perform full structure inference at the end. The entire process simply **makes the distogram match the target distances**, and the structure naturally follows.

A key finding is that **optimizing the distogram alone is sufficient — no additional coordinate-space loss is needed**. Because the distogram and the structure module share the same pair representation, changing the former automatically affects the latter. This is what makes the method so elegantly simple.

## Part 3: Key Figure Analysis

Many proteins adopt multiple functional states such as open/closed, yet AlphaFold typically outputs only one. resTrain acts like an 'adjustable spring' attached to the protein: pulling a residue pair closer biases toward the closed state, pushing them apart biases toward the open state, and sweeping continuously generates a conformational trajectory.

**What this figure asks:** Can scanning a distance restraint from 3–22Å on a key residue pair generate a trajectory between two known conformations?

![](pic/restrain_distance_injection/page_7.png){: width="1071" height="1564" loading="lazy" decoding="async"}

*Fig 2 \| Multi-conformational sampling. (a,b) With just 100 structures (20 distances × 5 seeds), resTrain outperforms AFsample2's 1,000 random samples on more targets. (c) Scanning 3–22Å on a key residue pair of one protein generates a 'conformational trajectory' between two known states.*

On 238 pairs of dual-conformation structures from the Cfold dataset, the authors identified the 'most active' residue pair for each (the pair with the largest distance change between states) and scanned distances from 3Å to 22Å. Results:

* resTrain significantly outperformed AFsample2 on **31 states**, while AFsample2 was better on only 16
* resTrain used only **100 structures**, compared to AFsample2's **1,000**
* Distance scanning can also propose **intermediate conformations not yet observed experimentally**

### Experiment 2: Integrating NMR NOE data

NMR NOESY experiments provide **upper bounds on hydrogen–hydrogen distances**, but the AlphaFold distogram predicts **Cβ–Cβ distances**. The authors solve this 'translation' problem with a clever statistical mapping: from a large number of PDB structures, they tabulated the correspondence between H–H distances and Cβ–Cβ distances across different residue types and hydrogen atom classes, converting NOE signals into probability distributions in distogram space.

On 90 NMR structures from the ARTINA dataset:

* **88% of structures showed reduced violations**, with aggregate violations decreasing by 25%
* Compared to PDB-deposited NMR structures: PDB structures had 17% fewer aggregate violations, but AF2-resTrain satisfied **6% more** individual restraints
* In the illustrative case of 2L82: AF2 got the relationship between two core beta-sheets wrong, and AF2-resTrain corrected this error using NOE data

The remaining large errors primarily arise from sidechain conformations — because the distogram controls residue-level geometry and can only indirectly influence sidechain atom arrangements. This represents a current limitation of the method.

### Experiment 3: A single coarse restraint rescues difficult complexes

This is the paper's most striking result. Antibody–antigen interfaces lack coevolutionary signal, and MSA provides limited help for cross-chain interactions, so even AF3 frequently fails.

The authors tested on 25 difficult antibody–antigen complexes. Each complex was given **only a single restraint**: from one epitope residue on the antigen to one residue on the antibody heavy chain, with distance ≤ 8Å — not even a precise distance, just coarse information that 'these residues should be in contact.'

**What this figure asks:** On 25 difficult antibody–antigen complexes, how much does resTrain improve over AF3 and Chai-1?

![](pic/restrain_distance_injection/page_10.png){: width="1071" height="1530" loading="lazy" decoding="async"}

*Fig 4 \| Prediction on 25 difficult antibody–antigen complexes. (a) AF2-resTrain vs. unconstrained AF2.3; (b) vs. AF3; (c) vs. Chai-1; (d) OF3-resTrain vs. OpenFold3. Points above the diagonal indicate resTrain performs better.*

**Success rate comparison (DockQ > 0.23 = correct)**

* AF2-Multimer (no restraints): 11/25 (44%) → **AF2-resTrain: 18/25 (72%)**
* AlphaFold 3 (1000 seeds × 5): 15/25 (60%)
* Chai-1 (with restraints): 14/25 (56%)
* OpenFold3 → OF3-resTrain: 6/25 → **16/25**

Notably, resTrain used only 20 seeds × 5 = 100 predictions, while AF3 used 1000 seeds × 5 = 5,000. A single coarse cross-chain contact is enough to determine the correct docking geometry.

An even more important detail: **the model with the lowest restraint loss is not necessarily the highest-quality model, and predicted quality scores such as ipTM still correlate well with DockQ**. This shows that resTrain has not 'fooled' the model's scoring system — it genuinely helps the model settle into a more physically reasonable conformational basin.

### Additional applications: epitope scanning and small-molecule docking

**In silico epitope scanning**: Since a single cross-chain restraint can guide docking, the process can be reversed for systematic scanning — fix one residue on the antibody CDR, sequentially 'pull' it toward each antigen residue, generate structures, and rank by ipTM. On 7W71, scanning across 93 antigen residues produced 9,300 structures, and the top-ranked model successfully predicted the correct interface (DockQ 0.74).

**Protein–small molecule docking**: On the AF3 known-failure hard target 8OV7, applying one ≤ 8Å pocket restraint to each end of the ligand reduced the top-ranked model's ligand RMSD to **1.24Å** (from AF3's original 12.6Å). However, this is currently a single-case validation and does not yet constitute strong evidence.

## Part 4: Key Contributions

If you just read the technical description — 'use constraints as supervision and backpropagate into a bias vector' — it sounds almost trivially simple. But resTrain's real value lies in three key insights:

**Insight 1: The distogram is a sufficiently good control interface.** Modifying only the distogram-related representation can stably influence the 3D structure — no direct coordinate-space loss is needed.

**Insight 2: The model's core parameters need not be touched.** An additive bias is sufficient, making the method extremely lightweight and general.

**Insight 3: A very weak local signal can trigger a global structural switch.** A single coarse ≤ 8Å restraint can turn an incorrect docking prediction into a correct one.

A straightforward analogy: standard AlphaFold is like a self-driving car navigating by its own learned experience; resTrain is a gentle turn of the steering wheel at a fork in the road. The car's driving ability is unchanged — you are simply telling it **which direction to go**.

Thus, resTrain is fundamentally a **disambiguation tool** — when AlphaFold faces a multi-solution problem, it uses a small amount of external knowledge to help select the correct conformational basin. Its value is greatest in tasks where there are weak priors but multiple plausible solutions.

## Part 5: Limitations and Outlook

The approach is elegant in concept, but there is clear room for improvement in both scope and depth:

**RPB must be optimized separately for each target.** This is per-target test-time optimization, with computational cost scaling linearly with the number of targets. A natural extension would be: can a **shared bias prior** be learned for an entire protein family? Many families exhibit systematic prediction biases (e.g., certain membrane proteins are always predicted in the inward-facing state), and advancing from per-target to family-level transferable methods could be the next-generation direction.

**Limited sidechain accuracy.** The primary optimization target is the Cβ–Cβ distogram, which clearly improves backbone, fold, and interface geometry, but sidechain rotamer and atomic-level refinement remain limited — as already evident from the NMR experiments.

**Insufficient protein–small molecule validation.** Ligand docking has been demonstrated on only a single case, which is not enough to establish consistent effectiveness across a broad benchmark. Transferability to the actual AF3 (as opposed to OpenFold3, used here as a proxy) also remains uncertain.

**Dependence on restraint selection quality.** Choosing the right 'key residue pair' matters — incorrect or conflicting restraints can push the structure into wrong local minima. Currently, restraint selection relies mainly on manual judgment, and automatically identifying the 'most informative residue pairs' remains an open problem.

**Limited mechanistic analysis.** What exactly does the RPB learn in representation space? Why can certain restraints trigger global conformational switches? How does convergence behave when multiple restraints conflict? These theoretical questions await deeper investigation.

### In one sentence:

resTrain uses the distogram as a bridge to provide a **general-purpose control interface** that stably injects external distance information into AlphaFold-like predictors without modifying the model itself. It transforms AlphaFold from a 'sequence → structure' predictor into a **'sequence + partial priors → constraint-satisfying structure' controllable inference engine**. This interface is practical for NMR integration, complex modeling, conformational exploration, and hypothesis testing, and has the potential to become a standard component in 'AI + experimental constraints' structure modeling workflows.

## About the Corresponding Author

Claudio Mirabello is a researcher in the Department of Physics, Chemistry, and Biology at Linköping University in Sweden, and is affiliated with the National Bioinformatics Infrastructure Sweden (NBIS) and SciLifeLab. His research focuses on developing and improving protein structure prediction methods, with particular emphasis on combining AI structure prediction models with experimental constraint information to enhance their practical utility for complex biological problems. The resTrain framework is open-sourced on GitHub (github.com/clami66/resTrain) and a Google Colab notebook is available for direct use.

## Citation

Mirabello, C., Wallner, B., Orekhov, V., Nystedt, B., & Pearce, N. (2026). A generalisable framework to inject distance information into Alphafold-like structure predictors. bioRxiv. https://doi.org/10.64898/2026.07.02.736010
