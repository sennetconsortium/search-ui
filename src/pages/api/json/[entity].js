import {getRootURL} from "../../../config/config";
import {formatMessageForCloudwatch} from "../find";
import {get_auth_header, get_headers_from_req, get_json_header} from "../../../lib/services";

export default async function handler(req, res) {
    console.log('JSON API STARTING...')
    const uuid = req.query.uuid
    let auth = get_auth_header({req, res})
    let headers = get_json_header(get_headers_from_req(req.headers, auth))

    let requestOptions = {
        method: 'GET',
        headers: headers
    }

    console.log('Getting data...', uuid)
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
