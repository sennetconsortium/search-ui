import React, {
    useContext,
    useEffect,
    useState,
    useRef
} from 'react'
import log from 'loglevel'
import {DataConverterNeo4J, GraphGeneric, ProvenanceUI, Legend, Toggle} from 'provenance-ui/dist/index'
import 'provenance-ui/dist/ProvenanceUI.css'
import Spinner from '../Spinner'
import {getAuth, getEntityEndPoint} from "../../../config/config";
import AppModal from "../../AppModal";
import { ArrowsAngleExpand } from "react-bootstrap-icons";
import $ from 'jquery'

function Provenance({ nodeData }) {
    const [data, setData] = useState(nodeData)
    const [options, setOptions] = useState({})
    const [loading, setLoading] = useState(true)
    const [treeData, setTreeData] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const initialized = useRef(false)

    const graphOptions = {
        idNavigate: {
            props: ["sennet:uuid", "sennet:protocol_url"],
            url: "/{classType}?uuid={id}",
            exclude: {
                'Activity': ["sennet:uuid"]
            }
        },
        colorMap: {
            "Dataset": "#8ecb93",
            "Activity": "#f16766",
            "Sample": "#ebb5c8",
            "Source": "#ffc255"
        },
        simulation: {
            charge: -300
        },
        noStyles: true,
        selectorId: 'neo4j--page'
    }

    const dataMap = {
        delimiters: {
            node: '/'
        },
        keys: {
            type: 'sennet:entity_type',
            startNode: 'prov:entity',
            endNode: 'prov:activity'
        },
        labels: {
            edge: { used: 'USED', wasGeneratedBy: 'WAS_GENERATED_BY' }
        },
        root: {
            'prov:type': 'category',
            'sennet:entity_type': 'labels',
            'sennet:uuid': 'id',
            'sennet:created_by_user_displayname': 'text',
        },
        highlight: {
            labels: 'entity_type',
            dataProp: 'sennet_id',
            visualProp: 'sennet:sennet_id'
        },
        actor: {
            dataProp: 'sennet:created_by_user_displayname',
            visualProp: 'agent'
        },
        props: ['sennet:uuid', 'sennet:sennet_id'],
        typeProps: {
            Source: ['sennet:source_type'],
            Sample: ['sennet:sample_category'],
            Activity: ['sennet:created_timestamp', 'sennet:protocol_url']
        },
        callbacks: {
            'sennet:created_timestamp': 'formatDate',
            'sennet:created_by_user_displayname': 'lastNameFirstInitial'
        }
    }

    useEffect(() => {
        if (initialized.current) return
        initialized.current = true
        const token = getAuth();
        const url = getEntityEndPoint() + 'entities/{id}/provenance?return_descendants=true'
        const itemId = data.uuid;
        const graphOps = {token, url, keys: {neighbors: 'direct_ancestors'}}

        log.debug('Result from fetch', data)

        const getNeighbors = (node) => {
            let neighbors = node[graphOps.keys.neighbors]
            if (!neighbors) {
                neighbors = node['direct_ancestor'] ? [node['direct_ancestor']] : []
            }
            return neighbors
        }

        const handleResult = async (result) => {
            log.debug(`Result from fetch`, result)
            let keys = ['used', 'wasGeneratedBy']
            let hasDescendants = false
            for (let key of keys) {
                if (result.descendants) {
                    for (let _prop in result.descendants[key]) {
                        result[key] = result[key] || {}
                        hasDescendants = true
                        // Must update key to avoid key collisions with original result.used and result.wasGeneratedBy
                        result[key][`des${_prop}`] = result.descendants[key][_prop]
                    }
                }

            }
            if (result.descendants) {
                $.extend(result.activity, result.descendants.activity)
                $.extend(result.entity, result.descendants.entity)
                log.debug(`Result width appended descendants...`, result)
            }

            const converter = new DataConverterNeo4J(result, dataMap)
            converter.hierarchy(itemId, hasDescendants)
            log.debug('Converter details...', converter)

            const ops = {...graphOptions, highlight: [{id: itemId}]}


            log.debug('Options', ops)
            setOptions(ops)
            setTreeData({stratify: converter.result})
            setLoading(false)
        }

        if (token.length && url.length && itemId.length) {
            const graph = new GraphGeneric(graphOps)
            graph.service({ callback: handleResult, url: url.replace('{id}', itemId) })
        }
    }, [data])

    const handleModal = (e) => {
        setShowModal(!showModal)
    }

    const toggleData = (hideActivity) => {
        const ui = window.ProvenanceTreeD3
        ui.toggleData({filter: hideActivity ? 'Activity' : '', parentKey: hideActivity ? DataConverterNeo4J.KEY_P_ENTITY : DataConverterNeo4J.KEY_P_ACT})
    }

    return (
        <div className='sui-result provenance--portal-ui' id='Provenance'>
            <div className='sui-result__header'>
                <span className='sui-result__title'>
                    Provenance
                </span>
                <button className='btn pull-right btn--fullView' onClick={handleModal} arial-label='Full view' title='Full view'>
                    <ArrowsAngleExpand />
                </button>
            </div>

            <div className='card-body'>

                {!loading && <ProvenanceUI options={options} data={treeData}/>}
                {!loading && <Legend colorMap={graphOptions.colorMap} />}
                { !loading && data && <Toggle data={data} context={ toggleData } /> }
                {loading && <Spinner/>}
                <AppModal showModal={showModal} handleClose={handleModal} showCloseButton={true} showHomeButton={false} modalTitle='Provenance' modalSize='xl' className='modal-full'>
                    {!loading && <ProvenanceUI options={{...options, selectorId: 'neo4j--modal'}} data={treeData} />}
                    {!loading && <Legend colorMap={graphOptions.colorMap} />}
                    { !loading && data && <Toggle data={data} context={ toggleData } /> }
                </AppModal>
            </div>
        </div>
    )
}

export default Provenance
