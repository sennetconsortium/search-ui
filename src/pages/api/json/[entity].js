import {getRootURL} from "../../../config/config";
import log from "loglevel";
import {getCookie, hasCookie} from "cookies-next";

export default async function handler(req, res) {
    const uuid = req.query.uuid
    let auth = req.headers.authorization
    let myHeaders = new Headers();

    if (req.headers.authorization === undefined && hasCookie("groups_token", {req, res})) {
        auth = "Bearer " + getCookie("groups_token", {req, res})
        myHeaders.append("Authorization", auth);
    }

    myHeaders.append("Content-Type", "application/json");
    let requestOptions = {
        method: 'GET',
        headers: myHeaders
    }
    log.info('sample: getting data...', uuid)
    await fetch(getRootURL() + "api/find?uuid=" + uuid, requestOptions)
        .then(response => response.json())
        .then(result => {
            log.debug(result)

            if (result.hasOwnProperty("error")) {
                res.status(401).json(result)
            } else {
                res.status(200).json(result)
            }
        }).catch(error => {
            log.error(error)
            res.status(500).json(error)
        });
}
