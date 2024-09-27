import {useContext, useEffect, useState} from 'react'
import DerivedContext from "@/context/DerivedContext";
import SenNetAccordion from "@/components/custom/layout/SenNetAccordion";
import SennetVitessce from "@/components/custom/vitessce/SennetVitessce";

function VitessceItem({ data, setShowVitessceList }) {

    const {
        initVitessceConfig,
        showVitessce,
    } = useContext(DerivedContext)

    useEffect(() => {
        initVitessceConfig(data)
        if (showVitessce) {
            setShowVitessceList(showVitessce)
        }
    }, [data])

    return (
        <SenNetAccordion className={'mb-3'} title={data?.sennet_id} id={'s' + data.uuid}><SennetVitessce data={data} /> </SenNetAccordion>
    )
}



export default VitessceItem