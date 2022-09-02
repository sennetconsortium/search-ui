export const SAMPLE_TYPES = [
    {donor: "Donor"},
    {sample: "Sample"},
    {dataset: "Dataset"},
    {uploads: "Data Upload"},
    {organ: "Organ"},
    {
        biopsy: "Biopsy",
        cell_lysate: "Cell lysate",
        ffpe_block: "FFPE block",
        pfa_fixed_frozen_oct_block: "PFA Fixed frozen OCT block",
        fixed_tissue_piece: "Fixed tissue piece",
        flash_frozen_liquid_nitrogen: "Flash frozen, liquid nitrogen",
        formalin_fixed_oct_block: "Formalin fixed OCT block",
        fresh_frozen_tissue: "Fresh frozen tissue",
        fresh_frozen_oct_block: "Fresh frozen oct block",
        fresh_tissue: "Fresh tissue",
        frozen_cell_pellet_buffy_coat: "Frozen cell pellet (Buffy coat)",
        module: "Module",
        pbmc: "PBMC",
        plasma: "Plasma",
        nuclei_rnalater: "Nuclei RNAlater",
        organ_piece: "Organ Piece",
        rnalater_treated_and_stored: "RNAlater treated and stored",
        segment: "Segment",
        serum: "Serum",
        single_cell_cryopreserved: "Single cell cryopreserved",
        tissue_lysate: "Tissue lysate"
    },
    {
        clarity_hydrogel: "CLARITY hydrogel",
        cryosections_curls_from_fresh_frozen_oct:
            "Cryosections/curls from fresh frozen OCT",
        cryosections_curls_rnalater: "Cryosectinos/curls RNAlater",
        ffpe_slide: "FFPE slide",
        fixed_frozen_section_slide: "Fixed Frozen section slide",
        fresh_frozen_section_slide: "Fresh Frozen section slide",
        fresh_frozen_tissue_section: "Fresh Frozen Tissue Section"
    },
    {
        gdna: "gDNA",
        nuclei: "Nuclei",
        protein: "Protein",
        rna_total: "RNA, total",
        ran_poly_a_enriched: "RNA, poly-A enriched",
        sequence_library: "Sequence Library"
    },
    {other: "Other"}
];

// These ones show on the Create new Donor/Sample page
export const TISSUE_TYPES = {
    Donor: [{
        organ: "Organ"
    }],
    Sample: [{
        biopsy: "Biopsy",
        cell_lysate: "Cell lysate",
        ffpe_block: "FFPE block",
        pfa_fixed_frozen_oct_block: "PFA Fixed frozen OCT block",
        fixed_tissue_piece: "Fixed tissue piece",
        flash_frozen_liquid_nitrogen: "Flash frozen, liquid nitrogen",
        formalin_fixed_oct_block: "Formalin fixed OCT block",
        fresh_frozen_tissue: "Fresh frozen tissue",
        fresh_frozen_oct_block: "Fresh frozen oct block",
        fresh_tissue: "Fresh tissue",
        frozen_cell_pellet_buffy_coat: "Frozen cell pellet (Buffy coat)",
        module: "Module",
        pbmc: "PBMC",
        plasma: "Plasma",
        nuclei_rnalater: "Nuclei RNAlater",
        organ_piece: "Organ Piece",
        rnalater_treated_and_stored: "RNAlater treated and stored",
        segment: "Segment",
        serum: "Serum",
        single_cell_cryopreserved: "Single cell cryopreserved",
        tissue_lysate: "Tissue lysate",
    }, {
        clarity_hydrogel: "CLARITY hydrogel",
        cryosections_curls_from_fresh_frozen_oct:
            "Cryosections/curls from fresh frozen OCT",
        cryosections_curls_rnalater: "Cryosectinos/curls RNAlater",
        ffpe_slide: "FFPE slide",
        fixed_frozen_section_slide: "Fixed Frozen section slide",
        fresh_frozen_section_slide: "Fresh Frozen section slide",
        fresh_frozen_tissue_section: "Fresh Frozen Tissue Section"
    }, {
        gdna: "gDNA",
        nuclei: "Nuclei",
        protein: "Protein",
        rna_total: "RNA, total",
        ran_poly_a_enriched: "RNA, poly-A enriched",
        sequence_library: "Sequence Library"
    }, {
        other: "Other"
    }]
};

export const ORGAN_TYPES = {
    AO: "Aorta",
    BL: "Bladder",
    BD: "Blood",
    BM: "Bone Marrow",
    BR: "Brain",
    LB: "Bronchus (Left)",
    RB: "Bronchus (Right)",
    LE: "Eye (Left)",
    RE: "Eye (Right)",
    LF: "Fallopian Tube (Left)",
    RF: "Fallopian Tube (Right)",
    HT: "Heart",
    LK: "Kidney (Left)",
    RK: "Kidney (Right)",
    LI: "Large Intestine",
    LV: "Liver",
    LL: "Lung (Left)",
    RL: "Lung (Right)",
    LY: "Lymph Node",
    LO: "Ovary (Left)",
    RO: "Ovary (Right)",
    PA: "Pancreas",
    PL: "Placenta",
    SI: "Small Intestine",
    SK: "Skin",
    SP: "Spleen",
    ST: "Sternum",
    TH: "Thymus",
    TR: "Trachea",
    UR: "Ureter",
    UT: "Uterus",
    OT: "Other"
};

export const DATA_TYPES = {
    "AF": "Autofluorescence Microscopy",
    "ATACseq-bulk": "Bulk ATAC-seq",
    "cell-dive": "Cell DIVE",
    "CODEX": "CODEX",
    "CODEX2": "CODEX (CODEX2 assay type)",
    "DART-FISH": "DART-FISH",
    "IMC2D": "Imaging Mass Cytometry (2D)",
    "IMC3D": "Imaging Mass Cytometry (3D)",
    "lc-ms_label-free": "Label-free LC-MS",
    "lc-ms_labeled": "Labeled LC-MS",
    "lc-ms-ms_label-free": "Label-free LC-MS/MS",
    "lc-ms-ms_labeled": "Labeled LC-MS/MS",
    "LC-MS-untargeted": "Untargeted LC-MS",
    "Lightsheet": "Lightsheet Microscopy",
    "MALDI-IMS": "MALDI IMS",
    "MIBI": "Multiplex Ion Beam Imaging",
    "NanoDESI": "NanoDESI",
    "NanoPOTS": "NanoPOTS",
    "MxIF": "Multiplexed IF Microscopy",
    "PAS": "PAS Stained Microscopy",
    "bulk-RNA": "Bulk RNA-seq",
    "SNARE-ATACseq2": "snATACseq (SNARE-seq2)",
    "SNARE-RNAseq2": "snRNAseq (SNARE-seq2)",
    "scRNAseq-10xGenomics-v2": "scRNA-seq (10x Genomics v2)",
    "scRNAseq-10xGenomics-v3": "scRNA-seq (10x Genomics v3)",
    "sciATACseq": "sciATAC-seq",
    "sciRNAseq": "sciRNA-seq",
    "seqFish": "seqFISH",
    "seqFish_pyramid": "seqFISH [Image Pyramid]",
    "snATACseq": "snATAC-seq",
    "snRNAseq-10xGenomics-v2": "snRNA-seq (10x Genomics v2)",
    "snRNAseq-10xGenomics-v3": "snRNA-seq (10x Genomics v3)",
    "Slide-seq": "Slide-seq",
    "Targeted-Shotgun-LC-MS": "Targeted Shotgun / Flow-injection LC-MS",
    "TMT-LC-MS": "TMT LC-MS",
    "WGS": "Whole Genome Sequencing",
    "LC-MS": "LC-MS",
    "MS": "MS",
    "LC-MS_bottom_up": "LC-MS Bottom Up",
    "MS_bottom_up": "MS Bottom Up",
    "LC-MS_top_down": "LC-MS Top Down",
    "MS_top_down": "MS Top Down",
    "other": "Other"
}

export const RUI_ORGAN_TYPES = ["SK", "LI", "HT", "LK", "RK", "SP", "BR", "LL", "RL", "LY", "TH"];


export const SOURCE_TYPES = {
    "Human":"Human",
    "Human organoid":"Human organoid",
    "Mouse":"Mouse",
    "Mouse organoid" :"Mouse organoid" ,
    "Unknown":"Unknown",
};


