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

export const SAMPLE_CATEGORY = {
   "Block":"Block",
   "Section":"Section",
   "Suspension":"Suspension",
   "Bodily Fluid":"Bodily Fluid",
   "Organ":"Organ",
   "Organ Piece":"Organ Piece",
   "Other":"Other"
}

export const ORGAN_TYPES = {
    "adipose_tissue": "Adipose",
    "blood": "Blood",
    "brain": "Brain",
    "breast": "Breast",
    "large_intestine": "Large Intestine",
    "liver": "Liver",
    "lung": "Lung",
    "kidney": "Kidney",
    "muscle_organ":"Muscle",
    "ovary": "Ovary",
    "skin_of_body": "Skin",
    "other": "Other"
};

export const DATA_TYPES = {
   "Bulk RNA-seq":"Bulk RNA-seq",
   "CITE-seq":"CITE-seq",
   "CODEX":"CODEX",
   "CosMX - RNA":"CosMX - RNA",
   "DBiT-seq":"DBiT-seq",
   "FACS - Fluorescence-activated Cell Sorting":"FACS - Fluorescence-activated Cell Sorting",
   "GeoMX - RNA":"GeoMX - RNA",
   "LC-MS":"LC-MS",
   "MIBI":"MIBI",
   "Mint-ChIP":"Mint-ChIP",
   "Multiplexed":"Multiplexed",
   "SASP":"SASP",
   "scRNA-seq" : "scRNA-seq", 
   "snATAC-seq":"snATAC-seq" ,
   "snRNA-seq": "snRNA-seq",
   "Stained Slides" : "Stained Slides",
   "Visium" :"Visium"
};

export const RUI_ORGAN_TYPES = ["SK", "LI", "HT", "LK", "RK", "SP", "BR", "LL", "RL", "LY", "TH"];
