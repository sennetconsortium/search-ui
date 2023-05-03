import {getAuth, getProtocolsToken, getRootURL} from "../../../config/config";
import {APP_ROUTES} from "../../../config/constants";
import log from "loglevel";

export function getHeaders() {
    const myHeaders = new Headers();
    if (getAuth() !== undefined) {
        myHeaders.append("Authorization", "Bearer " + getAuth());
    }
    myHeaders.append("Content-Type", "application/json");
    return myHeaders;
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

export async function fetchProtocols(protocolUrl) {
    // The ID is everything after "dx.doi.org/"
    const regex = new RegExp("(?<=dx.doi.org/).*")
    let protocolId = regex.exec(protocolUrl)
    log.info("https://www.protocols.io/api/v4/protocols/" + protocolId)
    const response = await fetch("https://www.protocols.io/api/v4/protocols/" + protocolId,
        {
            headers: new Headers({Authorization: 'Bearer ' + getProtocolsToken()})
        }
    );

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
    console.log(term)
    if (!window.UBKG_CACHE) return term
    if (term in window.UBKG_CACHE.organTypes) {
        return window.UBKG_CACHE.organTypes[term]
    } else if (window.UBKG_CACHE.dataTypeObj.filter(data_type => data_type['data_type'] === term).length > 0) {
        return window.UBKG_CACHE.dataTypeObj.filter(data_type => data_type['data_type'] === term).map(data_type => data_type.description)[0];
    }
    else
        return term
}

export function getDataTypesByProperty(property, value) {
    return window.UBKG_CACHE.dataTypeObj.filter(data_type => data_type[property] === value).map(data_type => data_type.data_type);
}

export function getDOIPattern() {
    return "(^(http(s)?:\/\/)?dx.doi.org\/10.\\d{4,9}\/protocols\.io\..+)|(^(http(s)?:\/\/)?doi.org\/10.\\d{4,9}\/protocols\.io\..+)"
}

export function getStatusColor(status) {
    if (status) {
        status = status.toUpperCase();

        if (['NEW', 'REOPENED', 'QA', 'LOCKED', 'PROCESSING', 'HOLD'].includes(status)) {
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

export function checkFilterEntityType(filters) {
    let hasEntityType = false;
    filters.map((filter, index) => {
        if (filter.field === 'entity_type') {
            hasEntityType = true;
        }
    });

    return hasEntityType;
}

export function checkMultipleFilterEntityType(filters) {
    let hasMultipleEntityType = false;
    try {
        filters.map((filter, index) => {
            if (filter.field === 'entity_type') {
                if (filter.values.length > 1)
                    hasMultipleEntityType = true;
            }
        });
    } catch (e) {
        return hasMultipleEntityType;
    }

    return hasMultipleEntityType;
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
    }
})

export const flipObj = (obj) => {
    return Object.keys(obj).reduce((ret, key) => {
        ret[obj[key]] = key;
        return ret;
    }, {})
}

