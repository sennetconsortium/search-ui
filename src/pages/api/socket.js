import WebSocket from "ws";
import {getIngestEndPoint} from "../../config/config";
import {get_auth_header, get_headers_from_req, get_json_header} from "../../lib/services";

export default async function handler(req, res) {

    if (req.method === 'GET') {
        //TODO: to be completed when realtime updates are available
        // const ws = new WebSocket(`ws://${getIngestEndPoint()}jobs`)
        //
        // ws.on('message', function message(data) {
        //     console.log('received: %s', data);
        //     res.status(200).json(data)
        // })

        //TODO: remove after feature complete
        let tempData = [{
            job_id: 'SOME UUID 0',
            started_timestamp: 1710364245519,
            ended_timestamp: 1710365103528,
            description: 'Validation of somethings',
            status: 'Complete',
            hit_path: '/bulk/validate',
            errors: []
        },
        {
            job_id: 'SOME UUID 1',
            description: 'Validation of somethings',
            started_timestamp: 1710364245519,
            ended_timestamp: 1710365103528,
            status: 'Error',
            hit_path: '/bulk/validate',
            errors: [{
                row: 1,
                error: 'An error'
            },
            {
                row: 3,
                error: 'An error'
            }]
        },
        {
            job_id: 'SOME UUID 2',
            description: 'Registering somethings',
            started_timestamp: 1710364245517,
            ended_timestamp: 1710365103528,
            status: 'Complete',
            hit_path: '/bulk/register',
            errors: []
        },
        {
            job_id: 'SOME UUID 3',
            started_timestamp: 1710254243315,
            ended_timestamp: 1710365103528,
            description: 'Validation of somethings',
            status: 'Processing',
            hit_path: '/bulk/validate',
            errors: []
        }]

        let auth = get_auth_header({req, res})
        let headers = get_json_header(get_headers_from_req(req.headers, auth))
        //let response1  = await fetch(`${getIngestEndPoint()}jobs/flush`, {method:'DELETE', headers})
        let response  = await fetch(`${getIngestEndPoint()}jobs`, {method:'GET', headers})
        let json = response.ok ? await response.json() : []
        res.status(response.status).json(json)
    } else {
        res.status(404).json([])
    }


}