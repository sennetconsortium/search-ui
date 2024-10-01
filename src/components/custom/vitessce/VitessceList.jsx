import {useEffect, useRef, useState} from 'react'
import VitessceItem from "@/components/custom/vitessce/VitessceItem";
import {eq} from "@/components/custom/js/functions";
import {getAncestryData} from "@/lib/services";
import {DerivedProvider} from "@/context/DerivedContext";

function VitessceList({data, showVitessceList, setShowVitessceList}) {
    const [list, setList] = useState([])

    const loadData = async () => {
        let res = []
        if (data && data.ancestors) {
            for (let d of data.ancestors) {
                if (eq(d.entity_type, 'dataset')) {
                    const ancestry = await getAncestryData(d.uuid)
                    Object.assign(d, ancestry)
                    res.push(
                        <div key={d.sennet_id}>
                            <VitessceItem data={d} />
                        </div>
                   )
                }
            }
        }
        setList(res)
    }

    useEffect(() => {
        loadData()
    }, [data?.ancestors])


    return (
        <DerivedProvider showVitessceList={showVitessceList} setShowVitessceList={setShowVitessceList}>{list}</DerivedProvider>
    )
}


export default VitessceList