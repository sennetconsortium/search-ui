import { useEffect, useState } from 'react'
import {get_data_assays, get_sample_categories} from '../lib/ontology'

function useCache() {
    const [dataTypes, setDataTypes] = useState({})
    const [sampleCategories, setSampleCategories] = useState({})

    const fetchData = async () => {
        const assays = await get_data_assays()
        const categories = await get_sample_categories()
        setDataTypes(assays)
        setSampleCategories(categories)
    }

    useEffect(() => {
        fetchData()
        return () => {

        }
    }, [])
    return { dataTypes, sampleCategories }
}

export default useCache
