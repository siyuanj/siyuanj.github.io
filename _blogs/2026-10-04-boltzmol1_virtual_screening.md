---
layout: post
title: "bioRxiv 2026 | BoltzMol-1: Low-budget prospective virtual screening with only dozens of molecules tested per target"
date: 2026-10-04
description: "An optimized Boltz-2 pipeline with medicinal chemistry filters and ADMET models identified active molecules or binders for 6 of 10 prospective targets while testing only 28-96 molecules each."
tags: [virtual screening, cofolding models, boltz-2, admet prediction, hit discovery]
lang: en
translation_key: boltzmol1_virtual_screening
---

# BoltzMol-1: Towards Reliable Virtual Screening for Fast and Cost-Effective Hit Discovery

### Link: [full article](https://doi.org/10.64898/2026.07.04.736485)

Authors: Noah Getz, Geoffrey Smith, Avene Colgan, ..., Saro Passaro

bioRxiv, July 6, 2026

---
**Overview**

High-throughput screening usually requires testing tens of thousands to millions of molecules, with hit rates of only about 0.01%-0.14%. BoltzMol-1 proposes a very different route: **built around an optimized version of Boltz-2 for protein-small molecule cofolding and affinity prediction, combined with medicinal chemistry filtering, removal of 'virtual PAINS' and early ADMET assessment, it compresses the experimental budget to just 28-96 molecules per target**. In prospective validation on 10 targets (most unrepresented in the training data), 6 targets yielded functionally active molecules or binders, including 12 antagonists at GLP-2R (best IC50 about 70 nM) and 13 active molecules at MRGPRX2. This is the largest prospective virtual screening study to date based on a protein-ligand cofolding model, and it reports both successful and failed targets in full, an important reference point for the field.

## Part 1: Research Question

Conventional high-throughput screening (HTS) usually has an extremely low hit rate (about 0.01%-0.14%) and requires screening tens of thousands to millions of molecules from large libraries, which is costly, slow and demanding on infrastructure. Existing machine learning approaches to virtual screening perform well on retrospective datasets but generally suffer from several serious evaluation biases: test sets are chemically too similar to training sets (data leakage), evaluation targets concentrate on popular protein families that already have abundant ligand data (kinases, GPCR orthosteric sites), and improvements in metrics do not necessarily translate into higher experimental hit rates. More importantly, the vast majority of methods stop at retrospective validation and lack true prospective validation, where one predicts first, then purchases molecules, and finally tests the hit rate experimentally.

The design philosophy of BoltzMol-1 is to answer a more practical question: **if only a few dozen molecules (28-96) can be purchased and tested per target, can the model rank the genuinely active ones at the very top?** This requires the screening pipeline to consider three things at once: binding prediction, commercial availability of the molecules and basic drug-like properties. The paper's greatest value lies in prospective experimental validation across 10 targets, with 6 successes and 4 failures reported in full, providing first-hand data on the applicability limits of current protein-ligand cofolding models in real discovery settings. The 10 targets span many protein types: GPCRs (class A and class B), a kinase, a pseudokinase, a transcription factor, autophagy proteins and an ion channel, and most of them have no or only a few small-molecule co-crystal structures in the PDB training data.

## Part 2: Methodology: Optimized Boltz-2 + medicinal chemistry filters + virtual PAINS

The complete BoltzMol-1 screening pipeline has five steps: preprocessing of commercial libraries → medicinal chemistry filtering → Boltz-2 cofolding and composite scoring → removal of 'virtual PAINS' → ADMET assessment and candidate selection. The core engine is an optimized Boltz-2 protein-small molecule cofolding model that, for each protein-ligand combination, simultaneously predicts the three-dimensional structure of the complex, a binding affinity signal and a small-molecule binding confidence, after which multiple model outputs are combined with weights into a single composite ranking score.

Relative to default Boltz-2, BoltzMol-1 makes four key improvements:

**(1) Optimized inference parameters and composite scoring**: the weighting of different model outputs (binding confidence, affinity prediction, structural reliability) was systematically tuned on internal retrospective screening tasks so that the composite score ranks better than any single metric.

**(2) Medicinal chemistry filtering**: PAINS, reactive groups, molecules with extreme molecular weights (too large or too small) and molecules with too many rotatable bonds are removed before the model runs, so that computation is not wasted on molecules that could not be developed anyway.

**(3) Removal of 'virtual PAINS'**: this is the most novel methodological concept in the paper. After running screens against multiple unrelated targets, the authors tally which molecules always appear near the top of the rankings. Such molecules may be perfectly well behaved in conventional experiments (they do not interfere with assay signals) but they systematically 'fool' the ranking system of the cofolding model, a kind of false positive at the model level. Identifying and excluding them should raise the true hit rate among the remaining candidates.

**(4) Faster inference**: more molecules can be screened within a fixed compute budget. The paper also provides two screening modes: exhaustive screening of fixed commercial libraries (for example Mcule with about 1.5 million molecules and Enamine with about 4 million), and generative active-learning screening aimed at ultra-large virtual spaces (such as Enamine REAL, with billions of make-on-demand molecules). The latter explores chemical space efficiently through an iterative predict-sample-update loop without scoring every molecule.

**Early ADMET assessment models**

The authors also developed three ADMET prediction models as a candidate filtering layer: **LogD** (lipophilicity, test-set Pearson r = 0.91), **kinetic solubility KSol** (designed as a high/medium/low three-way classification, with a high-solubility precision of 0.74) and **Caco-2 permeability** (MAE = 0.46). All three use a GPS-style graph Transformer architecture that integrates UniPKa atom-level acid-base predictions and RDKit three-dimensional conformer information into the node and edge features of the molecular graph.

The authors specifically point out serious data leakage in common ADMET benchmarks: under the standard scaffold split, roughly 80% of LogD, 71% of LogS and 47% of Caco-2 test molecules are chemically very similar to training molecules (Tversky similarity ≥ 0.6). They therefore adopted a stricter document-level split with manual review, under which model performance drops but remains useful.

## Part 3: Key Figure Analysis

### Figure 1: Overview of the prospective screen across 10 targets

**What this figure asks:** With only a few dozen molecules purchased per target, how many of the 10 targets actually yielded active molecules?

![Figure 1: Overview of the 10-target screen](pic/boltzmol1_virtual_screening/page_2.png){: width="896" height="582" loading="lazy" decoding="async"}

*Figure 1. Overview of the prospective virtual screen. For each of the 10 targets the figure shows the predicted protein-ligand complex, the number of molecules tested, the number of confirmed actives and the experimental method (STAT6, GLP-2R, MRGPRX2, mGlu4 PAM, AMY3, ROR1, LC3B/GABARAP, PknB, MALT1, Nav1.8).*

About 458 molecules were tested across the 10 targets (28-96 per target), with **6 successes (a target-level success rate of 60%)**, validated by independent laboratories at Scripps, Wisconsin and Colorado using cAMP, calcium flux, SPR, MST and other methods.

The two standouts: **GLP-2R** (a class B GPCR that previously had only peptide ligand structures), where 51 molecules tested gave 12 antagonists with a best parent IC50 of about 70-160 nM; and **MRGPRX2**, where 38 molecules tested gave 10 agonists plus 3 antagonists, a molecule-level hit rate of about 34%, far above the 0.01%-0.14% of HTS. ROR1 gave a binder confirmed by three orthogonal methods (KD 5.13 μM). The cofolding model cannot distinguish agonists from antagonists in advance, however, and all 12 GLP-2R hits turned out to be antagonists.

### Figure 2: Validating the LogD model on purchased molecules

**What this figure asks:** Does the lipophilicity (LogD) predicted before purchase agree with the values measured after purchase?

![Figure 2: Experimental validation of LogD](pic/boltzmol1_virtual_screening/page_11.png){: width="508" height="418" loading="lazy" decoding="async"}

*Figure 2. Performance of the LogD model on prospectively purchased molecules. n = 59, predicted vs measured LogD, with the dashed line showing the ideal diagonal.*

LogD was measured for the 59 molecules actually purchased, and the points fall essentially along the diagonal, with **Pearson r = 0.91 and MAE = 0.61**. This means the model can be used before purchase to filter out molecules whose lipophilicity is too high (prone to nonspecific binding) or too low (poor membrane permeation), so that a limited budget goes to candidates with more reasonable drug-like properties.

### Figure 3: Three-bucket validation of the solubility model

**What this figure asks:** Do the predicted high/medium/low solubility buckets agree with the measured solubility distributions?

![Figure 3: Solubility buckets](pic/boltzmol1_virtual_screening/page_11b.png){: width="508" height="444" loading="lazy" decoding="async"}

*Figure 3. Performance of the KSol solubility model on purchased molecules. Measured KSol distributions are shown by predicted solubility bucket, with up/down triangles indicating upper/lower censored values.*

The three violins are the measured solubility distributions for the predicted high/medium/low solubility buckets. **The three buckets separate clearly**: the high-solubility bucket sits at the top, the low-solubility bucket at the bottom and the middle bucket in between. The model can therefore act as an early triage step that flags molecules likely to give false negatives because of insufficient solubility.

### Figure 4: Validating the Caco-2 permeability model

**What this figure asks:** Does the predicted cell permeability (Caco-2) correlate with measurements?

![Figure 4: Caco-2 validation](pic/boltzmol1_virtual_screening/page_12.png){: width="628" height="402" loading="lazy" decoding="async"}

*Figure 4. Performance of the Caco-2 permeability model on purchased molecules. n = 16, predicted vs measured A→B apparent permeability, with points colored by efflux ratio.*

Across the 16 purchased molecules with measurable permeability, prediction and measurement agree with **Pearson r = 0.65 and MAE = 0.21**. The sample is small and the correlation weaker than for LogD, but it still works as an auxiliary candidate filter. With this, all three ADMET models (LogD, solubility and Caco-2) have been prospectively tested on molecules that were actually purchased.

### Figure 5: LogD model vs ADMET-AI (full test set)

**What this figure asks:** On a large, strictly de-leaked test set, is the in-house LogD model better than the public ADMET-AI?

![Figure 5: LogD vs ADMET-AI](pic/boltzmol1_virtual_screening/page_16.png){: width="632" height="360" loading="lazy" decoding="async"}

*Figure 5. Predicted vs measured LogD on the full test set, with this paper's model on the left and ADMET-AI on the right, annotated with MAE, Pearson r and Spearman ρ.*

On the large test set of n = 749 the two models correlate comparably (both r ≈ 0.73). The authors stress that common ADMET benchmarks suffer from serious data leakage (in a scaffold split, about 80% of LogD test molecules are highly similar to training molecules), so they switched to a stricter document-level split. This figure is the comparison under those stricter conditions.

### Figure 6: Precision and recall of the solubility classification

**What this figure asks:** How much better than ADMET-AI is this model at identifying high- and low-solubility molecules?

![Figure 6: Solubility precision and recall](pic/boltzmol1_virtual_screening/page_16b.png){: width="632" height="504" loading="lazy" decoding="async"}

*Figure 6. High-solubility precision and low-solubility recall for this paper's model and ADMET-AI on the LogS test set. Truth thresholds: high solubility LogS > −4, low solubility LogS &lt; −5 / &lt; −6.*

Precision is on the left and recall on the right, with this paper's model in green and ADMET-AI in blue. This paper's model is **higher at every level**: high-solubility precision 0.74 vs 0.55, low-solubility recall 0.73 vs 0.50. For screening, picking the high-solubility bucket precisely and catching the low-solubility bucket comprehensively is exactly what early triage needs.

### Figure 7: Caco-2 model vs ADMET-AI (full test set)

**What this figure asks:** How does this paper's model compare with ADMET-AI on permeability prediction?

![Figure 7: Caco-2 vs ADMET-AI](pic/boltzmol1_virtual_screening/page_17.png){: width="632" height="328" loading="lazy" decoding="async"}

*Figure 7. Predicted vs measured Caco-2 A→B permeability on the full test set, with this paper's model on the left and ADMET-AI on the right, points colored by log efflux ratio.*

On the test set of n = 445 this paper's model reaches r = 0.64 versus r = 0.48 for ADMET-AI, so **this paper's model is slightly better**. All three ADMET models use a GPS-style graph Transformer that integrates atom-level acid-base predictions and RDKit three-dimensional conformer information.

## Part 4: Key Contributions

The four targets with zero hits provide important information about where the method applies. **mGlu4 PAM** (no activity among 41 molecules) reveals a fundamental limitation of cofolding models: a protein-ligand binding ranking cannot reliably distinguish conformation-dependent pharmacology. A positive allosteric modulator (PAM) must bind a specific allosteric pocket and stabilize a particular conformational state of the receptor, and predicting binding alone is nowhere near enough. **AMY3** (no activity among 49 molecules) involves a heterodimeric receptor complex formed by the calcitonin receptor and receptor activity-modifying protein RAMP3, whose pharmacological behavior is controlled by an accessory protein; such multi-subunit-dependent targets are harder to predict.

**MALT1** (no confirmed binders among 33 molecules) is the most instructive failure: it has abundant co-crystal structures and ligand data in the PDB and should in theory be an 'in-training' target for the model, yet the prospective screen still failed. The authors suggest that the commercial libraries may lack chemotypes suited to the specific pocket shape and chemical environment of MALT1, or that the features the model learned did not generalize to these new scaffolds. This case shows that **there is no simple correspondence between how rich the training data are and how successful a prospective screen will be**: the chemical diversity covered by the compound library is just as much a limiting factor. **Nav1.8** (no activity among 51 molecules) targets an allosteric site in the voltage-sensing domain VSD2, whereas sodium channel ligand data in the training set come mainly from the central pore orthosteric site. Data abundance at the level of a target family does not mean the model understands the binding rules of a specific allosteric site within that family.

## Part 5: Limitations and Outlook

The most critical evidence gap in the paper is **the absence of rigorous baseline controls**: there is no systematic comparison, on the same targets and under the same budget constraint, with random selection, conventional molecular docking (such as Glide or AutoDock Vina), pure ligand-similarity methods, or an unoptimized default Boltz-2. We can therefore say that BoltzMol-1 'found active molecules on an extremely small budget', but we cannot quantify the size of its advantage over existing methods; in particular, for the two strongest results, GLP-2R and MRGPRX2, we cannot rule out that mature conventional methods might achieve similar hit rates with the same budget. The strength of evidence also varies among the six successful targets: GLP-2R and MRGPRX2 have complete functional dose-response validation and parental cell line controls, and ROR1 is supported by three orthogonal methods, but the replicate affinity experiments for STAT6 were unstable, LC3B/GABARAP rests on a single AlphaScreen result without orthogonal validation, and the primary screening concentration for PknB was far above usual medicinal chemistry standards (typically 10-100 μM).

In addition, several authors are affiliated with Boltz PBC (a commercial company), and the screens were run through Boltz Lab/API. The specific weighting of the composite score and the 'virtual PAINS' list have not been fully disclosed, which means complete independent reproduction by academic groups remains limited: although the underlying Boltz-2 model is open source, the optimization details of BoltzMol-1 constitute a commercial moat. The paper is a bioRxiv preprint and has not yet been peer reviewed. From a development perspective, finding micromolar binders is only the output of the hit discovery stage, and reaching a developable lead still requires potency optimization (typically a 100-1000 fold improvement to the nanomolar range), selectivity characterization, metabolic stability assessment, in vivo pharmacokinetics and efficacy studies, and much more.

## About the Corresponding Authors

Saro Passaro is co-founder and CEO of Boltz PBC and previously did postdoctoral research at MIT (with Professor Regina Barzilay), where he helped develop the Boltz-1 and Boltz-2 protein structure prediction models; his research focuses on deep learning-driven molecular design and drug discovery. Gabriele Corso holds a PhD in computer science from MIT (with Professor Tommi Jaakkola) and is a co-founder of Boltz PBC; he has published influential work in geometric deep learning and molecular modeling, including the molecular docking method DiffDock and a stochastic interpolant theoretical framework for diffusion models. The study has 14 authors in total and was carried out jointly by Boltz PBC, MIT, the Scripps Research Institute, the University of Wisconsin-Madison and the University of Colorado Denver, with the wet-lab validation performed largely and independently by the academic collaborating laboratories. First authors Noah Getz and Geoffrey Smith led the development and optimization of the screening pipeline.

## Citation

Getz, N., Smith, G., Colgan, A., Fan, V., Cavalleri, L., Capponi, F., ... & Passaro, S. (2026). BoltzMol-1: Towards Reliable Virtual Screening for Fast and Cost-Effective Hit Discovery. bioRxiv. https://doi.org/10.64898/2026.07.04.736485
