---
layout: post
title: "JCIM 2026 | Pair Representation Scaling: One line of code that shifts conformational sampling in AlphaFold 3"
date: 2026-09-05
description: "Multiplying the Pairformer input pair representation by a scalar (1+β) steers AlphaFold 3 and Boltz-2 toward alternative conformations without retraining, raising per-state success from 0.60 to 0.73."
tags: [protein structure prediction, conformational sampling, alphafold 3, representation engineering]
lang: en
translation_key: pair_repr_scaling
---

# Biasing Conformational Sampling in AlphaFold 3 and Boltz-2 via Pair Representation Scaling

### Link: [full article](https://doi.org/10.1021/acs.jcim.6c02094)

Authors: Shosuke Suzuki, Toshiyuki Amagasa

Journal of Chemical Information and Modeling, August 20, 2026

---
AlphaFold 3 and Boltz-2 are already very good at predicting protein structures, but they share a common weakness: **they tend to return a single dominant conformation and ignore the dynamics of proteins switching between functional states**.

This paper proposes a minimal inference-time intervention: at the entrance of the Pairformer trunk, the pair representation is uniformly multiplied by a scalar (1+β). The operation requires no retraining, no auxiliary model, and not even an extra forward pass; in essence, it adds a single tensor multiplication to the inference code.

On 86 two-state proteins, the alternative-conformation success rate of AlphaFold 3 rose from 0.60 to **0.73**. More importantly, using a Gaussian-noise control, a placement ablation and distogram analysis, the authors show that the operation performs a **directed reweighting** of two-state information already encoded inside the model, rather than a random perturbation.

## Part 1: Research Question

In vivo, proteins often switch among several conformations to carry out their functions: transporters flip between inward-facing and outward-facing states, and kinases swing between open and closed states. Yet deep-learning structure predictors such as AlphaFold 3 and Boltz-2 usually output only the single most dominant conformation under default inference.

Existing solutions mainly **work on the input side**: they weaken or split the dominant coevolutionary signal in the MSA (multiple sequence alignment) in the hope that alternative states will surface. Typical methods include MSA subsampling, random masking, and AF-Cluster-style MSA clustering. The problems with these methods are that they need an MSA to work, their cost grows with MSA depth, and they do not provide a single interpretable control parameter.

The central question of this paper is:

**Can we bypass input-level intervention and find a simple, interpretable 'knob' directly in the model's internal representations to control its conformational sampling preference?**

## Part 2: Methodology: Pair Representation Scaling

AlphaFold 3 and Boltz-2 share a key internal architecture: a **Pairformer trunk** iteratively refines the single representation and the pair representation, then passes them to a **diffusion module** that generates 3D coordinates. The **pair representation z** encodes the latent relationship between every residue pair (i, j), mixing coevolutionary signals, geometric constraints and interaction propensities, and it is the main conditioning input to the structure module.

The authors' operation is extremely simple:

**z<sup>scaled</sup><sub>ij</sub> = (1 + β) · z<sub>ij</sub>**

At every recycle, the pair representation is uniformly multiplied by the scalar (1+β) before being fed into the Pairformer.

β = 0 corresponds to default inference. The authors swept β ∈ {±0.15, ±0.30, ±0.45, ±0.60, ±0.75}, 10 settings in total, and combined them with different random seeds to form a sampling set of 250 structures (the same 250-structure budget as default inference).

The key advantages of the method are:

**No input changes**: the sequence and MSA stay as they are

**No parameter changes**: the model weights are untouched, with no retraining or fine-tuning

**No extra compute**: no second forward pass or auxiliary model is needed

**Transfer across models**: AF3 and Boltz-2 are both built around a Pairformer + diffusion architecture, so the same operation applies directly

Intuitively, the pair representation is the main channel that carries evolutionary constraints from the sequence/MSA to the structure module. If the model already implicitly encodes information about multiple conformations, then adjusting the overall strength of this internal coupling field could change which conformational basin diffusion sampling finally settles into. It is like adjusting the contour contrast of a landscape map so that minor basins that were previously washed out become visible.

## Part 3: Key Figure Analysis

### Dataset and evaluation metrics

The authors assembled **86 two-state targets**, each with two experimentally determined reference conformations:

**39 domain-motion proteins**: classic hinge and open-closed motions

**47 membrane transporters**: switching between inward-facing and outward-facing states

The benchmark reports results for three groups: **domain motion**, **transporter**, and a crucial **after-cutoff** group (targets whose alternative conformation entered the PDB only after the model's training cutoff). The point of the after-cutoff group is to **rule out the possibility that the model finds the alternative state only because it memorized the answer**.

Evaluation uses three complementary metrics:

**Per-state success rate**: of the two reference states, how many are hit within 2 Å RMSD by the sampling set

**Worst-case minimum RMSD**: for the harder-to-recover of the two reference states, how close the nearest model gets

**Fill ratio**: whether the sampled structures cover the full conformational path between the two states rather than piling up at one end

The comparisons include default inference, MSA subsampling, random masking, MSA clustering, inference-time dropout, the MD-conditioned mode of Boltz-2, and BioEmu, a generative model dedicated to ensembles.

*▼ Figure 1: A full benchmark across three groups × three metrics*

**What this figure asks:** How does Pair Representation Scaling controllably sample alternative conformations across three folding models?

![](pic/pair_repr_scaling/page_2.png){: width="1145" height="890" loading="lazy" decoding="async"}

### The effect is strongest on AlphaFold 3

On AlphaFold 3, the improvement from pair representation scaling is substantial:

**Per-state success rate**: up from **0.60** under default inference to **0.73**, with significant gains in both the domain motion and transporter groups

**Fill ratio**: more than doubled in both groups, with the largest gain in the transporter group

**Worst-case minimum RMSD**: significantly lower in all three groups

**After-cutoff group**: the worst-case minimum RMSD improved by **1.18 Å** on average, showing that the gain does not depend on the model having seen the alternative state during training

### Boltz-2 also benefits, but needs a combined strategy

On Boltz-2, all three metrics improve in a consistent direction, and the fill-ratio gain is statistically significant in all three groups. The overall magnitude, however, is smaller than in AlphaFold 3. The authors attribute this to Boltz-2's training data, which include MD ensembles, so its default conformational coverage is already broader and it is more robust to internal perturbations.

One practical finding is that **Boltz-2 + MSA subsampling is the strongest combination**: 'internal representation intervention' and 'input MSA intervention' are complementary. On AlphaFold 3, scaling alone is already strong enough, and combining yields little marginal gain.

*▼ Figure 2: Conformational scatter plots for representative targets (gray = default inference, colored = scaling at different β)*

**What this figure asks:** Do the internal distogram distributions really move toward the alternative state, rather than being randomly perturbed?

![](pic/pair_repr_scaling/page_4.png){: width="1145" height="1160" loading="lazy" decoding="async"}

## Part 4: Key Contributions

The most valuable part of this paper is that the authors do not stop at reporting that the method 'works'. They systematically argue that scaling performs a directed reweighting of the two-state information already encoded in the model, rather than simply adding noise. The chain of evidence consists of four key experiments.

### Experiment 1: Gaussian-noise control

The authors added variance-matched Gaussian noise to the pair representation (with a noise magnitude comparable to the change introduced by scaling) to test whether the effect comes merely from adding a perturbation.

On AlphaFold 3 the result is very clear: **Gaussian noise directly causes structural collapse and severe steric clashes** and recovers no reference state at all, whereas scaling preserves sensible folds and recovers the alternative state. This shows that the effect of scaling comes from **multiplicative scaling preserving the directional structure of the representation**: it is an organized modulation, not an arbitrary perturbation. Boltz-2 is somewhat more robust to noise, but noise likewise fails to reproduce the directed gains of scaling.

### Experiment 2: Placement ablation: it must be applied at the right place

The authors tested three placements: before the MSA module, at the Pairformer input, and after the Pairformer. **Only the Pairformer input works.**

Applied before the MSA module, the perturbation is absorbed by the subsequent outer-product mean operation. Applied after the Pairformer, it directly alters the conditioning signal passed to the diffusion module and actually narrows the ensemble. This indicates that the key is letting the Pairformer reprocess the scaled pair signal: the Pairformer's attention and projection mechanisms turn a global change in magnitude into a structurally meaningful internal reorganization.

### Experiment 3: Global vs local scaling

The authors ran an 'oracle' experiment: using ground-truth information from the two reference states, they applied local scaling only to residue pairs whose distance changes by more than 4 Å. Surprisingly, **local scaling performs worse than global uniform scaling**. This suggests that the model's internal encoding of conformational preference is distributed, and the effective factor is a global adjustment of the overall magnitude of the pair representation rather than point-by-point manipulation of a few key contacts.

*▼ Figure 4: Ablations (A-B: difficulty stratification and recycle robustness; C-D: noise control; E-G: local/placement/MD ablations)*

**What this figure asks:** Is there a dose-response relationship between the magnitude of the scaling factor and the distance of the sampled conformations?

![](pic/pair_repr_scaling/page_6.png){: width="1145" height="1060" loading="lazy" decoding="async"}

### Experiment 4: Distogram analysis: internal distance distributions move toward the alternative state

The distogram is the model's predicted distance distribution for every residue pair. It is a linear projection of the post-Pairformer pair representation and is therefore well suited to 'reading out' the information in the pair latent. On residue pairs whose distances change between states, the authors observed:

After scaling, the probability mass of the distogram on the alternative-state side increases and the entropy of the distribution grows

In per-target comparisons, among the 35 targets for which AF3 improves recovery, the distogram shift of **34** correlates positively with the experimental difference between the two states (median Pearson r = 0.56)

More residue pairs become bimodal after scaling, and the positions of the two peaks match the distances in the two reference states

This is very strong evidence: it shows that, at the level of residue-pair distance distributions, scaling systematically pushes probability toward the geometry of the alternative state, and the direction of the internal change agrees with the direction of the real conformational transition.

*▼ Figure 5: Distogram analysis (A-C: alternative-state mass/entropy/normalized magnitude vs β; D: correlation between shift and experimental difference; E-G: three case studies in detail)*

**What this figure asks:** What additional findings does Pair Scaling bring when combined with MSA depth adjustment and molecular dynamics simulations?

![](pic/pair_repr_scaling/page_7.png){: width="1145" height="1180" loading="lazy" decoding="async"}

### Two important supplementary results

### Redirection of the denoising trajectory

The authors tracked the diffusion denoising trajectories of AlphaFold 3. Under default inference, the structure stays closer to the dominant state throughout denoising. After scaling, once the backbone begins to take shape, the trajectory moves over to the alternative-state side. In the two showcased examples, 40/50 trajectories switched to the alternative-state side in one case, and all 50/50 switched in the other. This shows that the conditioning change applied by scaling in the trunk is indeed 'understood and carried out' by the diffusion process.

### Gains persist in sequence-only mode

Without an MSA, both models perform markedly worse overall, but on AlphaFold 3 scaling still retains a measurable benefit. In particular, for some membrane transporters, default sequence-only inference goes badly wrong, whereas **scaling with negative β values can 'rescue' them to near-native structures**. This shows that the effectiveness of scaling does not depend entirely on coevolutionary information in the MSA: even with a single sequence, the model's internal pair representation still holds a structural prior that can be tuned.

## Part 5: Limitations and Outlook

The authors are fairly candid about the limitations of the method:

**The effect is target-specific**: the best direction and magnitude of β vary from protein to protein, and none of the 86 targets shows a strictly monotonic relationship between β and recovery quality. In practice, how to pick the 'biologically correct alternative state' without reference structures remains an open problem

**Benchmark limitations**: only two-state single-chain proteins are covered; applicability to intrinsically disordered regions, multi-state systems, protein complexes and ligand-induced rearrangements has not yet been tested

**No thermodynamic populations**: the method can sample alternative states, but sampling frequencies at inference time do not equal real equilibrium Boltzmann populations

### Summary and implications

The core contribution of this paper can be compressed into a single line of evidence:

1\. Propose the method → 2. Validate it on the 86-target benchmark → 3. It still works after the cutoff (not memorization) → 4. Matched noise fails (not a random perturbation) → 5. Local scaling fails (distributed encoding) → 6. It works only at the Pairformer input (reprocessing is needed) → 7. Distograms move toward the alternative state (the internal change agrees with experiment) → 8. Denoising trajectories turn (the conditioning change is realized by diffusion) → 9. It partly works without an MSA (not purely an effect of coevolutionary input)

At the methodological level, this work is a clear case of moving from **input engineering** (manipulating the MSA input) to **representation engineering** (manipulating internal latent representations). It shows that the key to controlling the output of AlphaFold-like models does not have to lie on the input side alone; directly manipulating the internal latent can offer a simpler and more interpretable means of control.

At the conceptual level, the paper supports an increasingly strong view: **the pair latent of AlphaFold-like models already implicitly encodes information about protein conformational heterogeneity; default sampling simply fails to make it fully explicit.** The problem lies in a readout/sampling mechanism biased toward a single main peak, not in the model being unaware that alternative states exist.

**Corresponding Authors**

Shosuke Suzuki and Toshiyuki Amagasa are both corresponding authors of this paper and are from the Department of Computer Science at the University of Tsukuba, Japan. Professor Amagasa's research spans database systems, data engineering, and applications of machine learning to scientific data, and in recent years has focused on combining deep learning methods with protein structure prediction. This paper is the team's representative work on controlling protein conformational sampling. It was published in the Journal of Chemical Information and Modeling (IF 6.4), submitted on June 24, 2026 and accepted on August 11, with a review period of about 48 days.

## Citation

Suzuki, S., & Amagasa, T. (2026). Biasing Conformational Sampling in AlphaFold 3 and Boltz-2 via Pair Representation Scaling. Journal of Chemical Information and Modeling. https://doi.org/10.1021/acs.jcim.6c02094
