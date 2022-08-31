import React from 'react';
import {Col, Container, Row, Tab, Tabs} from 'react-bootstrap';
import ProvenanceItem from "./ProvenanceItem";

export default class Provenance extends React.Component {
    render() {
        let sources_count = 0;
        let sample_count = 0;
        return (
            <li className="sui-result">
                <div className="sui-result__header" id="Provenance">
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
                                        {this.props.data.ancestors.map((ancestor_data, index) => {
                                            if (ancestor_data.entity_type === 'Source') {
                                                return (
                                                    <ProvenanceItem key={"sample_" + sources_count}
                                                                    ancestor_uuid={ancestor_data.uuid}
                                                                    data={this.props.data}
                                                                    entity_count={sources_count++}/>
                                                )
                                            }
                                        })}
                                         {this.props.data.entity_type === 'Source' &&
                                            <ProvenanceItem ancestor_uuid={this.props.data.uuid}
                                                            data={this.props.data}
                                                            entity_count={sample_count} bg="light"/>
                                        }

                                    </Col>
                                    <Col>
                                        <h4>Samples</h4>
                                        {this.props.data.ancestors.map((ancestor_data) => {
                                            if (ancestor_data.entity_type === 'Sample') {
                                                return (
                                                    <ProvenanceItem key={"sample_" + sample_count}
                                                                    ancestor_uuid={ancestor_data.uuid}
                                                                    data={this.props.data}
                                                                    entity_count={sample_count++}/>
                                                )
                                            }
                                        })}
                                        {this.props.data.entity_type === 'Sample' &&
                                            <ProvenanceItem ancestor_uuid={this.props.data.uuid}
                                                            data={this.props.data}
                                                            entity_count={sample_count} bg="light"/>
                                        }

                                    </Col>
                                    <Col>
                                        <h4>Datasets</h4>
                                        {this.props.data.entity_type === 'Dataset' &&
                                            <ProvenanceItem ancestor_uuid={this.props.data.uuid}
                                                            data={this.props.data}
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
}