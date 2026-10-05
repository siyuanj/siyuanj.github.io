---
layout: post
title: "bioRxiv 2025 | RFdiffusion3: An all-atom diffusion model unifying protein, DNA, small-molecule and enzyme design"
date: 2026-09-05
description: "RFdiffusion3 diffuses every polymer atom explicitly, unifying binder, protein-DNA, small-molecule and enzyme active-site design in a 168M-parameter model that runs 10x faster than RFD2."
tags: [protein design, diffusion models, all-atom modeling, enzyme design, protein-DNA interactions]
lang: en
translation_key: rfdiffusion3_allatom_interactions
---

# De novo Design of All-atom Biomolecular Interactions with RFdiffusion3

### Link: [full article](https://doi.org/10.1101/2025.09.18.676967)

Authors: Jasper Butcher, Rohith Krishna, Raktim Mitra, ..., David Baker

bioRxiv, September 18, 2025

---
The RFdiffusion series has reached its third generation. RFD1 (Nature 2023) showed that diffusion models can design proteins de novo; RFD2 (Nat Methods 2026) brought atomic-level enzyme active sites into the scope of design. Now **RFD3 turns fully to an all-atom representation, modeling every polymer atom explicitly**, and unifies four design tasks in a single model: protein-protein, protein-DNA, protein-small molecule and enzyme active sites.

Built on the new AtomWorks framework, RFD3 uses only **168M parameters** yet runs inference 10 times faster than RFD2. In silico, protein binder design beats RFD1 on 4 of 5 targets, and enzyme active-site scaffolding beats RFD2 on 37 of 41 benchmark cases.

On the experimental side: a designed DNA-binding protein was confirmed to bind by yeast display (EC50 = 5.89 uM); a designed cysteine hydrolase reached **kcat/Km = 3557 M⁻¹s⁻¹**, far surpassing the previous best design for the same reaction (RFD2: 248 M⁻¹s⁻¹).

## Part 1: Research Question

To understand what motivated RFD3, it helps to review the representations used by the two previous generations:

**RFD1 (Nature 2023) — residue-level frames**

Each residue is represented by a rigid-body frame (translation + rotation), and diffusion takes place in frame space. This representation suits protein-protein interaction design naturally (binders, symmetric oligomers), but it cannot represent small molecules, DNA or fine-grained atomic interactions.

**RFD2 (Nat Methods 2026) — hybrid frames + atoms**

Diffusion still runs on residue-level frames, but atomic motif conditioning is introduced so the model can understand the atomic arrangement of an enzyme active site. This is a "grafted" solution: atomic information is injected as an extra constraint rather than being part of the diffusion process itself.

**RFD3 (this paper) — all-atom diffusion**

**Atoms are the fundamental unit being diffused.** Each residue is expanded into 14 atoms (4 backbone + 10 side chain, with smaller amino acids padded up to tryptophan size using virtual atoms placed at the Cb position), and diffusion runs directly in atomic coordinate space. This means atomic-level constraints are native, protein-DNA and protein-ligand co-diffusion become directly possible, and fine-grained conditions such as hydrogen bond donors/acceptors and solvent accessibility now have a physical basis.

In short, the representation spaces of RFD1 and RFD2 limited their design scope. Through all-atom modeling, RFD3 unifies protein-protein, protein-DNA, protein-small molecule and enzyme active-site tasks within a single consistent framework.

**What this figure asks:** How does RFD3's U-Net architecture handle all-atom diffusion of backbone and side chains at once while running 10 times faster than RFD2?

![](pic/rfdiffusion3_allatom_interactions/page_10.png){: width="1530" height="1793" loading="lazy" decoding="async"}

*Fig 1 \| RFD3 overview. (a) A 100-step diffusion trajectory denoising backbone and side-chain atoms simultaneously; (b) a variety of input conditions → RFD3 → protein binders, DNA-binding proteins, symmetric oligomers, enzymes, small-molecule binding proteins; (c) the U-Net architecture, containing an atom transformer and a token transformer; (d) inference-speed comparison: RFD3 is about 10 times faster than RFD2.*

## Part 2: Methodology: Architecture: a lightweight, fast design engine built on AtomWorks

RFD3 is built on the AtomWorks framework (github.com/RosettaCommons/atomworks) and uses a **transformer-based U-Net** architecture in three stages:

**Stage one: downsampling**

Atom-level and residue-level features are encoded. The 14 atoms of each residue first pass through sparse distance-based attention to capture local geometric context; information is then passed between the atom representations and the residue token representations through cross attention (down-pool: atoms → tokens).

**Stage two: sparse transformer**

The core computation happens at residue level: an 18-layer token transformer handles long-range interactions between residues. There is one key simplification here: **the Pairformer is cut from AlphaFold3's 48 layers down to just 2 layers**, and the computationally heavy triangle multiplicative update and triangle attention are removed entirely.

**Stage three: upsampling**

Residue-level information is passed back to the atom level through cross attention (up-pool: tokens → atoms) to modulate the atom features, and coordinate updates are finally predicted.

This "atom-residue coupled" U-Net design achieves two key goals:

* **All-atom precision**: atom-level attention captures the local chemical environment (hydrogen bond geometry, side-chain rotamers and so on)
* **Residue-level efficiency**: the most compute-heavy transformer layers run at residue level, avoiding the O(N²) blowup of all-atom attention
* The final model has only **168M parameters** (versus about 350M for AF3) and runs inference about 10 times faster than RFD2

Training follows a **staged strategy**: pretraining on a mixture of PDB structures and AlphaFold2 distillation structures, followed by further fine-tuning on specific tasks such as DNA binding and protein-protein interactions. This keeps the model from overfitting on complex tasks or becoming biased toward one class of system.

## Part 3: Key Figure Analysis

One of the biggest advantages of an all-atom representation is that conditioning becomes far more natural and varied. RFD3 supports the following 8 conditioning mechanisms:

**What this figure asks:** Which atom-level and global-level conditioning mechanisms does RFD3 support for steering protein generation?

![](pic/rfdiffusion3_allatom_interactions/page_12.png){: width="1530" height="1793" loading="lazy" decoding="async"}

*Fig 2 \| Global and atom-level conditioning. (a) An enzyme active-site scaffolding trajectory; (b) protein-DNA co-diffusion; (c) protein-ligand co-diffusion; (d) hydrogen bond conditioning; (e) solvent accessibility (RASA) conditioning; (f) centre-of-mass position conditioning; (g) symmetric diffusion (D2/C3/C5/C7).*

**1\. Target conditioning**

Coordinates of a target protein, DNA or small molecule are supplied, and the model generates a binding protein around the target.

**2\. Atomic motif conditioning**

The precise atomic coordinates of active-site residues are specified, and the model builds a protein backbone around them. Similar to RFD2, but natively supported within the all-atom framework.

**3\. Hydrogen bond conditioning**

Specifies which atoms should be hydrogen bond donors or acceptors. The conditioning alone raises the fraction of hydrogen bonds for small molecules from 26.67% to 32.67%, and **adding classifier-free guidance takes it to 36.67%**.

**4\. Solvent accessibility (RASA) conditioning**

Each ligand atom is labeled as buried, exposed or partially exposed, controlling the geometry of the binding pocket, for example requiring the ligand to be fully buried inside the protein.

**5\. Centre-of-mass conditioning (ORI token)**

Specifies the spatial position of the designed protein relative to the ligand or target, controlling the binding orientation.

**6\. Partial ligand input**

Only part of the ligand's coordinates are provided and the model infers the rest of the conformation, enabling joint sampling of protein and ligand.

**7\. Symmetric noise**

Injecting symmetrized noise directly generates symmetric oligomers such as D2, C3, C5 and C7.

**8\. Classifier-free guidance**

A weighted average of conditional and unconditional predictions strengthens the model's adherence to the specified conditions. This mechanism mirrors what is done in image generation and allows the balance between sample diversity and condition satisfaction to be tuned.

### In silico performance comparison

**What this figure asks:** Across protein binders, DNA-binding proteins, enzymes and small-molecule binding proteins, how much better is RFD3 than its predecessors?

![](pic/rfdiffusion3_allatom_interactions/page_14.png){: width="1530" height="1793" loading="lazy" decoding="async"}

*Fig 3 \| In silico benchmarks. (a) Protein binder design: RFD3 beats RFD1 on 4 of 5 targets and produces more diverse solutions; (b) DNA-binding protein design; (c) small-molecule binder design: RFD3 beats RFdiffusionAA; (d) enzyme active-site design: RFD3 beats RFD2 on the AME benchmark, with a particularly clear advantage on complex motifs containing 4+ residue islands.*

**Protein binder design (vs RFD1)**

For the five targets PD-L1, IL-2Ra, IL-7Ra, Tie2 and InsulinR, 400 designs were generated per target and evaluated with AF3. RFD3 outperforms RFD1 on 4 of them. More important is diversity: **RFD3 finds on average 8.2 independent successful clusters (clustered at TM-score 0.6), versus only 1.4 for RFD1**. RFD3 also samples a wider range of docking poses.

**DNA-binding protein design (a new capability)**

RFD3 supports protein-DNA co-diffusion, predicting the bound DNA conformation while generating the protein. Tested on 3 DNA sequences absent from the training set, pass rates were 8.67% (monomers) and 6.67% (dimers), with success defined as DNA-aligned RMSD &lt; 5A. Removing the preset DNA structure further increases the diversity of the generated DNA conformations.

**Small-molecule binder design (vs RFdiffusionAA)**

4 ligands were tested: FAD and SAM (common) plus IAI and OQO (rare). With the ligand held fixed, RFD3 significantly outperforms RFdiffusionAA on all 4. RFD3 also supports joint sampling of the ligand conformation (ligand diffusion + RASA burial conditioning), giving more diverse designs with lower Rosetta DDG binding energies.

**Enzyme active-site design (vs RFD2, AME benchmark)**

* RFD3 matches or beats RFD2 on **37 of the 41 AME benchmark cases (90%)**
* The advantage concentrates on complex motifs: for cases with more than four residue islands (n=12), RFD3 has a 15% pass rate versus only 4% for RFD2
* The generated folds are more novel and more diverse
* Cross-chain symmetric enzyme active-site scaffolding is supported (illustrated with a C2-symmetric example)

## Part 4: Key Contributions

**What this figure asks:** How did the DNA-binding proteins and cysteine hydrolases designed by RFD3 perform experimentally?

![](pic/rfdiffusion3_allatom_interactions/page_16.png){: width="1530" height="1793" loading="lazy" decoding="async"}

*Fig 4 \| Experimental validation. (a-b) DNA-binding protein designs and yeast display binding assays, EC50 = 5.89 +/- 2.15 uM; (c-d) cysteine hydrolase designs, kcat/Km = 3557 M⁻¹s⁻¹, exceeding the previous best design for this reaction.*

**DNA-binding proteins**

A two-stage approach was used: (1) sampling conditioned on the AF3-predicted DNA conformation; (2) a second round of scaffold optimization for designs with good predictions. 5 designs were synthesized and validated by yeast surface display with flow cytometry. One of them (DBRFD3) was confirmed to bind, with **EC50 = 5.89 +/- 2.15 uM**. Structure prediction indicates that this design recognizes DNA through the major groove.

**Cysteine hydrolase**

The catalytic triad is Cys-His-Asp plus Gln, with the substrate 4-methylumbelliferyl phenyl acetate, the same reaction as in the RFD2 paper but designed with RFD3. Of 190 designs screened, 35 showed multi-turnover catalytic activity. The catalytic efficiency of the best enzyme:

* **kcat/Km = 3557 M⁻¹s⁻¹**
* Previous best design for the same reaction (from RFD2): kcat/Km = 248 M⁻¹s⁻¹
* An improvement of roughly **14-fold**

### Overview of the three RFD generations

The key differences across the three generations of RFdiffusion:

|   | RFD1 (2023) | RFD2 (2026) | RFD3 (2025) |
|---|---|---|---|
| Representation | residue-level frames | hybrid frames+atoms | **all-atom** |
| Core architecture | RoseTTAFold | RoseTTAFoldAA | AtomWorks U-Net |
| Parameters | ~RoseTTAFold | ~RoseTTAFoldAA | **168M** |
| Training framework | DDPM | flow matching | flow matching |
| Protein-protein | ✓ | ✓ | ✓ (more diverse) |
| Enzyme active sites | residue-level | atom-level | atom-level (37/41 >= RFD2) |
| DNA | ✗ | ✗ | **✓** |
| Small molecules | ✗ | ligand coordinates | **joint diffusion** |
| Inference speed | baseline | ~10x slower | **~10x faster than RFD2** |

The trajectory from RFD1 to RFD3 is clear: the representation moves from residue level to all-atom, the design scope expands from protein-protein to a unified treatment of multiple molecule types, and the architecture evolves from RoseTTAFold to the lighter AtomWorks U-Net. RFD3's all-atom diffusion brings design capabilities that were previously scattered across different tools into a single model.

## Part 5: Limitations and Outlook

**The experimental success rate for DNA binders is low.** Only 1 of the 5 synthesized designs was confirmed to bind (20%), with micromolar affinity. As a brand-new design capability this is an acceptable starting point, but it is still some way from practical use.

**The AME benchmark is an in silico evaluation.** Experimental validation of enzyme design is limited to a single reaction (the cysteine hydrolase). The 37/41 advantage comes from AF3-based evaluation, and it is unclear across how many real reactions that advantage would hold.

**This is a preprint that has not yet been peer reviewed.** The article was posted on bioRxiv (September 2025), and the quality and reproducibility of both the in silico and experimental data await formal review.

**Sequence design still relies on external tools.** RFD3 generates backbone structures (backbone + side-chain geometry); sequence design still has to be done with ProteinMPNN / LigandMPNN, so this is not end-to-end joint generation of structure and sequence.

**Training data bias.** Despite using the full PDB plus AlphaFold2 distillation structures, the model still reflects the preferences of the PDB data distribution: the generated sequences tend to have a high proportion of alanine, and the structures are biased toward compact globular folds. Design of atypical topologies and unusual amino acid compositions may be limited.

**Structural success does not equal developability.** Even with good structure-prediction metrics, a designed protein must clear several engineering hurdles before it is genuinely usable: expression level, purification stability, immunogenicity and in vivo activity are all outside the current evaluation framework.

## About the Corresponding Authors

Rohith Krishna is a research scientist at the Institute for Protein Design (IPD) at the University of Washington, where he also earned his PhD. He is a core architect of the RFdiffusion series, led the development of RFD2 and RFD3, and is also the first author of the RoseTTAFold All-Atom framework (Science, 2024) and a principal developer of AtomWorks. His work has driven the shift in protein design from residue-level to all-atom modeling.

David Baker is a professor at the University of Washington, a Howard Hughes Medical Institute investigator and the founding director of the Institute for Protein Design. A pioneer of computational protein design, he developed the Rosetta software suite and received the 2024 Nobel Prize in Chemistry for his groundbreaking contributions to computational protein design (shared with Demis Hassabis and John Jumper). From RoseTTAFold to the RFdiffusion series, the Baker lab has continued to lead the frontier of AI-driven protein design.

## Citation

Butcher, J., Krishna, R., Mitra, R., Brent, R. I., Li, Y., Corley, N., ... & Baker, D. (2025). De novo Design of All-atom Biomolecular Interactions with RFdiffusion3. bioRxiv. https://doi.org/10.1101/2025.09.18.676967
