import React, {
    useContext,
    useEffect,
    useState,
    useCallback,
    memo
} from 'react'
import log from 'loglevel'
import { Graph, DataConverter, ProvenanceUI } from 'provenance-ui/dist/index'
import 'provenance-ui/dist/ProvenanceUI.css'
import Spinner from '../Spinner'

const Provenance = memo(({ rawData }) => {
    const [data, setData] = useState(rawData)
    const [loaded, setLoaded] = useState(false)
    const [neo4j, setNeo4jData] = useState(null)
    const [highlight, setHighlight] = useState([])

    const dataMap = {
        root: {
            entity_type: 'labels',
            uuid: 'id',
            created_by_user_displayname: 'text'
        },
        properties: ['uuid', 'sennet_id'],
        typeProperties: {
            Source: ['source_type'],
            Sample: ['sample_category'],
            Activity: ['created_timestamp', 'created_by_user_displayname']
        },
        callbacks: {
            created_timestamp: 'formatDate'
        }
    }

    useEffect(() => {
        log.debug('Beginning Provenance UI...')
        let graph = new Graph()
        graph.dfs(data)
        log.debug('Graph nodes', graph.getResult())
        let converter = new DataConverter(graph.getResult(), dataMap)
        converter.reformatNodes()
        converter.reformatRelationships()
        const h = [converter.getRootAsHighlight('sennet_id')]
        setHighlight(h)
        const neo = converter.getNeo4jFormat({
            columns: ['user', 'entity'],
            nodes: converter.getNodes(),
            relationships: converter.getRelationships()
        })
        setNeo4jData(neo)
        setLoaded(true)
        log.debug('Neo4J formatted', neo)
        log.debug('Ended Provenance UI.')
    }, [data])

    return (
        <li className='sui-result' id='Provenance'>
            <div className='sui-result__header'>
                <span className='sui-result__title'>
                    Provenance
                </span>
            </div>

            <div className='card-body'>
                {/*{loaded && <ProvenanceUI  />}*/}
                {loaded && <ProvenanceUI ops={{ highlight, noStyles: true }} data={neo4j}/>}
                {!loaded && <Spinner />}
            </div>
        </li>
    )
})

export default Provenance
