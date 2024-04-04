const organSearchUrl = (organCode) => {
    return `search?size=n_10000_n&filters%5B0%5D%5Bfield%5D=entity_type&filters%5B0%5D%5Bvalues%5D%5B0%5D=Dataset&filters%5B0%5D%5B
            type%5D=any&filters%5B1%5D%5Bfield%5D=origin_sample.organ&filters%5B1%5D%5Bvalues%5D%5B0%5D=${organCode}&filters%5B1%5D%5B
            type%5D=any&sort%5B0%5D%5Bfield%5D=last_modified_timestamp&sort%5B0%5D%5Bdirection%5D=desc`;
};

export const organDetails = {
    AD: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-skin.svg",
        ruiCode: "AD",
        searchUrl: organSearchUrl("AD"),
        urlParamName: "adipose-tissue",
    },
    BD: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-blood.svg",
        ruiCode: "BD",
        searchUrl: organSearchUrl("BD"),
        urlParamName: "blood",
    },
    BR: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-brain.svg",
        ruiCode: "BR",
        searchUrl: organSearchUrl("BR"),
        urlParamName: "brain",
    },
    BM: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-bone-marrow.svg",
        ruiCode: "BM",
        searchUrl: organSearchUrl("BM"),
        urlParamName: "bone-marrow",
    },
    BS: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-breast.svg",
        ruiCode: "BS",
        searchUrl: organSearchUrl("BS"),
        urlParamName: "breast",
    },
    LK: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-kidney-left.svg",
        ruiCode: "LK",
        searchUrl: organSearchUrl("LK"),
        urlParamName: "left-kidney",
    },
    RK: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-kidney-right.svg",
        ruiCode: "RK",
        searchUrl: organSearchUrl("RK"),
        urlParamName: "right-kidney",
    },
    LI: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-large-intestine.svg",
        ruiCode: "LI",
        searchUrl: organSearchUrl("LI"),
        urlParamName: "large-intestine",
    },
    LV: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-liver.svg",
        ruiCode: "LV",
        searchUrl: organSearchUrl("LV"),
        urlParamName: "liver",
    },
    LL: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-lung-left.svg",
        ruiCode: "LL",
        searchUrl: organSearchUrl("LL"),
        urlParamName: "left-lung",
    },
    RL: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-lung-right.svg",
        ruiCode: "RL",
        searchUrl: organSearchUrl("RL"),
        urlParamName: "right-lung",
    },
    LY: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-lymph-nodes.svg",
        ruiCode: "LY",
        searchUrl: organSearchUrl("LY"),
        urlParamName: "lymph-nodes",
    },
    MU: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-trachea.svg",
        ruiCode: "MU",
        searchUrl: organSearchUrl("MU"),
        urlParamName: "muscle",
    },
    LO: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-ovary-left.svg",
        ruiCode: "LO",
        searchUrl: organSearchUrl("LO"),
        urlParamName: "left-ovary",
    },
    RO: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-ovary-right.svg",
        ruiCode: "RO",
        searchUrl: organSearchUrl("RO"),
        urlParamName: "right-ovary",
    },
    PA: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-pancreas.svg",
        ruiCode: "PA",
        searchUrl: organSearchUrl("PA"),
        urlParamName: "pancreas",
    },
    PL: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-placenta.svg",
        ruiCode: "PL",
        searchUrl: organSearchUrl("PL"),
        urlParamName: "placenta",
    },
    SK: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-skin.svg",
        ruiCode: "SK",
        searchUrl: organSearchUrl("SK"),
        urlParamName: "skin",
    },
    BX: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-bone-marrow.svg",
        ruiCode: "BX",
        searchUrl: organSearchUrl("BX"),
        urlParamName: "bone",
    },
    TH: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-thymus.svg",
        ruiCode: "TH",
        searchUrl: organSearchUrl("TH"),
        urlParamName: "thymus",
    },
    HT: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-heart.svg",
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
