---
layout: post
title: "bioRxiv 2025 | NA-MPNN: A nucleic acid inverse folding model that unifies proteins, DNA and RNA"
date: 2026-10-01
description: "NA-MPNN extends the ProteinMPNN architecture to a single protein-DNA-RNA graph, beating specialized tools at both RNA sequence design and protein-DNA binding specificity prediction."
tags: [rna design, inverse folding, protein-dna specificity, message passing networks]
lang: en
translation_key: na_mpnn_sequence_design
---

# RNA sequence design and protein–DNA specificity prediction with NA-MPNN

### Link: [full article](https://doi.org/10.1101/2025.10.03.679414)

Authors: Andrew Kubaney, Andrew Favor, Lilian McHugh, ..., David Baker

bioRxiv, October 4, 2025

---
**Overview**

ProteinMPNN changed the paradigm of protein sequence design, but the nucleic acid field has long lacked a general-purpose inverse folding tool of comparable quality. **NA-MPNN (Nucleic Acid MPNN)**, released by the Baker lab, extends the message-passing architecture of ProteinMPNN to a unified graph representation of proteins, DNA and RNA, and in doing so tackles two problems that have long been handled separately: RNA sequence design and protein–DNA binding specificity prediction. On computational benchmarks and in the community-run OpenKnot experimental challenge, NA-MPNN outperformed the previous specialized tools.

## Part 1: Research Question

Nucleic acid inverse folding, which means predicting the nucleotide sequence most likely to fold stably into a given three-dimensional backbone structure, is a core computational problem in biomolecular design. Its applications span two areas that have long been studied separately. The first is RNA sequence design, finding a suitable arrangement of A, C, G and U for a target backbone structure, which is used in the de novo design of aptamers, ribozymes, CRISPR guide RNA scaffolds and artificial ribosomal elements. The second is protein–DNA binding specificity prediction, which takes a fixed conformation of a protein–DNA complex and predicts the base preferred by the protein at each DNA position, and is used for analyzing transcription factor specificity, designing DNA-binding proteins and predicting targets of gene editing tools.

Previous deep learning methods, however, either focused on RNA design (such as gRNAde and RhoDesign) or on protein–DNA specificity (such as DeepPBS); no inverse folding model represented proteins and nucleic acids in a unified way and handled both tasks at once. This split not only fragmented the methodology but also severely limited the training data available for nucleic acid models: as of January 2025, the PDB contained only about 8,961 RNA-containing entries versus 235,538 protein-containing entries, a difference of more than 26-fold. If proteins and nucleic acids could be represented and trained jointly in one model, nucleic acid tasks would have a chance to benefit from cross-type transfer learning on the huge body of protein data. More fundamentally, RNA sequence design and protein–DNA specificity prediction can both be modeled under one paradigm: given backbone geometry, predict the probability distribution over nucleic acid bases.

## Part 2: Methodology: A unified biopolymer graph representation

NA-MPNN builds on ProteinMPNN. ProteinMPNN was originally designed for protein inverse folding: each amino acid residue is a graph node, edges connect residues that are close in space, message passing integrates the local geometric environment, and a suitable amino acid type is finally predicted for each position. NA-MPNN's key innovation is to extend this architecture into a **unified biopolymer graph representation**: each node can be a protein residue, a DNA base or an RNA base, and a single graph can represent standalone RNA/DNA, protein–RNA complexes, protein–DNA complexes, or any mixed system. Edges connect the 32 nearest neighbors in space, with the neighbor search using Cα atoms for proteins and C1' atoms for nucleic acids.

Two architectural choices set the model apart from the original ProteinMPNN:

**Explicit polymer type embeddings**

Each node receives a one-hot type label (protein / DNA / RNA / unknown), replacing ProteinMPNN's zero-initialized node features. Although the network could in principle infer polymer type from which backbone atoms are missing (RNA has O2' while DNA does not), explicit labeling greatly accelerates convergence during learning.

**A shared base vocabulary for DNA and RNA**

The nucleic acid output does not distinguish the deoxyribose form from the ribose form: A and DA share a token, as do C/DC, G/DG and T/DT(U), with one additional unknown nucleic acid token DX/RX. This lets DNA and RNA training data reinforce each other, which is especially important given how scarce RNA structural data is. The polymer type embedding supplies the information needed to tell DNA and RNA contexts apart. During training, isotropic Gaussian noise with σ = 0.1 Å is injected to suppress overfitting to crystallographic artifacts, and the probability mass of label smoothing is redistributed within polymer classes (never across proteins and nucleic acids), ensuring that protein nodes are never assigned nucleic acid tokens.

Edge features are obtained by encoding the pairwise distances between all backbone atom pairs of two nodes with radial basis functions (RBFs), capturing fine-grained local geometry. Protein nodes use five atoms, N, Cα, C, O and a virtual Cβ (the same as ProteinMPNN); nucleic acid nodes use the phosphate atoms (P, OP1, OP2), the sugar ring atoms (C1'–C5', O3'–O5', plus O2' of the 2'-OH for RNA) and a virtual base side-chain N atom (following the same design logic as the protein virtual Cβ). The choice of this backbone atom set is crucial: the model infers base preferences mainly from backbone geometry and never reads the full atomic structure of the real bases or protein side chains. This both avoids information leakage, since the model cannot 'peek' at the chemical identity of the real base to make its prediction, and allows it to operate when the sequence to be designed is entirely unknown. The encoder and decoder architectures follow ProteinMPNN and LigandMPNN, with the decoder using random-order autoregressive decoding, which supports partially fixing the sequence during design.

Although the design model and the specificity model share the same architecture, they are trained separately with different supervision signals and data augmentation strategies. The design model is trained toward the true sequence in the crystal structure (as a label-smoothed one-hot), encouraging the network to propose one best sequence for each position; the specificity model is trained toward experimentally determined position probability matrices (PPMs) from binding preference assays such as SELEX and protein binding microarrays (PBM), as well as PPMs distilled from RFNA/RFAA on the CIS-BP and TRANSFAC databases.

The specificity model also uses dedicated data augmentation: for protein–DNA/RNA complexes, the protein chains are randomly dropped with 50% probability and all nucleic acid positions are then set to a uniform PPM (0.25×4), teaching the network to recognize which base preferences genuinely come from protein contacts rather than from the nucleic acid backbone itself; non-interface DNA positions more than 5 Å from any protein side-chain atom are likewise set to a uniform PPM, focusing learning on base preferences that are truly governed by protein contacts. These carefully designed augmentations help the network distinguish 'base preferences induced by protein contacts' from 'base preferences inherent in nucleic acid backbone geometry', and are a key factor in the specificity model's substantial improvement.

For training data, both models use PDB structures that contain at least one nucleic acid chain, are resolved to ≤ 3.5 Å, and have a total polymer length ≤ 6,000 residues. For the design model, nucleic acid chains are clustered at 80% sequence identity and entire clusters are held out as the test set, ensuring strict sequence-level independence; for the specificity model, protein chains are clustered at 40% sequence identity, and the test set contains 228 RFNA/RFAA-distilled complexes with experimental PPMs.

## Part 3: Key Figure Analysis

### Figure 1: A unified biopolymer graph representation

**What this figure asks:** How does NA-MPNN encode proteins, DNA and RNA into a single graph?

![Figure 1: Architecture](pic/na_mpnn_sequence_design/page_6.png){: width="1130" height="460" loading="lazy" decoding="async"}

*Figure 1. The NA-MPNN architecture. (a) The input can be a protein/DNA/RNA backbone or any mixed complex. (b) A unified graph is built, with nodes carrying polymer type embeddings and edges encoded as RBFs of backbone atom distances. (c-d) The MPNN encoder-decoder outputs over a joint protein and nucleic acid vocabulary.*

Building on ProteinMPNN, **each node can be a protein residue, a DNA base or an RNA base**, so one graph can represent standalone nucleic acids, protein–RNA and protein–DNA complexes, or any mixed system, with edges connecting the 32 nearest neighbors in space.

Two key design choices: **explicit polymer type embeddings** (one-hot protein/DNA/RNA/unknown, which speeds up convergence) and a **shared DNA/RNA base vocabulary** (A and DA share a token, and so on), which lets scarce RNA data draw on protein and DNA data; the PDB has only about 1/26 as many RNA-containing structures as protein-containing ones. The model reads only backbone geometry and never the real bases, avoiding information leakage.

### Figure 2: Computational sequence design performance

**What this figure asks:** How much better is the structural fidelity of RNA sequences designed by NA-MPNN than that of specialized RNA models?

![Figure 2: Design performance](pic/na_mpnn_sequence_design/page_7.png){: width="1130" height="904" loading="lazy" decoding="async"}

*Figure 2. Computational sequence design performance. (a) An example of RNA inverse folding in a protein context. (b) Sequence recovery across four contexts. (c-d) Comparison with gRNAde and RhoDesign. (e-h) AF3-predicted OpenKnot scores, C1'-RMSD and pLDDT.*

* **Panel b**: recovery rates across the four contexts are similar (DNA-only 57.4%, RNA-only 60.5%, DNA in protein context 58.6%, RNA in protein context 55.4%), showing that the unified representation adapts to different polymer combinations. On RNA monomers it reaches 58.0%, ahead of gRNAde (51.7%) and slightly behind RhoDesign (66.7%).
* **Panels e–h are the key ones**: sequence recovery is not the highest, but **structural fidelity is clearly the best**. On the pseudoknot test set NA-MPNN has a median OpenKnot score of 83.2 (gRNAde 81.7, RhoDesign 72.9) and an AF3-predicted C1'-RMSD of 9.0 Å (vs 11.6 / 22.6 Å). The ultimate goal of design is folding correctly, not matching the natural sequence literally.

### Figure 3: Wet-lab validation in the OpenKnot challenge

**What this figure asks:** How does NA-MPNN compare with human players in the real OpenKnot experimental challenge?

![Figure 3: OpenKnot](pic/na_mpnn_sequence_design/page_8.png){: width="1110" height="684" loading="lazy" decoding="async"}

*Figure 3. Experimental validation in the OpenKnot challenge. (a) Distribution of experimental OpenKnot scores across 12 puzzles. (b-c) The W03 puzzle backbone and its SHAPE-Seq reactivity heatmap. (d) Scores and SHAPE agreement for each method.*

The challenge asked participants to design RNAs for 12 fixed backbone targets, which were then synthesized and validated by SHAPE-Seq chemical probing of the secondary structure (scored 0–100, with higher meaning better agreement). NA-MPNN submitted 10–15 sequences per target and achieved a **median experimental score of 89.9 across the 12 puzzles, the highest of any automated method** (gRNAde 80.7, wild type 87.0), on par with the 89.4 of Eterna human players. The computational advantage translated into genuinely correct RNA folding.

### Figure 4: Protein–DNA binding specificity prediction

**What this figure asks:** When the same model predicts protein–DNA binding specificity, is it more accurate than the specialized DeepPBS?

![Figure 4: DNA specificity](pic/na_mpnn_sequence_design/page_9.png){: width="966" height="880" loading="lazy" decoding="async"}

*Figure 4. Fixed-dock protein-DNA specificity prediction. (a) The data augmentation used in training (randomly dropping the protein, setting positions to uniform PPMs). (b) Motif logo comparison between Reference, NA-MPNN and DeepPBS. (c-d) MAE and cross-entropy on CIS-BP and TRANSFAC.*

* The augmentation in **Panel a** is elegant: protein chains are dropped with 50% probability and nucleic acid positions set to uniform PPMs, teaching the network to tell whether a base preference comes from protein contacts or from the nucleic acid backbone itself. In the motif logos of **Panel b**, NA-MPNN is closer to the Reference than DeepPBS is.
* **Panels c/d**: across 228 complexes NA-MPNN outperforms DeepPBS on every count, with an overall median **MAE of 0.53 (DeepPBS 0.86) and cross-entropy of 1.00 (1.44)**. Moreover, it uses only the backbone coordinates of the protein and DNA and never reads protein side chains, so it can serve as a fast first-pass predictor of base preference early in sequence design.

## Part 4: Key Contributions

NA-MPNN's contributions can be summarized in three points.

**It unifies proteins, DNA and RNA in a single graph.** On top of the ProteinMPNN message-passing architecture, polymer type embeddings plus a shared DNA/RNA base vocabulary let scarce RNA data draw on the large bodies of protein and DNA data, and they bring RNA sequence design and protein–DNA specificity prediction, two long-separated problems, under the single framing of 'given backbone geometry, predict the nucleic acid base distribution'.

**RNA design emphasizes structural fidelity over literal recovery.** Sequence recovery is not the highest, but the folded structures are closer to the target, and in the OpenKnot experimental challenge the **median score across 12 puzzles was 89.9, the best of any automated method and on par with human players**.

**Specificity prediction is more accurate using the backbone alone.** Across 228 complexes the overall **MAE of 0.53 and cross-entropy of 1.00 beat the specialized DeepPBS across the board**; because it reads no side chains there is no information leakage, so it can act as a first-pass base preference filter early in sequence design.

## Part 5: Limitations and Outlook

NA-MPNN currently trains two separate model variants, one for RNA design and one for protein–DNA specificity (sharing an architecture but using different supervision signals and data augmentation strategies), and the possibility of a single model handling both tasks has not yet been explored. The scarcity of RNA structural data remains the core bottleneck: RNA entries in the PDB amount to less than 4% of the protein entries, which severely limits how well the model can learn complex RNA tertiary structures, non-canonical base pairs and long-range base interactions. On the RNA monomer test set NA-MPNN's sequence recovery is below that of RhoDesign, possibly because the latter uses richer structural features. In addition, NA-MPNN only designs sequences on a fixed backbone and does not itself generate new backbones, so it needs to be paired with an upstream backbone generator such as RFDpoly. The authors have shown that de novo RNAs and protein–DNA complexes produced jointly by NA-MPNN and the RFDpoly nucleic acid backbone diffusion generator can be validated by electron microscopy, confirming agreement between the designed and predicted structures and indicating that the pipeline has real practical potential. Future directions include extending to RNA-binding protein specificity prediction, backbone-conditioned sequence design for single-stranded DNA, and joint sequence optimization of both protein and nucleic acid chains in protein–nucleic acid complexes, achieving cross-type biopolymer design in the full sense.

## About the Corresponding Author

Prof. David Baker, Department of Biochemistry, University of Washington, Director of the Institute for Protein Design (IPD), Investigator of the Howard Hughes Medical Institute (HHMI), 2024 Nobel Prize in Chemistry laureate. Prof. Baker led the development of the Rosetta protein modeling software suite and the series of tools including ProteinMPNN, LigandMPNN, RFdiffusion, and RoseTTAFold, and is a founding figure in the field of computational protein design. The first author Andrew Kubaney is a graduate student in Molecular Engineering and Biochemistry at the University of Washington, conducting research on nucleic acid inverse folding and sequence design at IPD. The second author Andrew Favor is also a graduate student in Molecular Engineering at IPD. Cameron Glasscock is a researcher in the Department of Biological Sciences at Rice University, focusing on the complete validation process of nucleic acid design from computation to experimentation. Justas Dauparas is a core developer of ProteinMPNN and LigandMPNN, providing the most direct technical foundation and accumulated experience for the architecture design and code implementation of NA-MPNN.

## Citation

Kubaney, A., Favor, A., McHugh, L., Mitra, R., Pecoraro, R., Dauparas, J., ... & Baker, D. (2025). RNA sequence design and protein–DNA specificity prediction with NA-MPNN. bioRxiv. https://doi.org/10.1101/2025.10.03.679414
