import path from 'path'
import { promises as fs } from 'fs'
import log from 'loglevel'
import {ONTOLOGY_CODES} from "../../../../lib/ontology";
import {get_read_write_privileges} from "../../../../lib/services";

const ONTOLOGY_CACHE_PATH = path.join(process.cwd(), 'cache')
export default async function handler(req, res) {

    if (req.method === 'DELETE') {
        let filePath
        const codes = Object.values(ONTOLOGY_CODES)
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

    res.status(404).json([])
}