import {getIngestEndPoint} from "../../../config/config"
import {get_auth_header, get_headers_from_req, get_json_header} from "../../../lib/services";
import {eq} from "../../../components/custom/js/functions";

export default async function handler(req, res) {
    const jobId = req.query.jobId
    let auth = get_auth_header({req, res})
    let headers = get_json_header(get_headers_from_req(req.headers, auth))
    let response;
    if (eq(req.method, 'GET')) {
        response  = await fetch(`${getIngestEndPoint()}jobs/${jobId}`, {method:'GET', headers})
    } else {

    }

    let json = response.ok ? await response.json() : null
    console.log('JOBS', json)
    res.status(response.status || 404).json(json)

}