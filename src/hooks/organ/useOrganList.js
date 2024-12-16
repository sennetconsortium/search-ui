import { organs } from '@/config/organs'
import { getDatasetQuantities } from '@/lib/services'
import { useEffect, useState } from 'react'

const useOrganList = () => {
    const [organList, setOrganList] = useState(organs)

    useEffect(() => {
        const getDatasetQtys = async () => {
            const datasetQtys = await getDatasetQuantities()
            if (!datasetQtys) {
                return
            }

            const newOrgans = organs.map((organ) => {
                let qty = 0
                for (const code of organ.codes) {
                    qty += datasetQtys[code] || 0
                }

                return {
                    ...organ,
                    datasetQty: qty
                }
            })
            setOrganList(newOrgans)
        }

        getDatasetQtys()
    }, [])

    return { organList }
}

export default useOrganList
