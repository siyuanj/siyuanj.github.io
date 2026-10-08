---
layout: post
title: "bioRxiv 2024 | Boltz-1: The first fully open-source biomolecular structure prediction platform to reach AlphaFold3 accuracy"
date: 2026-09-05
description: "Boltz-1 is an MIT-licensed, fully open model that matches AlphaFold3 and Chai-1 on biomolecular complex prediction, and its Boltz-steering variant raises physical validity to 97%."
tags: [biomolecular structure prediction, diffusion models, open source, alphafold3, physical constraints]
lang: en
translation_key: boltz1_biomolecular_interaction
---

# Boltz-1: Democratizing Biomolecular Interaction Modeling

### Link: [full article](https://doi.org/10.1101/2024.11.19.624167)

Authors: Jeremy Wohlwend, Gabriele Corso, Saro Passaro, ..., Regina Barzilay

bioRxiv, November 20, 2024

---
**Overview**

In 2024 AlphaFold3 showed that deep learning can predict, with high accuracy, the three-dimensional structure of essentially any biomolecular complex involving proteins, DNA, RNA and small molecules. Its **code, weights and training pipeline, however, remained unreleased for a long time**, so researchers could not reproduce it, modify it or build new ideas on top of it. Chai-1, a commercial model from the same period, likewise released only its inference code.

Wohlwend, Corso, Passaro and colleagues at MIT CSAIL and the Jameel Clinic introduced **Boltz-1**, a biomolecular structure prediction platform that is fully open-sourced under the MIT license. Boltz-1 makes systematic improvements at four levels, namely the data processing pipeline, the model architecture, the diffusion inference procedure and confidence estimation, and it **reaches the same accuracy as AlphaFold3 and Chai-1** on several benchmarks while using only about a quarter of AlphaFold3's training compute.

Even more important, the team proposes **Boltz-steering**, an inference-time technique for enforcing physical constraints. Using the Feynman-Kac framework and Sequential Monte Carlo sampling, it introduces seven classes of physical potentials into the diffusion process and lifts physical validity in one step from 57% to **97%**, far ahead of AlphaFold3 (58%) and Chai-1 (27%). The code, weights, training pipeline and benchmarks are all released under the MIT license, and Boltz-1 has already become the core platform for downstream work such as SwitchCraft and Pair Representation Scaling.

## Part 1: Research Question

In 2020, AlphaFold2 demonstrated at CASP14, with overwhelming accuracy, that deep learning can reach experimental-level accuracy in single-chain protein structure prediction. In 2024, AlphaFold3 extended the scope of prediction to almost every type of biomolecular complex, including **proteins, DNA, RNA, small-molecule ligands, modified residues and covalent bonds**, covering the molecular interaction problems that lie at the heart of drug discovery, enzyme engineering and research on disease mechanisms.

For a long time, however, AlphaFold3 was available only as an online prediction server, and **its training code, model weights and data processing pipeline were all closed**. Researchers could use it to make predictions, but they could not modify its architecture, extend its input types, try new training strategies or integrate the model into their own protein design and drug screening pipelines. Chai-1, the commercial model of the same period, also released only its inference code, and its training process stayed closed.

This closed state seriously held back research in structure prediction. First, researchers could not verify or reproduce the performance figures claimed for AlphaFold3. Second, any exploration of architectures and training strategies had to start from scratch instead of iterating on top of existing work. Finally, many downstream applications, such as multi-conformation sampling, scoring functions for protein design and fine-tuning on specific classes of complexes, require complete access to the model's internals.

The goal of Boltz-1 was therefore very clear: **to build a fully open-source biomolecular structure prediction platform that matches AlphaFold3 in accuracy and is completely open, with training code, model weights, data processing and benchmarks all released under the MIT license**, so that researchers around the world can freely experiment, validate and innovate.

## Part 2: Methodology: Overall Framework: The Trunk + Diffusion Paradigm

The overall architecture of Boltz-1 follows the trunk + diffusion paradigm established by AlphaFold3, but it makes independent improvements at several key points. The full prediction process can be divided into three stages: **input encoding → construction of global representations → diffusion-based generation of coordinates**.

**What this figure asks:** How does the overall Boltz-1 architecture combine the MSA Module, the PairFormer and reverse-diffusion structure generation?

![](pic/boltz1_biomolecular_interaction/page_8.png){: width="1150" height="440" loading="lazy" decoding="async"}

*Figure 3 \| Schematic of the Boltz-1 architecture. The left half is the Trunk (MSA Module + PairFormer); the right half shows reverse-diffusion structure generation and the Confidence Model*

**At the input level**, the model takes protein sequences, ligand SMILES strings, nucleic acid sequences and multiple sequence alignments (MSAs) obtained by database search. Boltz-1 uses a unified token definition across molecule types: for proteins each amino acid is one token, for DNA and RNA each base is one token, and for small-molecule ligands each heavy atom is one token. This unified tokenization lets the model handle all kinds of molecular inputs with a single architecture.

**At the representation level**, the model maintains three representations: a **single representation** (one vector per token, capturing local sequence and evolutionary features), a **pair representation** (one vector per token pair, encoding relative relationships and co-evolutionary signals between residues) and an **atom representation** (one vector per atom, providing fine-grained atomic information). The Trunk consists of the MSA Module and the PairFormer Module, and through a deep 48-layer network it fuses the three representations into global structural information.

**At the structure generation level**, Boltz-1 uses a diffusion model that starts from pure noise and gradually generates three-dimensional atomic coordinates through repeated denoising. At each denoising step, the model uses the global information encoded by the Trunk to guide the coordinates toward the correct structure.

Notably, unlike AlphaFold3, Boltz-1 **does not use structural templates**. AlphaFold3 feeds known structures in as templates to provide prior information, whereas Boltz-1 relies entirely on sequence and MSA information. This simplifies the data pipeline and also avoids the computational cost of template search and the potential bias that templates introduce.

## Part 3: Key Figure Analysis

The data processing pipeline is the foundation of a structure prediction model: it determines what information the model receives and in what form. Boltz-1 makes independent improvements in three places, MSA pairing, spatial cropping and pocket conditioning, and each of them directly affects prediction accuracy.

**3.1 Dense MSA Pairing: multi-chain MSA pairing based on taxonomic information**

For predicting protein complexes, single-chain MSAs are not enough. The model needs to know which sequences occur together in the same species in nature, so that it can extract **inter-chain co-evolution signals**. These are a key clue for predicting protein-protein interfaces.

The Dense MSA Pairing algorithm in Boltz-1 **groups sequences by taxonomy ID**: within the MSAs of the individual chains, it finds sequences that belong to the same species and pairs them into 'homologous multi-chain MSA rows'. In this way, the multiple chains from one species naturally carry information about inter-chain co-evolution.

There is a subtle trade-off here: **more pairing gives a stronger co-evolution signal, but excessive pairing reduces the depth and density of the MSA**, because only species with homologous sequences for several chains can take part in pairing. Boltz-1 seeks a balance between pairing strength and MSA density instead of simply maximizing the number of paired rows.

**3.2 Unified Cropping: a single interpolation between spatial and contiguous cropping**

During training, large biomolecular complexes must be cropped to a fixed number of tokens. Traditional methods face two options: **spatial cropping** (selecting tokens that are neighbors in three-dimensional space, which preserves local spatial relationships but may break sequence continuity) and **contiguous cropping** (cutting out continuous stretches along the sequence, which preserves chain integrity but may lose information about spatial neighbors).

Boltz-1 proposes a unified cropping strategy that **interpolates directly between the two**. The procedure has three steps:

* **(1)** Randomly choose a central token as the starting point of the crop and define a neighborhood-size parameter N;
* **(2)** Expand outward token by token in order of spatial distance, but each time a new token is added, also include the N tokens before and after it in the sequence (that is, a contiguous sequence neighborhood);
* **(3)** During training, N is sampled at random between 0 and 40.

When N=0, the strategy reduces to pure spatial cropping; when N is large, it approaches pure contiguous cropping. **This random interpolation lets the model learn spatial relationships and sequence continuity at the same time during training**, avoiding the bias of any single fixed cropping strategy.

**3.3 Robust Pocket Conditioning: one model that supports flexible pocket specification**

In drug discovery, researchers usually already know where the binding pocket on the target protein is, and they want the model to use this prior knowledge when predicting the ligand pose. AlphaFold3's approach has two problems. First, it requires maintaining **two separate models** (one that uses pocket information and one that does not). Second, it requires the user to specify **all** pocket residues within 6Å, and partial specification degrades performance.

Boltz-1 adopts a more elegant solution: **a single model handles both the with-pocket and without-pocket scenarios**. During training, pocket information is randomly included in 30% of the samples:

* **(1)** Randomly choose a binder (a ligand or an interacting chain);
* **(2)** Find all pocket residues within 6Å of that binder;
* **(3)** Randomly choose a subset of the pocket residues (allowing partial specification);
* **(4)** Mark four states with one-hot token features: **BINDER** (ligand tokens), **POCKET** (selected pocket residues), **UNSELECTED** (residues known to be in the pocket but not selected) and **UNSPECIFIED** (all other residues).

This brings three advantages. Only one model needs to be trained and deployed, which lowers maintenance cost. Users can specify just part of the pocket, which better matches real use, where information is often incomplete. And the pocket-conditioning framework naturally extends to specifying protein-protein and protein-nucleic acid interfaces, so its scope goes beyond small-molecule docking.

### Three Key Architectural Changes

Boltz-1 makes three structural modifications to the AlphaFold3 architecture. They may look like 'minor tweaks', but each one changes the path along which information propagates, and each has a substantive effect on convergence speed and final accuracy.

**4.1 Reordering the operations in the MSA Module**

In AlphaFold3's MSA Module, the operations are executed in the following order:

**AlphaFold3 order:** OuterProductMean → PairWeightedAveraging → MSATransition → TriangleUpdates → PairTransition

**Boltz-1 order:** PairWeightedAveraging → MSATransition → OuterProductMean → TriangleUpdates → PairTransition

The key difference is that Boltz-1 executes **MSATransition** before **OuterProductMean**. MSATransition updates the single representation (the independent representation of each token), while OuterProductMean aggregates information from the single representation into the pair representation. **Updating the single representation first and then propagating it to the pair representation through OuterProductMean** allows the updated sequence features to influence the encoding of residue-pair relationships sooner, making information propagation more efficient.

**4.2 Fixing the residual connections in the Transformer**

AlphaFold3's DiffusionTransformer has a structural issue: the two sub-modules **AttentionPairBias** (the attention layer) and **ConditionedTransitionBlock** (the feed-forward layer) share a single additive update. In other words, the outputs of the two modules are summed into one delta, which is then added back to the input. This means that **a residual connection is missing**: the input seen by ConditionedTransitionBlock does not include the latest output of AttentionPairBias.

**AlphaFold3:** a ← a + [AttentionPairBias(a) + ConditionedTransitionBlock(a)] (both computed from the same input a)

**Boltz-1:** a ← a + AttentionPairBias(a); then a ← a + ConditionedTransitionBlock(a) (**two separate residual updates**)

The Boltz-1 fix has two benefits. First, backpropagation has richer paths, since gradients can flow back along more routes, which helps the training stability of deep networks. Second, the output of AttentionPairBias directly affects the computation of ConditionedTransitionBlock: global patterns captured by attention can be used immediately by the feed-forward network, which reduces the delay in information propagation.

**4.3 A major redesign of the Confidence Model**

The Confidence Model assesses the quality of the predicted structure and outputs metrics such as pLDDT (predicted local distance difference test), PAE (predicted aligned error), PDE (predicted distance error) and atom-resolved probabilities. These metrics are essential for downstream users to judge how far a prediction can be trusted.

AlphaFold3's confidence module is relatively simple: **it uses only 4 PairFormer layers** and takes only the output of the last diffusion step as input. This means it discards a great deal of information from the intermediate steps of the diffusion process.

Boltz-1 gives the Confidence Model a **fundamental upgrade**:

**Full Trunk architecture:** The Confidence Model has an architecture on the same scale as the structure prediction model, including an AtomAttentionEncoder, an MSA Module and a full 48-layer PairFormer Module. This gives the confidence model the same expressive power as the main model.

**Initialization from pretrained weights:** The Confidence Model's weights are initialized from the trained structure prediction Trunk (similar to fine-tuning a pretrained model). Newly added modules are zero-initialized so that the representations already learned are not disrupted at the start.

**Aggregating intermediate information from the diffusion process:** Through a time-conditioned recurrent module, the Confidence Model collects intermediate representations from every step of the diffusion process and aggregates information from the whole denoising trajectory, which carries far more information than AlphaFold3's approach of taking only the final-step output.

**Decoupled training:** The Confidence Model is trained completely separately from the structure prediction model, avoiding gradient interference from joint training. This design lets researchers improve confidence estimation on its own, without retraining the entire structure prediction pipeline.

### Kabsch Diffusion Interpolation

**What this figure asks:** How large are the performance differences between three reverse-diffusion strategies on complexes of different molecular weights?

![](pic/boltz1_biomolecular_interaction/page_7.png){: width="1140" height="300" loading="lazy" decoding="async"}

*Figure 2 \| Comparison of three reverse-diffusion strategies. Top: AlphaFold3 (alignment during training, none at inference); middle: simple interpolation; bottom: Boltz-1's Kabsch-aligned interpolation. The three scatter plots show how the strategies differ in performance across molecular weights*

The reverse process of a diffusion model (inference) must interpolate between the 'clean coordinates' predicted by the denoising model and the current 'noisy coordinates' to produce the next intermediate state. There is an overlooked theoretical flaw here.

During training, AlphaFold3 applies **rigid alignment** to the denoised prediction: the predicted coordinates are aligned to the true coordinates before the loss is computed. At inference, though, no true coordinates are available, and the denoised prediction may differ from the noisy coordinates by a global rotation and translation. **Interpolating directly between unaligned coordinates, especially at low-noise steps, produces out-of-distribution intermediate states never seen during training**, which confuses the model in subsequent steps.

Boltz-1's solution is to **perform Kabsch rigid alignment at every step of inference**. Specifically, at each denoising step:

* **(1)** The model predicts the denoised coordinates x̂₀;
* **(2)** The Kabsch algorithm rigidly aligns x̂₀ to the current noisy coordinates xₜ;
* **(3)** Interpolation between the aligned x̂₀ and xₜ produces xₜ₋₁.

This keeps the interpolated result close to the denoised structure and within the distribution the model saw during training.

Notably, the authors also add a cautious remark in the paper: in large models, the model usually already predicts coordinates close to the correct projection (that is, the rigid-body offset between the denoised prediction and the noisy coordinates is itself small), so the gain from Kabsch alignment in a large model may be less pronounced than in the small-model ablations. This candid analysis reflects the Boltz-1 team's careful attitude toward its experimental conclusions.

### Diffusion Loss Weighting and Training Strategy

When training a diffusion model, different noise levels (time steps) contribute unequally to final prediction accuracy. Low-noise steps require the model to make fine atomic-level adjustments, while high-noise steps require it to settle the global fold topology. How the training signal is weighted across time steps directly affects the model's final performance.

Boltz-1 uses loss weighting in the style of EDM (Elucidating the Design Space of Diffusion-Based Generative Models):

w(t̂) = (t̂² + σ_data²) / (t̂ × σ_data)²

Unlike the weighting scheme used by AlphaFold3, EDM weighting aims to **make the contributions of different noise levels to the total loss more balanced**. At high noise levels (large t̂) the weight is lowered, so the model does not overemphasize the relatively easy task of 'predicting the global topology'; at low noise levels (small t̂) the weight is raised appropriately, pushing the model to optimize more for atomic-level accuracy.

In terms of training scale, Boltz-1 was trained for about 68,000 steps in total with a batch size of 128. Training ran in two stages: the first 53,000 steps used a crop size of 384 tokens and 3,456 atoms; the final 15,000 steps increased the crop size to 512 tokens and 4,608 atoms, letting the model learn long-range dependencies in a larger context. The first part of training used a mix of 50% real PDB structures and 50% OpenFold distillation data.

For comparison, AlphaFold3 was trained for about 150,000 steps with a batch size of 256, **roughly 4 times the compute of Boltz-1**. Boltz-1 reaches the same accuracy on such a small compute budget thanks to the architectural improvements and training strategy optimizations described above. Ablations show that 3 recycling rounds plus 50 diffusion steps already reach the performance plateau, and increasing them further brings no significant gain.

### Computational Efficiency Optimizations

High-accuracy structure prediction is computationally very expensive. Boltz-1 makes systematic efficiency optimizations at three levels: the kernel level, the architecture level and the algorithm level.

**7.1 Trifast Kernel: cutting the memory of Triangle Self Attention by an order of magnitude**

**Triangle Self Attention** in the PairFormer is the largest computational bottleneck in the whole model: both its time and memory complexity are O(n³), where n is the number of tokens. For a complex of 2000 tokens, this means 8×10⁹ attention operations and the corresponding memory footprint.

Boltz-1 implements a blocked online softmax kernel in **Triton** (OpenAI's GPU programming framework) that **reduces the memory complexity from O(n³) to O(n²)** while also parallelizing efficiently on the GPU. At n=2000, Trifast is about 2 times faster than the DeepSpeed implementation, making training and inference on large complexes feasible with a reasonable number of GPUs.

**7.2 Sharing and caching the attention bias**

The Boltz-1 team observed that the **attention pair bias** in the denoising model depends neither on the current diffusion step nor on the input noisy structure. This means it stays constant across all sampling steps. Based on this insight, Boltz-1 **moves the computation of the attention pair bias before all sampling steps and runs it only once**; the result is cached and reused directly at every subsequent step. With 200-step diffusion sampling, this optimization saves 199 redundant computations.

**7.3 Greedy Symmetry Correction: making symmetry correction tractable**

Multimeric complexes often contain symmetric chains (for example homodimers and homotetramers), and the training loss must find the best match among all possible chain permutations. The number of chain permutations grows exponentially with the number of chains, so brute-force search becomes infeasible beyond three symmetric chains.

Boltz-1 uses a **two-stage greedy algorithm**:

**Stage 1:** Search for the best chain assignment, matching each predicted chain to its counterpart in the true structure so that the global alignment error is minimized;

**Stage 2:** Within each chain, greedily optimize the atom permutation to handle the matching of symmetric residues (such as ring flips of phenylalanine side chains).

This hierarchical greedy strategy compresses an exponential search space down to polynomial size, and in ablations it achieves accuracy comparable to exact search.

### Boltz-steering: Adding Physical Constraints at Inference Time

Although Boltz-1 matches AlphaFold3 in structure prediction accuracy, **about 57% of its generated conformations still contain physical defects**. These defects include symmetric chains overlapping in space, steric clashes between atoms, covalent bonds stretched to unreasonable lengths, inverted chiral centers, incorrect E/Z stereochemistry of double bonds, aromatic rings deviating from planarity and broken inter-chain covalent bonds. These problems are not unique to Boltz-1: AlphaFold3's physical validity pass rate is about 58%, and Chai-1's is even lower, only about 27%.

An intuitive way to see this: a diffusion model learns the statistical distribution of the data. It 'knows' what protein structures look like, but it does not explicitly 'know' the rules of physics. When the model is statistically right but violates physical constraints, these errors are not obvious in distance-based metrics such as RMSD and LDDT, yet they are fatal for downstream molecular dynamics simulations, free energy calculations and experimental validation.

**8.1 Theoretical framework: Feynman-Kac + Sequential Monte Carlo**

The core idea of Boltz-steering is to modify the diffusion distribution at inference time. Let the output distribution of the original diffusion model be p_θ(x₀); the target distribution we want to sample from is:

p_target(x₀) ∝ p_θ(x₀) × exp[−λ E(x₀)]

where E(x₀) is a physical-constraint potential and λ controls the strength of the constraint. **This is equivalent to multiplying the original distribution by a Boltzmann distribution of the physical constraints**: the structural features learned by the model are preserved while the probability of physically unreasonable conformations is pushed down.

In practice, Boltz-steering uses the **Feynman-Kac (FK)** path-integral framework to turn sampling from this target distribution into an importance-weighting problem along the diffusion path, which is then solved efficiently with the **Sequential Monte Carlo (SMC)** algorithm. At each diffusion step:

* **(1)** The model predicts the denoised coordinates x̂₀;
* **(2)** The physical-constraint energy E(x̂₀) is computed;
* **(3)** Gradient descent is applied to the coordinates, nudging x̂₀ along the negative gradient of E;
* **(4)** Multiple particles (candidate structures) are maintained, and importance weights are computed from the constraint energies;
* **(5)** Every 3 time steps, **importance-weighted resampling** is performed, discarding physically unreasonable candidates and duplicating physically reasonable ones.

**8.2 Seven classes of constraint potentials**

Boltz-steering defines seven classes of physical-constraint potentials, each in the form of a **flat-bottom potential**: the energy is zero within the reasonable range and a penalty arises only outside it. This ensures that a constraint acts only when something is physically unreasonable and does not interfere with predictions that are already sound.

**1. Chirality:** Based on the CIP priority ordering around tetrahedral centers, improper torsion angles are used to check whether chiral centers are correct. Flipping an R/S configuration can completely change a molecule's function.

**2. Bond Stereochemistry:** Checks E/Z double-bond configurations, using dihedral angles to determine whether the substituents on the two sides of a double bond are in the correct relative positions.

**3. Planar Bonds:** Ensures that the atoms of aromatic rings (benzene rings, purines, pyrimidines and so on) stay coplanar; non-planar aromatic rings are physically impossible.

**4. Internal Geometry:** Uses distance bounds computed by RDKit to keep 1-2 bond lengths, 1-3 bond angles and distances between non-bonded atoms within reasonable ranges.

**5. Steric Clash:** Requires the distance between non-bonded atoms to be greater than 0.725 times the sum of the two atoms' van der Waals radii. The 0.725 factor leaves a reasonable tolerance and avoids over-penalizing atoms that are only slightly in contact.

**6. Chain Overlap:** Targets the problem of symmetric chains in symmetric multimers overlapping completely in space. The constraint on the centroid distance between symmetric chains tightens over the diffusion steps: early on, a larger overlap tolerance is allowed (because the structure has not yet taken shape), and later it is gradually tightened to ensure that the chains are clearly separated in the final structure.

**7. Covalent Bonds:** Requires that the interatomic distance of inter-chain covalent bonds (such as disulfide bonds and covalently bound ligands) does not exceed 2Å, preventing covalent connections from being pulled apart by the diffusion process.

**What this figure asks:** Can Boltz-steering fix the typical physical defects in Boltz-1 outputs (chain overlap, chirality inversion)?

![](pic/boltz1_biomolecular_interaction/page_17.png){: width="1010" height="1048" loading="lazy" decoding="async"}

*Figure 7 \| Corrections made by Boltz-steering. The left column shows typical physical defects of Boltz-1 (DNA chains overlapping completely in space, an inverted chiral center); the right column shows the physically reasonable conformations after correction by Boltz-1x*

**8.3 Effect: physical validity jumps from 57% to 97%**

The model with Boltz-steering is called **Boltz-1x**. While structure prediction accuracy (LDDT, DockQ and other metrics) stays essentially unchanged, the physical validity pass rate jumps from 57% to **97%**. For comparison, AlphaFold3's physical validity is about 58% and Chai-1's only about 27%. A 97% pass rate means that almost every conformation Boltz-1x generates can be used directly in downstream molecular dynamics simulations and free energy calculations, with no extra structure-fixing post-processing.

## Part 4: Key Contributions

Boltz-1 was evaluated on two independent benchmarks: **593 recent PDB structures** (released after January 2023, ensuring that none of the models saw them during training) and **66 structures from the CASP15 competition**. Inference used 200 diffusion steps and 10 recycling rounds, generating 5 candidate structures per target and taking the best.

**What this figure asks:** On the PDB test set, how does Boltz-1 compare with AF3, Chai-1 and the other models on five core metrics?

![](pic/boltz1_biomolecular_interaction/page_15.png){: width="940" height="604" loading="lazy" decoding="async"}

*Figure 5 \| Comparison of four models on five core metrics on the PDB test set. The first four are structural accuracy metrics; the fifth is the physical validity metric*

A detailed reading of the five core metrics:

**Mean LDDT (local distance difference test, measuring local structural accuracy):** Boltz-1 scores about 0.73, statistically indistinguishable from AlphaFold3 (~0.73) and Chai-1 (~0.73). This shows that Boltz-1 fully reaches the level of the commercial models in residue-level local structural accuracy.

**DockQ > 0.23 (protein-protein interface quality; values above the threshold count as acceptable docking):** All models fall in the 0.62–0.65 range, with differences inside the confidence intervals. Protein-protein interface prediction is one of the most challenging tasks, and the fact that the four models perform similarly suggests that the current architectural paradigm may be approaching its ceiling on this task.

**Mean LDDT-PLI (protein-ligand interface accuracy):** AlphaFold3 and Boltz-1 are slightly better than Chai-1 on this metric. Accurate prediction of ligand binding modes is crucial for drug discovery, so Boltz-1's performance here is especially meaningful.

**L-RMSD &lt; 2Å (fraction of ligand poses with RMSD below 2Å):** The three models are close, with no significant differences. The 2Å RMSD threshold is the widely used criterion for a 'usable docking pose' in drug design.

**Physical Validity (physical validity pass rate):** This is Boltz-1x's most striking metric. **Boltz-1x leads by a wide margin with a 97% pass rate**, compared with about 58% for AlphaFold3 and only about 27% for Chai-1. This metric directly reflects whether the generated conformations can be used as-is by downstream physics-based simulation tools.

Taken together, on the four structural accuracy metrics Boltz-1 is statistically indistinguishable from the two commercial or closed models, while on physical validity Boltz-1x takes an overwhelming lead thanks to Boltz-steering. Given that Boltz-1's training compute is only about a quarter of AlphaFold3's and that everything is open-sourced under the MIT license, this result is very impressive.

## Part 5: Limitations and Outlook

The significance of Boltz-1 goes beyond 'reproducing AlphaFold3-level accuracy'. That is certainly important, but its real value lies at several levels:

**First, it shows that the open-source community can build structure prediction tools as accurate as commercial models on a reasonable compute budget.** Boltz-1's training compute is about a quarter of AlphaFold3's, and everything is open source (MIT license, including training code, model weights, the data processing pipeline and a standardized benchmark suite), giving academic labs and startups an affordable starting point.

**Second, Boltz-1's value as a platform has already been demonstrated.** Since its release, follow-up works such as **SwitchCraft** (multi-conformation protein design) and **Pair Representation Scaling** (sampling of conformational space) have been built directly on Boltz-1. A fully open prediction platform makes these innovations possible; had the underlying model been closed, such secondary development would simply not have been possible.

**Finally, Boltz-steering represents a methodology worth watching.** The traditional approach is to have the model implicitly learn all physical rules during training, but this requires enough physical-constraint information in the training data and a model large enough to encode both structural statistics and physical laws. Boltz-steering proposes a different philosophy: **decouple statistical learning from physical constraints, so that the model concentrates on learning the structural distribution while physical rules are introduced at inference time through explicit potentials**. This division of labor, 'learn statistics in training, add physics at inference', keeps the flexibility and data-driven strengths of diffusion models while satisfying, through interpretable and tunable constraint potentials, the hard requirements downstream applications place on physical validity. The idea has broad implications for the design of future molecular generative models.

## About the Corresponding Authors

Jeremy Wohlwend, Gabriele Corso, and Saro Passaro are the corresponding authors of this paper, all affiliated with MIT Computer Science and Artificial Intelligence Laboratory (CSAIL) and MIT Jameel Clinic. Gabriele Corso, who received his undergraduate degree from the University of Cambridge and led the development of the molecular docking diffusion model DiffDock during his doctoral studies at MIT, is one of the key drivers of applying generative AI to structural biology. Professor Regina Barzilay (MIT CSAIL and MIT Jameel Clinic) is a School of Engineering Distinguished Professor who focuses on the application of machine learning in drug discovery and molecular science, and serves as a senior mentor for the Boltz series of projects. Professor Tommi Jaakkola (also at MIT CSAIL and MIT Jameel Clinic) is a pioneering scholar in machine learning and probabilistic reasoning, whose research has profoundly influenced the theoretical foundations of the Boltz project in diffusion models and stochastic processes and has provided important insights for the application of the Feynman-Kac framework in Boltz-steering.

## Citation

Wohlwend, J., Corso, G., Passaro, S., Getz, N., Reveiz, M., Leidal, K., ... & Barzilay, R. (2024). Boltz-1: Democratizing Biomolecular Interaction Modeling. bioRxiv. https://doi.org/10.1101/2024.11.19.624167
