import {getRootURL} from "../../../config/config";
import {getCookie, hasCookie} from "cookies-next";
import {formatMessageForCloudwatch} from "../find";

export default async function handler(req, res) {
    console.log('JSON API STARTING...')
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
    console.log('sample: getting data...', uuid)
    await fetch(getRootURL() + "api/find?uuid=" + uuid, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log('RESPONSE FROM FIND API...', formatMessageForCloudwatch(result))

            if (result.hasOwnProperty("error")) {
                res.status(401).json(result)
            } else {
                res.status(200).json(result)
            }
        }).catch(error => {
            console.log('ERROR IN JSON API...', formatMessageForCloudwatch(error))
            res.status(500).json(error)
        });
}
