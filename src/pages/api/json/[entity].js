import {getRootURL} from "../../../config/config";
import log from "loglevel";
import {getCookie} from "cookies-next";

export default function handler(req, res) {
    const uuid = req.query.uuid
    let auth = getCookie("groups_token", {req, res})

    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + auth);
    myHeaders.append("Content-Type", "application/json");
    let requestOptions = {
        method: 'GET',
        headers: myHeaders
    }
    log.info('sample: getting data...', uuid)
    fetch(getRootURL() + "api/find?uuid=" + uuid, requestOptions)
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
