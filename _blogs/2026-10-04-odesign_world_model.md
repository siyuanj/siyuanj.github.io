---
layout: post
title: "arXiv 2025 | ODesign: A unified generative model for all-modality biomolecular interaction design"
date: 2026-10-04
description: "ODesign unifies proteins, RNA, DNA, small molecules and ions in one all-atom generative model, matching or beating specialist tools across eleven benchmarks with orders-of-magnitude higher design throughput."
tags: [generative models, biomolecular design, all-atom modeling, aptamer design, motif scaffolding]
lang: en
translation_key: odesign_world_model
---

# ODesign: A World Model for Biomolecular Interaction Design

### Link: [full article](https://doi.org/10.48550/ARXIV.2510.22304)

Authors: Odin Zhang, Xujun Zhang, Haitao Lin, ..., Shuangjia Zheng

arXiv, 2025

---
**Overview**

Existing molecular design models usually handle only one molecular type or one task: RFDiffusion designs proteins, TargetDiff designs small molecules, RNAFrameFlow designs RNA. Real biological systems, however, are multimodal: proteins, DNA, RNA, small molecules and ions together form complex interaction networks. This paper presents **ODesign, the first cross-modality all-atom generative model that covers proteins, RNA, DNA, small molecules and ions at the same time**. ODesign abstracts the basic chemical units of different modalities into unified generative tokens and, through a task-oriented multi-granularity masking strategy, uses a single model for tasks ranging from protein binder design to nucleic acid aptamer design and from motif scaffolding to small-molecule generation. Across 11 benchmark tasks, ODesign matches or exceeds the accuracy of specialist models while delivering an order-of-magnitude increase in computational throughput, making large-scale candidate generation and experimental screening practical.

## Part 1: Research Question

Protein design has advanced enormously in recent years: RFDiffusion can generate protein backbones and binders de novo, RFDiffusion-AA and RFDiffusion2 extend this to ligand-binding proteins and atomic-level motif scaffolding, BindCraft and BoltzDesign each bring their own breakthroughs, methods such as ResGen and TargetDiff focus on generating small molecules inside protein pockets, and RNAFrameFlow and RDesign target RNA structure design. Each model, however, is confined to a particular molecular type and task type, covering only a small part of the overall molecular design landscape. When a researcher needs to design an RNA aptamer for a protein target, a small molecule that binds a stretch of DNA, a small-molecule drug for an RNA target, or a redesigned protein scaffold under atomic-level constraints at a catalytic site, they often have to stitch several independent tools together, or find no suitable model at all, because cross-modality tasks such as 'de novo design of protein-binding RNA' and 'de novo design of protein-binding DNA' lie outside the coverage of existing models.

The core difficulty of cross-modality design is that different molecules are organized in very different ways and follow very different chemical rules. Proteins are built from 20 kinds of amino acid residues, each with a fixed backbone (N-Cα-C-O) and a variable side chain. RNA and DNA are built from 4 kinds of nucleotides, each containing a base, a ribose and a phosphate group, with their own base-pairing and stacking rules. Small molecules are atom graphs of arbitrary topology that may contain all sorts of ring systems, heteroatoms, branches and chiral centers, with no fixed notion of a 'residue' or 'monomer'. Generating everything purely at the atomic level makes it easy for the model to lose the modality prior of 'is this a protein, an RNA or a small molecule' and to produce chemically unreasonable structures; modeling only at the residue level, on the other hand, makes it impossible to control the geometric details of catalytic atoms and ligands precisely. Different tasks also need conditional control at different granularities: binder design needs entity-level control (a whole protein as the condition), motif scaffolding needs residue-level control (preserving a functional motif), and catalytic site design needs atom-level control (fixing the positions of key atoms). The authors' core goal is therefore: **to unify high-level molecular units and low-level all-atom geometry in a single model, covering all modalities and all conditioning granularities within one framework**.

## Part 2: Methodology: The Core Design of ODesign

The ODesign architecture rests on one key hypothesis: **high-performance structure prediction models such as AlphaFold3 have already learned rich rules of cross-molecular interaction, and this structural knowledge can be transferred to molecular generation**. ODesign therefore builds on an AlphaFold3-style architecture, inherits pretrained Pairformer parameters and then fine-tunes for the generative task.

The model consists of five core modules. **(1) The embedding layer** encodes molecular type, residue position, chain and entity identity, atomic element and name, atomic charge, MSA information, covalent bond topology, and two flags specific to ODesign, is_masked (does this need to be generated) and is_hotspot (is this a specified binding epitope), providing rich chemical and task context. **(2) The conditioning module** supports two ways of injecting structure: rigid target mode fixes the target's three-dimensional coordinates directly and keeps the conditioning atoms still during diffusion; flexible target mode encodes the target's internal distance matrix as a distogram fed into the Pairformer, preserving the structural topology while allowing atomic coordinates to adjust together with the binding partner during generation, which mimics induced fit. **(3) The Pairformer** (inheriting AlphaFold3 pretrained parameters) models the pairwise interaction representation between molecules. **(4) The all-atom diffusion module** switches between token level and atom level through upsampling and downsampling paths and decodes three-dimensional coordinates with a conditional diffusion process. **(5) The multimodal inverse folding module** predicts sequences or atom types from the generated backbone structure, using autoregressive sequence design for proteins and nucleic acids and parallel element-type prediction for small molecules.

Two key innovations make cross-modality unification possible.

**First, unified generative tokens.** ODesign abstracts the minimal chemical units of different modalities into unified tokens, distinguished by suffixes (-P for protein, -N for nucleic acid, -L for small molecule). The meaning of such a token is 'a chemical unit of the specified modality needs to be generated here, but its specific type is not yet known', effectively a placeholder. Generation proceeds in two stages: the first stage uses a conditional diffusion model to generate three-dimensional backbone coordinates, and the second stage predicts the specific types from the backbone structure through the inverse folding module, with autoregressive sequence design for proteins and nucleic acids and parallel prediction of element types and chemical properties for small molecules. This unified token space lets the model learn the structural rules of different modalities simultaneously during training, with no need for a separate generation pipeline per molecular type.

**Second, a multi-granularity masking strategy.** ODesign defines four levels of masking that unify seemingly different molecular design tasks into a single 'conditional completion' problem: **all**, in which the entire molecule is generated, corresponding to free generation; **entity**, in which one complete entity in a complex is masked while another is kept as the condition, corresponding to binder design (generating a binding protein or RNA for a given protein target); **token**, in which some functional residues are kept and the rest of the scaffold is generated, corresponding to motif scaffolding; and **atom**, in which only a few key catalytic or functional atoms are kept and the whole molecule is rebuilt, corresponding to atomic-level functional site design. During training, ODesign randomly samples masks at different levels across all monomer and complex structures in the PDB, so the model learns all task types at once. Users can also specify binding epitopes (hotspot residues); during training, different epitopes are randomly selected with a certain probability, so the model learns epitope localization and recognition of key interaction patterns.

## Part 3: Key Figure Analysis

### Figure 1: Overview of the ODesign Framework

**What this figure asks:** How does ODesign use AlphaFold3's pretrained knowledge to achieve cross-modality molecular generation?

![Figure 1: framework](pic/odesign_world_model/page_3.png){: width="1140" height="1076" loading="lazy" decoding="async"}

*Figure 1. The ODesign all-modality design framework. The model takes proteins, DNA, RNA, small molecules and ions as input and outputs designs through the embedding layer, the conditioning module, the Pairformer, all-atom diffusion and multimodal inverse folding.*

The core hypothesis: **structure prediction models like AF3 have already learned the rules of cross-molecular interaction, and this can be transferred to generation**. ODesign therefore uses an AF3-style architecture, inherits pretrained Pairformer parameters and fine-tunes them. The conditioning module supports both rigid targets (fixed coordinates) and flexible targets (distogram encoding, allowing induced fit).

Two key innovations: **unified generative tokens** (the minimal chemical units of different modalities are abstracted into placeholder tokens with -P/-N/-L suffixes, with the backbone generated first and the types recovered by inverse folding) and **multi-granularity masking** (four levels, all/entity/token/atom, which unify free generation, binder design, motif scaffolding and catalytic site design into 'conditional completion').

### Figure 2: Protein-Centric Benchmarks

**What this figure asks:** On tasks such as protein-binding proteins, ligand-binding proteins and motif scaffolding, how do ODesign's throughput and quality compare?

![Figure 2: protein benchmarks](pic/odesign_world_model/page_5.png){: width="1140" height="1020" loading="lazy" decoding="async"}

*Figure 2. Protein-centric benchmarks. Designs in purple, targets in pink, ligands in green. (a) Protein-binding proteins. (b) Ligand-binding proteins. (c) Motif scaffolding. (d) Interface design. (e) Atomic-level motif scaffolding.*

* **Panel a**: throughput and quality are measured together as 'number of designs passing filters per GPU per day'. ODesign's flexible mode yields the most on most targets; compared with BindCraft, which needs hundreds of iterations, **single forward-pass generation brings an order-of-magnitude gain in throughput**, letting one GPU produce hundreds to thousands of candidates per day.
* **Panels b-e**: for ligand-binding proteins, flexible mode lets the pocket and the ligand adjust together (induced fit); for motif scaffolding, the success rate, number of successes and MotifScore are the best or close to the best; for interface design, the mean pocket-RMSD is 2.24 Å better than PocketGen; and for atomic-level motif scaffolding the throughput is **37.5 times higher on average** than RFDiffusion2, so a single run can fill a 96-well plate.

### Figure 3: New Nucleic-Acid-Centric Tasks

**What this figure asks:** How does ODesign do on RNA, DNA and protein-nucleic acid complex tasks, where tools were previously lacking?

![Figure 3: nucleic acid benchmarks](pic/odesign_world_model/page_8.png){: width="1140" height="1080" loading="lazy" decoding="async"}

*Figure 3. Nucleic-acid-centric benchmarks. (a) RNA monomer design. (b) DNA monomer design. (c) Protein-binding RNA design. (d) Protein-binding DNA design.*

* **Panel a, RNA monomers**: for lengths of 10–150 nt validated by AF3 refolding, **the RMSD and TMScore success rates are nearly twice those of the RNA-specific model RNAFrameFlow**, so the cross-modality model learns nucleic acid rules better than a single-modality specialist. **Panel b, DNA monomers**: ODesign is the first model to demonstrate de novo DNA generation (no public baseline existed before).
* **Panels c/d**: de novo design of protein-binding RNA and protein-binding DNA had almost no general-purpose tools before, and ODesign is a pioneer here, generating hundreds of aptamers per protein target and refolding them with AF3 conditioned on the protein, with most reaching a reasonable binding RMSD.

### Figure 4: Ligand-Centric Benchmarks

**What this figure asks:** How well does ODesign design small molecules that bind proteins, DNA and RNA respectively?

![Figure 4: ligand benchmarks](pic/odesign_world_model/page_10.png){: width="910" height="932" loading="lazy" decoding="async"}

*Figure 4. Ligand-centric benchmarks. (a) Protein-binding small molecule design (valid/success numbers compared with several specialist methods). (b) DNA-binding small molecule design. (c) RNA-binding small molecule design (min_iPAE, iPTM).*

* **Panel a**: for protein-binding small molecule design, ODesign (purple) has clearly higher valid and success counts than specialist methods such as TargetDiff, D3FG, Pocket2Mol, SurfGen and ResGen on most of the six targets.
* **Panels b/c**: for the rarer tasks of **DNA-binding and RNA-binding small molecule design**, binding quality measured by min_iPAE and iPTM shows that ODesign gives reasonable results; these cross-modality ligand tasks are likewise directions that previously lacked general-purpose tools.

## Part 4: Key Contributions

ODesign opens up several tasks that previously lacked effective tools. **(a) RNA monomer design.** RNA structures of 10–150 nucleotides are generated and validated by AF3 refolding (success criterion: RMSD &lt; 5 Å or TMScore > 0.45). Across length ranges, ODesign's RMSD success rate and TMScore success rate are nearly twice those of the RNA-specific model RNAFrameFlow, showing that a cross-modality model can learn better nucleic acid structural rules than a single-modality specialist. The generated RNA structures span topologies including hairpin loops, internal loops and multi-stem architectures. **(b) DNA monomer design.** Because no public DNA generation baseline currently exists (existing nucleic acid models mostly target RNA), ODesign is the first model to demonstrate de novo DNA generation. In the 20–140 nucleotide range, it generates DNA structures of various lengths and topologies with reasonable foldability as validated by AF3 refolding. **(c) Protein-binding RNA design.** Lacking a standard benchmark, the authors selected 10 targets from protein-RNA complexes in the PDB released after 13 January 2023, generated 400 RNA aptamers for each target, refolded them with AF3 conditioned on the protein structure and evaluated the overall protein-ligand RMSD. Across the 5 targets shown, most candidate RNAs achieved binding poses with RMSD &lt; 5 Å. **(d) Protein-binding DNA design.** Similar conditional generation was carried out on 4 protein-DNA complex targets, likewise showing reasonable binding quality and structural diversity. It is worth stressing that de novo design of protein-binding nucleic acids previously had almost no general-purpose tools, and ODesign is a pioneer in this direction.

The significance of these results is that ODesign demonstrates that a single unified model really can match or surpass specialist models across many modalities. From a unified perspective, ODesign reduces every design task to the same concept: conditional three-dimensional generation of the masked part of a multimodal complex. Protein binder design is entity completion, aptamer design is entity completion, small-molecule generation is still entity completion, motif scaffolding is local token completion and catalytic site design is atom-level completion. Tasks that once looked independent of each other can now be solved with the same data representation, conditioning mechanism and generative architecture. The comparison between rigid and flexible target modes reveals an important pattern: flexible mode outperforms rigid mode on most tasks, with a particularly marked effect in small-molecule binding protein design, which shows that allowing the target to adjust its conformation during binding (the induced fit effect) is crucial for generating high-quality designs.

## Part 5: Limitations and Outlook

All of the results in this paper rest on in-silico metrics (AF3 refolding, RMSD, designability and similar measures), and systematic wet-lab validation is missing. The test sets for some tasks in the paper are small, and the generative model and the evaluation model may share certain architectural biases. Control over chemical synthesizability, pharmacokinetics and actual biological function also needs further development. The authors' vision of positioning ODesign as a 'world model' is ambitious, but a more accurate description at present is this: an all-atom cross-modality conditional generative model built on AlphaFold3-style structural priors and trained with unified tokens and multi-granularity masking. Its most impressive contribution is the empirical demonstration that different biomolecular modalities and different scales of control really can be brought into one general all-atom generative framework without sacrificing accuracy on individual tasks.

## About the Corresponding Authors

The paper lists four corresponding authors. Shuangjia Zheng is at the Global Institute of Future Technology, Shanghai Jiao Tong University, and at Lingang Laboratory; he contributed the conceptual idea and provided foundational resources and strategic guidance for the project. Tingjun Hou, of the College of Pharmaceutical Sciences at Zhejiang University, advised on small-molecule modeling. Siqi Sun, of Shanghai Artificial Intelligence Laboratory, guided the nucleic acid design work. Pheng Ann Heng, of the Department of Computer Science and Engineering at The Chinese University of Hong Kong, advised on the machine learning architecture. Odin Zhang conceived the research idea and led the project, and together with co-first author Xujun Zhang designed the initial model architecture; the work is credited to the 'ODesign Team' and spans Lingang Laboratory, Shanghai Jiao Tong University, Zhejiang University, Fudan University, CUHK, Shanghai AI Laboratory and several North American institutions.

## Citation

Zhang, O., Zhang, X., Lin, H., Tan, C., Wang, Q., Mo, Y., ... & Zheng, S. (2025). ODesign: A World Model for Biomolecular Interaction Design. arXiv. https://doi.org/10.48550/ARXIV.2510.22304
