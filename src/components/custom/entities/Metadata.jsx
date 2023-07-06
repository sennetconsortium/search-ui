import React, {useContext} from "react";
import SenNetPopover from "../../SenNetPopover";
import {displayBodyHeader, equals} from "../js/functions";
import SenNetAccordion from "../layout/SenNetAccordion";
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import AppContext from "../../../context/AppContext";
import MetadataTable from "./MetadataTable";
import PropTypes from "prop-types";
import * as d3 from "d3";
import $ from 'jquery'

function Metadata({data, metadata, hasLineageMetadata = false}) {
    const {cache} = useContext(AppContext)

    const triggerNode = (e, uuid) => {
        $('.node').removeClass('is-active')
        const id = `#node--${uuid}`
        $(id).addClass('is-active')
        d3.select(id).dispatch('click', {detail: {metadata: true}})
    }
    const popoverCommon = (index, entity, data) => {
        return (
            <SenNetPopover key={`sennet-popover-${entity}-${index}`} className={`${index}-${entity}-metadata`}
                           text={<>View the metadata for the ancestor <code>{cache.entities[entity]}</code> of this
                               entity.</>}>
                <Nav.Item>
                    <Nav.Link onClick={(e) => triggerNode(e, data.uuid)} data-uuid={data.uuid} eventKey={data.sennet_id}
                              bsPrefix={`btn btn-${entity} rounded-0`}>{data.sennet_id}</Nav.Link>
                </Nav.Item>
            </SenNetPopover>
        )
    }

    const tabPaneCommon = (pre, index, data, metadata) => {
        return (
            <Tab.Pane key={`tabpane-${pre}-${index}`} eventKey={data.sennet_id}>
                <MetadataTable metadataKey={""} data={data}
                               metadata={metadata}
                               filename={data.sennet_id}/>
            </Tab.Pane>
        )
    }

    return (
        <SenNetAccordion title={'Metadata'}>
            {hasLineageMetadata ? (
                    <Tab.Container defaultActiveKey={data.sennet_id}>
                        <Nav variant="pills" className={"mb-3 flex-nowrap overflow-auto"}>
                            {/*Create metadata table for current entity*/}
                            {!!(metadata && Object.keys(metadata).length) &&
                                <SenNetPopover className={"current-metadata"}
                                               text={<>View the metadata for this entity.</>}>
                                    <Nav.Item>
                                        <Nav.Link onClick={(e) => triggerNode(e, data.uuid)} data-uuid={data.uuid} eventKey={data.sennet_id}>
                                            {data.sennet_id}*
                                        </Nav.Link>
                                    </Nav.Item>
                                </SenNetPopover>
                            }

                            {/*Create metadata table for ancestors*/}
                            {/*We want to reverse the ordering of this array so that the furthest ancestor is on the left*/}
                            {data.ancestors.reverse().map((ancestor, index, array) => {
                                    // The source nav link
                                    if (equals(ancestor.entity_type, cache.entities.source)) {
                                        if ((ancestor.source_mapped_metadata && Object.keys(ancestor.source_mapped_metadata).length) ||
                                            (ancestor.metadata && Object.keys(ancestor.metadata).length)) {
                                            return (
                                                popoverCommon(index, 'source', ancestor)
                                            )
                                        }
                                        // the sample nav link
                                    } else if (equals(ancestor.entity_type, cache.entities.sample)) {
                                        if (ancestor.metadata && Object.keys(ancestor.metadata).length > 0) {
                                            return (
                                                popoverCommon(index, 'sample', ancestor)
                                            )
                                        }
                                        // The dataset nav link
                                    } else if (equals(ancestor.entity_type, cache.entities.dataset)) {
                                        if (ancestor.metadata && Object.keys(ancestor.metadata).length && 'metadata' in ancestor.metadata) {
                                            return (
                                                popoverCommon(index, 'dataset', ancestor)
                                            )
                                        }
                                    }
                                }
                            )}

                        </Nav>
                        <Tab.Content>
                            {!!(metadata && Object.keys(metadata).length) &&
                                // The metatable table for the current entity
                                <Tab.Pane eventKey={data.sennet_id}>
                                    <MetadataTable metadataKey={""} metadata={metadata}
                                                   filename={data.sennet_id}/>
                                </Tab.Pane>
                            }
                            {data.ancestors.reverse().map((ancestor, index, array) => {
                                // Handle human source table
                                // Human sources have their metadata inside "source_mapped_metadata"
                                if (equals(ancestor.entity_type, cache.entities.source) && equals(ancestor.source_type, cache.sourceTypes.Human)) {
                                    if (ancestor.source_mapped_metadata && Object.keys(ancestor.source_mapped_metadata).length) {
                                        return (
                                            tabPaneCommon('0', index, ancestor, ancestor.source_mapped_metadata)
                                        )
                                    }
                                } else if (!equals(ancestor.entity_type, cache.entities.dataset) && ancestor.metadata && Object.keys(ancestor.metadata).length > 0) {
                                    // Handle mouse source and sample table
                                    // Mice sources and all samples have their metadata inside "metadata"
                                    return (
                                        tabPaneCommon('1', index, ancestor, ancestor.metadata)
                                    )
                                } else if (ancestor.metadata && Object.keys(ancestor.metadata).length && 'metadata' in ancestor.metadata) {
                                    // Handle dataset table
                                    // Datasets have their metadata inside "metadata.metadata"
                                    return (
                                        tabPaneCommon('2', index, ancestor, ancestor.metadata.metadata)
                                    )
                                }
                            })}
                        </Tab.Content>
                    </Tab.Container>
                ) :
                (
                    <MetadataTable metadata={metadata} metadataKey="" filename={data.sennet_id}/>
                )
            }

        </SenNetAccordion>
    )
}

Metadata.propTypes = {
    data: PropTypes.object.isRequired,
    metadata: PropTypes.object,
    hasLineageMetadata: PropTypes.bool
}

export default Metadata
