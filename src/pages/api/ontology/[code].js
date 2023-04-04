import path from 'path'
import {promises as fs} from 'fs'
import log from 'loglevel'
import {get_onotology_valueset} from '../../../lib/ontology'

const ONTOLOGY_CACHE_PATH = path.join(process.cwd(), 'cache')

export default async function handler(req, res) {
    const key = req.query.code
    try {
        const filePath = ONTOLOGY_CACHE_PATH + '/.ontology_' + key

        let ontology

        try {
            ontology = await fs.readFile(filePath, 'utf8')
            ontology = JSON.parse(ontology)
        } catch (e) {
            log.debug(`ONTOLOGY API file ${filePath} doesn't exist, creating...`)
            ontology = await get_onotology_valueset(key)
            await fs.mkdir(path.dirname(filePath), {recursive: true}).then(function () {
                fs.writeFile(filePath, JSON.stringify(ontology), 'utf8')
            })
        }

        if (ontology) {
            res.status(200).json(ontology)
        } else {
            res.status(404).json({code: key})
        }
    } catch (error) {
        console.error(`ONTOLOGY API`, error)
    }
}