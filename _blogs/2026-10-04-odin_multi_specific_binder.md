---
layout: post
title: "bioRxiv 2026 | Odin-Multi: Jointly optimizing one sequence against many targets to control binder specificity and cross-reactivity at the design stage"
date: 2026-10-04
description: "Odin-Multi optimizes a single binder sequence against multiple targets and off-targets inside frozen AlphaFold2, turning cross-reactivity and specificity into design objectives rather than screening outcomes."
tags: [protein design, binder specificity, cross-reactivity, alphafold2, pmhc]
lang: en
translation_key: odin_multi_specific_binder
---

# Specificity-driven protein binder design with Odin-Multi

### Link: [full article](https://doi.org/10.64898/2026.09.08.749745)

Authors: Valentas Brasas, Charlotte R. Christensen, Kasper H. Björnsson, ..., Timothy P. Jenkins

bioRxiv, September 9, 2026

---
A good protein binder is defined as much by what it does not bind as by what it does. In tumor immunotherapy, a pMHC-targeting molecule that also recognizes a near-identical peptide on healthy tissue, differing by a single amino acid, can cause severe toxicity; an antivenom that neutralizes only one toxin while ignoring other members of the same family offers much weaker protection.

Valentas Brasas, Timothy P. Jenkins and colleagues at the Technical University of Denmark (DTU) present **Odin-Multi**, a multi-context protein binder design framework built on a frozen AlphaFold2. It lets a single binder sequence face several targets and off-targets at once, applying an attractive loss to the targets it should bind and a repulsive loss to those it should avoid, so that the binding profile is controlled during sequence generation itself.

Results on three computational benchmarks: for cross-reactivity against pairs of GPCRs, the pass rate reached **83.5%–96.8%** (versus only 6.8%–36.3% for single-target controls); for dual-target three-finger toxin designs, it rose from 0.8% to **9.2%**; and for single-residue pMHC specificity designs, from 6.0% to **14.2%**. Experimentally, the cross-reactive design Poly 5 bound Erabutoxin A at 11.95 nM and a candidate NK-shNTx-containing component at 34.43 nM, while the specificity design S2 discriminated between pMHCs differing by a single amino acid better than previously reported designs.

*Note: this is a bioRxiv preprint and has not yet been peer reviewed.*

## Part 1: Research Question

Today's mainstream deep learning methods for protein design (RFdiffusion, ProteinMPNN, BindCraft and others) typically optimize around a single binder–target complex and excel at designing proteins that 'bind a given target'. Real applications, however, often require control over a more complex binding profile:

**Specificity design**: bind target T while avoiding binding to similar off-targets. For instance, a tumor neoantigen pMHC and a peptide presented by normal tissue may differ by only a single amino acid.

**Cross-reactivity design**: have one binder recognize several related targets at once. Snake venom, for example, contains multiple homologous toxins, and a single molecule needs to cover the whole family.

The conventional approach has been to design single-target binders first and then weed out unsuitable candidates through post hoc screening (structural filters, computational cross-screening, phage cross-panning, experimental multi-target assays). This 'generate first, discard later' strategy can only pick from the sequences already produced; it cannot change which sequences the design process generates in the first place.

Odin-Multi's central idea is to **turn specificity and cross-reactivity from screening criteria into generation objectives**, letting multiple targets and off-targets jointly shape the binder sequence during optimization.

## Part 2: Methodology: Turning specificity and cross-reactivity into generation objectives

*Figure 1. The Odin-Multi workflow. (a) Structures of multiple target and off-target proteins are provided as input. (b) All contexts share the same optimizable binder sequence. (c) A frozen AlphaFold2 predicts each complex structure separately. (d) An attractive loss is applied to targets and a repulsive loss to off-targets. (e) Gradients from all contexts are merged to update the sequence. (f) Three-stage sequence optimization. (g–i) Candidate ranking, filtering and final output.*

Within each design trajectory, Odin-Multi maintains a shared optimizable binder sequence tensor θ ∈ R^(20×m), where 20 corresponds to the standard amino acids and m is the binder length. This sequence is paired with every target and off-target to form complexes, each of which is predicted independently by a frozen AlphaFold2, so the same sequence receives optimization signals from all target and off-target complexes simultaneously and every context helps shape the final sequence.

**The attractive loss on targets** encourages high-confidence complexes: it lowers interface iPAE, raises iPTM, increases interface contacts and improves binder pLDDT and compactness, while an optional ProteinMPNN/LigandMPNN loss additionally constrains sequence–structure compatibility. **The repulsive loss on off-targets** does the opposite: it raises off-target iPAE, lowers iPTM and reduces interface contacts, preventing stable off-target complexes from forming.

The gradients from different contexts can conflict, since an amino acid that favors binding to the target may simultaneously strengthen affinity for an off-target. Tasks that include off-targets use **PCGrad** to mitigate gradient conflict. Sequence optimization proceeds in three stages: continuous logit exploration → temperature-annealed softmax → straight-through one-hot discretization, moving the system gradually from continuous space to a real protein sequence.

Candidate sequences are then ranked and filtered. Cross-reactivity tasks are ranked by the iPAE of the worst-performing target, which encourages balanced performance across targets; specificity tasks are ranked by the ratio of target iPAE to off-target iPAE, which rewards target/off-target separation. Top-ranked designs are then re-predicted with AF3 and filtered on PyRosetta shape complementarity, removing candidates with large prediction discrepancies.

This unified framework can express three kinds of task: **specificity** (attract one target + repel off-targets), **cross-reactivity** (attract several targets), and **selective cross-reactivity** (cover part of a family while repelling the rest).

## Part 3: Key Figure Analysis

### Figure 1: Multi-context joint optimization workflow

**What this figure asks:** How does Odin-Multi let a single sequence simultaneously optimize binding to several targets and repulsion from off-targets?

![Figure 1: Workflow](pic/odin_multi_specific_binder/page_3.png){: width="890" height="700" loading="lazy" decoding="async"}

*Figure 1. The Odin-Multi workflow. (a) Multiple target and off-target structures as input. (b) All contexts share one optimizable sequence. (c) A frozen AF2 predicts each complex separately. (d) Attractive loss for targets, repulsive loss for off-targets. (e) Gradients are merged to update the sequence. (f) Three-stage optimization. (g–i) Ranking, filtering, output.*

The core is a shared sequence θ that is paired with every target and off-target, with each complex predicted independently by a frozen AF2. **Targets get an attractive loss** (lower iPAE, higher iPTM, more interface contacts) and **off-targets get a repulsive loss** (exactly the reverse). Gradients from different contexts can conflict, which PCGrad alleviates.

This turns specificity and cross-reactivity **from screening criteria into generation objectives**: multiple targets and off-targets shape the sequence during optimization instead of being used to 'generate first and discard later'. One framework expresses three tasks: specificity (attract one + repel off-targets), cross-reactivity (attract several), and selective cross-reactivity (cover part of a family, repel the rest).

### Figure 2: Computational benchmarks on three systems

**What this figure asks:** On GPCRs, three-finger toxins and pMHCs, how much better is joint optimization than single-target design?

![Figure 2: Computational benchmarks](pic/odin_multi_specific_binder/page_5.png){: width="890" height="710" loading="lazy" decoding="async"}

*Figure 2. Computational benchmarks. (a) The three systems: class B1 GPCRs, three-finger toxins, pMHC variants. (b) Dual-target GPCRs (teal = joint optimization, gray = single-target control). (c) Dual-target three-finger toxins. (d) pMHC specificity (with and without the off-target gradient).*

The three cases get progressively harder. **Dual-target GPCR cross-reactivity** (GLP-1R/GCGR/GIPR, 45.6%–51.2% sequence identity): joint optimization gives a pass rate of **83.5%–96.8%, versus only 6.8%–36.3% for single-target controls** (purely computational, with no experimental validation).

**Dual-target three-finger toxins**: the pass rate for both targets rises from 0.8% with single-target optimization to **9.2%** (about 12-fold). **Single-residue pMHC specificity** (differing only by Met→Ala): adding M4A counter-selection raises the pass rate from 6.0% to 14.2%, but the difference shrinks under AF3 re-evaluation (P=0.0612), indicating that this computational effect depends on the prediction model.

### Figure 3: Experimental validation of the dual-toxin binder Poly 5

**What this figure asks:** Does the designed dual-target three-finger toxin binder Poly 5 really bind both toxins in BLI experiments?

![Figure 3: Poly 5](pic/odin_multi_specific_binder/page_7.png){: width="890" height="826" loading="lazy" decoding="async"}

*Figure 3. Experimental validation of the dual-target three-finger toxin binder Poly 5. (a) Sequence alignment of the two toxins. (b) Candidate selection. (c) DELFIA primary screen. (d) Size exclusion chromatography. (e) AF2-predicted cross-reactive binding mode. (f) BLI binding kinetics.*

The design was an 80 aa minibinder with equal weight on both toxins; after AF3 + PyRosetta filtering, 30 were selected for experimental testing. Poly 5 produced more than 4-fold signal against both Erabutoxin A and whole venom containing NK-shNTx, and BLI fitting gave higher-affinity components of **K<sub>D</sub> = 11.95 nM for Erabutoxin A and 34.43 nM for the candidate fraction**, both in the nanomolar range. Structure prediction suggests it mainly recognizes the beta-sheet core shared by the two toxins while accommodating differences at the periphery, much as broadly neutralizing antibodies recognize conserved epitopes. Note that only binding was demonstrated, not neutralizing function.

### Figure 4: Experimental validation of the specific binder S2

**What this figure asks:** For pMHCs differing by a single amino acid, can the designed S2 really tell target from off-target?

![Figure 4: S2](pic/odin_multi_specific_binder/page_10.png){: width="1036" height="758" loading="lazy" decoding="async"}

*Figure 4. Experimental validation of pMHC-targeting minibinders. (a) The three design conditions. (b) Flow cytometry sorting. (c–e) Fold-change in target/off-target fluorescence. (f) AF3 structure of the S2–target complex and contacts in the Met4 pocket.*

Three conditions were used: target only, target + CMV, and target + M4A counter-selection. 500 minibinders were expressed on Jurkat T cells in a CAR-like format and sorted by tetramer FACS. Among the top 20 enriched designs, 11 came from the target-only group and only 3 from the M4A group, showing that **specificity constraints lower the yield of target binders** (the M4A group needed 8× more trajectories to assemble a library of the same size).

Yet the **best discrimination came from S2** in the M4A group: its target tetramer MFI exceeded that of the previously reported NY1-B04, while its signal on M4A, which differs only by Met→Ala, was markedly lower. **Panel f**: the Met4 side chain of the target peptide inserts into a pocket on the S2 surface (contacting Met20, Val23, Phe57 and others), whereas the smaller Ala of M4A cannot fill that pocket. This structural explanation comes from prediction and has not been experimentally confirmed. The key lesson from this group is that high target affinity does not imply high specificity.

## Part 4: Key Contributions

*Figure 3. Experimental validation of the dual-target three-finger toxin binder Poly 5. (a) Sequence alignment of the two toxins. (b) Candidate selection. (c) DELFIA primary screen. (d) Size exclusion chromatography. (e) AF2-predicted cross-reactive binding mode. (f) BLI binding kinetics.*

**Poly 5: a dual-target toxin binder**

The authors designed 80-amino-acid minibinders with equal weight on the two toxins. After AF3 and PyRosetta filtering (ipSAE > 0.61 for both targets, shape complementarity > 0.5), 30 were selected for experiments. Of these 30 designs, 24 gave protein yields above the empty-vector negative control. In the DELFIA primary screen, **Poly 5** produced more than 4-fold signal over the blocked control against both Erabutoxin A and Naja kaouthia whole venom containing NK-shNTx; another high-signal design, Poly 30, was judged to be nonspecific adsorption because its blocked-control signal was equally high. The experimental hit rate was 1/30 (3.3%).

Because purified NK-shNTx was unavailable, the authors obtained a candidate component, fraction 3, from cobra whole venom by RP-HPLC. BLI data were fitted with a 2:1 heterogeneous-ligand model, giving higher-affinity components of K<sub>D1</sub> = **11.95 nM** for Erabutoxin A and K<sub>D1</sub> = **34.43 nM** for fraction 3, both in the nanomolar range. Structure prediction indicates that Poly 5 mainly recognizes the beta-sheet surface core shared by the two toxins, with peripheral contacts accommodating sequence differences, following the same logic by which broadly neutralizing antibodies recognize conserved epitopes.

**S2: a pMHC-specific binder**

The pMHC experiments used three conditions: target only (Group 1, 166 designs), target + CMV counter-selection (Group 2, 167 designs), and target + M4A counter-selection (Group 3, 167 designs). 500 minibinders were expressed on the surface of Jurkat T cells in a CAR-like format and sorted by FACS with NY-ESO-1 pMHC tetramers; the 20 most enriched designs were taken forward for monoclonal validation, of which Group 1 contributed 11, Group 2 contributed 6 and Group 3 only 3, meaning the specificity constraint substantially reduced the yield of target binders.

This distribution itself illustrates an important trade-off: specificity constraints improve the discrimination of a few candidates but lower the overall yield of target binders. To assemble a sufficiently large experimental library, the M4A counter-selection condition required 1,700 design trajectories, 8× more than the 203 used for the target-only condition.

Even so, **S2** from Group 3 achieved the best antigen discrimination. The strongest target binders from the target-only group (such as N1 and N3) also gave strong signal on M4A, so high target affinity does not equal high specificity. S2's target tetramer MFI was higher than that of the previously reported de novo minibinder NY1-B04, while its signal on M4A, which differs by just the single Met→Ala residue, was clearly lower, giving better target/off-target discrimination than NY1-B04. AF3 predicts that the Met4 side chain of the target peptide inserts into a pocket on the S2 surface, contacting residues such as Met20, Val23, Phe57, Glu58 and Trp61; the smaller Ala side chain of M4A cannot fill this pocket, reducing hydrophobic packing and shape complementarity. This structural explanation comes from prediction and has not been experimentally confirmed.

**Caveats to keep in mind about the experimental results**

Each design mode yielded only one main experimental lead (Poly 5 and S2). The identity of Poly 5's second binding partner remains uncertain, since the MALDI-TOF mass of fraction 3 does not fully match the theoretical value of the candidate protein, and the paper demonstrates binding only, not toxin neutralization. The structural basis of S2's specificity rests on AF3 predictions. The GPCR benchmark showed the strongest computational effect but has no experimental validation at all.

## Part 5: Limitations and Outlook

Traditional protein design asks for 'a protein that binds T'; Odin-Multi generalizes the problem to 'a protein that satisfies a specified interaction profile', attracting some targets and repelling others. This makes cross-reactivity and specificity optimization signals within the design process, so off-targets can directly influence where the sequence goes.

From an optimization standpoint, cross-reactivity and specificity are simply different combinations of target roles: several attractive targets, attraction plus repulsion, or both at once. This unified formulation extends directly to practical settings such as broad-spectrum antivenoms, multi-receptor polyagonists, tumor pMHC targeting and receptor subtype selectivity.

Higher specificity comes at a cost: a three-context design takes roughly 3× as long per trajectory as a single-context one (59 min vs 20 min on a V100 GPU), and M4A counter-selection additionally requires many more trajectories to collect enough candidates. The ceiling of the method is also set by the underlying structure prediction model: if the model cannot accurately distinguish binding differences between target and off-target, gradient optimization cannot reliably learn that distinction either, which is exactly what the weakened effect of the pMHC benchmark under AF3 re-evaluation reflects.

The choice of off-target matters just as much. The CMV off-target was rarely recognized even in target-only designs (only one clone showed cross-reactivity), so adding CMV counter-selection brought limited extra benefit. An ideal off-target should be biologically important, genuinely at risk of being bound in unconstrained designs, and similar enough to the target to exert real pressure on the design.

## About the Corresponding Authors

Valentas Brasas and Timothy P. Jenkins are both corresponding authors of this paper and work at the Department of Biotechnology and Biomedicine and the Center for Translational Protein Design at the Technical University of Denmark (DTU). Timothy P. Jenkins's research focuses on snake venom toxinomics and computational protein design, and his group applies deep learning protein design methods to developing broad-spectrum antivenom binders. Valentas Brasas is a doctoral researcher in the group who works on AlphaFold2-based methods for protein binder design, of which Odin-Multi is one of his main contributions.

## Citation

Brasas, V., Christensen, C. R., Björnsson, K. H., Møller, V. E., Scapolo, B., Benard-Valle, M., ... & Jenkins, T. P. (2026). Specificity-driven protein binder design with Odin-Multi. bioRxiv. https://doi.org/10.64898/2026.09.08.749745
