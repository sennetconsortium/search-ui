import {useContext, useEffect, useState} from 'react'
import DerivedContext from "@/context/DerivedContext";
import SennetVitessce from "@/components/custom/vitessce/SennetVitessce";

function VitessceItem({ data}) {

    const {
        initVitessceConfig,
    } = useContext(DerivedContext)

    useEffect(() => {
        initVitessceConfig(data)
    }, [data])

    return (
        <SennetVitessce title={data.sennet_id} id={'s' + data.uuid} className={'mb-3'} />
    )
}

export default VitessceItem