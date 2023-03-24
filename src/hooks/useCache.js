import { useEffect, useState } from 'react'
import {get_data_assays, get_entities, get_organ_types, get_sample_categories, get_source_types} from '../lib/ontology'

function useCache() {
    const [dataTypes, setDataTypes] = useState({})
    const [sampleCategories, setSampleCategories] = useState({})
    const [organTypes, setOrganTypes] = useState({})
    const [sourceTypes, setSourceTypes] = useState({})
    const [entities, setEntities] = useState({})

    const fetchData = async () => {
        const assays = await get_data_assays()
        const categories = await get_sample_categories()
        const organs = await get_organ_types()
        const _entities = await get_entities()
        const sources = await get_source_types()

        setDataTypes(assays)
        setSampleCategories(categories)
        setOrganTypes(organs)
        setEntities(_entities)
        setSourceTypes(sources)
    }

    useEffect(() => {
        fetchData()
        return () => {}
    }, [])
    return { dataTypes, sampleCategories, organTypes, entities, sourceTypes }
}

export default useCache
