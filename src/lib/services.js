import {getAuth, getEntityEndPoint, getIngestEndPoint, getUUIDEndpoint} from "../config/config";
import log from "loglevel";

// After creating or updating an entity, send to Entity API. Search API will be triggered during this process automatically

export async function update_create_entity(uuid, body, action = "Edit", entity_type = null) {
    let raw = JSON.stringify(body)
    let url = getEntityEndPoint() + "entities/" + (action === 'Register' ? entity_type : uuid)
    let method = (action === 'Register' ? "POST" : "PUT")

    return call_service(raw, url, method)
}

export async function update_create_dataset(uuid, body, action = "Edit") {
    if (action === 'Edit') {
        return update_create_entity(uuid, body, action);
    } else {
        let raw = JSON.stringify(body)
        let url = getIngestEndPoint() + "datasets" + (action === 'Register' ? '' : "/" + uuid + "/submit")
        let method = (action === 'Register' ? "POST" : "PUT")
        log.debug(url)
        return call_service(raw, url, method)
    }
}

export function get_json_header( headers ) {
    headers = headers || new Headers();
    headers.append("Content-Type", "application/json");
    return headers;
}

export function get_auth_header() {
    const headers = new Headers();
    headers.append("Authorization", "Bearer " + getAuth())
    return headers;
}

export function get_headers() {

    const headers = get_auth_header();
    return get_json_header(headers);
}

export async function fetchGlobusFilepath(sennet_id) {
    const headers = get_auth_header();
    const url = getEntityEndPoint() + "entities/" + sennet_id + "/globus-url"
    const request_options = {
        method: 'GET',
        headers: headers
    }
    const response = await fetch(url, request_options)
    const filepath = await response.text();
    log.error(filepath)
    return {status: response.status, filepath};
}

// This function requires the bearer token passed to it as the middleware can't access "getAuth()"
export async function fetch_entity_type(uuid, bearer_token) {
    const headers = new Headers();
    headers.append("Authorization", "Bearer " + bearer_token)
    const url = getUUIDEndpoint() + "uuid/" + uuid
    const request_options = {
        method: 'GET',
        headers: headers
    }
    const response = await fetch(url, request_options)
    if (response.status === 200) {
        const entity = await response.json();
        return (entity["type"]).toLowerCase();

    } else if (response.status === 400) {
        return "404";
    } else {
        return ""
    }
}

export async function get_read_write_privileges() {
    log.info('GET READ WRITE PRIVILEGES')
    const url = getIngestEndPoint() + 'privs'
    const request_options = {
        method: 'GET',
        headers: get_headers()
    }
    try {
        const response = await fetch(url, request_options)
        if (!response.ok) {
            return {
                "read_privs": false,
                "write_privs": false
            };
        }
        let json = response.json()
        return await json
    } catch (e) {
        console.error(e)
    }

}

export const write_privilege_for_group_uuid = (group_uuid) => get_write_privilege_for_group_uuid(group_uuid)

export async function get_write_privilege_for_group_uuid(group_uuid) {
    log.debug('GET WRITE PRIVILEGE FOR GROUP UUID')
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
    log.debug(json)
    return await json
}

async function call_service(raw, url, method) {
    return await fetch(url, {
        method: method,
        headers: get_headers(),
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

export function parseJson(json) {
    if (typeof json === 'string' || json instanceof String) {
        if (json === '') {
            return null
        }
        return JSON.parse(json)
    } else {
        return json
    }
}

export async function get_ancestor_organs(uuid) {
    log.debug('FETCHING ANCESTOR ORGANS')

    const url = getEntityEndPoint() + "entities/" + uuid + "/ancestor-organs"
    const request_options = {
        method: 'GET',
        headers: get_headers()
    }
    let organs = []
    const response = await fetch(url, request_options)
    if (!response.ok) {
        return organs
    }
    let json = await response.json()
    json.forEach(entity => {
        organs.push(entity["organ"])
    });
    return organs
}

export const uploadFile = async file => {
    const formData = new FormData()
    formData.append('file', file)
    const requestOptions = {
        headers: get_auth_header(),
        method: 'POST',
        body: formData
    }
    try {
        const response = await fetch(getIngestEndPoint() + 'file-upload', requestOptions)
        return await response.json()
    } catch (error) {
        throw Error('413')
    }
}