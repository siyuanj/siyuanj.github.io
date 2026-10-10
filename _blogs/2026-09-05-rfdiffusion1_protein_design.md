---
layout: post
title: "Nature 2023 | RFdiffusion: From noise to protein, diffusion models redefine protein design"
date: 2026-09-05
description: "RFdiffusion turns a structure prediction network into a generative one by denoising fine-tuning, solving monomer, symmetric assembly, motif scaffolding and binder design with roughly 100-fold higher experimental success than Rosetta."
tags: [protein design, diffusion models, de novo design, symmetric assemblies, binder design]
lang: en
translation_key: rfdiffusion1_protein_design
---

# De novo design of protein structure and function with RFdiffusion

### Link: [full article](https://doi.org/10.1038/s41586-023-06415-8)

Authors: Joseph L. Watson, David Juergens, Nathaniel R. Bennett, ..., David Baker

Nature, August 2023

---
How hard is it to design from scratch a protein that does not exist in nature? Traditional methods require assembling fragments by hand and repeatedly tuning energy functions, and a single design project can take months or even years. In 2023, David Baker's group introduced **RFdiffusion**: **by running an AlphaFold-class structure prediction network "in reverse" and training it with diffusion denoising, they turned a network that understands protein structure into one that can create protein structure.**

The framework covers nearly every core task in protein design: unconditional generation of monomers, assembly of symmetric oligomers, scaffolding of functional sites and design of protein binders. **In experimental validation, the design success rate is roughly 100 times higher than Rosetta's, and several designs were confirmed by cryo-EM to match the computational models closely.**

This paper is the foundation of the RFdiffusion series; the later RFdiffusion2 (Nature Methods 2026) and RFdiffusion3 (bioRxiv 2025) extend it to atomic-level enzyme design and all-atom biomolecular interaction design respectively.

## Part 1: Research Question

Before RFdiffusion, de novo protein design had five long-standing unsolved problems:

* **Unconditional generation**: can diverse, foldable protein structures be generated from nothing, going beyond the topologies already known in the PDB?
* **Functional site scaffolding**: given the geometry of an enzyme active site or a binding interface, can a stable protein be generated automatically to wrap around it?
* **Higher-order symmetric assemblies**: can complex symmetric structures such as dihedral, tetrahedral and icosahedral assemblies be designed?
* **Binder design efficiency**: designing protein binders with Rosetta typically requires screening 10,000+ candidates, with a very low success rate
* **The structure-sequence gap**: how can an amino acid sequence that folds into a generated backbone be inferred efficiently?

RFdiffusion's goal was to become **a single unified framework that solves all of the above at once**. The core idea comes from a bold hypothesis: since RoseTTAFold has already learned to "understand" protein structure, could denoising diffusion training teach it to "create" protein structure?

## Part 2: Methodology: Turning a structure prediction network into a generative model

RFdiffusion's central insight is remarkably simple: **fine-tuning RoseTTAFold (a protein structure prediction network) on a denoising task turns it into a powerful generative model.** Concretely, noise is added step by step to known protein structures during training and the network learns to recover the original structure from the noise, which is exactly the standard paradigm of diffusion models.

**What this figure asks:** How does RFdiffusion convert RoseTTAFold from a structure prediction network into a structure generation model?

![](pic/rfdiffusion1_protein_design/page_3.png){: width="1464" height="1828" loading="lazy" decoding="async"}

*Fig 1 \| Overview of RFdiffusion. (a) Fine-tuning the RoseTTAFold structure prediction network into a denoising network; (b) the various conditional generation modes: symmetric oligomers, binder design and functional site scaffolding; (c) the denoising trajectory of a 300-residue protein from pure noise to a complete structure.*

**Diffusion over rigid-body frames**

Each residue is represented by a **rigid-body frame**: the Cα position (translation) plus the N-Cα-C backbone orientation (rotation). The forward process adds 3D Gaussian noise to translations and Brownian motion on SO(3) to rotations. The reverse process recovers a meaningful protein backbone from completely random frames over about 200 denoising steps.

**The crucial role of the MSE loss**

Unconditional generation uses an MSE (mean squared error) loss rather than AlphaFold's FAPE loss. **This choice is essential**: FAPE is locally invariant (aligning each residue independently), which breaks the continuity of the global frame, whereas MSE is computed in the global frame and keeps structures consistent between adjacent steps of the denoising trajectory.

**Self-conditioning**

The current denoising step can refer to the structure predicted at the previous step, analogous to AlphaFold2's recycling mechanism. This makes the denoising trajectory more coherent and markedly improves generation quality.

**The complete design pipeline**

**RFdiffusion** (generates the protein backbone) → **ProteinMPNN** (designs an amino acid sequence for the backbone) → **AlphaFold2** (checks whether the sequence folds back to the target structure). Chained together, the three form a complete loop from structure generation to sequence design to computational validation.

## Part 3: Key Figure Analysis

**What this figure asks:** How do unconditionally generated proteins perform in terms of designability and structural novelty?

![](pic/rfdiffusion1_protein_design/page_4.png){: width="1464" height="1828" loading="lazy" decoding="async"}

*Fig 2 \| Monomeric protein generation performance. (a) Example 300- and 600-residue designs; (b-e) quantitative comparison with hallucination methods; (f) circular dichroism and thermal stability tests; (g) TIM barrel fold design.*

In unconditional generation mode, RFdiffusion is given no input constraints and generates protein backbones straight from pure noise. Tests covered proteins from 100 to 600 residues, and the results are impressive:

* **Topological diversity**: the generated protein topologies go far beyond the structure space known in the PDB and include many entirely new folds
* **Experimental validation**: of 18 designs, **9 expressed as soluble proteins**, several with extremely high thermal stability, with some designs remaining stable at 95°C
* **Speed improvement**: Generating a 100-residue protein takes only **11 seconds**, compared to 8.5 minutes for traditional hallucination methods
* **Fold-directed design**: directing generation toward TIM barrels (42.5% success rate) and NTF2 folds (54.1% success rate) both work well

### Experiment 2: symmetric oligomers, from cyclic to icosahedral

The design of symmetric oligomers is **one of the paper's biggest highlights**. RFdiffusion handles symmetry in an elegant way: **the symmetry constraint is injected as a condition at inference time, while the model itself was never trained on symmetric data**. In practice, only one subunit is denoised and then copied to the other subunit positions by symmetry operations.

**What this figure asks:** Did the symmetric oligomers generated by RFdiffusion pass experimental validation by cryo-EM?

![](pic/rfdiffusion1_protein_design/page_6.png){: width="1464" height="1828" loading="lazy" decoding="async"}

*Fig 3 \| Design and experimental validation of symmetric oligomers. (a) Example D2, C6, C8, C10 and O symmetric designs; (b-c) negative-stain EM characterization; (d) cryo-EM 3D reconstruction of the icosahedral particle HE0902.*

The authors systematically tested symmetry types from simple to extremely complex:

**Symmetry types covered**

* **Cyclic symmetry** (C3–C12): the most basic rotational symmetry
* **Dihedral symmetry** (D2–D4): combining rotation and flipping
* **Polyhedral symmetry**: tetrahedral (T), octahedral (O) and icosahedral (I)
* **Novel topologies**: double-layer β-barrels, and a C6 α/β barrel with 18 β-strands and 18 α-helices, structural forms never observed in nature

**Experimental validation results**

* 608 designs went to experiment, and **at least 87** showed the correct oligomerization state
* Negative-stain EM (nsEM) confirmed correct assembly for several designs
* The most striking is **HE0902**, a 15 nm porous icosahedral particle whose cryo-EM reconstruction clearly confirmed the designed structure, representing the most complex de novo designed symmetric assembly at the time

### Experiment 3: functional site scaffolding

Given a structural fragment with a known function (an enzyme active site, an antigenic epitope), RFdiffusion can automatically generate a stable protein to wrap around it. This is motif scaffolding.

**Benchmark results**

* **23** of 25 benchmark problems were solved (hallucination methods solved only 15, RFjoint 19)
* The p53-MDM2 example: the designed protein has a K<sub>D</sub> of **0.5 nM**, roughly 1000 times stronger than the native p53 peptide

**Enzyme active site scaffolding**

The authors also demonstrate scaffolding of EC1–EC5 class enzyme active sites, covering several enzyme functional classes. But enzyme design in this generation of RFdiffusion is limited to the **backbone level**: it can place backbone atoms correctly, yet it cannot precisely control side-chain conformations or the atomic-level geometry of catalytic residues. This became the central motivation for upgrading RFdiffusion2 to atomic resolution.

### Experiment 4: protein binder design

Protein binder design is one of the most practically valuable tasks in protein engineering, since drug design, diagnostic reagents and synthetic biology all depend on precise protein-protein interactions. RFdiffusion made a breakthrough in this direction:

**Binder design against five therapeutic targets**

* Targets: influenza hemagglutinin (HA), IL-7Rα, PD-L1, the insulin receptor (InsulinR) and TrkA
* Hit rate: about **19%**, roughly **100 times** better than the traditional Rosetta approach
* Screening required: fewer than 100 candidate designs suffice to find an effective binder
* Rosetta typically requires screening more than 10,000 for any chance of a single hit

**Cryo-EM validation: the HA_20 binder**

HA_20, a binder designed against influenza hemagglutinin, was solved by cryo-EM at 2.9 Å resolution, and **the experimental structure differs from the computational design model by an RMSD of only 0.63 Å**, an almost perfect match. This is the most direct validation of RFdiffusion's generation accuracy.

## Part 4: Key Contributions

**Innovation 1: a paradigm shift from prediction to generation.** Denoising fine-tuning turns RoseTTAFold, which has already learned to "understand" protein structure, into a generator that can "create" it. The structural knowledge accumulated in pretraining transfers directly to the generation task.

**Innovation 2: diffusion over rigid-body frames.** Rather than simply adding noise in Cartesian coordinates, diffusion is applied separately to each residue's translation (R³) and rotation (SO(3)). This representation naturally fits the geometry of a protein backbone.

**Innovation 3: the self-conditioning mechanism.** The current denoising step refers to the previous step's prediction, keeping the trajectory coherent and avoiding structural "jumps" during generation.

**Innovation 4: symmetry as an inference-time constraint.** The model does not need to be trained on symmetric data; applying symmetry operations at inference is enough. This means one model handles every symmetry type from C3 to icosahedral.

**Innovation 5: a modular pipeline.** Backbone generation (RFdiffusion), sequence design (ProteinMPNN) and structure validation (AF2) each do their own job. Every module can be upgraded independently, which makes the overall workflow both flexible and extensible.

## Part 5: Limitations and Outlook

As a pioneering work, RFdiffusion has clear limitations, and these limitations directly shaped the direction of the follow-up work in the series:

**Residue-level resolution**: RFdiffusion operates at the residue level (one rigid-body frame per residue) and cannot explicitly model atomic detail. This matters most in enzyme design, where catalytic activity depends on the precise positioning of side-chain atoms. RFdiffusion2 raises the resolution to the atomic level and addresses this directly.

**No explicit modeling of small molecules and ligands**: the current version can only account for small-molecule ligands indirectly through external potentials, and cannot make them part of the diffusion process. RFdiffusion3 extends further to all-atom biomolecular interaction design, covering protein-small molecule, protein-nucleic acid and other scenarios.

**Enzyme design limited to the backbone level**: although scaffolds can be built around enzyme active sites, the side-chain conformations of catalytic residues cannot be controlled precisely, and catalytic efficiency often depends on atomic positions at the sub-angstrom scale.

**Selection bias in experimental validation**: the experimental results shown in the paper went through filtering (for example, taking the top designs after ranking by AF2 predicted quality), so the real success rate may be lower than the reported figures. Even allowing for this, the improvement over traditional methods is still an order-of-magnitude one.

### In one sentence

RFdiffusion demonstrates one core point: **after denoising diffusion fine-tuning, a deep-learning-era protein structure prediction network can become a general-purpose protein generator**. It surpasses traditional methods across monomer design, symmetric assemblies, functional site scaffolding and binder design, moving de novo protein design from "one battle per project" into a new phase of "one general framework for many scenarios". The later RFdiffusion2 (Nature Methods 2026) extends it to atomic-level enzyme design, and RFdiffusion3 (bioRxiv 2025) goes further to all-atom biomolecular interaction design; together, the three generations form the most complete methodological system for generative protein design.

## About the Corresponding Author

David Baker is a professor in the Department of Biochemistry at the University of Washington, founding director of the Institute for Protein Design and an investigator of the Howard Hughes Medical Institute (HHMI). A pioneer of computational protein design, he developed the Rosetta software suite and has produced a series of landmark results in de novo protein design, enzyme design, protein structure prediction and therapeutic protein engineering. In 2024, David Baker shared the Nobel Prize in Chemistry with Demis Hassabis and John Jumper in recognition of his pioneering contributions to computational protein design.

## Citation

Watson, J. L., Juergens, D., Bennett, N. R., Trippe, B. L., Yim, J., Eisenach, H. E., ... & Baker, D. (2023). De novo design of protein structure and function with RFdiffusion. Nature, 620(7976), 1089-1100. https://doi.org/10.1038/s41586-023-06415-8
