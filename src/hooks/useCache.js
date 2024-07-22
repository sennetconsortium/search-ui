import {
    get_dataset_types,
    get_entities,
    get_organ_types,
    get_sample_categories,
    get_source_types,
    get_organs
} from '../lib/ontology'
import {flipObj} from "../components/custom/js/functions";

function useCache() {

    const fetchData = async () => {
        const datasetTypes = await get_dataset_types()
        const sampleCategories = await get_sample_categories()
        const organTypes = await get_organ_types()
        const entities = await get_entities()
        const sourceTypes = await get_source_types()
        const organTypesCodes = flipObj(organTypes)
        const organs = await get_organs()

        //TODO Remove in the future
        delete entities['publication entity']
        entities.publication = 'Publication'
        entities.collection = 'Collection'
        const cache = {cache: {datasetTypes, sampleCategories, organTypes, entities, sourceTypes, organTypesCodes, organs}}
        window.UBKG_CACHE = cache.cache
        return cache
    }

    return {  fetchData }
}

export default useCache
