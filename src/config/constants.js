export const SOURCE_TYPE = {
    "Human": "Human",
    "Human organoid": "Human organoid",
    "Mouse": "Mouse",
    "Mouse organoid": "Mouse organoid",
    "Unknown": "Unknown"
}

export const SAMPLE_CATEGORY = {
    "block": "Block",
    "section": "Section",
    "suspension": "Suspension",
    "bodily fluid": "Bodily Fluid",
    "organ": "Organ",
    "organ piece": "Organ Piece"
}

export const ORGAN_TYPES = {
    "AO": "Adipose",
    "BD": "Blood",
    "BR": "Brain",
    "BS": "Breast",
    "LI": "Large Intestine",
    "LV": "Liver",
    "LL": "Left Lung",
    "RL": "Right Lung",
    "LK": "Left Kidney",
    "RK": "Right Kidney",
    "MU": "Muscle",
    "LO": "Left Ovary",
    "RO": "Right Ovary",
    "SK": "Skin",
    "OT": "Other"
};

export const DATA_TYPES = {
    "Bulk RNA-seq": "Bulk RNA-seq",
    "CITE-seq": "CITE-seq",
    "CODEX": "CODEX",
    "CosMX - RNA": "CosMX - RNA",
    "DBiT-seq": "DBiT-seq",
    "FACS - Fluorescence-activated Cell Sorting": "FACS - Fluorescence-activated Cell Sorting",
    "GeoMX - RNA": "GeoMX - RNA",
    "LC-MS": "LC-MS",
    "MIBI": "MIBI",
    "Mint-ChIP": "Mint-ChIP",
    "Multiplexed": "Multiplexed",
    "SASP": "SASP",
    "scRNA-seq": "scRNA-seq",
    "snATAC-seq": "snATAC-seq",
    "snRNA-seq": "snRNA-seq",
    "Stained Slides": "Stained Slides",
    "Visium": "Visium",
    "Other": "Other"
};

export const APP_ROUTES = {
    "home": "/",
    "search": "/search",
    "login": "/login",
    "logout": "/logout"
};

export const ENTITIES = ['source', 'sample', 'dataset']