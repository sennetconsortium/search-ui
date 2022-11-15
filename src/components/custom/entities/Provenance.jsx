import React, {
    useContext,
    useEffect,
    useState,
    useRef
} from 'react'
import log from 'loglevel'
import {DataGraph, NeoGraph, DataConverter, ProvenanceUI, Legend} from 'provenance-ui/dist/index'
import 'provenance-ui/dist/ProvenanceUI.css'
import Spinner from '../Spinner'
import {getAuth} from "../../../config/config";
import AppModal from "../../AppModal";
import { ArrowsAngleExpand } from "react-bootstrap-icons";

function Provenance({ nodeData }) {
    const [data, setData] = useState(nodeData)
    const [options, setOptions] = useState({})
    const [loading, setLoading] = useState(true)
    const [neo4j, setNeo4jData] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const initialized = useRef(false)

    const graphOptions = {
        idNavigate: {
            prop: "uuid",
            url: "/{classType}?uuid=",
            exclude: ['Activity']
        },
        colorMap: {
            "Dataset": "#8ecb93",
            "Activity": "#f16766",
            "Sample": "#ebb5c8",
            "Source": "#ffc255"
        },
        noStyles: true,
        selectorId: 'neo4j--page'
    }

    const dataMap = {
        root: {
            entity_type: 'labels',
            uuid: 'id',
            created_by_user_displayname: 'text',
        },
        highlight: {
            labels: 'entity_type',
            prop: 'sennet_id'
        },
        actor: {
            dataProp: 'created_by_user_displayname',
            visualProp: 'researcher'
        },
        props: ['uuid', 'sennet_id'],
        typeProps: {
            Source: ['source_type'],
            Sample: ['sample_category'],
            Activity: ['created_timestamp']
        },
        callbacks: {
            created_timestamp: 'formatDate',
            created_by_user_displayname: 'lastNameFirstInitial'
        }
    }

    useEffect(() => {
        if (initialized.current) return
        initialized.current = true
        const graphOps = {token: getAuth(), url: '/api/find?uuid=', keys: {neighbors: 'direct_ancestors'}}
        const rawData = data.descendants ? (!data.descendants.length ? data : data.descendants) : data

        log.debug('Result from fetch', data)
        log.debug('Raw data', rawData)

        const getNeighbors = (node) => {
            let neighbors = node[graphOps.keys.neighbors]
            if (!neighbors) {
                neighbors = node['direct_ancestor'] ? [node['direct_ancestor']] : []
            }
            return neighbors
        }

        const onDataAcquired = (dataGraph) => {
            log.debug('DataGraph', dataGraph.list)

            // Traverse graph data and create graph properties
            const neoGraph = new NeoGraph({...graphOps, getNeighbors, list: dataGraph.list})
            neoGraph.dfs(rawData)
            log.debug('NeoGraph', neoGraph.getResult())

            // Convert the data into a format usable by the graph visual, i.e. neo4j format
            const converter = new DataConverter(neoGraph.getResult(), dataMap, dataGraph.list)
            converter.reformatNodes()
            converter.reformatRelationships()

            const neoData = converter.getNeo4jFormat({
                columns: ['user', 'entity'],
                nodes: converter.getNodes(),
                relationships: converter.getRelationships()
            })

            log.debug('NeoData for graph visual ...', neoData)

            const neighbors = getNeighbors(data)
            let highlight = [{
                class: data[dataMap.highlight.labels],
                property: dataMap.highlight.prop,
                value: data[dataMap.highlight.prop]
            }]
            for (let n of neighbors) {
                highlight.push({
                    class: n[dataMap.highlight.labels],
                    property: dataMap.highlight.prop,
                    isSecondary: true,
                    value: n[dataMap.highlight.prop]
                })
            }

            const ops = {...graphOptions, highlight}
            setOptions(ops)
            log.debug('Options', ops)
            setNeo4jData(neoData)
            setLoading(false)
        }

        // Traverse the data and fetch all neighbors for each node.
        const dataGraph = new DataGraph({...graphOps, getNeighbors, onDataAcquired})
        dataGraph.dfsWithPromise(rawData)
    }, [data])

    const handleModal = (e) => {
        setShowModal(!showModal)
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

                {!loading && <ProvenanceUI options={options} data={neo4j}/>}
                {!loading && <Legend colorMap={graphOptions.colorMap} />}
                {loading && <Spinner/>}
                <AppModal showModal={showModal} handleClose={handleModal} showCloseButton={true} showHomeButton={false} modalTitle='Provenance' modalSize='xl' className='modal-full'>
                    {!loading && <ProvenanceUI options={{...options, selectorId: 'neo4j--modal'}} data={neo4j} />}
                    {!loading && <Legend colorMap={graphOptions.colorMap} />}
                </AppModal>
            </div>
        </div>
    )
}

export default Provenance
