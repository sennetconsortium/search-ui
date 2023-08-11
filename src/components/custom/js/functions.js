import {getAuth, getProtocolsToken, getRootURL} from "../../../config/config";
import {APP_ROUTES} from "../../../config/constants";
import log from "loglevel";
import fetchJsonp from "fetch-jsonp";

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

export async function fetchEntity(ancestorId) {
    const response = await fetch("/api/find?uuid=" + ancestorId, getRequestHeaders());
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
    // The ID is everything after "dx.doi.org/"
    const regex = new RegExp("(?<=dx.doi.org/).*")
    return regex.exec(protocolUrl)
}

export async function fetchProtocol(protocolUrl) {
    log.info(protocolUrl)
    return await fetch(protocolUrl,
        {
            headers: new Headers({Authorization: 'Bearer ' + getProtocolsToken()})
        }
    );
}

export async function fetchProtocolView(protocolUrl) {
    if (!protocolUrl) return null
    let uri = getClickableLink(protocolUrl)
    try {
        let result = await fetchJsonp(uri, {
            timeout: 2000,
        }).then(function(json) {
            return true
        }).catch(function(resp) {
            return resp.message.contains('timed out')
        })
        return {ok: result}
    } catch (e) {
        console.error(e)
        return {ok: false}
    }
}

export async function fetchProtocols(protocolUrl) {
    if (!protocolUrl) return null
    const response = await fetchProtocol('https://www.protocols.io/api/v4/protocols/' + getProtocolId(protocolUrl))

    if (!response.ok) {
        return null
    }
    const protocol = await response.json();
    return protocol.payload;
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
    } else if (window.UBKG_CACHE.dataTypesObj.filter(data_type => data_type['data_type'] === term).length > 0) {
        return window.UBKG_CACHE.dataTypesObj.filter(data_type => data_type['data_type'] === term).map(data_type => data_type.description)[0];
    }
    else {
        return getNormalizedName(term)
    }
}

function getNormalizedName(term) {
    if (term.toLowerCase() === "true" || term.toLowerCase() === "false") {
        return (term.charAt(0).toUpperCase() + term.slice(1).toLowerCase());
    }
    if (term.toLowerCase() === "m") {
        return "Male"
    }
    if (term.toLowerCase() === "f") {
        return "Female"
    }
    return term
}

export function getDataTypesByProperty(property, value) {
    return window.UBKG_CACHE.dataTypesObj.filter(data_type => data_type[property] === value).map(data_type => data_type.data_type);
}

export function getDOIPattern() {
    return "(^(http(s)?:\/\/)?dx.doi.org\/10.\\d{4,9}\/protocols\.io\..+)|(^(http(s)?:\/\/)?doi.org\/10.\\d{4,9}\/protocols\.io\..+)"
}

export function formatByteSize(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'kB', 'MB', 'GB', 'TB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}


export function getStatusColor(status) {
    if (status) {
        status = status.toUpperCase();

        if (['NEW', 'REOPENED', 'QA', 'LOCKED', 'PROCESSING', 'HOLD', 'SUBMITTED'].includes(status)) {
            return 'info';
        }

        if (['INVALID', 'ERROR'].includes(status)) {
            return 'danger';
        }

        if (['UNPUBLISHED', 'DEPRECATED', 'Retracted' /* sub_status gets title caps. */].includes(status)) {
            return 'warning';
        }

        if (status === 'PUBLISHED') {
            return 'success';
        }

        log.warn('Invalid status', status);
        return '';
    }
    return '';

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

export function isPrimaryAssay(data, verifyAll = false) {
    let dict = {}
    let result = false
    for(let assay of window.UBKG_CACHE.dataTypesObj) {
        dict[assay.data_type] = assay.primary
    }
    for (let assay of data.data_types) {
        if (dict[assay]) {
            result = true
            if (!verifyAll) {
                return true
            }
        } else {
            if (verifyAll) {
                return false
            }
        }
    }
    return result;
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

export function gotToLogin() {
    goIntent('login')
}

export function getEntityViewUrl(entity, uuid, {isEdit = false}) {
    const pre = isEdit ? '/edit' : ''
    return pre + "/" + entity?.toLowerCase() + "?uuid=" + uuid
}


export function urlify(text, blank = true, max = 40) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
        url = url.replace('http://local', '')
        return `<a href="${url}" title="${url}" ${blank ? 'target="_blank" class="lnk--ic"' : ''}>${url.length > max ? url.substr(0, 40) + '...' : url} ${blank ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor"><path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"></path><path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"></path></svg>' : ''}</a>`;
    })
}

export function equals(s1, s2, insensitive = true) {
    let res = s1 === s2
    if (insensitive && s1 !== undefined && s2 !== undefined) {
        res = s1.toLowerCase() === s2.toLowerCase()
    }
    return res
}

Object.assign(String.prototype, {
    upperCaseFirst() {
        return this[0].toUpperCase() + this.slice(1);
    },
    contains(needle) {
        return this.indexOf(needle) !== -1
    },
    stripTags() {
        return this.replace(/(<([^>]+)>)/gi, "")
    }
})

export const flipObj = (obj) => {
    return Object.keys(obj).reduce((ret, key) => {
        ret[obj[key]] = key;
        return ret;
    }, {})
}

