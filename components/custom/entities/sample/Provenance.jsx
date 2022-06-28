import React from 'react';
import {Container, Row, Col, Tab, Tabs} from 'react-bootstrap';

export default class Provenance extends React.Component {
    render() {
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
                            <Container>
                                <Row>
                                    <Col>
                                        <h4>Sources</h4>
                                    </Col>
                                    <Col>
                                        <h4>Samples</h4>
                                    </Col>
                                    <Col>
                                        <h4>Datasets</h4>
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