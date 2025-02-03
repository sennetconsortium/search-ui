import { getAuth, getRootURL } from "@/config/config";
import { APP_ROUTES } from "@/config/constants";
import log from "loglevel";

export function getHeaders() {
    const myHeaders = new Headers();
    if (getAuth() !== undefined) {
        myHeaders.append("Authorization", "Bearer " + getAuth());
    }
    myHeaders.append("Content-Type", "application/json");
    return myHeaders;
}

export function getHeadersWithoutContent() {
    return {
        "Content-Type": "Application/json",
        "Authorization": "Bearer " + getAuth()
    }
}

export function getRequestHeaders() {
    const myHeaders = getHeaders();
    return {
        method: 'GET',
        headers: myHeaders
    };
}

export function getIdRegEx() {
    return new RegExp(/SNT\d{3}\.[A-Za-z]{4}\.\d{3}/, 'ig')
}

export async function fetchEntity(ancestorId, paramKey = 'uuid') {
    const response = await fetch(`/api/find?${paramKey}=` + ancestorId, getRequestHeaders());
    // convert the data to json
    const entity = await response.json();
    if (entity.hasOwnProperty("error")) {
        log.error(entity["error"])
        return entity;
    } else {
        return entity;
    }
}

export function getProtocolId(protocolUrl) {
    // The ID is everything after "doi.org/"
    const regex = new RegExp("(?<=doi.org/).*")
    return regex.exec(protocolUrl)[0]
}

export async function fetchDataCite(protocolUrl) {
    if (!protocolUrl) return null
    let headers = new Headers()
    headers.append("Accept", "text/x-bibliography; style=american-medical-association")
    let requestOptions = {
        method: 'GET',
        headers: headers
    }

    try {
        const response = await fetch(protocolUrl, requestOptions)
        if (!response.ok) {
            return null
        }

        return response.text()
    } catch (e) {
        log.error(e)
        return null
    }
}

export async function fetchProtocols(protocolUrl) {
    if (!protocolUrl) return null

    const response = await fetch("/api/protocol?uri=" + encodeURIComponent(protocolUrl));

    if (!response.ok) {
        return null
    }
    return await response.json();
}

export function createDownloadUrl(fileStr, fileType) {
    return window.URL.createObjectURL(new Blob([fileStr], {type: fileType}));
}

export function tableDataToTSV(tableData) {
    let newObject = Object.entries(tableData)
        .map((entry) => ({
                key: entry[0],
                value: Array.isArray(entry[1]) ? entry[1].join(', ') : entry[1],
            })
        );

    return [["Key", "Value"],
        ...newObject.map(item => [
            item.key,
            item.value
        ])
    ].map(e => e.join("\t"))
        .join("\n")
}

export function displayBodyHeader(header) {
    if (header !== undefined)
        return (header.charAt(0).toUpperCase() + header.slice(1)).replaceAll('_', ' ');
    else
        return ""
}


export function getUBKGFullName(term) {
    if (!window.UBKG_CACHE) return term
    if (term in window.UBKG_CACHE.organTypes) {
        return window.UBKG_CACHE.organTypes[term]
    } else if (term in window.UBKG_CACHE.datasetTypes) {
        return window.UBKG_CACHE.datasetTypes[term]
    } else {
        return getNormalizedName(term)
    }
}

const normalizedNames = {
    true: "True",
    false: "False",
    m: "Male",
    f: "Female",
    imaging: "Imaging",
    sequence: "Sequence",
    protein: "Protein",
    "ambient temperature": "Ambient Temperature",
    "carbon dioxide asphixiation": "Carbon Dioxide Asphixiation",
    "frozen in liquid nitrogen": "Frozen in Liquid Nitrogen",
}

export const getDatasetTypeDisplay = (data) => {
    return data.dataset_type_hierarchy?.second_level || data.display_subtype || data.dataset_type
}

function getNormalizedName(term) {
    if (term && normalizedNames.hasOwnProperty(term.toLowerCase())) {
        return normalizedNames[term.toLowerCase()]
    }
    return term
}

export function getIsPrimaryDataset(data) {
    return eq(data.dataset_category, 'primary') || eq(data.creation_action, 'Create Dataset Activity')
}

export function getDOIPattern() {
    return "(^(http(s)?:\/\/)?dx.doi.org\/10.\\d{4,9}\/protocols\.io\..+)|(^(http(s)?:\/\/)?doi.org\/10.\\d{4,9}\/protocols\.io\..+)"
}

export function formatByteSize(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    // This uses metric instead of binary (1024)
    const k = 1000
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'kB', 'MB', 'GB', 'TB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function getStatusDefinition(status) {
    let msg
    if (status) {
        status = status.toUpperCase();
        switch (status) {
            case 'NEW':
                msg = <span>The Globus directory is ready for data upload.</span>
                break;
            case 'INCOMPLETE':
                msg = <span>The data provider has begun to upload data but is not ready for validation or processing via the ingest pipeline.</span>
                break;
            case 'VALID':
                msg = <span>The data passed validation during processing via the ingest pipeline.</span>
                break;
            case 'INVALID':
                msg = <span>The data did not pass validation prior to processing via the ingest pipeline.</span>
                break;
            case 'QA':
                msg =
                    <span>The data has been successfully processed via the ingest pipeline and is awaiting data provider curation.</span>
                break;
            case 'ERROR':
                msg = <span>An error occurred during processing via the ingest pipeline.</span>
                break;
            case 'PROCESSING':
                msg = <span>The data is currently being processed via the ingest pipeline.</span>
                break;
            case 'REORGANIZED':
                msg = <span>Datasets included in this Upload have been registered and data has been reorganized on the Globus Research Management system.</span>
                break;
            case 'SUBMITTED':
                msg = <span>The data provider has finished uploading data and the data is ready for validation.</span>
                break;
            case 'PUBLISHED':
                msg = <span>The data has been successfully curated and released for public use.</span>
                break;
            default:
                msg = <span>The <code>Dataset</code> has been {status}.</span>
                break;
        }
    }
    return msg;
}

export function getJobStatusDefinition(status) {
    let msg
    if (status) {
        status = status.toUpperCase();
        switch (status) {
            case 'QUEUED':
                msg = <span>Queued in the rq service.</span>
                break;
            case 'COMPLETE':
                msg = <span>Job returned successfully.</span>
                break;
            case 'ERROR':
                msg = <span>Job returned with errors.</span>
                break;
            case 'FAILED':
                msg = <span>Exception thrown in job.</span>
                break;
            case 'STARTED':
                msg = <span>Job started.</span>
                break;
            case 'STOPPED':
                msg = <span>Job stopped.</span>
                break;
            case 'CANCELED':
                msg = <span>Job cancelled.</span>
                break;
            default:
                msg = <span>The job has been {status}.</span>
                break;
        }
    }
    return msg;
}

export function getJobTypeColor(type) {
    if (type) {
        switch (type.toLowerCase()) {
            case "metadata validation":
                return '#dc8e07'
            case "metadata registration":
                return '#dc8e07'
            case "entity validation":
                return '#3b6b23'
            case "entity registration":
                return '#3b6b23'
            case "cache":
                return '#535353'
            default:
                break;
        }
    }
}

export function getStatusColor(status) {
    let badge_class = '';

    if (status) {
        switch (status.toUpperCase()) {
            case "NEW":
            case "REOPENED":
                badge_class = "badge-purple";
                break;
            case "INCOMPLETE":
            case "CANCELED":
            case "STOPPED":
                badge_class = "badge-warning";
                break;
            case "INVALID":
            case "ERROR":
            case "FAILED":
                badge_class = "badge-danger";
                break;
            case "QA":
            case "REORGANIZED":
            case "SUBMITTED":
                badge_class = "badge-info";
                break;
            case "LOCKED":
            case "PROCESSING":
            case "STARTED":
                badge_class = "badge-secondary";
                break;
            case "PUBLISHED":
            case "COMPLETE":
            case "VALID":
                badge_class = "badge-success";
                break;
            case "UNPUBLISHED":
                badge_class = "badge-light";
                break;
            case "DEPRECATED":
                break;
            case "HOLD":
            case "QUEUED":
            case "SCHEDULED":
                badge_class = "badge-dark";
                break;
            default:
                break;
        }

        return badge_class;
    }
    return badge_class

}

export const datasetIs = {
    processed: (creationAction) => creationAction.includes('Process'),
    component: (creationAction) => creationAction.includes('Multi-Assay Split'),
    primary: (creationAction) => eq(creationAction,'create dataset activity')
}

export function getCreationActionRelationName(creationAction) {
    if (datasetIs.processed(creationAction)) {
        return 'Processed Dataset'
    } else if (datasetIs.component(creationAction)) {
        return 'Component Dataset'
    } else {
        return 'Primary Dataset'
    }
}

export function checkFilterType(filters, field = 'entity_type') {
    let hasType = false;
    filters.map((filter, index) => {
        if (filter.field === field) {
            hasType = true;
        }
    });

    return hasType;
}

export function checkMultipleFilterType(filters, field = 'entity_type') {
    let hasMultipleType = false;
    try {
        filters.map((filter, index) => {
            if (filter.field === field) {
                if (filter.values.length > 1)
                    hasMultipleType = true;
            }
        });
    } catch (e) {
        return hasMultipleType;
    }

    return hasMultipleType;
}

export function cleanJson(json) {
    Object.entries(json).forEach(([key, val]) =>
        (val && typeof val === 'object') && cleanJson(val) ||
        (key !== 'description') && (val === null || val === "" || val === undefined) && delete json[key]
    );
    return json;
}

export function getClickableLink(link) {
    return link.startsWith("http://") || link.startsWith("https://") ? link : "https://" + link;
}

export function goIntent(route, fn = 'assign') {
    window.location[fn](getRootURL() + APP_ROUTES[route])
}

export function goToSearch() {
    goIntent('search')
}

export function getEntityViewUrl(entity, uuid, {isEdit = false}) {
    const pre = isEdit ? '/edit' : ''
    return pre + "/" + entity?.toLowerCase() + "?uuid=" + uuid
}

export function autoBlobDownloader(data, type, filename) {
    const a = document.createElement('a')
    const url = window.URL.createObjectURL(new Blob(data, {type}))
    a.href = url
    a.download = filename
    document.body.append(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
}


export function urlify(text, blank = true, max = 40) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
        url = url.replace('http://local', '')
        return `<a href="${url}" title="${url}" ${blank ? 'target="_blank" class="lnk--ic"' : ''}>${url.length > max ? url.substr(0, 40) + '...' : url} ${blank ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor"><path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"></path><path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"></path></svg>' : ''}</a>`;
    })
}

export function eq(s1, s2, insensitive = true) {
    let res = s1 === s2
    if (insensitive && s1 !== undefined && s2 !== undefined) {
        res = s1?.toLowerCase() === s2?.toLowerCase()
    }
    return res
}

Object.assign(String.prototype, {
    upperCaseFirst() {
        return this[0].toUpperCase() + this.slice(1);
    },
    titleCase() {
        return this.replace(
            /\w\S*/g,
            text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
        )
    },
    contains(needle) {
        return this.indexOf(needle) !== -1
    },
    stripTags() {
        return this.replace(/(<([^>]+)>)/gi, "")
    },
    isEmpty() {
        return (eq(typeof this, 'string') && !this.length)
    },
    camelCase(delimiter = '_') {
        return this.split(delimiter).map((e,i) => i ? e.charAt(0).toUpperCase() + e.slice(1).toLowerCase() : e.toLowerCase()).join('')
    }
})

Object.assign(Array.prototype, {
    sortOnProperty(key) {
        return this.sort((a, b) => {
                let fa = a[key].toLowerCase(),
                    fb = b[key].toLowerCase()

                if (fa < fb) {
                    return -1
                }
                if (fa > fb) {
                    return 1
                }
                return 0
        })
    },
    contains(needle, insensitive = true) {
        return this.some((i) => eq(i, needle, insensitive))
    },
    mapKeys(fn) {
        const mapped = this.map(([k,v]) => ({ [fn(k)] : v}) )
        let result = {}
        for(let m of mapped) {
            result = Object.assign(result, m)
        }
        return result
    }
})


export const flipObj = (obj) => {
    return Object.keys(obj).reduce((ret, key) => {
        ret[obj[key]] = key;
        return ret;
    }, {})
}

export const matchArrayOrder = (ordering, data, key1 = 'name', key2 = 'id') => {
    if (!ordering) return data
    let map = {}
    let val
    let result = []
    if (Array.isArray(data)) {
        for (let i=0; i < data.length; i++) {
            val = eq(typeof data[i][key1], 'string') ? data[i][key1] : data[i][key2]
            map[val] = i
        }
    } else {
        map = data
    }

    if (Object.keys(map).length !== ordering.length) return data
    let index, item
    for (let i = 0; i < ordering.length; i++) {
        index = map[ordering[i]]
        item = data[index]
        result.push(data[index])

    }
    return result
}


export const deleteFromLocalStorage = (needle, fn = 'startsWith') => {
    Object.keys(localStorage)
        .filter(x =>
            x[fn](needle))
        .forEach(x =>
            localStorage.removeItem(x))
}

export const deleteFromLocalStorageWithSuffix = (needle) => deleteFromLocalStorage(needle, 'endsWith')

export const THEME = {
    getRGB: (color) => {
        color = +("0x" + color.slice(1).replace(
            color.length < 5 && /./g, '$&$&'));

        let r = color >> 16;
        let g = color >> 8 & 255;
        let b = color & 255;
        return {r, g, b}
    },
    isLightColor: (color) => {
        const {r, g, b} = THEME.getRGB(color)
        let hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))
        return hsp > 127.5
    },
    randomColor: () => {
        let hexTab = "5553336789ABCDE0";
        let r1 = hexTab[ Math.floor( Math.random() * 16) ];
        let g1 = hexTab[ Math.floor( Math.random() * 16) ];
        let b1 = hexTab[ Math.floor( Math.random() * 16) ];
        let color = "#" + r1 + g1 + b1
        const {r, g, b} = THEME.getRGB(color)
        return {color, light: THEME.isLightColor(color), r, g, b};
    },
}

export const extractSourceSex = (source) => {
    // Default to `undefined`
    let sex = undefined
    // First check if Source has metadata
    if (eq(source['source_type'], 'Human') && 'metadata' in source) {
        // Source metadata will have a top level object such as organ_donor_data or living_donor_data
        let metadataKey = Object.keys(source.metadata)[0]
        source.metadata[metadataKey].some(function (metadataObject) {
            if (metadataObject['grouping_concept_preferred_term'] === 'Sex') {
                // Check that the value for Sex is Male or Female, otherwise set to `undefined`
                sex = (metadataObject['preferred_term'] === 'Male' || metadataObject['preferred_term'] === 'Female') ? metadataObject['preferred_term'] : undefined
                console.log(sex)
                return sex
            }
        })
    }

    return sex
}

export const extractSourceMappedMetadataInfo = (sourceMappedMetadata) => {
    const groups = {}
    const metadata = {}
    for (const [key, value] of Object.entries(sourceMappedMetadata)) {
        groups[value.key_display] = value.group_display
        metadata[value.key_display] = value.value_display
    }
    return {
        groups: groups,
        metadata: metadata
    }
}

/**
 * @typedef {Object} Filter
 * @property {string} field - The field to filter on
 * @property {string[]} values - The values to filter on
 * @property {string} type - The type of filter
 */

/**
 * @param {Filter[]} filters - The filters to convert to a query string
 * @param {number} [size] - The number of results to return per page
 * @returns {string} - The url encodes query string
 */
export const searchUIQueryString = (filters, size=20) => {
    const segments = filters.map((filter, idx) => {
        let segment = encodeURIComponent(`filters[${idx}][field]`) + `=${filter.field}&`
        segment += filter.values
            .map((value, i) => encodeURIComponent(`filters[${idx}][values][${i}]`) + `=${encodeURIComponent(value)}&`)
            .join('')
        segment += encodeURIComponent(`filters[${idx}][type]`) + `=${filter.type}`
        return segment
    })

    return `size=n_${size}_n&` + segments.join('&')
}
