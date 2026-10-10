---
layout: post
title: "Science 2026 | RNet: De novo design of RNA pseudoknots with deep learning, AI matches human designers"
date: 2026-08-28
description: "A four-round blind competition across 57 pseudoknots and ~50,000 sequences shows that deep learning, powered by RibonanzaNet, matches experienced human designers in de novo RNA pseudoknot design."
tags: [RNA design, pseudoknot, deep learning, RibonanzaNet, cryo-EM]
lang: en
translation_key: rna_pseudoknot_design
---

# De novo design of RNA pseudoknots with deep learning

### Link: [full article](https://doi.org/10.1126/science.aeg6829)

Authors: Jill Townley, Wipapat Kladwang, David Baker, ..., Rhiju Das

Science, August 27, 2026

---
Protein design has entered an era where virtually any target structure can be designed on demand. But what about RNA? The field remains largely stuck at redesigning known structures and assembling pre-existing modules. In particular, the pseudoknot — one of the most complex and functionally important RNA secondary structures — has never been designed de novo.

This Science paper from the Rhiju Das laboratory at Stanford demonstrates, through a four-round blind competition involving 57 pseudoknots and approximately 50,000 sequences, that **deep learning methods have matched experienced human designers in de novo RNA pseudoknot design**. The key enabler is RNet (RibonanzaNet) — a foundation model trained on chemical probing data. Even more exciting, cryo-EM reveals that AI-designed RNAs **spontaneously form tertiary structures that were never explicitly programmed into the designs**.

## Part 1: Research Question

RNA design has long faced a bottleneck: the recent explosion of de novo protein design has relied heavily on high-accuracy 3D structure prediction and generation. RNA is different — **3D structure prediction is not yet accurate enough**, especially for synthetic, non-natural RNAs lacking homologous sequences. As a result, the field has been better at designing simple secondary structures but has struggled to reliably design complex topologies.

The **pseudoknot** is a quintessential example of such complex RNA structure — nucleotides in a stem-loop's loop region base-pair with nucleotides outside the loop, creating a 'knotted' topology. Natural pseudoknots are ubiquitous in ribozymes, riboswitches, and ribosomal frameshifting signals, playing critical functional roles. They also represent a blind spot for most traditional RNA secondary structure algorithms (standard dynamic programming cannot handle them).

The paper therefore asks:

**Central question**

**Can complex RNA pseudoknots that have never been seen before be designed de novo using only deep learning and experimental feedback, without relying on high-accuracy RNA 3D prediction? And if so, how do AI methods compare against experienced human RNA designers?**

## Part 2: Methodology

Rather than proposing a single new model, this paper **organized a large-scale design competition** and drew reliable conclusions through three progressively stringent layers of experimental validation.

**Eterna OpenKnot competition: four blind rounds, 57 pseudoknots**

**Round 1**: 17 pseudoknot targets (11 from PDB, 6 synthetic designs), with 6 AI methods competing alongside Eterna human players.

**Round 2**: The same 17 targets, but all methods resubmitted designs after integrating RNet feedback — testing how much a good pre-screening tool could improve performance.

**Round 3**: 20 entirely new targets with fewer PDB-derived structures to avoid memorization effects — testing generalization.

**Round 4**: 20 longer targets (up to 240 nt) from more diverse sources — testing the ability to handle larger and more complex structures.

**RNet (RibonanzaNet): the turning point of the paper**

RNet is a BERT-style deep network (~11.37 million parameters) trained on **chemical probing data (SHAPE reactivity) from approximately one million RNA sequences**. It does not predict 3D structures; instead, it predicts per-nucleotide chemical reactivity — single-stranded nucleotides show high reactivity, while base-paired nucleotides show low reactivity.

It is essentially a **foundation model that has learned the patterns of experimental structural readouts**, enabling it to filter out unreliable designs before any experiment is run. After Round 1, the authors found that RNet-predicted SHAPE profiles closely matched experimental data, with particularly strong ability to identify poor designs.

The implications are profound: **the key breakthrough for RNA design may not be getting 3D prediction right first, but rather having a sufficiently accurate 'experiment-driven secondary structure formability model' as a filter.**

**Three leading AI design methods**

**MPNN-fixbb**: A message-passing neural network analogous to ProteinMPNN in the protein field — it takes a fixed backbone/structural constraints as input and outputs sequences. The best-performing AI method in Round 1.

**gRNAde**: A geometric deep learning approach using equivariant graph neural networks for 3D RNA inverse design. A later version (gRNAde-no3d) **does not even require 3D input**, demonstrating that high-quality 3D backbones are not strictly necessary for design.

**Struct2SeQ-SHAPE**: A deep Q reinforcement learning method whose training and guidance rely **almost entirely on RNet**. It significantly outperformed other methods in Round 4.

**Three-tiered progressive validation — the core reason this paper is so convincing**

**Tier 1: SHAPE chemical probing** — single-nucleotide resolution assessment. An OpenKnot score > 90 was considered a successful design. A total of ~50,000 sequences were tested.

**Tier 2: M2R-seq compensatory mutagenesis** — for each base pair, single mutations disrupt the pair and double 'flip' mutations restore it, directly verifying whether base pairs truly exist and ruling out SHAPE false positives or alternative structures.

**Tier 3: Cryo-EM** — atomic-level 3D structural validation. Designs were embedded in a circularly permuted group II intron scaffold for imaging, achieving resolutions of 2.9–5.2 Å.

This progressive validation pipeline — from **chemical mapping → compensatory mutagenesis → structural imaging** — represents an exceptionally rigorous setup for an RNA design paper.

## Part 3: Key Figure Analysis

### Figure 1: Starting targets — comparing AI and humans, and the RNet turning point

**What this figure asks:** On a set of existing pseudoknot targets, who performs better — AI or humans? Does incorporating RNet improve performance?

![Figure 1: Performance on 17 starting targets](pic/rna_pseudoknot_design/page_2.png){: width="1782" height="2268" loading="lazy" decoding="async"}

*Figure 1. (A-D) Comparison of SHAPE data for the c-di-GMP-II riboswitch target W03. (E) SHAPE profile overview across multiple methods. (F) Sequence identity vs. OpenKnot score. (G-J) Changes in success rate from Round 1 to Round 2 across methods.*

**How to read this figure**

* **Panel A-D**: Using the c-di-GMP-II riboswitch (W03) as an example. Ideal SHAPE profile (A), Eterna human design (B, score 92.7), MPNN-fixbb AI design (C, score 88.7), and natural sequence (D, score 74.1). The natural sequence scored lowest — because the natural riboswitch relies on ligand binding for stabilization in vivo and cannot fold independently without it. The challenge is therefore not to reproduce the natural sequence, but to **design a new sequence that can stably form the target pseudoknot without ligand assistance**.
* **Panel F** (key): Scatter plot of sequence identity vs. OpenKnot score. Many high-scoring designs share &lt; 50% identity with the natural sequence, while all designs with > 90% similarity to the starting sequence scored &lt; 80. This demonstrates that **the key to de novo design is boldly exploring new sequence space, rather than making incremental modifications**.
* **Panel G-J**: Changes from Round 1 (G, H) to Round 2 (I, J). In Round 1, human designers clearly outperformed most AI methods (except MPNN-fixbb). **After integrating RNet (Round 2), all AI methods showed dramatic performance gains, and the difference between AI and human designers on the 17 targets was no longer statistically significant.**

**Takeaway:** RNet is the first turning point of the paper. In Round 1, AI overall trailed humans; with RNet guidance, the gap vanished within a single round. This demonstrates that for RNA design, **having a good prospective filter (one that can assess design viability before experiments) matters more than the design method itself**.

### Figure 2: Generalization — can AI handle 40 entirely new pseudoknots?

**What this figure asks:** Can these methods generalize to previously unseen targets? This is the most definitive benchmark figure in the paper.

![Figure 2: Performance on 40 new target pseudoknots](pic/rna_pseudoknot_design/page_3.png){: width="1782" height="2268" loading="lazy" decoding="async"}

*Figure 2. (A-B) Highest- and lowest-scoring design examples from Round 3. (C) Success rates by method in Round 3. (D-E) Highest-scoring designs from Round 4. (F) Success rates by method in Round 4.*

**How to read this figure**

* **Panel A**: In Round 3, "Kissing Multiloops" (P20)—an unprecedented complex pseudoknot topology. Eterna human designers and AI methods such as MPNN-fixbb and Struct2SeQ-SHAPE showed comparable scores; AI did not significantly outperform humans on this difficult problem (specific scores in Figure 2).
* **Panel B**: P16 (AK_PK100-3) — **a target that proved difficult for all methods**. Some high-scoring designs better matched an alternative secondary structure, indicating that SHAPE/OpenKnot scoring, while powerful, is not infallible — this also motivated the subsequent M2R-seq validation.
* **Panel C**: Success rate summary for Round 3 (20 targets). Light/dark bar comparisons show performance with and without RNet structural filtering — RNet filtering broadly improved success rates. **Both the AI aggregate and Eterna humans achieved 19/20 successes.**
* **Panel D-F**: Round 4 tested longer sequences (117–240 nt). Starting sequences achieved only ~20% success, while AI methods reached 40–60%. **Struct2SeQ-SHAPE significantly outperformed other methods in Round 4** — the purely RNet-guided reinforcement learning approach proved especially effective for longer sequences. The AI and human aggregate still reached 19/20.

**Takeaway:** AI held up against entirely new targets. These 40 targets came from diverse sources (known natural structures + Pseudobase + novel structures proposed by Eterna players + longer RNAs), meaning this is **genuine generalization, not memorization of training data**. The sole systematic failure on P16 indicates that design boundaries still exist.

### Figure 3: Compensatory mutagenesis validation — are these base pairs truly the intended ones?

**What this figure asks:** Could high OpenKnot scores be SHAPE artifacts? Could some 'high-scoring designs' actually fold into alternative structures that merely produce similar SHAPE profiles?

![Figure 3: Compensatory mutagenesis M2R-seq](pic/rna_pseudoknot_design/page_4.png){: width="1782" height="2268" loading="lazy" decoding="async"}

*Figure 3. (A-D) SHAPE comparison of the gRNAde-designed P20 target: wild-type, single mutants, and double-mutant rescue. (E) Overlay of four SHAPE profiles. (F) Rescue factors for all target base pairs. (G) M2R-seq summary for all 20 Round 3 targets.*

**How to read this figure**

* **Panel A-D** (M2R logic demonstration): Taking base pair G38-C61 as an example. The G38C single mutation (B) disrupts the base pair, producing local SHAPE changes; the C61G single mutation (C) does likewise. The G38C + C61G double mutation (D) 'flips' the pair to a new combination — and the SHAPE profile is restored. This directly proves that **these two positions are indeed paired in the original design**, a result that cannot be explained by just any alternative structure.
* **Panel F**: Rather than a single example, this panel systematically evaluates the rescue factor (degree of double-mutant recovery) for all target base pairs across the entire RNA. Most target stems receive strong support.
* **Panel G** (key summary): Large-scale M2R-seq was performed on the best designs from each method across all 20 Round 3 targets (involving over 10,000 single/double mutant sequences). Success criterion: at least 80% of target stems validated. **19/20 targets had at least one AI or Eterna design that met this threshold. Overall success rate: 90% for AI methods, 75% for Eterna humans.** Deep learning methods significantly outperformed Rosetta (P &lt; 0.05).

**Takeaway:** The SHAPE-based conclusions from Fig. 1 and Fig. 2 receive more rigorous, independent support here. High OpenKnot scores generally correspond to genuine formation of the target stems, **not widespread false-positive alternative structures**. This constitutes the second layer of the evidence chain.

### Figure 4: Cryo-EM — AI-designed RNAs form entirely new 3D folds

**What this figure asks:** Beyond getting the secondary structure right, do these designs actually form ordered, stable, physically real three-dimensional structures?

![Figure 4: Cryo-EM of AI-designed pseudoknotted RNA](pic/rna_pseudoknot_design/page_5.png){: width="1782" height="2268" loading="lazy" decoding="async"}

*Figure 4. (A) Secondary structure of the Kissing Multiloops target P20. (B) AlphaFold 3-predicted 3D structure. (C-E) Cryo-EM density maps and model fits for three AI designs, along with non-canonical tertiary interactions discovered.*

**How to read this figure**

* **Panel A**: Secondary structure of P20 (Kissing Multiloops) — 7 stems (P1-P7), an unprecedented complex pseudoknot topology proposed by Eterna participants.
* **Panel B** (important control): AlphaFold 3-predicted 3D structure. Subsequent experiments reveal that **the actual cryo-EM structure does not match this prediction** — demonstrating that successful RNA design was not achieved because we can already accurately predict RNA 3D structure. The real drivers were secondary structure design + RNet filtering.
* **Panel C-E**: Three AI designs (Struct2SeQ-SHAPE, MPNN-fixbb, gRNAde) were resolved at **5.2 Å, 4.8 Å, and 3.6 Å** (4.8, 4.0, and 2.9 Å after sharpening), respectively. All 7 target stems were confirmed as base-paired (F₁ = 0.89, 0.95, 0.95). None of the three folds are homologous to known RNA structures — these are entirely new 3D folds.
* **Panel D-E close-ups**: In the two highest-resolution designs, **additional non-canonical base pairs, base triples, and tertiary interactions** were discovered — none of which were explicitly modeled during the design process. The AI did not request these, but once the overall secondary scaffold was stabilized, the RNA 'found' these tertiary contacts on its own to stabilize the fold.

**Takeaway:** This is the most exciting finding of the entire paper. AI-designed RNAs spontaneously formed complex tertiary structures that the designers never requested. This suggests that **once the global constraints (secondary structure) are correctly established, higher-order local geometry can naturally emerge**. This is encouraging for future design of large RNA machines, aptamers, and ribozymes. Note: a fourth design (MPNN-RFdiff) formed a dimer instead of the expected monomer, indicating that correct secondary structure is the foundation but not all 3D details are automatically perfect.

## Part 4: Key Contributions

### Four figures, four layers of claims

1\. **Fig. 1**: Design is feasible (RNet is the key to the performance leap)

2\. **Fig. 2**: Generalizes to new targets (40 entirely new targets, both AI and humans achieved 19/20)

3\. **Fig. 3**: Base pairs are genuine (independently validated by M2R-seq, ruling out false positives)

4\. **Fig. 4**: 3D structures are real (cryo-EM reveals novel 3D folds + emergent tertiary interactions)

### Core scientific implications

**A design route distinct from protein design**

The successful path for protein design has been: high-accuracy 3D prediction/generation → inverse design under structural constraints. This paper charts a different course for RNA: **first ensure that the correct secondary structure will form with sufficient reliability → filter with a large model trained on experimental data → let the RNA find its own stable 3D fold**. RNA design may not need to replicate the protein design playbook — this is the most important conceptual takeaway.

**AI methods work best in combination**

The authors could not statistically prove that any single AI framework is 'definitively the best.' Sequence space analysis shows that different AI methods find solutions in **largely non-overlapping regions of sequence space**, indicating complementarity. In practice, the optimal strategy may be to run multiple models in parallel for design generation and then screen with RNet and experiments.

### Innovations and limitations

**Six key innovations**

1\. **First systematic demonstration that complex pseudoknots can be designed de novo** — not just isolated molecules, but at scale across 57 targets

2\. **AI matched experienced human designers within one year** — under real experimental evaluation, not just computational benchmarks

3\. **RNet as an 'experiment-driven foundation model' proved critical** — it is neither a traditional energy function nor a 3D predictor, but a model that learned structural formability from massive SHAPE data

4\. **Success does not depend on high-accuracy RNA 3D prediction** — a paradigm-level innovation in the RNA field

5\. **Designed RNAs formed entirely new 3D folds** — not simply mimicking known natural structures

6\. **Non-canonical tertiary interactions spontaneously emerged after design** — demonstrating that correctly designing the secondary structure is sufficient to support the emergence of higher-order folding

**Key limitations**

**Primarily addresses structural design, not functional design**: The paper demonstrates that correct pseudoknots and stable 3D folds can be designed, but has not yet shown that these RNAs can perform complex functions (efficient catalysis, high-affinity binding, precise regulation). The step of getting RNA to 'fold correctly' has been solved, but designing functional RNA machines remains a distance away.

**Limited control over tertiary structure**: The non-canonical interactions observed by cryo-EM were 'discovered' rather than 'programmed.' The current state of the art can achieve stable folding, but cannot yet precisely specify atomic-level interaction networks.

**Some targets still fail**: P16 resisted all methods, possibly due to competing folds or geometric contradictions inherent to the target, or possibly exposing blind spots in current models.

**Heavy dependence on RNet**: Many successes are strongly tied to RNet's filtering and guidance. If targets fall far outside RNet's training distribution, or if future tasks are no longer 'secondary-structure-driven,' it remains to be seen whether generalization performance will hold.

### Questions worth watching

1\. **Can 'structurally correct' advance to 'functionally correct'?** Designing catalytically active ribozymes, high-specificity aptamers, programmable frameshift elements, and regulatory RNAs that work inside cells — this is the true next frontier.

2\. **What has RNet actually learned?** Has it only learned 'local pairing feasibility,' or has it implicitly captured global topological constraints, folding competition, and certain tertiary stabilization rules? Clarifying this would be critical for model improvement.

3\. **Why is P16 undesignable?** This is an extremely valuable 'negative example' — it may reveal the designability boundary of pseudoknots or expose blind spots in current deep learning models.

4\. **Can tertiary interactions be explicitly designed?** Currently they emerge naturally; in the future, could we specify particular base triples, pocket geometries, ligand binding sites, and catalytic center conformations?

5\. **Does this hold up in vivo?** Correct folding in vitro does not guarantee function in cells — ionic environment changes, protein binding, co-transcriptional folding, and degradation all need to be considered.

**In one sentence:** Even though RNA 3D structure prediction is not yet accurate enough, deep learning can already get complex pseudoknot designs right. Once the secondary structure is stably designed, **RNA tends to spontaneously develop correct and ordered 3D folds, including non-canonical tertiary interactions that were never explicitly specified during design**. De novo RNA design need not wait for a fully mature 'RNA AlphaFold' to begin making breakthroughs.

**Paper:** De novo design of RNA pseudoknots with deep learning

**Authors:** Jill Townley, Wipapat Kladwang, David Baker, ... Rhiju Das

**Institutions:** Stanford University / University of Washington / HHMI / University of Cambridge

**DOI:** 10.1126/science.aeg6829

### About the Corresponding Author

**Rhiju Das** is a Professor of Biochemistry at Stanford University School of Medicine and a Howard Hughes Medical Institute (HHMI) Investigator. He graduated from Harvard University with a B.A. in Physics (1998, summa cum laude), then went to the University of Cambridge as a Marshall Scholar to pursue an M.Phil. in Physics (radio astronomy) and an M.Res. in Biological Complexity at University College London. He received his Ph.D. in Physics from Stanford University (2005, advised by Sebastian Doniach and Daniel Herschlag) and completed postdoctoral training in David Baker's laboratory at the University of Washington. He joined the Stanford Biochemistry Department in 2009, received tenure in 2016, and was named an HHMI Investigator in 2021. His laboratory focuses on computational modeling and design of RNA molecules and RNA-protein complexes, developing high-resolution RNA structure prediction algorithms. He also created the Eterna platform — an open science platform that crowdsources RNA design challenges to over 250,000 online players — and co-founded the RNA design company Inceptive in 2021. Major honors include a Gold Medal at the International Physics Olympiad (1995), a Burroughs Wellcome Career Award (2008), and a W.M. Keck Foundation Medical Research Grant (2012). His research spans RNA structure prediction, RNA design, computational biophysics, and citizen science.

## Citation

Townley, J., Kladwang, W., Baker, D., Blair, H. M., Choe, C. A., El Nesr, G., ... & Das, R. (2026). De novo design of RNA pseudoknots with deep learning. Science, 393(6814), 931-937. https://doi.org/10.1126/science.aeg6829
