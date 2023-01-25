import React, {useEffect, useRef, useState} from 'react'
import log from 'loglevel'
import {DataConverterNeo4J, GraphGeneric, ProvenanceUI, Legend} from 'provenance-ui/dist/index'
import 'provenance-ui/dist/ProvenanceUI.css'
import Spinner from '../Spinner'
import {getAuth, getEntityEndPoint} from "../../../config/config";
import AppModal from "../../AppModal";
import {ArrowsAngleExpand} from "react-bootstrap-icons";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import $ from 'jquery'
import AppContext from "../../../context/AppContext";
import Lineage from "./sample/Lineage";
import {fetchEntity} from "../js/functions";


function Provenance({nodeData}) {
    const [data, setData] = useState(nodeData)
    const [ancestors, setAncestors] = useState(null)
    const [descendants, setDescendants] = useState(null)
    const [options, setOptions] = useState({})
    const [loading, setLoading] = useState(true)
    const [treeData, setTreeData] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const initialized = useRef(false)
    const activityHidden = useRef(true)
    const svgTranslate = useRef({})
    const { _t } = useContext(AppContext)

    const canvas = (ops) => $(`#${ops.options.selectorId}`)

    const onCenterX = (ops) => {
        const w = canvas(ops).width()
        return w / 2.4
    }

    const onAfterBuild = (ops) => {
        let hidden = activityHidden.current
        // Fine tune a bit based on graph size and UI viewport area
        if (ops.data.treeWidth > 6) {
            if (svgTranslate.current[hidden] === undefined) {
                // Set some positions to move the graph based on visibility of activity nodes
                svgTranslate.current[hidden] = hidden ? ops.data.treeWidth * 23 : ops.data.sz.height / 2.2
            }
            const x1 = 50
            const x2 = 300
            if (svgTranslate.current[!hidden] !== undefined) {
                // Move the graph back
                ops.$el.svg.call(ops.options.zoom.translateBy, !hidden ? -x1 : -x2, -1 * svgTranslate.current[!hidden])
            }
            // Move into new position after toggle
            ops.$el.svg.transition().call(ops.options.zoom.translateBy, hidden ? x1 : x2, svgTranslate.current[hidden])

        } else if (ops.data.treeWidth > 3) {
            // Nudge a bit for better positioning
            ops.$el.svg.transition().call(ops.options.zoom.translateBy, -7, -x1)
        }
        canvas(ops).find('svg').css('opacity', 1)
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
        ops.data.treeWidth = max
        return max
    }

    const onSvgSizing = (ops) => {
        let {margin} = ops.args
        const sz = {}
        sz.width = canvas(ops).width() - margin.right - margin.left
        const treeWidth = getTreeWidth(ops)
        sz.height = ops.options.minHeight * (treeWidth < 2 ? 3 : Math.max(treeWidth, 5) ) - margin.top - margin.bottom
        ops.data.sz = JSON.parse(JSON.stringify(sz))
        if (sz.height > 500) {
            sz.height = 500
        }
        return sz
    }

    const graphOptions = {
        idNavigate: {
            props: ['sennet:sennet_id', 'sennet:protocol_url'],
            url: '/{subType}?uuid={id}',
            exclude: {
                'Activity': ['sennet:sennet_id']
            }
        },
        colorMap: {
            Dataset: '#8ecb93',
            Activity: '#f16766',
            Sample:  '#ebb5c8',
            Source: '#ffc255'
        },
        propertyMap: {
            'sennet:created_by_user_displayname': 'agent'
        },
        imageMap: {
            "Sample|sennet:sample_category|organ": null,
            "Sample|sennet:sample_category|block": null,
            "Sample|sennet:sample_category|section": null,
        },
        imageMapActions: {
            "Sample|sennet:sample_category|organ": {
                fn: 'append',
                type: 'g',
                data: [
                    {
                        draw: 'm16.41,32.84C10.96,27.39,5.48,21.9,0,16.43,5.48,10.95,10.96,5.46,16.43,0c5.46,5.46,10.95,10.95,16.41,16.41-5.45,5.45-10.95,10.95-16.43,16.43Z'
                    }
                ]
            },
            "Sample|sennet:sample_category|block": {
                type: 'rect',
                height: 28,
                width: 28
            },
            "Sample|sennet:sample_category|section": {
                type: 'rect',
                height: 25,
                width: 50
            }
        },
        visitedNodes: new Set(),
        initParentKey: DataConverterNeo4J.KEY_P_ENTITY,
        displayEdgeLabels: false,
        minHeight: 100,
        noStyles: true,
        propertyPrefixClear: 'sennet:',
        selectorId: 'neo4j--page',
        callbacks: {
            onCenterX,
            onAfterBuild,
            onSvgSizing
        }
    }

    const dataMap = {
        delimiter: '/',
        labels: {
            edge: {used: 'USED', wasGeneratedBy: 'WAS_GENERATED_BY'}
        },
        root: {
            id: 'sennet:uuid',
            type: 'prov:type',
            subType: 'sennet:entity_type'
        },
        props: ['sennet:sennet_id'],
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
        async function fetchLineage (ancestors, fetch) {
            let new_ancestors = []
            for (const ancestor of ancestors) {
                let complete_ancestor = await fetchEntity(ancestor.uuid);
                if (complete_ancestor.hasOwnProperty("error")) {
                    setError(true)
                    setErrorMessage(complete_ancestor["error"])
                } else {
                    new_ancestors.push(complete_ancestor)
                }
            }
            fetch(new_ancestors)
        }

        if (nodeData.hasOwnProperty("descendants")) {
            fetchLineage(data.descendants, setDescendants);
        }
        if (nodeData.hasOwnProperty("ancestors")) {
            fetchLineage(data.ancestors, setAncestors);
        }

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
            graph.service({callback: handleResult, url: url.replace('{id}', itemId)})
        }
    }, [data])

    const handleModal = (e) => {
        setShowModal(!showModal)
    }

    const toggleData = (e, hideActivity, selectorId) => {
        const ui = window.ProvenanceTreeD3[selectorId]
        log.debug('activity', hideActivity)
        activityHidden.current = hideActivity
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
            ariaLabel: 'Toggle Activity Nodes',
            disabled: true
        },
        Edge: {
            callback: toggleEdgeLabels,
            className: 'c-toggle--eye',
            ariaLabel: 'Toggle Edge Labels',
            visible: false
        }
    }

    const modalId = 'neo4j--modal'

    const help = {
        title: 'Help, Provenance Graph',
        legend: `<li><code>Sample</code> shapes <span class="shape pink shape--diamond">diamond</span>, <span class="shape pink shape--sq">square</span>, 
                    <span class="shape pink shape--rect">rectangle</span> and <span class="shape pink shape--circle">ellipse</span> correspond to <code>sample_category</code>  of
                <code>organ</code>, <code>block</code>, <code>section</code> and <code>suspension</code> respectively.</li>`
    }

    return (
        <div className="accordion accordion-flush sui-result" id="Provenance">
            <div className="accordion-item ">
                <div className="accordion-header">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse"
                            data-bs-target="#provenance-collapse" aria-expanded="true"
                            aria-controls="provenance-collapse">Provenance

                    </button>
                </div>
                <div id="provenance-collapse" className="accordion-collapse collapse show">
                    <button className='btn pull-right btn--fullView' onClick={handleModal} arial-label='Full view'
                            title='Full view'>
                        <ArrowsAngleExpand/>
                    </button>
                    <div className="accordion-body">
                        <Tabs
                            defaultActiveKey="graph"
                            className="mb-3"
                            fill
                        >
                            <Tab eventKey="graph" title="Graph">
                                {!loading && <ProvenanceUI options={options} data={treeData}/>}
                                {!loading && <Legend colorMap={{...options.colorMap, Edge: '#a5abb6'}} className='c-legend--flex c-legend--btns' help={help} actionMap={actionMap} selectorId={options.selectorId}/>}
                                {loading && <Spinner/>}
                                <AppModal showModal={showModal} handleClose={handleModal} showCloseButton={true} showHomeButton={false} modalTitle='Provenance' modalSize='xl' className='modal-full'>
                                    {!loading && <ProvenanceUI options={{...options, selectorId: modalId, minHeight: 105 }} data={treeData} />}
                                    {!loading && <Legend colorMap={{...options.colorMap, Edge: '#a5abb6'}} className='c-legend--flex c-legend--btns' help={help} actionMap={actionMap} selectorId={modalId} />}
                                </AppModal>
                            </Tab>
                            {ancestors && ancestors.length > 0 &&
                                <Tab eventKey="ancestor" title="Ancestors">
                                    <Lineage lineage={ancestors}/>
                                </Tab>
                            }
                            {descendants && descendants.length > 0 &&
                                <Tab eventKey="descendant" title="Descendants">
                                    <Lineage lineage={descendants}/>
                                </Tab>
                            }
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Provenance
