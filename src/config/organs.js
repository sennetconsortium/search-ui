const organSearchUrl = (organCode) => {
    return `search?size=n_10000_n&filters%5B0%5D%5Bfield%5D=entity_type&filters%5B0%5D%5Bvalues%5D%5B0%5D=Dataset&filters%5B0%5D%5B
            type%5D=any&filters%5B1%5D%5Bfield%5D=origin_sample.organ&filters%5B1%5D%5Bvalues%5D%5B0%5D=${organCode}&filters%5B1%5D%5B
            type%5D=any&sort%5B0%5D%5Bfield%5D=last_modified_timestamp&sort%5B0%5D%5Bdirection%5D=desc`;
};

const BASE_ICON_URL = "https://cdn.humanatlas.io/hra-design-system/icons"

export const organDetails = {
    AD: {
        icon: `${BASE_ICON_URL}/organs/organ-icon-skin.svg`,
        ruiCode: "AD",
        searchUrl: organSearchUrl("AD"),
        urlParamName: "adipose-tissue",
    },
    BD: {
        icon: `${BASE_ICON_URL}/organs/organ-icon-blood.svg`,
        ruiCode: "BD",
        searchUrl: organSearchUrl("BD"),
        urlParamName: "blood",
    },
    BR: {
        icon: `${BASE_ICON_URL}/organs/organ-icon-brain.svg`,
        ruiCode: "BR",
        searchUrl: organSearchUrl("BR"),
        urlParamName: "brain",
    },
    BM: {
        icon: `${BASE_ICON_URL}/organs/organ-icon-bone-marrow.svg`,
        ruiCode: "BM",
        searchUrl: organSearchUrl("BM"),
        urlParamName: "bone-marrow",
    },
    BX: {
        icon: `${BASE_ICON_URL}/organs/organ-icon-bone-marrow.svg`,
        ruiCode: "BX",
        searchUrl: organSearchUrl("BX"),
        urlParamName: "bone",
    },
    BS: {
        icon: `${BASE_ICON_URL}/organs/organ-icon-breast.svg`,
        ruiCode: "BS",
        searchUrl: organSearchUrl("BS"),
        urlParamName: "breast",
    },
    LK: {
        icon: `${BASE_ICON_URL}/organs/organ-icon-kidney-left.svg`,
        ruiCode: "LK",
        searchUrl: organSearchUrl("LK"),
        urlParamName: "left-kidney",
    },
    RK: {
        icon: `${BASE_ICON_URL}/organs/organ-icon-kidney-right.svg`,
        ruiCode: "RK",
        searchUrl: organSearchUrl("RK"),
        urlParamName: "right-kidney",
    },
    LI: {
        icon: `${BASE_ICON_URL}/organs/organ-icon-large-intestine.svg`,
        ruiCode: "LI",
        searchUrl: organSearchUrl("LI"),
        urlParamName: "large-intestine",
    },
    LV: {
        icon: `${BASE_ICON_URL}/organs/organ-icon-liver.svg`,
        ruiCode: "LV",
        searchUrl: organSearchUrl("LV"),
        urlParamName: "liver",
    },
    LL: {
        icon: `${BASE_ICON_URL}/organs/organ-icon-lung-left.svg`,
        ruiCode: "LL",
        searchUrl: organSearchUrl("LL"),
        urlParamName: "left-lung",
    },
    RL: {
        icon: `${BASE_ICON_URL}/organs/organ-icon-lung-right.svg`,
        ruiCode: "RL",
        searchUrl: organSearchUrl("RL"),
        urlParamName: "right-lung",
    },
    LY: {
        icon: `${BASE_ICON_URL}/organs/organ-icon-lymph-nodes.svg`,
        ruiCode: "LY",
        searchUrl: organSearchUrl("LY"),
        urlParamName: "lymph-nodes",
    },
    ML: {
        icon: `${BASE_ICON_URL}/organs/organ-icon-breast.svg`,
        ruiCode: "ML",
        searchUrl: organSearchUrl("ML"),
        uberonUrl: "http://purl.org/sig/ont/fma/fma57991",
        urlParamName: "left-mammary-gland",
    },
    MR: {
        icon: `${BASE_ICON_URL}/organs/organ-icon-breast.svg`,
        ruiCode: "MR",
        searchUrl: organSearchUrl("MR"),
        uberonUrl: "http://purl.org/sig/ont/fma/fma57987",
        urlParamName: "right-mammary-gland",
    },
    MU: {
        icon: `${BASE_ICON_URL}/organs/organ-icon-trachea.svg`,
        ruiCode: "MU",
        searchUrl: organSearchUrl("MU"),
        urlParamName: "muscle",
    },
    LO: {
        icon: `${BASE_ICON_URL}/organs/organ-icon-ovary-left.svg`,
        ruiCode: "LO",
        searchUrl: organSearchUrl("LO"),
        urlParamName: "left-ovary",
    },
    RO: {
        icon: `${BASE_ICON_URL}/organs/organ-icon-ovary-right.svg`,
        ruiCode: "RO",
        searchUrl: organSearchUrl("RO"),
        urlParamName: "right-ovary",
    },
    PA: {
        icon: `${BASE_ICON_URL}/organs/organ-icon-pancreas.svg`,
        ruiCode: "PA",
        searchUrl: organSearchUrl("PA"),
        urlParamName: "pancreas",
    },
    PL: {
        icon: `${BASE_ICON_URL}/organs/organ-icon-placenta.svg`,
        ruiCode: "PL",
        searchUrl: organSearchUrl("PL"),
        urlParamName: "placenta",
    },
    SC: {
        icon: `${BASE_ICON_URL}/organs/organ-icon-spinal-cord.svg`,
        ruiCode: "SC",
        searchUrl: organSearchUrl("SC"),
        urlParamName: "spinal-cord",
    },
    SK: {
        icon: `${BASE_ICON_URL}/organs/organ-icon-skin.svg`,
        ruiCode: "SK",
        searchUrl: organSearchUrl("SK"),
        urlParamName: "skin",
    },
    TH: {
        icon: `${BASE_ICON_URL}/organs/organ-icon-thymus.svg`,
        ruiCode: "TH",
        searchUrl: organSearchUrl("TH"),
        urlParamName: "thymus",
    },
    HT: {
        icon: `${BASE_ICON_URL}/organs/organ-icon-heart.svg`,
        ruiCode: "HT",
        searchUrl: organSearchUrl("HT"),
        urlParamName: "heart",
    },
    OT: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-united.svg",
        ruiCode: "OT",
        searchUrl: organSearchUrl("OT"),
        urlParamName: "other",
    },
};
