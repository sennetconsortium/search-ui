import path from 'path'
import {promises as fs} from 'fs'
import log from 'loglevel'
import {getRootURL, getUbkgCodes} from '../../../config/config'
import {get_auth_header, get_headers_from_req, get_json_header} from "../../../lib/services";

const ONTOLOGY_CACHE_PATH = path.join(process.cwd(), 'cache')
export default async function handler(req, res) {
    let auth = get_auth_header({req, res})
    let headers = get_json_header(get_headers_from_req(req.headers, auth))
    let response  = await fetch(`${getRootURL()}api/auth/token`, {method:'GET', headers})
    let json = await response.json()

    if (req.method === 'DELETE' && json.active) {
        let filePath
        const codes = Object.values(getUbkgCodes())
        let results = []
        for (let key of codes) {
            try {
                filePath = ONTOLOGY_CACHE_PATH + '/.ontology_' + key
                let del = await fs.rm(filePath)
                if (!del) {
                    log.debug(`CACHE Cleared`)
                } else {
                    results.push({description: filePath})
                }
            } catch (e) {
                console.error(e)
                results.push({description: e})
            }
        }
        const code = !results.length ? 200 : 400
        res.status(code).json(results)
    }

    res.status(json.active ? 404 : 401).json([])
}