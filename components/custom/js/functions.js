import {getAuth} from "../../../config/config";
import log from "loglevel";

export function getRequestHeaders() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + getAuth());
    myHeaders.append("Content-Type", "application/json");
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

export function getStatusColor(status) {
    status = status.toUpperCase();

    if (['NEW', 'REOPENED', 'QA', 'LOCKED', 'PROCESSING', 'HOLD'].includes(status)) {
        return 'text-info';
    }

    if (['INVALID', 'ERROR'].includes(status)) {
        return 'text-error';
    }

    if (['UNPUBLISHED', 'DEPRECATED', 'Retracted' /* sub_status gets title caps. */].includes(status)) {
        return 'text-warning';
    }

    if (status === 'PUBLISHED') {
        return 'text-success';
    }

    log.warn('Invalid status', status);
    return '';

}

export function cleanJson(json) {
    Object.entries(json).forEach(([key, val]) =>
        (val && typeof val === 'object') && cleanJson(val) ||
        (val === null || val === "" || val === undefined) && delete json[key]
    );
    return json;
}