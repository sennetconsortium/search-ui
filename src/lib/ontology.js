import {getUbkgCodes, getUbkgCodesPath, getUbkgEndPoint, getUbkgValuesetPath} from '../config/config'
import {get_json_header} from './services'

export async function get_onotology_valueset(code) {
    const path = getUbkgCodesPath() ? getUbkgCodesPath()[code] : null
    const ep = path ? path : getUbkgValuesetPath().replace('{code}', code)
    const url = getUbkgEndPoint() + ep
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
        console.error(`ONTOLOGY API > ${key} cache not initialized`)
    }
    return ontology
}

function to_key_val(list, lowerProp = false, key = 'term', key2 = 'term') {
    if (!Array.isArray(list)) return null
    let result = {}
    let prop
    let val
    for (let i of list) {
        prop = i[key]
        val = i[key2]
        prop = prop ? prop.trim() : prop
        val = val ? val.trim() : val
        prop = lowerProp ? prop.toLowerCase() : prop
        result[prop] = val
    }
    return result
}

function add_other(list, key = 'Other') {
    list[key] = 'Other'
    return list
}

export async function get_sample_categories() {
    let list = await get_ontology_from_cache(getUbkgCodes().specimen_categories)
    return to_key_val(list)
}

export async function get_data_assays() {
    const list = await get_ontology_from_cache(getUbkgCodes().data_assays) //C000001
    const assays = to_key_val(list, false, 'data_type', 'data_type')
    return add_other(assays)
}

export async function get_dataset_types() {
    const list = await get_ontology_from_cache(getUbkgCodes().dataset_types) //C000001
    return to_key_val(list)
}

export async function get_data_assays_obj() {
    const json = await get_ontology_from_cache(getUbkgCodes().data_assays)
    json.push({
        "alt-names": [],
        "contains-pii": true,
        "data_type": "Other",
        "dataset_provider": "SenNet IEC",
        "description": "Other",
        "primary": true,
        "vis-only": false,
        "vitessce-hints": []
    })
    return json
}

export async function get_organ_types() {
    let list = await get_ontology_from_cache(getUbkgCodes().organ_types)
    list = to_key_val(list, false,'rui_code')
    return add_other(list,'OT')
}

export async function get_source_types() {
    let list = await get_ontology_from_cache(getUbkgCodes().source_types)
    return to_key_val(list)
}

export async function get_entities() {
    let list = await get_ontology_from_cache(getUbkgCodes().entities)
    // order the list
    list.sort((a, b) => b.code.localeCompare(a.code))
    return to_key_val(list, true)
}