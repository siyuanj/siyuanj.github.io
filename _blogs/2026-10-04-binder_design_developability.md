---
layout: post
title: "Preprint | BoltzProt-1: De novo nanobody design with a 2.4-fold higher hit rate and good developability"
date: 2026-10-04
description: "BoltzProt-1 adds an interaction-scoring model, BoltzPPI, after generation, raising the confirmed-binder rate from 3.3% to 8.0% while 58% of confirmed binders pass every developability criterion."
tags: [binder design, nanobodies, developability, protein-protein interaction, candidate ranking]
lang: en
translation_key: binder_design_developability
---

# BoltzProt-1: Towards Efficient De Novo Binder Design with Good Developability

### Link: [full article](https://doi.org/10.64898/2026.06.23.733997)

Authors: Talip Uçar, Jack Bates, Yunguan Fu, ..., Saro Passaro

bioRxiv, June 2026

---
**Overview**

In computational design of protein binders such as nanobodies, generative models can already produce tens or even hundreds of thousands of candidate sequences, but picking out the molecules that genuinely bind the target remains the central bottleneck for experimental efficiency. BoltzProt-1 proposes a new angle: **add a scoring model dedicated to predicting protein-protein interactions, BoltzPPI, after the generation step, and rank candidates by binding probability rather than structural confidence**. With the same candidate pool and the same experimental budget, the confirmed-binder hit rate rises from 3.3% to 8.0%; on a separate 10-target panel it covers 7/10 targets; and 58% of confirmed binders pass every developability criterion, ahead of the 21% of clinical-stage VHH controls.

## Part 1: Research Question

Computational binder design usually has two steps: a generative model produces a large number of candidate sequences and complex structures, and then a small number of sequences are picked for experimental validation. The main difficulty today sits in the second step, ranking and selection. Traditional approaches rely on confidence metrics from structure prediction models (pLDDT, PAE, interface confidence and so on) to judge candidate quality. These metrics answer the question "how confident is the model in this complex structure", but high structural confidence does not mean the molecule will actually bind in experiment. A generative model may already have real binders among its tens of thousands of candidates, yet conventional scoring fails to rank them near the top. The real bottleneck is the accuracy of prioritization.

This gap is exactly where BoltzProt-1 starts. Its core hypothesis is that **there is a systematic discrepancy between structure prediction confidence and experimental binding probability**, and that training a scoring model to predict protein-protein interactions directly can substantially raise the hit rate without increasing the experimental budget. For real drug discovery this matters a great deal: experimental validation costs far more than computational generation, and every percentage point of hit rate saves a large amount of experimental resource.

Beyond binding the target, whether a binder is suitable for further development also depends on developability properties such as stability, solubility, aggregation propensity and nonspecific binding. Many design studies report only whether a binding signal appeared, without systematically assessing these critical properties. Alongside hit rates, BoltzProt-1 subjects its confirmed binders to a comprehensive developability panel of 9 assays, which brings the results closer to what the early development stage of a real therapeutic molecule demands.

## Part 2: Methodology: the BoltzPPI scoring model

BoltzProt-1 has two core components. The first is a refined version of the BoltzGen all-atom generative model, which performs binder sequence design and complex structure prediction at the same time and can produce tens to hundreds of thousands of VHH (nanobody / single-domain antibody) candidates per target. The second is the paper's most important methodological contribution: **BoltzPPI**, a protein-protein interaction prediction head built on top of the representations of the Boltz-2 structure prediction network.

BoltzPPI takes as input per-residue single-token features, pairwise features for residue pairs, the predicted 3D coordinates, the matrix of minimum inter-token distances, and mask information distinguishing the binder from the target protein. These features put the emphasis on the binding interface, keeping the model focused on the geometry and chemistry of inter-chain contacts. After processing by a 4-block Pairformer network (16 attention heads per block, dropout 0.25), the model pools the pair features over all inter-chain residue pairs and the token features over the binder and the target separately; the two pooled representations are concatenated and passed through an MLP that outputs a binding probability p = σ(ŷ), where σ is the sigmoid function. The goal is not to predict K<sub>d</sub> precisely, but first to judge whether a proposed complex plausibly represents a real interaction.

**Training strategy**

BoltzPPI uses multi-view training: 50% of samples use both coordinate information and the trunk's pairwise features, while the other 50% drop the normalized trunk pairwise representation, forcing the model to learn more from 3D geometric features and avoid over-relying on the internal confidence signal of the underlying structure prediction network. The overall loss trains structure confidence prediction and the PPI classification task jointly, with PPI classification using a focal loss to reduce the dominance of easy examples. Positives include protein-protein complexes from the PDB, patent-derived complexes and antibody-antigen complexes; negatives are synthetically generated protein pairs expected not to interact.

The full pipeline runs as: generate many candidates → predict complex structures → score with BoltzPPI → select high-scoring candidates → validate experimentally. The key difference from conventional approaches is that ranking shifts from "does the structure look reasonable" to "is this candidate more likely to show binding in experiment". Intuitively, BoltzPPI tries to judge whether two protein surfaces are shape-complementary, whether the arrangement of interface residues makes sense, and whether inter-chain distances look like those of a real protein complex: in short, whether the interface looks like a real interaction or like a structure the model forced together.

## Part 3: Key Figure Analysis

### Figure 1: Hit rate comparison on low-homology targets

**What this figure asks:** With a fixed candidate pool and a fixed experimental budget, how many more real binders can be picked out by changing only the ranking model?

![Figure 1: Hit rate on low-homology targets](pic/binder_design_developability/page_4.png){: width="1100" height="320" loading="lazy" decoding="async"}

*Figure 1. Hit rates on the BoltzGen low-homology target panel. (a) Screening hits (light) and confirmed binder (dark) rates per target. (b) Overall confirmed-binder hit rate.*

Ten low-homology targets, with both methods drawing from the same BoltzGen candidate pool, each testing 15 designs, and with no overlap between the two selections, so this figure measures strictly what "changing only the ranking model" contributes.

* **Panel b**: BoltzProt-1's confirmed-binder hit rate is **8.0% (12/150), about 2.4 times BoltzGen's 3.3% (5/150)**. Note that the paper distinguishes "screening hits" (a signal on SPR/BLI, which may include artifacts) from "confirmed binders" (orthogonally validated with the immobilization orientation flipped), the latter being the stricter standard. BoltzPPI ranking alone raises the number of confirmed targets from 2/10 to 3/10.

### Figure 2: End-to-end performance on the Chai-2 panel

**What this figure asks:** Running the full pipeline on 10 targets, how many targets do BoltzProt-1, BoltzGen and Chai-2 each cover?

![Figure 2: Chai-2 target panel](pic/binder_design_developability/page_6.png){: width="912" height="264" loading="lazy" decoding="async"}

*Figure 2. Nanobody design on the Chai-2 VHH targets. (a) Screening hit rate per target. (b) Fraction of targets with at least one screening hit. Chai-2 numbers are taken from its published VHH results.*

BoltzProt-1 obtains at least one screening hit on **7/10 targets**, ahead of Chai-2's 6/10 and BoltzGen's 3/10. But this set is a full end-to-end comparison (BoltzProt-1 generates about 240k candidates per target, BoltzGen 60k, and Chai-2 uses its own pipeline), so the whole improvement cannot be credited to BoltzPPI. SAE1 stands out most with 7 hits; on S100B, by contrast, BoltzGen gets a hit and BoltzProt-1 does not reproduce it; on LEP and ONCM all three score zero, showing that binder design depends heavily on the target surface and on prior structural knowledge.

### Figure 3: Similarity of the targets to known complexes in the PDB

**What this figure asks:** How "unfamiliar" are these targets, and how many homologs of the binding site can be found in the PDB?

![Figure 3: Target similarity to the PDB](pic/binder_design_developability/page_6b.png){: width="920" height="394" loading="lazy" decoding="async"}

*Figure 3. Similarity of the targets to bound proteins in the PDB. For each target, the similarity of the binding site to bound structures in the PDB (green) and the number of bound homologs in the PDB (blue).*

On the left, the BoltzGen low-homology targets (IDI2, MZB1, PMVK, AMBP) have **low binding-site similarity and few bound homologs in the PDB**, which tests generalization to unfamiliar binding sites much harder; on the right, the Chai targets generally have richer structural priors. This explains why confirmed hits are harder on the low-homology panel, where coverage only reaches 4/10.

### Figure 4: Novelty of the designed sequences

**What this figure asks:** Are these designs simply copying known CDR sequences from databases?

![Figure 4: CDR edit distance](pic/binder_design_developability/page_7.png){: width="912" height="354" loading="lazy" decoding="async"}

*Figure 4. CDR edit distance between the designs and known antibodies/nanobodies in SAbDab. Green is CDR1+2+3 combined, blue is CDR3 only; larger distances mean more novelty.*

For each confirmed binder and screening hit, the minimum edit distance between its CDRs and known SAbDab sequences was computed. Every recovered design has a **minimum CDR3 edit distance of at least 4**, with larger distances when CDR1/2/3 are combined, showing that these designs are generated truly de novo rather than copied from known CDRs in a database.

### Figure 5: Nine developability assays

**What this figure asks:** How do these designed binders perform on developability metrics such as stability, solubility and aggregation?

![Figure 5: Developability assays](pic/binder_design_developability/page_8.png){: width="920" height="984" loading="lazy" decoding="async"}

*Figure 5. Developability assays. Distributions for the BoltzProt-1 binders on (a) aSEC monomer purity, (b) PDI dispersity, (c) HIC hydrophobicity, (d) BVP ELISA nonspecific binding, (e) AC-SINS self-interaction and (f) Tm1 thermal stability, compared with the IgG/VHH controls and BoltzGen.*

Each of the six violin plots corresponds to one metric, annotated with the "Better" direction and the pass threshold (black dashed line). The BoltzProt-1 points sit clearly **on the good side for aSEC monomer purity and Tm1 thermal stability**, nearly all above the 95% and 60°C thresholds; on PDI, HIC and AC-SINS they are comparable to the clinical controls, with a few molecules on the hydrophobic side. Everything was tested in the VHH-Fc fusion format.

### Figure 6: The developability funnel

**What this figure asks:** Taking all developability criteria together, how many designs make it through, and where do they get stuck?

![Figure 6: Developability funnel](pic/binder_design_developability/page_9.png){: width="1100" height="368" loading="lazy" decoding="async"}

*Figure 6. Developability funnel. 58% (7/12) of the BoltzProt-1 confirmed binders pass all developability criteria, compared with 40% (2/5) for BoltzGen.*

**7/12 (58%)** of the confirmed binders pass all 9 criteria, ahead of BoltzGen's 40%, clinical IgG's 25% and clinical VHH's 21%.

The funnel shows that the main attrition step is **HIC hydrophobicity**: almost nothing is lost at the thermal stability and monomer purity stages, while the HIC stage drops from 11 to 7 (4 molecules eliminated for excessive surface hydrophobicity). The direction for future optimization therefore lies in reducing hydrophobic surface patches.

## Part 4: Key Contributions

A molecule that binds its target is useless if it cannot be expressed, purified, stored stably or manufactured at scale. The authors carried out a systematic biophysical evaluation of the confirmed binders from the low-homology targets, covering 9 metrics: aSEC monomer purity (≥95%), PDI polydispersity index (&lt;0.8), Tm1 and Tm2 thermal melting temperatures (≥60°C and ≥70°C respectively), Tonset onset temperature of conformational change (≥55°C), Tagg aggregation onset temperature (≥60°C), HIC hydrophobic interaction chromatography retention time (&lt;15 min), BVP ELISA nonspecific binding (&lt;1.0) and AC-SINS self-interaction wavelength shift (&lt;12 nm). The controls comprise 12 clinical-stage IgGs, 24 clinical-stage VHHs and 5 BoltzGen confirmed binders, and all designed VHHs were tested in the VHH-Fc fusion format.

On the combined pass rate BoltzProt-1 comes out best: **7/12 (58%)** of its confirmed binders pass all 9 criteria, ahead of BoltzGen's 2/5 (40%), the clinical IgG controls' 3/12 (25%) and the clinical VHH controls' 5/24 (21%). The strength of this developability result deserves attention: in the Chai-2 developability benchmark, the initial monomer-purity gate (≥90%) alone eliminated 37% of candidates, whereas the BoltzProt-1 confirmed binders lose almost nothing at the stricter 95% threshold.

Looking at the screening funnel, BoltzProt-1's main attrition comes from the HIC hydrophobicity assay: of the 12 confirmed binders, 11 remain after PDI filtering, the thermal stability (Tm1 ≥60°C, Tm2 ≥70°C, Tonset ≥55°C, Tagg ≥60°C) and monomer purity (SEC ≥95%) stages lose essentially nothing, but the HIC stage drops from 11 to 7, with 4 molecules eliminated for high surface hydrophobicity. By contrast, failures among the clinical-stage controls come more from polyspecificity and self-interaction metrics. This indicates that BoltzProt-1 already performs excellently on thermal stability and monomer purity, and that future optimization can focus on reducing the exposed hydrophobic surface patches of the designed molecules.

## Part 5: Limitations and Outlook

First, on the hardest low-homology panel the full pipeline ultimately covers confirmed binders for only 4/10 targets, still clearly short of "reliable design against any target". Second, the 7/10 on the Chai-2 panel refers to screening hits rather than strictly confirmed binders, so the two sets use different criteria and 7/10 cannot be compared directly with 4/10. Third, the developability statistics rest on small samples (only 12 for BoltzProt-1 and 5 for BoltzGen), so the difference between 58% and 40% needs validation at larger scale. Fourth, the paper does not systematically summarize the affinity distribution (K<sub>d</sub>, k<sub>on</sub>, k<sub>off</sub>) of all confirmed binders, reporting hit rates and sensorgrams instead, which demonstrates more that "binders can be found" than that every design has therapeutic-grade affinity. Fifth, all designed VHHs were tested in the VHH-Fc fusion format, whereas a final product might use a monomeric VHH, a multivalent VHH or another fusion format, and a change of format may affect developability metrics such as aggregation and self-interaction.

Overall, BoltzProt-1's most important contribution is demonstrating a practical and powerful point: once you can generate hundreds of thousands of candidates, what really matters is using a scoring function better aligned with experimental binding (BoltzPPI) to find the few molecules worth paying to validate. The fixed-candidate-pool experiment shows clearly that improving the ranking strategy alone raises the hit rate by 2.4 times, meaning that many valuable candidates may already exist in the generative model's output and were simply missed by conventional structural confidence metrics. At the same time, the 58% developability pass rate shows that a higher hit rate did not come at the cost of molecular stability or manufacturability, and that binding and early developability can be obtained together within the same design pipeline. The full BoltzProt-1 pipeline is publicly available through the Boltz API and the Boltz Lab platform.

## About the Corresponding Authors

The corresponding authors of this paper are Talip Uçar, Gabriele Corso and Saro Passaro, all at Boltz PBC. Gabriele Corso received his undergraduate degree from the University of Cambridge and is a PhD student at MIT (MIT CSAIL) advised by Tommi Jaakkola and Regina Barzilay; his research applies geometric deep learning to molecular design, and he is a core author of DiffDock (a diffusion model for molecular docking) and the Boltz-1/Boltz-2 series for biomolecular structure prediction, as well as a main contributor to the BoltzGen general binder design model. Talip Uçar previously worked on machine learning for drug discovery at BioNTech, focusing on self-supervised learning and representation learning for tabular data, with SubTab among his representative works, and he is now a core contributor at Boltz PBC. Saro Passaro is likewise a core member of Boltz PBC and has worked on projects including Boltz-2 structure prediction and BoltzGen binder design, with research spanning generative protein design and molecular interaction prediction.

## Citation

Uçar, T., Bates, J., Fu, Y., Shi, W., Stark, H., Nava, D., ... & Passaro, S. (2026). BoltzProt-1: Towards Efficient De Novo Binder Design with Good Developability. bioRxiv. https://doi.org/10.64898/2026.06.23.733997
