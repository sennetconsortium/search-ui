import {getAuth, getEntityEndPoint, getIngestEndPoint} from "../config/config";
import log from "loglevel";

// After creating or updating an entity, send to Entity API. Search API will be triggered during this process automatically

export async function update_create_entity(uuid, body, action = "edit", entity_type = null, router) {
    let raw = JSON.stringify(body)
    let url = getEntityEndPoint() + "entities/" + (action === 'create' ? entity_type : uuid)
    let method = (action === 'create' ? "POST" : "PUT")

    return call_service(raw, url, method)
}

export async function update_create_dataset(uuid, body, action = "edit", router) {
    if (action === 'edit') {
        return update_create_entity(uuid, body, action, router);
    } else {
        let raw = JSON.stringify(body)
        let url = getIngestEndPoint() + "datasets" + (action === 'create' ? '' : "/" + uuid + "/submit")
        let method = (action === 'create' ? "POST" : "PUT")
        log.debug(url)

        return call_service(raw, url, method)
    }
}


function get_headers() {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + getAuth())
    return headers;
}

export async function get_read_write_privileges() {
    log.info('GET READ WRITE PRIVILEGES')
    const url = getIngestEndPoint() + 'privs'
    const request_options = {
        method: 'GET',
        headers: get_headers()
    }
    const response = await fetch(url, request_options)
    if (!response.ok) {
        return {
            "read_privs": false,
            "write_privs": false
        };
    }
    let json = response.json()
    return await json
}

export const write_privilege_for_group_uuid = (group_uuid) => get_write_privilege_for_group_uuid(group_uuid)

export async function get_write_privilege_for_group_uuid(group_uuid) {
    log.info('GET WRITE PRIVILEGE FOR GROUP UUID')
    const url = getIngestEndPoint() + 'privs/' + group_uuid + '/has-write'
    const request_options = {
        method: 'GET',
        headers: get_headers()
    }
    const response = await fetch(url, request_options)
    if (!response.ok) {
        const message = `An error has occurred: ${response.status}`;
        throw new Error(message);
    }
    let json = response.json()
    return await json
}

export async function get_user_write_groups() {
    log.debug('FETCHING USER WRITE GROUPS')

    const url = getIngestEndPoint() + 'privs/' + 'user-write-groups'
    const request_options = {
        method: 'GET',
        headers: get_headers()
    }
    const response = await fetch(url, request_options)
    if (!response.ok) {
        const message = `An error has occurred: ${response.status}`;
        throw new Error(message);
    }
    let json = response.json()
    return await json
}

async function call_service(raw, url, method) {
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + getAuth())

    return await fetch(url, {
        method: method,
        headers: headers,
        body: raw,
    }).then(response => response.json())
        .then(result => {
            log.info(result)
            return result;
        }).catch(error => {
            log.error('error', error)
            return error;
        });
}