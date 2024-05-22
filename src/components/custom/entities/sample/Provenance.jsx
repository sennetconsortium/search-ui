import React from 'react';
import {Col, Container, Row, Tab, Tabs} from 'react-bootstrap';
import ProvenanceItem from "./ProvenanceItem";

const Provenance = ({ data }) => {

    let sources_count = 0;
    let sample_count = 0;
    return (
        <li className="sui-result" id="Provenance">
            <div className="sui-result__header">
                <span className="sui-result__title">Provenance</span>
            </div>
            <div className="card-body">
                <Tabs
                    defaultActiveKey="table"
                    transition={false}
                    id="provenance-tab"
                >
                    <Tab eventKey="table" title="Table">
                        <Container className="mt-3">
                            <Row>
                                <Col>
                                    <h4>Sources</h4>
                                    {data.ancestors.map((ancestor_data, index) => {
                                        if (ancestor_data.entity_type === 'Source') {
                                            return (
                                                <ProvenanceItem key={"sample_" + sources_count}
                                                                ancestor_uuid={ancestor_data.uuid}
                                                                data={data}
                                                                entity_count={sources_count++}/>
                                            )
                                        }
                                    })}
                                    {data.entity_type === 'Source' &&
                                        <ProvenanceItem ancestor_uuid={data.uuid}
                                                        data={data}
                                                        entity_count={sample_count} bg="light"/>
                                    }

                                </Col>
                                <Col>
                                    <h4>Samples</h4>
                                    {data.ancestors.map((ancestor_data) => {
                                        if (ancestor_data.entity_type === 'Sample') {
                                            return (
                                                <ProvenanceItem key={"sample_" + sample_count}
                                                                ancestor_uuid={ancestor_data.uuid}
                                                                data={data}
                                                                entity_count={sample_count++}/>
                                            )
                                        }
                                    })}
                                    {data.entity_type === 'Sample' &&
                                        <ProvenanceItem ancestor_uuid={data.uuid}
                                                        data={data}
                                                        entity_count={sample_count} bg="light"/>
                                    }

                                </Col>
                                <Col>
                                    <h4>Datasets</h4>
                                    {data.entity_type === 'Dataset' &&
                                        <ProvenanceItem ancestor_uuid={data.uuid}
                                                        data={data}
                                                        bg="light"/>
                                    }
                                </Col>
                            </Row>

                        </Container>
                    </Tab>
                    <Tab eventKey="graph" title="Graph">
                    </Tab>
                </Tabs>
            </div>
        </li>
    )
}

export default Provenance