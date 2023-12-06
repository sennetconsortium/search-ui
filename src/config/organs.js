const organSearchUrl = (organCode) => {
    return `search?size=n_10000_n&filters%5B0%5D%5Bfield%5D=entity_type&filters%5B0%5D%5Bvalues%5D%5B0%5D=Dataset&filters%5B0%5D%5B
            type%5D=any&filters%5B1%5D%5Bfield%5D=origin_sample.organ&filters%5B1%5D%5Bvalues%5D%5B0%5D=${organCode}&filters%5B1%5D%5B
            type%5D=any&sort%5B0%5D%5Bfield%5D=last_modified_timestamp&sort%5B0%5D%5Bdirection%5D=desc`;
};

export const organDetails = {
    AD: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-skin.svg",
        searchUrl: organSearchUrl("AD"),
    },
    BD: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-blood.svg",
        searchUrl: organSearchUrl("BD"),
    },
    BR: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-brain.svg",
        searchUrl: organSearchUrl("BR"),
    },
    BM: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-bone-marrow.svg",
        searchUrl: organSearchUrl("BM"),
    },
    BS: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-breast.svg",
        searchUrl: organSearchUrl("BS"),
    },
    LK: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-kidney-left.svg",
        searchUrl: organSearchUrl("LK"),
    },
    RK: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-kidney-right.svg",
        searchUrl: organSearchUrl("RK"),
    },
    LI: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-large-intestine.svg",
        searchUrl: organSearchUrl("LI"),
    },
    LV: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-liver.svg",
        searchUrl: organSearchUrl("LV"),
    },
    LL: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-lung-left.svg",
        searchUrl: organSearchUrl("LL"),
    },
    RL: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-lung-right.svg",
        searchUrl: organSearchUrl("RL"),
    },
    LN: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-lymph-nodes.svg",
        searchUrl: organSearchUrl("LN"),
    },
    MU: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-skin.svg",
        searchUrl: organSearchUrl("MU"),
    },
    LO: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-ovary-left.svg",
        searchUrl: organSearchUrl("LO"),
    },
    RO: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-ovary-right.svg",
        searchUrl: organSearchUrl("RO"),
    },
    PA: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-pancreas.svg",
        searchUrl: organSearchUrl("PA"),
    },
    PL: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-placenta.svg",
        searchUrl: organSearchUrl("PL"),
    },
    SK: {
        icon: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-skin.svg",
        searchUrl: organSearchUrl("SK"),
    },
};
