import {
    get_data_assays,
    get_data_assays_obj,
    get_entities,
    get_organ_types,
    get_sample_categories,
    get_source_types
} from '../lib/ontology'
import {flipObj} from "../components/custom/js/functions";

function useCache() {

    const fetchData = async () => {
        const dataTypes = await get_data_assays()
        const dataTypesObj = await get_data_assays_obj()
        const sampleCategories = await get_sample_categories()
        const organTypes = await get_organ_types()
        const entities = await get_entities()
        const sourceTypes = await get_source_types()
        const organTypesCodes = flipObj(organTypes)

        //TODO Remove in the future
        // entities.publication = 'Publication'
        entities.upload = 'Upload'
        const cache = {cache: {dataTypes, dataTypesObj, sampleCategories, organTypes, entities, sourceTypes, organTypesCodes}}
        window.UBKG_CACHE = cache.cache
        return cache
    }

    return {  fetchData }
}

export default useCache
