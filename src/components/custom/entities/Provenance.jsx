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

    const canvas = (ops) => $(`#${ops.options.selectorId}`)

    const onCenterX = (ops) => {
        const w = canvas(ops).width()
        return  w / 2.4
    }

    const getTreeWidth = (ops) => {
        const list = {}
        let max = 1
        for (let n of ops.data.stratify) {
            let id = n.activityAsParent
            list[id] = ++list[id] || 1
            max = Math.max(list[id], max)
        }
        log.debug('Tree width', max)
        return max
    }

    const onSvgSizing = (ops) => {
        let { margin } = ops.args
        const sz = {}
        sz.width = canvas(ops).width() - margin.right - margin.left
        const treeWidth = getTreeWidth(ops)
        sz.height = ops.options.minHeight * (treeWidth < 2 ? 3 : Math.max(treeWidth, 5) ) - margin.top - margin.bottom
        return sz
    }

    const graphOptions = {
        idNavigate: {
            props: ["sennet:uuid", "sennet:protocol_url"],
            url: "/{subType}?uuid={id}",
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
        displayEdgeLabels: true,
        minHeight: 100,
        noStyles: true,
        selectorId: 'neo4j--page',
        callbacks: {
            onCenterX,
            onSvgSizing
        }
    }

    const dataMap = {
        delimiter: '/',
        labels: {
            edge: { used: 'USED', wasGeneratedBy: 'WAS_GENERATED_BY' }
        },
        root: {
            id: 'sennet:uuid',
            type: 'prov:type',
            subType: 'sennet:entity_type'
        },
        props: ['sennet:uuid', 'sennet:sennet_id'],
        typeProps: {
            Source: ['sennet:source_type'],
            Sample: ['sennet:sample_category'],
            Activity: ['sennet:created_timestamp', 'sennet:protocol_url', 'sennet:created_by_user_displayname']
        },
        callbacks: {
            'sennet:created_timestamp': 'formatDate'
        }
    }

    useEffect(() => {
        if (initialized.current) return
        initialized.current = true
        const token = getAuth();
        const url = getEntityEndPoint() + 'entities/{id}/provenance?return_descendants=true'
        const itemId = data.uuid;
        const graphOps = {token, url}

        log.debug('Result from fetch', data)

        const handleResult = async (result) => {
            log.debug(`Result from fetch`, result)
            let keys = ['used', 'wasGeneratedBy']
            for (let key of keys) {
                if (result.descendants) {
                    for (let _prop in result.descendants[key]) {
                        result[key] = result[key] || {}
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
            converter.buildAdjacencyList(itemId)
            log.debug('Converter details...', converter)

            const ops = {...graphOptions, highlight: [{id: itemId}]}

            log.debug('Options', ops)
            setOptions(ops)
            setTreeData({stratify: converter.result})
            setLoading(false)
        }

        if (url.length && itemId.length) {
            const graph = new GraphGeneric(graphOps)
            graph.service({ callback: handleResult, url: url.replace('{id}', itemId) })
        }
    }, [data])

    const handleModal = (e) => {
        setShowModal(!showModal)
    }

    const toggleData = (e, hideActivity, selectorId) => {
        const ui = window.ProvenanceTreeD3[selectorId]
        ui.toggleData({filter: hideActivity ? 'Activity' : '', parentKey: hideActivity ? DataConverterNeo4J.KEY_P_ENTITY : DataConverterNeo4J.KEY_P_ACT})
    }

    const toggleEdgeLabels = (e, hideActivity, selectorId) => {
        const ui = window.ProvenanceTreeD3[selectorId]
        ui.toggleEdgeLabels()
    }

    const actionMap = {
        Activity: {
            callback: toggleData,
            className: 'c-toggle--eye',
            ariaLabel: 'Toggle Activity Nodes'
        },
        Edge: {
            callback: toggleEdgeLabels,
            className: 'c-toggle--eye',
            ariaLabel: 'Toggle Edge Labels'
        }
    }

    const modalId = 'neo4j--modal'

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
                {!loading && <Legend colorMap={{...options.colorMap, Edge: '#a5abb6'}} actionMap={actionMap} selectorId={options.selectorId}/>}
                {loading && <Spinner/>}
                <AppModal showModal={showModal} handleClose={handleModal} showCloseButton={true} showHomeButton={false} modalTitle='Provenance' modalSize='xl' className='modal-full'>
                    {!loading && <ProvenanceUI options={{...options, selectorId: modalId, minHeight: 105 }} data={treeData} />}
                    {!loading && <Legend colorMap={{...options.colorMap, Edge: '#a5abb6'}} actionMap={actionMap} selectorId={modalId} />}
                </AppModal>
            </div>
        </div>
    )
}

export default Provenance
