import { getOntologyEndPoint } from '../config/config'
import log from 'loglevel'
import { get_json_header } from './services'

export const ONTOLOGY_CODES = {
    'sample_categories': 'C020076',
    'data_assays': 'C004000',
    'organ_types': 'C000008',
    'source_types': 'C050020',
    'entities': 'C000012'
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
    let list = await get_ontology_from_cache(ONTOLOGY_CODES.sample_categories)
    return to_key_val(list)
}

export async function get_data_assays() {
    const list = await get_ontology_from_cache(ONTOLOGY_CODES.data_assays) //C000001
    const assays = to_key_val(list)
    return add_other(assays)
}

export async function get_organ_types() {
    let list = await get_ontology_from_cache(ONTOLOGY_CODES.organ_types)
    return to_key_val(list)
}

export async function get_source_types() {
    let list = await get_ontology_from_cache(ONTOLOGY_CODES.source_types)
    return to_key_val(list)
}

export async function get_entities() {
    let list = await get_ontology_from_cache(ONTOLOGY_CODES.entities)
    return to_key_val(list)
}