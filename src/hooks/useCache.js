import {get_data_assays, get_entities, get_organ_types, get_sample_categories, get_source_types} from '../lib/ontology'
import {flipObj} from "../components/custom/js/functions";

function useCache() {

    const fetchData = async () => {
        const dataTypes = await get_data_assays()
        const sampleCategories = await get_sample_categories()
        const organTypes = await get_organ_types()
        const entities = await get_entities()
        const sourceTypes = await get_source_types()
        const organTypesCodes = flipObj(organTypes)

        return {cache: {dataTypes, sampleCategories, organTypes, entities, sourceTypes, organTypesCodes}}
    }

    return {  fetchData }
}

export default useCache
