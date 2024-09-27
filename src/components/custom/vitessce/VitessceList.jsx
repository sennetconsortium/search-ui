import {useContext, useEffect, useState} from 'react'
import VitessceItem from "@/components/custom/vitessce/VitessceItem";
import {eq} from "@/components/custom/js/functions";

function VitessceList({data, setShowVitessceList}) {
    const [list, setList] = useState([])
    useEffect(() => {
        let res = []
        if (data && data.ancestors) {
            for (let d of data.ancestors) {
                if (eq(d.entity_type, 'dataset')) {
                    res.push(<div key={d.sennet_id}><VitessceItem data={d} setShowVitessceList={setShowVitessceList} /></div>)
                }
            }
        }
        setList(res)
    }, [data?.ancestors])

    useEffect(() => {
    }, [])


    return (
        <div className={`c-VitessceList`}>{list}</div>
    )
}


export default VitessceList