import { useEffect, useState } from 'react'
import {get_data_assays, get_organ_types, get_sample_categories} from '../lib/ontology'

function useCache() {
    const [dataTypes, setDataTypes] = useState({})
    const [sampleCategories, setSampleCategories] = useState({})
    const [organTypes, setOrganTypes] = useState({})

    const fetchData = async () => {
        const assays = await get_data_assays()
        const categories = await get_sample_categories()
        const organs = await get_organ_types()
        setDataTypes(assays)
        setSampleCategories(categories)
        setOrganTypes(organs)
    }

    useEffect(() => {
        fetchData()
        return () => {}
    }, [])
    return { dataTypes, sampleCategories, organTypes }
}

export default useCache
