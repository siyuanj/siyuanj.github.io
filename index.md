---
layout: homepage
uses_publications: true
uses_photos: true
---

## <span>About Me</span>

Hi, my name is Siyuan Jiang. I am an undergraduate student at Tsinghua University, Tanwei College, majoring in Chemical Biology for Pharmaceutical Science.

My research journey began with synthetic biology on the [Tsinghua-M iGEM 2024 team](https://2024.igem.wiki/tsinghua-m/), where we built RNAssay, an ADAR-based RNA sensing system in yeast, and won a Gold Medal. After a brief stay in [Prof. Xuebin Liao's lab](https://www.sps.tsinghua.edu.cn/info/1011/1423.htm), I joined [Prof. Yigong Shi's lab](https://ygshi.org/) at Tsinghua University in July 2025, where I study the evolution of the gamma-secretase complex. In summer 2026, I visited [Prof. Le Cong's lab](https://conglab.com/) at Stanford University, and in September 2026 I visited [Prof. Xuefeng Liu's lab](https://xuefeng11.github.io/) at the University of Florida.

My research interests center on computational protein engineering, especially model-driven protein design, virtual screening, evolutionary analysis, and functional redesign.

## <span>Education</span>

### Tsinghua University, Tanwei College
*B.S. in Chemical Biology for Pharmaceutical Science, 2023 - 2027 (expected)*
{: .experience-meta}

- GPA: **3.83/4.00**
- Selected coursework: **Chemical Bioinformatics and Artificial Intelligence (A+)**, **Drug Design (A+)**, **Gene Editing (A+)**, Bioinformatics (A, Excellent Project), Medicinal Chemistry (A), AI in Healthcare (A), Chemical Biology (A-)

## <span>Research Interests</span>

My primary research interests include:

- **Protein Design Models:** Developing generative and predictive models for protein sequence, structure, and function by integrating structural priors, evolutionary information, and experimental feedback.
- **Virtual Screening:** Building efficient screening pipelines for protein and peptide candidates to reduce computational bottlenecks before high-precision structural validation.
- **Functional Engineering:** Using evolutionary and functional analyses to guide rational modification of enzymes, binders, and other engineered proteins.

## <span>Research Experience</span>

### Structure-Guided Aptamer Design
*School of Medicine, Stanford University | Advisor: [Prof. Le Cong](https://conglab.com/) | Jul 2026 - Present*
{: .experience-meta}

- Developed workflows for RNA/DNA aptamer design, integrating protein–nucleic acid complex prediction, backbone-conditioned inverse folding, and structure-based candidate filtering.
- Benchmarked **AlphaFold 3**, **Boltz-2**, **Protenix**, and **OpenFold3**, evaluating nucleic acid folding, protein-relative binding poses, and interface quality to assess the reliability of predicted training structures.
- Evaluated **NALite** inverse-folding models with predicted and generated structural data under matched training budgets, comparing RNA/DNA sequence recovery and data-source effects.

### EasyDesign: Agent-Assisted Protein Design
*School of Life Sciences, THU | Advisor: Assoc. Researcher Yafei Yuan | Jun 2026 - Present*
{: .experience-meta}

- Contributed across multiple stages of EasyDesign's agent-assisted protein and binder design workflow.
- Primarily responsible for optimizing structure-prediction models and inference workflows; configured an inference backend using AlphaFold 3 code with converted OpenFold3 weights and packaged reproducible GPU environments for deployment on laboratory servers.

### High-Throughput Screening of Functional Food-Derived Peptides
*School of Life Sciences, THU | Advisor: Assoc. Researcher Yafei Yuan | Oct 2025 - Oct 2026*
{: .experience-meta}

- Developed a multi-stage screening pipeline for bioactive food-derived peptides targeting specific proteins, addressing the computational bottleneck of direct high-precision docking.
- Constructed and trained a lightweight pre-screening model to filter massive peptide libraries and enrich candidates for downstream analysis.
- Integrated **AlphaFold 3** for high-precision structural validation of top candidates and finalized the study with wet-lab experimental assays to verify binding affinity.

### Spatiotemporal Evolution of the Gamma-Secretase Complex
*School of Life Sciences, THU | Advisor: [Prof. Yigong Shi](https://ygshi.org/) | Jul 2025 - Present*
{: .experience-meta}

- Constructed eukaryotic phylogenetic trees for the gamma-secretase complex and traced the PS1 subunit from prokaryotic homologs to clarify its deep evolutionary origin.
- Batch-predicted approximately 1,500 structures with **AlphaFold 3** and analyzed the stepwise assembly order of gamma-secretase subunits during evolution.
- Applied statistical methods and deep learning tools to identify mechanistically important residues in gamma-secretase and explore their potential association with Alzheimer's disease.

## <span>Publications</span>

{% include publications.md %}

## <span>Selected Projects</span>

### Protein-Peptide Interaction Prediction via Generative Docking & GNNs
- Developed a generative-discriminative framework coupling diffusion-based docking (**RAPiDock**) with a Transformer-GNN scorer (**ITN**).
- Implemented multi-instance learning on 3D bipartite graphs to enable structure-aware, interpretable binding prediction.
- Outperformed sequence-based baselines in AUC and enrichment on pMHC I and SH3-peptide systems.

## <span>Honors and Awards</span>

- **WeiGuang Program, Individual Excellence Award**, Tsinghua University (Jun 2025)
- **Gold Award for the Practical Detachment**, Tanwei College (Jan 2025)
- **Comprehensive Excellence Award**, Tsinghua University Scholarship, Top 20% (Nov 2024)
- **Gold Medal**, International Genetically Engineered Machine Competition (iGEM), team [Tsinghua-M · RNAssay](https://2024.igem.wiki/tsinghua-m/) (Oct 2024)

## <span>Skills</span>

- **Programming:** Python, C++, R, Java, LaTeX
- **Frameworks:** PyTorch
- **Languages:** English (TOEFL 94)

## <span>Hobbies</span>

Beyond research, I maintain an active lifestyle and diverse interests:
- **Sports:** I am a member of the Tanwei College **Badminton Team** and the **Tsinghua University Diving Association**. I also enjoy running and swimming.
- **Arts & Culture:** I love Rock Music, J-Pop, and Sci-Fi films (e.g., *The Matrix*, *Star Wars*).

{% include recent-photos.html %}

{% include visitor-map.html %}
