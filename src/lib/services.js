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