import { getOntologyEndPoint } from '../config/config'
import log from 'loglevel'
import { get_json_header } from './services'

export const ONTOLOGY_CODES = {
    'sample_categories': 'C020076',
    'data_assays': 'C004000',
    'organ_types': 'C000008'
}

export async function get_onotology_valueset(code) {
    const url = getOntologyEndPoint() + `valueset?parent_sab=SENNET&parent_code=${code}&child_sabs=SENNET`
    const request_options = {
        method: 'GET',
        headers: get_json_header()
    }
    const response = await fetch(url, request_options)
    let result = []
    if (response.ok) {
        result = await response.json()
    }
    return result
}

async function get_ontology_from_cache(key) {
    let ontology = []
    const url = '/api/ontology/' + key
    try {
        const response = await fetch(url)
        ontology = await response.json()
    } catch (error) {
        console.error(`ONTOLOGY: ${key} cache not initialized`)
    }

    if (!ontology || ontology.length === 0) {
        ontology = await get_onotology_valueset(key)
        try {
            await fetch(url, { method: 'PUT', body: JSON.stringify(ontology) })
            log.debug(`ONTOLOGY: wrote ${key} cache to file`)
        } catch (error) {
            log.debug(`ONTOLOGY: error writing ${key} cache to file`)
            console.error(error)
        }
    }
    return ontology
}

function to_key_val(list) {
    let result = {}
    for (let i of list) {
        result[i.term] = i.term
    }
    return result
}

function add_other(list) {
    list['Other'] = 'Other'
    return list
}

export async function get_sample_categories() {
    let list = await get_ontology_from_cache('C020076')
    return to_key_val(list)
}

export async function get_data_assays() {
    const list = await get_ontology_from_cache('C004000') //C000001
    const assays = to_key_val(list)
    return add_other(assays)
}

export async function get_organ_types() {
    let list = await get_ontology_from_cache('C000008')
    return to_key_val(list)
}