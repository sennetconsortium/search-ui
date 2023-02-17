import { useEffect, useState } from 'react'
import {get_data_assays, get_sample_categories} from '../lib/ontology'

function useCache() {
    const [dataTypes, setDataTypes] = useState({})
    const [sampleCategories, setSampleCategories] = useState({})

    useEffect(() => {
        setDataTypes(get_data_assays())
        setSampleCategories(get_sample_categories())
        return () => {

        }
    }, [])
    return { dataTypes, sampleCategories }
}

export default useCache
