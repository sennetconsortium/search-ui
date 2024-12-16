/**
 * Retrieves an organ object by its rui code.
 *
 * @param {string} code - The rui code of the organ.
 * @returns {Organ|undefined} The organ object, undefined if not found.
 */
export function getOrganByCode(code) {
    return Object.values(organs).find((organ) => organ.codes.includes(code))
}

/**
 * Retrieves an organ object by its url path parameter name.
 *
 * @param {string} path - The url path parameter name for the organ's page.
 * @returns {Organ|undefined} The organ object, undefined if not found.
 */
export function getOrganByPath(path) {
    return Object.values(organs).find((organ) => organ.path === path)
}

const BASE_ICON_URL = 'https://cdn.humanatlas.io/hra-design-system/icons'

export const organIcons = {
    AD:`${BASE_ICON_URL}/organs/organ-icon-skin.svg`,
    BD: `${BASE_ICON_URL}/organs/organ-icon-blood.svg`,
    BM: `${BASE_ICON_URL}/organs/organ-icon-bone-marrow.svg`,
    BR: `${BASE_ICON_URL}/organs/organ-icon-brain.svg`,
    BS: `${BASE_ICON_URL}/organs/organ-icon-breast.svg`,
    LK: `${BASE_ICON_URL}/organs/organ-icon-kidney-left.svg`,
    RK: `${BASE_ICON_URL}/organs/organ-icon-kidney-right.svg`,
    LI: `${BASE_ICON_URL}/organs/organ-icon-large-intestine.svg`,
    LV: `${BASE_ICON_URL}/organs/organ-icon-liver.svg`,
    LL: `${BASE_ICON_URL}/organs/organ-icon-lung-left.svg`,
    RL: `${BASE_ICON_URL}/organs/organ-icon-lung-right.svg`,
    LY: `${BASE_ICON_URL}/organs/organ-icon-lymph-nodes.svg`,
    ML: `${BASE_ICON_URL}/organs/organ-icon-breast.svg`,
    MR: `${BASE_ICON_URL}/organs/organ-icon-breast.svg`,
    MU: `${BASE_ICON_URL}/organs/organ-icon-trachea.svg`,
    LO: `${BASE_ICON_URL}/organs/organ-icon-ovary-left.svg`,
    RO: `${BASE_ICON_URL}/organs/organ-icon-ovary-right.svg`,
    PA: `${BASE_ICON_URL}/organs/organ-icon-pancreas.svg`,
    PL: `${BASE_ICON_URL}/organs/organ-icon-placenta.svg`,
    SC: `${BASE_ICON_URL}/organs/organ-icon-spinal-cord.svg`,
    SK: `${BASE_ICON_URL}/organs/organ-icon-skin.svg`,
    BX: `${BASE_ICON_URL}/organs/organ-icon-bone-marrow.svg`,
    TH: `${BASE_ICON_URL}/organs/organ-icon-thymus.svg`,
    HT: `${BASE_ICON_URL}/organs/organ-icon-heart.svg`,
    LT: `${BASE_ICON_URL}/organs/organ-icon-palatine-tonsil.svg`,
    RT: `${BASE_ICON_URL}/organs/organ-icon-palatine-tonsil.svg`,
    OT: "https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-united.svg",
}

/**
 * An organ supported on the organs page.
 *
 * @typedef {Object} Organ
 * @property {string[]} codes - An array of rui codes for  the organ.
 * @property {boolean} hraSupported - Indicates if the organ is supported by HRA.
 * @property {string} icon - The URL of the icon for the organ.
 * @property {string} label - The label dor the organ.
 * @property {string} path - The url path parameter name for the organ's page.
 * @property {string} subLabel - The sub-label for the organ, uberon/fma code.
 * @property {string} url - The uberon/fma URL used in the HRA.
 */

/**
 * The organs supported on the organs page.
 *
 * @type {Organ[]}
 */
export const organs = [
    {
        codes: ['AD'],
        hraSupported: false,
        icon: organIcons['AD'],
        label: 'Adipose Tissue',
        path: 'adipose-tissue',
        subLabel: 'UBERON:0001013',
        url: 'http://purl.obolibrary.org/obo/UBERON_0001013'
    },
    {
        codes: ['BD'],
        hraSupported: false,
        icon: organIcons['BD'],
        label: 'Blood',
        path: 'blood',
        subLabel: 'UBERON:0000178',
        url: 'http://purl.obolibrary.org/obo/UBERON_0000178'
    },
    {
        codes: ['BX'],
        hraSupported: false,
        icon: organIcons['BX'],
        label: 'Bone',
        path: 'bone',
        subLabel: 'UBERON:0001474',
        url: 'http://purl.obolibrary.org/obo/UBERON_0001474'
    },
    {
        codes: ['BM'],
        hraSupported: false,
        icon: organIcons['BM'],
        label: 'Bone Marrow',
        path: 'bone-marrow',
        subLabel: 'UBERON:0002371',
        url: 'http://purl.obolibrary.org/obo/UBERON_0002371'
    },
    {
        codes: ['BR'],
        hraSupported: true,
        icon: organIcons['BR'],
        label: 'Brain',
        path: 'brain',
        subLabel: 'UBERON:0000955',
        url: 'http://purl.obolibrary.org/obo/UBERON_0000955'
    },
    {
        codes: ['HT'],
        hraSupported: true,
        icon: organIcons['HT'],
        label: 'Heart',
        path: 'heart',
        subLabel: 'UBERON:0000948',
        url: 'http://purl.obolibrary.org/obo/UBERON_0000948'
    },
    {
        codes: ['LK', 'RK'],
        hraSupported: true,
        icon: `${BASE_ICON_URL}/organs/organ-icon-kidneys.svg`,
        label: 'Kidney',
        path: 'kidney',
        subLabel: 'UBERON:0002113',
        url: 'http://purl.obolibrary.org/obo/UBERON_0002113'
    },
    {
        codes: ['LI'],
        hraSupported: true,
        icon: organIcons['LI'],
        label: 'Large Intestine',
        path: 'large-intestine',
        subLabel: 'UBERON:0000059',
        url: 'http://purl.obolibrary.org/obo/UBERON_0000059'
    },
    {
        codes: ['LV'],
        hraSupported: true,
        icon: organIcons['LV'],
        label: 'Liver',
        path: 'liver',
        subLabel: 'UBERON:0002107',
        url: 'http://purl.obolibrary.org/obo/UBERON_0002107'
    },
    {
        codes: ['LL', 'RL'],
        hraSupported: true,
        icon: `${BASE_ICON_URL}/organs/organ-icon-lungs.svg`,
        label: 'Lung',
        path: 'lung',
        subLabel: 'UBERON:0002048',
        url: 'http://purl.obolibrary.org/obo/UBERON_0002048'
    },
    {
        codes: ['LY'],
        hraSupported: true,
        icon: organIcons['LY'],
        label: 'Lymph Node',
        path: 'lymph-node',
        subLabel: 'UBERON:0000029',
        url: 'http://purl.obolibrary.org/obo/UBERON_0000029'
    },
    {
        codes: ['ML', 'MR'],
        hraSupported: true,
        icon: `${BASE_ICON_URL}/organs/organ-icon-breast.svg`,
        label: 'Mammary Gland',
        path: 'mammary-gland',
        subLabel: 'FMA:57991',
        url: 'http://purl.org/sig/ont/fma/fma57991'
    },
    {
        codes: ['MU'],
        hraSupported: false,
        icon: organIcons['MU'],
        label: 'Muscle',
        path: 'muscle',
        subLabel: 'UBERON:0005090',
        url: 'http://purl.obolibrary.org/obo/UBERON_0005090'
    },
    {
        codes: ['LO', 'RO'],
        hraSupported: true,
        icon: `${BASE_ICON_URL}/organs/organ-icon-ovaries.svg`,
        label: 'Ovary',
        path: 'ovary',
        subLabel: 'UBERON:0000992',
        url: 'http://purl.obolibrary.org/obo/UBERON_0000992'
    },
    {
        codes: ['PA'],
        hraSupported: true,
        icon: organIcons['PA'],
        label: 'Pancreas',
        path: 'pancreas',
        subLabel: 'UBERON:0001264',
        url: 'http://purl.obolibrary.org/obo/UBERON_0001264'
    },
    {
        codes: ['PL'],
        hraSupported: true,
        icon: organIcons['PL'],
        label: 'Placenta',
        path: 'placenta',
        subLabel: 'UBERON:0001987',
        url: 'http://purl.obolibrary.org/obo/UBERON_0001987'
    },
    {
        codes: ['SK'],
        hraSupported: true,
        icon: organIcons['SK'],
        label: 'Skin',
        path: 'skin',
        subLabel: 'UBERON:0002097',
        url: 'http://purl.obolibrary.org/obo/UBERON_0002097'
    },
    {
        codes: ['SC'],
        hraSupported: true,
        icon: organIcons['SC'],
        label: 'Spinal Cord',
        path: 'spinal-cord',
        subLabel: 'UBERON:0002240',
        url: 'http://purl.obolibrary.org/obo/UBERON_0002240'
    },
    {
        codes: ['TH'],
        hraSupported: true,
        icon: organIcons['TH'],
        label: 'Thymus',
        path: 'thymus',
        subLabel: 'UBERON:0002370',
        url: 'http://purl.obolibrary.org/obo/UBERON_0002370'
    },
    {
        codes: ['LT', 'RT'],
        hraSupported: true,
        icon: `${BASE_ICON_URL}/organs/organ-icon-palatine-tonsil.svg`,
        label: 'Tonsil',
        path: 'tonsil',
        subLabel: 'FMA:54973',
        url: 'http://purl.org/sig/ont/fma/fma54973'
    }
]
