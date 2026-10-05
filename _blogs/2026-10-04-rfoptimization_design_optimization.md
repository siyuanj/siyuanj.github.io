---
layout: post
title: "bioRxiv 2026 | RFOptimization: Guiding protein design optimization with all-atom structure prediction"
date: 2026-10-04
description: "A training-free optimizer that rescues borderline de novo designs by alternating RF3 gradient-guided mutation with Boltz prediction and inverse-folding cycles, sharply raising filter-passing rates."
tags: [protein design, design optimization, structure prediction, binder design, enzyme design]
lang: en
translation_key: rfoptimization_design_optimization
---

# RFOptimization: Guiding Design Optimization with All-Atom Structure Prediction

### Link: [full article](https://doi.org/10.64898/2026.09.04.749184)

Authors: Odin Zhang, Jiaqi Wang, Tuscan Rock Thompson, ..., David Baker

bioRxiv, September 7, 2026

---
**Overview**

A major bottleneck in de novo protein design today is "high generation, low pass rate": models such as RFdiffusion can produce large numbers of candidate designs, but the vast majority fail the computational filters based on structure prediction. **RFOptimization (RFO)**, from the Baker lab, is built specifically as a post-processing optimizer for design pipelines. By alternating between two complementary routes, RF3 gradient-guided mutation and a Boltz structure prediction + inverse folding cycle, it turns borderline designs into high-confidence candidates within 1-10 optimization cycles (about 1-10 minutes). The method substantially raises the pass rate under AF3 evaluation across four kinds of tasks: protein binders, cyclic peptides, small-molecule binding proteins and enzyme design.

## Part 1: Research Question

The standard de novo protein design pipeline usually has three steps. First, diffusion models such as RFdiffusion generate thousands to tens of thousands of candidate backbones and sequences. Next, all-atom structure prediction models such as AlphaFold3 (AF3) or RoseTTAFold3 (RF3) are used for computational filtering, with the usual criteria being an interface predicted aligned error iPAE &lt; 2.5 and an interface predicted TM score iPTM > 0.8. In the end only a tiny fraction of designs pass these filters and move on to experimental validation.

Yet a large number of the rejected designs are not entirely wrong. Their backbone conformations are often already reasonable and the binding interface is largely formed; only a handful of residue positions carry suboptimal amino acid types, leaving the predicted confidence just short of the threshold. Designs sitting near the decision boundary like this are called borderline designs. Discarding them all and regenerating at scale wastes the compute already invested, and the candidates from a new round still face the same low pass rate.

RFOptimization targets exactly this bottleneck: **instead of designing proteins from scratch, it takes existing borderline designs as the starting point and quickly searches for better mutation combinations in local sequence space**. Its core role is that of a post-processing optimizer for the design pipeline: it takes the output of an upstream generative model and raises the pass rate with a small number of iterations, substantially reducing the computational cost of the pipeline as a whole.

## Part 2: Methodology: Two-branch hybrid optimization

RFO is a **training-free, modular optimization framework** whose core idea is to alternate between two complementary mutation strategies. The underlying structure prediction models are modular and replaceable; the current implementation uses RF3 and Boltz. In each optimization cycle, the system randomly chooses one of the two routes with equal probability:

**Branch one: RF3 gradient-guided discrete mutation search**

User-defined optimization objectives (iPAE, pLDDT, distogram proxy losses, atom-level geometric constraints and so on) are backpropagated through RF3's Pairformer trunk and confidence module to the input sequence representation. Because RF3's denoising diffusion module is inherently non-differentiable, RFO applies a stop-gradient to it, bypassing coordinate generation and instead computing gradients from the differentiable output heads (distogram head, pLDDT head, pAE head, pTM head). The resulting gradient matrix can be read as a "mutation guidance map": rows correspond to sequence positions, columns to the 20 standard amino acids, and the values indicate how the objective would change if a given position were mutated to a given amino acid. Each step picks the substitution with the largest negative gradient, changing at most one residue at a time by default. A key design choice is that the sequence always stays in a discrete one-hot encoding: after each mutation, atom types, atom masks, chemical connectivity, side-chain topology and reference coordinates are fully rebuilt through RF3's standard featurization pipeline, ensuring that every intermediate state is a chemically valid protein sequence. A single forward pass plus gradient computation takes about 45-60 seconds on one A100 GPU.

**Branch two: Boltz structure prediction + MPNN inverse folding cycle**

The current binder and target sequences are fed into Boltz, an all-atom structure prediction model with a completely different architecture from RF3, which produces an independent structural hypothesis for the complex through partial diffusion. The key value of this step is to provide a structural perspective different from RF3's, preventing the optimization from being dominated by the confidence biases of a single model. Once the predicted structure is in hand, the inverse folding model is chosen by task type: ProteinMPNN for pure protein-protein systems, and LigandMPNN for systems containing small-molecule ligands or other non-protein entities. Before inverse folding, binder residues are filtered by confidence: in the Boltz branch, high-confidence segments of at least 5 consecutive residues with pLDDT > 80 are fixed during inverse folding to preserve already-stable structural regions; in the RF3 branch, interface residues within 8 Å of a target atom are also fixed to keep MPNN from destroying the interface the gradient branch has just optimized. The best candidate sequence is finally chosen by MPNN log-likelihood.

The complementarity of the two branches works like this: the gradient branch uses the objective function to point directly at the most favorable local mutations and excels at fine single-residue adjustments, while the cycling branch steps outside RF3's confidence landscape and redesigns the sequence more broadly from Boltz's structural perspective, reaching regions of sequence space that local gradients cannot. Alternating between the two allows both precise optimization and escape from local optima, while reducing reliance on any single structure prediction model.

Mutations are accepted or rejected according to a **Metropolis-style rule with geometric temperature annealing**: improving mutations are accepted outright, while temporarily worse mutations are accepted with probability exp(−ΔL/T), where the temperature T decays geometrically (T₀ = 1.0, half-life 40 steps). The high temperature early on allows some worsening mutations through to encourage exploration, while the low temperature later focuses on accepting only improvements. The whole optimization typically runs 1-10 outer cycles, taking about 1-10 minutes on a single A100 GPU. Finally, AF3, which never participated in the optimization, serves as an independent evaluator for a three-model consensus filter (the iPAE and iPTM thresholds must be met simultaneously by RF3, Boltz and AF3), which effectively reduces the risk of overfitting.

RFO also offers a highly customizable system of objective functions. Users can combine three kinds of objectives: confidence losses (iPAE, pLDDT, iPTM and so on), distogram proxy losses (interface distance distribution entropy, contact losses and so on) and atom-level geometric constraints (specifying distance requirements between any two atoms). The last of these is especially important for enzyme design: a catalytic active site requires specific atoms of the catalytic residues to sit at precise three-dimensional positions, and only an all-atom structure prediction model can supply constraints at this atomic resolution. Users can also use a mask to specify which residues may mutate and which stay fixed, so as to preserve a functional motif or optimize interface residues only.

## Part 3: Key Figure Analysis

### Figure 1: The two-branch hybrid optimization framework

**What this figure asks:** How does RFOptimization optimize designs using gradient guidance and structural cycling at the same time?

![Figure 1: framework](pic/rfoptimization_design_optimization/page_8.png){: width="1140" height="970" loading="lazy" decoding="async"}

*Figure 1. The overall RFOptimization framework. (a) It supports a variety of inputs including protein binders, cyclic peptides, enzymes and small-molecule binding proteins. (b) Each optimization cycle takes either the gradient-guided mutation route or the structural cycling route, chosen at random with equal probability.*

RFO is a **training-free post-processing optimizer**: rather than designing from scratch, it takes the borderline designs produced upstream by RFdiffusion (reasonable backbone, interface largely formed, just a few residues short of the threshold) as a starting point and quickly searches local sequence space for better mutations.

One route is chosen at random each cycle, and the underlying structure prediction models are replaceable (currently RF3 and Boltz). Mutations are accepted using a **Metropolis rule with geometric temperature annealing** (exploration at high temperature early, convergence at low temperature later). It typically runs 1-10 cycles in about 1-10 minutes on a single A100, and the final three-model consensus filter is applied by AF3, which never took part in the optimization, reducing overfitting.

### Figure 2: Two complementary mutation branches

**What this figure asks:** By what mechanism does each of the gradient branch and the cycling branch generate candidate mutations?

![Figure 2: two branches](pic/rfoptimization_design_optimization/page_9.png){: width="1140" height="880" loading="lazy" decoding="async"}

*Figure 2. The two mutation branches. (a) Gradient branch: backpropagation through RF3's confidence and distogram heads yields a mutation guidance map. (b) Cycling branch: Boltz predicts the structure, then ProteinMPNN/LigandMPNN inverse-folds candidate sequences.*

* **Panel a, gradient branch**: RF3's diffusion module is non-differentiable, so a stop-gradient bypasses it and gradients are computed from the differentiable distogram / pLDDT / pAE / pTM heads, giving a **mutation guidance map over positions × 20 amino acids**; each step takes the substitution with the largest negative gradient. The sequence stays discrete throughout and is rebuilt into a valid protein after every mutation.
* **Panel b, cycling branch**: Boltz, with a completely different architecture, predicts the structure and the result is inverse-folded. **This supplies a structural perspective different from RF3's and avoids being led astray by the confidence bias of a single model.** The gradient branch is good at fine single-residue adjustments and the cycling branch at escaping local optima through broader redesign, and alternating between them captures both.

### Figure 3: Computational benchmarks on four task types

**What this figure asks:** Across protein binders, cyclic peptides, small-molecule binding proteins and enzymes, how much can RFO raise the success rate?

![Figure 3: benchmarks](pic/rfoptimization_design_optimization/page_10.png){: width="1140" height="764" loading="lazy" decoding="async"}

*Figure 3. Computational benchmarks on four design tasks. (a) Protein binders. (b) Cyclic peptides. (c) Small-molecule binding proteins. (d-f) Enzyme design fitness, ablation experiments and computational efficiency. All initial designs were generated by RFdiffusion, and success is defined by independent AF3 evaluation with iPAE &lt; 2.5 and iPTM > 0.8.*

Success rates rise sharply on all four tasks: **protein binders (13 targets) 6.73%→22.31%** (PDGFR 17.5%→50%, with several targets breaking through from 0%); **cyclic peptides 1.25%→12.57% (10-fold)**; small-molecule binding proteins 5.62%→24.91%; and for enzyme design, 18 of 24 cases improve in fitness. Many initial designs start at only about 1%, indicating that they were a few residues short and could be repaired by a small number of RFO mutations.

* **Panels e/f**: The ablation shows that the complete two-branch method is highest across all iPTM thresholds (12.08% at iPTM>0.8, versus 7.5% for cycling only and 6.67% for gradient only), so **both branches are indispensable**. On efficiency, each design that passes the three-model consensus costs about 26 GPU-minutes, roughly 7 times faster than Protein Hunter and roughly 78 times faster than BindCraft.

## Part 4: Key Contributions

RFOptimization's contributions can be summarized in three points.

**It turns "regenerate" into "repair locally".** Addressing the "high generation, low pass rate" bottleneck of de novo design, RFO does not discard borderline designs; it searches for a few mutations on an already reasonable backbone and rescues designs that just missed the threshold into high-confidence candidates.

**Complementary branches plus multi-model consensus.** Gradient guidance (through RF3's differentiable output heads) makes fine single-residue adjustments, while structural cycling (Boltz + MPNN inverse folding) supplies a different structural perspective for escaping local optima; the final three-model consensus filter uses AF3, which never participated in the optimization, to reduce overfitting.

**Broad gains across four task types, and fast.** Success rates rise significantly for protein binders, cyclic peptides, small-molecule binding proteins and enzyme design (**10-fold for cyclic peptides, 3.3-fold for binders**), at about 26 GPU-minutes per design that passes consensus, roughly 78 times faster than BindCraft. The framework needs no training, so it benefits immediately whenever the underlying models are upgraded.

## Part 5: Limitations and Outlook

RFO's performance depends on two factors: the accuracy of the underlying structure prediction models and the quality of the initial designs. The closer the initial backbone is to a reasonable conformation, the more likely RFO is to find an improvement in local sequence space. The good news is that as RF3, Boltz, AF3 and similar models keep improving, RFO's results will improve along with them: the framework itself needs no retraining, only a swap of the underlying model. All benchmarks so far are computational (in silico), and no experimental validation data (expression, binding assays or activity tests) have been reported. In addition, RFO's Metropolis-style acceptance rule does not include the full Hastings proposal-ratio correction, so strictly speaking it offers no theoretical guarantee of detailed balance or ergodicity, though the authors note that this approximation has negligible impact in practical design settings. Future directions include combining RFO with improved upstream generative methods (such as newer versions of RFdiffusion), extending it to more complex design scenarios such as antibodies and multispecific binders, and carrying out large-scale experimental validation.

## About the Corresponding Authors

The paper lists two corresponding authors, Odin Zhang and David Baker. Professor David Baker is director of the Institute for Protein Design (IPD) in the Department of Biochemistry at the University of Washington and an investigator of the Howard Hughes Medical Institute (HHMI). A founder of the field of computational protein design, he developed the Rosetta protein modeling software suite and has led the development of milestone projects including RFdiffusion, ProteinMPNN and RoseTTAFold. He received the 2024 Nobel Prize in Chemistry for his groundbreaking contributions to computational protein design. Co-first authors Odin Zhang and Jiaqi Wang are both researchers at the IPD and the Paul G. Allen School of Computer Science and Engineering, with deep expertise in design optimization, structure prediction and loss function design for proteins. Co-first author Tuscan Rock Thompson focuses on task design, foundation model adaptation and evaluation methodology.

## Citation

Zhang, O., Wang, J., Thompson, T. R., You, Z., Song, Z., DiMaio, F., & Baker, D. (2026). RFOptimization: Guiding Design Optimization with All-Atom Structure Prediction. bioRxiv. https://doi.org/10.64898/2026.09.04.749184
