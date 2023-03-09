import path from 'path'
import { promises as fs } from 'fs'
import log from 'loglevel'
import {get_read_write_privileges} from "../../../lib/services";

const ONTOLOGY_CACHE_PATH = path.join(process.cwd(), 'cache')

export default async function handler(req, res) {
    const key = req.query.code
    try {
        const filePath = ONTOLOGY_CACHE_PATH + '/.ontology_' + key

        if (req.method === 'PUT') {

            const response = await get_read_write_privileges()

            if (response.write_privs && response.read_privs) {
                await fs.writeFile(filePath, req.body, 'utf8')
                res.status(200).json({ code: key })
            } else {
                res.status(401).json('Forbidden')
            }
        } else {
            let ontology

            try {
                ontology = await fs.readFile(filePath, 'utf8')
            } catch (e) {
                log.debug(`ONTOLOGY API file ${filePath} doesn't exist, creating...`)
                await fs.writeFile(filePath, '')
            }

            if (ontology) {
                res.status(200).json(JSON.parse(ontology))
            } else {
                res.status(404).json([])
            }
        }
    } catch (error) {
        console.error(`ONTOLOGY API`, error)
    }
}