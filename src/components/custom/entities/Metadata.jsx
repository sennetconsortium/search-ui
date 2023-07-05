import React, {useContext} from "react";
import SenNetPopover from "../../SenNetPopover";
import {displayBodyHeader, equals} from "../js/functions";
import SenNetAccordion from "../layout/SenNetAccordion";
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import AppContext from "../../../context/AppContext";
import MetadataTable from "./MetadataTable";
import PropTypes from "prop-types";

function Metadata({data, metadata, hasLineageMetadata = false}) {
    const {cache} = useContext(AppContext)

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
                                        <Nav.Link eventKey={data.sennet_id}>
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
                                                <SenNetPopover className={`${index}-source-metadata`}
                                                    text={<>View the metadata for the ancestor <code>Source</code> of this
                                                        entity.</>}>
                                                    <Nav.Item>
                                                        <Nav.Link eventKey={ancestor.sennet_id}
                                                                  bsPrefix="btn btn-source rounded-0">{ancestor.sennet_id}</Nav.Link>
                                                    </Nav.Item>
                                                </SenNetPopover>
                                            )
                                        }
                                        // the sample nav link
                                    } else if (equals(ancestor.entity_type, cache.entities.sample)) {
                                        if (ancestor.metadata && Object.keys(ancestor.metadata).length > 0) {
                                            return (
                                                <SenNetPopover className={`${index}-sample-metadata`}
                                                    text={<>View the metadata for the ancestor <code>Sample</code> of this
                                                        entity.</>}>
                                                    <Nav.Item>
                                                        <Nav.Link eventKey={ancestor.sennet_id}
                                                                  bsPrefix="btn btn-sample rounded-0">
                                                            {ancestor.sennet_id}</Nav.Link>
                                                    </Nav.Item>
                                                </SenNetPopover>
                                            )
                                        }
                                        // The dataset nav link
                                    } else if (equals(ancestor.entity_type, cache.entities.dataset)) {
                                        if (ancestor.metadata && Object.keys(ancestor.metadata).length && 'metadata' in ancestor.metadata) {
                                            return (
                                                <SenNetPopover className={`${index}-dataset-metadata`}
                                                               text={<>View the metadata for the
                                                                   ancestor <code>Dataset</code> of this entity.</>}>
                                                    <Nav.Item>
                                                        <Nav.Link eventKey={ancestor.sennet_id}
                                                                  bsPrefix="btn btn-dataset rounded-0">
                                                            {ancestor.sennet_id}</Nav.Link>
                                                    </Nav.Item>
                                                </SenNetPopover>
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
                                            <Tab.Pane eventKey={ancestor.sennet_id}>
                                                <MetadataTable metadataKey={""} data={ancestor}
                                                               metadata={ancestor.source_mapped_metadata}
                                                               filename={ancestor.sennet_id}/>
                                            </Tab.Pane>
                                        )
                                    }
                                } else if (!equals(ancestor.entity_type, cache.entities.dataset) && ancestor.metadata && Object.keys(ancestor.metadata).length > 0) {
                                    // Handle mouse source and sample table
                                    // Mice sources and all samples have their metadata inside "metadata"
                                    return (
                                        <Tab.Pane eventKey={ancestor.sennet_id}>
                                            <MetadataTable metadataKey={""} data={ancestor}
                                                           metadata={ancestor.metadata}
                                                           filename={ancestor.sennet_id}/>
                                        </Tab.Pane>
                                    )
                                } else if (ancestor.metadata && Object.keys(ancestor.metadata).length && 'metadata' in ancestor.metadata) {
                                    // Handle dataset table
                                    // Datasets have their metadata inside "metadata.metadata"
                                    return (
                                        <Tab.Pane eventKey={ancestor.sennet_id}>
                                            <MetadataTable metadataKey={""} data={ancestor}
                                                           metadata={ancestor.metadata.metadata}
                                                           filename={ancestor.sennet_id}/>
                                        </Tab.Pane>
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
