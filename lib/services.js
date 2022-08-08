import {getAuth, getEntityEndPoint} from "../config/config";
import log from "loglevel";

// After creating or updating an entity, send to Entity API. Search API will be triggered during this process automatically

export async function update_create_entity(uuid, body, action = "edit", entity_type = null, router) {
    let raw = JSON.stringify(body)
    let url = getEntityEndPoint() + "entities/" + (action === 'create' ? entity_type : uuid)
    let method = (action === 'create' ? "POST" : "PUT")

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + getAuth())

    return await fetch(url, {
        method: method,
        headers: myHeaders,
        body: raw,
    }).then(response => {
        log.info(response)
        return response;
    }).catch(error => {
        log.error('error', error)
        return error;
    });
}