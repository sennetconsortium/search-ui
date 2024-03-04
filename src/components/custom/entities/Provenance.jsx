import React, {useEffect, useRef, useState, useContext} from 'react'
import log from 'loglevel'
import {DataConverterNeo4J, GraphGeneric, ProvenanceUI, Legend} from 'provenance-ui/dist/index'
import 'provenance-ui/dist/ProvenanceUI.css'
import Spinner from '../Spinner'
import {getAuth, getEntityEndPoint} from "../../../config/config";
import AppModal from "../../AppModal";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import $ from 'jquery'
import AppContext from "../../../context/AppContext";
import Lineage from "./sample/Lineage";
import {fetchEntity, fetchProtocols, getClickableLink, getUBKGFullName} from "../js/functions";
import SenNetAccordion from "../layout/SenNetAccordion";
import * as d3 from "d3";


function Provenance({nodeData}) {
    const [data, setData] = useState(nodeData)
    const [ancestors, setAncestors] = useState(null)
    const [descendants, setDescendants] = useState(null)
    const [options, setOptions] = useState({})
    const [loading, setLoading] = useState(true)
    const [treeData, setTreeData] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [maxGraphWidth, setMaxGraphWidth] = useState('500px')
    const initialized = useRef(false)
    const activityHidden = useRef(true)
    const svgTranslate = useRef({})
    const protocolsData = {}
    const { _t } = useContext(AppContext)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    let cbTimeout;

    const canvas = (ops) => $(`#${ops.options.selectorId}`)

    const onCenterX = (ops) => {
        const w = canvas(ops).width()
        return w / 2.4
    }

    const onAfterBuild = (ops) => {
        const ui = window.ProvenanceTreeD3[ops.options.selectorId]
        if (ui) {
            ui.enableZoom()
        }

        let hidden = activityHidden.current
        // Fine tune a bit based on graph size and UI viewport area
        const x1 = 50
        const x2 = 300
        if (ops.data.treeWidth > 6) {
            if (svgTranslate.current[hidden] === undefined) {
                // Set some positions to move the graph based on visibility of activity nodes
                svgTranslate.current[hidden] = hidden ? ops.data.treeWidth * 23 : ops.data.sz.height / 2.2
            }
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
        onInitializationComplete(ops.options.selectorId)
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

    const onInitializationComplete = (selectorId) => {
        clearTimeout(cbTimeout)
        cbTimeout = setTimeout(()=>{
            const ui = window.ProvenanceTreeD3[selectorId]
            d3.select(`#${selectorId} #node--${data.uuid}`).dispatch('click')
            ui.disableZoom()
        }, 1000)
    }

    const removeActiveOnContextNode = (ops) => $(`#${ops.options.selectorId} .node`).removeClass('is-active')

    const onNodeClick = (ops) => {
        // Coupled with Metadata.triggerNode
        const id = ops.args.node.data['sennet:sennet_id']
        const $el = document.querySelector(`[data-rr-ui-event-key="${id.trim()}"]`)

        if (!ops.args.event.detail?.metadata) {
            removeActiveOnContextNode(ops)
        }
        canvas(ops).find(`#node--${ops.args.node.data.id}`).addClass('is-active')
        //Only re-trigger another click if this click wasn't from a metadata btn click
        if ($el && !ops.args.event.detail?.metadata) {
            $el.click()
        }
    }
    const onInfoCloseClick = (ops) => {
        const treeId = ops.options.selectorId
        const uuid = $('#Metadata-collapse .nav-item .active').attr('data-uuid')
        const $el = $(`#${treeId} #node--${uuid}`)
        const nodeActiveUuid = $(`#${treeId} .node.is-active`).attr('id').split('--')[1]
        if (uuid !== nodeActiveUuid) {
            removeActiveOnContextNode(ops)
        }
        if (!$el.hasClass('is-active')) {
            $el.removeClass('is-active')
        }
    }

    const buildProtocolData = async (data) => {
        for (let current in data.activity) {
            let d = data.activity[current]
            if (d['sennet:protocol_url']) {
                let url = getClickableLink(d['sennet:protocol_url'])
                d['sennet:protocol_url'] = url
                const uuid = d['sennet:uuid']

                protocolsData[url] =  await fetchProtocols(url)
                if (protocolsData[url]?.title) {
                    $(`[data-id="${uuid}"] .protocol_url a`).html(protocolsData[url]?.title)
                }
            }
        }
    }

    const jsonView = (d, property, value) => {
        return {href: `/api/json?view=${btoa(value.replaceAll("'", '"'))}`, value: `${value.substr(0, 20)}...}`}
    }

    const protocolUrl = (d, property, value) => {
        let data = protocolsData[value]
        let title = data ? data.title : value
        return {href: value, value: title}
    }

    const graphOptions = {
        idNavigate: {
            props: {'sennet:sennet_id': true, 'sennet:protocol_url': {callback: protocolUrl}, 'sennet:processing_information': {callback: jsonView}},
            url: '/{subType}?uuid={id}',
            exclude: {
                'Activity': ['sennet:sennet_id']
            }
        },
        colorMap: {
            Source: '#ffc255',
            Sample:  '#ebb5c8',
            Dataset: '#8ecb93',
            Activity: '#f16766'
        },
        propertyMap: {
            'sennet:created_by_user_displayname': 'agent'
        },
        imageMap: {
            "Sample|sennet:sample_category|Organ": null,
            "Sample|sennet:sample_category|Block": null,
            "Sample|sennet:sample_category|Section": null,
        },
        imageMapActions: {
            "Sample|sennet:sample_category|Organ": {
                fn: 'append',
                type: 'g',
                data: [
                    {
                        draw: 'm16.41,32.84C10.96,27.39,5.48,21.9,0,16.43,5.48,10.95,10.96,5.46,16.43,0c5.46,5.46,10.95,10.95,16.41,16.41-5.45,5.45-10.95,10.95-16.43,16.43Z'
                    }
                ]
            },
            "Sample|sennet:sample_category|Block": {
                type: 'rect',
                height: 28,
                width: 28
            },
            "Sample|sennet:sample_category|Section": {
                type: 'rect',
                height: 25,
                width: 50
            }
        },
        zoomActivated: true,
        visitedNodes: new Set(),
        initParentKey: DataConverterNeo4J.KEY_P_ENTITY,
        displayEdgeLabels: false,
        minHeight: 100,
        noStyles: true,
        propertyPrefixClear: 'sennet:',
        selectorId: 'neo4j--page',
        callbacks: {
            onCenterX,
            onInitializationComplete,
            onAfterBuild,
            onSvgSizing,
            onNodeClick,
            onInfoCloseClick
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
            Sample: ['sennet:sample_category', 'sennet:organ'],
            Dataset: ['sennet:title'],
            Activity: ['sennet:created_timestamp', 'sennet:protocol_url', 'sennet:processing_information', 'sennet:created_by_user_displayname']
        },
        callbacks: {
            'sennet:created_timestamp': 'formatDate',
            'sennet:organ': getUBKGFullName
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

        const setContainerSize = () => setMaxGraphWidth((window.outerWidth - 200) + 'px')
        window.onresize = () =>  setContainerSize()
        setContainerSize()

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

            await buildProtocolData(result)

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

    const legend = {
        ...options.colorMap,
        Edge: '#a5abb6',
    }

    const otherLegend = {
        Expand: {
            icon: 'fa-expand',
            callback: handleModal,
            title: 'Show graph in full view'
        }
    }

    return (
        <SenNetAccordion title={'Provenance'}>
            <Tabs
                defaultActiveKey="graph"
                className="mb-3"
                variant="pills"
            >
                <Tab eventKey="graph" title="Graph" >
                    {!loading && <div style={{maxWidth: maxGraphWidth}}><ProvenanceUI options={options} data={treeData}/></div>}
                    {!loading && <Legend colorMap={legend} className='c-legend--flex c-legend--btns' help={help} actionMap={actionMap} selectorId={options.selectorId} otherLegend={otherLegend} />}
                    {loading && <Spinner/>}
                    <AppModal showModal={showModal} handleClose={handleModal} showCloseButton={true} showHomeButton={false} modalTitle='Provenance' modalSize='xl' className='modal-full'>
                        {!loading && <ProvenanceUI options={{...options, selectorId: modalId, minHeight: 105 }} data={treeData} />}
                        {!loading && <Legend colorMap={legend} className='c-legend--flex c-legend--btns' help={help} actionMap={actionMap} selectorId={modalId} />}
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
        </SenNetAccordion>
    )
}

export default Provenance