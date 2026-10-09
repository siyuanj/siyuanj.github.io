---
layout: post
title: "Protein Science 2026 | DeepSSInter: Predicting inter-protein residue contacts with a structure-aware protein language model"
date: 2026-09-17
description: "DeepSSInter combines ESM2, SaProt, and geometric transformers to predict inter-protein residue contacts without MSA, outperforming existing methods in accuracy while being two orders of magnitude faster."
tags: [protein-protein interaction, contact prediction, protein language models, structure-aware, docking]
lang: en
translation_key: deepssinter_contact_prediction
---

# DeepSSInter: Protein–protein contact prediction with a structure-aware protein language model

### Link: [full article](https://doi.org/10.1002/pro.70667)

Authors: Derek Huang, Jiamin Lv, Xuan Yao, Peicong Lin, Sheng-You Huang

Protein Science, 2026

---
**Introduction**

Inter-protein residue contact prediction is a critical step toward understanding the structure and function of protein complexes, yet most existing methods rely on multiple sequence alignments (MSA), suffering from high computational cost, insufficient homologous sequences, and the difficulty of pairing sequences for heteromeric complexes. This paper presents **DeepSSInter — an MSA-free interface contact prediction method that integrates the ESM2 and SaProt protein language models with a geometric graph transformer**. On both homomeric and heteromeric dimer test sets, DeepSSInter achieves superior top-k prediction accuracy over DeepInter, CDPred, GLINTER, and other methods, while running approximately two orders of magnitude faster at inference. Incorporating predicted contacts as distance restraints into protein docking significantly improves the quality of complex modeling.

## Part 1: Research Question

Proteins rarely act alone in the cell — signal transduction, metabolic regulation, immune response, gene expression control, and other vital processes all depend on precise physical interactions between proteins. The human proteome is estimated to harbor hundreds of thousands of protein–protein interactions (PPIs), the vast majority of which lack experimentally determined structures. Identifying which residues participate in the inter-protein contact interface is a key step toward elucidating complex structure and function. The task of interface contact prediction is: given two interacting proteins A (length L_A) and B (length L_B), output an L_A × L_B matrix in which each element represents the probability that residue i of protein A contacts residue j of protein B (defined as any heavy-atom pair within 8.0 Å). Accurate contact predictions can guide protein docking (providing distance restraints to narrow the search space), accelerate complex structure modeling, identify functional binding sites, and inform mutational design and drug target discovery.

Existing methods represented by DeepInter, CDPred, and GLINTER typically exploit coevolutionary signals in MSAs: if two residues mutate in a correlated manner during evolution, they are likely in spatial contact. However, MSA-based approaches face three major bottlenecks. First, searching for homologous sequences, building MSAs, and extracting coevolutionary features are computationally expensive, leading to slow inference. Second, for proteins with few homologs (e.g., de novo designed proteins, orphan proteins, or proteins from data-scarce organisms), poor MSA quality directly undermines prediction accuracy. Third — and most challenging — for heteromeric complexes (interactions between two different proteins), even when individual monomer MSAs are available, one must correctly determine which sequences from different species are true interacting partners — a long-standing problem in complex prediction, where incorrect pairing introduces substantial noise. The authors therefore ask: can inter-protein residue contacts be predicted entirely without MSA, using only single sequences and monomer structures?

## Part 2: Methodology: MSA-free prediction by fusing ESM2, SaProt, and geometric graphs

DeepSSInter takes the amino acid sequences and monomer 3D structures of two proteins as input and outputs a cross-protein residue contact probability matrix. The model extracts complementary information through four parallel feature pathways.

**Pathway 1: ESM2 sequence features.** The two protein sequences are individually fed into ESM2 (esm2_t33_650M_UR50D, 650 million parameters, 33-layer Transformer) to obtain a 1280-dimensional contextual representation for each residue and a 660-dimensional attention matrix (33 layers × 20 attention heads). For protein A of length L_A, the residue representation has dimensions L_A × 1280 and the attention matrix L_A × L_A × 660. Through large-scale masked language model pretraining on the UniRef50 database, ESM2 has implicitly learned evolutionary patterns, structural propensities, and functional motifs from hundreds of millions of sequences; its attention matrices have been shown to correlate significantly with intra-protein residue contact maps.

**Pathway 2: SaProt structure-aware features.** Monomer 3D structures are first converted by Foldseek into structural alphabet tokens — a discretization of local geometric environments (backbone dihedral angles, inter-residue spatial relationships) into a 20-letter code — which are then interleaved with amino acid sequence tokens to form the SaProt input. For example, a residue is simultaneously described as 'it is alanine' and 'it sits in the middle of an alpha helix.' **SaProt is the single most important feature module** (confirmed by ablation), because its vocabulary jointly encodes amino acid identity and local structural context, yielding features that explicitly carry 3D folding information — essentially layering structural priors on top of the sequence knowledge learned by ESM2.

**Pathway 3: Geometric graph transformer.** Each monomer protein is represented as a residue graph — residues are nodes, and edges connect residues that are sequential neighbors or within a distance threshold in 3D space, with node and edge features encoding residue coordinates, orientation vectors, and distances. A Geometric Transformer (an architecture that performs attention on graph structures while maintaining geometric equivariance) extracts a 128-dimensional geometric representation for each residue, directly modeling the folding topology and inter-residue spatial relationships on the 3D structure graph.

**Pathway 4: Intra-monomer distance matrix.** Pairwise Cα distances are extracted from each monomer structure and encoded into multi-channel feature vectors via Gaussian radial basis functions (RBF), providing global distance information within each protein. The advantage of RBF encoding is that it transforms exact distance values into smooth feature representations, making it easier for the model to learn nonlinear relationships between distance and contact.

Additionally, the model includes a **complex branch**: the two protein sequences are concatenated with a linker and re-input to ESM2 and SaProt (where SaProt's structural alphabet positions are filled with UNK tokens because the true complex structure is unknown), extracting cross-protein contextual representations — enabling the model to implicitly learn inter-protein interaction patterns from the language models.

All features are concatenated along the channel dimension and processed by a **ResNet-Inception module** (multi-scale convolutional fusion) and a **Triangle-aware module** (modeling the triangular geometric constraint that 'if residue i contacts residue j and residue j contacts residue k, then the spatial relationship between i and k is constrained,' inspired by AlphaFold2's Evoformer) to produce the final contact probability map.

## Part 3: Key Figure Analysis

### Figure 1: Architecture with four parallel feature pathways

**What this figure asks:** How does DeepSSInter extract four complementary features from sequence and structure to predict cross-protein contacts?

![Figure 1: Architecture](pic/deepssinter_contact_prediction/page_3.png){: width="1008" height="564" loading="lazy" decoding="async"}

*Figure 1. DeepSSInter workflow. Given the sequences and monomer structures of two proteins, features are extracted via four pathways — ESM2, SaProt, geometric graph transformer, and intra-monomer distance matrix — plus a complex branch, then concatenated and processed through ResNet-Inception and Triangle-aware modules to output the contact map.*

The four pathways: **ESM2** extracts contextual representations and attention matrices from single sequences (implicitly encoding evolutionary patterns); **SaProt (the largest contributor)** uses Foldseek to convert structures into 'structural alphabet' tokens interleaved with sequence tokens, so that features explicitly carry 3D folding information; **Geometric graph transformer** models folding topology on the residue graph; **Intra-monomer distance matrix** encodes Cα distances via RBF.

An additional complex branch concatenates the two sequences with a linker and passes them through ESM2/SaProt. All features are concatenated and processed by ResNet-Inception (multi-scale convolution) and a Triangle-aware module (leveraging triangular geometric constraints inspired by AlphaFold2's Evoformer) to produce the contact map. **The entire pipeline is completely MSA-free.**

### Figure 2: F1 comparison with leading methods

**What this figure asks:** On homomeric and heteromeric dimers, how much does DeepSSInter improve contact prediction over existing methods?

![Figure 2: F1 comparison](pic/deepssinter_contact_prediction/page_5.png){: width="870" height="302" loading="lazy" decoding="async"}

*Figure 2. F1-scores of each method on homomeric (a) and heteromeric (b) dimer test sets when experimental structures are used as input.*

DeepSSInter shows the tallest bars in both panels, leading DeepInter, CDPred, GLINTER, DeepHomo, and others. On homomeric dimers, it achieves the best scores across all seven top-k metrics (top-1 precision **83.4%**, roughly 3%–4% above DeepInter); when AlphaFold2-predicted structures are used as input, performance drops (top-1 71.6%) but remains the highest. Heteromeric dimers are harder overall (top-1 34.7%), yet **DeepSSInter's improvement over DeepInter is even larger (1.9%–14.1%)** — structure-aware features provide a more pronounced advantage when MSA pairing is difficult.

### Figure 3: Comparison with other methods that also bypass paired MSA

**What this figure asks:** Does DeepSSInter still lead when compared with other interface contact methods under more stringent settings?

![Figure 3: F1 comparison (2)](pic/deepssinter_contact_prediction/page_7.png){: width="870" height="308" loading="lazy" decoding="async"}

*Figure 3. F1-score comparison of DeepSSInter with DeepInter, CDPred, and GLINTER on homomeric (a) and heteromeric (b) test sets.*

In this more focused comparison, DeepSSInter (leftmost bar) clearly outperforms DeepInter, CDPred, and GLINTER on both homomeric (a, F1 ≈ 0.225) and heteromeric (b, F1 ≈ 0.148) sets. **In terms of speed, it is roughly two orders of magnitude faster** — traditional methods must first run HHblits/JackHMMER to search databases and build MSAs (minutes to tens of minutes), whereas DeepSSInter skips this step and requires only seconds for inference, making it suitable for proteome-scale batch prediction.

### Figure 4: Performance across different topology types

**What this figure asks:** Does prediction difficulty differ for α, β, and α+β fold types?

![Figure 4: Topology](pic/deepssinter_contact_prediction/page_8.png){: width="1004" height="244" loading="lazy" decoding="async"}

*Figure 4. F1-scores across different protein topology types (Alpha / Beta / Alpha+Beta), with three panels corresponding to different evaluation settings.*

When broken down by fold type, **α and α+β proteins yield notably higher F1 than pure β proteins** (the Beta bar is the shortest). The authors attribute this partly to the distribution of topology types in the training data — pure β structures are relatively underrepresented and their contact patterns are harder to learn.

### Figure 5: Predicted contacts applied to docking

**What this figure asks:** How much does feeding predicted contacts as restraints to HADDOCK docking improve docking quality?

![Figure 5: Docking](pic/deepssinter_contact_prediction/page_9.png){: width="990" height="692" loading="lazy" decoding="async"}

*Figure 5. (a) DockQ scores for 27 homomeric dimer targets with and without contact restraints. (b) Target T85: structural comparison between the restrained model (DockQ 0.604) and the unrestrained model (DockQ 0.012).*

The top-L/5 residue pairs ranked by predicted probability are converted into 'heavy-atom distance &lt; 8 Å' restraints and supplied to HADDOCK. **Panel a**: with restraints (orange), most targets achieve markedly higher DockQ than without restraints (blue), and **the top-1 docking success rate (DockQ ≥ 0.23) rises from 29.6% to 51.9%**. **Panel b**: for target T85, restraints yield a medium-accuracy structure with DockQ 0.604, whereas the unrestrained result is only 0.012 (completely wrong) — the contact restraints pull docking from an incorrect orientation back to the correct interface.

### Figure 6: Ablation — which module matters most

**What this figure asks:** Among SaProt, geometric graph, ESM2, and the complex branch, which removal causes the largest drop?

![Figure 6: Ablation](pic/deepssinter_contact_prediction/page_10.png){: width="752" height="918" loading="lazy" decoding="async"}

*Figure 6. Precision at various top-k thresholds for different ablation models on homomeric (a) and heteromeric (b) test sets, comparing the baseline with variants lacking gt/ESM/SaProt and other components.*

The blue baseline (full model) achieves the highest or near-highest scores at every top-k. The importance ranking is consistent across homomeric and heteromeric sets: **SaProt contributes the most** (removing it causes the largest drop), followed by the geometric graph transformer, then ESM2. This demonstrates that for interface contact prediction, **explicit structural information is more critical than pure sequence information** — SaProt specifically layers 3D geometric priors on top of ESM2's sequence knowledge.

## Part 4: Key Contributions

The contributions of DeepSSInter can be summarized in three points.

**The first MSA-free interface contact prediction framework.** It completely bypasses the cumbersome and error-prone pipeline of searching for homologous sequences, building MSAs, and pairing heteromeric chains, relying solely on single sequences plus monomer structures and using ESM2 + **SaProt (a structure-aware language model)** + a geometric graph transformer to provide complementary information.

**Winning on both accuracy and speed.** On homomeric and heteromeric dimer test sets, top-k accuracy comprehensively surpasses DeepInter, CDPred, GLINTER, and others, with especially pronounced gains in heteromeric scenarios; **inference is approximately two orders of magnitude faster than MSA-dependent methods**, making it suitable for proteome-scale batch prediction.

**Directly beneficial for docking.** By feeding predicted contacts as distance restraints to HADDOCK, the top-1 docking success rate on 27 homomeric dimer targets rises from 29.6% to 51.9%, demonstrating that the predictions carry practical structural biology value.

## Part 5: Limitations and Outlook

Through case-by-case analysis, the authors find that the model performs poorly on complexes with small interface areas or involving intrinsically disordered proteins (IDPs) — in these cases, proteins lack stable monomer structures or folded states, so the structural alphabet generated by Foldseek and the graph representation from the Geometric Transformer cannot provide effective information, and single-sequence language model representations also fail to capture transient interaction features. Furthermore, the model has GPU memory constraints (one target, T144, in the Heterodimer99 set was excluded due to out-of-memory errors caused by excessive sequence length), and processing very long protein complexes would require segmented prediction, mixed-precision computation, or dimensionality reduction strategies. The authors note that developing specialized feature extraction modules for intrinsically disordered regions and transient protein–protein interactions is an important direction for future improvement.

## About the Corresponding Author

Sheng-You Huang, one of the corresponding authors of this article, is affiliated with the School of Physics at Huazhong University of Science and Technology (the other corresponding author is Peicong Lin from the same institution). He received his bachelor's degree from the Department of Chemistry at Wuhan University, and subsequently obtained his doctoral degree from the Wuhan Institute of Physics and Mathematics, Chinese Academy of Sciences, followed by postdoctoral research at Huazhong University of Science and Technology and University of Kansas. Huang's research focuses on computational structural biology, with emphasis on the development of protein-protein docking algorithms, molecular recognition scoring functions, and biomolecular interaction prediction methods. Huang's laboratory has been dedicated to developing protein docking and interface contact prediction tools, and has successively introduced the DeepHomo, DeepHomo2.0, and DeepInter series of methods. DeepSSInter presented in this article is the latest advancement in this series, achieving for the first time an MSA-free approach in protein interface contact prediction. First author Derek Huang and second author Jiamin Lv are also from the School of Physics at Huazhong University of Science and Technology, respectively responsible for model architecture design and implementation, as well as dataset construction and evaluation and other core work; Derek Huang's current affiliation is the School of Electrical and Computer Engineering at Georgia Institute of Technology.

## Citation

Huang, D., Lv, J., Yao, X., Lin, P., & Huang, S. Y. (2026). DeepSSInter: Protein–protein contact prediction with a structure-aware protein language model. Protein Science, 35(7), e70667. https://doi.org/10.1002/pro.70667
