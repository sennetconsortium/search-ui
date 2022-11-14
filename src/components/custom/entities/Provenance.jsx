import React, {
    useContext,
    useEffect,
    useState,
    useCallback,
    memo
} from 'react'
import log from 'loglevel'
import {DataGraph, NeoGraph, DataConverter, ProvenanceUI, Legend} from 'provenance-ui/dist/index'
import 'provenance-ui/dist/ProvenanceUI.css'
import Spinner from '../Spinner'
import {getAuth} from "../../../config/config";

const Provenance = memo(({ nodeData }) => {
    const [data, setData] = useState(nodeData)
    const [options, setOptions] = useState({})
    const [loading, setLoading] = useState(true)
    const [neo4j, setNeo4jData] = useState(null)
    const [highlight, setHighlight] = useState([])

    const graphOptions = {
        idNavigate: {
            prop: "uuid",
            url: "/{classType}?uuid="
        },
        colorMap: {
            "Dataset": "#8ecb93",
            "Activity": "#f16766",
            "Sample": "#ebb5c8",
            "Source": "#ffc255"
        },
        noStyles: true
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
            const converter = new DataConverter(neoGraph.getResult(), dataMap)
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

    return (
        <li className='sui-result' id='Provenance'>
            <div className='sui-result__header'>
                <span className='sui-result__title'>
                    Provenance
                </span>
            </div>

            <div className='card-body'>

                {!loading && <ProvenanceUI ops={options} data={neo4j}/>}
                {!loading && <Legend colorMap={graphOptions.colorMap} />}
                {loading && <Spinner/>}
            </div>
        </li>
    )
})

export default Provenance
